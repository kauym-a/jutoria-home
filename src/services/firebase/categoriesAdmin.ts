import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from './config';
import { resizeAndConvertToWebP } from '../../lib/imageProcessing';
import { fetchAllCategories, upsertCategory } from './categories';

// ============================================================
// Admin-only, Storage-touching category function — categories.ts থেকে বিচ্ছিন্ন রাখা
// হয়েছে ঠিক productsAdmin.ts-এর মতো একই কারণে (দেখুন সেই ফাইলের কমেন্ট): এই ফাংশনটা
// categories.ts-এ থাকলে 'firebase/storage' import সেই ফাইলে টানত, আর Home.tsx/
// Materials.tsx (public) সেই একই ফাইল থেকে displayNumber/fetchActiveCategories
// ইম্পোর্ট করে বলে পুরো Storage SDK-ই public/eager bundle-এ ঢুকে যেত। এই ফাইল আলাদা
// থাকায় শুধু CategoryForm.tsx (lazy-loaded admin পেজ) এই import টানে।
// ============================================================

const CARD_MAX_DIMENSION = 600; // homepage/Materials গ্রিডের ~280px কার্ডের জন্য যথেষ্ট (2x রেটিনা-সহ)
const CARD_QUALITY = 0.78;

/**
 * Admin Panel থেকে একটা ইমেজ ফাইল আপলোড করলে দুটো ভার্সন Firebase Storage-এ সেভ হয়:
 * বড় "hero" (category.image — /materials/:slug ডিটেইল পেজের 55vh ব্যাকগ্রাউন্ড, 1600px)
 * আর ছোট "card" (category.cardImage — হোমপেজ/Materials গ্রিডের ছোট কার্ড, 600px)।
 * PageSpeed-এ "Improve image delivery" রিগ্রেশনের কারণ ছিল একটাই বড় ছবি দুই জায়গাতেই
 * (হিরো + ছোট কার্ড) সার্ভ হওয়া — product ছবির জন্য যেমন dual-size করা হয়েছিল, এখন
 * category ছবির জন্যও একই প্যাটার্ন।
 */
export async function uploadCategoryImage(slug: string, file: File): Promise<{ image: string; cardImage: string }> {
  const safeSlug = slug.trim() || 'unfiled';
  const storage = await getFirebaseStorage();

  const hero = await resizeAndConvertToWebP(file);
  const heroName = hero.name.replace(/[^a-zA-Z0-9.\-_]+/g, '-');
  const heroPath = `category-images/${safeSlug}/${Date.now()}-${heroName}`;
  const heroSnapshot = await uploadBytes(ref(storage, heroPath), hero);
  const image = await getDownloadURL(heroSnapshot.ref);

  const card = await resizeAndConvertToWebP(file, CARD_MAX_DIMENSION, CARD_QUALITY);
  const cardName = card.name.replace(/[^a-zA-Z0-9.\-_]+/g, '-');
  const cardPath = `category-images/${safeSlug}/${Date.now()}-card-${cardName}`;
  const cardSnapshot = await uploadBytes(ref(storage, cardPath), card);
  const cardImage = await getDownloadURL(cardSnapshot.ref);

  return { image, cardImage };
}

/**
 * এক-বারের মাইগ্রেশন: uploadCategoryImage() dual-size হওয়ার আগে যেসব ক্যাটাগরি ছবি
 * আপলোড হয়েছিল (শুধু বড় hero সাইজে, কোনো cardImage ছাড়াই), সেগুলোর জন্য বিদ্যমান
 * image ডাউনলোড করে ছোট card ভার্সন বানিয়ে নতুন করে আপলোড করে, cardImage হিসেবে সেভ
 * করে দেয়। Admin Categories পেজ থেকে বাটনে ক্লিক করে চালাতে হবে। বারবার চাপলে প্রতিবার
 * বিদ্যমান image থেকে cardImage রিজেনারেট হয় (hero বদলালে card-ও সবসময় তার সাথে সিঙ্কে
 * থাকে) — সাতটা মাত্র ক্যাটাগরি বলে খরচ নগণ্য।
 */
export async function optimizeExistingCategoryImages(
  onProgress?: (done: number, total: number, slug: string) => void,
): Promise<{ categoriesUpdated: number; categoriesSkipped: number; categoriesFailed: number }> {
  const categories = await fetchAllCategories();
  const storage = await getFirebaseStorage();
  let categoriesUpdated = 0;
  let categoriesSkipped = 0;
  // productsAdmin.ts-এর optimizeExistingProductImages()-এ একই ভুল ধরা পড়ার পর এখানেও
  // আলাদা করা হলো — categoriesSkipped শুধু "image field-ই নেই" (স্বাভাবিক) বোঝাবে,
  // আসল fetch/upload ব্যর্থতা categoriesFailed-এ আলাদাভাবে গুনবে।
  let categoriesFailed = 0;

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    onProgress?.(i, categories.length, category.slug);

    if (!category.image) {
      categoriesSkipped += 1;
      continue;
    }
    try {
      const res = await fetch(category.image);
      const blob = await res.blob();
      const originalName = category.image.split('/').pop()?.split('?')[0] || 'image.webp';
      const file = new File([blob], originalName, { type: blob.type || 'image/webp' });
      const card = await resizeAndConvertToWebP(file, CARD_MAX_DIMENSION, CARD_QUALITY);
      const safeSlug = category.slug.trim() || 'unfiled';
      const path = `category-images/${safeSlug}/${Date.now()}-card-${card.name}`;
      const snapshot = await uploadBytes(ref(storage, path), card);
      const cardImage = await getDownloadURL(snapshot.ref);
      await upsertCategory({ ...category, cardImage });
      categoriesUpdated += 1;
    } catch (err) {
      console.error(`Card image optimize failed for ${category.slug}:`, err);
      categoriesFailed += 1;
    }
  }

  onProgress?.(categories.length, categories.length, '');
  return { categoriesUpdated, categoriesSkipped, categoriesFailed };
}
