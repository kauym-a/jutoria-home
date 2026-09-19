import { useMemo } from 'react';
import { useProducts } from './useProducts';
import { categories as curatedCategories } from '../data/categories';

// ============================================================
// /categories ও /categories/:slug আগে src/data/categories.ts-এর হার্ডকোড করা ৫টা
// এন্ট্রি থেকেই চলত — Admin Panel-এ প্রোডাক্ট ফর্মে "+ Add New Category" দিয়ে নতুন
// category (যেমন "Storage Basket") যোগ করলে সেটা প্রোডাক্টে সেভ হতো, কিন্তু
// /categories পেজে কখনো দেখাতো না (কোডে আলাদাভাবে যোগ না করা পর্যন্ত)।
//
// এখন এই হুক active প্রোডাক্টগুলোর `category` ফিল্ড থেকে distinct নামগুলো নিজে থেকেই
// বের করে category card বানায় — Admin কোনো প্রোডাক্টে নতুন category টাইপ করলেই সেটা
// পরের রিলোডে /categories-এ স্বয়ংক্রিয়ভাবে দেখা যাবে, কোনো কোড এডিটের দরকার নেই।
//
// data/categories.ts-এর ৫টা মূল category-র হাতে-লেখা desc/longDesc/image এখনো ব্যবহৃত
// হয় (নাম মিলিয়ে) — শুধু নতুন/অজানা category-র জন্য একটা যুক্তিসঙ্গত generic
// desc/longDesc বসে আর ওই category-র প্রথম প্রোডাক্টের ছবিই card/hero image হিসেবে
// ব্যবহৃত হয় (কোনো curated ছবি না থাকায়)।
// ============================================================

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

export function useProductCategories() {
  const { products, loading } = useProducts();

  const categories = useMemo<ProductCategory[]>(() => {
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
  }, [products]);

  return { categories, loading };
}
