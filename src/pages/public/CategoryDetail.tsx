import { Helmet } from 'react-helmet-async';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { categories } from '../../data/categories';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/product/ProductCard';

export default function CategoryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find((c) => c.slug === slug);
  const { products } = useProducts(); // Firestore-backed, static ডেটায় fallback করে

  if (!category) {
    return <Navigate to="/categories" replace />;
  }

  const currentIndex = categories.findIndex((c) => c.slug === slug);
  const next = categories[(currentIndex + 1) % categories.length];

  // প্রোডাক্টের `category` ফিল্ড (admin ফর্মের ড্রপডাউন থেকে সেট করা) দিয়ে মেলানো হয়
  const relatedProducts = products.filter((p) => p.category === category.name);

  return (
    <>
      <Helmet>
        <title>{category.name} | JUTORIA Categories</title>
        <meta name="description" content={category.desc} />
      </Helmet>

      <section
        className="relative w-full min-h-[55vh] flex items-end bg-brand-navy overflow-hidden"
        style={!category.image ? { background: 'linear-gradient(160deg, #1a2e29 0%, #0f1a17 100%)' } : undefined}
      >
        {category.image && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${category.image})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-brand-navy/10" />
        <div className="relative z-10 container mx-auto max-w-5xl px-4 pt-24 md:pt-28 pb-14 md:pb-20">
          <Link to="/categories" className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-gold mb-6 hover:text-brand-ivory transition-colors">
            <ArrowLeft size={14} /> All Categories
          </Link>
          <span className="block font-serif text-7xl md:text-8xl font-bold text-brand-ivory/20 mb-2">
            {category.id}
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-ivory leading-tight max-w-2xl">
            {category.name}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-brand-offwhite">
        <div className="container mx-auto max-w-3xl px-4">
          <p className="font-sans text-lg md:text-xl text-brand-navy/80 font-light leading-relaxed mb-8">
            {category.longDesc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-12">
            <Link to="/products" className="inline-flex items-center justify-center gap-3 bg-brand-navy text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy rounded-[2px]">
              See All Products <ArrowRight size={16} />
            </Link>
            <Link to="/wholesale" className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-navy/25 text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-navy hover:bg-brand-navy hover:text-brand-ivory rounded-[2px]">
              Wholesale Inquiry
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <span className="block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase mb-4">
            {category.name}
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy mb-10">
            Products in this category
          </h2>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard key={p.sku} product={p as any} />
              ))}
            </div>
          ) : (
            <div className="border border-brand-navy/15 bg-brand-offwhite px-6 py-8 rounded-[2px] text-brand-navy/70 font-sans text-sm max-w-xl">
              We're currently photographing new {category.name.toLowerCase()} pieces for the JUTORIA collection —
              check back soon, or{' '}
              <Link to="/wholesale" className="text-brand-navy font-bold underline underline-offset-2 hover:text-brand-gold">
                reach out for wholesale inquiries
              </Link>{' '}
              about custom orders in this category.
            </div>
          )}
        </div>
      </section>

      <section className="py-14 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-3xl px-4 flex items-center justify-between">
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-brand-navy/50">Next Category</span>
          <Link to={`/categories/${next.slug}`} className="font-serif text-xl md:text-2xl font-bold text-brand-navy hover:text-brand-gold transition-colors flex items-center gap-3">
            {next.name} <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </>
  );
}
