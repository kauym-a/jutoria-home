import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   JUTORIA — OUR STORY PAGE
   Complete editorial journey:
   Nature → Material → People → Craft → Product → Modern Living
───────────────────────────────────────────────────────────────*/

export default function OurStory() {
  return (
    <>
      <Helmet>
        <title>Our Story | JUTORIA Natural Home Décor</title>
        <meta
          name="description"
          content="Discover the JUTORIA story, from natural materials and Bangladeshi craftsmanship to thoughtfully designed home décor for modern living."
        />
      </Helmet>

      {/* ════════════════════════════════════════════════════════
          SECTION 01 — STORY HERO
          Primary editorial hero with dominant image and overlay
          ════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[92vh] flex items-end bg-brand-navy overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/jutoria-story-hero.jpg')", backgroundPosition: 'center 30%' }}
          role="img"
          aria-label="Bangladeshi women artisans handcrafting natural fibre products"
        />
        {/* Layered gradient: preserves image character, grounds text */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/30 to-transparent" />

        {/* Hero content — pinned to bottom-left for editorial weight */}
        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8 pt-28 md:pt-36 pb-20 md:pb-28">
          <span className="block font-sans text-[11px] md:text-xs font-bold tracking-[0.28em] text-brand-gold uppercase mb-6">
            Our Story
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-bold text-brand-ivory leading-[1.06] max-w-3xl mb-7">
            Crafted Traditions,<br />
            Contemporary Living
          </h1>
          <p className="max-w-xl font-sans text-base md:text-lg text-brand-ivory/85 font-light leading-relaxed mb-10">
            JUTORIA brings together time-honoured techniques and sustainable natural fibres to create beautiful, enduring pieces for modern homes. Our work celebrates the skilled hands and craftsmanship behind every piece.
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
          SECTION 02 — THE ORIGIN
          Two-column editorial: text left, image right
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text column */}
            <div>
              <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
                Rooted in Nature
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                Where Natural Materials<br />
                Meet Skilled Hands
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed mb-6">
                JUTORIA begins with the natural materials that have long been part of traditional craft in Bangladesh. Jute, grasses and other plant-based fibres are transformed through careful preparation and patient handwork.
              </p>
              <p className="font-sans text-base text-brand-navy/60 font-light leading-relaxed">
                Each material carries the character of the land — its texture, weight and warmth shaped long before it reaches an artisan's hands.
              </p>
            </div>

            {/* Image column */}
            <div className="relative">
              <div
                className="aspect-[4/3] lg:aspect-[3/4] rounded-[2px] bg-cover bg-center shadow-premium-hover overflow-hidden"
                style={{ backgroundImage: "url('/jutoria-story-natural-materials.jpg')", backgroundPosition: 'center 20%' }}
                role="img"
                aria-label="Bangladeshi women artisans working with natural fibres"
              />
              {/* Subtle gold accent line */}
              <div className="absolute -bottom-4 -left-4 w-24 h-1 bg-brand-gold/50 hidden lg:block" />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 03 — THE MATERIAL
          Full-width split: image left, text right (alternating)
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-y border-brand-navy/8">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Image column — left on desktop */}
            <div className="order-2 lg:order-1 relative">
              <div
                className="aspect-[4/3] rounded-[2px] bg-cover bg-center shadow-premium overflow-hidden"
                style={{ backgroundImage: "url('/jutoria-story-material.jpg')", backgroundPosition: 'center 25%' }}
                role="img"
                aria-label="Bangladeshi artisan preparing natural fibres for handcrafting"
              />
              <div className="absolute -top-4 -right-4 w-24 h-1 bg-brand-gold/40 hidden lg:block" />
            </div>

            {/* Text column — right on desktop */}
            <div className="order-1 lg:order-2">
              <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
                The Material
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                From Natural Fibre<br />
                to Crafted Form
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed mb-8">
                Before a finished piece takes shape, natural fibres are carefully selected, prepared and worked by hand. This process preserves the character of the material while allowing each piece to develop its own texture and form.
              </p>

              {/* Material process labels */}
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Natural Fibre', desc: 'Jute, grasses and plant-based fibres selected at source.' },
                  { label: 'Careful Preparation', desc: 'Fibres cleaned, sorted and readied for the weaving process.' },
                  { label: 'Handcrafted Process', desc: 'Every step worked by hand — no shortcuts, no substitutes.' },
                ].map(({ label, desc }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-1 h-full min-h-[2.5rem] bg-brand-gold/40 rounded-full mt-1" />
                    <div>
                      <span className="block font-sans text-xs font-bold uppercase tracking-[0.18em] text-brand-navy mb-1">
                        {label}
                      </span>
                      <span className="font-sans text-sm text-brand-navy/60 font-light leading-relaxed">
                        {desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 04 — THE PEOPLE
          Dramatic full-bleed image with overlaid text panel
          ════════════════════════════════════════════════════════ */}
      <section className="relative py-0 overflow-hidden bg-brand-navy">
        {/* Full-width image */}
        <div className="relative">
          <img
            src="/jutoria-story-hands.jpg"
            alt="Bangladeshi woman artisan hand-weaving a natural fibre product"
            className="w-full object-cover object-center"
            style={{ maxHeight: '680px', objectPosition: 'center 15%' }}
            loading="lazy"
          />
          {/* Gradient overlay — left side for text legibility on desktop */}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/50 to-transparent hidden lg:block" />
          {/* Mobile gradient — bottom overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent lg:hidden" />

          {/* Text overlay — desktop */}
          <div className="absolute inset-0 hidden lg:flex items-center">
            <div className="container mx-auto max-w-6xl px-8">
              <div className="max-w-lg">
                <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
                  The People
                </span>
                <h2 className="text-4xl xl:text-5xl font-serif font-bold text-brand-ivory leading-tight mb-6">
                  Craft Lives<br />
                  in Skilled Hands
                </h2>
                <p className="font-sans text-base md:text-lg text-brand-ivory/80 font-light leading-relaxed">
                  Behind every handcrafted piece are skilled hands, practiced techniques and attention to detail. JUTORIA's story is inseparable from the artisans who transform natural fibres into objects made for everyday living.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile text — below image */}
        <div className="lg:hidden px-6 py-14">
          <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
            The People
          </span>
          <h2 className="text-3xl font-serif font-bold text-brand-ivory leading-tight mb-6">
            Craft Lives<br />
            in Skilled Hands
          </h2>
          <p className="font-sans text-base text-brand-ivory/75 font-light leading-relaxed">
            Behind every handcrafted piece are skilled hands, practiced techniques and attention to detail. JUTORIA's story is inseparable from the artisans who transform natural fibres into objects made for everyday living.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 05 — THE CRAFT
          Two-column editorial: text left, major image right
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text column */}
            <div>
              <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
                The Craft
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                Tradition, Refined<br />
                for Modern Living
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed mb-6">
                Traditional techniques become contemporary forms through thoughtful design. The result is home décor that retains the character of natural materials while fitting naturally into modern spaces.
              </p>
              <p className="font-sans text-base text-brand-navy/55 font-light leading-relaxed">
                Each finished piece carries the maker's attention — the hours of practice, the eye for proportion, the patience to let the material speak. Nothing is rushed. Nothing is hidden.
              </p>
            </div>

            {/* Image column — editorial tall format */}
            <div className="relative">
              <div
                className="aspect-[3/4] rounded-[2px] bg-cover bg-center shadow-premium-hover overflow-hidden"
                style={{ backgroundImage: "url('/jutoria-story-finished-product.jpg')", backgroundPosition: 'center 10%' }}
                role="img"
                aria-label="Bangladeshi woman artisan with a finished woven home décor piece"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-1 bg-brand-gold/50 hidden lg:block" />
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 06 — FROM BANGLADESH TO MODERN HOMES
          Full-width cinematic split image section
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-t border-brand-navy/8">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">

          {/* Section header — centered */}
          <div className="text-center mb-14 md:mb-18">
            <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
              From Hands to Home
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-navy leading-tight max-w-2xl mx-auto">
              Made with Heritage.<br />
              Designed for Today.
            </h2>
          </div>

          {/* Full-width image — cinematic widescreen crop */}
          <div className="relative overflow-hidden rounded-[2px] shadow-premium-hover mb-12 md:mb-16">
            <img
              src="/jutoria-story-modern-living.jpg"
              alt="Handcrafted natural fibre décor connecting Bangladeshi craftsmanship with modern living"
              className="w-full object-cover object-center"
              style={{ maxHeight: '520px', objectPosition: 'center 30%' }}
              loading="lazy"
            />
            {/* Subtle brand tint overlay */}
            <div className="absolute inset-0 bg-brand-navy/10" />
          </div>

          {/* Copy below image */}
          <div className="max-w-2xl mx-auto text-center">
            <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed">
              From the hands of Bangladeshi artisans to homes around the world, JUTORIA brings together natural materials, traditional craftsmanship and contemporary design.
            </p>
          </div>

          {/* Journey visual — connecting the dots */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-3 md:gap-2">
            {['Bangladesh', 'Craftsmanship', 'JUTORIA', 'Modern Home'].map((step, i, arr) => (
              <div key={step} className="flex items-center gap-3 md:gap-2">
                <span className="font-sans text-[11px] md:text-xs font-bold uppercase tracking-[0.18em] text-brand-navy/70 border border-brand-navy/20 rounded-[2px] px-4 py-2 whitespace-nowrap bg-brand-ivory">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <ArrowRight size={14} className="text-brand-gold/60 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 07 — BRAND PHILOSOPHY
          Navy editorial block — three principles
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-navy">
        <div className="container mx-auto max-w-5xl px-6 md:px-8">

          {/* Header */}
          <div className="text-center mb-16 md:mb-20">
            <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
              Our Philosophy
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-ivory leading-tight">
              Natural Living.<br />
              Conscious Choices.
            </h2>
          </div>

          {/* Three principles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-brand-ivory/10">
            {[
              {
                title: 'Natural Materials',
                body: 'Thoughtfully selected natural fibres and materials — jute, grasses and plant-based sources that carry the character of their origin.',
              },
              {
                title: 'Skilled Craftsmanship',
                body: 'Traditional handwork shaped by practiced artisans. Every piece carries the patience, skill and attention of the hands that made it.',
              },
              {
                title: 'Thoughtful Design',
                body: 'Natural character interpreted for contemporary living. Forms that fit modern homes without losing the honesty of the material.',
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="bg-brand-navy px-8 py-10 md:py-12 group border-b md:border-b-0 border-brand-ivory/10 last:border-0"
              >
                <div className="w-8 h-px bg-brand-gold mb-6 transition-all duration-500 group-hover:w-14" />
                <h3 className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-brand-gold mb-4">
                  {title}
                </h3>
                <p className="font-sans text-sm md:text-base text-brand-ivory/70 font-light leading-relaxed">
                  {body}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 08 — CLOSING CTA
          Ivory editorial close with dual CTAs
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-ivory border-t border-brand-navy/10">
        <div className="container mx-auto max-w-3xl px-6 md:px-8 text-center">
          <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
            Discover JUTORIA
          </span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-navy leading-tight mb-6">
            Explore the Collection
          </h2>
          <p className="font-sans text-base md:text-lg text-brand-navy/65 font-light leading-relaxed max-w-xl mx-auto mb-12">
            Discover handcrafted home décor shaped by natural materials, skilled hands and thoughtful design.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-brand-navy text-brand-ivory px-9 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy rounded-[2px]"
            >
              Explore Products <ArrowRight size={14} />
            </Link>
            <Link
              to="/amazon-usa"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-navy/30 text-brand-navy px-9 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-navy hover:bg-brand-navy/5 rounded-[2px]"
            >
              Shop on Amazon Business <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
