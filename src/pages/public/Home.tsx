import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { absoluteUrl, organizationJsonLd } from '../../lib/seo';

// lucide-react-এর এই ভার্সনে 'Instagram' নামে কোনো আইকন নেই (তাই আগে build error হয়েছিল) —
// তার বদলে হুবহু official shape-এর ছোট inline SVG ব্যবহার করা হচ্ছে, PublicLayout.tsx-এর
// ফুটার সোশ্যাল আইকনের সাথে সামঞ্জস্য রেখে।
function InstagramIcon({ size = 16, className = '' }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className} aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
    </svg>
  );
}
import { useEffect, useRef, useState } from 'react';

// অফিশিয়াল Instagram প্রোফাইল — হ্যান্ডেল লিংক ও নিচের ৩টা ছবি সবই এখানে পয়েন্ট করে
const INSTAGRAM_URL = 'https://www.instagram.com/jutoriahome/';

// "Our Materials" গ্রিড এখন Firestore-এর 'categories' কালেকশন থেকে ডাইনামিকভাবে লোড হয়
// (admin: /admin/categories)। Firestore খালি/অফলাইন হলে src/data/materials.ts fallback।
import { useCategories } from '../../hooks/useCategories';
import { displayNumber } from '../../services/firebase/categories';

// Featured Products Data — এখানে productImg/lifestyleImg-এর "-sm" ভ্যারিয়েন্টগুলো
// ব্যবহার করা হচ্ছে (৮০০px wide, মূল ফাইলের ~৪৬% সাইজ)। মূল (বড়) ফাইলগুলো এই একই
// ইমেজগুলো অন্য পেজে hero/full-bleed background হিসেবে ব্যবহার করে বলে অপরিবর্তিত
// রাখা হয়েছে — CompanyProfile.tsx (jute-basket-lifestyle, laundry-basket-lifestyle),
// Products.tsx (laundry-basket-lifestyle), আর CategoryDetail.tsx-এর প্রতিটা ক্যাটাগরি
// পেজের ৫৫vh হিরো ব্যাকগ্রাউন্ড (data/categories.ts-এর মাধ্যমে, সবগুলো "-product"
// ফাইল)। শুধু এই হোমপেজের ছোট (aspect-[4/5]) ফিচার্ড-প্রোডাক্ট কার্ডেই ছোট সাইজ যথেষ্ট।
const featuredProducts = [
  {
    id: 'f1',
    name: 'Jute Storage Basket',
    category: 'Natural Jute',
    productImg: '/jute-basket-product-sm.webp',
    lifestyleImg: '/jute-basket-lifestyle-sm.webp'
  },
  {
    id: 'f2',
    name: 'Woven Laundry Basket',
    category: 'Seagrass',
    productImg: '/laundry-basket-product-sm.webp',
    lifestyleImg: '/laundry-basket-lifestyle-sm.webp'
  },
  {
    id: 'f3',
    name: 'Minimalist Organizer',
    category: 'Natural Fiber',
    productImg: '/organizer-basket-product-sm.webp',
    lifestyleImg: '/organizer-basket-lifestyle-sm.webp'
  },
  {
    id: 'f4',
    name: 'Artisan Placemat',
    category: 'Seagrass',
    productImg: '/placemat-product-sm.webp',
    lifestyleImg: '/placemat-lifestyle-sm.webp'
  }
];

// এই লোগোগুলো ডিসপ্লে হয় মাত্র ৩৬-৬০px উচ্চতায় (নিচের h-9/sm:h-11/lg:h-[60px] দেখুন),
// অথচ আসল ফাইলগুলো (Banglacraft-Logo.png, BSCI_LOGO.png, env-study.webp, epb.png,
// JDPC.png) ছিল কয়েকশ px উঁচু, কিছু PNG ফরম্যাটে — ৩০০KB+ মিলিয়ে হিরো সেকশনের ঠিক
// নিচে, mobile PageSpeed-এ হিরো পোস্টার ছবির সাথে ব্যান্ডউইথ কম্পিট করছিল (loading="lazy"
// থাকা সত্ত্বেও — থ্রটলড কানেকশনে Chrome-এর lazy-load lookahead distance বেড়ে যায়,
// তাই fold-এর ঠিক নিচের ছবিও early fetch হয়)। ২০০px উচ্চতায় (retina-safe) resize + WebP
// এ কনভার্ট করা হয়েছে — ৭৮-৮৯% সাইজ কমেছে (দেখুন কমিট মেসেজ)। Expo/Phytosanitary
// আগে থেকেই ছোট ছিল, রি-এনকোড করলে লাভ হয়নি বলে অপরিবর্তিত রাখা হলো।
const certificationLogos = [
 { name: 'Banglacraft', src: '/Banglacraft-Logo-sm.webp' },
 { name: 'BSCI', src: '/BSCI_LOGO-sm.webp' },
 { name: 'ENV Study', src: '/env-study-sm.webp' },
 { name: 'EPB', src: '/epb-sm.webp' },
 { name: 'Expo', src: '/EXPO%20LOGO.png' },
 { name: 'JDPC', src: '/JDPC-sm.webp' },
 { name: 'Phytosanitary Certificate', src: '/phytosanitary-certificate-logo.webp' }
];

