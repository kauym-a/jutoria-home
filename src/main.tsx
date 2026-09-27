import { StrictMode, useEffect, useState } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.tsx'

const isPrerendering =
  typeof window !== 'undefined' && (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true;

// react-hot-toast-এর Toaster নিজের ইনলাইন style অবজেক্টে সংখ্যা (top: 16) ব্যবহার করে, কিন্তু
// prerendered static HTML-এ সেটা সবসময় CSS স্ট্রিং হিসেবে সেভ হয় (top: "16px") — hydrateRoot()
// এটাকে একটা genuine mismatch হিসেবে ধরে (React error #418, প্রতিটা পেজেই দেখা যাচ্ছিল, শুধু
// আমাদের products/categories preload-এর সাথে সম্পর্কিত না, এটা react-hot-toast-এর নিজস্ব
// পরিচিত SSR/hydration অসঙ্গতি)। তাই Toaster prerender-এর সময় কখনোই রেন্ডার হয় না
// (isPrerendering গার্ড, তাই static HTML-এ Toaster-এর div-ই থাকে না), আর real ভিজিটরদের
// প্রথম hydration পাসেও তাই (mounted শুরুতে false) — hydration শেষ হওয়ার পরে effect চলে
// Toaster মাউন্ট করে, যেটা তখন একটা সাধারণ ক্লায়েন্ট আপডেট, hydration মিসম্যাচ না।
function DeferredToaster() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (isPrerendering) return;
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return <Toaster position="top-right" />;
}

// ⚠️ শুধু ৮১টা রুটই prerender হয় (scripts/prerender.mjs-এর STATIC_ROUTES + প্রোডাক্ট SKU) —
// /categories/:slug, /materials/:slug, legal পেজ, /gallery/*, বা যেকোনো ভুল URL-এর নিজস্ব
// prerendered ফাইল নেই। public/.htaccess-এর catch-all rewrite (`RewriteRule . /index.html`)
// তখন Home-এর ('/') পুরোপুরি populated markup সার্ভ করে দেয় — hydrateRoot() সরাসরি ব্যবহার
// করলে এটা আসল রুটের (যেমন CategoryDetail) কম্পোনেন্ট-ট্রির সাথে গ্যারান্টিড মিসম্যাচ করত
// (React error #418), যেহেতু সার্ভ করা markup ভিন্ন একটা পেজের।
//
// প্রতিটা prerendered পেজ নিজের route-এর সাথে মেলা <link rel="canonical"> ট্যাগ বসায় (দেখুন
// Products.tsx/CategoryDetail.tsx/MaterialDetail.tsx ইত্যাদি)। এখানে সেটা আসল
// location.pathname-এর সাথে তুলনা করে ঠিক করা হচ্ছে — মিললে hydrateRoot() (prerendered
// markup পুনর্ব্যবহার করে, দ্রুত), না মিললে (বা canonical-ই না থাকলে, যেমন legal/gallery
// পেজ) createRoot() (পুরনো, সবসময়-নিরাপদ আচরণ — খালি/ভুল markup ফেলে দিয়ে ফ্রেশ রেন্ডার,
// কোনো মিসম্যাচ ওয়ার্নিং ছাড়াই)।
function normalizePath(pathname: string): string {
  return pathname.replace(/\/+$/, '') || '/';
}

function getServedPath(): string | null {
  const href = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  if (!href) return null;
  try {
    return normalizePath(new URL(href).pathname);
  } catch {
    return null;
  }
}

const servedPath = getServedPath();
const canHydrate = servedPath !== null && servedPath === normalizePath(window.location.pathname);

const rootEl = document.getElementById('root')!;
const appTree = (
  <StrictMode>
    <DeferredToaster />
    <App />
  </StrictMode>
);

if (canHydrate) {
  hydrateRoot(rootEl, appTree);
} else {
  createRoot(rootEl).render(appTree);
}
