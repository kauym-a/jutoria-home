import { useMemo, useState } from 'react';
import type { Product } from '../lib/products';

// মূল src/pages/public/Products.tsx-এর ফিল্টার/সার্চ/গ্রিড অংশ থেকে পোর্ট করা — এই পেজের
// একমাত্র সত্যিকারের ইন্টারঅ্যাক্টিভ অংশ (বাকি হিরো/হেডার Products.astro-তে স্ট্যাটিক)।
// পুরো প্রোডাক্ট অ্যারে বিল্ড-টাইমে prop হিসেবে আসে (Astro frontmatter থেকে) — এখানে আর
// কোনো fetch নেই, শুধু client-side filter/search, তাই client:visible যথেষ্ট (স্ক্রল করে
// এই সেকশনে আসা পর্যন্ত হাইড্রেশন পিছিয়ে দেওয়া নিরাপদ)।
type MaterialOption = { slug: string; name: string };

function ProductCardInline({ product, priority }: { product: Product; priority: boolean }) {
  const primary = product.images?.find((i) => i.role === 'primary') || product.images?.[0];
  const imageUrl = primary?.url || '/placemat-product.webp';
  const productPath = `/product/${encodeURIComponent(product.sku)}`;
  const rawMoq = product.excel_fields?.['MOQ'];
  const moq = typeof rawMoq === 'string' && rawMoq.trim()
    ? rawMoq.trim().replace(/\bsets?\b/i, 'Sets').replace(/\bpcs\b/i, 'pcs')
    : '300 Sets';

  return (
    <div className="group h-full cursor-pointer">
      <a href={productPath} className="block relative mb-4 overflow-hidden border border-brand-navy/10 bg-white">
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-white">
          <img
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            src={imageUrl}
            alt={product.name}
            fetchPriority={priority ? 'high' : undefined}
            className="h-full w-full object-contain object-center p-3 transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
        <div className="absolute inset-0 bg-brand-navy/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <span className="bg-brand-gold text-brand-navy px-6 py-3 font-sans font-bold tracking-wider text-xs uppercase transform translate-y-4 transition-all duration-300 group-hover:translate-y-0">
            View Details
          </span>
        </div>
      </a>
      <div className="text-center">
        <span className="text-xs font-sans font-bold tracking-widest text-[#8a6a29] uppercase block mb-2">
          {product.excel_fields?.['Material Composition'] || ''}
        </span>
        <h3 className="text-lg font-serif font-bold text-brand-navy mb-2">
          <a href={productPath}>{product.name}</a>
        </h3>
        <span className="mx-auto mb-3 flex w-fit items-center gap-1.5 rounded-full bg-brand-navy/[0.06] px-3 py-1 font-sans text-xs font-bold tracking-wide text-brand-navy">
          {`MOQ: ${moq}`}
        </span>
        <span className="text-sm font-sans text-brand-navy/60 border border-brand-navy/20 px-3 py-1 rounded-full inline-block">
          {`SKU: ${product.sku}`}
        </span>
      </div>
    </div>
  );
}

export default function ProductsFilterGrid({ products, materials }: { products: Product[]; materials: MaterialOption[] }) {
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesMaterial = materialFilter === 'all' || p.materialSlugs?.includes(materialFilter);
      const matchesSearch =
        query === '' ||
        p.name?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query);
      return matchesMaterial && matchesSearch;
    });
  }, [products, materialFilter, searchQuery]);

  const hasActiveFilters = materialFilter !== 'all' || searchQuery.trim() !== '';
  const clearFilters = () => { setMaterialFilter('all'); setSearchQuery(''); };

  return (
    <>
      <section className="border-b border-brand-navy/10 bg-white sticky top-20 z-30">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="flex items-center gap-2 text-brand-navy font-sans font-medium flex-shrink-0">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-gold" aria-hidden="true">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <select
              value={materialFilter}
              onChange={(e) => setMaterialFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-sans text-sm font-semibold text-brand-navy cursor-pointer"
            >
              <option value="all">All Materials</option>
              {materials.map((m) => (
                <option key={m.slug} value={m.slug}>{m.name}</option>
              ))}
            </select>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full pl-10 pr-9 py-2 border border-brand-navy/20 rounded-none bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm"
            />
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" aria-hidden="true">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
            </svg>
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} aria-label="Clear search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-navy/40 hover:text-brand-navy">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-brand-offwhite">
        <div className="container mx-auto px-4">
          {hasActiveFilters && (
            <p className="font-sans text-sm text-brand-navy/60 mb-8">
              Showing {filteredProducts.length} of {products.length} products
              {materialFilter !== 'all' && <> in <span className="font-semibold text-brand-navy">{materials.find((m) => m.slug === materialFilter)?.name}</span></>}
              {searchQuery && <> matching "<span className="font-semibold text-brand-navy">{searchQuery}</span>"</>}
              <button type="button" onClick={clearFilters} className="ml-3 text-brand-gold font-semibold hover:underline">
                Clear
              </button>
            </p>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProducts.map((product, index) => (
                <ProductCardInline key={product.sku} product={product} priority={index < 3} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-sans text-brand-navy/60 mb-4">No products match your filters.</p>
              <button type="button" onClick={clearFilters} className="font-sans text-sm font-semibold text-brand-navy underline underline-offset-2 hover:text-brand-gold">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
