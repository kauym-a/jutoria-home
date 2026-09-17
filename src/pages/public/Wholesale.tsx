import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Store,
  Ship,
  PenTool,
  Building2,
  Home as HomeIcon,
  Leaf,
  Compass,
  ClipboardCheck,
  Handshake,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { useLeadForm } from '../../hooks/useLeadForm';
import { absoluteUrl } from '../../lib/seo';

// ============================================================
// সেকশন অর্ডার (conversion-flow অনুযায়ী পুনর্বিন্যাস করা হয়েছে): Hero → Who We Serve →
// What We Offer → Featured Collection → Materials & Craftsmanship → Why JUTORIA →
// Process (How Wholesale Works) → FAQ → Inquiry Form (পেজের একদম শেষ, একমাত্র
// conversion point)।
//
// FAQ ইচ্ছাকৃতভাবে ফর্মের ঠিক আগে — pricing/"কীভাবে শুরু করব" মতো প্রশ্নের উত্তর
// visitor ফর্ম পূরণের আগেই পাওয়া দরকার। "Explore CTA" ও "Final CTA" সেকশন দুটো
// (দুটোই শুধু Hero-র CTA-জোড়ার পুনরাবৃত্তি, নতুন কোনো তথ্য ছিল না) সম্পূর্ণ বাদ
// দেওয়া হয়েছে — ফর্মের পরে বা আগে অতিরিক্ত CTA থাকলে ভিজিটর কোথায় ক্লিক করবে
// confuse হতো এবং ফর্মটাই যে চূড়ান্ত পদক্ষেপ সেটা স্পষ্ট থাকত না।
//
// কোনো fabricated MOQ/lead-time/shipping প্রতিশ্রুতি এখানে নেই — যেগুলো এখনো
// verified commercial policy হিসেবে ঠিক হয়নি, সেগুলো ইচ্ছাকৃতভাবে বাদ দেওয়া হয়েছে।
// ============================================================

const AUDIENCES = [
  { icon: Store, name: 'Retailers', desc: 'Home décor and lifestyle stores looking for a natural-fiber range to add to their shelves.' },
  { icon: Ship, name: 'Importers & Distributors', desc: 'Bulk buyers sourcing directly from Bangladesh for onward distribution.' },
  { icon: PenTool, name: 'Interior Designers', desc: 'Designers sourcing natural textures and forms for residential and commercial projects.' },
  { icon: Building2, name: 'Hospitality', desc: 'Hotels and hospitality brands furnishing spaces with handcrafted natural pieces.' },
  { icon: HomeIcon, name: 'Lifestyle & Home Brands', desc: 'Brands building out a natural-living product line under their own label.' },
];

const OFFER_CARDS = [
  {
    name: 'Jute',
    desc: 'Placemats, rugs, baskets and home décor woven from natural jute.',
    image: '/product-master/jute-cotton-natural/jute-cotton-natural-lifestyle.webp',
    link: '/materials/jute',
  },
  {
    name: 'Sea Grass',
    desc: 'Placemats, baskets and natural décor pieces woven from seagrass.',
    image: '/product-master/sea-grass-natura/sea-grass-natural-lifestyle.webp',
    link: '/materials/seagrass',
  },
  {
    name: 'Natural Fiber Home Décor',
    desc: 'Storage, planters, table décor and floor décor across our natural-fiber range.',
    image: '/jute-basket-lifestyle.webp',
    link: '/categories',
  },
];

