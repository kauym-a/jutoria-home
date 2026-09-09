import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { materials } from '../../data/materials';

export default function Materials() {
  return (
    <>
      <Helmet>
        <title>Our Materials | JUTORIA - Natural Fibers of Bangladesh</title>
        <meta name="description" content="Jute, seagrass, bamboo, hogla leaf, cane & rattan, water hyacinth and kans grass — the natural fibers behind every JUTORIA piece." />
      </Helmet>

      <section className="border-b border-brand-navy/10 bg-[#f7f4ee]">
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-20 lg:py-24">
          <span className="mb-5 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
            Materials
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-serif font-bold leading-[0.95] tracking-[-0.03em] text-brand-navy mb-6 max-w-3xl">
            Seven Natural Fibers. One Craft Tradition.
          </h1>
          <p className="max-w-2xl font-sans text-base md:text-lg text-brand-navy/75 font-light leading-relaxed">
            Every JUTORIA piece begins with a raw, natural material — sourced responsibly across Bangladesh and shaped entirely by hand.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-brand-offwhite">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {materials.map((material) => (
              <Link
                to={`/materials/${material.slug}`}
                key={material.id}
                className="group relative p-8 md:p-10 border-2 border-brand-navy/10 hover:border-brand-gold transition-all duration-500 rounded-[2px] overflow-hidden flex flex-col justify-end min-h-[320px] shadow-premium hover:shadow-premium-hover"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(17, 18, 16, 0.22) 0%, rgba(17, 18, 16, 0.62) 100%), url(${material.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <span className="absolute top-6 right-8 font-serif text-6xl font-bold text-brand-ivory/25 group-hover:text-brand-gold/60 transition-colors duration-500">
                  {material.id}
                </span>
                <div className="relative z-10">
                  <h3 className="text-2xl font-serif font-bold mb-3 text-brand-ivory flex items-center gap-3">
                    {material.name}
                    <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-gold" />
                  </h3>
                  <p className="font-sans font-light leading-relaxed text-brand-ivory/85 text-sm">
                    {material.desc}
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
