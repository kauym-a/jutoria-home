import { Helmet } from 'react-helmet-async';
import { ShoppingBag, Users, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  // আপাতত ডিজাইন দেখার জন্য ডেমো ডাটা (পরে এগুলো ফায়ারবেস থেকে রিয়েল-টাইম আসবে)
  const stats = [
    { title: 'Total Products', value: '24', icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'New Leads', value: '12', icon: Users, color: 'text-green-500', bg: 'bg-green-50' },
    { title: 'Pending RFQs', value: '5', icon: MessageSquare, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Monthly Views', value: '1,204', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  const recentLeads = [
    { id: 1, name: 'Sarah Jenkins', company: 'EcoHome Living UK', type: 'Wholesale', date: 'Today, 10:30 AM', status: 'New' },
    { id: 2, name: 'Michael Chen', company: 'Global Interiors', type: 'Custom Order', date: 'Yesterday', status: 'Contacted' },
    { id: 3, name: 'Emma Watson', company: 'Boutique Decor', type: 'Retail Inquiry', date: 'Aug 12, 2026', status: 'Qualified' },
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
            <h2 className="text-xl font-serif font-bold text-brand-navy">Recent Inquiries & Leads</h2>
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
                  <th className="p-4 font-semibold">Inquiry Type</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-navy/5 font-sans">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-brand-navy/5 transition-colors">
                    <td className="p-4 font-medium text-brand-navy">{lead.name}</td>
                    <td className="p-4 text-brand-navy/80">{lead.company}</td>
                    <td className="p-4 text-brand-navy/80">{lead.type}</td>
                    <td className="p-4 text-brand-navy/60 text-sm">{lead.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider ${
                        lead.status === 'New' ? 'bg-green-100 text-green-700' :
                        lead.status === 'Contacted' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
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