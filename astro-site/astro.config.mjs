// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  // Admin Panel থেকে আপলোড করা প্রোডাক্ট/ক্যাটাগরি ছবি Firebase Storage-এ ফুল রেজোলিউশনে
  // থাকে (প্রতিটা ২০০-৪০০KB) — ছোট কার্ড/হিরো স্লটে সরাসরি সেগুলো লোড করায় LCP-র প্রায়
  // পুরোটাই ছিল শুধু ছবি ডাউনলোডের সময়। এই domain authorize করলে বিল্ড-টাইমে Astro
  // (sharp) ছবিগুলো ডাউনলোড করে সঠিক width-এ রিসাইজ ও WebP-তে কনভার্ট করে dist/_astro-তে
  // রাখে (দেখুন src/lib/images.ts) — ভিজিটর নিজের ডোমেইন থেকেই ছোট ফাইল পায়।
  image: {
    remotePatterns: [{ protocol: 'https', hostname: 'firebasestorage.googleapis.com' }],
  },

  vite: {
    plugins: [tailwindcss()]
  }
});