export default function Home() {
  // "Our Materials" গ্রিডের ডেটা (Firestore 'categories' → fallback materials.ts)
  const { categories } = useCategories();
  // হোমপেজের গ্রিড থেকে Cane/Natural Rattan ইচ্ছাকৃতভাবে বাদ — /materials পেজে এবং
  // /materials/cane-rattan ডিটেইল পেজে এখনো ঠিকই আছে (আর Firestore-এর 'categories'
  // কালেকশনেও অপরিবর্তিত), শুধু হোমপেজের "Our Materials" সেকশনে দেখানো হবে না।
  //
  // Hogla Leaf-ও এখানে থেকেই যাচ্ছে ⚠️ — এটা src/data/materials.ts (static fallback)
  // থেকে সম্পূর্ণ মুছে ফেলা হয়েছে, কিন্তু categories আসে useCategories() হুক দিয়ে যেটা
  // *প্রথমে Firestore-কেই* জিজ্ঞেস করে (fallback শুধু Firestore খালি/অফলাইন হলে ব্যবহৃত
  // হয়) — আর Firestore-এর 'categories' কালেকশনে Hogla Leaf এখনো live আছে, যেটা এই
  // কোড থেকে মোছা সম্ভব না (Admin Panel-এ লগইন করেই মুছতে হবে, দেখুন CATEGORY_ADMIN
  // নোট)। Admin থেকে Firestore-এ একবার মুছে ফেলা হলে এই entry-টা এমনিতেই আর filter-এর
  // দরকার পড়বে না (categories array-তেই আর আসবে না), তখন চাইলে সরিয়ে ফেলা যাবে।
  const HOME_HIDDEN_MATERIAL_SLUGS = new Set(['cane-rattan', 'hogla-leaf']);
  const homeMaterials = categories.filter((c) => !HOME_HIDDEN_MATERIAL_SLUGS.has(c.slug));

  // Hooks for Cinematic Artisan Animation
  const artisanRef = useRef<HTMLDivElement>(null);
  const [isArtisanVisible, setIsArtisanVisible] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  // RAF id ref for throttling scroll updates
  const rafIdRef = useRef<number | null>(null);

  // Respect user's reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    if (mq.addEventListener) {
      mq.addEventListener('change', handler);
    } else {
      // Safari and older browsers
      // @ts-ignore - fallback
      mq.addListener(handler);
    }
    return () => {
      if (mq.removeEventListener) {
        mq.removeEventListener('change', handler);
      } else {
        // @ts-ignore - fallback
        mq.removeListener(handler);
      }
    };
  }, []);

  // Hook for Mobile Product Image Toggle
  const [toggledProducts, setToggledProducts] = useState<Record<string, boolean>>({});

  // সার্টিফিকেশন লোগো (নিচে দেখুন) — fetchPriority="low" আলাদাভাবে যথেষ্ট প্রমাণিত হয়নি
  // (রিয়েল প্রোব-এ মাত্র ~100ms উন্নতি) — Chrome-এর network throttling emulation দুটো
  // "High" priority রিসোর্সের (হিরো ছবি + এই লোগোগুলো) মধ্যে প্রায় সমান ব্যান্ডউইথ ভাগ
  // করছিল, ফলে হিরো পোস্টারের ডাউনলোড/LCP প্রায় ২.৫ সেকেন্ড দেরি হচ্ছিল। লোগোগুলো পুরোপুরি
  // সরিয়ে টেস্ট করে দেখা গেছে LCP প্রায় ৮০০ms কমে — তাই এখন এগুলোর `src` client-side-এ
  // window 'load' ইভেন্টের *পরে* বসানো হয়, আগে না — critical LCP উইন্ডোতে এরা কোনো
  // ব্যান্ডউইথই নেয় না। window.__PRERENDER__ চেক (দেখুন AuthProvider.tsx-এর একই প্যাটার্ন)
  // ইচ্ছাকৃত: build-time prerender স্ন্যাপশট (scripts/prerender.mjs) যেন এই "লোড হয়নি"
  // অবস্থাতেই HTML-এ বেক হয় — নাহলে prerender ৩৫০০ms অপেক্ষা করে বলে ততক্ষণে এই effect-ও
  // চলে গিয়ে src বেক হয়ে যেত, রিয়েল ইউজারদের জন্যও deferral অকার্যকর হয়ে পড়ত।
  const [logosLoaded, setLogosLoaded] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ((window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true) return;
    if (document.readyState === 'complete') {
      setLogosLoaded(true);
      return;
    }
    const onLoad = () => setLogosLoaded(true);
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  // Hooks for Lifestyle Editorial Section
  const lifestyleRef = useRef<HTMLDivElement>(null);
  const [isLifestyleVisible, setIsLifestyleVisible] = useState(false);

  // Hooks for B2B Wholesale Conversion Section
  const b2bRef = useRef<HTMLDivElement>(null);
  const [isB2bVisible, setIsB2bVisible] = useState(false);

  useEffect(() => {
    // rootMargin ট্রিগার আগেই শুরু করে দেয় (viewport-এ পুরোপুরি ঢোকার আগেই) — এতে দ্রুত স্ক্রল করলে
    // সেকশনটা opacity-0 অবস্থায় "খালি জায়গা" হয়ে থাকার সময় কমে যায়
    const observerOptions = { threshold: 0, rootMargin: '0px 0px -10% 0px' };

    // Artisan Section Observer
    const artisanObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsArtisanVisible(true);
      }
    }, observerOptions);

    if (artisanRef.current) artisanObserver.observe(artisanRef.current);

    // Lifestyle Section Observer
    const lifestyleObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsLifestyleVisible(true);
      }
    }, observerOptions);

    if (lifestyleRef.current) lifestyleObserver.observe(lifestyleRef.current);

    // B2B Wholesale Section Observer
    const b2bObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsB2bVisible(true);
      }
    }, observerOptions);

    if (b2bRef.current) b2bObserver.observe(b2bRef.current);

    // Scroll Listener for Subtle Parallax Movement (disabled when user prefers reduced motion)
    const handleScroll = () => {
      if (!artisanRef.current) return;
      if (prefersReducedMotion) {
        // ensure reset if reduced-motion enabled
        setParallaxOffset(0);
        return;
      }

      // Throttle scroll updates using requestAnimationFrame to limit updates to animation frames
      if (rafIdRef.current !== null) return;

      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        if (!artisanRef.current) {
          setParallaxOffset(0);
          return;
        }

        const rect = artisanRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        if (rect.top <= viewportHeight && rect.bottom >= 0) {
          const viewportCenter = viewportHeight / 2;
          const elementCenter = rect.top + rect.height / 2;
          const distance = viewportCenter - elementCenter;

          // Subtle multiplier for calm movement
          setParallaxOffset(distance * -0.04);
        }
      });
    };

    if (!prefersReducedMotion) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      // invoke once to initialise; it will schedule a RAF update
      handleScroll();
    } else {
      // ensure offset is reset when reduced motion is enabled
      setParallaxOffset(0);
    }

    return () => {
      if (artisanRef.current) artisanObserver.unobserve(artisanRef.current);
      if (lifestyleRef.current) lifestyleObserver.unobserve(lifestyleRef.current);
      if (b2bRef.current) b2bObserver.unobserve(b2bRef.current);
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [prefersReducedMotion]);

  // Handler for mobile image tap
  const handleProductImageToggle = (productId: string) => {
    setToggledProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  return (
    <>
      <Helmet>
        <title>JUTORIA | Premium Eco-Friendly Handmade Home Décor</title>
        <meta name="description" content="Premium natural-fiber home décor, handcrafted by skilled artisans in Bangladesh for conscious living and global spaces." />
        <link rel="canonical" href={absoluteUrl('/')} />
        {/* হিরো <video>-র কোনো poster ছিল না — LCP স্পেক অনুযায়ী poster-বিহীন video তখনই LCP
            candidate হয় যখন প্রথম ফ্রেম পেইন্ট হয়, যার জন্য metadata নয়, আসল ভিডিও বাইট লাগে।
            থ্রটলড মোবাইল কানেকশনে এটাই ৬+ সেকেন্ড LCP-র মূল কারণ ছিল। এখন একটা অপ্টিমাইজড
            static ছবি poster হিসেবে preload+fetchPriority high দিয়ে দেওয়া হলো (অন্যান্য পেজের
            হিরো ছবির প্যাটার্নই — দেখুন OurStory.tsx/AmazonUSA.tsx) — এটাই তাৎক্ষণিক LCP
            candidate হয়, ভিডিও এর ওপরে সিমলেসলি ওভারলে হয়ে যায় যখন যথেষ্ট বাফার হয়ে যায়।
            jutoria-artisans-hero-poster.webp হলো jutoria-artisans-hero.webp (PeopleArtisans.tsx-এও
            ব্যবহৃত, full-res দরকার সেখানে) থেকে আলাদা করে বানানো ৯০০px-wide রিসাইজড কপি — মোবাইল
            viewport-এর (~412px, hero ~50vh) জন্য আসল ১৬৭২px ফাইলটা বহুগুণ বেশি রেজোলিউশনের ছিল,
            LCP-গেটিং রিসোর্স হওয়া সত্ত্বেও ১৮৫KB ডাউনলোড করাতো — রিসাইজে ৬৫% (~৬৪KB) কমেছে। */}
        <link rel="preload" as="image" href="/jutoria-artisans-hero-poster.webp" fetchPriority="high" type="image/webp" />

        {/* Open Graph — og:url/og:image must be absolute, social crawlers (WhatsApp/LinkedIn/Facebook) don't resolve relative paths */}
        <meta property="og:title" content="JUTORIA | Premium Eco-Friendly Handmade Home Décor" />
        <meta property="og:description" content="Premium natural-fiber home décor, handcrafted by skilled artisans in Bangladesh for conscious living and global spaces." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="JUTORIA" />
        <meta property="og:url" content={absoluteUrl('/')} />
        <meta property="og:image" content={absoluteUrl('/laundry-basket-lifestyle.webp')} />
        <meta property="og:image:alt" content="JUTORIA natural-fiber home décor in a living space" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JUTORIA | Premium Eco-Friendly Handmade Home Décor" />
        <meta name="twitter:description" content="Premium natural-fiber home décor, handcrafted by skilled artisans in Bangladesh for conscious living and global spaces." />
        <meta name="twitter:image" content={absoluteUrl('/laundry-basket-lifestyle.webp')} />
        <meta name="twitter:image:alt" content="JUTORIA natural-fiber home décor in a living space" />

        <script type="application/ld+json">{JSON.stringify(organizationJsonLd())}</script>
      </Helmet>

      {/* =========================================
          PREMIUM CINEMATIC HERO SECTION
          ========================================= */}
      <section className="relative w-full min-h-[100svh] flex flex-col lg:flex-row bg-brand-ivory overflow-hidden">
        <div className="relative w-full h-[50vh] lg:absolute lg:inset-y-0 lg:right-0 lg:w-3/5 lg:h-full">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-ivory via-transparent to-transparent z-10 lg:bg-gradient-to-r lg:from-brand-ivory lg:via-brand-ivory/70 lg:to-transparent"></div>
          {/* preload="auto" আগে পুরো ২.৯MB ফাইলটা eagerly buffer করাতো (PageSpeed-এ
              ফ্ল্যাগ হয়েছিল) — "metadata" শুধু duration/dimensions আনে, autoplay তখনো
              কাজ করে (browser নিজে থেকেই playback শুরুর জন্য যথেষ্ট বাফার করে নেয়),
              কিন্তু পুরো ফাইলটা প্রথম পেইন্টের আগেই ডাউনলোড করার জন্য অপেক্ষা করায় না। */}
          <video autoPlay loop muted playsInline preload="metadata" poster="/jutoria-artisans-hero-poster.webp" className="w-full h-full object-cover">
            <source src="/hero-video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="relative z-20 w-full flex-grow flex items-center bg-brand-ivory lg:bg-transparent lg:w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-0">
            <div className="max-w-2xl">
              <span className="block font-sans text-[#8a6a29] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
                Sustainable Luxury
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-brand-navy leading-[1.15] mb-6">
                Crafted by Nature.<br />
                <span className="italic font-light">Finished by Hand.</span>
              </h1>
              <p className="font-sans text-base sm:text-lg lg:text-xl text-brand-navy/80 font-light leading-relaxed mb-10 max-w-xl">
                Premium natural-fiber home décor, handcrafted by skilled artisans in Bangladesh for conscious living and global spaces.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 sm:items-center">
                <Link to="/products" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-navy text-brand-gold px-8 py-4 font-sans font-bold tracking-widest text-[13px] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy rounded-[2px]">
                  Explore Collection <ArrowRight size={18} />
                </Link>
                <Link to="/wholesale" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-brand-navy/30 text-brand-navy px-8 py-4 font-sans font-bold tracking-widest text-[13px] uppercase transition-all duration-300 hover:border-brand-navy hover:bg-brand-navy hover:text-brand-ivory rounded-[2px]">
                  Wholesale Inquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          CERTIFICATIONS & EXPORT RECOGNITION
          ========================================= */}
      <section className="bg-[#f7f4ee] py-8 sm:py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[24px] border border-brand-navy/10 bg-white/80 px-4 py-6 sm:px-6 sm:py-7 lg:px-8 lg:py-8 shadow-[0_12px_32px_rgba(15,23,42,0.03)]">
            <div className="mb-5 flex justify-center">
              <span className="font-sans text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-brand-navy/60">
                Certifications & Export Recognition
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7 lg:gap-5">
              {certificationLogos.map((logo) => (
                <div key={logo.name} className="flex h-16 items-center justify-center rounded-[14px] border border-brand-navy/5 bg-[#fbfaf7] p-3 sm:h-20 lg:h-24">
                  {/* সব লোগোর দৃশ্যমান উচ্চতা এক (h-9 → sm:h-11 → lg:60px), w-auto + object-contain
                      দিয়ে aspect ratio ঠিক থাকে। mix-blend-multiply সাদা JPEG ব্যাকগ্রাউন্ডকে
                      টাইলের সাথে মিশিয়ে দেয়, grayscale টোন এক করে — hover-এ আসল রং ফিরে আসে।
                      src শুধু logosLoaded true হলেই বসে (window 'load'-এর পরে, উপরের
                      কমেন্ট দেখুন) — তার আগে src না থাকায় ব্রাউজার কোনো রিকোয়েস্টই পাঠায় না,
                      হিরো ছবির সাথে ব্যান্ডউইথ কম্পিট করার সুযোগই থাকে না। প্যারেন্ট div-এর
                      ফিক্সড উচ্চতা (h-16/sm:h-20/lg:h-24) থাকায় src না থাকা অবস্থাতেও কোনো
                      layout shift হয় না (CLS-নিরাপদ)। fetchPriority="low" বাড়তি সিগন্যাল হিসেবে
                      রাখা হলো — লোড হওয়ার পরও যেন অন্য কিছুর চেয়ে অগ্রাধিকার না পায়। */}
                  <img
                    src={logosLoaded ? logo.src : undefined}
                    alt={logo.name}
                    loading="lazy"
                    fetchPriority="low"
                    className="h-9 w-auto max-w-full object-contain opacity-70 grayscale mix-blend-multiply transition duration-300 ease-out hover:opacity-100 hover:grayscale-0 sm:h-11 lg:h-[60px]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          BRAND STORY TRANSITION SECTION
          ========================================= */}
      <section className="py-16 md:py-24 bg-brand-ivory flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="w-12 h-[2px] bg-brand-gold mx-auto mb-10"></div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-navy leading-tight mb-8">
            From Natural Fibers to Meaningful Spaces.
          </h2>
          <p className="font-sans text-lg md:text-xl lg:text-2xl text-brand-navy/80 font-light leading-relaxed max-w-3xl mx-auto">
            JUTORIA brings together Bangladesh's natural materials and skilled artisan craftsmanship to create beautiful products for homes, businesses and conscious lifestyles around the world.
          </p>
        </div>
      </section>

      {/* =========================================
          OUR MATERIALS SECTION
          ========================================= */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="block font-sans text-[#8a6a29] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
              Our Materials
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-navy leading-tight mb-6">
              Rooted in Nature.<br />Crafted for Living.
            </h2>
            <p className="font-sans text-lg text-brand-navy/70 font-light leading-relaxed max-w-2xl mb-8">
              We transform responsibly sourced natural fibers into thoughtfully designed products, combining traditional craftsmanship with contemporary living.
            </p>
            <Link
              to="/materials"
              className="inline-flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-navy border-b-2 border-brand-gold pb-1 hover:text-brand-gold transition-colors duration-300"
            >
              View All Materials <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {homeMaterials.map((material, index) => {
              const isFeatured = index === 0;
              return (
                <Link
                  to={`/materials/${material.slug}`}
                  key={material.slug}
                  className={`group relative p-8 md:p-12 border-2 transition-all duration-500 rounded-[2px] overflow-hidden flex flex-col justify-end min-h-[300px] md:min-h-[350px] shadow-premium hover:shadow-premium-hover ${isFeatured ? 'md:col-span-2 lg:col-span-2 border-brand-navy/10 hover:border-brand-gold' : 'border-brand-navy/10 hover:border-brand-gold'}`}
                >
                  {/* আগে এই কার্ডের ছবি inline style-এর CSS background-image হিসেবে বসানো
                      হতো — সেভাবে <img loading="lazy"> এর মতো native lazy-loading সম্ভব
                      না, ব্রাউজার viewport-এ আসুক বা না আসুক সাথে সাথেই ফেচ করে ফেলে।
                      ৭টা ছবিই (প্রতিটা ৩০০-৪০০KB) হোমপেজ লোড হওয়া মাত্র, এই সেকশন fold-এর
                      অনেক নিচে থাকা সত্ত্বেও, হিরো ভিডিও/ছবির সাথে ব্যান্ডউইথ কম্পিট করতো
                      — mobile PageSpeed-এ LCP/Speed Index খারাপ করার একটা বড় কারণ ছিল।
                      এখন আসল <img loading="lazy"> (gradient overlay-র নিচে absolute
                      positioned), যাতে ব্রাউজার ফোল্ডের কাছে না আসা পর্যন্ত এটা ফেচ না করে। */}
                  <img
                    src={material.cardImage || material.image}
                    alt={material.name}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ backgroundImage: 'linear-gradient(180deg, rgba(17, 18, 16, 0.22) 0%, rgba(17, 18, 16, 0.62) 100%)' }}
                  />
                  <span className="absolute top-6 right-8 font-serif text-6xl md:text-7xl font-bold transition-colors duration-500 text-brand-ivory/25 group-hover:text-brand-gold/60">
                    {/* material.order নয় — ২টা material বাদ দেওয়ার পর (উপরে দেখুন) সেটা
                        ব্যবহার করলে ব্যাজে গ্যাপ থাকত (যেমন 01,02,03,06,07)। এখানে ফিল্টার
                        করা লিস্টের নিজস্ব পজিশন থেকে একটা পরিষ্কার 01-05 সিকোয়েন্স বানানো হলো। */}
                    {displayNumber(index + 1)}
                  </span>
                  <div className="relative z-10 mt-auto">
                    <span className="block font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore Material
                    </span>
                    <h3 className="text-2xl md:text-3xl font-serif font-bold mb-4 text-brand-ivory flex items-center gap-3">
                      {material.name}
                      <ArrowRight size={20} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand-gold" />
                    </h3>
                    <p className="font-sans font-light leading-relaxed max-w-md text-brand-ivory/85">
                      {material.desc}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================
          THE HANDS BEHIND JUTORIA (ARTISAN STORY)
          ========================================= */}
      <section className="py-16 md:py-24 bg-brand-ivory overflow-hidden" ref={artisanRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="w-full lg:w-1/2">
              <div className={`transition-all duration-1000 ease-out ${isArtisanVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <div
                  className="relative overflow-hidden rounded-[2px] bg-brand-navy/5"
                  style={{ transform: `translateY(${prefersReducedMotion ? 0 : parallaxOffset}px)`, transition: 'transform 0.1s ease-out' }}
                >
                  {/* মোবাইল/ট্যাবলেট ভার্সন (portrait crop) — এখানে "-sm" ভ্যারিয়েন্ট, এই
                      লেআউটে (single-column, ~380-400px display) ১০০০px আসল ফাইল ~2.5x
                      oversized ছিল। ডেস্কটপ ভার্সন (নিচে) অপরিবর্তিত — সেটা lg:w-1/2-এ
                      (~৬০০-৬২০px) দেখানো হয়, retina-তে বরং একটু ছোটই (undersized) বলে
                      resize করা হয়নি। */}
                  <img
                    src="/jutoria-artisans-craftsmanship-mobile-sm.webp"
                    alt="JUTORIA artisans hand-weaving natural fiber baskets in Bangladesh"
                    className="block lg:hidden w-full h-auto aspect-[1161/1355] object-cover origin-center"
                    width={800}
                    height={934}
                    decoding="async"
                    loading="lazy"
                    style={{ transform: `scale(${isArtisanVisible && !prefersReducedMotion ? 1.04 : 1.00})`, transition: prefersReducedMotion ? 'none' : 'transform 10s ease-out' }}
                  />
                  {/* ডেস্কটপ ভার্সন (landscape crop) */}
                  <img
                    src="/jutoria-artisans-craftsmanship-desktop.webp"
                    alt="JUTORIA artisans hand-weaving natural fiber baskets in Bangladesh"
                    className="hidden lg:block w-full h-auto aspect-[1537/1023] object-cover origin-center"
                    width={1000}
                    height={666}
                    decoding="async"
                    loading="lazy"
                    style={{ transform: `scale(${isArtisanVisible && !prefersReducedMotion ? 1.04 : 1.00})`, transition: prefersReducedMotion ? 'none' : 'transform 10s ease-out' }}
                  />
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className={`max-w-xl transition-all duration-1000 delay-300 ease-out ${isArtisanVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <span className="block font-sans text-[#8a6a29] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
                  The Hands Behind Jutoria
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-navy leading-tight mb-8">
                  Made by Hands.<br />Made with Purpose.
                </h2>
                <p className="font-sans text-lg md:text-xl text-brand-navy/80 font-light leading-relaxed mb-10">
                  Across rural Bangladesh, skilled artisans transform natural materials into thoughtfully crafted products. Their knowledge, patience and craftsmanship give every piece its character.
                </p>
                <div className="flex items-center gap-6 mt-12 pt-10 border-t border-brand-navy/10">
                  <div className="w-12 h-[2px] bg-brand-gold flex-shrink-0"></div>
                  <p className="font-serif text-xl text-brand-navy italic tracking-wide">
                    Traditional skill, thoughtfully carried forward.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          FEATURED COLLECTION / PRODUCT SHOWCASE
          ========================================= */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="block font-sans text-[#8a6a29] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
              Featured Collection
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-navy leading-tight mb-6">
              Crafted for Beautiful Living.
            </h2>
            <p className="font-sans text-lg text-brand-navy/70 font-light leading-relaxed max-w-2xl">
              A curated selection of natural-fiber pieces, thoughtfully handcrafted for refined and conscious spaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-16 gap-x-8 lg:gap-x-16">
            {featuredProducts.map((product, index) => {
              const isEven = index % 2 !== 0;
              const isToggled = toggledProducts[product.id];
              
              return (
                <div key={product.id} className={`group flex flex-col ${isEven ? 'md:mt-16 lg:mt-24' : ''}`}>
                  <button 
                    type="button"
                    onClick={() => handleProductImageToggle(product.id)}
                    className="relative block w-full aspect-[4/5] overflow-hidden rounded-[2px] bg-brand-navy/5 mb-6 border border-brand-navy/5 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 cursor-pointer"
                    aria-label={`Toggle lifestyle image for ${product.name}`}
                  >
                    <img 
                      src={product.productImg} 
                      alt={product.name} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isToggled ? 'opacity-0' : 'opacity-100 group-hover:opacity-0'}`}
                                          decoding="async"
                                          loading="lazy"
                                        />
                    <img 
                      src={product.lifestyleImg} 
                      alt={`${product.name} in lifestyle setting`} 
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${isToggled ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                                          decoding="async"
                                          loading="lazy"
                                        />
                  </button>

                  <div className="flex flex-col flex-grow text-left">
                    <span className="font-sans text-brand-gold text-[11px] font-bold tracking-[0.15em] uppercase mb-3">
                      {product.category}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-brand-navy mb-4">
                      {product.name}
                    </h3>
                    
                    <div className="mt-auto pt-2">
                      <Link 
                        to="/products" 
                        className="inline-flex items-center gap-3 text-brand-navy font-sans text-xs font-bold tracking-widest uppercase hover:text-brand-gold transition-colors duration-300"
                      >
                        View Product <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 md:mt-32 text-center">
            <Link 
              to="/products" 
              className="inline-flex items-center justify-center gap-3 bg-brand-navy text-brand-ivory px-10 py-5 font-sans font-bold tracking-widest text-[13px] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy rounded-[2px]"
            >
              View Full Collection
            </Link>
          </div>

        </div>
      </section>

      {/* =========================================
          LIVING SPACE / LIFESTYLE EDITORIAL
          ========================================= */}
      <section className="py-16 md:py-24 bg-brand-ivory overflow-hidden" ref={lifestyleRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col justify-center">
              <div className={`transition-all duration-1000 ease-out ${isLifestyleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <span className="block font-sans text-[#8a6a29] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
                  Living With Nature
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-navy leading-tight mb-8">
                  Natural Materials.<br />Beautifully Lived.
                </h2>
                <p className="font-sans text-lg md:text-xl text-brand-navy/80 font-light leading-relaxed mb-8">
                  Thoughtfully crafted pieces that bring natural texture, warmth and quiet character into contemporary spaces.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className={`transition-all duration-1000 delay-200 ease-out ${isLifestyleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <div className="aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-[2px] bg-brand-navy/5">
                  {/* "-editorial" ভ্যারিয়েন্ট (750px wide, q75) — মূল ফাইলটা CompanyProfile.tsx-এ
                      fetchPriority="high" hero হিসেবেও ব্যবহৃত (সেখানে ছোঁয়া হয়নি), কিন্তু এখানে
                      lazy-loaded below-fold সেকশনে সাইজ/মান ট্রেড-অফ করে আরও কমপ্রেস করা হলো। */}
                  <img
                    src="/laundry-basket-lifestyle-editorial.webp"
                    alt="JUTORIA beautiful living space"
                    className="w-full h-full object-cover origin-center"
                                      width={750}
                                      height={938}
                                      decoding="async"
                                      loading="lazy"
                                      style={{ transform: `scale(${isLifestyleVisible && !prefersReducedMotion ? 1.03 : 1.00})`, transition: prefersReducedMotion ? 'none' : 'transform 10s ease-out' }}
                                    />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mt-16 lg:mt-24">
            <div className={`md:col-span-5 lg:col-span-4 transition-all duration-1000 delay-300 ease-out ${isLifestyleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="aspect-square md:aspect-[4/5] overflow-hidden rounded-[2px] bg-brand-navy/5">
                <img
                  src="/jute-basket-lifestyle-editorial.webp"
                  alt="Natural jute lifestyle detail"
                  className="w-full h-full object-cover origin-center"
                                  width={750}
                                  height={938}
                                  decoding="async"
                                  loading="lazy"
                                  style={{ transform: `scale(${isLifestyleVisible && !prefersReducedMotion ? 1.03 : 1.00})`, transition: prefersReducedMotion ? 'none' : 'transform 10s ease-out' }}
                                />
              </div>
            </div>
            
            <div className={`md:col-span-7 lg:col-span-5 transition-all duration-1000 delay-500 ease-out ${isLifestyleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="aspect-video md:aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-[2px] bg-brand-navy/5">
                <img
                  src="/placemat-lifestyle-editorial.webp"
                  alt="Handcrafted placemat in natural setting"
                  className="w-full h-full object-cover origin-center"
                  width={750}
                  height={938}
                  decoding="async"
                  loading="lazy"
                  style={{ transform: `scale(${isLifestyleVisible && !prefersReducedMotion ? 1.03 : 1.00})`, transition: prefersReducedMotion ? 'none' : 'transform 10s ease-out' }}
                />
              </div>
            </div>
            
            <div className={`md:col-span-6 md:col-start-4 lg:col-span-3 lg:col-start-10 lg:-mt-32 transition-all duration-1000 delay-700 ease-out ${isLifestyleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-[2px] bg-brand-navy/5">
                <img
                  src="/organizer-basket-lifestyle-editorial.webp"
                  alt="Minimalist organizer lifestyle view"
                  className="w-full h-full object-cover origin-center"
                  width={750}
                  height={938}
                  decoding="async"
                  loading="lazy"
                  style={{ transform: `scale(${isLifestyleVisible && !prefersReducedMotion ? 1.03 : 1.00})`, transition: prefersReducedMotion ? 'none' : 'transform 10s ease-out' }}
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================
          B2B / WHOLESALE CONVERSION SECTION
          ========================================= */}
      <section className="py-16 md:py-24 bg-brand-navy text-center overflow-hidden" ref={b2bRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className={`transition-all duration-1000 ease-out ${isB2bVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            
            <span className="block font-sans text-brand-gold font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
              For Retailers & Business
            </span>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-ivory leading-tight mb-8">
              Bring JUTORIA Into Your Collection.
            </h2>
            
            <p className="font-sans text-lg md:text-xl text-brand-ivory/80 font-light leading-relaxed max-w-2xl mx-auto mb-12">
              Partner with JUTORIA to source thoughtfully crafted natural-fiber products for retail, hospitality and curated spaces.
            </p>
            
            <div className="flex flex-col items-center justify-center">
              <Link 
                to="/wholesale" 
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-navy px-12 py-5 font-sans font-bold tracking-widest text-[13px] uppercase transition-all duration-300 hover:bg-brand-ivory hover:text-brand-navy rounded-[2px]"
              >
                Wholesale Inquiry
              </Link>
              
              <p className="font-serif text-brand-ivory/60 italic tracking-wide mt-8 text-sm md:text-base">
                Designed for thoughtful collections. Crafted for lasting relationships.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="relative pt-28 pb-24 md:py-32 bg-brand-ivory">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <span className="block font-sans text-[#8a6a29] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-8">
              Crafted with Intention
            </span>

            <div className="w-16 h-px bg-brand-gold mx-auto mb-8"></div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-brand-navy leading-[0.96] tracking-[-0.03em] mb-8">
              Natural Living.<br className="hidden sm:block" />
              <span className="italic font-light">Conscious Choices.</span>
            </h2>

            <p className="mx-auto max-w-2xl font-sans text-base sm:text-lg md:text-xl text-brand-navy/80 font-light leading-relaxed mb-8">
              Thoughtfully crafted natural-fiber pieces, shaped by skilled hands and designed for spaces that value beauty, purpose and enduring character.
            </p>

            <p className="font-serif text-xl md:text-2xl text-brand-navy/90 italic tracking-[0.04em] mb-12">
              Rooted in nature. Made by hand. Designed for living.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/products" className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-brand-navy text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy rounded-[2px]">
                Explore Collection <ArrowRight size={18} />
              </Link>
              <Link to="/wholesale" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent border border-brand-navy/25 text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-navy hover:bg-brand-navy hover:text-brand-ivory rounded-[2px]">
                Wholesale Inquiry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AS SEEN ON INSTAGRAM */}
      <section className="py-16 md:py-20 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="mb-3 block font-sans text-[11px] font-bold tracking-[0.24em] text-[#8a6a29] uppercase">
                Follow Along
              </span>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-brand-navy">
                Natural Living Inspiration
              </h2>
            </div>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans font-bold tracking-normal text-sm normal-case text-brand-navy hover:text-brand-gold transition-colors"
            >
              <InstagramIcon size={16} /> @jutoriahome
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            {/* "-sm" ভ্যারিয়েন্ট — এই ৩-কলাম গ্রিডে (max-w-6xl, aspect-square) সব breakpoint-এই
                display width ~৩৬০-৪০০px-এর মধ্যে থাকে, আসল ১০০০x১০০০ ফাইল ~1.25x oversized। */}
            {[
              { src: '/jutoria-instagram-natural-living-sm.webp', alt: 'JUTORIA natural fiber home décor styled in a living room' },
              { src: '/jutoria-instagram-dining-table-sm.webp', alt: 'JUTORIA woven placemats and baskets on a dining table' },
              { src: '/jutoria-instagram-modern-home-sm.webp', alt: 'JUTORIA natural fiber basket in a modern home' },
            ].map((img) => (
              <a
                key={img.src}
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View JUTORIA on Instagram"
                className="group relative block aspect-square overflow-hidden rounded-[2px]"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                />
                {/* subtle overlay + Instagram glyph so visitors realise the tile links out */}
                <span className="absolute inset-0 flex items-center justify-center bg-brand-navy/0 text-brand-ivory opacity-0 transition-all duration-300 group-hover:bg-brand-navy/25 group-hover:opacity-100">
                  <InstagramIcon size={26} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}