import { useEffect, useState } from 'react';
import {
  fetchActiveCategories,
  getStaticFallbackCategories,
  type Category,
} from '../services/firebase/categories';

// ============================================================
// পাবলিক পেজ (Home-এর "Our Materials" গ্রিড, Materials, MaterialDetail) সবাই এই একই
// hook ব্যবহার করে। Firestore থেকে active ক্যাটাগরি আনার চেষ্টা করে; খালি পেলে বা কোনো
// এরর হলে (এখনো সিড করা হয়নি, বা নেটওয়ার্ক সমস্যা) স্ট্যাটিক fallback ডেটা দেখায় —
// সাইট কখনো খালি/ভাঙা দেখাবে না। (useProducts hook-এর মতোই।)
// ============================================================

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>(getStaticFallbackCategories());
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'firestore' | 'static'>('static');

  useEffect(() => {
    let cancelled = false;

    fetchActiveCategories()
      .then((fromFirestore) => {
        if (cancelled) return;
        if (fromFirestore.length > 0) {
          setCategories(fromFirestore);
          setSource('firestore');
        }
        // Firestore খালি থাকলে fallback ডেটাই থেকে যাবে (initial state)
      })
      .catch((err) => {
        console.warn('Could not load categories from Firestore, showing static fallback.', err);
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