// Featured products — pulled from real catalogue SKUs, not placeholder data.
// Two already have professional photography; the other two link through to their
// category until their own product photography is ready.
const FEATURED_PRODUCTS = [
  {
    sku: 'JTR-JPM-NAT-RND-14-S6',
    name: 'Jute Placemats',
    variant: 'Natural / Round / 14"',
    image: '/product-master/jute-cotton-natural/jute-cotton-natural-single.webp',
    width: 1000,
    height: 1000,
    link: '/product/JTR-JPM-NAT-RND-14-S6',
    hasPhoto: true,
  },
  {
    sku: 'JTR-SPM-NAT-RND-14-S6',
    name: 'Seagrass Placemats',
    variant: 'Natural / Round / 14"',
    image: '/product-master/sea-grass-natura/sea-grass-natural.webp',
    width: 1000,
    height: 1000,
    link: '/product/JTR-SPM-NAT-RND-14-S6',
    hasPhoto: true,
  },
  {
    sku: 'JTR-JPB-A',
    name: 'Jute Planter Baskets',
    variant: 'Natural / Set of 3',
    image: '/jute-basket-product.webp',
    width: 1000,
    height: 1250,
    link: '/categories/planter-baskets',
    hasPhoto: false,
  },
  {
    sku: 'JTR-JFR-RND90',
    name: 'Jute Area Rugs',
    variant: 'Round / 90cm',
    image: null,
    width: null,
    height: null,
    link: '/categories/floor-mats-rugs',
    hasPhoto: false,
  },
];

const WHY_PILLARS = [
  { icon: Leaf, title: 'Natural Material Focus', desc: 'A natural-fiber home décor collection, sourced and woven from jute, seagrass and other regional materials.' },
  { icon: Compass, title: 'Design-Led Collection', desc: 'Products positioned for contemporary interiors, not just traditional handicraft.' },
  { icon: Handshake, title: 'Wholesale-Focused Service', desc: 'A dedicated path for business buyers, separate from retail browsing.' },
  { icon: ClipboardCheck, title: 'Flexible Product Selection', desc: 'Product selection and configuration can be discussed according to wholesale requirements, where available.' },
];

const PROCESS_STEPS = [
  { num: '01', title: 'Discover', desc: 'Explore the products and materials in our collection.' },
  { num: '02', title: 'Inquire', desc: 'Tell us what you are looking for and a little about your business.' },
  { num: '03', title: 'Discuss', desc: 'Our team reviews your requirements and gets in touch.' },
  { num: '04', title: 'Move Forward', desc: 'Discuss product selection, quantities and commercial requirements together.' },
];

const BUSINESS_TYPES = ['Retailer', 'Importer', 'Distributor', 'Interior Designer', 'Hospitality', 'Lifestyle Brand', 'Other'];

