import { Helmet } from 'react-helmet-async';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, UploadCloud, Loader2, ChevronUp, ChevronDown, ListOrdered } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProduct, fetchAllProducts, upsertProduct, type Product, type ProductImage } from '../../services/firebase/products';
import { uploadProductImage, sortSpecKeys } from '../../services/firebase/productsAdmin';
import { useCategories } from '../../hooks/useCategories';

const CATEGORIES = ['Placemats', 'Planter Baskets', 'Laundry Baskets', 'Organizer Baskets', 'Floor Mats / Rugs'];

const EMPTY_PRODUCT: Product = {
  sku: '',
  name: '',
  category: CATEGORIES[0],
  description: '',
  materialSlugs: [],
  images: [],
  amazonUrl: '',
  featured: false,
  active: true,
  relatedSkus: [],
  excel_fields: {},
};

export default function AdminProductForm() {
  const { sku } = useParams<{ sku: string }>();
  const isEditing = Boolean(sku);
  const navigate = useNavigate();
  // ম্যাটেরিয়াল-পিকারের অপশন এখন Firestore 'categories' থেকে (admin: /admin/categories)
  const { categories: materials } = useCategories();

  const [product, setProduct] = useState<Product>(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [specRows, setSpecRows] = useState<[string, string][]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // কাস্টম ক্যাটাগরি — ডিফল্ট ৫টার বাইরে অ্যাডমিন যেকোনো নাম টাইপ করে যোগ করতে পারবে।
  // এর জন্য আলাদা Firestore কালেকশন লাগেনি — বিদ্যমান প্রোডাক্টগুলোতে যা যা category
  // ব্যবহার হয়েছে, সেগুলোই ডিফল্ট লিস্টের সাথে যোগ হয়ে ড্রপডাউন বানায়। তাই একবার কোনো
  // প্রোডাক্টে নতুন ক্যাটাগরি সেভ হলে, পরের যেকোনো প্রোডাক্টের ফর্মেই সেটা ড্রপডাউনে দেখাবে।
  const [knownCategories, setKnownCategories] = useState<string[]>(CATEGORIES);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    fetchAllProducts()
      .then((all) => {
        const used = all.map((p) => p.category).filter((c): c is string => !!c && c.trim() !== '');
        setKnownCategories((prev) => Array.from(new Set([...prev, ...used])));
      })
      .catch(() => {
        /* dropdown শুধু ডিফল্ট ৫টা দেখাবে — সমস্যা হলে চুপচাপ fallback করে, ফর্ম আটকাবে না */
      });
  }, []);

  const categoryOptions = Array.from(
    new Set([...knownCategories, ...(product.category ? [product.category] : [])]),
  );

  const confirmNewCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error('ক্যাটাগরির নাম লিখুন।');
      return;
    }
    update('category', name);
    setKnownCategories((prev) => Array.from(new Set([...prev, name])));
    setAddingCategory(false);
    setNewCategoryName('');
  };

  useEffect(() => {
    if (!isEditing || !sku) return;
    fetchProduct(decodeURIComponent(sku))
      .then((data) => {
        if (data) {
          setProduct(data);
          // specOrder থাকলে (নতুন প্রোডাক্ট, বা এই ফিচার আসার পর একবার সেভ হয়েছে) সেই
          // ক্রম অনুসরণ করে রো বানানো হয় — Firestore-এর excel_fields ম্যাপ নিজে থেকে
          // কোনো নির্দিষ্ট ক্রম রাখে না (দেখুন products.ts-এর specOrder কমেন্ট)। পুরনো
          // প্রোডাক্টে specOrder না থাকলে Object.entries()-এই ফলব্যাক করে, আগের মতোই।
          const fields = data.excel_fields || {};
          const order = data.specOrder?.filter((k) => k in fields) || Object.keys(fields);
          const extraKeys = Object.keys(fields).filter((k) => !order.includes(k));
          setSpecRows([...order, ...extraKeys].map((k) => [k, fields[k]]));
        } else {
          toast.error('প্রোডাক্ট পাওয়া যায়নি।');
          navigate('/admin/products');
        }
      })
      .finally(() => setLoading(false));
  }, [sku, isEditing, navigate]);

  const update = <K extends keyof Product>(key: K, value: Product[K]) => {
    setProduct((p) => ({ ...p, [key]: value }));
  };

  const toggleMaterial = (slug: string) => {
    setProduct((p) => {
      const current = p.materialSlugs || [];
      const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
      return { ...p, materialSlugs: next };
    });
  };

  const updateImage = (index: number, field: keyof ProductImage, value: string) => {
    setProduct((p) => {
      const images = [...p.images];
      images[index] = { ...images[index], [field]: value };
      return { ...p, images };
    });
  };

  const addImage = () => {
    setProduct((p) => ({
      ...p,
      // প্রথম ছবিই শুধু ডিফল্টভাবে 'primary' হবে — এরপরেরগুলো 'gallery',
      // যাতে একাধিক ছবি ভুলবশত 'primary' role নিয়ে সেভ না হয়ে যায়
      images: [...p.images, { url: '', role: p.images.length === 0 ? 'primary' : 'gallery' }],
    }));
  };

  const removeImage = (index: number) => {
    setProduct((p) => ({ ...p, images: p.images.filter((_, i) => i !== index) }));
  };

  /**
   * কম্পিউটার থেকে সরাসরি একাধিক ছবি সিলেক্ট করে Firebase Storage-এ আপলোড করে।
   * আপলোড শেষ হলে প্রতিটার জন্য একটা নতুন image row (URL সহ) স্বয়ংক্রিয়ভাবে যোগ হয় —
   * তাই আর হাতে কোনো path টাইপ করার দরকার নেই, তাই নাম-মিসম্যাচ (501 বনাম 502-এর মতো
   * টাইপো) হওয়ার সুযোগই থাকে না।
   */
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = ''; // একই ফাইল আবার সিলেক্ট করলেও যেন onChange ফায়ার হয়
    if (files.length === 0) return;

    if (!product.sku.trim()) {
      toast.error('আপলোডের আগে SKU লিখুন — ছবি এই SKU-এর নামেই সংরক্ষিত হবে।');
      return;
    }

    setUploading(true);
    let uploaded = 0;
    try {
      for (const file of files) {
        try {
          const url = await uploadProductImage(product.sku, file);
          setProduct((p) => ({
            ...p,
            images: [
              ...p.images,
              { url, role: p.images.length === 0 ? 'primary' : 'gallery', filename: file.name },
            ],
          }));
          uploaded += 1;
        } catch (err) {
          console.error(err);
          toast.error(`"${file.name}" আপলোড ব্যর্থ হয়েছে।`);
        }
      }
      if (uploaded > 0) {
        toast.success(`${uploaded}টা ছবি আপলোড হয়েছে। এখন "Save Product" চাপুন।`);
      }
    } finally {
      setUploading(false);
    }
  };

  const updateSpecRow = (index: number, keyOrValue: 'key' | 'value', val: string) => {
    setSpecRows((rows) => {
      const next = [...rows];
      next[index] = keyOrValue === 'key' ? [val, next[index][1]] : [next[index][0], val];
      return next;
    });
  };

  const addSpecRow = () => setSpecRows((rows) => [...rows, ['', '']]);

  // Admin Products লিস্ট পেজের বাল্ক "Apply Standard Spec Order" বাটনের মতোই একই
  // sortSpecKeys() লজিক ব্যবহার করে, কিন্তু এখানে শুধু এই একটা প্রোডাক্টে, তাৎক্ষণিকভাবে
  // ফর্ম state-এ (Firestore-এ কিছু লেখা হয় না যতক্ষণ না "Save Product" চাপা হয়) — এডিট
  // করার সময়ই এক ক্লিকে সাজানোর জন্য, আলাদা করে বাল্ক পেজে যাওয়ার দরকার নেই।
  const sortSpecRows = () => {
    setSpecRows((rows) => {
      const valueByKey = new Map(rows.map(([k, v]) => [k, v]));
      return sortSpecKeys(rows.map(([k]) => k)).map((k) => [k, valueByKey.get(k) ?? ''] as [string, string]);
    });
  };
  const removeSpecRow = (index: number) => setSpecRows((rows) => rows.filter((_, i) => i !== index));

  // spec-এর ক্রম ম্যানুয়ালি ঠিক করার জন্য (যেমন "Brand" আগে, "Size" পরে চাই) — up/down
  // দিয়ে দুটো পাশাপাশি সারি অদলবদল করে। পুরনো প্রোডাক্টেও কাজ করে, কারণ specRows
  // এমনিতেই বর্তমান specOrder (বা না থাকলে Firestore-এর ফলব্যাক ক্রম) থেকে লোড হয় —
  // এখানে সাজিয়ে Save করলেই নতুন ক্রম specOrder হিসেবে সেভ হয়ে যাবে (দেখুন handleSave)।
  const moveSpecRow = (index: number, direction: -1 | 1) => {
    setSpecRows((rows) => {
      const target = index + direction;
      if (target < 0 || target >= rows.length) return rows;
      const next = [...rows];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.sku.trim() || !product.name.trim()) {
      toast.error('SKU ও Product Name আবশ্যক।');
      return;
    }
    setSaving(true);
    try {
      const validRows = specRows.filter(([k]) => k.trim() !== '');
      const excel_fields = Object.fromEntries(validRows);
      // specOrder = validRows-এর নিজস্ব ক্রম অনুযায়ী শুধু key-গুলো, একটা array হিসেবে
      // সেভ হয় — Firestore array insertion order রাখে (map রাখে না), তাই এটাই আসল
      // ক্রমের সোর্স অফ ট্রুথ। excel_fields ম্যাপটা নির্দিষ্ট key দিয়ে লুকআপের জন্য
      // (MOQ, Material Composition ইত্যাদি — অন্যান্য অনেক জায়গায় ব্যবহৃত) অপরিবর্তিত।
      const specOrder = validRows.map(([k]) => k);
      await upsertProduct({ ...product, excel_fields, specOrder });
      toast.success(isEditing ? 'প্রোডাক্ট আপডেট হয়েছে।' : 'নতুন প্রোডাক্ট তৈরি হয়েছে।');
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error('সেভ করতে সমস্যা হয়েছে — Firestore নিয়ম/লগইন চেক করুন।');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-16 text-center text-brand-navy/50">Loading…</div>;
  }

  return (
    <>
      <Helmet>
        <title>{isEditing ? `Edit ${product.name}` : 'Add Product'} | JUTORIA Admin</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/admin/products" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy/60 hover:text-brand-gold transition-colors">
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <h1 className="text-3xl font-serif font-bold text-brand-navy">
          {isEditing ? `Edit: ${product.name || product.sku}` : 'Add New Product'}
        </h1>

        <form onSubmit={handleSave} className="space-y-8 font-sans">
          {/* Basic Info */}
          <div className="bg-white border border-brand-navy/10 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-serif font-bold text-brand-navy mb-2">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-navy/50 mb-1.5">
                  SKU {isEditing && '(locked)'}
                </label>
                <input
                  type="text"
                  value={product.sku}
                  disabled={isEditing}
                  onChange={(e) => update('sku', e.target.value)}
                  className="w-full border border-brand-navy/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold disabled:bg-brand-offwhite disabled:text-brand-navy/50"
                  placeholder="e.g. JTR-SPM-NAT-RND-14-S6"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-navy/50 mb-1.5">Product Name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => update('name', e.target.value)}
                  className="w-full border border-brand-navy/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-navy/50 mb-1.5">Category</label>
                {addingCategory ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          confirmNewCategory();
                        }
                      }}
                      placeholder="e.g. Wall Décor"
                      className="w-full border border-brand-navy/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                    />
                    <button
                      type="button"
                      onClick={confirmNewCategory}
                      className="px-3 rounded bg-brand-navy text-brand-gold text-sm font-semibold hover:bg-brand-gold hover:text-brand-navy transition-colors flex-shrink-0"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAddingCategory(false); setNewCategoryName(''); }}
                      className="px-3 rounded border border-brand-navy/20 text-brand-navy/60 text-sm hover:border-brand-navy transition-colors flex-shrink-0"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <select
                    value={product.category}
                    onChange={(e) => {
                      if (e.target.value === '__new__') {
                        setAddingCategory(true);
                        setNewCategoryName('');
                      } else {
                        update('category', e.target.value);
                      }
                    }}
                    className="w-full border border-brand-navy/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="__new__">+ Add New Category…</option>
                  </select>
                )}
                <p className="text-xs text-brand-navy/40 mt-1">
                  নতুন নাম যোগ করলে এই ও ভবিষ্যতের প্রোডাক্ট ফর্মে ড্রপডাউনে দেখাবে, এবং এই প্রোডাক্ট সেভ হলে
                  পাবলিক "/categories" পেজেও স্বয়ংক্রিয়ভাবে একটা নতুন কার্ড হিসেবে দেখাবে (দেখুন
                  useProductCategories.ts) — কোনো আলাদা কোড এডিটের দরকার নেই। কার্ডের ছবি এই category-র প্রথম
                  প্রোডাক্টের primary ছবি থেকে, আর desc/longDesc একটা generic টেক্সট থেকে আসবে যতক্ষণ না
                  src/data/categories.ts-এ হাতে-লেখা কপি যোগ করা হয় (ঐচ্ছিক)।
                </p>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wide text-brand-navy/50 mb-1.5">Amazon URL</label>
                <input
                  type="url"
                  value={product.amazonUrl}
                  onChange={(e) => update('amazonUrl', e.target.value)}
                  className="w-full border border-brand-navy/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
                  placeholder="https://amazon.com/..."
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-brand-navy/50 mb-1.5">Description</label>
              <textarea
                value={product.description}
                onChange={(e) => update('description', e.target.value)}
                rows={3}
                className="w-full border border-brand-navy/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold"
              />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={product.active !== false} onChange={(e) => update('active', e.target.checked)} />
                Active (visible on site)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!product.featured} onChange={(e) => update('featured', e.target.checked)} />
                Featured
              </label>
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white border border-brand-navy/10 rounded-lg p-6">
            <h2 className="text-lg font-serif font-bold text-brand-navy mb-4">Materials</h2>
            <div className="flex flex-wrap gap-3">
              {materials.map((m) => (
                <button
                  type="button"
                  key={m.slug}
                  onClick={() => toggleMaterial(m.slug)}
                  className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                    product.materialSlugs?.includes(m.slug)
                      ? 'bg-brand-navy text-brand-gold border-brand-navy'
                      : 'border-brand-navy/20 text-brand-navy/70 hover:border-brand-gold'
                  }`}
                >
                  {m.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-brand-navy/40 mt-3">
              এখানে যা সিলেক্ট করবেন সেই ম্যাটেরিয়াল পেজে ("/materials/{'{slug}'}") এই প্রোডাক্ট স্বয়ংক্রিয়ভাবে দেখাবে।
            </p>
          </div>

          {/* Images */}
          <div className="bg-white border border-brand-navy/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-brand-navy">Images</h2>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFilesSelected}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 text-sm font-semibold bg-brand-navy text-brand-gold px-3 py-1.5 rounded hover:bg-brand-gold hover:text-brand-navy transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                  {uploading ? 'আপলোড হচ্ছে…' : 'Upload Images'}
                </button>
                <button type="button" onClick={addImage} className="flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-brand-navy">
                  <Plus size={16} /> Add URL manually
                </button>
              </div>
            </div>
            <p className="text-xs text-brand-navy/40 -mt-2 mb-3">
              কম্পিউটার থেকে একসাথে একাধিক ছবি সিলেক্ট করে <strong>Upload Images</strong>-এ ক্লিক করুন — সরাসরি সার্ভারে আপলোড হয়ে URL নিজে থেকে বসে যাবে।
              Hostinger-এ আলাদাভাবে ফাইল রাখা বা path হাতে টাইপ করার দরকার নেই।
            </p>
            <div className="space-y-3">
              {product.images.map((img, i) => (
                <div key={i} className="flex items-center gap-3">
                  {img.url && <img src={img.url} alt="" loading="lazy" className="w-12 h-12 object-cover rounded border border-brand-navy/10 flex-shrink-0" />}
                  <input
                    type="text"
                    value={img.url}
                    onChange={(e) => updateImage(i, 'url', e.target.value)}
                    placeholder="/product-master/.../image.png"
                    className="flex-grow border border-brand-navy/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
                  />
                  <input
                    type="text"
                    value={img.role || ''}
                    onChange={(e) => updateImage(i, 'role', e.target.value)}
                    placeholder="role (primary, lifestyle...)"
                    className="w-40 border border-brand-navy/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
                  />
                  <button type="button" onClick={() => removeImage(i)} className="text-brand-navy/40 hover:text-red-500 flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {product.images.length === 0 && (
                <p className="text-sm text-brand-navy/40">প্রথম ছবি ("primary" role) সবার আগে দেওয়াই ভালো — এটাই মূল থাম্বনেইল হিসেবে দেখাবে।</p>
              )}
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white border border-brand-navy/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-brand-navy">Specifications</h2>
              <div className="flex items-center gap-4">
                <button type="button" onClick={sortSpecRows} className="flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-brand-navy" title="Brand, Material, Color... ক্রমে সাজিয়ে দেয় (MOQ সবার শেষে) — Save করার আগ পর্যন্ত এখনো সেভ হয়নি">
                  <ListOrdered size={16} /> Sort by Standard Order
                </button>
                <button type="button" onClick={addSpecRow} className="flex items-center gap-1.5 text-sm font-semibold text-brand-gold hover:text-brand-navy">
                  <Plus size={16} /> Add Row
                </button>
              </div>
            </div>
            <p className="text-xs text-brand-navy/40 -mt-2 mb-3">
              <strong>Sort by Standard Order</strong> চাপলে Brand, Material, Color... এই ক্রমে (MOQ
              সবার শেষে) সব রো সাজিয়ে দেয় — অথবা উপরে/নিচে তীর চেপে হাতে ক্রম ঠিক করুন। যেভাবেই
              সাজান, নিচে <strong>Save Product</strong> না চাপা পর্যন্ত এখনো সেভ হয়নি।
            </p>
            <div className="space-y-3">
              {specRows.map(([k, v], i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-shrink-0 flex-col">
                    <button
                      type="button"
                      onClick={() => moveSpecRow(i, -1)}
                      disabled={i === 0}
                      aria-label="Move up"
                      className="text-brand-navy/40 hover:text-brand-gold disabled:opacity-20 disabled:hover:text-brand-navy/40"
                    >
                      <ChevronUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveSpecRow(i, 1)}
                      disabled={i === specRows.length - 1}
                      aria-label="Move down"
                      className="text-brand-navy/40 hover:text-brand-gold disabled:opacity-20 disabled:hover:text-brand-navy/40"
                    >
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <span className="w-5 flex-shrink-0 text-xs text-brand-navy/40">{i + 1}.</span>
                  <input
                    type="text"
                    value={k}
                    onChange={(e) => updateSpecRow(i, 'key', e.target.value)}
                    placeholder="Field (e.g. MOQ)"
                    className="w-52 border border-brand-navy/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
                  />
                  <input
                    type="text"
                    value={v}
                    onChange={(e) => updateSpecRow(i, 'value', e.target.value)}
                    placeholder="Value"
                    className="flex-grow border border-brand-navy/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
                  />
                  <button type="button" onClick={() => removeSpecRow(i)} className="text-brand-navy/40 hover:text-red-500 flex-shrink-0">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link to="/admin/products" className="px-6 py-3 border border-brand-navy/20 text-brand-navy text-sm font-semibold hover:border-brand-navy transition-colors">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-brand-navy text-brand-gold px-6 py-3 text-sm font-bold hover:bg-brand-gold hover:text-brand-navy transition-colors disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving…' : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
