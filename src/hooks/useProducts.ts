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
// ============================================================

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'firestore' | 'static'>('firestore');

  useEffect(() => {
    let cancelled = false;

    fetchActiveProducts()
      .then((fromFirestore) => {
        if (cancelled) return;
        if (fromFirestore.length > 0) {
          setProducts(fromFirestore);
          setSource('firestore');
        } else {
          setProducts(getStaticFallbackProducts());
          setSource('static');
        }
      })
      .catch((err) => {
        if (cancelled) return;
        // Firestore আনতে ব্যর্থ হলে (যেমন নিয়ম/নেটওয়ার্ক) fallback-এ যায়
        console.warn('Could not load products from Firestore, showing static fallback.', err);
        setProducts(getStaticFallbackProducts());
        setSource('static');
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
