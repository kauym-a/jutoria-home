import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

// বিল্ড-টাইমে ছবি রিসাইজ + WebP করে dist/_astro-তে রাখে। দুই ধরনের সোর্স:
//
// ১. Firebase Storage URL (Admin Panel-এ আপলোড করা প্রোডাক্ট/ক্যাটাগরি ছবি, ফুল-সাইজে
//    ২০০-৪০০KB) — astro.config.mjs-এর image.remotePatterns দিয়ে authorize করা।
// ২. লোকাল পাথ (যেমন '/placemat-product.webp', data/categories.ts-এর কিউরেটেড ছবি) —
//    Astro public/ ফোল্ডারের ছবি প্রসেস করতে পারে না, তাই কনটেন্ট ছবিগুলোর একটা কপি
//    src/assets/site/-এ একই রিলেটিভ পাথে রাখা আছে; '/x.webp' → src/assets/site/x.webp
//    ম্যাপ করে অপ্টিমাইজ করা হয়। (public/-এর মূল ফাইলগুলোও থাকছে — OG ইমেজ, JSON-LD
//    লোগো ইত্যাদি ফিক্সড absolute URL-এ সেগুলো রেফার করে। একই কনটেন্টের ফাইল হওয়ায় git
//    এগুলো একবারই স্টোর করে।)
//
// src/assets/site-এ ম্যাচ না পেলে, বা Firebase থেকে আনতে ব্যর্থ হলে, মূল পাথ/URL-ই ফেরত
// যায় — একটা ছবির জন্য পুরো বিল্ড ফেল করবে না।
export type OptimizedImage = { src: string; srcset?: string };

// eager নয়, lazy — eager glob প্রতিটা ছবির মূল ফাইল dist/_astro-তে emit করত, কোনো পেজে
// ব্যবহার না হলেও (~১১MB অকারণ FTP আপলোড)। lazy হলে শুধু যেগুলো আসলে ব্যবহার হয় সেগুলোই।
const localImages = import.meta.glob<ImageMetadata>('/src/assets/site/**/*.{webp,png,jpg,jpeg}', {
  import: 'default',
});

export async function optimizeImage(url: string | null | undefined, widths: number[]): Promise<OptimizedImage | null> {
  if (!url) return null;
  const isRemote = /^https?:\/\//i.test(url);
  const loadLocal = isRemote ? undefined : localImages[`/src/assets/site${url.split('?')[0]}`];
  const src = isRemote ? url : loadLocal ? await loadLocal() : undefined;
  if (!src) return { src: url };
  try {
    const img = await getImage({
      src,
      ...(isRemote ? { inferSize: true } : {}),
      width: widths[widths.length - 1],
      widths,
      format: 'webp',
    });
    return { src: img.src, srcset: img.srcSet.attribute || undefined };
  } catch (err) {
    console.warn(`[build] Image optimization failed, using original: ${url}`, err);
    return { src: url };
  }
}
