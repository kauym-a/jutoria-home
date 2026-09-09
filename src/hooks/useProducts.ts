import { useEffect, useState } from 'react';
import { fetchActiveProducts, getStaticFallbackProducts, type Product } from '../services/firebase/products';

// ============================================================
// পাবলিক পেজ (Products, ProductDetail, MaterialDetail) সবাই এই একই hook ব্যবহার করে।
// Firestore থেকে active প্রোডাক্ট আনার চেষ্টা করে; খালি পেলে বা কোনো এরর হলে (যেমন
// এখনো সিড করা হয়নি, বা নেটওয়ার্ক সমস্যা) স্ট্যাটিক fallback ডেটা দেখায় — সাইট
// কখনো খালি/ভাঙা দেখাবে না।
// ============================================================

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(getStaticFallbackProducts());
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'firestore' | 'static'>('static');

  useEffect(() => {
    let cancelled = false;

    fetchActiveProducts()
      .then((fromFirestore) => {
        if (cancelled) return;
        if (fromFirestore.length > 0) {
          setProducts(fromFirestore);
          setSource('firestore');
        }
        // Firestore খালি থাকলে fallback ডেটাই থেকে যাবে (initial state)
      })
      .catch((err) => {
        // Firestore আনতে ব্যর্থ হলে (যেমন নিয়ম/নেটওয়ার্ক) চুপচাপ fallback-এ থাকে
        console.warn('Could not load products from Firestore, showing static fallback.', err);
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
