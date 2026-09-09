import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page Not Found | JUTORIA</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="min-h-[70vh] flex items-center bg-brand-offwhite">
        <div className="container mx-auto max-w-2xl px-4 py-24 text-center">
          <span className="block font-serif text-7xl md:text-8xl font-bold text-brand-navy/15 mb-6">404</span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4">
            This page doesn't exist.
          </h1>
          <p className="font-sans text-brand-navy/65 font-light leading-relaxed max-w-md mx-auto mb-10">
            The page you're looking for may have moved or the link may be outdated. Try one of these instead:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/" className="inline-flex items-center justify-center gap-2 bg-brand-navy text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy rounded-[2px]">
              Back to Home <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-navy/25 text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-navy hover:bg-brand-navy hover:text-brand-ivory rounded-[2px]">
              <Search size={16} /> Browse Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
