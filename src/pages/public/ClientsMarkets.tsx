import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Store, PenTool, Building2, Package, Leaf, Hammer, Layers, Handshake, Star } from 'lucide-react';
import { marketRegions, testimonials } from '../../data/globalMarkets';
import { absoluteUrl } from '../../lib/seo';

// ============================================================
// এই পেজে কোথাও অ-যাচাইকৃত claim ("largest market", "X years experience",
// নির্দিষ্ট certification) বসানো হয়নি। মার্কেট তালিকা সোর্স স্ক্রিনশট অনুযায়ী
// হুবহু রাখা হয়েছে, নিজে থেকে reorganize করা হয়নি।
// ============================================================

function flagUrl(code: string) {
  return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

// দেশের নামের পাশে পতাকা দেখানোর জন্য ISO কোড ম্যাপ
const COUNTRY_CODES: Record<string, string> = {
  Germany: 'DE',
  Netherlands: 'NL',
  Denmark: 'DK',
  France: 'FR',
  Italy: 'IT',
  Poland: 'PL',
  Norway: 'NO',
  'United Kingdom': 'GB',
  'United States of America': 'US',
  Canada: 'CA',
  Turkey: 'TR',
  Japan: 'JP',
  'Saudi Arabia': 'SA',
  'United Arab Emirates': 'AE',
  Qatar: 'QA',
  Kuwait: 'KW',
  Oman: 'OM',
  Brazil: 'BR',
  Argentina: 'AR',
};

const WHO_WE_SERVE = [
  { icon: Store, title: 'Retailers', desc: 'Boutique stores, home décor retailers and lifestyle retailers.' },
  { icon: PenTool, title: 'Interior Designers', desc: 'Design professionals seeking distinctive natural-fiber products.' },
  { icon: Building2, title: 'Hospitality', desc: 'Hotels, resorts, restaurants and hospitality projects.' },
  { icon: Package, title: 'Wholesale Buyers', desc: 'Importers, distributors and businesses sourcing natural home décor at scale.' },
];

const WHY_CHOOSE = [
  { icon: Leaf, title: 'Natural Materials', desc: 'Authentic jute, seagrass and other natural fibers.' },
  { icon: Hammer, title: 'Handcrafted Quality', desc: 'Traditional craftsmanship combined with consistent quality standards.' },
  { icon: Layers, title: 'Flexible Collections', desc: 'Products suitable for retail, hospitality and interior projects.' },
  { icon: Handshake, title: 'Wholesale Partnership', desc: 'Built for long-term B2B relationships and international sourcing.' },
];

export default function ClientsMarkets() {
  return (
    <>
      <Helmet>
        <title>Global Clients & Markets | JUTORIA</title>
        <meta
          name="description"
          content="From Bangladesh to international markets, JUTORIA connects natural-fiber craftsmanship with retailers, designers, hospitality businesses and wholesale buyers worldwide."
        />
        <link rel="canonical" href={absoluteUrl('/clients-markets')} />
      </Helmet>

      {/* 01. HERO */}
      <section className="relative bg-brand-navy overflow-hidden min-h-[52vh] flex items-end">
        <div className="absolute inset-0">
          <img src="/global-clients-hero.jpg" alt="Natural-fiber home décor styled in a warm dining interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/70 to-brand-navy/20" />
        </div>
        <div className="relative z-10 container mx-auto max-w-4xl px-4 pt-28 md:pt-36 pb-14 md:pb-20">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-ivory leading-tight mb-6 max-w-2xl">
            Global Reach. Trusted Craftsmanship.
          </h1>
          <p className="font-sans text-base md:text-lg text-brand-ivory/80 font-light leading-relaxed max-w-xl">
            From Bangladesh to international markets, JUTORIA connects authentic natural-fiber craftsmanship with retailers, designers, hospitality businesses, and conscious consumers around the world.
          </p>
        </div>
      </section>

      {/* 02. GLOBAL MARKET REACH */}
      <section className="py-16 md:py-24 bg-brand-offwhite">
        <div className="container mx-auto max-w-4xl px-4 text-center mb-14">
          <span className="mb-4 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
            Our Global Reach
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-5">
            Serving Markets Across Continents
          </h2>
          <p className="font-sans text-brand-navy/65 font-light leading-relaxed max-w-2xl mx-auto">
            Our natural-fiber collections are positioned for international markets where craftsmanship, sustainable materials, and thoughtfully designed home décor are valued.
          </p>
        </div>

        {/* 03–06. REGION CARDS */}
        <div className="container mx-auto max-w-6xl px-4 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
          {marketRegions.map((region) => (
            <div key={region.id} className="bg-white border border-brand-navy/10 p-7 md:p-8 rounded-[2px] shadow-premium">
              <h3 className="font-serif font-bold text-xl text-brand-navy mb-5">{region.name}</h3>
              <div className="flex flex-wrap gap-2">
                {region.countries.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1.5 bg-brand-offwhite border border-brand-navy/10 text-brand-navy/80 text-xs font-sans px-3 py-1.5 rounded-full">
                    <img src={flagUrl(COUNTRY_CODES[c] ?? '')} alt={`${c} flag`} className="w-4 h-3 object-cover rounded-[1px]" loading="lazy" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 07. MARKET MAP */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4">
              From Bangladesh to the World
            </h2>
            <p className="font-sans text-brand-navy/65 font-light leading-relaxed max-w-2xl mx-auto">
              Rooted in Bangladeshi craftsmanship, JUTORIA is built for homes, retailers, designers, and businesses across international markets.
            </p>
          </div>
          <img loading="lazy" decoding="async"
            src="/global-market-reach-map.jpg"
            alt="Stylized world map showing JUTORIA's international market regions"
            className="w-full h-auto rounded-[2px] shadow-premium"
          />
        </div>
      </section>

      {/* 08. WHO WE SERVE */}
      <section className="py-16 md:py-24 bg-brand-offwhite border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-14 text-center">
            Who We Work With
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center">
            <div className="lg:col-span-2">
              <img loading="lazy" decoding="async"
                src="/global-b2b-audience.jpg"
                alt="JUTORIA pieces in retail display, hospitality and design settings"
                className="w-full h-72 lg:h-full object-cover rounded-[2px] shadow-premium"
              />
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {WHO_WE_SERVE.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-white border border-brand-navy/10 p-6 rounded-[2px] shadow-premium hover:shadow-premium-hover transition-shadow duration-300">
                  <div className="w-11 h-11 bg-brand-navy/5 text-brand-navy flex items-center justify-center rounded-full mb-4">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif font-bold text-brand-navy mb-1.5">{title}</h3>
                  <p className="font-sans text-xs text-brand-navy/60 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 09. WHY INTERNATIONAL BUYERS CHOOSE JUTORIA */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-14 text-center">
            Crafted for Global Markets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_CHOOSE.map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div className="w-12 h-12 bg-brand-navy text-brand-gold flex items-center justify-center rounded-full mb-5">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif font-bold text-brand-navy mb-2">{title}</h3>
                <p className="font-sans text-sm text-brand-navy/65 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT OUR INTERNATIONAL PARTNERS SAY — verified client testimonials */}
      <section className="py-16 md:py-24 bg-brand-offwhite border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-14 text-center">
            What Our International Partners Say
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {testimonials.map((t) => (
              <div key={t.country} className="bg-white border border-brand-navy/10 p-8 md:p-10 rounded-[2px] shadow-premium flex flex-col">
                <span className="font-serif text-5xl text-brand-gold/40 leading-none mb-2">"</span>
                <p className="font-sans text-brand-navy/80 leading-relaxed mb-6 flex-grow">{t.quote}</p>
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className="fill-brand-gold text-brand-gold" />
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-brand-navy/10">
                  <img src={flagUrl(t.countryCode)} alt={`${t.country} flag`} className="w-8 h-6 object-cover rounded-[2px] shadow-sm" loading="lazy" />
                  <div>
                    <p className="font-sans text-xs font-bold uppercase tracking-wide text-brand-navy">From {t.country}</p>
                    <p className="font-sans text-xs text-brand-navy/55">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. BANGLADESH TO GLOBAL */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 overflow-hidden rounded-[2px] shadow-premium">
            <img loading="lazy" decoding="async"
              src="/bangladesh-craftsmanship-global.jpg"
              alt="Artisan hand-weaving natural fiber baskets in Bangladesh"
              className="w-full h-72 lg:h-[440px] object-cover"
            />
            <div className="bg-brand-navy h-full flex flex-col justify-center px-8 sm:px-12 py-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-ivory mb-5 leading-tight">
                Rooted in Bangladesh. <br /> Designed for the World.
              </h2>
              <p className="font-sans text-brand-ivory/75 font-light leading-relaxed max-w-md">
                JUTORIA brings the character of natural materials and skilled craftsmanship from Bangladesh to contemporary spaces around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. GLOBAL INQUIRY CTA */}
      <section className="py-20 md:py-28 bg-brand-navy text-center">
        <div className="container mx-auto max-w-2xl px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-ivory mb-5 leading-tight">
            Looking for a Wholesale Partner?
          </h2>
          <p className="font-sans text-brand-ivory/70 font-light leading-relaxed mb-10">
            Tell us about your market, product requirements, and sourcing needs. Our team will be ready to discuss the right collection for your business.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]">
              Request A Wholesale Quote <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/10 rounded-[2px]">
              Explore Our Collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
