import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';

// বিল্ড-টাইমে ছবি রিসাইজ + WebP করে। দুই ধরনের সোর্স, দুই আলাদা পাইপলাইন:
//
// ১. Firebase Storage URL (Admin Panel-এ আপলোড করা ছবি, ফুল-সাইজে ২০০-৪০০KB) — নিজস্ব sharp
//    পাইপলাইন + স্থায়ী ডিস্ক ক্যাশ (নিচে)। Astro-র নিজের getImage() রিমোট ছবির জন্য প্রতিটা
//    বিল্ডে প্রতিটা ভ্যারিয়েন্ট Firebase-এ revalidate করত (Firebase `Cache-Control: private,
//    max-age=0` পাঠায়) — ~১২০০ ভ্যারিয়েন্ট × ~১ সেকেন্ড = প্রতি বিল্ডে ১৫+ মিনিট, অথচ Admin
//    থেকে প্রোডাক্ট এডিট করলেই অটো-রিবিল্ড হওয়ার কথা। Firebase ডাউনলোড URL immutable (ফাইলনেমে
//    টাইমস্ট্যাম্প + token — নতুন ছবি মানে নতুন URL), তাই একবার ডাউনলোড/রিসাইজ করা ফাইল
//    চিরকাল সঠিক: পরের বিল্ডগুলোতে এগুলোর জন্য কোনো নেটওয়ার্ক কলই হয় না, শুধু নতুন ছবি প্রসেস
//    হয়। আউটপুট /_img/-এ সার্ভ হয় — astro.config.mjs-এর jutoriaImageCache ইন্টিগ্রেশন বিল্ড
//    শেষে এই বিল্ডে আসলে ব্যবহৃত ফাইলগুলোই dist/_img/-এ কপি করে।
//
// ২. লোকাল পাথ (যেমন '/placemat-product.webp') — Astro public/-এর ছবি প্রসেস করে না, তাই কনটেন্ট
//    ছবির একটা কপি src/assets/site/-এ একই রিলেটিভ পাথে আছে; সেগুলো Astro-র getImage() দিয়েই
//    (কোনো নেটওয়ার্ক নেই, Astro নিজে ক্যাশ করে)। public/-এর মূল ফাইলও থাকছে (OG ইমেজ,
//    JSON-LD লোগো ইত্যাদি ফিক্সড absolute URL); একই কনটেন্ট হওয়ায় git একবারই স্টোর করে।
//
// কোনো ছবি প্রসেস করতে ব্যর্থ হলে মূল পাথ/URL-ই ফেরত যায় — একটা ছবির জন্য বিল্ড ফেল করবে না।
export type OptimizedImage = { src: string; srcset?: string };

export const REMOTE_CACHE_DIR = path.resolve('node_modules/.astro/jutoria-img');
const ORIGINALS_DIR = path.join(REMOTE_CACHE_DIR, 'originals');
const DIMS_FILE = path.join(REMOTE_CACHE_DIR, 'dims.json');
const DEFAULT_QUALITY = 80;

// এই বিল্ডে যেসব /_img/ ফাইল রেফার হয়েছে — astro.config.mjs-এর ইন্টিগ্রেশন শুধু এগুলোই কপি
// করে (ক্যাশে মুছে ফেলা প্রোডাক্টের পুরনো ফাইল থাকলেও সেগুলো আর ডিপ্লয় হয় না)। পেজ রেন্ডার আর
// ইন্টিগ্রেশন হুক একই Node প্রসেসে চলে, কিন্তু আলাদা মডিউল ইনস্ট্যান্সে — তাই globalThis।
const usedFiles: Set<string> = ((globalThis as any).__jutoriaUsedImages ??= new Set<string>());

type Dims = { width: number; height: number };
const dims: Record<string, Dims> = (() => {
  try {
    return JSON.parse(fs.readFileSync(DIMS_FILE, 'utf8'));
  } catch {
    return {};
  }
})();
const inflight = new Map<string, Promise<unknown>>();

