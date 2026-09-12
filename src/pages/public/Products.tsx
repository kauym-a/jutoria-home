import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, X } from 'lucide-react';
import ProductCard from '../../components/product/ProductCard';
import { useProducts } from '../../hooks/useProducts';
import { materials } from '../../data/materials';
import { absoluteUrl } from '../../lib/seo';

export default function Products() {
  const { products } = useProducts(); // Firestore-backed, static ডেটায় fallback করে
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

  return (
    <>
      <Helmet>
        <title>Products | JUTORIA - Premium Eco-Friendly Home Décor</title>
        <meta name="description" content="Browse the complete JUTORIA product catalogue — filter by material or search by name and SKU. Available for international wholesale and retail." />
        <link rel="canonical" href={absoluteUrl('/products')} />
      </Helmet>

      {/* Page Header */}
      <section className="border-b border-brand-navy/10 bg-[#f7f4ee]">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-20 lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            <div className="max-w-xl">
              <span className="mb-5 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
                Our Collection
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-bold leading-[0.95] tracking-[-0.03em] text-brand-navy mb-6">
                Every Product.<br />One Catalogue.
              </h1>
              <p className="max-w-lg font-sans text-base md:text-lg text-brand-navy/75 font-light leading-relaxed">
                Browse the full JUTORIA range — filter by material or search by name and SKU to find exactly what you're sourcing for.
              </p>
            </div>

            <div className="relative overflow-hidden border border-brand-navy/10 bg-brand-ivory min-h-[260px] md:min-h-[320px] lg:min-h-[360px]">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/laundry-basket-lifestyle.jpg')" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/40 via-brand-navy/10 to-brand-ivory/10" />
              <div className="relative flex h-full min-h-[260px] md:min-h-[320px] lg:min-h-[360px] items-end justify-start p-6 md:p-8">
                <div className="max-w-[220px] border border-white/30 bg-white/10 px-4 py-3 backdrop-blur-[1px] text-brand-offwhite shadow-[0_12px_32px_rgba(15,23,42,0.18)]">
                  <p className="font-sans text-[10px] font-bold tracking-[0.22em] uppercase text-brand-offwhite/85">
                    Thoughtfully made
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="border-b border-brand-navy/10 bg-white sticky top-20 z-30">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="flex items-center gap-2 text-brand-navy font-sans font-medium flex-shrink-0">
            <Filter size={18} className="text-brand-gold" />
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
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-navy/40" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-navy/40 hover:text-brand-navy"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-brand-offwhite">
        <div className="container mx-auto px-4">
          {hasActiveFilters && (
            <p className="font-sans text-sm text-brand-navy/60 mb-8">
              Showing {filteredProducts.length} of {products.length} products
              {materialFilter !== 'all' && <> in <span className="font-semibold text-brand-navy">{materials.find((m) => m.slug === materialFilter)?.name}</span></>}
              {searchQuery && <> matching "<span className="font-semibold text-brand-navy">{searchQuery}</span>"</>}
              <button type="button" onClick={() => { setMaterialFilter('all'); setSearchQuery(''); }} className="ml-3 text-brand-gold font-semibold hover:underline">
                Clear
              </button>
            </p>
          )}

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredProducts.map((product) => (
                <ProductCard key={product.sku} product={product as any} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-sans text-brand-navy/60 mb-4">No products match your filters.</p>
              <button
                type="button"
                onClick={() => { setMaterialFilter('all'); setSearchQuery(''); }}
                className="font-sans text-sm font-semibold text-brand-navy underline underline-offset-2 hover:text-brand-gold"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
