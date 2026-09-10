import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Database, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchAllCategories,
  deleteCategory,
  seedCategoriesFromStaticData,
  upsertCategory,
  displayNumber,
  type Category,
} from '../../services/firebase/categories';

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error('ক্যাটাগরি লোড করতে সমস্যা হয়েছে — Firestore কনফিগ/নিয়ম চেক করুন।');
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
      const { seeded } = await seedCategoriesFromStaticData();
      toast.success(`${seeded}টা ক্যাটাগরি Firestore-এ যোগ হয়েছে (আগে থেকে থাকা বাদ)।`);
      await load();
    } catch (err) {
      console.error(err);
      toast.error('সিড করতে সমস্যা হয়েছে — Firestore নিয়ম/লগইন চেক করুন।');
    } finally {
      setSeeding(false);
    }
  };

  const handleDelete = async (cat: Category) => {
    if (!window.confirm(`ক্যাটাগরি "${cat.name}" মুছে ফেলতে চান? এই কাজ ফিরিয়ে নেওয়া যাবে না।`)) return;
    try {
      await deleteCategory(cat.slug);
      toast.success('ক্যাটাগরি মুছে ফেলা হয়েছে।');
      await load();
    } catch (err) {
      console.error(err);
      toast.error('মুছতে সমস্যা হয়েছে।');
    }
  };

  const toggleActive = async (cat: Category) => {
    try {
      await upsertCategory({ ...cat, active: cat.active === false });
      await load();
    } catch (err) {
      console.error(err);
      toast.error('আপডেট করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <>
      <Helmet>
        <title>Categories | JUTORIA Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-brand-navy mb-1">Category Management</h1>
            <p className="font-sans text-sm text-brand-navy/60">
              {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} in Firestore — drives the homepage
              “Our Materials” grid and the /materials pages.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleSeed}
              disabled={seeding}
              className="flex items-center gap-2 border border-brand-navy/20 text-brand-navy px-4 py-2.5 text-sm font-semibold hover:border-brand-gold hover:text-brand-gold transition-colors disabled:opacity-50"
              title="src/data/materials.ts-এর বিদ্যমান ৭টা আইটেম Firestore-এ একবার কপি করে (আগে থেকে থাকলে স্কিপ করে)"
            >
              <Database size={16} />
              {seeding ? 'Seeding…' : 'Seed Existing Categories'}
            </button>
            <Link
              to="/admin/categories/new"
              className="flex items-center gap-2 bg-brand-navy text-brand-gold px-4 py-2.5 text-sm font-semibold hover:bg-brand-gold hover:text-brand-navy transition-colors"
            >
              <Plus size={16} /> Add Category
            </Link>
          </div>
        </div>

        {categories.length === 0 && !loading && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 p-5 rounded-md font-sans text-sm">
            এখনো Firestore-এ কোনো ক্যাটাগরি নেই। উপরের <strong>"Seed Existing Categories"</strong> বাটনে ক্লিক করুন —
            এতে আপনার বিদ্যমান ৭টা আইটেম (materials.ts থেকে) এখানে কপি হয়ে যাবে, এরপর থেকে এখান থেকেই এডিট করতে পারবেন।
          </div>
        )}

        <div className="bg-white border border-brand-navy/10 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-offwhite text-brand-navy/70 font-sans text-xs uppercase tracking-wider">
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold">Order</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/5 font-sans text-sm">
                {loading && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-brand-navy/50">
                      Loading…
                    </td>
                  </tr>
                )}
                {!loading &&
                  categories.map((c) => (
                    <tr key={c.slug} className="hover:bg-brand-navy/5 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {c.image ? (
                            <img
                              src={c.image}
                              alt={c.name}
                              className="w-12 h-12 object-cover rounded border border-brand-navy/10"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-brand-offwhite rounded border border-brand-navy/10" />
                          )}
                          <div>
                            <span className="font-medium text-brand-navy block">{c.name}</span>
                            <span className="text-brand-navy/50 font-mono text-xs">{c.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-brand-navy/70 max-w-md">
                        <span className="line-clamp-2">{c.desc || '—'}</span>
                      </td>
                      <td className="p-4 text-brand-navy/70 font-mono text-xs">{displayNumber(c.order)}</td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleActive(c)}
                          className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                            c.active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {c.active !== false ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/materials/${encodeURIComponent(c.slug)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-brand-navy/50 hover:text-brand-navy transition-colors"
                            title="View on site"
                          >
                            <ExternalLink size={16} />
                          </a>
                          <Link
                            to={`/admin/categories/${encodeURIComponent(c.slug)}/edit`}
                            className="p-2 text-brand-navy/50 hover:text-brand-gold transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </Link>
                          <button
                            onClick={() => handleDelete(c)}
                            className="p-2 text-brand-navy/50 hover:text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
