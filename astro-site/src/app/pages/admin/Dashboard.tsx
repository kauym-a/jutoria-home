import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { ShoppingBag, Users, MessageSquare, ListTree, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchAllLeads, type Lead, type LeadStatus } from '../../services/firebase/leads';
import { fetchAllProducts } from '../../services/firebase/products';
import { fetchAllCategories } from '../../services/firebase/categories';

const STATUS_STYLES: Record<LeadStatus, string> = {
  new: 'bg-green-100 text-green-700',
  contacted: 'bg-amber-100 text-amber-700',
  qualified: 'bg-blue-100 text-blue-700',
  closed: 'bg-gray-100 text-gray-500',
};

function formatDate(createdAt: Lead['createdAt']): string {
  if (!createdAt || typeof createdAt.seconds !== 'number') return '—';
  return new Date(createdAt.seconds * 1000).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function Dashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [categoryCount, setCategoryCount] = useState<number | null>(null);

  useEffect(() => {
    // প্রতিটা সোর্স আলাদাভাবে — একটা ব্যর্থ হলেও বাকিগুলো দেখাবে
    fetchAllLeads().then(setLeads).catch((e) => console.warn('leads', e));
    fetchAllProducts().then((p) => setProductCount(p.length)).catch((e) => console.warn('products', e));
    fetchAllCategories().then((c) => setCategoryCount(c.length)).catch((e) => console.warn('categories', e));
  }, []);

  const newLeads = leads.filter((l) => l.status === 'new').length;
  const openLeads = leads.filter((l) => l.status === 'new' || l.status === 'contacted').length;
  const recentLeads = leads.slice(0, 5);
  const fmt = (n: number | null) => (n === null ? '—' : String(n));

  const stats = [
    { title: 'Total Products', value: fmt(productCount), icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'New Leads', value: fmt(leads.length ? newLeads : null), icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Open Inquiries', value: fmt(leads.length ? openLeads : null), icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Categories', value: fmt(categoryCount), icon: ListTree, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard | JUTORIA Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-brand-navy mb-2">Dashboard Overview</h1>
          <p className="font-sans text-brand-navy/60">Welcome to JUTORIA admin control panel.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 border border-brand-navy/10 rounded-lg shadow-sm hover:-translate-y-1 transition-transform duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                  <span className="text-2xl font-bold text-brand-navy font-sans">{stat.value}</span>
                </div>
                <h3 className="text-sm font-semibold text-brand-navy/70 uppercase tracking-wider">{stat.title}</h3>
              </div>
            );
          })}
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white border border-brand-navy/10 rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-brand-navy/10 flex items-center justify-between">
            <h2 className="text-xl font-serif font-bold text-brand-navy">Recent Inquiries &amp; Leads</h2>
            <Link to="/admin/leads" className="text-sm font-semibold text-brand-gold hover:text-brand-navy transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-offwhite text-brand-navy/70 font-sans text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">Contact Name</th>
                  <th className="p-4 font-semibold">Company</th>
                  <th className="p-4 font-semibold">Source / Type</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/5 font-sans">
                {recentLeads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-brand-navy/50 text-sm">
                      এখনো কোনো ইনকোয়ারি জমা হয়নি।
                    </td>
                  </tr>
                )}
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-brand-navy/5 transition-colors">
                    <td className="p-4 font-medium text-brand-navy">{lead.name}</td>
                    <td className="p-4 text-brand-navy/80">{lead.company || '—'}</td>
                    <td className="p-4 text-brand-navy/80 capitalize">
                      {lead.source}
                      {lead.type ? ` · ${lead.type}` : ''}
                    </td>
                    <td className="p-4 text-brand-navy/60 text-sm whitespace-nowrap">{formatDate(lead.createdAt)}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider capitalize ${STATUS_STYLES[lead.status]}`}>
                        {lead.status}
                      </span>
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
