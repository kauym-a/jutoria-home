import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductGallery from '../../components/product/ProductGallery';
import { useProducts } from '../../hooks/useProducts';

export default function ProductDetail(){
  const params = useParams();
  const sku = params.sku ? decodeURIComponent(params.sku) : undefined;
  const { products, loading } = useProducts(); // Firestore-backed, static ডেটায় fallback করে
  const product = products.find((p) => p.sku === sku);

  if (!product && loading) {
    return <div className="container mx-auto py-16 text-brand-navy/60">Loading…</div>;
  }

  if(!product) {
    return (
      <div className="container mx-auto py-16">
        <h1 className="text-2xl font-serif font-bold text-brand-navy">Product not found</h1>
        <p className="mt-4 text-brand-navy/70">The product with SKU <strong>{sku}</strong> was not found in the product data.</p>
        <Link to="/products" className="text-brand-gold mt-4 inline-block font-semibold">Back to products</Link>
      </div>
    );
  }

  const images = product.images || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 md:py-16">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
        <div className="w-full">
          <ProductGallery images={images} />
        </div>

        <div className="w-full lg:pt-2">
          <p className="mb-2 text-xs font-sans font-bold uppercase tracking-[0.2em] text-brand-gold">
            {product.excel_fields?.['Material Composition'] || 'Premium Product'}
          </p>
          <h1 className="mb-3 text-2xl font-serif font-bold text-brand-navy md:text-3xl lg:text-4xl">
            {product.name}
          </h1>
          <p className="mb-6 text-sm text-brand-navy/60">SKU: {product.sku}</p>

          {product.description && (
            <p className="mb-6 text-base text-brand-navy/75 leading-relaxed">
              {product.description}
            </p>
          )}

          <div className="mb-6 flex flex-wrap gap-3">
            {product.amazonUrl && (
              <a
                href={product.amazonUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-navy text-brand-ivory px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-colors rounded-[2px]"
              >
                Shop on Amazon
              </a>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border border-brand-navy/25 text-brand-navy px-6 py-3 text-xs font-bold uppercase tracking-widest hover:border-brand-navy hover:bg-brand-navy hover:text-brand-ivory transition-colors rounded-[2px]"
            >
              Wholesale Inquiry <ArrowRight size={14} />
            </Link>
          </div>

          <div className="rounded-[2px] border border-brand-navy/10 bg-brand-offwhite p-5 shadow-sm">
            <h2 className="mb-4 text-xl font-serif font-bold text-brand-navy">Product Specifications</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {Object.entries(product.excel_fields || {}).map(([k,v]) => (
                    <tr key={k} className="border-b border-brand-navy/10 last:border-b-0">
                      <th className="py-2 pr-4 align-top text-sm font-semibold text-brand-navy/80 w-40">{k}</th>
                      <td className="py-2 text-sm text-brand-navy/70">{v as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
