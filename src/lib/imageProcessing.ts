// ============================================================
// Admin Panel থেকে আপলোড করা প্রোডাক্ট/ক্যাটাগরি ছবি আগে যেই ফরম্যাটে/সাইজে ছিল (সরাসরি
// অ্যাডমিনের কম্পিউটার থেকে, প্রায়ই ফোন ক্যামেরার বিশাল অসংকুচিত JPG/PNG) সেভাবেই
// হুবহু Firebase Storage-এ uploadBytes() দিয়ে সেভ হতো — কোনো resize/compress/format
// convert ছাড়াই। এটাই সাইটের সবচেয়ে বড় "unoptimized image" সমস্যার আসল উৎস (PageSpeed-এর
// image-delivery অডিটে বারবার ফ্ল্যাগ হওয়া) — /product/:sku পেজগুলোর মূল ছবি (LCP
// এলিমেন্ট) কয়েকশো KB-থেকে কয়েক MB পর্যন্ত PNG হিসেবে সার্ভ হতো।
//
// এই ফাইলটা আপলোডের ঠিক আগে ব্রাউজারেই (Canvas API দিয়ে, কোনো নতুন npm প্যাকেজ ছাড়াই)
// ছবিটা resize + WebP-তে convert করে দেয় — সব আধুনিক ব্রাউজার (Chrome/Edge/Firefox/
// Safari 14+) canvas.toBlob()-এ 'image/webp' সাপোর্ট করে।
// ============================================================

const DEFAULT_MAX_DIMENSION = 1600; // প্রোডাক্ট জুম-ভিউর জন্যও যথেষ্ট, তার বেশি অপ্রয়োজনীয় বাইট
const DEFAULT_QUALITY = 0.82; // visually-lossless কিন্তু ছোট — ছবির ধরন অনুযায়ী সাধারণ 60-80% রেঞ্জ

/**
 * একটা ইমেজ File-কে resize (দীর্ঘতম পাশ সর্বোচ্চ maxDimension) + WebP-তে convert করে
 * নতুন File রিটার্ন করে। মূল ফাইলটা ইতিমধ্যে ছোট/WebP হলে অপ্রয়োজনীয়ভাবে বড় করে না
 * (শুধু সংকুচিত করে, বড় করে না)। ব্যর্থ হলে (পুরনো ব্রাউজার/অচেনা ফরম্যাট) মূল ফাইলটাই
 * ফেরত দেয় — আপলোড কখনো এই ধাপের কারণে সম্পূর্ণ ব্যর্থ হয় না।
 */
export async function resizeAndConvertToWebP(
  file: File,
  maxDimension: number = DEFAULT_MAX_DIMENSION,
  quality: number = DEFAULT_QUALITY,
): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const targetWidth = Math.round(bitmap.width * scale);
    const targetHeight = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob) return file; // এই ব্রাউজার webp এনকোড সাপোর্ট করে না — মূল ফাইলই আপলোড হবে

    const newName = file.name.replace(/\.[^.]+$/, '') + '.webp';
    return new File([blob], newName, { type: 'image/webp' });
  } catch (err) {
    console.error('Image resize/convert failed, uploading original file instead:', err);
    return file;
  }
}
