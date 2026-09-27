import { useEffect, useState } from 'react';
import { fetchActiveProducts, getStaticFallbackProducts, type Product } from '../services/firebase/products';

// ============================================================
// পাবলিক পেজ (Products, ProductDetail, MaterialDetail) সবাই এই একই hook ব্যবহার করে।
// Firestore থেকে active প্রোডাক্ট আনার চেষ্টা করে; ব্যর্থ হলে (নেটওয়ার্ক সমস্যা) বা
// Firestore সত্যিই খালি থাকলে স্ট্যাটিক fallback ডেটা দেখায় — সাইট কখনো খালি/ভাঙা
// দেখাবে না।
//
// ⚠️ useCategories()-এ ধরা পড়া একই বাগ এখানেও ঠিক করা হলো — আগে initial state-ই
// static fallback (পুরনো products.json ছবি/ডেটা) থাকত, prerendered পেজের আসল ছবি
// দেখানোর ঠিক পরপরই React মাউন্ট হওয়ার সময় সংক্ষিপ্ত সময়ের জন্য পুরনো ডেটায় ফিরে
// যেত, তারপর আবার Firestore fetch শেষ হলে আসল ডেটায়। এখন initial state খালি —
// static fallback শুধু fetch সত্যিই ব্যর্থ হলে বা Firestore খালি থাকলেই বসে।
//
// ⚠️ hydrateRoot()-এ যাওয়ার জন্য (main.tsx দেখুন) client-এর প্রথম রেন্ডার (কোনো effect
// চলার আগেই) prerendered HTML-এর সাথে হুবহু মিলতে হয় — কিন্তু prerendered HTML-এ আসল
// (populated) ডেটা বেক করা থাকে (scripts/prerender.mjs Firestore fetch শেষ হওয়া পর্যন্ত
// অপেক্ষা করে তারপর স্ন্যাপশট নেয়), অথচ এই hook-এর initial state খালি — hydration
// mismatch হতো। তাই prerender.mjs নিজেই window.__PRELOADED_PRODUCTS__-এ ঠিক যা রেন্ডার
// হয়েছিল সেটা inject করে দেয় (নিচের .then()/.catch()-এ prerender সেশনে সেই একই resolved
// অ্যারে window-এ লিখে রাখা হচ্ছে, prerender.mjs সেটাই পরে পড়ে HTML-এ বসায়) — client প্রথম
// রেন্ডারেই সেটা initial state হিসেবে ব্যবহার করে prerendered markup-এর সাথে মেলে। একই
// নেটওয়ার্ক কল দুইবার (prerender.mjs-এ আলাদা Node fetch + ব্রাউজারে এই fetch) না করে
// prerender সেশনের নিজের resolved ডেটাই পুনর্ব্যবহার করা হচ্ছে, যাতে Firestore-এর
// list-order কোনো গ্যারান্টি না দেওয়া সত্ত্বেও দুটো আলাদা কল কখনো একে অপরের সাথে না মেলার
// ঝুঁকি না থাকে।
// ============================================================

const isPrerendering =
  typeof window !== 'undefined' && (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true;

function getPreloadedProducts(): Product[] | undefined {
  if (typeof window === 'undefined') return undefined;
  const preloaded = (window as unknown as { __PRELOADED_PRODUCTS__?: unknown }).__PRELOADED_PRODUCTS__;
  return Array.isArray(preloaded) ? (preloaded as Product[]) : undefined;
}

export function useProducts() {
  const preloaded = getPreloadedProducts();
  const [products, setProducts] = useState<Product[]>(preloaded ?? []);
  const [loading, setLoading] = useState(!preloaded);
  const [source, setSource] = useState<'firestore' | 'static'>('firestore');

  useEffect(() => {
    let cancelled = false;

    fetchActiveProducts()
      .then((fromFirestore) => {
        if (cancelled) return;
        const resolved = fromFirestore.length > 0 ? fromFirestore : getStaticFallbackProducts();
        setProducts(resolved);
        setSource(fromFirestore.length > 0 ? 'firestore' : 'static');
        if (isPrerendering) (window as unknown as { __PRELOADED_PRODUCTS__?: Product[] }).__PRELOADED_PRODUCTS__ = resolved;
      })
      .catch((err) => {
        if (cancelled) return;
        // Firestore আনতে ব্যর্থ হলে (যেমন নিয়ম/নেটওয়ার্ক) fallback-এ যায়
        console.warn('Could not load products from Firestore, showing static fallback.', err);
        const resolved = getStaticFallbackProducts();
        setProducts(resolved);
        setSource('static');
        if (isPrerendering) (window as unknown as { __PRELOADED_PRODUCTS__?: Product[] }).__PRELOADED_PRODUCTS__ = resolved;
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, source };
}
