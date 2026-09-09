import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  ArrowRight,
  Package,
  Building2,
  Wrench,
  HelpCircle,
  Leaf,
  Hammer,
  Compass,
  Globe,
} from 'lucide-react';
import { materials } from '../../data/materials';

/* WhatsApp brand mark — lucide-react has no official WhatsApp glyph, so this is
   the same inline-SVG pattern already used for social icons in PublicLayout.tsx. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.81.88-1.09.19-.28.38-.23.63-.14.26.09 1.66.78 1.94.92.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
    </svg>
  );
}

// ============================================================
// সব তথ্য এই পেজে হয় আগে থেকে সাইটে (ফুটার) প্রকাশিত, নয়তো ব্যবহারকারী সরাসরি
// দিয়েছেন — কোথাও অনুমান করে ফোন/ঠিকানা/ইমেইল বসানো হয়নি।
// ============================================================

const HELP_PATHS = [
  {
    icon: Package,
    title: 'Wholesale & Bulk Orders',
    desc: 'For retailers, distributors and businesses seeking natural-fiber home décor at wholesale quantities.',
  },
  {
    icon: Building2,
    title: 'Hospitality & Interior Projects',
    desc: 'For hotels, restaurants, resorts, designers and commercial interiors.',
  },
  {
    icon: Wrench,
    title: 'Custom & Private Development',
    desc: 'For businesses seeking custom sizes, materials, designs or product development.',
  },
  {
    icon: HelpCircle,
    title: 'General Product Enquiries',
    desc: 'For questions about collections, materials, products and availability.',
  },
];

const WHY_PARTNER = [
  { icon: Leaf, title: 'Natural Materials', desc: 'Responsibly sourced natural fibres and authentic handcrafted products.' },
  { icon: Hammer, title: 'Skilled Craftsmanship', desc: 'Traditional Bangladeshi craftsmanship combined with contemporary design.' },
  { icon: Compass, title: 'Flexible Sourcing', desc: 'Product development and sourcing capabilities for different business requirements.' },
  { icon: Globe, title: 'International Focus', desc: 'Designed to serve global retailers, hospitality businesses and design professionals.' },
];

const INQUIRY_TYPES = ['Wholesale', 'Bulk Order', 'Retail Partnership', 'Hospitality / Interior Project', 'Custom Product', 'General Inquiry'];

export default function Contact() {
  return (
    <>
      <Helmet>
        <title>Contact Us | JUTORIA - Request a Quote</title>
        <meta name="description" content="Contact JUTORIA for wholesale inquiries, custom orders, or retail support. Get in touch with our UK and Bangladesh business contact points." />
      </Helmet>

      {/* 1. HERO — no image by design (matches the rest of JUTORIA's B2B pages, avoids over-decoration) */}
      <section className="bg-brand-navy py-20 md:py-28 px-4">
        <div className="container mx-auto text-center max-w-3xl">
          <span className="mb-5 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-ivory leading-tight mb-6">
            Let's Build Something <br className="hidden sm:block" /> Natural Together.
          </h1>
          <p className="font-sans text-base md:text-lg text-brand-ivory/75 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Whether you are sourcing for retail, hospitality, interior projects, or wholesale distribution, our team is ready to discuss your requirements.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#inquiry-form" className="inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]">
              Start an Inquiry <ArrowRight size={16} />
            </a>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/10 rounded-[2px]">
              Explore Our Collections
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CONTACT INFORMATION + INQUIRY FORM */}
      <section className="py-16 md:py-24 bg-brand-offwhite">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

            {/* Contact Information (Left) */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-brand-navy mb-8">Contact Information</h2>

              <div className="flex items-start gap-4 mb-10">
                <div className="w-12 h-12 bg-white border border-brand-navy/10 flex items-center justify-center text-brand-navy flex-shrink-0 rounded-[2px]">
                  <Mail size={22} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-brand-navy mb-1">Email Us</h4>
                  <p className="font-sans text-sm text-brand-navy/60 mb-1.5">For B2B, wholesale and general inquiries</p>
                  <div className="space-y-2.5">
                    <div>
                      <p className="font-sans text-[11px] text-brand-navy/45 uppercase tracking-wide">Wholesale &amp; B2B</p>
                      <a href="mailto:wholesale@jutoriahome.com" className="font-sans font-medium text-brand-navy hover:text-brand-gold transition-colors">
                        wholesale@jutoriahome.com
                      </a>
                    </div>
                    <div>
                      <p className="font-sans text-[11px] text-brand-navy/45 uppercase tracking-wide">Support</p>
                      <a href="mailto:support@jutoriahome.com" className="font-sans font-medium text-brand-navy hover:text-brand-gold transition-colors">
                        support@jutoriahome.com
                      </a>
                    </div>
                    <div>
                      <p className="font-sans text-[11px] text-brand-navy/45 uppercase tracking-wide">Sales</p>
                      <a href="mailto:sales@jutoriahome.com" className="font-sans font-medium text-brand-navy hover:text-brand-gold transition-colors">
                        sales@jutoriahome.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="bg-white border border-brand-navy/10 p-5 rounded-[2px]">
                  <div className="flex items-center gap-2 mb-3 text-brand-navy">
                    <Phone size={16} strokeWidth={1.5} />
                    <h4 className="font-serif font-bold text-sm">United Kingdom</h4>
                  </div>
                  <p className="font-sans text-xs text-brand-navy/50 uppercase tracking-wide mb-1">Sir Commerce Group Ltd</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3">
                    <a href="tel:+447311127176" className="font-sans text-sm font-medium text-brand-navy hover:text-brand-gold transition-colors">
                      +44 7311 127176
                    </a>
                    <a href="https://wa.me/447311127176" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-sans text-xs text-brand-navy/60 hover:text-brand-gold transition-colors">
                      <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </div>
                  <p className="font-sans text-xs text-brand-navy/50 uppercase tracking-wide mb-1">UK Warehouse Contact</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a href="tel:+447435945500" className="font-sans text-sm font-medium text-brand-navy hover:text-brand-gold transition-colors">
                      +44 7435 945500
                    </a>
                    <a href="https://wa.me/447435945500" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-sans text-xs text-brand-navy/60 hover:text-brand-gold transition-colors">
                      <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
                <div className="bg-white border border-brand-navy/10 p-5 rounded-[2px]">
                  <div className="flex items-center gap-2 mb-3 text-brand-navy">
                    <Phone size={16} strokeWidth={1.5} />
                    <h4 className="font-serif font-bold text-sm">Bangladesh</h4>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                    <a href="tel:+8801833093349" className="font-sans text-sm font-medium text-brand-navy hover:text-brand-gold transition-colors">
                      +880 1833-093349
                    </a>
                    <a href="https://wa.me/8801833093349" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-sans text-xs text-brand-navy/60 hover:text-brand-gold transition-colors">
                      <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <a href="tel:+8801324438566" className="font-sans text-sm font-medium text-brand-navy hover:text-brand-gold transition-colors">
                      +880 13 2443 8566
                    </a>
                    <a href="https://wa.me/8801324438566" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-sans text-xs text-brand-navy/60 hover:text-brand-gold transition-colors">
                      <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-serif font-bold text-brand-navy mb-1">Business / Wholesale</h4>
                  <p className="font-sans text-sm text-brand-navy/60">Wholesale inquiries, bulk orders, retail partnerships, hospitality projects</p>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-brand-navy mb-1">Custom & Product Development</h4>
                  <p className="font-sans text-sm text-brand-navy/60">Custom designs, material enquiries, product development</p>
                </div>
              </div>
            </div>

            {/* Inquiry Form (Right) */}
            <div id="inquiry-form" className="bg-white p-8 md:p-10 border border-brand-navy/10 shadow-premium rounded-[2px] scroll-mt-24">
              <h3 className="text-2xl font-serif font-bold text-brand-navy mb-6">Send an Inquiry</h3>

              {/* Form UI (Firebase integration will be done in later phases) */}
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/60 mb-2">Full Name *</label>
                    <input type="text" required placeholder="Jane Doe" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/60 mb-2">Company Name</label>
                    <input type="text" placeholder="Company Ltd." className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/60 mb-2">Business Email *</label>
                    <input type="email" required placeholder="jane@company.com" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/60 mb-2">Country / Region *</label>
                    <input type="text" required placeholder="United Kingdom" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/60 mb-2">Inquiry Type *</label>
                  <select required defaultValue="" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm text-brand-navy">
                    <option value="" disabled>Select an option</option>
                    {INQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/60 mb-2">Products / Collection of Interest</label>
                    <input type="text" placeholder="e.g. Jute placemats, planter baskets" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                  </div>
                  <div>
                    <label className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/60 mb-2">Estimated Order Quantity</label>
                    <input type="text" placeholder="e.g. 500 units" className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-xs font-bold uppercase tracking-wide text-brand-navy/60 mb-2">Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Tell us about your requirements, estimated quantity, etc."
                    className="w-full px-4 py-3 border border-brand-navy/15 bg-brand-offwhite focus:outline-none focus:border-brand-gold transition-colors font-sans text-sm resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-3 bg-brand-navy text-brand-ivory py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy rounded-[2px]"
                >
                  Submit Inquiry <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHAT CAN WE HELP WITH? */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-14 text-center">
            How Can We Help?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HELP_PATHS.map(({ icon: Icon, title, desc }) => (
              <div key={title}>
                <div className="w-12 h-12 bg-brand-navy/5 text-brand-navy flex items-center justify-center rounded-full mb-5">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="font-serif font-bold text-brand-navy mb-2">{title}</h3>
                <p className="font-sans text-sm text-brand-navy/60 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. OUR MATERIALS */}
      <section className="py-16 md:py-24 bg-brand-offwhite border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-4">
              Rooted in Natural Materials
            </h2>
            <p className="font-sans text-brand-navy/65 font-light leading-relaxed">
              Explore the natural materials behind our collections and discover the craftsmanship, character and possibilities of each fibre.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {materials.map((m) => (
              <Link
                key={m.slug}
                to={`/materials/${m.slug}`}
                className="inline-flex items-center gap-2 bg-white border border-brand-navy/15 text-brand-navy px-5 py-2.5 rounded-full text-sm font-sans font-medium hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                {m.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY PARTNER WITH JUTORIA? */}
      <section className="py-16 md:py-24 bg-white border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy mb-14 text-center">
            Built for Global Partnerships
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {WHY_PARTNER.map(({ icon: Icon, title, desc }) => (
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

      {/* 6. COMPANY INFORMATION — matches the verified details already published in the site footer */}
      <section className="py-16 md:py-24 bg-brand-offwhite border-t border-brand-navy/10">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="text-center mb-14">
            <span className="mb-4 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
              JUTORIA
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-navy">
              Company Information
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-white border border-brand-navy/10 p-7 rounded-[2px]">
              <h3 className="font-serif font-bold text-brand-navy text-lg mb-3">Registered Company</h3>
              <p className="font-sans text-sm text-brand-navy/70 leading-relaxed">
                Sir Commerce Group Ltd <br />
                Registered in England and Wales <br />
                Company No. 17029469
              </p>
            </div>
            <div className="bg-white border border-brand-navy/10 p-7 rounded-[2px]">
              <h3 className="font-serif font-bold text-brand-navy text-lg mb-3">UK Registered Office</h3>
              <p className="font-sans text-sm text-brand-navy/70 leading-relaxed">
                OFFICE 16785 <br />
                182–184 High Street North <br />
                East Ham, London E6 2JA <br />
                United Kingdom
              </p>
            </div>
            <div className="bg-white border border-brand-navy/10 p-7 rounded-[2px]">
              <h3 className="font-serif font-bold text-brand-navy text-lg mb-3">Bangladesh Corporate Office</h3>
              <p className="font-sans text-sm text-brand-navy/70 leading-relaxed">
                Sir Commerce Group Ltd <br />
                Kachari Bazar <br />
                Gaibandha-5700 <br />
                Bangladesh
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-20 md:py-28 bg-brand-navy text-center">
        <div className="container mx-auto max-w-2xl px-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-ivory mb-5 leading-tight">
            Let's Start a Conversation
          </h2>
          <p className="font-sans text-brand-ivory/70 font-light leading-relaxed mb-10">
            Tell us what you are looking for, and our team will help you explore the right materials, products and sourcing possibilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#inquiry-form" className="inline-flex items-center justify-center gap-3 bg-brand-gold text-brand-navy px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-ivory rounded-[2px]">
              Send An Inquiry <ArrowRight size={16} />
            </a>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 bg-transparent border border-brand-ivory/30 text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:border-brand-ivory hover:bg-brand-ivory/10 rounded-[2px]">
              Explore Collection
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
