import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { categories } from '../../data/categories';
import { absoluteUrl } from '../../lib/seo';

export default function Categories() {
  return (
    <>
      <Helmet>
        <title>Categories | JUTORIA - Shop by Product Type</title>
        <meta
          name="description"
          content="Browse the JUTORIA range by product type — placemats, planter baskets, laundry baskets, organizer baskets and floor mats & rugs."
        />
        <link rel="canonical" href={absoluteUrl('/categories')} />
      </Helmet>

      <section className="border-b border-brand-navy/10 bg-[#f7f4ee]">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-20 lg:py-24">
          <span className="mb-5 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
            Product Collection
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-bold leading-[0.95] tracking-[-0.03em] text-brand-navy mb-6 max-w-3xl">
            Five Categories. One Range.
          </h1>
          <p className="max-w-2xl font-sans text-base md:text-lg text-brand-navy/75 font-light leading-relaxed">
            Browse the full JUTORIA range grouped by product type — from tableware to storage to
            floor coverings — for faster sourcing.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-brand-offwhite">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {categories.map((category) => (
              <Link
                to={`/categories/${category.slug}`}
                key={category.id}
                className="group relative p-8 md:p-10 border-2 border-brand-navy/10 hover:border-brand-gold transition-all duration-500 rounded-[2px] overflow-hidden flex flex-col justify-end min-h-[320px] shadow-premium hover:shadow-premium-hover"
                style={{
                  backgroundImage: category.image
                    ? `linear-gradient(180deg, rgba(17, 18, 16, 0.22) 0%, rgba(17, 18, 16, 0.62) 100%), url(${category.image})`
                    : 'linear-gradient(160deg, #1a2e29 0%, #0f1a17 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span className="absolute top-6 right-8 font-serif text-6xl font-bold text-brand-ivory/25 group-hover:text-brand-gold/60 transition-colors duration-500">
                  {category.id}
                </span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-brand-ivory flex items-center gap-3">
                    {category.name}
                    <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-gold" />
                  </h3>
                  <p className="font-sans font-light leading-relaxed text-brand-ivory/85 text-sm">
                    {category.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
