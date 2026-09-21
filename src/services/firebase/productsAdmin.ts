import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getFirebaseStorage } from './config';
import { resizeAndConvertToWebP } from '../../lib/imageProcessing';
import { fetchAllProducts, upsertProduct } from './products';

// ============================================================
// Admin-only, Storage-touching product functions — বিচ্ছিন্ন রাখা হয়েছে products.ts
// থেকে ইচ্ছাকৃতভাবে। products.ts-এ আগে এই ফাংশনগুলোও ছিল, ফলে 'firebase/storage'
// (ref/uploadBytes/getDownloadURL) সেই একই ফাইলে top-level import হিসেবে থাকত —
// আর যেহেতু Home.tsx (public) ওই ফাইল থেকেই fetchActiveProducts ইম্পোর্ট করে,
// bundler পুরো ফাইলটাই (Storage SDK-সহ) public/eager চাংকে (config-*.js) টেনে
// আনত, যদিও public ভিজিটররা কখনো uploadProductImage() কল করে না। এই ফাইল আলাদা
// থাকায় শুধু admin পেজ (ProductForm.tsx, Products.tsx — যেগুলো নিজেরাই lazy-loaded)
// এই import টানে, public bundle-এ Storage SDK আর ঢোকে না।
// ============================================================

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
  const storage = await getFirebaseStorage();
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, processed);
  return getDownloadURL(snapshot.ref);
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
  const storage = await getFirebaseStorage();
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

// ============================================================
// Admin-এর সাথে আলোচনা করে ঠিক করা "Specifications" ফিল্ডের স্ট্যান্ডার্ড ক্রম — identity
// (Brand/Product Type) → material/appearance (Material/Color/Shape/Design/Style) →
// construction (Weave/Pattern) → size (Size/Dimensions/Weight) → quantity (Set/Pieces) →
// hardware (Handles/Closure/Mounting) → care → usage (Suitable For/Perfect For) → MOQ
// সবার শেষে (এটা প্রোডাক্টের বর্ণনা না, অর্ডারের শর্ত)। বিভিন্ন প্রোডাক্টে একই ধরনের
// ফিল্ডের নাম একটু আলাদা আলাদা টাইপ হয়েছে (যেমন "Recommended Use" বনাম "Recommended
// Uses") — তাই প্রতিটা variant আলাদা এন্ট্রি হিসেবে (একই জায়গায়) রাখা হয়েছে, ফাজি
// ম্যাচিং না করে exact match করা হয় যাতে ভুলবশত ভিন্ন জিনিস এক করে না ফেলে।
export const CANONICAL_SPEC_ORDER = [
  'Brand', 'Product Type',
  'Material', 'Color', 'Primary Color', 'Shape', 'Design', 'Design Style', 'Style', 'Theme',
  'Construction', 'Craftsmanship', 'Production Technique', 'Handmade', 'Weave', 'Weave Type',
  'Pattern', 'Pattern/Texture', 'Fiber', 'Structure',
  'Size', 'Available Sizes', 'Available Size Options', 'Placemat Size', 'Napkin Ring Size',
  'Dimensions', 'Metric Dimensions', 'Overall Listed Dimensions', 'Diameter', 'Height', 'Thickness',
  'Weight', 'Listed Weight', 'Weight per Piece',
  'Capacity', 'Number of Baskets', 'Set', 'Set Includes', 'Set Size', 'Set Quantity',
  'Number of Bags', 'Package Includes', 'Included Components', 'Included Component',
  'Pieces', 'Piece Count', 'Total Pieces', 'Quantity', 'Compartments', 'Number of Compartments',
  'Finish', 'Handles', 'Handle', 'Handle Material', 'Closure', 'Closure Type', 'Lid', 'Lid/Closure',
  'Mounting', 'Mounting Type', 'Installation',
  'Care', 'Care Instructions', 'Care & Maintenance', 'Water Resistance', 'Heat Resistance',
  'Suitable For', 'Suitable Rooms', 'Suitable Room', 'Suitable Spaces', 'Room Type', 'Perfect For',
  'Use', 'Primary Use', 'Recommended Use', 'Recommended Uses', 'Suggested Uses', 'Specific Uses',
  'Additional Use', 'Indoor/Outdoor', 'Indoor Use', 'Outdoor Use', 'Country of Origin',
  'MOQ',
];

