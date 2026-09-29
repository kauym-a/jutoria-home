import { Helmet } from 'react-helmet-async';
import { useEffect, useMemo, useState } from 'react';
import { Trash2, Mail as MailIcon, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchAllLeads,
  updateLeadStatus,
  deleteLead,
  LEAD_STATUSES,
  type Lead,
  type LeadStatus,
} from '../../services/firebase/leads';

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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'wholesale' | 'contact'>('all');

  const load = async () => {
    setLoading(true);
    try {
      setLeads(await fetchAllLeads());
    } catch (err) {
      console.error(err);
      toast.error('লিড লোড করতে সমস্যা হয়েছে — Firestore নিয়ম/লগইন চেক করুন।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const visible = useMemo(
    () => (filter === 'all' ? leads : leads.filter((l) => l.source === filter)),
    [leads, filter],
  );
  const newCount = useMemo(() => leads.filter((l) => l.status === 'new').length, [leads]);

  const handleStatus = async (lead: Lead, status: LeadStatus) => {
    // optimistic
    setLeads((cur) => cur.map((l) => (l.id === lead.id ? { ...l, status } : l)));
    try {
      await updateLeadStatus(lead.id, status);
    } catch (err) {
      console.error(err);
      toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে।');
      load();
    }
  };

  const handleDelete = async (lead: Lead) => {
    if (!window.confirm(`"${lead.name}"-এর ইনকোয়ারি মুছে ফেলতে চান? এই কাজ ফিরিয়ে নেওয়া যাবে না।`)) return;
    try {
      await deleteLead(lead.id);
      setLeads((cur) => cur.filter((l) => l.id !== lead.id));
      toast.success('ইনকোয়ারি মুছে ফেলা হয়েছে।');
    } catch (err) {
      console.error(err);
      toast.error('মুছতে সমস্যা হয়েছে।');
    }
  };

  return (
    <>
      <Helmet>
        <title>Leads | JUTORIA Admin</title>
      </Helmet>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-brand-navy mb-1">Inquiries &amp; Leads</h1>
            <p className="font-sans text-sm text-brand-navy/60">
              {leads.length} total{newCount > 0 && ` · ${newCount} new`} — from the Wholesale &amp; Contact forms.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex rounded-md border border-brand-navy/15 overflow-hidden text-sm font-semibold">
              {(['all', 'wholesale', 'contact'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-2 capitalize transition-colors ${
                    filter === f ? 'bg-brand-navy text-brand-gold' : 'text-brand-navy/60 hover:text-brand-navy'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={load}
              className="flex items-center gap-2 border border-brand-navy/20 text-brand-navy px-4 py-2.5 text-sm font-semibold hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {leads.length === 0 && !loading && (
          <div className="bg-brand-offwhite border border-brand-navy/10 text-brand-navy/70 p-8 rounded-md font-sans text-sm text-center">
            এখনো কোনো ইনকোয়ারি জমা হয়নি। /wholesale বা /contact পেজের ফর্ম সাবমিট হলে এখানে দেখা যাবে।
          </div>
        )}

        {leads.length > 0 && (
          <div className="bg-white border border-brand-navy/10 rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-brand-offwhite text-brand-navy/70 font-sans text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold">Contact</th>
                    <th className="p-4 font-semibold">Source / Type</th>
                    <th className="p-4 font-semibold">Country</th>
                    <th className="p-4 font-semibold">Message</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-navy/5 font-sans text-sm">
                  {loading && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-brand-navy/50">
                        Loading…
                      </td>
                    </tr>
                  )}
                  {!loading &&
                    visible.map((lead) => (
                      <tr key={lead.id} className="hover:bg-brand-navy/5 transition-colors align-top">
                        <td className="p-4">
                          <span className="font-medium text-brand-navy block">{lead.name}</span>
                          {lead.company && <span className="text-brand-navy/60 text-xs block">{lead.company}</span>}
                          <a
                            href={`mailto:${lead.email}`}
                            className="text-brand-navy/60 text-xs inline-flex items-center gap-1 hover:text-brand-gold transition-colors"
                          >
                            <MailIcon size={11} /> {lead.email}
                          </a>
                          {(lead.productInterest || lead.quantity) && (
                            <span className="text-brand-navy/50 text-xs block mt-1">
                              {[lead.productInterest, lead.quantity].filter(Boolean).join(' · ')}
                            </span>
                          )}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${
                              lead.source === 'wholesale'
                                ? 'bg-brand-navy/10 text-brand-navy'
                                : 'bg-brand-gold/20 text-brand-navy'
                            }`}
                          >
                            {lead.source}
                          </span>
                          {lead.type && <span className="text-brand-navy/70 text-xs block mt-1">{lead.type}</span>}
                        </td>
                        <td className="p-4 text-brand-navy/70">{lead.country || '—'}</td>
                        <td className="p-4 text-brand-navy/70 max-w-xs">
                          <span className="line-clamp-3 whitespace-pre-wrap">{lead.message || '—'}</span>
                        </td>
                        <td className="p-4 text-brand-navy/60 text-xs whitespace-nowrap">
                          {formatDate(lead.createdAt)}
                        </td>
                        <td className="p-4">
                          <select
                            value={lead.status}
                            onChange={(e) => handleStatus(lead, e.target.value as LeadStatus)}
                            className={`px-2 py-1 rounded-full text-xs font-bold tracking-wide border-0 focus:outline-none cursor-pointer ${STATUS_STYLES[lead.status]}`}
                          >
                            {LEAD_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end">
                            <button
                              onClick={() => handleDelete(lead)}
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
        )}
      </div>
    </>
  );
}
