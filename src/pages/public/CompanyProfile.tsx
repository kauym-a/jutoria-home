import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Hammer, PenTool, Globe2 } from 'lucide-react';
import { absoluteUrl } from '../../lib/seo';

const APPROACH_STEPS = [
  { icon: Leaf, label: 'Natural Materials' },
  { icon: Hammer, label: 'Skilled Craftsmanship' },
  { icon: PenTool, label: 'Thoughtful Design' },
  { icon: Globe2, label: 'Global Home Décor' },
];

const JOURNEY_STEPS = ['Natural Material', 'Artisan Craft', 'Finished Product', 'Global Customer'];

export default function CompanyProfile() {
  return (
    <>
      <Helmet>
        <title>Company Profile | JUTORIA</title>
        <meta
          name="description"
          content="JUTORIA is a premium eco-friendly natural home décor brand, operated by Sircommerce Group Ltd (UK Company No. 17029469)."
        />
        <link rel="canonical" href={absoluteUrl('/company-profile')} />
      </Helmet>

      {/* 1. HERO */}
      <section className="relative w-full min-h-[68vh] flex items-end bg-brand-navy overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/jute-basket-lifestyle.jpg')" }}
          role="img"
          aria-label="Handwoven natural-fiber home décor by JUTORIA"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/20" />
        <div className="relative z-10 container mx-auto max-w-5xl px-4 pt-28 md:pt-36 pb-16 md:pb-24">
          <span className="block font-sans text-[11px] md:text-xs font-bold tracking-[0.24em] text-brand-gold uppercase mb-6">
            Company
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-[4.2rem] font-serif font-bold text-brand-ivory leading-[1.05] max-w-3xl mb-6">
            Natural Materials.<br />Thoughtful Craftsmanship.
          </h1>
          <p className="max-w-2xl font-sans text-base md:text-lg text-brand-ivory/85 font-light leading-relaxed">
            JUTORIA exists at the intersection of raw natural material and considered design — taking jute, seagrass, bamboo and other fibers native to Bangladesh, and shaping them by hand into home décor built for modern living.
          </p>
        </div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div>
              <span className="block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase mb-5">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                A brand built on material, craft and intent.
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/75 font-light leading-relaxed mb-5">
                JUTORIA is a premium eco-friendly home décor brand rooted in natural materials — jute, seagrass, bamboo, water hyacinth, cane &amp; rattan, hogla leaf and kans grass. Every piece begins as a raw fiber and is shaped by skilled hands into a finished product for the home.
              </p>
              <p className="font-sans text-base md:text-lg text-brand-navy/75 font-light leading-relaxed">
                Our vision is an international one: thoughtfully designed, naturally made products that fit modern living spaces, brought to a global audience through considered design and honest materials.
              </p>
            </div>
            <div
              className="aspect-[4/3] rounded-[2px] bg-cover bg-center shadow-premium"
              style={{ backgroundImage: "url('/laundry-basket-lifestyle.jpg')" }}
              role="img"
              aria-label="Natural fiber craftsmanship in a JUTORIA product"
            />
          </div>
        </div>
      </section>

      {/* 3. JUTORIA + SIRCOMMERCE GROUP LTD */}
      <section className="py-20 md:py-24 bg-white border-y border-brand-navy/10">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase mb-5">
            Corporate Foundation
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-8">
            JUTORIA &amp; Sircommerce Group Ltd
          </h2>
          <p className="font-sans text-base md:text-lg text-brand-navy/75 font-light leading-relaxed max-w-2xl mx-auto">
            JUTORIA is the brand identity for premium eco-friendly natural home décor, operated by{' '}
            <strong className="font-semibold text-brand-navy">Sircommerce Group Ltd</strong>, a company registered
            in the United Kingdom under Company No.{' '}
            <strong className="font-semibold text-brand-navy">17029469</strong>.
          </p>
        </div>
      </section>

      {/* 4. OUR BUSINESS APPROACH */}
      <section className="py-20 md:py-28 bg-brand-offwhite">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase mb-5">
              Our Business Approach
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight">
              From raw fiber to finished home décor.
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
            {APPROACH_STEPS.map((step, i) => (
              <div key={step.label} className="flex flex-col md:flex-row items-center gap-6 md:gap-4 w-full md:w-auto">
                <div className="flex flex-col items-center text-center w-full md:w-40">
                  <div className="w-16 h-16 rounded-full border-2 border-brand-gold/40 flex items-center justify-center mb-4 bg-white">
                    <step.icon size={26} className="text-brand-gold" strokeWidth={1.5} />
                  </div>
                  <span className="font-sans text-sm font-bold text-brand-navy uppercase tracking-wide">
                    {step.label}
                  </span>
                </div>
                {i < APPROACH_STEPS.length - 1 && (
                  <ArrowRight size={20} className="hidden md:block text-brand-navy/20 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FROM MATERIAL TO MARKET */}
      <section className="py-20 md:py-28 bg-brand-navy">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-16">
            <span className="block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase mb-5">
              From Material to Market
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-ivory leading-tight max-w-2xl mx-auto">
              Every product carries a journey — from the field to your customer.
            </h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-2 mb-14">
            {JOURNEY_STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3 md:gap-2">
                <span className="font-sans text-xs md:text-sm font-bold uppercase tracking-widest text-brand-ivory/90 border border-brand-gold/30 rounded-full px-5 py-2.5 whitespace-nowrap">
                  {step}
                </span>
                {i < JOURNEY_STEPS.length - 1 && <ArrowRight size={16} className="text-brand-gold/50 flex-shrink-0" />}
              </div>
            ))}
          </div>

          <p className="max-w-2xl mx-auto text-center font-sans text-base text-brand-ivory/70 font-light leading-relaxed">
            Natural material is selected first — then shaped by artisan hands into a finished product, and made
            available to customers around the world who are looking for home décor with a genuine material story
            behind it.
          </p>
        </div>
      </section>

      {/* 6. GLOBAL VISION */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase mb-5">
            Global Vision
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-navy leading-tight mb-8">
            Built for Modern Living.<br />Ready for the World.
          </h2>
          <p className="font-sans text-base md:text-lg text-brand-navy/75 font-light leading-relaxed max-w-2xl mx-auto">
            JUTORIA's commercial focus begins with the United States, with the United Kingdom, Canada and
            international markets as natural next steps. The brand is built to travel — natural materials and
            considered design translate across markets and living spaces.
          </p>
        </div>
      </section>

      {/* 7. PEOPLE / ARTISANS PREVIEW */}
      <section className="py-20 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <span className="block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase mb-5">
            The People Behind JUTORIA
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
            Every piece is made by hand — by someone.
          </h2>
          <p className="font-sans text-base text-brand-navy/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Behind every JUTORIA product is an artisan's hands and a skill passed down through practice. Meet the
            people who make the collection.
          </p>
          <Link
            to="/people"
            className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-navy border-b-2 border-brand-gold pb-1 hover:text-brand-gold transition-colors duration-300"
          >
            Meet Our Artisans <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 8. CORPORATE INFORMATION */}
      <section className="py-16 bg-brand-offwhite border-t border-brand-navy/10">
        <div className="container mx-auto max-w-3xl px-4">
          <div className="bg-white border border-brand-navy/10 rounded-[2px] shadow-premium p-8 md:p-10 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6">
            {[
              ['Company', 'Sircommerce Group Ltd'],
              ['Company No.', '17029469'],
              ['Brand', 'JUTORIA'],
              ['Positioning', 'Premium Eco-Friendly Natural Home Décor'],
              ['Primary Market', 'USA'],
            ].map(([label, value]) => (
              <div key={label}>
                <span className="block font-sans text-[10.5px] font-bold uppercase tracking-[0.18em] text-brand-navy/45 mb-1.5">
                  {label}
                </span>
                <span className="block font-sans text-base font-semibold text-brand-navy">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA */}
      <section className="py-20 md:py-24 bg-brand-navy">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-ivory leading-tight mb-10">
            Explore the collection, or start a wholesale conversation.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]"
            >
              Explore Products <ArrowRight size={16} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/10 rounded-[2px]"
            >
              Wholesale Inquiry <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
