// @ts-check
import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Firebase Storage-এর ছবি src/lib/images.ts নিজস্ব sharp পাইপলাইনে (স্থায়ী ডিস্ক ক্যাশসহ)
// রিসাইজ করে node_modules/.astro/jutoria-img/-এ রাখে — কেন Astro-র বিল্ট-ইন রিমোট ইমেজ
// সাপোর্ট নয়, সেটা ওই ফাইলের কমেন্টে। এই ইন্টিগ্রেশন বিল্ড শেষে শুধু এই বিল্ডের পেজগুলোতে আসলে
// রেফার হওয়া ফাইলগুলো dist/_img/-এ কপি করে।
/** @type {import('astro').AstroIntegration} */
const jutoriaImageCache = {
  name: 'jutoria-image-cache',
  hooks: {
    'astro:build:done': ({ dir, logger }) => {
      /** @type {Set<string>} */
      const used = /** @type {any} */ (globalThis).__jutoriaUsedImages ?? new Set();
      const cacheDir = path.resolve('node_modules/.astro/jutoria-img');
      const dest = new URL('_img/', dir);
      fs.mkdirSync(dest, { recursive: true });
      for (const name of used) fs.copyFileSync(path.join(cacheDir, name), new URL(name, dest));
      logger.info(`Copied ${used.size} optimized remote images to /_img/`);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [react(), jutoriaImageCache],

  vite: {
    plugins: [tailwindcss()]
  }
});
