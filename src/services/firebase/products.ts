import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './config';
import staticProducts from '../../data/products.json';

// ============================================================
// Firestore-এ প্রোডাক্ট রাখা হয় 'products' কালেকশনে, প্রতিটা ডকুমেন্টের ID = তার SKU।
// এটাই এখন থেকে প্রোডাক্টের একমাত্র সোর্স অফ ট্রুথ — public পেজ ও admin প্যানেল দুটোই
// এখান থেকেই পড়ে। src/data/products.json শুধু "seed" ডেটা হিসেবে থাকে (প্রথমবার
// Firestore-এ কপি করার জন্য) এবং Firestore এখনো খালি থাকলে সাইট যেন ভাঙা না দেখায়
// তার জন্য একটা fallback হিসেবে ব্যবহৃত হয়।
// ============================================================

const PRODUCTS_COLLECTION = 'products';

export type ProductImage = {
  filename?: string;
  role?: string;
  url: string;
  confidence?: string;
};

export type Product = {
  sku: string;
  name: string;
  category?: string;
  description?: string;
  materialSlugs?: string[]; // structured mapping to src/data/materials.ts slugs — not text matching
  image_folder?: string;
  images: ProductImage[];
  primaryImageUrl?: string; // if unset, images[0] is used
  amazonUrl?: string;
  featured?: boolean;
  active?: boolean; // false = hidden from public site, still editable in admin
  relatedSkus?: string[];
  excel_fields?: Record<string, string>;
  updatedAt?: unknown;
};

/** সব প্রোডাক্ট আনে (admin-এর জন্য — active/inactive সব)। */
export async function fetchAllProducts(): Promise<Product[]> {
  const snap = await getDocs(collection(db, PRODUCTS_COLLECTION));
  return snap.docs.map((d) => d.data() as Product);
}

/** শুধু active প্রোডাক্ট আনে (পাবলিক সাইটের জন্য)। */
export async function fetchActiveProducts(): Promise<Product[]> {
  const q = query(collection(db, PRODUCTS_COLLECTION), where('active', '!=', false));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Product);
}

/** একটা নির্দিষ্ট SKU-র প্রোডাক্ট আনে। */
export async function fetchProduct(sku: string): Promise<Product | null> {
  const ref = doc(db, PRODUCTS_COLLECTION, sku);
  const snap = await getDoc(ref);
  return snap.exists() ? (snap.data() as Product) : null;
}

/** নতুন প্রোডাক্ট তৈরি বা বিদ্যমান প্রোডাক্ট আপডেট করে (SKU document ID হিসেবে ব্যবহৃত হয়)। */
export async function upsertProduct(product: Product): Promise<void> {
  if (!product.sku) throw new Error('Product SKU is required');
  const ref = doc(db, PRODUCTS_COLLECTION, product.sku);
  await setDoc(ref, { ...product, updatedAt: serverTimestamp() }, { merge: true });
}

/** একটা প্রোডাক্ট মুছে ফেলে। */
export async function deleteProduct(sku: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COLLECTION, sku));
}

/**
 * Admin Panel থেকে সরাসরি একটা ইমেজ ফাইল Firebase Storage-এ আপলোড করে এবং তার
 * পাবলিক download URL ফেরত দেয়। এতে Hostinger File Manager-এ ম্যানুয়ালি ফাইল রেখে
 * সেই একই নাম হুবহু আবার টাইপ করে Admin Panel-এ বসানোর দরকার পড়ে না — তাই নাম
 * ভুল/মিসম্যাচ (যেমন 501 বনাম 502) হওয়ার সুযোগ থাকে না।
 *
 * ফাইলগুলো Storage-এ `product-images/{sku}/{timestamp}-{originalFileName}` পাথে
 * সেভ হয় — একই নামের ফাইল দুইবার আপলোড করলেও timestamp-এর কারণে একটা আরেকটাকে
 * ওভাররাইট করবে না।
 */
export async function uploadProductImage(sku: string, file: File): Promise<string> {
  const safeSku = sku.trim() || 'unfiled';
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]+/g, '-');
  const path = `product-images/${safeSku}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

/**
 * এক-বারের জন্য: src/data/products.json-এর বিদ্যমান ৪টা প্রোডাক্ট Firestore-এ কপি করে।
 * ইতিমধ্যে থাকা কোনো ডকুমেন্ট ওভাররাইট করে না (merge করে) — বারবার চাপলেও সমস্যা নেই।
 * Admin Products পেজ থেকে বাটনে ক্লিক করে চালাতে হবে (ব্রাউজারে, Firebase লগইন অবস্থায়)।
 */
export async function seedProductsFromStaticData(): Promise<{ seeded: number }> {
  let seeded = 0;
  for (const raw of staticProducts as any[]) {
    const existing = await fetchProduct(raw.sku);
    if (existing) continue; // ইতিমধ্যে Firestore-এ থাকলে স্কিপ — ওভাররাইট করব না
    const product: Product = {
      sku: raw.sku,
      name: raw.name,
      category: raw.category || 'Placemats',
      materialSlugs: raw.materialSlugs || guessMaterialSlugs(raw),
      image_folder: raw.image_folder,
      images: raw.images || [],
      amazonUrl: raw.amazonUrl || '',
      featured: raw.featured ?? false,
      active: raw.active ?? true,
      relatedSkus: raw.relatedSkus || [],
      excel_fields: raw.excel_fields || {},
    };
    await upsertProduct(product);
    seeded += 1;
  }
  return { seeded };
}

// পুরনো প্রোডাক্টে materialSlugs না থাকলে, ম্যাটেরিয়াল কম্পোজিশন টেক্সট থেকে একটা প্রাথমিক
// অনুমান করা হয় (শুধু সিড করার সময়ের জন্য) — এরপর থেকে সব প্রোডাক্টেই structured
// materialSlugs ব্যবহার করা উচিত, টেক্সট-ম্যাচিং নয়।
function guessMaterialSlugs(raw: any): string[] {
  const text = (raw?.excel_fields?.['Material Composition'] || '').toLowerCase();
  const slugs: string[] = [];
  if (text.includes('jute')) slugs.push('jute');
  if (text.includes('sea-grass') || text.includes('seagrass') || text.includes('sea grass')) slugs.push('seagrass');
  if (text.includes('cotton')) slugs.push('cane-rattan'); // fallback guess only — সঠিক ম্যাপিং admin থেকে ঠিক করে নিতে হবে
  return slugs.length ? slugs : [];
}

/** স্ট্যাটিক fallback ডেটা (Firestore এখনো খালি থাকলে, বা অফলাইন হলে ব্যবহার হয়)। */
export function getStaticFallbackProducts(): Product[] {
  return (staticProducts as any[]).map((raw) => ({
    sku: raw.sku,
    name: raw.name,
    category: raw.category || 'Placemats',
    materialSlugs: raw.materialSlugs || guessMaterialSlugs(raw),
    image_folder: raw.image_folder,
    images: raw.images || [],
    amazonUrl: raw.amazonUrl || '',
    featured: raw.featured ?? false,
    active: raw.active ?? true,
    relatedSkus: raw.relatedSkus || [],
    excel_fields: raw.excel_fields || {},
  }));
}
