import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

type ImageEntry = { filename: string; role: string; url: string; confidence?: string };

type Product = {
  sku: string;
  name: string;
  image_folder?: string | null;
  images?: ImageEntry[];
  excel_fields?: Record<string, any>;
};

export default function ProductCard({ product }:{ product: Product }) {
  const primary = product.images?.find(i => i.role === 'primary') || product.images?.[0];
  const imageUrl = primary?.url || '/placemat-product.jpg';

  const productPath = `/product/${encodeURIComponent(product.sku)}`;

  // B2B wholesale — MOQ দেখানো বাধ্যতামূলক। ডাটায় থাকলে সেটা, নাহলে placeholder।
  // "500 SET" / "500 set" / "1500 pcs" — ইউনিটটা একটু পরিপাটি করে দেখানো হয়।
  const rawMoq = product.excel_fields?.['MOQ'];
  const moq = typeof rawMoq === 'string' && rawMoq.trim()
    ? rawMoq.trim().replace(/\bsets?\b/i, 'Sets').replace(/\bpcs\b/i, 'pcs')
    : '300 Sets';

  return (
    <div className="group h-full cursor-pointer">
      <Link to={productPath} className="block relative mb-4 overflow-hidden border border-brand-navy/10 bg-brand-offwhite">
        <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-brand-offwhite">
          <img loading="lazy" decoding="async"
            src={imageUrl}
            alt={product.name}
            className="h-full w-full object-contain object-center p-3 transition-transform duration-700 group-hover:scale-[1.02]"
          />
        </div>
        <div className="absolute inset-0 bg-brand-navy/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
          <span className="bg-brand-gold text-brand-navy px-6 py-3 font-sans font-bold tracking-wider text-xs uppercase transform translate-y-4 transition-all duration-300 group-hover:translate-y-0">
            View Details
          </span>
        </div>
      </Link>
      <div className="text-center">
        <span className="text-xs font-sans font-bold tracking-widest text-brand-gold uppercase block mb-2">
          {product.excel_fields?.['Material Composition'] || ''}
        </span>
        <h3 className="text-lg font-serif font-bold text-brand-navy mb-2">
          <Link to={productPath}>{product.name}</Link>
        </h3>
        <span className="mx-auto mb-3 flex w-fit items-center gap-1.5 rounded-full bg-brand-navy/[0.06] px-3 py-1 font-sans text-xs font-bold tracking-wide text-brand-navy">
          <Package size={13} strokeWidth={2} className="shrink-0 text-brand-gold" />
          MOQ: {moq}
        </span>
        <span className="text-sm font-sans text-brand-navy/60 border border-brand-navy/20 px-3 py-1 rounded-full inline-block">
          SKU: {product.sku}
        </span>
      </div>
    </div>
  );
}
