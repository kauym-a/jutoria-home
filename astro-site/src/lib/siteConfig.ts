// ============================================================
// সাইট-জুড়ে ব্যবহৃত সোশ্যাল প্রোফাইল ও মার্কেটিং ট্যাগের একক উৎস (single source of truth)।
// আগে এই লিংকগুলো PublicLayout.astro (ফুটার) আর seo.ts (Organization JSON-LD sameAs)
// দুই জায়গায় আলাদাভাবে লেখা ছিল — ফলে Instagram-এর ভুল হ্যান্ডেল (jutoria.home, আসলটা
// jutoriahome) দুই জায়গাতেই থেকে গিয়েছিল। এখন দুটোই এখান থেকে পড়ে।
//
// নিয়ম: কোনো প্ল্যাটফর্মের অ্যাকাউন্ট এখনো তৈরি না হলে href খালি ('') রাখুন — তাহলে
// ফুটার আইকন আর JSON-LD দুটো থেকেই সেটা নিজে থেকে বাদ পড়বে (ভিজিটর কোনো "Page not
// found"-এ যাবে না)। অ্যাকাউন্ট খোলার পর শুধু URL বসালেই সব জায়গায় চলে আসবে।
// ============================================================

export type SocialPlatform = 'facebook' | 'instagram' | 'threads' | 'tiktok' | 'youtube' | 'pinterest' | 'linkedin' | 'x';

export const SOCIAL_PROFILES: { name: string; platform: SocialPlatform; href: string }[] = [
  { name: 'Facebook', platform: 'facebook', href: 'https://www.facebook.com/jutoriahome' },
  { name: 'Instagram', platform: 'instagram', href: 'https://www.instagram.com/jutoriahome' },
  // Threads লগইন ছাড়া প্রোফাইল দেখায় না, তাই আছে কিনা যাচাই করা যায়নি — Instagram
  // অ্যাপ থেকে Threads প্রোফাইল চালু না থাকলে href খালি করে দিন।
  { name: 'Threads', platform: 'threads', href: 'https://www.threads.net/@jutoriahome' },
  { name: 'TikTok', platform: 'tiktok', href: 'https://www.tiktok.com/@jutoriahome' },
  { name: 'YouTube', platform: 'youtube', href: 'https://www.youtube.com/@jutoriahome' },
  { name: 'Pinterest', platform: 'pinterest', href: 'https://www.pinterest.com/jutoriahome' },
  // LinkedIn কোম্পানি পেজ এখনো তৈরি হয়নি (linkedin.com/company/jutoriahome → "Page not
  // found", ৩০ সেপ্টেম্বর ২০২৬-এ যাচাই করা)। পেজ খোলার পর এখানে URL বসান।
  { name: 'LinkedIn', platform: 'linkedin', href: '' },
  { name: 'X', platform: 'x', href: 'https://x.com/jutoriahomecom' },
];

/** শুধু যেসব প্রোফাইলের URL আছে (ফুটার আইকন ও JSON-LD sameAs-এর জন্য)। */
export const ACTIVE_SOCIAL_PROFILES = SOCIAL_PROFILES.filter((p) => p.href);

export const LINKEDIN_COMPANY_URL = SOCIAL_PROFILES.find((p) => p.platform === 'linkedin')?.href || '';

// ------------------------------------------------------------
// Meta (Facebook/Instagram) ট্যাগ — দুটোই খালি থাকলে পেজে কিছুই যোগ হয় না।
//
// META_DOMAIN_VERIFICATION: business.facebook.com → Settings → Brand safety → Domains →
//   jutoriahome.com → "Meta-tag" অপশনে যে content="..." মানটা দেয়, শুধু সেই মানটা বসান।
//
// META_PIXEL_ID: Events Manager → Data sources → Pixel-এর সংখ্যাসূচক ID। Pixel শুধু তখনই
//   লোড হয় যখন ভিজিটর কুকি নোটিশে "Accept" চাপে (UK/EU-র PECR/GDPR অনুযায়ী মার্কেটিং
//   কুকির আগে সম্মতি লাগে) — দেখুন components/MetaPixel.astro।
// ------------------------------------------------------------
export const META_DOMAIN_VERIFICATION = '';
export const META_PIXEL_ID = '';

// ------------------------------------------------------------
// প্রোডাক্ট ক্যাটালগ — বিল্ড-টাইমে লাইভ প্রোডাক্ট থেকে তৈরি একটা প্রিন্ট-উপযোগী পেজ
// (pages/catalogue.astro)। ভিজিটর "Save as PDF" চাপলে ব্রাউজার থেকেই PDF হয়ে যায়।
// ------------------------------------------------------------
export const CATALOG_URL = '/catalogue';
