import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Database, ExternalLink, ImageDown } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchAllProducts,
  deleteProduct,
  seedProductsFromStaticData,
  optimizeExistingProductImages,
  upsertProduct,
  type Product,
} from '../../services/firebase/products';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeProgress, setOptimizeProgress] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
      toast.error('প্রোডাক্ট লোড করতে সমস্যা হয়েছে — Firestore কনফিগ/নিয়ম চেক করুন।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const { seeded } = await seedProductsFromStaticData();
      toast.success(`${seeded}টা প্রোডাক্ট Firestore-এ যোগ হয়েছে (আগে থেকে থাকা প্রোডাক্ট বাদ)।`);
      await load();
    } catch (err) {
      console.error(err);
      toast.error('সিড করতে সমস্যা হয়েছে — Firestore নিয়ম/লগইন চেক করুন।');
    } finally {
      setSeeding(false);
    }
  };

  // Admin Panel থেকে আপলোড করা পুরনো প্রোডাক্ট ছবি (uploadProductImage() ফিক্স হওয়ার
  // আগে আপলোড হওয়া — অসংকুচিত PNG/JPG, প্রায়ই কয়েকশো KB-থেকে কয়েক MB) এক-বারের জন্য
  // ডাউনলোড+resize+WebP-convert+re-upload করে। বড় ক্যাটালগে সময় লাগতে পারে — চালু
  // অবস্থায় ট্যাব বন্ধ না করার জন্য বলা হচ্ছে টোস্টে।
  const handleOptimizeImages = async () => {
    if (!window.confirm('সব প্রোডাক্টের পুরনো (non-WebP) ছবি resize+WebP-তে কনভার্ট করে Firebase Storage-এ পুনরায় আপলোড হবে। এতে কয়েক মিনিট লাগতে পারে — চলার সময় এই ট্যাব বন্ধ করবেন না। এগোতে চান?')) return;
    setOptimizing(true);
    setOptimizeProgress('শুরু হচ্ছে...');
    try {
      const result = await optimizeExistingProductImages((done, total, sku) => {
        setOptimizeProgress(sku ? `${done + 1}/${total} — ${sku}` : `সম্পন্ন (${total}/${total})`);
      });
      const savedKB = Math.round((result.bytesBefore - result.bytesAfter) / 1024);
      toast.success(
        `${result.productsUpdated}টা প্রোডাক্ট আপডেট হয়েছে — ${result.imagesConverted}টা ছবি কনভার্ট (${result.imagesSkipped}টা আগে থেকেই WebP/static, স্কিপ)। প্রায় ${savedKB} KB বাঁচল।`,
      );
      await load();
    } catch (err) {
      console.error(err);
      toast.error('ছবি অপ্টিমাইজ করতে সমস্যা হয়েছে — Firestore/Storage নিয়ম চেক করুন।');
    } finally {
      setOptimizing(false);
      setOptimizeProgress('');
    }
  };

  const handleDelete = async (sku: string) => {
    if (!window.confirm(`প্রোডাক্ট "${sku}" মুছে ফেলতে চান? এই কাজ ফিরিয়ে নেওয়া যাবে না।`)) return;
    try {
      await deleteProduct(sku);
      toast.success('প্রোডাক্ট মুছে ফেলা হয়েছে।');
      await load();
    } catch (err) {
      console.error(err);
      toast.error('মুছতে সমস্যা হয়েছে।');
    }
  };

  const toggleField = async (product: Product, field: 'active' | 'featured') => {
    try {
      await upsertProduct({ ...product, [field]: !product[field] });
      await load();
    } catch (err) {
      console.error(err);
      toast.error('আপডেট করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <>
      <Helmet>
        <title>Products | JUTORIA Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-brand-navy mb-1">Product Management</h1>
            <p className="font-sans text-sm text-brand-navy/60">
              {products.length} product{products.length === 1 ? '' : 's'} in Firestore.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 border border-brand-navy/20 text-brand-navy px-4 py-2.5 text-sm font-semibold hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-50"
              title="src/data/products.json-এর বিদ্যমান প্রোডাক্ট Firestore-এ একবার কপি করে (আগে থেকে থাকলে স্কিপ করে)"
            >
              <Database size={16} />
              {seeding ? 'Seeding…' : 'Seed Existing Products'}
            </button>
            <button
              onClick={handleOptimizeImages}
              disabled={optimizing}
              className="flex items-center gap-2 border border-brand-navy/20 text-brand-navy px-4 py-2.5 text-sm font-semibold hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-50"
              title="পুরনো (non-WebP) প্রোডাক্ট ছবি resize+WebP-তে কনভার্ট করে Storage-এ পুনরায় আপলোড করে — পেজ লোড স্পিড বাড়ানোর জন্য"
            >
              <ImageDown size={16} />
              {optimizing ? optimizeProgress || 'Optimizing…' : 'Optimize Existing Images'}
            </button>
            <Link
              to="/admin/products/new"
              className="flex items-center gap-2 bg-brand-navy text-brand-gold px-4 py-2.5 text-sm font-semibold hover:bg-brand-gold hover:text-brand-navy transition-colors"
            >
              <Plus size={16} /> Add Product
            </Link>
          </div>
        </div>

        {products.length === 0 && !loading && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-md font-sans text-sm">
            এখনো Firestore-এ কোনো প্রোডাক্ট নেই। উপরের <strong>"Seed Existing Products"</strong> বাটনে ক্লিক করুন —
            এতে আপনার বিদ্যমান ৪টা প্রোডাক্ট (products.json থেকে) এখানে কপি হয়ে যাবে, এরপর থেকে এখান থেকেই এডিট করতে পারবেন।
          </div>
        )}

        <div className="bg-white border border-brand-navy/10 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-offwhite text-brand-navy/70 font-sans text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">SKU</th>
                  <th className="p-4 font-semibold">Materials</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Featured</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/5 font-sans text-sm">
                {loading && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-brand-navy/50">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading &&
                  products.map((p) => {
                    const thumb = p.images?.[0]?.url;
                    return (
                      <tr key={p.sku} className="hover:bg-brand-navy/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {thumb ? (
                              <img src={thumb} alt={p.name} loading="lazy" className="w-12 h-12 object-cover rounded border border-brand-navy/10" />
                            ) : (
                              <div className="w-12 h-12 bg-brand-offwhite rounded border border-brand-navy/10" />
                            )}
                            <span className="font-medium text-brand-navy">{p.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-brand-navy/70 font-mono text-xs">{p.sku}</td>
                        <td className="p-4 text-brand-navy/70">{(p.materialSlugs || []).join(', ') || '—'}</td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleField(p, 'active')}
                            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                              p.active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {p.active !== false ? 'Active' : 'Hidden'}
                          </button>
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => toggleField(p, 'featured')}
                            className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                              p.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {p.featured ? 'Featured' : 'No'}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/product/${encodeURIComponent(p.sku)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-brand-navy/50 hover:text-brand-navy transition-colors"
                              title="View on site"
                            >
                              <ExternalLink size={16} />
                            </a>
                            <Link
                              to={`/admin/products/${encodeURIComponent(p.sku)}/edit`}
                              className="p-2 text-brand-navy/50 hover:text-brand-gold transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(p.sku)}
                              className="p-2 text-brand-navy/50 hover:text-red-500 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