const FAQS = [
  {
    q: 'What types of products are available for wholesale?',
    a: 'Our current range spans placemats, planter baskets, laundry baskets, organizer baskets and floor mats/rugs — browse the full Collection to see what\u2019s available.',
  },
  {
    q: 'What materials are available?',
    a: 'Jute and seagrass are the materials currently used across our active product range. We work with other natural fibers as well — get in touch to discuss availability.',
  },
  {
    q: 'Can product configurations or designs be discussed?',
    a: 'Yes, where supported — sizes, colors and configurations can be discussed as part of your wholesale inquiry, depending on the specific product.',
  },
  {
    q: 'How do I request wholesale pricing?',
    a: 'Submit a wholesale inquiry below with your product interest and estimated quantity, and our team will follow up with next steps.',
  },
  {
    q: 'How do I start a wholesale relationship with JUTORIA?',
    a: 'Start with the inquiry form on this page, or email us directly — we\u2019ll review your requirements and reach out to discuss further.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-brand-navy/10">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-6 text-left"
      >
        <span className="font-serif text-lg md:text-xl font-bold text-brand-navy">{q}</span>
        <ChevronDown size={20} className={`flex-shrink-0 text-brand-gold transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="font-sans text-brand-navy/70 leading-relaxed pb-6 max-w-3xl">{a}</p>
      )}
    </div>
  );
}

export default function Wholesale() {
  const { values, setField, submitting, submitted, handleSubmit } = useLeadForm('wholesale');

  return (
    <>
      <Helmet>
        <title>Wholesale | JUTORIA - Natural Fiber Home Décor for B2B Buyers</title>
        <meta
          name="description"
          content="JUTORIA supplies natural-fiber home décor — jute and seagrass placemats, baskets and floor décor — to retailers, importers, designers and hospitality businesses."
        />
        <link rel="canonical" href={absoluteUrl('/wholesale')} />
        {/* LCP ইমেজ (hero) — PageSpeed Insights রিপোর্টে LCP 8.8s ফ্ল্যাগ হয়েছিল।
            preload দিলে ব্রাউজার JS পার্স/এক্সিকিউট হওয়ার জন্য অপেক্ষা না করেই এই
            ইমেজের ডাউনলোড শুরু করে দেয় (HTML parser নিজেই <head> স্ক্যান করার সময় এটা
            ধরে ফেলে) — নিচের <img fetchPriority="high"> এর সাথে মিলিয়ে ব্যবহার করা হয়েছে। */}
        <link
          rel="preload"
          as="image"
          href="/wholesale-hero-natural-home-decor.webp"
          imageSrcSet="/wholesale-hero-natural-home-decor-640w.webp 640w, /wholesale-hero-natural-home-decor-960w.webp 960w, /wholesale-hero-natural-home-decor.webp 1774w"
          imageSizes="(max-width: 1023px) 100vw, 50vw"
          fetchPriority="high"
          type="image/webp"
        />
      </Helmet>

      {/* 1. HERO */}
      <section className="relative bg-brand-navy overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
          <div className="relative z-10 px-4 sm:px-8 lg:px-16 py-20 md:py-28 flex flex-col justify-center">
            <span className="mb-5 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
              JUTORIA Wholesale
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-[1.05] tracking-[-0.02em] text-brand-ivory mb-6 max-w-xl">
              Natural Products. <br /> Made for Modern Retail.
            </h1>
            <p className="font-sans text-base md:text-lg text-brand-ivory/75 font-light leading-relaxed mb-10 max-w-md">
              Discover JUTORIA's natural-fiber home décor collection for retailers, designers, hospitality businesses and other wholesale buyers.
            </p>
            <div className="flex flex-wrap gap-4">
              {/* এই পেজেরই নিচে, এখন পেজের একদম শেষে থাকা ফর্মে (#wholesale-inquiry) নিয়ে যায় —
                  আগে ভুলবশত /contact পেজে চলে যেত, এই পেজের নিজস্ব ফর্মে না গিয়ে। */}
              <a href="#wholesale-inquiry" className="inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]">
                Request A Wholesale Quote <ArrowRight size={16} />
              </a>
              <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/10 rounded-[2px]">
                Explore Products
              </Link>
            </div>
          </div>
          <div className="relative min-h-[320px] lg:min-h-[640px]">
            <img
              src="/wholesale-hero-natural-home-decor.webp"
              srcSet="/wholesale-hero-natural-home-decor-640w.webp 640w, /wholesale-hero-natural-home-decor-960w.webp 960w, /wholesale-hero-natural-home-decor.webp 1774w"
              sizes="(max-width: 1023px) 100vw, 50vw"
              alt="Natural-fiber woven placemats, baskets and décor styled in a warm, modern interior"
              className="absolute inset-0 w-full h-full object-cover"
              width={1774}
              height={887}
              fetchPriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/40 via-transparent to-transparent lg:hidden" />
          </div>
        </div>
      </section>

      {/* 2. WHO WE SERVE */}
      <section className="py-16 md:py-24 bg-brand-offwhite">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4 text-center max-w-2xl mx-auto">
            Built for Businesses That Value Natural Design
          </h2>
          <div className="h-px w-16 bg-brand-gold mx-auto mb-14" />

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-center mb-14">
            <div className="lg:col-span-2">
              <img loading="lazy" decoding="async"
                src="/wholesale-businesses-collage.webp"
                srcSet="/wholesale-businesses-collage-640w.webp 640w, /wholesale-businesses-collage.webp 1000w"
                sizes="(max-width: 1023px) 100vw, 40vw"
                alt="JUTORIA natural-fiber pieces in retail display, hospitality and design settings"
                className="w-full h-72 lg:h-full object-cover rounded-[2px] shadow-premium"
                width={1000}
                height={667}
              />
            </div>
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {AUDIENCES.map(({ icon: Icon, name, desc }) => (
                <div key={name} className="bg-white border border-brand-navy/10 p-6 rounded-[2px] shadow-premium hover:shadow-premium-hover transition-shadow duration-300">
                  <div className="w-11 h-11 bg-brand-navy/5 text-brand-navy flex items-center justify-center rounded-full mb-4">
                    <Icon size={20} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-serif font-bold text-brand-navy mb-1.5">{name}</h3>
                  <p className="font-sans text-xs text-brand-navy/70 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT WE OFFER */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-7xl px-4">
          {/* brand-gold (#C89B3C) ফুল অপাসিটিতে সাদা/অফহোয়াইট ব্যাকগ্রাউন্ডে ~2.6:1 কন্ট্রাস্ট
              দেয় — WCAG AA-এর 4.5:1 থ্রেশহোল্ডে ফেল করে (PageSpeed accessibility audit-এ
              ফ্ল্যাগ হয়েছিল)। darker গোল্ড শেড (#8a6a29, ~5.5:1) ব্যবহার করা হচ্ছে যাতে
              ব্র্যান্ড অ্যাকসেন্ট-এর লুক থাকে কিন্তু পড়া যায়। নেভি হেডিং-এর সাথে না
              মেলায় visual hierarchy-ও বজায় থাকে। hero সেকশনের একই প্যাটার্নের eyebrow
              (line ~201) touch করা হয়নি — ওটা navy ব্যাকগ্রাউন্ডে আছে, যেখানে ফুল-অপাসিটি
              gold-ই যথেষ্ট কন্ট্রাস্ট দেয় (~6.2:1)। */}
          <span className="mb-4 block font-sans text-[11px] font-bold tracking-[0.24em] text-[#8a6a29] uppercase text-center">
            What We Offer
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-14 text-center max-w-2xl mx-auto">
            A Collection Rooted in Natural Materials
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {OFFER_CARDS.map((card) => (
              <Link
                to={card.link}
                key={card.name}
                className="group relative min-h-[320px] flex flex-col justify-end p-8 border-2 border-brand-navy/10 hover:border-brand-gold transition-all duration-500 rounded-[2px] overflow-hidden shadow-premium hover:shadow-premium-hover"
                style={{
                  backgroundImage: `linear-gradient(180deg, rgba(10,35,66,0.15) 0%, rgba(10,35,66,0.75) 100%), url(${card.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <h3 className="text-xl font-serif font-bold text-brand-ivory mb-2 flex items-center gap-2">
                  {card.name}
                  <ArrowRight size={16} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-gold" />
                </h3>
                <p className="font-sans text-sm text-brand-ivory/85 font-light leading-relaxed">{card.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FEATURED WHOLESALE COLLECTION */}
      <section className="py-16 md:py-24 bg-brand-offwhite border-t border-brand-navy/10">
        <div className="container mx-auto max-w-7xl px-4">
          <span className="mb-4 block font-sans text-[11px] font-bold tracking-[0.24em] text-[#8a6a29] uppercase text-center">
            Featured Wholesale Collection
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-14 text-center max-w-2xl mx-auto">
            Explore Our Wholesale Collection
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {FEATURED_PRODUCTS.map((p) => (
              <div key={p.sku} className="bg-white border border-brand-navy/10 rounded-[2px] overflow-hidden shadow-premium hover:shadow-premium-hover transition-shadow duration-300 flex flex-col">
                <div
                  className="aspect-[4/5] bg-brand-navy/5 flex items-center justify-center"
                  style={!p.image ? { background: 'linear-gradient(160deg, #1a2e29 0%, #0f1a17 100%)' } : undefined}
                >
                  {p.image ? (
                    <img loading="lazy" decoding="async" src={p.image} alt={p.name} width={p.width ?? undefined} height={p.height ?? undefined} className="w-full h-full object-contain p-4" />
                  ) : (
                    <span className="font-sans text-[11px] tracking-[0.2em] uppercase text-brand-ivory/50 px-6 text-center">
                      Photography coming soon
                    </span>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-serif font-bold text-brand-navy mb-1">{p.name}</h3>
                  <p className="font-sans text-xs text-brand-navy/70 mb-4">{p.variant}</p>
                  <div className="mt-auto flex flex-col gap-2">
                    <Link to={p.link} className="text-center text-[11px] font-sans font-bold tracking-[0.15em] uppercase border border-brand-navy/20 text-brand-navy px-4 py-2.5 hover:border-brand-navy transition-colors rounded-[2px]">
                      {p.hasPhoto ? 'View Product' : 'View Category'}
                    </Link>
                    <Link to="/contact" className="text-center text-[11px] font-sans font-bold tracking-[0.15em] uppercase bg-brand-navy text-brand-ivory px-4 py-2.5 hover:bg-brand-gold hover:text-brand-navy transition-colors rounded-[2px]">
                      Wholesale Inquiry
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MATERIALS & CRAFTSMANSHIP */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="mb-4 block font-sans text-[11px] font-bold tracking-[0.24em] text-[#8a6a29] uppercase">
                Materials & Craftsmanship
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-8 leading-tight">
                From Natural Fibre to Finished Form
              </h2>
              <div className="space-y-8">
                <div>
                  <h3 className="font-serif font-bold text-brand-navy mb-1.5">Natural Materials</h3>
                  <p className="font-sans text-sm text-brand-navy/65 leading-relaxed">Natural-fiber products selected for contemporary home environments.</p>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-brand-navy mb-1.5">Skilled Craftsmanship</h3>
                  <p className="font-sans text-sm text-brand-navy/65 leading-relaxed">Handmade and hand-finished techniques, where applicable.</p>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-brand-navy mb-1.5">Thoughtful Design</h3>
                  <p className="font-sans text-sm text-brand-navy/65 leading-relaxed">Natural textures and forms designed for modern spaces.</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img loading="lazy" decoding="async"
                src="/jutoria-artisans-weaving.webp"
                srcSet="/jutoria-artisans-weaving-480w.webp 480w, /jutoria-artisans-weaving.webp 1000w"
                sizes="(max-width: 1023px) 50vw, 25vw"
                alt="Artisan hand-weaving a natural fiber product"
                className="w-full h-64 md:h-80 object-cover rounded-[2px]"
                width={1000}
                height={558}
              />
              <img loading="lazy" decoding="async"
                src="/jutoria-story-natural-materials.webp"
                srcSet="/jutoria-story-natural-materials-480w.webp 480w, /jutoria-story-natural-materials.webp 1000w"
                sizes="(max-width: 1023px) 50vw, 25vw"
                alt="Natural fiber raw materials"
                className="w-full h-64 md:h-80 object-cover rounded-[2px] mt-8"
                width={1000}
                height={746}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. WHY JUTORIA */}
      <section className="py-16 md:py-24 bg-brand-offwhite border-t border-brand-navy/10">
        <div className="container mx-auto max-w-7xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-14 text-center max-w-2xl mx-auto">
            Why Buyers Choose JUTORIA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_PILLARS.map(({ icon: Icon, title, desc }) => (
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

      {/* 7. HOW WHOLESALE WORKS */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-16 text-center">
            How Wholesale Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.num} className="relative text-center">
                <span className="block font-serif text-5xl font-bold text-brand-gold/30 mb-4">{step.num}</span>
                <h3 className="font-serif font-bold text-brand-navy text-lg mb-2">{step.title}</h3>
                <p className="font-sans text-sm text-brand-navy/70 leading-relaxed max-w-[220px] mx-auto">{step.desc}</p>
                {i < PROCESS_STEPS.length - 1 && (
                  <ArrowRight size={18} className="hidden lg:block absolute top-6 -right-5 text-brand-navy/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FAQ (WHOLESALE QUESTIONS) — এখন ফর্মের ঠিক আগে, কারণ pricing ও "কীভাবে শুরু
          করব" মতো প্রশ্নগুলোর উত্তর ফর্ম পূরণের আগেই পাওয়া দরকার */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-3xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4 text-center">
            Wholesale Questions
          </h2>
          <p className="font-sans text-brand-navy/70 text-center mb-12">Common questions from wholesale buyers.</p>
          <div>
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* 9. B2B INQUIRY SECTION — পেজের একদম শেষ সেকশন, একমাত্র/চূড়ান্ত conversion point।
          এর পরে আর কোনো CTA/সেকশন নেই ইচ্ছাকৃতভাবে, যাতে ফর্ম পূরণের পর ভিজিটর confuse না হয়। */}
      <section id="wholesale-inquiry" className="py-16 md:py-24 bg-brand-navy">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-ivory mb-4">Let's Discuss Your Collection</h2>
            <p className="font-sans text-brand-ivory/70 font-light leading-relaxed max-w-xl mx-auto">
              Tell us about your business, the products you are interested in, and your expected quantity. We'll review your requirements and respond with the appropriate next steps.
            </p>
          </div>

          {/* সাবমিট করলে ডেটা Firestore-এর 'leads' কালেকশনে সেভ হয় (source: 'wholesale')।
              Admin এ দেখা যায় /admin/leads পেজে। */}
          {submitted ? (
            <div className="bg-white p-8 md:p-12 rounded-[2px] text-center">
              <CheckCircle2 size={40} className="mx-auto text-brand-gold mb-4" strokeWidth={1.5} />
              <h3 className="text-xl font-serif font-bold text-brand-navy mb-2">Thank you — your inquiry is in.</h3>
              <p className="font-sans text-sm text-brand-navy/70 max-w-md mx-auto">
                Our team will review your requirements and get back to you with the appropriate next steps.
              </p>
            </div>
          ) : (
            <form className="bg-white p-8 md:p-10 rounded-[2px] space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="wholesale-name" className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/70 mb-2">Your Name *</label>
                  <input id="wholesale-name" type="text" required value={values.name} onChange={(e) => setField('name', e.target.value)} placeholder="Jane Doe" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                </div>
                <div>
                  <label htmlFor="wholesale-company" className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/70 mb-2">Company Name</label>
                  <input id="wholesale-company" type="text" value={values.company} onChange={(e) => setField('company', e.target.value)} placeholder="Company Ltd." className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="wholesale-email" className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/70 mb-2">Business Email *</label>
                  <input id="wholesale-email" type="email" required value={values.email} onChange={(e) => setField('email', e.target.value)} placeholder="jane@company.com" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                </div>
                <div>
                  <label htmlFor="wholesale-country" className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/70 mb-2">Country *</label>
                  <input id="wholesale-country" type="text" required value={values.country} onChange={(e) => setField('country', e.target.value)} placeholder="United Kingdom" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="wholesale-type" className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/70 mb-2">Business Type *</label>
                  <select id="wholesale-type" required value={values.type} onChange={(e) => setField('type', e.target.value)} className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm text-brand-navy">
                    <option value="" disabled>Select an option</option>
                    {BUSINESS_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="wholesale-quantity" className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/70 mb-2">Estimated Quantity</label>
                  <input id="wholesale-quantity" type="text" value={values.quantity} onChange={(e) => setField('quantity', e.target.value)} placeholder="e.g. 500 units" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                </div>
              </div>

              <div>
                <label htmlFor="wholesale-product-interest" className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/70 mb-2">Product Interest</label>
                <input id="wholesale-product-interest" type="text" value={values.productInterest} onChange={(e) => setField('productInterest', e.target.value)} placeholder="e.g. Jute placemats, planter baskets" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
              </div>

              <div>
                <label htmlFor="wholesale-message" className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/70 mb-2">Message</label>
                <textarea id="wholesale-message" rows={4} value={values.message} onChange={(e) => setField('message', e.target.value)} placeholder="Tell us more about what you're looking for..." className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm resize-none" />
              </div>

              <button type="submit" disabled={submitting} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-navy text-brand-ivory px-10 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy rounded-[2px] disabled:opacity-60">
                {submitting ? 'Submitting…' : 'Submit Wholesale Inquiry'} <ArrowRight size={16} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
