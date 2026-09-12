import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowRight, Construction } from 'lucide-react';

type Props = {
  title: string;
  eyebrow: string;
  description: string;
};

// একটা কমন "কনটেন্ট শীঘ্রই আসছে" পেজ — নতুন মেনু স্ট্রাকচারের যে অংশগুলোর জন্য এখনো
// আসল কনটেন্ট/ছবি হাতে পাইনি (People/Artisans, Corporate Info, Gallery ইত্যাদি), সেগুলো
// এখান থেকে রেন্ডার হয় যাতে সাইটে কোনো লিংক ৪০৪ না দেখায়। কনটেন্ট রেডি হলে যার যার
// নিজস্ব পেজে বদলে দেওয়া যাবে।
export default function PlaceholderPage({ title, eyebrow, description }: Props) {
  return (
    <>
      <Helmet>
        <title>{title} | JUTORIA</title>
        {/* এই পেজগুলো এখনো "শীঘ্রই আসছে" — real content না থাকা পর্যন্ত thin/duplicate
            content হিসেবে ইনডেক্স না হওয়াই ভালো। আসল কনটেন্ট বসলে এই লাইনটা সরিয়ে দিতে হবে। */}
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="relative min-h-[60vh] flex items-center bg-brand-ivory">
        <div className="container mx-auto max-w-3xl px-4 py-24 text-center">
          <span className="block font-sans text-brand-gold font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
            {eyebrow}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brand-navy leading-tight mb-8">
            {title}
          </h1>
          <p className="font-sans text-lg text-brand-navy/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
            {description}
          </p>
          <div className="inline-flex items-center gap-3 border border-brand-navy/15 bg-white px-6 py-4 rounded-[2px] text-brand-navy/60 font-sans text-sm mb-10">
            <Construction size={18} className="text-brand-gold" />
            This section is being finalized — content coming soon.
          </div>
          <div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-brand-navy text-brand-ivory px-8 py-4 font-sans font-bold tracking-[0.2em] text-[11px] uppercase transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy rounded-[2px]"
            >
              Contact Us Meanwhile <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
