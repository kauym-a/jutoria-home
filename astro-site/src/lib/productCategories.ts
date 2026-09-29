import { categories as curatedCategories } from '../data/categories';
import type { Product } from './products';

// মূল src/hooks/useProductCategories.ts থেকে পোর্ট করা — সেখানে useMemo(() => ..., [products])
// ছিল, এখানে প্লেইন ফাংশন (বিল্ড-টাইমে একবার কল হয়, React লাগে না)।
export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
  desc: string;
  longDesc: string;
  image: string | null;
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getProductCategories(products: Product[]): ProductCategory[] {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const p of products) {
    const name = p.category?.trim();
    if (name && !seen.has(name)) {
      seen.add(name);
      names.push(name);
    }
  }
  names.sort((a, b) => a.localeCompare(b));

  return names.map((name, i) => {
    const curated = curatedCategories.find((c) => c.name === name);
    const productInCategory = products.find((p) => p.category === name);
    const primaryImage =
      productInCategory?.images?.find((img) => img.role === 'primary')?.url ||
      productInCategory?.images?.[0]?.url ||
      null;

    return {
      id: String(i + 1).padStart(2, '0'),
      slug: curated?.slug || slugify(name),
      name,
      desc: curated?.desc || `Browse our ${name.toLowerCase()} collection — handcrafted natural-fiber pieces from JUTORIA.`,
      longDesc:
        curated?.longDesc ||
        `Explore JUTORIA's ${name.toLowerCase()} range — thoughtfully designed, natural-fiber pieces handcrafted by skilled artisans in Bangladesh.`,
      image: curated?.image ?? primaryImage,
    };
  });
}
