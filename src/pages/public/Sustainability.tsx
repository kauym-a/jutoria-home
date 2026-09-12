import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { absoluteUrl } from '../../lib/seo';

export default function Sustainability() {
  return (
    <>
      <Helmet>
        <title>Sustainability | JUTORIA - Responsible Natural-Fiber Home Goods</title>
        <meta name="description" content="JUTORIA's sustainability commitments: responsible sourcing, artisan empowerment, and careful stewardship of natural materials." />
        <link rel="canonical" href={absoluteUrl('/sustainability')} />
      </Helmet>

      <section className="bg-brand-navy text-brand-offwhite py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <span className="block font-sans text-brand-gold font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
            Sustainability
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Responsible Materials. Lasting Value.
          </h1>
          <p className="font-sans text-lg opacity-90 font-light leading-relaxed mb-8">
            We prioritize natural, renewable fibers and low-impact production methods to minimise environmental footprint and support resilient livelihoods for our craft partners.
          </p>
          <div className="mt-8">
            <Link to="/wholesale" className="inline-flex items-center gap-3 bg-brand-gold text-brand-navy px-8 py-3 font-sans font-bold tracking-widest text-[13px] uppercase transition-all duration-300 hover:bg-brand-offwhite hover:text-brand-navy rounded-[2px]">
              Wholesale Inquiries
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-serif font-bold text-brand-navy mb-3">Sourced with Care</h3>
              <p className="font-sans text-base text-brand-navy/80 leading-relaxed">We work with naturally renewing fibers like jute, seagrass, bamboo and hogla, choosing suppliers who meet ethical harvesting standards.</p>
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-brand-navy mb-3">Craft & Community</h3>
              <p className="font-sans text-base text-brand-navy/80 leading-relaxed">Supporting artisan communities through fair partnerships and predictable orders helps sustain skills and create local economic opportunity.</p>
            </div>

            <div>
              <h3 className="text-xl font-serif font-bold text-brand-navy mb-3">Longevity & Repair</h3>
              <p className="font-sans text-base text-brand-navy/80 leading-relaxed">Our products are designed for long-term use; durable materials and simple repair guidance reduce waste and extend product life.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
