import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, Leaf, Hand, Sparkles, Compass, Store, PackageSearch, Home as HomeIcon } from 'lucide-react';
import { absoluteUrl } from '../../lib/seo';

// ============================================================
// Amazon storefront এখনো live না। তাই এই পেজে কোথাও fake Amazon URL, fake
// "Buy Now" লিংক, fake product availability, review বা rating বসানো হয়নি।
// storefront live হলে নিচের নির্দিষ্ট জায়গাগুলোতে (হিরো CTA, Featured Collection,
// Final CTA) আসল লিংক ও প্রোডাক্ট বসাতে হবে — সেগুলো কমেন্ট দিয়ে চিহ্নিত করা আছে।
// ============================================================

const AMAZON_STOREFRONT_LIVE = false; // storefront রেডি হলে true করে দিন, ও নিচে ৩ জায়গায় real link বসান
const AMAZON_STOREFRONT_URL = ''; // যেমন: 'https://www.amazon.com/shops/jutoria'

const SHOP_CONFIDENCE = [
  { icon: ShoppingBag, title: 'Convenient Shopping', desc: 'Browse and purchase JUTORIA products through Amazon Business.' },
  { icon: ShieldCheck, title: 'Secure Checkout', desc: "Complete your purchase through Amazon's established shopping platform." },
  { icon: Truck, title: 'Reliable Fulfillment', desc: 'Enjoy Amazon-supported delivery and order tracking where available.' },
];

const WHY_JUTORIA = [
  { icon: Leaf, title: 'Natural Fibres', desc: 'Jute, seagrass and other natural materials.' },
  { icon: Hand, title: 'Handcrafted Character', desc: 'Natural variation is part of the beauty.' },
  { icon: Sparkles, title: 'Contemporary Design', desc: 'Designed for modern homes and global lifestyles.' },
];

const JOURNEY_STEPS = [
  { icon: Compass, label: 'Discover JUTORIA' },
  { icon: PackageSearch, label: 'Explore the Collection' },
  { icon: Store, label: 'Shop on Amazon Business' },
  { icon: HomeIcon, label: 'Enjoy Your Natural Home' },
];

