import { Helmet } from 'react-helmet-async';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, UploadCloud, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchCategory,
  upsertCategory,
  uploadCategoryImage,
  type Category,
} from '../../services/firebase/categories';

const EMPTY_CATEGORY: Category = {
  slug: '',
  name: '',
  desc: '',
  longDesc: '',
  image: '',
  order: 1,
  active: true,
};

// "Natural Jute" → "natural-jute"
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function AdminCategoryForm() {
  const { slug } = useParams<{ slug: string }>();
  const isEditing = Boolean(slug);
  const navigate = useNavigate();

  const [category, setCategory] = useState<Category>(EMPTY_CATEGORY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing || !slug) return;
    fetchCategory(decodeURIComponent(slug))
      .then((data) => {
        if (data) {
          setCategory(data);
        } else {
          toast.error('ক্যাটাগরি পাওয়া যায়নি।');
          navigate('/admin/categories');
        }
      })
      .finally(() => setLoading(false));
  }, [slug, isEditing, navigate]);

  const update = <K extends keyof Category>(key: K, value: Category[K]) => {
    setCategory((c) => ({ ...c, [key]: value }));
  };

  const handleNameChange = (name: string) => {
    setCategory((c) => ({
      ...c,
      name,
      // slug অটো-জেনারেট হয় যতক্ষণ না ইউজার নিজে হাতে বদলায় (নতুন ক্যাটাগরির ক্ষেত্রে)
      slug: !isEditing && !slugTouched ? slugify(name) : c.slug,
    }));
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const uploadSlug = category.slug.trim() || slugify(category.name);
    if (!uploadSlug) {
      toast.error('আপলোডের আগে নাম বা slug লিখুন — ছবি এই slug-এর নামেই সংরক্ষিত হবে।');
      return;
    }

    setUploading(true);
    try {
      const url = await uploadCategoryImage(uploadSlug, file);
      update('image', url);
      toast.success('ছবি আপলোড হয়েছে। এখন "Save Category" চাপুন।');
    } catch (err) {
      console.error(err);
      toast.error('ছবি আপলোড ব্যর্থ হয়েছে।');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSlug = category.slug.trim();
    if (!cleanSlug || !category.name.trim()) {
      toast.error('Name ও Slug আবশ্যক।');
      return;
    }
    setSaving(true);
    try {
      await upsertCategory({ ...category, slug: cleanSlug, order: Number(category.order) || 0 });
      toast.success(isEditing ? 'ক্যাটাগরি আপডেট হয়েছে।' : 'নতুন ক্যাটাগরি তৈরি হয়েছে।');
      navigate('/admin/categories');
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

  const inputClass =
    'w-full border border-brand-navy/15 rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand-gold disabled:bg-brand-offwhite disabled:text-brand-navy/50';
  const labelClass = 'block text-xs font-bold uppercase tracking-wide text-brand-navy/50 mb-1.5';

  return (
    <>
      <Helmet>
        <title>{isEditing ? `Edit ${category.name}` : 'Add Category'} | JUTORIA Admin</title>
      </Helmet>

      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          to="/admin/categories"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand-navy/60 hover:text-brand-gold transition-colors"
        >
          <ArrowLeft size={16} /> Back to Categories
        </Link>

        <h1 className="text-3xl font-serif font-bold text-brand-navy">
          {isEditing ? `Edit: ${category.name || category.slug}` : 'Add New Category'}
        </h1>

        <form onSubmit={handleSave} className="space-y-8 font-sans">
          <div className="bg-white border border-brand-navy/10 rounded-lg p-6 space-y-4">
            <h2 className="text-lg font-serif font-bold text-brand-navy mb-2">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  type="text"
                  value={category.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Natural Jute"
                />
              </div>
              <div>
                <label className={labelClass}>Slug {isEditing && '(locked)'}</label>
                <input
                  type="text"
                  value={category.slug}
                  disabled={isEditing}
                  onChange={(e) => {
                    setSlugTouched(true);
                    update('slug', slugify(e.target.value));
                  }}
                  className={inputClass}
                  placeholder="natural-jute"
                />
                <p className="text-xs text-brand-navy/40 mt-1">URL হবে /materials/{category.slug || 'slug'}</p>
              </div>
              <div>
                <label className={labelClass}>Order / Position</label>
                <input
                  type="number"
                  min={0}
                  value={category.order}
                  onChange={(e) => update('order', Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm py-2.5">
                  <input
                    type="checkbox"
                    checked={category.active !== false}
                    onChange={(e) => update('active', e.target.checked)}
                  />
                  Active (visible on site)
                </label>
              </div>
            </div>

            <div>
              <label className={labelClass}>Short Description (card)</label>
              <textarea
                value={category.desc}
                onChange={(e) => update('desc', e.target.value)}
                rows={2}
                className={inputClass}
                placeholder="One line shown on the homepage card."
              />
            </div>

            <div>
              <label className={labelClass}>Long Description (detail page)</label>
              <textarea
                value={category.longDesc}
                onChange={(e) => update('longDesc', e.target.value)}
                rows={5}
                className={inputClass}
                placeholder="Full paragraph shown on /materials/{slug}."
              />
            </div>
          </div>

          {/* Image */}
          <div className="bg-white border border-brand-navy/10 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-serif font-bold text-brand-navy">Image / Icon</h2>
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelected}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-1.5 text-sm font-semibold bg-brand-navy text-brand-gold px-3 py-1.5 rounded hover:bg-brand-gold hover:text-brand-navy transition-colors disabled:opacity-50"
                >
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                  {uploading ? 'আপলোড হচ্ছে…' : 'Upload Image'}
                </button>
              </div>
            </div>
            <p className="text-xs text-brand-navy/40 -mt-2 mb-3">
              কম্পিউটার থেকে একটা ছবি সিলেক্ট করে <strong>Upload Image</strong>-এ ক্লিক করুন — সরাসরি সার্ভারে আপলোড
              হয়ে URL নিজে থেকে বসে যাবে। অথবা নিচের ঘরে সরাসরি একটা path/URL লিখুন।
            </p>
            <div className="flex items-center gap-3">
              {category.image && (
                <img
                  src={category.image}
                  alt=""
                  className="w-16 h-16 object-cover rounded border border-brand-navy/10 flex-shrink-0"
                />
              )}
              <input
                type="text"
                value={category.image}
                onChange={(e) => update('image', e.target.value)}
                placeholder="/materials/natural-jute.png"
                className="flex-grow border border-brand-navy/15 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-gold"
              />
              {category.image && (
                <button
                  type="button"
                  onClick={() => update('image', '')}
                  className="text-brand-navy/40 hover:text-red-500 flex-shrink-0"
                  title="Clear image"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link
              to="/admin/categories"
              className="px-6 py-3 border border-brand-navy/20 text-brand-navy text-sm font-semibold hover:border-brand-navy transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-brand-navy text-brand-gold px-6 py-3 text-sm font-bold hover:bg-brand-gold hover:text-brand-navy transition-colors disabled:opacity-50"
            >
              <Save size={16} /> {saving ? 'Saving…' : 'Save Category'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
