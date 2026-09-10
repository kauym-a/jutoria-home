import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import { materials } from '../../data/materials';

// ============================================================
// Firestore-এ ক্যাটাগরি রাখা হয় 'categories' কালেকশনে, প্রতিটা ডকুমেন্টের ID = তার slug।
// এটাই এখন থেকে হোমপেজের "Our Materials" গ্রিড, /materials ও /materials/:slug পেজের
// একমাত্র সোর্স অফ ট্রুথ। src/data/materials.ts শুধু "seed" ডেটা হিসেবে থাকে (প্রথমবার
// Firestore-এ কপি করার জন্য) এবং Firestore এখনো খালি থাকলে সাইট যেন ভাঙা না দেখায়
// তার জন্য fallback হিসেবে ব্যবহৃত হয়।
//
// NOTE: কোডবেসে আলাদা একটা src/data/categories.ts (product types — Placemats,
// Planter Baskets…) আছে যা /categories পেজ চালায় — সেটা সম্পূর্ণ ভিন্ন জিনিস,
// এই কালেকশনের সাথে সম্পর্ক নেই।
// ============================================================

const CATEGORIES_COLLECTION = 'categories';

export type Category = {
  slug: string; // Firestore document ID
  name: string;
  desc: string; // short — কার্ডে দেখায়
  longDesc: string; // বিস্তারিত — /materials/:slug পেজে দেখায়
  image: string; // কার্ড/হিরো ব্যাকগ্রাউন্ড
  order: number; // পজিশন (ছোট আগে)
  active: boolean; // false = সাইট থেকে লুকানো, admin-এ এখনো এডিটযোগ্য
  updatedAt?: unknown;
};

const byOrder = (a: Category, b: Category) => (a.order ?? 0) - (b.order ?? 0);

/** সব ক্যাটাগরি আনে (admin-এর জন্য — active/inactive সব), order অনুসারে সাজানো। */
export async function fetchAllCategories(): Promise<Category[]> {
  const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
  return snap.docs.map((d) => d.data() as Category).sort(byOrder);
}

/** শুধু active ক্যাটাগরি আনে (পাবলিক সাইটের জন্য), order অনুসারে সাজানো। */
export async function fetchActiveCategories(): Promise<Category[]> {
  const snap = await getDocs(collection(db, CATEGORIES_COLLECTION));
  return snap.docs
    .map((d) => d.data() as Category)
    .filter((c) => c.active !== false)
    .sort(byOrder);
}

/** একটা নির্দিষ্ট slug-এর ক্যাটাগরি আনে। */
export async function fetchCategory(slug: string): Promise<Category | null> {
  const snap = await getDoc(doc(db, CATEGORIES_COLLECTION, slug));
  return snap.exists() ? (snap.data() as Category) : null;
}

/** নতুন ক্যাটাগরি তৈরি বা বিদ্যমান ক্যাটাগরি আপডেট করে (slug document ID হিসেবে ব্যবহৃত হয়)। */
export async function upsertCategory(category: Category): Promise<void> {
  if (!category.slug) throw new Error('Category slug is required');
  const ref = doc(db, CATEGORIES_COLLECTION, category.slug);
  await setDoc(ref, { ...category, updatedAt: serverTimestamp() }, { merge: true });
}

/** একটা ক্যাটাগরি মুছে ফেলে। */
export async function deleteCategory(slug: string): Promise<void> {
  await deleteDoc(doc(db, CATEGORIES_COLLECTION, slug));
}

/**
 * Admin Panel থেকে সরাসরি একটা ইমেজ ফাইল Firebase Storage-এ আপলোড করে এবং তার
 * পাবলিক download URL ফেরত দেয় — product ইমেজের মতো একই প্যাটার্ন।
 * ফাইল Storage-এ `category-images/{slug}/{timestamp}-{originalFileName}` পাথে সেভ হয়।
 */
export async function uploadCategoryImage(slug: string, file: File): Promise<string> {
  const safeSlug = slug.trim() || 'unfiled';
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]+/g, '-');
  const path = `category-images/${safeSlug}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

/**
 * এক-বারের জন্য: src/data/materials.ts-এর বিদ্যমান ৭টা আইটেম Firestore-এ কপি করে।
 * ইতিমধ্যে থাকা কোনো ডকুমেন্ট ওভাররাইট করে না — বারবার চাপলেও সমস্যা নেই।
 * Admin Categories পেজ থেকে বাটনে ক্লিক করে চালাতে হবে (ব্রাউজারে, Firebase লগইন অবস্থায়)।
 */
export async function seedCategoriesFromStaticData(): Promise<{ seeded: number }> {
  let seeded = 0;
  for (const m of materials) {
    const existing = await fetchCategory(m.slug);
    if (existing) continue; // ইতিমধ্যে Firestore-এ থাকলে স্কিপ
    await upsertCategory({
      slug: m.slug,
      name: m.name,
      desc: m.desc,
      longDesc: m.longDesc,
      image: m.image,
      order: Number(m.id) || seeded + 1,
      active: true,
    });
    seeded += 1;
  }
  return { seeded };
}

/** স্ট্যাটিক fallback ডেটা (Firestore এখনো খালি থাকলে, বা অফলাইন হলে ব্যবহার হয়)। */
export function getStaticFallbackCategories(): Category[] {
  return materials
    .map((m, i) => ({
      slug: m.slug,
      name: m.name,
      desc: m.desc,
      longDesc: m.longDesc,
      image: m.image,
      order: Number(m.id) || i + 1,
      active: true,
    }))
    .sort(byOrder);
}

/** order থেকে "01", "02"… প্যাডেড ডিসপ্লে নম্বর। */
export function displayNumber(order: number): string {
  return String(order ?? 0).padStart(2, '0');
}
