import type { APIRoute } from 'astro';
import { fetchActiveProducts } from '../lib/products';
import { fetchActiveCategories } from '../lib/categories';
import { getProductCategories } from '../lib/productCategories';
import { SITE_URL } from '../lib/seo';

// মূল scripts/prerender.mjs-এর generateSitemap() থেকে পোর্ট করা — একই URL সেট, changefreq ও
// priority। পেজগুলো যে ডেটা থেকে বিল্ড হয় ঠিক সেটা থেকেই বানানো, তাই sitemap-এ কখনো এমন URL
// থাকবে না যার পেজ নেই। (পুরনো ভার্সনে '/', '/products', '/categories', '/materials' দুবার করে
// আসত — এখানে একবারই।) noindex পেজগুলো (লিগ্যাল, গ্যালারি প্লেসহোল্ডার, 404) ইচ্ছাকৃতভাবে বাদ।
const HIDDEN_MATERIAL_SLUGS = new Set(['hogla-leaf']);

export const GET: APIRoute = async () => {
  const [products, materials] = await Promise.all([fetchActiveProducts(), fetchActiveCategories()]);

  const urls: { loc: string; changefreq: string; priority: string }[] = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/products', changefreq: 'daily', priority: '0.9' },
    { loc: '/categories', changefreq: 'weekly', priority: '0.8' },
    { loc: '/materials', changefreq: 'weekly', priority: '0.8' },
    { loc: '/wholesale', changefreq: 'weekly', priority: '0.9' },
    ...['/our-story', '/company-profile', '/people', '/corporate-information', '/clients-markets', '/amazon-usa', '/jutoria-ai', '/sustainability', '/contact'].map(
      (loc) => ({ loc, changefreq: 'monthly', priority: '0.6' }),
    ),
    ...getProductCategories(products).map((c) => ({ loc: `/categories/${c.slug}`, changefreq: 'weekly', priority: '0.7' })),
    ...materials.filter((m) => !HIDDEN_MATERIAL_SLUGS.has(m.slug)).map((m) => ({ loc: `/materials/${m.slug}`, changefreq: 'weekly', priority: '0.7' })),
    ...products.map((p) => ({ loc: `/product/${encodeURIComponent(p.sku)}`, changefreq: 'weekly', priority: '0.6' })),
  ];

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urls
      .map((u) => `  <url>\n    <loc>${SITE_URL}${u.loc}</loc>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`)
      .join('\n') +
    '\n</urlset>\n';

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
