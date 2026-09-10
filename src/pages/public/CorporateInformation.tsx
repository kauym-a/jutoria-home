import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail } from 'lucide-react';

/* WhatsApp brand mark — matches the inline-SVG pattern already used for social icons
   in PublicLayout.tsx (lucide-react has no official WhatsApp glyph). */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.81.88-1.09.19-.28.38-.23.63-.14.26.09 1.66.78 1.94.92.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

/* LinkedIn brand mark — same inline-SVG pattern (this old lucide-react has no
   LinkedIn glyph); path matches SocialBrandIcon's 'linkedin' case in PublicLayout.tsx. */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   LEADERSHIP TEAM — ভেরিফায়েড তথ্য (নাম, পদবি, ফোন, ছবি — সবই কনফার্মড)
───────────────────────────────────────────────────────────────*/
const LEADERSHIP_TEAM = [
  {
    name: 'S M Rashed Ahammad',
    title: 'Founder / Managing Director',
    desc: 'Company ownership and overall leadership',
    location: 'Bangladesh',
    phone: '+880 1745-249997',
    email: 'rashed@jutoriahome.com',
    linkedin: 'https://www.linkedin.com/company/jutoriahome',
    photo: '/team/founder-managing-director.jpg',
  },
  {
    name: 'S M Nasif Ali',
    title: 'UK & Bangladesh Marketing Director',
    desc: 'Overseeing marketing and operations across the UK and Bangladesh markets',
    location: 'United Kingdom & Bangladesh',
    phone: '+880 1324-438566',
    email: 'nasif@jutoriahome.com',
    linkedin: '',
    photo: '/team/uk-bangladesh-marketing-director.jpg',
  },
  {
    name: 'Wafi Rahman Ananna',
    title: 'UK Warehouse Director',
    desc: 'UK fulfillment / warehouse operations',
    location: 'United Kingdom',
    phone: '+44 7435 945500',
    email: 'wafi@jutoriahome.com',
    linkedin: '',
    photo: '/team/uk-warehouse-director.jpg',
  },
  {
    name: 'MST KAZI SANZIDA AHAMMAD',
    title: 'Product Designer & Marketing Director',
    desc: 'Product design leadership and marketing strategy',
    location: 'Bangladesh',
    phone: '+880 1714-567000',
    email: 'sanjida@jutoriahome.com',
    linkedin: '',
    photo: '/team/product-designer-marketing-director.jpg',
  },
] as const;

/* Exact public-folder filenames (double-extension as uploaded) */
const IMG = {
  logo: 'sircommerce_logo.png',
  registration: 'jutoria-corporate-registration.jpg',
  ukPresence: 'jutoria-uk-operational-presence.jpg',
  trademark: 'jutoria-trademark-uk.jpg',
  craftsmanship: 'jutoria-bangladesh-craftsmanship.jpg'
} as const;

const src = (name: string) => `/${name}`;

