import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   JUTORIA — PEOPLE & ARTISANS PAGE
   Storytelling order:
   Hero → Skilled Hands → Crafted by Hand → Natural Materials
   → Workshop Team → Detail → Portraits → Modern Living → CTA
───────────────────────────────────────────────────────────────*/

/* Exact public-folder filenames (double-extension as uploaded) */
const IMG = {
  hero:           'jutoria-artisans-hero.jpg',
  skilledHands:   'jutoria-artisans-skilled-hands.jpg',
  weaving:        'jutoria-artisans-weaving.jpg',
  hands:          'jutoria-artisans-hands.jpg',
  rawMaterials:   'jutoria-artisans-raw-materials.jpg',
  materialPrep:   'jutoria-artisans-material-preparation.jpg',
  finishedCraft:  'jutoria-artisans-finished-craft.jpg',
  workshopTeam:   'jutoria-artisans-workshop-team.jpg',
  craftDetail:    'jutoria-artisans-craft-detail.jpg',
  finishedDetail: 'jutoria-artisans-finished-detail.jpg',
  portrait01:     'jutoria-artisan-portrait-01.jpg',
  portrait02:     'jutoria-artisan-portrait-02.jpg',
  portrait03:     'jutoria-artisan-portrait-03.jpg',
  modernLiving:   'jutoria-artisans-modern-living.jpg',
} as const;

const src = (name: string) => `/${name}`;