export default function AmazonUSA() {
  return (
    <>
      <Helmet>
        <title>Shop JUTORIA on Amazon Business</title>
        <meta
          name="description"
          content="Discover JUTORIA's natural-fiber home décor collection on Amazon Business, with convenient shopping, secure checkout, and reliable delivery for wholesale and business buyers."
        />
        <link rel="canonical" href={absoluteUrl('/amazon-usa')} />
      </Helmet>

      {/* 1. HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="relative z-10 px-4 sm:px-8 lg:px-16 py-20 md:py-28 flex flex-col justify-center">
            <span className="mb-5 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
              Shop JUTORIA on Amazon Business
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.05] tracking-[-0.02em] text-brand-ivory mb-6 max-w-lg">
              JUTORIA on <br /> Amazon Business
            </h1>
            <p className="font-sans text-base md:text-lg text-brand-ivory/75 font-light leading-relaxed mb-10 max-w-md">
              Discover JUTORIA's natural-fiber home décor collection on Amazon Business — our B2B storefront for wholesale and bulk buyers, with convenient ordering, secure checkout, and reliable fulfillment.
            </p>

            {AMAZON_STOREFRONT_LIVE ? (
              <a
                href={AMAZON_STOREFRONT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px] w-fit"
              >
                Shop JUTORIA on Amazon Business <ArrowRight size={16} />
              </a>
            ) : (
              <div>
                <span className="inline-flex items-center gap-2 border border-brand-gold/40 text-brand-gold px-6 py-3 font-sans font-bold tracking-[0.2em] text-[11px] uppercase rounded-[2px]">
                  Amazon Storefront Coming Soon
                </span>
                <p className="font-sans text-sm text-brand-ivory/60 mt-4 max-w-sm">
                  Our Amazon Business storefront is being prepared. In the meantime, explore our collections or contact us for wholesale pricing and product information.
                </p>
                <div className="flex flex-wrap gap-4 mt-6">
                  <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-7 py-3.5 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/10 rounded-[2px]">
                    Explore Collection
                  </Link>
                  <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-7 py-3.5 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/10 rounded-[2px]">
                    Contact Us
                  </Link>
                </div>
              </div>
            )}
          </div>
          <div className="relative min-h-[320px] lg:min-h-[640px]">
            <img
              src="/amazon-usa-hero-premium-lifestyle.jpg"
              alt="Natural-fiber woven placemats and baskets styled on a dining table in a warm interior"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 2. AMAZON SHOPPING EXPERIENCE */}
      <section className="py-16 md:py-24 bg-brand-offwhite">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-14 text-center">
            Shop With Confidence
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {SHOP_CONFIDENCE.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white border border-brand-navy/10 p-7 rounded-[2px] text-center shadow-premium hover:shadow-premium-hover transition-shadow duration-300">
                <div className="w-12 h-12 bg-brand-navy/5 text-brand-navy flex items-center justify-center rounded-full mx-auto mb-5">
                  <Icon size={22} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif font-bold text-brand-navy mb-2">{title}</h3>
                <p className="font-sans text-sm text-brand-navy/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/*
        3. FEATURED JUTORIA COLLECTION — ইচ্ছাকৃতভাবে বাদ দেওয়া হয়েছে।
        Amazon storefront live না হওয়া পর্যন্ত এখানে কোনো প্রোডাক্ট বসানো হবে না,
        কারণ সেটা fake "SHOP ON AMAZON" লিংক তৈরি করবে যা storefront live না হওয়া
        পর্যন্ত কাজ করবে না। storefront রেডি হলে এখানে সত্যিই Amazon-এ live থাকা
        প্রোডাক্ট (ছবি + নাম + বর্ণনা + real Amazon link) বসান।
      */}

      {/* 4. WHY JUTORIA */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4">
            Natural Materials. Thoughtful Craftsmanship.
          </h2>
          <p className="font-sans text-brand-navy/65 font-light leading-relaxed max-w-2xl mx-auto mb-14">
            JUTORIA brings together natural materials, skilled Bangladeshi craftsmanship and contemporary design to create home décor with lasting character.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
            {WHY_JUTORIA.map(({ icon: Icon, title, desc }) => (
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

      {/* 5. VISUAL BRAND SECTION */}
      <section className="py-16 md:py-24 bg-brand-offwhite border-t border-brand-navy/10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-0 overflow-hidden rounded-[2px] shadow-premium">
            <img loading="lazy" decoding="async"
              src="/amazon-usa-brand-craftsmanship.jpg"
              alt="Artisan hand-weaving natural fiber products in Bangladesh"
              className="w-full h-72 lg:h-[480px] object-cover"
            />
            <div className="bg-brand-navy h-full flex flex-col justify-center px-8 sm:px-12 py-16">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-ivory mb-5 leading-tight">
                Made for Natural Living
              </h2>
              <p className="font-sans text-brand-ivory/75 font-light leading-relaxed mb-8 max-w-md">
                Every JUTORIA piece begins with a raw, natural material — sourced responsibly and hand-shaped by skilled artisans in Bangladesh.
              </p>
              <Link to="/products" className="inline-flex items-center gap-2 text-brand-gold font-sans font-bold tracking-[0.2em] text-[11px] uppercase hover:text-brand-ivory transition-colors w-fit">
                Explore Collection <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. AMAZON + JUTORIA TRUST SECTION */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-5xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-16 text-center">
            Your JUTORIA Journey
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-10 sm:gap-4">
            {JOURNEY_STEPS.map(({ icon: Icon, label }, i) => (
              <div key={label} className="flex sm:flex-col items-center gap-4 sm:gap-0 text-center">
                <div className="w-14 h-14 bg-brand-navy/5 text-brand-navy flex items-center justify-center rounded-full sm:mb-4 flex-shrink-0">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <p className="font-sans text-sm font-bold text-brand-navy tracking-wide">{label}</p>
                {i < JOURNEY_STEPS.length - 1 && (
                  <ArrowRight size={18} className="hidden sm:block text-brand-navy/20 mt-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. AMAZON STOREFRONT CTA */}
      <section className="py-20 md:py-28 bg-brand-navy text-center">
        <div className="container mx-auto max-w-2xl px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-ivory mb-5 leading-tight">
            Bring Natural Living Home.
          </h2>
          <p className="font-sans text-brand-ivory/70 font-light leading-relaxed mb-10">
            Explore JUTORIA's collection on Amazon Business.
          </p>
          {AMAZON_STOREFRONT_LIVE ? (
            <a
              href={AMAZON_STOREFRONT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]"
            >
              Shop JUTORIA on Amazon Business <ArrowRight size={16} />
            </a>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <span className="inline-flex items-center gap-2 border border-brand-gold/40 text-brand-gold px-6 py-3 font-sans font-bold tracking-[0.2em] text-[11px] uppercase rounded-[2px]">
                Amazon Storefront Coming Soon
              </span>
              <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/10 rounded-[2px]">
                Explore Collection
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
