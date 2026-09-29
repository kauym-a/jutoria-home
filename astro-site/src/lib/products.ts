import { fetchCollectionViaRest } from './firestoreRest';
import staticProducts from '../data/products.json';

// মূল src/services/firebase/products.ts থেকে পোর্ট করা — শুধু পাবলিক সাইটের জন্য যা
// দরকার তাই রাখা হলো (fetchAllProducts/upsertProduct/deleteProduct/seed* Admin
// Panel-এর জন্য, Astro build-এ লাগে না, ওগুলো Admin island-এর নিজের কোডে অপরিবর্তিত
// থাকবে)। এখানে fetchActiveProducts() Node-এ (astro build সময়) রান হয় — ব্রাউজারে
// নয় — তাই কোনো ক্লায়েন্ট বান্ডলে এই কোড যায় না।
const PRODUCTS_COLLECTION = 'products';

export type ProductImage = {
  filename?: string;
  role?: string;
  url: string;
  confidence?: string;
};

export type Product = {
  sku: string;
  name: string;
  category?: string;
  description?: string;
  materialSlugs?: string[];
  image_folder?: string;
  images: ProductImage[];
  primaryImageUrl?: string;
  amazonUrl?: string;
  featured?: boolean;
  active?: boolean;
  relatedSkus?: string[];
  excel_fields?: Record<string, string>;
  specOrder?: string[];
  updatedAt?: unknown;
};

function guessMaterialSlugs(raw: any): string[] {
  const text = (raw?.excel_fields?.['Material Composition'] || '').toLowerCase();
  const slugs: string[] = [];
  if (text.includes('jute')) slugs.push('jute');
  if (text.includes('sea-grass') || text.includes('seagrass') || text.includes('sea grass')) slugs.push('seagrass');
  if (text.includes('cotton')) slugs.push('cane-rattan');
  return slugs;
}

export function getStaticFallbackProducts(): Product[] {
  return (staticProducts as any[]).map((raw) => ({
    sku: raw.sku,
    name: raw.name,
    category: raw.category || 'Placemats',
    materialSlugs: raw.materialSlugs || guessMaterialSlugs(raw),
    image_folder: raw.image_folder,
    images: raw.images || [],
    amazonUrl: raw.amazonUrl || '',
    featured: raw.featured ?? false,
    active: raw.active ?? true,
    relatedSkus: raw.relatedSkus || [],
    excel_fields: raw.excel_fields || {},
  }));
}

/**
 * বিল্ড-টাইমে active প্রোডাক্ট আনে (getStaticPaths/frontmatter থেকে কল হয়)। মূল
 * useProducts.ts hook-এর মতোই REST fetch ব্যর্থ হলে বা খালি হলে static fallback-এ যায় —
 * সাইট বিল্ড কখনো Firestore সাময়িকভাবে অনুপলব্ধ থাকলেও ভেঙে পড়বে না।
 */
export async function fetchActiveProducts(): Promise<Product[]> {
  try {
    const all = await fetchCollectionViaRest<Product>(PRODUCTS_COLLECTION);
    const active = all.filter((p) => p.active !== false);
    return active.length > 0 ? active : getStaticFallbackProducts();
  } catch (err) {
    console.warn('[build] Could not load products from Firestore, using static fallback.', err);
    return getStaticFallbackProducts();
  }
}