export default function PeopleArtisans() {
  return (
    <>
      <Helmet>
        <title>People &amp; Artisans | JUTORIA</title>
        <meta
          name="description"
          content="Meet the skilled Bangladeshi women artisans and workshop teams whose hands transform natural materials into handcrafted home décor for modern living."
        />
      </Helmet>

      {/* ════════════════════════════════════════════════════════
          SECTION 01 — HERO
          Full-width editorial hero — text pinned bottom-left
          ════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[90vh] flex items-end bg-brand-navy overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${src(IMG.hero)}')`, backgroundPosition: 'center 25%' }}
          role="img"
          aria-label="Bangladeshi women artisans weaving natural fibers in a rural craft workshop"
        />
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/35 to-transparent" />

        {/* Content */}
        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8 pt-28 md:pt-36 pb-20 md:pb-28">
          <span className="block font-sans text-[11px] md:text-xs font-bold tracking-[0.28em] text-brand-gold uppercase mb-6">
            Our People
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-bold text-brand-ivory leading-[1.06] max-w-3xl mb-7">
            People Behind<br />
            the Craft
          </h1>
          <p className="max-w-xl font-sans text-base md:text-lg text-brand-ivory/85 font-light leading-relaxed mb-10">
            Meet the skilled women artisans and workshop teams whose hands transform natural materials into thoughtfully crafted pieces for modern living.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]"
          >
            Explore Products <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 02 — SKILLED HANDS
          Two-column: text left / image right
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text */}
            <div>
              <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
                Skilled Hands
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                Skilled Hands.<br />
                Meaningful Work.
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed mb-5">
                Every JUTORIA piece begins with people. Skilled artisans work with natural fibres using techniques shaped by experience, patience and careful attention to detail.
              </p>
              <p className="font-sans text-base text-brand-navy/55 font-light leading-relaxed">
                The character that defines each finished piece — its texture, its weight, its form — comes from this process of careful, considered handwork.
              </p>
            </div>

            {/* Image */}
            <div className="relative">
              <div
                className="aspect-[4/3] rounded-[2px] bg-cover bg-center shadow-premium-hover overflow-hidden"
                style={{ backgroundImage: `url('${src(IMG.skilledHands)}')`, backgroundPosition: 'center 20%' }}
                role="img"
                aria-label="Bangladeshi woman artisan working by hand with natural fiber"
              />
              <div className="absolute -bottom-4 -left-4 w-20 h-px bg-brand-gold/50 hidden lg:block" />
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 03 — CRAFTED BY HAND
          Wide scene image (3 cols) + inset detail (2 cols, offset)
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-y border-brand-navy/[0.08]">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">

          <div className="mb-10 md:mb-14">
            <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
              Craftsmanship
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight max-w-xl">
              Crafted by Hand
            </h2>
          </div>

          {/* Asymmetric image composition */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8 items-start mb-10 md:mb-14">
            {/* Wide scene — 3 cols */}
            <div className="lg:col-span-3">
              <div
                className="aspect-video rounded-[2px] bg-cover bg-center shadow-premium overflow-hidden"
                style={{ backgroundImage: `url('${src(IMG.weaving)}')`, backgroundPosition: 'center 30%' }}
                role="img"
                aria-label="Bangladeshi women artisans weaving natural fiber by hand"
              />
            </div>
            {/* Close detail — 2 cols, offset */}
            <div className="lg:col-span-2 lg:pt-14">
              <div
                className="aspect-[4/3] rounded-[2px] bg-cover bg-center shadow-premium overflow-hidden"
                style={{ backgroundImage: `url('${src(IMG.hands)}')`, backgroundPosition: 'center 25%' }}
                role="img"
                aria-label="Close-up of artisan hands weaving natural fiber"
              />
            </div>
          </div>

          <div className="max-w-2xl">
            <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed">
              From preparing natural fibres to shaping and finishing each piece, skilled hands remain at the heart of the JUTORIA process.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 04 — WORKING WITH NATURAL MATERIALS
          Three-image progression: Raw → Preparation → Finished
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">

          <div className="mb-12 md:mb-16">
            <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
              Natural Materials
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight max-w-2xl mb-6">
              Working With Natural Materials
            </h2>
            <p className="font-sans text-base md:text-lg text-brand-navy/65 font-light leading-relaxed max-w-xl">
              JUTORIA works with natural materials such as jute, seagrass, water hyacinth, bamboo, cane and rattan, hogla leaf and kans grass.
            </p>
          </div>

          {/* Three-step grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {([
              {
                img: IMG.rawMaterials,
                alt: 'Bangladeshi artisans preparing natural fibers for handmade craft',
                step: '01',
                label: 'Raw Materials',
              },
              {
                img: IMG.materialPrep,
                alt: 'Rural Bangladeshi women preparing natural fibers by hand',
                step: '02',
                label: 'Preparation',
              },
              {
                img: IMG.finishedCraft,
                alt: 'Bangladeshi women artisans with a finished handmade natural-fiber product',
                step: '03',
                label: 'Finished Craft',
              },
            ] as const).map(({ img, alt, step, label }) => (
              <div key={step} className="group">
                <div
                  className="aspect-[4/3] rounded-[2px] bg-cover bg-center shadow-premium overflow-hidden mb-5"
                  style={{ backgroundImage: `url('${src(img)}')`, backgroundPosition: 'center 20%' }}
                  role="img"
                  aria-label={alt}
                />
                <div className="flex items-center gap-3">
                  <span className="font-sans text-[11px] font-bold text-brand-gold tracking-[0.22em]">{step}</span>
                  <div className="flex-1 h-px bg-brand-navy/15" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.2em] text-brand-navy/55">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Journey pills — desktop */}
          <div className="hidden md:flex items-center justify-center gap-3 mt-12">
            {(['Raw Materials', 'Preparation', 'Finished Craft'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-brand-navy/50 border border-brand-navy/15 rounded-[2px] px-4 py-2 bg-white">
                  {s}
                </span>
                {i < 2 && <ArrowRight size={13} className="text-brand-gold/50 flex-shrink-0" />}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 05 — PEOPLE, SKILLS & COLLABORATION
          Full-bleed cinematic with desktop left-side overlay
          ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy">
        <img
          src={src(IMG.workshopTeam)}
          alt="Bangladeshi women artisans working together in a natural-fiber workshop"
          className="w-full object-cover object-center"
          style={{ maxHeight: '640px', objectPosition: 'center 20%' }}
          loading="lazy"
        />
        {/* Desktop left-side gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/88 via-brand-navy/45 to-transparent hidden lg:block" />
        {/* Mobile bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/55 to-transparent lg:hidden" />

        {/* Desktop text overlay */}
        <div className="absolute inset-0 hidden lg:flex items-center">
          <div className="container mx-auto max-w-6xl px-8">
            <div className="max-w-lg">
              <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
                Collaboration
              </span>
              <h2 className="text-4xl xl:text-5xl font-serif font-bold text-brand-ivory leading-tight mb-6">
                People, Skills<br />
                &amp; Collaboration
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-ivory/80 font-light leading-relaxed">
                Behind every finished piece is a collaborative process involving skilled hands, careful preparation and attentive finishing.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile text */}
        <div className="lg:hidden bg-brand-navy px-6 py-14">
          <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
            Collaboration
          </span>
          <h2 className="text-3xl font-serif font-bold text-brand-ivory leading-tight mb-6">
            People, Skills<br />
            &amp; Collaboration
          </h2>
          <p className="font-sans text-base text-brand-ivory/75 font-light leading-relaxed">
            Behind every finished piece is a collaborative process involving skilled hands, careful preparation and attentive finishing.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 06 — ATTENTION IN EVERY DETAIL
          Asymmetric image pair + editorial text
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-y border-brand-navy/[0.08]">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image pair */}
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                <div
                  className="aspect-square rounded-[2px] bg-cover bg-center shadow-premium overflow-hidden"
                  style={{ backgroundImage: `url('${src(IMG.craftDetail)}')`, backgroundPosition: 'center' }}
                  role="img"
                  aria-label="Close-up detail of handmade natural-fiber weaving"
                />
                <div
                  className="aspect-square rounded-[2px] bg-cover bg-center shadow-premium overflow-hidden mt-8"
                  style={{ backgroundImage: `url('${src(IMG.finishedDetail)}')`, backgroundPosition: 'center 20%' }}
                  role="img"
                  aria-label="Artisan hands examining a finished natural-fiber craft"
                />
              </div>
            </div>

            {/* Text */}
            <div className="order-1 lg:order-2">
              <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
                Detail &amp; Craft
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                Attention in<br />
                Every Detail
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed mb-5">
                Natural materials reveal their character through texture, shape and variation. Careful handcrafting gives each piece its own distinctive character.
              </p>
              <p className="font-sans text-base text-brand-navy/55 font-light leading-relaxed">
                What makes a JUTORIA piece recognisable is not decoration but material honesty — the weave, the weight, the subtle irregularities that only handwork creates.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 07 — THE HANDS BEHIND JUTORIA (PORTRAITS)
          Three editorial portraits — no fabricated bios
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">

          <div className="text-center mb-14 md:mb-18">
            <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
              The Artisans
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
              The Hands Behind JUTORIA
            </h2>
            <p className="font-sans text-base md:text-lg text-brand-navy/65 font-light leading-relaxed max-w-xl mx-auto">
              JUTORIA celebrates the skilled people behind the craft and the care they bring to every piece.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {([
              { img: IMG.portrait01, alt: 'Bangladeshi rural woman artisan in her natural-fiber craft workspace' },
              { img: IMG.portrait02, alt: 'Bangladeshi rural woman artisan working with natural fibers' },
              { img: IMG.portrait03, alt: 'Bangladeshi rural woman artisan holding handmade natural-fiber craft' },
            ] as const).map(({ img, alt }, i) => (
              <div key={i} className="group">
                <div
                  className="aspect-[4/5] rounded-[2px] bg-cover bg-center shadow-premium-hover overflow-hidden"
                  style={{ backgroundImage: `url('${src(img)}')`, backgroundPosition: 'center 15%' }}
                  role="img"
                  aria-label={alt}
                />
                {/* Gold accent line only — no fabricated names or bios */}
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-6 h-px bg-brand-gold/60 transition-all duration-500 group-hover:w-14" />
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-brand-navy/35">
                    Artisan
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 08 — FROM SKILLED HANDS TO MODERN SPACES
          Wide bridge image + transition journey pills
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-t border-brand-navy/[0.08]">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">

          <div className="text-center mb-12 md:mb-14">
            <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
              From Hands to Home
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-navy leading-tight max-w-2xl mx-auto">
              From Skilled Hands<br />
              to Modern Spaces
            </h2>
          </div>

          <div className="relative overflow-hidden rounded-[2px] shadow-premium-hover mb-12 md:mb-14">
            <img
              src={src(IMG.modernLiving)}
              alt="Natural-fiber home décor connecting artisan craftsmanship with modern living"
              className="w-full object-cover object-center"
              style={{ maxHeight: '500px', objectPosition: 'center 30%' }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-brand-navy/[0.07]" />
          </div>

          <div className="max-w-2xl mx-auto text-center mb-12">
            <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed">
              Traditional handcraft meets contemporary living through thoughtfully designed natural home décor.
            </p>
          </div>

          {/* Journey pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-2">
            {(['Bangladeshi Craftsmanship', 'Natural Materials', 'JUTORIA Products', 'Modern Home'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-3 md:gap-2">
                <span className="font-sans text-[10px] md:text-[11px] font-bold uppercase tracking-[0.16em] text-brand-navy/60 border border-brand-navy/[0.18] rounded-[2px] px-4 py-2 bg-brand-ivory whitespace-nowrap">
                  {s}
                </span>
                {i < 3 && <ArrowRight size={13} className="text-brand-gold/55 flex-shrink-0" />}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 09 — FINAL CTA
          Navy block — three CTA buttons
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-navy">
        <div className="container mx-auto max-w-3xl px-6 md:px-8 text-center">
          <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
            Discover JUTORIA
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-ivory leading-tight mb-4">
            Discover the Craft<br />
            Behind JUTORIA
          </h2>
          <p className="font-sans text-base text-brand-ivory/65 font-light leading-relaxed max-w-lg mx-auto mb-12">
            Explore the collection shaped by natural materials and skilled hands, or learn more about the JUTORIA story.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]"
            >
              Explore Products <ArrowRight size={14} />
            </Link>
            <Link
              to="/our-story"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/[0.08] rounded-[2px]"
            >
              Our Story <ArrowRight size={14} />
            </Link>
            <Link
              to="/wholesale"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/[0.08] rounded-[2px]"
            >
              Wholesale Inquiry <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
