import { fetchCollectionViaRest } from './firestoreRest';
import { materials } from '../data/materials';

// মূল src/services/firebase/categories.ts থেকে পোর্ট করা (এখানে "categories" মানে
// Firestore-এর 'categories' কালেকশন — আসলে "materials" ডোমেইন, যেমন Jute/Seagrass —
// দেখুন মূল ফাইলের কমেন্ট, এটা src/data/categories.ts-এর প্রোডাক্ট-টাইপ ক্যাটাগরি
// (Placemats ইত্যাদি) থেকে আলাদা)। শুধু বিল্ড-টাইমে পাবলিক সাইটের জন্য যা দরকার তাই।
const CATEGORIES_COLLECTION = 'categories';

export type Category = {
  slug: string;
  name: string;
  desc: string;
  longDesc: string;
  image: string;
  cardImage?: string;
  order: number;
  active: boolean;
  updatedAt?: unknown;
};

const byOrder = (a: Category, b: Category) => (a.order ?? 0) - (b.order ?? 0);

export function getStaticFallbackCategories(): Category[] {
  return materials
    .map((m, i) => ({
      slug: m.slug,
      name: m.name,
      desc: m.desc,
      longDesc: m.longDesc,
      image: m.image,
      order: Number(m.id) || i + 1,
      active: true,
    }))
    .sort(byOrder);
}

export async function fetchActiveCategories(): Promise<Category[]> {
  try {
    const all = await fetchCollectionViaRest<Category>(CATEGORIES_COLLECTION);
    const active = all.filter((c) => c.active !== false).sort(byOrder);
    return active.length > 0 ? active : getStaticFallbackCategories();
  } catch (err) {
    console.warn('[build] Could not load categories from Firestore, using static fallback.', err);
    return getStaticFallbackCategories();
  }
}

/** order থেকে "01", "02"… প্যাডেড ডিসপ্লে নম্বর। */
export function displayNumber(order: number): string {
  return String(order ?? 0).padStart(2, '0');
}
