import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';
import { resizeAndConvertToWebP } from '../../lib/imageProcessing';

// ============================================================
// Admin-only, Storage-touching category function — categories.ts থেকে বিচ্ছিন্ন রাখা
// হয়েছে ঠিক productsAdmin.ts-এর মতো একই কারণে (দেখুন সেই ফাইলের কমেন্ট): এই ফাংশনটা
// categories.ts-এ থাকলে 'firebase/storage' import সেই ফাইলে টানত, আর Home.tsx/
// Materials.tsx (public) সেই একই ফাইল থেকে displayNumber/fetchActiveCategories
// ইম্পোর্ট করে বলে পুরো Storage SDK-ই public/eager bundle-এ ঢুকে যেত। এই ফাইল আলাদা
// থাকায় শুধু CategoryForm.tsx (lazy-loaded admin পেজ) এই import টানে।
// ============================================================

/**
 * Admin Panel থেকে সরাসরি একটা ইমেজ ফাইল Firebase Storage-এ আপলোড করে এবং তার
 * পাবলিক download URL ফেরত দেয় — product ইমেজের মতো একই প্যাটার্ন।
 * ফাইল Storage-এ `category-images/{slug}/{timestamp}-{originalFileName}` পাথে সেভ হয়।
 */
export async function uploadCategoryImage(slug: string, file: File): Promise<string> {
  const processed = await resizeAndConvertToWebP(file);
  const safeSlug = slug.trim() || 'unfiled';
  const safeName = processed.name.replace(/[^a-zA-Z0-9.\-_]+/g, '-');
  const path = `category-images/${safeSlug}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, processed);
  return getDownloadURL(snapshot.ref);
}