/**
 * একটা প্রোডাক্টের excel_fields key-গুলোকে CANONICAL_SPEC_ORDER অনুযায়ী সাজিয়ে নতুন
 * ক্রম ফেরত দেয় — bulk applyStandardSpecOrder() আর ProductForm.tsx-এর "Sort by
 * Standard Order" বাটন দুটোই এই একই ফাংশন ব্যবহার করে, যাতে দুই জায়গায় লজিক আলাদা
 * হয়ে না যায়। MOQ বিশেষভাবে সবার শেষে রাখা হয় — এমনকি "unmatched" (তালিকায় নেই এমন,
 * প্রোডাক্ট-নির্দিষ্ট) ফিল্ডের পরেও, যাতে ম্যাচ-করা ফিল্ড আগে + unmatched পরে এই সাধারণ
 * নিয়মটা MOQ-কে মাঝামাঝি ঠেলে না দেয়।
 */
export function sortSpecKeys(existingKeys: string[]): string[] {
  const matched = CANONICAL_SPEC_ORDER.filter((k) => k !== 'MOQ' && existingKeys.includes(k));
  const unmatched = existingKeys.filter((k) => k !== 'MOQ' && !CANONICAL_SPEC_ORDER.includes(k));
  return [...matched, ...unmatched, ...(existingKeys.includes('MOQ') ? ['MOQ'] : [])];
}

/**
 * সব প্রোডাক্টের excel_fields-এর key-গুলো sortSpecKeys() দিয়ে সাজিয়ে specOrder হিসেবে
 * সেভ করে দেয় (দেখুন products.ts-এর specOrder কমেন্ট — এটাই আসল display-order-এর
 * সোর্স, excel_fields নিজে Firestore map বলে ক্রম রাখে না)। তালিকায় নেই এমন ফিল্ড
 * (প্রোডাক্ট-নির্দিষ্ট বিশেষ কিছু) প্রতিটা প্রোডাক্টে আগে যে আপেক্ষিক ক্রমে ছিল সেভাবেই
 * শেষে যোগ হয় — কিছু হারায় না, শুধু পরিচিত ফিল্ডগুলো একটা ধারাবাহিক ক্রমে চলে আসে।
 * ইতিমধ্যে সঠিক ক্রমে থাকা প্রোডাক্ট (যেমন Admin আগেই একবার up/down দিয়ে ম্যানুয়ালি
 * ঠিক করেছেন) আবার লেখা হয় না — শুধু যেগুলোর ক্রম পাল্টাবে সেগুলোই সেভ হয়।
 */
export async function applyStandardSpecOrder(
  onProgress?: (done: number, total: number, sku: string) => void,
): Promise<{ productsUpdated: number; productsUnchanged: number }> {
  const products = await fetchAllProducts();
  let productsUpdated = 0;
  let productsUnchanged = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    onProgress?.(i, products.length, product.sku);

    const fields = product.excel_fields || {};
    const existingKeys = Object.keys(fields);
    const newOrder = sortSpecKeys(existingKeys);

    const currentOrder = product.specOrder?.filter((k) => k in fields) || existingKeys;
    const isSame = currentOrder.length === newOrder.length && currentOrder.every((k, idx) => k === newOrder[idx]);
    if (isSame) {
      productsUnchanged += 1;
      continue;
    }

    await upsertProduct({ ...product, specOrder: newOrder });
    productsUpdated += 1;
  }

  onProgress?.(products.length, products.length, '');
  return { productsUpdated, productsUnchanged };
}
