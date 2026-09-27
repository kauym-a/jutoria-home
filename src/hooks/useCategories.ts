import { useEffect, useState } from 'react';
import {
  fetchActiveCategories,
  getStaticFallbackCategories,
  type Category,
} from '../services/firebase/categories';

// ============================================================
// পাবলিক পেজ (Home-এর "Our Materials" গ্রিড, Materials, MaterialDetail) সবাই এই একই
// hook ব্যবহার করে। Firestore থেকে active ক্যাটাগরি আনার চেষ্টা করে; ব্যর্থ হলে (নেটওয়ার্ক
// সমস্যা) বা Firestore সত্যিই খালি থাকলে স্ট্যাটিক fallback ডেটা দেখায় — সাইট কখনো
// খালি/ভাঙা দেখাবে না। (useProducts hook-এর মতোই।)
//
// ⚠️ আবিষ্কৃত বাগ: আগে initial state হিসেবেই static fallback (src/data/materials.ts-এর
// পুরনো ছবি) সেট করা থাকত, এমনকি Firestore fetch সফল হওয়ার আগেও। যেহেতু এই পেজ
// prerender করা (build-time-এ আসল Firestore ডেটা দিয়ে) কিন্তু client-side React একটা
// সম্পূর্ণ fresh createRoot().render() করে (hydrate না — দেখুন prerender.mjs-এর
// কমেন্ট), তাই ভিজিটর প্রথমে prerendered আসল ছবি দেখতেন, তারপর React মাউন্ট হওয়ার
// সাথে সাথেই সংক্ষিপ্ত সময়ের জন্য *পুরনো* static fallback ছবি (initial state) দেখাতো,
// তারপর আবার Firestore fetch শেষ হলে *আসল* ছবিতে ফিরে যেত — এই "পুরনো তারপর নতুন"
// দৃশ্যমান ফ্ল্যাশটাই অ্যাডমিন লক্ষ্য করেছিলেন (বিশেষত ইদানীং আপলোড করা নতুন
// category card ছবিতে)। এখন initial state খালি রাখা হচ্ছে — static fallback শুধু
// fetch সত্যিই ব্যর্থ হলে বা Firestore খালি থাকলেই বসে, আগেভাগে না।
//
// ⚠️ hydrateRoot()-এ যাওয়ার জন্য (main.tsx দেখুন) client-এর প্রথম রেন্ডার prerendered
// HTML-এর সাথে হুবহু মিলতে হয় — useProducts.ts-এর একই কারণে/একই প্যাটার্নে (দেখুন সেই
// ফাইলের কমেন্ট) window.__PRELOADED_CATEGORIES__ থেকে initial state seed করা হচ্ছে,
// prerender.mjs যেটা এই hook-এরই prerender-সেশন resolved ডেটা থেকে বসায়।
// ============================================================

const isPrerendering =
  typeof window !== 'undefined' && (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true;

function getPreloadedCategories(): Category[] | undefined {
  if (typeof window === 'undefined') return undefined;
  const preloaded = (window as unknown as { __PRELOADED_CATEGORIES__?: unknown }).__PRELOADED_CATEGORIES__;
  return Array.isArray(preloaded) ? (preloaded as Category[]) : undefined;
}

export function useCategories() {
  const preloaded = getPreloadedCategories();
  const [categories, setCategories] = useState<Category[]>(preloaded ?? []);
  const [loading, setLoading] = useState(!preloaded);
  const [source, setSource] = useState<'firestore' | 'static'>('firestore');

  useEffect(() => {
    let cancelled = false;

    fetchActiveCategories()
      .then((fromFirestore) => {
        if (cancelled) return;
        const resolved = fromFirestore.length > 0 ? fromFirestore : getStaticFallbackCategories();
        setCategories(resolved);
        setSource(fromFirestore.length > 0 ? 'firestore' : 'static');
        if (isPrerendering) (window as unknown as { __PRELOADED_CATEGORIES__?: Category[] }).__PRELOADED_CATEGORIES__ = resolved;
      })
      .catch((err) => {
        if (cancelled) return;
        console.warn('Could not load categories from Firestore, showing static fallback.', err);
        const resolved = getStaticFallbackCategories();
        setCategories(resolved);
        setSource('static');
        if (isPrerendering) (window as unknown as { __PRELOADED_CATEGORIES__?: Category[] }).__PRELOADED_CATEGORIES__ = resolved;
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, loading, source };
}
