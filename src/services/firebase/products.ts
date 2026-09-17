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
import { resizeAndConvertToWebP } from '../../lib/imageProcessing';
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
  // আপলোডের আগেই ব্রাউজারে resize + WebP কনভার্ট (দেখুন lib/imageProcessing.ts) — আগে
  // অ্যাডমিনের আসল ফাইল (প্রায়ই কয়েক MB-র অসংকুচিত JPG/PNG) হুবহু আপলোড হতো, যেটা
  // /product/:sku পেজের LCP ছবি হিসেবে সার্ভ হতো।
  const processed = await resizeAndConvertToWebP(file);
  const safeSku = sku.trim() || 'unfiled';
  const safeName = processed.name.replace(/[^a-zA-Z0-9.\-_]+/g, '-');
  const path = `product-images/${safeSku}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, processed);
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

/**
 * এক-বারের মাইগ্রেশন: uploadProductImage() ফিক্স হওয়ার আগে যেসব প্রোডাক্ট ইমেজ আপলোড
 * হয়েছিল (Firebase Storage-এ, অ্যাডমিনের আসল অসংকুচিত PNG/JPG হিসেবে, কোনো resize/
 * convert ছাড়াই), সেগুলো এখন ডাউনলোড করে resizeAndConvertToWebP() দিয়ে প্রসেস করে নতুন
 * ছোট WebP হিসেবে আবার আপলোড করে, Firestore-এর images[].url আপডেট করে দেয়। প্রতিটা
 * প্রোডাক্ট আলাদাভাবে সেভ হয় — মাঝপথে থেমে গেলেও ইতিমধ্যে প্রসেস হওয়া প্রোডাক্টগুলো
 * নষ্ট হয় না, পরে আবার চালালে বাকিগুলো (যেগুলো ইতিমধ্যে .webp) স্কিপ হয়ে যায়।
 *
 * static path (/product-master/...) দিয়ে শুরু হওয়া URL touch করা হয় না — সেগুলো
 * রিপোর ভেতরের ফাইল, Firebase Storage-এ থাকে না, আলাদাভাবে অপ্টিমাইজ করতে হয় (দেখুন
 * scripts-এ চলা image-optimization পাসগুলো)।
 */
export async function optimizeExistingProductImages(
  onProgress?: (done: number, total: number, sku: string) => void,
): Promise<{ productsUpdated: number; imagesConverted: number; imagesSkipped: number; bytesBefore: number; bytesAfter: number }> {
  const products = await fetchAllProducts();
  let productsUpdated = 0;
  let imagesConverted = 0;
  let imagesSkipped = 0;
  let bytesBefore = 0;
  let bytesAfter = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    onProgress?.(i, products.length, product.sku);
    let changed = false;

    const newImages = await Promise.all(
      (product.images || []).map(async (img) => {
        // ইতিমধ্যে .webp (নতুন পাইপলাইনে আপলোড হওয়া, বা আগেই অপ্টিমাইজড) বা static
        // /product-master/ পাথ হলে স্কিপ — শুধু Firebase Storage-এর অ-webp ফাইলগুলোই টার্গেট
        if (!img.url.includes('firebasestorage.googleapis.com') || /\.webp(\?|$)/i.test(img.url)) {
          imagesSkipped += 1;
          return img;
        }
        try {
          const res = await fetch(img.url);
          const blob = await res.blob();
          bytesBefore += blob.size;
          const originalName = img.filename || 'image.jpg';
          const file = new File([blob], originalName, { type: blob.type || 'image/jpeg' });
          const processed = await resizeAndConvertToWebP(file);
          bytesAfter += processed.size;
          const path = `product-images/${product.sku}/${Date.now()}-${processed.name}`;
          const storageRef = ref(storage, path);
          const snapshot = await uploadBytes(storageRef, processed);
          const newUrl = await getDownloadURL(snapshot.ref);
          imagesConverted += 1;
          changed = true;
          return { ...img, url: newUrl, filename: processed.name };
        } catch (err) {
          console.error(`Image optimize failed for ${product.sku} (${img.url}):`, err);
          imagesSkipped += 1;
          return img;
        }
      }),
    );

    if (changed) {
      await upsertProduct({ ...product, images: newImages });
      productsUpdated += 1;
    }
  }

  onProgress?.(products.length, products.length, '');
  return { productsUpdated, imagesConverted, imagesSkipped, bytesBefore, bytesAfter };
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