export default function CorporateInformation() {
  return (
    <>
      <Helmet>
        <title>Corporate Information | JUTORIA</title>
        <meta
          name="description"
          content="Corporate information for JUTORIA, a premium natural home décor brand operated by SIRCOMMERCE GROUP LTD."
        />
      </Helmet>

      {/* ════════════════════════════════════════════════════════
          SECTION 01 — CORPORATE HERO
          ════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-[85vh] flex items-end bg-brand-navy overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${src(IMG.registration)}')`, backgroundPosition: 'center 40%' }}
          role="img"
          aria-label="Corporate registration documentation for SIRCOMMERCE GROUP LTD"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/50 to-transparent" />

        {/* Hero content */}
        <div className="relative z-10 container mx-auto max-w-6xl px-6 md:px-8 pt-28 md:pt-36 pb-20 md:pb-28">
          <span className="block font-sans text-[11px] md:text-xs font-bold tracking-[0.28em] text-brand-gold uppercase mb-6">
            Corporate Information
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] font-serif font-bold text-brand-ivory leading-[1.06] max-w-4xl mb-7">
            JUTORIA, Operated by<br />
            SIRCOMMERCE GROUP LTD
          </h1>
          <p className="max-w-2xl font-sans text-base md:text-lg text-brand-ivory/85 font-light leading-relaxed mb-10">
            JUTORIA is a premium natural home décor brand operated by SIRCOMMERCE GROUP LTD, a United Kingdom registered company serving an international market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]"
            >
              Contact Us <ArrowRight size={15} />
            </Link>
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/8 rounded-[2px]"
            >
              Explore JUTORIA <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 02 — COMPANY IDENTITY
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Logo */}
            <div className="flex items-center justify-center lg:justify-start p-8 bg-white border border-brand-navy/10 rounded-[2px] shadow-premium aspect-[4/3] lg:aspect-auto lg:h-[400px]">
              <img 
                src={src(IMG.logo)} 
                alt="SIRCOMMERCE GROUP LTD logo" 
                className="w-full max-w-[280px] h-auto object-contain mix-blend-multiply"
                loading="lazy"
              />
            </div>

            {/* Right: Text & Info */}
            <div>
              <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
                Company
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                SIRCOMMERCE GROUP LTD
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed mb-10">
                SIRCOMMERCE GROUP LTD is the company behind JUTORIA. JUTORIA is developed as a premium natural home décor brand focused on natural materials, skilled craftsmanship and thoughtful design for modern living.
              </p>

              {/* Info List */}
              <div className="space-y-6">
                <div className="border-b border-brand-navy/15 pb-4">
                  <span className="block font-sans text-[10px] font-bold tracking-[0.2em] text-brand-navy/40 uppercase mb-1">Company Name</span>
                  <span className="font-sans text-base text-brand-navy">SIRCOMMERCE GROUP LTD</span>
                </div>
                <div className="border-b border-brand-navy/15 pb-4">
                  <span className="block font-sans text-[10px] font-bold tracking-[0.2em] text-brand-navy/40 uppercase mb-1">Company Number</span>
                  <span className="font-sans text-base text-brand-navy">17029469</span>
                </div>
                <div className="border-b border-brand-navy/15 pb-4">
                  <span className="block font-sans text-[10px] font-bold tracking-[0.2em] text-brand-navy/40 uppercase mb-1">Registered In</span>
                  <span className="font-sans text-base text-brand-navy">United Kingdom</span>
                </div>
                <div className="pb-4">
                  <span className="block font-sans text-[10px] font-bold tracking-[0.2em] text-brand-navy/40 uppercase mb-1">Brand</span>
                  <span className="font-serif font-bold text-lg text-brand-navy">JUTORIA</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 03 — UK BUSINESS / WAREHOUSE PRESENCE
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-y border-brand-navy/[0.08]">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Info */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                UK Business Presence
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed mb-10">
                Our UK presence provides a direct business contact point for customers, partners and wholesale enquiries.
              </p>
              
              <div className="bg-brand-ivory p-8 md:p-10 rounded-[2px] shadow-premium">
                <span className="block font-sans text-[11px] font-bold tracking-[0.2em] text-brand-gold uppercase mb-4">
                  UK Warehouse / Business Address
                </span>
                <address className="not-italic font-sans text-base md:text-lg text-brand-navy leading-relaxed mb-6">
                  69 Wingfield Road<br />
                  Great Barr<br />
                  Birmingham B42 2QB<br />
                  United Kingdom
                </address>
                <span className="block font-sans text-[11px] font-bold tracking-[0.2em] text-brand-navy/40 uppercase mb-2">
                  Phone
                </span>
                <a href="tel:+447435945500" className="font-sans text-base text-brand-navy hover:text-brand-gold transition-colors">
                  +44 7435 945500
                </a>
                <a
                  href="https://wa.me/447435945500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-navy/70 hover:text-brand-gold transition-colors ml-4"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Right: Image */}
            <div className="order-1 lg:order-2">
              <div
                className="aspect-[4/3] rounded-[2px] bg-cover bg-center shadow-premium-hover overflow-hidden"
                style={{ backgroundImage: `url('${src(IMG.ukPresence)}')`, backgroundPosition: 'center 30%' }}
                role="img"
                aria-label="JUTORIA UK business and operational presence"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 04 — INTERNATIONAL CONTACT
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-navy">
        <div className="container mx-auto max-w-4xl px-6 md:px-8 text-center">
          <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
            Global Contact
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-ivory leading-tight mb-6">
            Global Contact
          </h2>
          <p className="font-sans text-base md:text-lg text-brand-ivory/70 font-light leading-relaxed mb-16 max-w-2xl mx-auto">
            For business, wholesale and general enquiries, JUTORIA can be contacted through the following business contact points.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-left">
            {/* UK Contacts */}
            <div className="bg-brand-navy border border-brand-ivory/15 p-8 rounded-[2px]">
              <h3 className="font-serif text-xl font-bold text-brand-gold mb-6 border-b border-brand-ivory/15 pb-4">United Kingdom</h3>
              
              <div className="mb-6">
                <span className="block font-sans text-[11px] font-bold tracking-[0.15em] text-brand-ivory/50 uppercase mb-2">SIRCOMMERCE GROUP LTD</span>
                <span className="block font-sans text-[10px] text-brand-ivory/40 uppercase mb-1">Phone:</span>
                <a href="tel:+447311127176" className="font-sans text-base text-brand-ivory hover:text-brand-gold transition-colors">+44 7311 127176</a>
                <a
                  href="https://wa.me/447311127176"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-ivory/70 hover:text-brand-gold transition-colors ml-4"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
              
              <div>
                <span className="block font-sans text-[11px] font-bold tracking-[0.15em] text-brand-ivory/50 uppercase mb-2">UK Warehouse Contact</span>
                <span className="block font-sans text-[10px] text-brand-ivory/40 uppercase mb-1">Phone:</span>
                <a href="tel:+447435945500" className="font-sans text-base text-brand-ivory hover:text-brand-gold transition-colors">+44 7435 945500</a>
                <a
                  href="https://wa.me/447435945500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-ivory/70 hover:text-brand-gold transition-colors ml-4"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* BD Contacts */}
            <div className="bg-brand-navy border border-brand-ivory/15 p-8 rounded-[2px]">
              <h3 className="font-serif text-xl font-bold text-brand-gold mb-6 border-b border-brand-ivory/15 pb-4">Bangladesh</h3>
              
              <div className="mb-6">
                <span className="block font-sans text-[10px] text-brand-ivory/40 uppercase mb-1">Phone:</span>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2">
                  <a href="tel:+8801833093349" className="font-sans text-base text-brand-ivory hover:text-brand-gold transition-colors">+880 1833-093349</a>
                  <a
                    href="https://wa.me/8801833093349"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-ivory/70 hover:text-brand-gold transition-colors"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <a href="tel:+8801324438566" className="font-sans text-base text-brand-ivory hover:text-brand-gold transition-colors">+880 13 2443 8566</a>
                  <a
                    href="https://wa.me/8801324438566"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-sans text-sm text-brand-ivory/70 hover:text-brand-gold transition-colors"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 04.5 — LEADERSHIP TEAM
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="text-center mb-14 md:mb-16">
            <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
              Leadership
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
              Leadership Team
            </h2>
            <p className="font-sans text-base md:text-lg text-brand-navy/65 font-light leading-relaxed max-w-xl mx-auto">
              The team behind JUTORIA's operations across the United Kingdom and Bangladesh.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {LEADERSHIP_TEAM.map((person) => (
              <div key={person.title} className="bg-white border border-brand-navy/10 rounded-[2px] overflow-hidden text-center shadow-premium hover:shadow-premium-hover transition-shadow duration-300">
                <img
                  src={person.photo}
                  alt={`${person.name}, ${person.title} at JUTORIA`}
                  className="w-full aspect-[4/5] object-cover object-top"
                  loading="lazy"
                  decoding="async"
                />
                <div className="p-6">
                  <h3 className="font-serif font-bold text-brand-navy leading-snug mb-1">{person.name}</h3>
                  <p className="font-sans text-xs font-bold text-brand-gold uppercase tracking-wide mb-2">{person.title}</p>
                  {/* LinkedIn — শুধু যাদের `linkedin` URL সেট করা আছে (এখন শুধু Founder)।
                      target/rel দেওয়া, তাই নতুন ট্যাবে খোলে ও কখনো পেজ টপে স্ক্রল করে না। */}
                  {person.linkedin && (
                    <a
                      href={person.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${person.name} on LinkedIn`}
                      className="mx-auto mb-3 flex w-fit items-center justify-center p-1 text-brand-navy/40 transition-colors duration-200 hover:text-[#0A66C2]"
                    >
                      <LinkedInIcon className="h-4 w-4" />
                    </a>
                  )}
                  <p className="font-sans text-xs text-brand-navy/60 leading-relaxed mb-3">{person.desc}</p>
                  <span className="inline-block font-sans text-[10px] font-bold tracking-[0.15em] uppercase text-brand-navy/50 mb-4">
                    {person.location}
                  </span>
                  <div className="flex flex-col gap-1.5 pt-4 border-t border-brand-navy/10">
                    <a href={`tel:${person.phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center justify-center gap-1.5 font-sans text-xs text-brand-navy/70 hover:text-brand-gold transition-colors">
                      <Phone size={13} strokeWidth={1.75} className="shrink-0" />
                      {person.phone}
                    </a>
                    <a href={`mailto:${person.email}`} className="inline-flex items-center justify-center gap-1.5 font-sans text-xs text-brand-navy/70 hover:text-brand-gold transition-colors">
                      <Mail size={13} strokeWidth={1.75} className="shrink-0" />
                      {person.email}
                    </a>
                    <a
                      href={`https://wa.me/${person.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 font-sans text-xs text-brand-navy/70 hover:text-brand-gold transition-colors"
                    >
                      <WhatsAppIcon className="h-[13px] w-[13px] shrink-0" />
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 05 — CORPORATE / REGISTRATION DOCUMENTATION
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-ivory">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Image */}
            <div>
               <div
                className="aspect-[4/3] lg:aspect-[3/4] rounded-[2px] bg-cover bg-center shadow-premium overflow-hidden"
                style={{ backgroundImage: `url('${src(IMG.registration)}')`, backgroundPosition: 'center' }}
                role="img"
                aria-label="Corporate registration documentation for SIRCOMMERCE GROUP LTD"
              />
            </div>

            {/* Right: Text */}
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                Corporate &amp; Registration
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed">
                Corporate and registration information is maintained as part of the company's business documentation.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 06 — UK TRADEMARK / BRAND PRESENCE
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-white border-t border-brand-navy/[0.08]">
        <div className="container mx-auto max-w-6xl px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left: Text */}
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy leading-tight mb-6">
                JUTORIA Brand Presence
              </h2>
              <p className="font-sans text-base md:text-lg text-brand-navy/70 font-light leading-relaxed">
                JUTORIA is being developed as an international consumer brand under SIRCOMMERCE GROUP LTD.
              </p>
            </div>

            {/* Right: Image */}
            <div className="order-1 lg:order-2">
              <div
                className="aspect-[4/3] rounded-[2px] bg-cover bg-center shadow-premium-hover overflow-hidden"
                style={{ backgroundImage: `url('${src(IMG.trademark)}')`, backgroundPosition: 'center 20%' }}
                role="img"
                aria-label="JUTORIA UK trademark documentation"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 07 — INTERNATIONAL BUSINESS POSITION
          ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-brand-navy">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${src(IMG.craftsmanship)}')`, backgroundPosition: 'center 30%' }}
          role="img"
          aria-label="Bangladeshi artisans creating natural-fiber handicrafts"
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-brand-navy/85" />
        
        <div className="relative z-10 py-24 md:py-32 container mx-auto max-w-4xl px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-brand-ivory leading-tight mb-6">
            Built for International Markets
          </h2>
          <p className="font-sans text-base md:text-lg text-brand-ivory/80 font-light leading-relaxed max-w-2xl mx-auto">
            JUTORIA is being developed with an international customer and wholesale audience in mind, connecting natural-material craftsmanship with contemporary home décor.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          SECTION 08 — CONTACT / BUSINESS CTA
          ════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 bg-brand-navy border-t border-brand-ivory/10">
        <div className="container mx-auto max-w-3xl px-6 md:px-8 text-center">
          <span className="block font-sans text-[11px] font-bold tracking-[0.28em] text-brand-gold uppercase mb-5">
            WORK WITH JUTORIA
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-ivory leading-tight mb-6">
            Let’s Connect
          </h2>
          <p className="font-sans text-base text-brand-ivory/65 font-light leading-relaxed max-w-lg mx-auto mb-12">
            For wholesale enquiries, business partnerships and general questions, contact the JUTORIA team.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/wholesale"
              className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]"
            >
              Wholesale Inquiry <ArrowRight size={14} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/[0.08] rounded-[2px]"
            >
              Contact Us <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