function once<T>(key: string, work: () => Promise<T>): Promise<T> {
  let p = inflight.get(key) as Promise<T> | undefined;
  if (!p) {
    p = work().finally(() => inflight.delete(key));
    inflight.set(key, p);
  }
  return p;
}

const hashOf = (url: string) => crypto.createHash('sha1').update(url).digest('hex').slice(0, 20);

function loadOriginal(url: string, key: string): Promise<Buffer> {
  const file = path.join(ORIGINALS_DIR, key);
  return once(`orig:${key}`, async () => {
    if (fs.existsSync(file)) return fs.readFileSync(file);
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
    fs.writeFileSync(file, buf);
    return buf;
  });
}

async function optimizeRemote(url: string, widths: number[], quality: number): Promise<OptimizedImage> {
  const key = hashOf(url);
  if (!dims[key]) {
    const meta = await sharp(await loadOriginal(url, key)).metadata();
    dims[key] = { width: meta.width!, height: meta.height! };
    fs.mkdirSync(REMOTE_CACHE_DIR, { recursive: true });
    fs.writeFileSync(DIMS_FILE, JSON.stringify(dims));
  }
  // মূল ছবির চেয়ে বড় width চাইলে আপস্কেল হতো — বাদ; সব বড় হলে মূল width একটাই।
  const usable = widths.filter((w) => w <= dims[key].width);
  const targets = usable.length ? usable : [dims[key].width];

  // ডিফল্ট কোয়ালিটির ফাইলনেম আগের মতোই (ক্যাশ অপরিবর্তিত); অন্য কোয়ালিটিতে আলাদা নাম।
  const nameFor = (w: number) => `${key}-${w}${quality === DEFAULT_QUALITY ? '' : `-q${quality}`}.webp`;

  await Promise.all(
    targets.map((w) => {
      const name = nameFor(w);
      const out = path.join(REMOTE_CACHE_DIR, name);
      return once(`out:${name}`, async () => {
        if (!fs.existsSync(out)) {
          await sharp(await loadOriginal(url, key)).resize({ width: w }).webp({ quality }).toFile(out);
        }
        usedFiles.add(name);
      });
    }),
  );

  const urlFor = (w: number) => `/_img/${nameFor(w)}`;
  return {
    src: urlFor(targets[targets.length - 1]),
    srcset: targets.length > 1 ? targets.map((w) => `${urlFor(w)} ${w}w`).join(', ') : undefined,
  };
}

const localImages = import.meta.glob<ImageMetadata>('/src/assets/site/**/*.{webp,png,jpg,jpeg}', {
  import: 'default',
});

// quality: ডিফল্ট ৮০ (প্রোডাক্ট ছবি — ক্রেতারা খুঁটিয়ে দেখেন)। গ্রেডিয়েন্ট ওভারলের নিচের ফুল-ব্লিড হিরো
// ছবিতে ৬৫ ব্যবহার হয় — দৃশ্যত পার্থক্য নেই, কিন্তু ফাইল ~২৫% ছোট (LCP ছবি)।
export async function optimizeImage(
  url: string | null | undefined,
  widths: number[],
  quality = DEFAULT_QUALITY,
): Promise<OptimizedImage | null> {
  if (!url) return null;
  try {
    if (/^https?:\/\//i.test(url)) {
      // dev সার্ভারে /_img/ সার্ভ হয় না (কপিটা শুধু বিল্ডের শেষে হয়) — মূল URL-ই যথেষ্ট।
      return import.meta.env.DEV ? { src: url } : await optimizeRemote(url, widths, quality);
    }
    const loadLocal = localImages[`/src/assets/site${url.split('?')[0]}`];
    if (!loadLocal) return { src: url };
    const img = await getImage({ src: await loadLocal(), width: widths[widths.length - 1], widths, format: 'webp', quality });
    return { src: img.src, srcset: img.srcSet.attribute || undefined };
  } catch (err) {
    console.warn(`[build] Image optimization failed, using original: ${url}`, err);
    return { src: url };
  }
}
