import { ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function LegalPageLayout({
  title,
  eyebrow,
  lastUpdated,
  children,
}: {
  title: string;
  eyebrow: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Helmet>
        <title>{title} | JUTORIA</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="bg-brand-navy py-20 md:py-24 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <span className="mb-4 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
            {eyebrow}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-ivory leading-tight mb-4">
            {title}
          </h1>
          <p className="font-sans text-sm text-brand-ivory/55">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="prose-legal font-sans text-brand-navy/80 leading-relaxed space-y-8 [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-brand-navy [&_h2]:text-xl [&_h2]:mt-2 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:mb-4 [&_a]:text-brand-navy [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-gold">
            {children}
          </div>

          <div className="mt-16 pt-8 border-t border-brand-navy/10 flex flex-wrap gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 bg-brand-navy text-brand-ivory px-6 py-3 font-sans font-bold tracking-[0.15em] text-[11px] uppercase hover:bg-brand-gold hover:text-brand-navy transition-colors rounded-[2px]">
              Contact Us <ArrowRight size={14} />
            </Link>
            <Link to="/" className="inline-flex items-center gap-2 border border-brand-navy/20 text-brand-navy px-6 py-3 font-sans font-bold tracking-[0.15em] text-[11px] uppercase hover:border-brand-navy transition-colors rounded-[2px]">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
