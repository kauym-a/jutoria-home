import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ListTree, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  // এডমিন মেনুর লিস্ট
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    { name: 'Categories', path: '/admin/categories', icon: ListTree },
    { name: 'B2B Leads', path: '/admin/leads', icon: Users },
    { name: 'RFQs (Quotes)', path: '/admin/rfqs', icon: MessageSquare },
    { name: 'CMS & Pages', path: '/admin/cms', icon: FileText },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  // লগআউট করার ফাংশন
  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex h-screen bg-brand-offwhite overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay (কালো শ্যাডো) */}
      <div 
        className={`fixed inset-0 bg-brand-navy/60 z-40 lg:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar (বাম দিকের মেনু) */}
      <aside 
        className={`fixed inset-y-0 left-0 w-64 bg-brand-navy text-brand-offwhite z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Admin Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-brand-offwhite/10">
          <div>
            <span className="font-serif font-bold text-xl tracking-widest text-brand-gold block">JUTORIA</span>
            <span className="text-xs uppercase tracking-wider opacity-70">Admin Panel</span>
          </div>
          <button onClick={closeSidebar} className="lg:hidden text-brand-offwhite/70 hover:text-brand-gold">
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.includes(item.path);
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  isActive 
                    ? 'bg-brand-gold text-brand-navy font-semibold' 
                    : 'text-brand-offwhite/80 hover:bg-brand-offwhite/10 hover:text-brand-gold'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-brand-navy' : ''} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-brand-offwhite/10">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-navy font-bold font-serif">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate">{user?.email || 'Admin'}</p>
              <p className="text-xs text-brand-gold">Administrator</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content (ডান দিকের অংশ) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-brand-navy/10 flex items-center px-4 lg:px-8 justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-brand-navy hover:text-brand-gold transition-colors"
            >
              <Menu size={28} />
            </button>
            <h2 className="font-serif text-xl font-bold text-brand-navy hidden sm:block">
              Welcome back, Admin
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              className="text-sm font-semibold text-brand-navy hover:text-brand-gold border border-brand-navy/20 px-4 py-2 transition-colors hidden sm:block"
            >
              View Website
            </a>
          </div>
        </header>

        {/* Dynamic Content Area (যেখানে ড্যাশবোর্ড, প্রোডাক্ট লিস্ট ইত্যাদি দেখাবে) */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>

    </div>
  );
}