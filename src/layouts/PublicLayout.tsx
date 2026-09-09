import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, X, ChevronDown, Mail, Phone } from 'lucide-react';
import JutoriaAssistantWidget from '../components/chat/JutoriaAssistant';

function SocialBrandIcon({ platform }: { platform: string }) {
  const common = { viewBox: '0 0 24 24', 'aria-hidden': true, className: 'h-4 w-4', fill: 'currentColor' } as const;

  switch (platform) {
    case 'facebook':
      return (
        <svg {...common}>
          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.128 22 16.991 22 12Z" />
        </svg>
      );
    case 'instagram':
      return (
        <svg {...common}>
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069ZM12 0C8.741 0 8.332.014 7.052.072 2.695.272.273 2.69.073 7.052.014 8.332 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.332 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z" />
        </svg>
      );
    case 'threads':
      return (
        <svg {...common}>
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.014v-.03c.028-3.571.877-6.425 2.523-8.481C5.845 1.205 8.598.024 12.18 0h.014c2.746.019 5.043.7 6.826 2.025 1.677 1.245 2.858 3.028 3.508 5.303l-2.29.654c-1.052-3.671-3.674-5.55-7.797-5.578-2.914.02-5.118.94-6.554 2.734-1.346 1.68-2.038 4.075-2.06 7.121.022 3.049.714 5.446 2.06 7.127 1.436 1.793 3.64 2.712 6.554 2.732 2.623-.02 4.358-.641 5.799-2.076 1.646-1.638 1.613-3.646 1.088-4.855-.31-.716-.87-1.311-1.635-1.75-.192 1.363-.622 2.462-1.284 3.278-.886 1.093-2.14 1.686-3.727 1.75-1.202.05-2.361-.238-3.264-.813-1.068-.68-1.694-1.71-1.762-2.9-.132-2.328 1.734-4.001 4.646-4.169.977-.056 1.892.001 2.732.176-.116-.696-.359-1.244-.735-1.643-.501-.53-1.283-.803-2.313-.813h-.037c-.828 0-1.938.229-2.647 1.322l-1.94-1.32c.949-1.444 2.472-2.238 4.588-2.238h.06c3.297.021 5.267 2.036 5.463 5.51.113.048.222.098.328.15 1.517.744 2.626 1.87 3.207 3.257.808 1.925.882 5.064-1.634 7.545-1.86 1.845-4.107 2.68-7.285 2.702Z" />
        </svg>
      );
    case 'tiktok':
      return (
        <svg {...common}>
          <path d="M19.321 5.562a5.122 5.122 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.971-1.166-1.956-1.282-2.645h.004C16.353 1.078 16.353.5 16.353.5h-3.65v14.234c0 .759-.216 1.303-.541 1.664a1.885 1.885 0 0 1-1.489.646c-1.116 0-2.023-.907-2.023-2.024 0-1.116.907-2.023 2.023-2.023.203 0 .398.03.582.086v-3.71a5.75 5.75 0 0 0-.582-.03c-3.19 0-5.775 2.586-5.775 5.776s2.586 5.776 5.775 5.776c3.19 0 5.776-2.586 5.776-5.776V8.283a9.63 9.63 0 0 0 5.629 1.803V6.437a5.786 5.786 0 0 1-2.457-.875Z" />
        </svg>
      );
    case 'youtube':
      return (
        <svg {...common}>
          <path d="M23.498 6.186a2.994 2.994 0 0 0-2.107-2.117C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.391.524A2.994 2.994 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.994 2.994 0 0 0 2.107 2.117c1.886.524 9.391.524 9.391.524s7.505 0 9.391-.524a2.994 2.994 0 0 0 2.107-2.117C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
        </svg>
      );
    case 'pinterest':
      return (
        <svg {...common}>
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.784c0-1.669.967-2.916 2.171-2.916 1.023 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.362-.629-2.752-1.379l-.749 2.845c-.271 1.045-1.004 2.352-1.494 3.146 1.125.345 2.319.535 3.559.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.365 18.592 0 11.985 0h.032Z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg {...common}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.064 2.064 0 1 1 0-4.128 2.064 2.064 0 0 1 0 4.128ZM7.119 20.452H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
        </svg>
      );
    case 'x':
      return (
        <svg {...common}>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231ZM17.083 19.77h1.833L7.084 4.126H5.117Z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg {...common}>
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.14c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.97 0-1.42.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.61-.07.16-.19.7-.81.88-1.09.19-.28.38-.23.63-.14.26.09 1.66.78 1.94.92.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function PublicLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // ফুটারের "Get In Touch" মোবাইলে অ্যাকর্ডিয়ন — ডেস্কটপে (sm+) সবসময় খোলা,
  // এই state শুধু মোবাইলে কাজে লাগে (নিচে sm:block দিয়ে ওভাররাইড করা হয়েছে)
  const [contactOpen, setContactOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => setIsMobileMenuOpen(false);

  // Desktop & Mobile Navigation — approved menu structure (10 sections).
  // Each top-level item is either a direct link (path only) or a group with children (dropdown).
  const navLinks: { name: string; path?: string; children?: { name: string; path: string }[] }[] = [
    { name: 'Home', path: '/' },
    {
      name: 'Company',
      children: [
        { name: 'Company Profile', path: '/company-profile' },
        { name: 'Our Story', path: '/our-story' },
        { name: 'People / Artisans', path: '/people' },
        { name: 'Global Clients', path: '/clients-markets' },
        { name: 'Corporate Information', path: '/corporate-information' },
      ],
    },
    {
      name: 'Collection',
      children: [
        { name: 'All Products', path: '/products' },
        { name: 'Categories', path: '/categories' },
        { name: 'Materials', path: '/materials' },
        // Gallery: Product Gallery / Lifestyle / Craftsmanship / Materials Gallery ইচ্ছাকৃতভাবে
        // মূল মেনু থেকে সরানো হয়েছে — এখনো এগুলোর আসল কনটেন্ট (ছবি) নেই, এবং B2B/wholesale
        // ভিজিটরদের জন্য এই ইনস্পিরেশনাল-স্টাইল গ্যালারিগুলোর অগ্রাধিকার কম। আসল ছবি রেডি হলে
        // homepage-এ বা একটা সিঙ্গেল "Gallery" লিংক হিসেবে আবার যোগ করা যাবে।
      ],
    },
    {
      name: 'Wholesale',
      children: [
        { name: 'Wholesale Overview', path: '/wholesale' },
        { name: 'Wholesale Inquiry', path: '/contact' },
      ],
    },
    { name: 'Shop on Amazon', path: '/amazon-usa' },

    { name: 'Contact', path: '/contact' },
  ];

  // Footer nav split into two short columns (Company / Shop) so the list no
  // longer needs a max-h scrollbar. Kept in sync manually with navLinks above.
  const footerCompanyLinks = [
    { name: 'Company Profile', path: '/company-profile' },
    { name: 'Our Story', path: '/our-story' },
    { name: 'People / Artisans', path: '/people' },
    { name: 'Global Clients', path: '/clients-markets' },
    { name: 'Corporate Information', path: '/corporate-information' },
  ];
  const footerShopLinks = [
    { name: 'All Products', path: '/products' },
    { name: 'Categories', path: '/categories' },
    { name: 'Materials', path: '/materials' },
    { name: 'Wholesale Overview', path: '/wholesale' },
  ];

  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);

  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/jutoriahome', platform: 'facebook', label: 'JUTORIA on Facebook' },
    { name: 'Instagram', href: 'https://instagram.com/jutoria.home', platform: 'instagram', label: 'JUTORIA on Instagram' },
    { name: 'Threads', href: 'https://threads.net/@jutoriahome', platform: 'threads', label: 'JUTORIA on Threads' },
    { name: 'TikTok', href: 'https://tiktok.com/@jutoriahome', platform: 'tiktok', label: 'JUTORIA on TikTok' },
    { name: 'YouTube', href: 'https://youtube.com/@jutoriahome', platform: 'youtube', label: 'JUTORIA on YouTube' },
    { name: 'Pinterest', href: 'https://www.pinterest.com/jutoriahome', platform: 'pinterest', label: 'JUTORIA on Pinterest' },
    { name: 'LinkedIn', href: 'https://linkedin.com/company/jutoriahome', platform: 'linkedin', label: 'JUTORIA on LinkedIn' },
    { name: 'X', href: 'https://x.com/jutoriahomecom', platform: 'x', label: 'JUTORIA on X' },
  ];

  // Get In Touch — যাচাই করা ইমেইল ও ফোন/WhatsApp (single source of truth এখানেই)
  const contactEmails = [
    { label: 'Wholesale & B2B', address: 'wholesale@jutoriahome.com' },
    { label: 'Support', address: 'support@jutoriahome.com' },
    { label: 'Sales', address: 'sales@jutoriahome.com' },
  ];
  const contactPhones = [
    {
      region: 'United Kingdom',
      numbers: [
        { display: '+44 7311 127176', tel: '+447311127176', wa: '447311127176' },
        { display: '+44 7435 945500', tel: '+447435945500', wa: '447435945500' },
      ],
    },
    {
      region: 'Bangladesh',
      numbers: [
        { display: '+880 1833-093349', tel: '+8801833093349', wa: '8801833093349' },
        { display: '+880 13 2443 8566', tel: '+8801324438566', wa: '8801324438566' },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-ivory text-brand-navy">
      
      {/* =========================================
          PREMIUM PUBLIC HEADER
          ========================================= */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-brand-navy/10">
        <div className="container mx-auto px-4 lg:px-8 h-20 flex items-center justify-between max-w-7xl">
          
          {/* Brand Logo - Original Asset & Colors */}
          <Link
            to="/"
            onClick={() => { closeMenu(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex-shrink-0 flex items-center gap-2"
          >
            <img 
              src="/logo.png" 
              alt="JUTORIA" 
              className="h-10 md:h-12 w-auto object-contain" 
            />
            <span className="inline-flex items-center gap-1 font-sans text-[10px] font-bold tracking-[0.05em] uppercase text-brand-navy/60 border border-brand-navy/15 rounded-full pl-1 pr-2 py-1 whitespace-nowrap">
              <img src="https://flagcdn.com/w40/gb.png" alt="UK flag" className="w-3.5 h-2.5 object-cover rounded-[1px]" />
              UK
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 font-sans text-[13px] font-semibold tracking-[0.1em] uppercase">
            {navLinks.map((link) => {
              if (!link.children) {
                return (
                  <Link
                    key={link.name}
                    to={link.path!}
                    className={`transition-colors duration-300 ${
                      location.pathname === link.path
                        ? 'text-brand-gold'
                        : 'text-brand-navy hover:text-brand-gold'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              }

              const isGroupActive = link.children.some((c) => c.path === location.pathname);
              const isOpen = openDesktopMenu === link.name;

              return (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={() => setOpenDesktopMenu(link.name)}
                  onMouseLeave={() => setOpenDesktopMenu(null)}
                >
                  <button
                    className={`flex items-center gap-1 transition-colors duration-300 ${
                      isGroupActive || isOpen ? 'text-brand-gold' : 'text-brand-navy hover:text-brand-gold'
                    }`}
                  >
                    {link.name}
                    <ChevronDown size={13} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div
                    className={`absolute left-0 top-full pt-3 transition-all duration-200 ${
                      isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'
                    }`}
                  >
                    <div className="min-w-[220px] max-h-[70vh] overflow-y-auto bg-white border border-brand-navy/10 shadow-premium-hover rounded-[2px] py-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block px-5 py-2.5 text-[12.5px] normal-case font-medium tracking-normal transition-colors duration-200 ${
                            location.pathname === child.path
                              ? 'text-brand-gold bg-brand-offwhite'
                              : 'text-brand-navy/85 hover:text-brand-gold hover:bg-brand-offwhite'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Desktop CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            
            {/* Premium CTA Button */}
            <Link 
              to="/wholesale" 
              className="hidden md:inline-flex items-center justify-center px-6 py-2.5 bg-brand-navy text-brand-gold font-sans text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-colors duration-300 rounded-[2px]"
            >
              Wholesale Inquiry
            </Link>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden flex items-center text-brand-navy hover:text-brand-gold transition-colors p-2 -mr-2"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon size={26} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================
          MOBILE NAVIGATION DRAWER
          ========================================= */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeMenu}
      ></div>
      
      {/* Drawer Panel */}
      <div 
        className={`fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-50 transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-brand-navy/10">
          <img src="/logo.png" alt="JUTORIA" className="h-9 w-auto object-contain" />
          <button onClick={closeMenu} className="text-brand-navy hover:text-brand-gold transition-colors p-2 -mr-2">
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>
        
        {/* Drawer Links */}
        <nav className="flex flex-col gap-1 px-6 py-8 font-sans text-sm font-bold uppercase tracking-widest overflow-y-auto">
          {navLinks.map((link) => {
            if (!link.children) {
              return (
                <Link
                  key={link.name}
                  to={link.path!}
                  onClick={closeMenu}
                  className={`py-3 transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-brand-gold'
                      : 'text-brand-navy hover:text-brand-gold'
                  }`}
                >
                  {link.name}
                </Link>
              );
            }

            const isOpen = openMobileGroup === link.name;

            return (
              <div key={link.name} className="border-b border-brand-navy/5">
                <button
                  onClick={() => setOpenMobileGroup(isOpen ? null : link.name)}
                  className="w-full flex items-center justify-between py-3 text-brand-navy"
                >
                  {link.name}
                  <ChevronDown size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-gold' : ''}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-3' : 'max-h-0'}`}>
                  {link.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      onClick={closeMenu}
                      className={`block py-2 pl-4 text-[12px] normal-case font-medium tracking-normal ${
                        location.pathname === child.path ? 'text-brand-gold' : 'text-brand-navy/75 hover:text-brand-gold'
                      }`}
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Mobile CTA */}
          <div className="pt-6 mt-4 border-t border-brand-navy/10">
            <Link 
              to="/wholesale" 
              onClick={closeMenu}
              className="flex items-center justify-center w-full px-6 py-4 bg-brand-navy text-brand-gold font-sans text-xs font-bold uppercase tracking-widest hover:bg-brand-gold hover:text-brand-navy transition-colors duration-300 rounded-[2px]"
            >
              Wholesale Inquiry
            </Link>
          </div>
        </nav>
        
        {/* Drawer Footer with Safe Area */}
        <div className="mt-auto p-6 bg-brand-ivory border-t border-brand-navy/10 text-center pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <p className="font-sans text-xs opacity-60 font-semibold tracking-wider uppercase">
            &copy; {new Date().getFullYear()} JUTORIA.
          </p>
        </div>
      </div>

      {/* =========================================
          MAIN CONTENT AREA
          ========================================= */}
      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      {/* =========================================
          FOOTER (Preserved exactly as original)
          ========================================= */}
      <footer className="bg-white border-t border-brand-navy/10 text-brand-navy py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <div className="flex flex-col items-center text-center mb-12">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src="/logo.png" alt="JUTORIA" className="h-14 md:h-20 w-auto mb-6 object-contain" />
            </Link>
            
            <p className="font-sans text-sm opacity-80 max-w-md mx-auto font-medium">
              Premium Eco-Friendly Handmade Home Décor. Crafted by artisans, designed for conscious living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-8 md:gap-10 text-left">
            <div className="xl:col-span-2">
              <img
                src="/sircommerce_logo.png"
                alt="Sir Commerce Group Ltd logo"
                className="h-20 w-auto object-contain mb-5 mix-blend-multiply"
                loading="lazy"
              />
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                Sir Commerce Group Ltd
              </p>
              <p className="font-sans text-sm text-brand-navy/80 leading-relaxed">
                Registered in England and Wales<br />
                Company No. 17029469
              </p>
            </div>

            <div>
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                UK Registered Office
              </p>
              <p className="font-sans text-sm text-brand-navy/80 leading-relaxed">
                OFFICE 16785<br />
                182–184 High Street North<br />
                East Ham<br />
                London E6 2JA<br />
                United Kingdom
              </p>
            </div>

            <div>
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                UK Warehouse
              </p>
              <p className="font-sans text-sm text-brand-navy/80 leading-relaxed">
                69 Wingfield Road<br />
                Great Barr<br />
                Birmingham B42 2QB<br />
                United Kingdom
              </p>
            </div>

            <div>
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                Bangladesh Corporate Office
              </p>
              <p className="font-sans text-sm text-brand-navy/80 leading-relaxed">
                Sir Commerce Group Ltd<br />
                Kachari Bazar<br />
                Gaibandha-5700<br />
                Bangladesh
              </p>
            </div>

            <div>
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                Manufacturing Partner
              </p>
              <p className="font-sans text-sm text-brand-navy/80 leading-relaxed">
                Eco Ville BD — Bangladesh
              </p>
            </div>
          </div>

          {/* Get In Touch — all verified business emails & phone/WhatsApp contact points.
              মোবাইলে অ্যাকর্ডিয়ন (contactOpen), sm+ এ কার্ডগুলো সবসময় দৃশ্যমান। */}
          <div className="mt-12 pt-8 border-t border-brand-navy/10">
            <button
              type="button"
              onClick={() => setContactOpen((v) => !v)}
              aria-expanded={contactOpen}
              className="w-full flex items-center justify-center gap-2 font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-6 sm:mb-8 sm:pointer-events-none"
            >
              Get In Touch
              <ChevronDown
                size={14}
                className={`sm:hidden transition-transform duration-300 ${contactOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <div className={contactOpen ? 'block' : 'hidden sm:block'}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
                {contactEmails.map(({ label, address }) => (
                  <div key={address} className="bg-white border border-brand-navy/10 rounded-[2px] p-5 shadow-premium">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[2px] border border-brand-navy/10 bg-brand-ivory text-brand-navy/70">
                        <Mail size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-sans text-[10px] text-brand-navy/40 uppercase tracking-wider mb-1">{label}</p>
                        <a href={`mailto:${address}`} className="font-sans text-sm text-brand-navy/80 hover:text-brand-gold transition-colors break-all">
                          {address}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-3xl mx-auto">
                {contactPhones.map(({ region, numbers }) => (
                  <div key={region} className="bg-white border border-brand-navy/10 rounded-[2px] p-5 shadow-premium">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[2px] border border-brand-navy/10 bg-brand-ivory text-brand-navy/70">
                        <Phone size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-sans text-[10px] text-brand-navy/40 uppercase tracking-wider mb-2">{region}</p>
                        <div className="space-y-2">
                          {numbers.map(({ display, tel, wa }) => (
                            <div key={tel} className="flex flex-wrap items-center gap-x-3 gap-y-1">
                              <a href={`tel:${tel}`} className="font-sans text-sm text-brand-navy/80 hover:text-brand-gold transition-colors">{display}</a>
                              <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-sans text-xs text-brand-navy/60 hover:text-brand-gold transition-colors">
                                <SocialBrandIcon platform="whatsapp" /> WhatsApp
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-brand-navy/10 grid gap-8 md:grid-cols-2 xl:grid-cols-5">
            <div>
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                Company
              </p>
              <ul className="font-sans text-sm text-brand-navy/80 space-y-2">
                {footerCompanyLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} onClick={() => window.scrollTo(0, 0)} className="transition-colors hover:text-brand-gold">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                Shop
              </p>
              <ul className="font-sans text-sm text-brand-navy/80 space-y-2">
                {footerShopLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} onClick={() => window.scrollTo(0, 0)} className="transition-colors hover:text-brand-gold">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                Follow Jutoria
              </p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ name, href, platform, label }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-navy/10 bg-brand-ivory text-brand-navy/80 transition-colors hover:border-brand-gold hover:text-brand-gold"
                    title={name}
                  >
                    <SocialBrandIcon platform={platform} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                Legal Links
              </p>
              <ul className="font-sans text-sm text-brand-navy/80 space-y-2">
                <li><Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="transition-colors hover:text-brand-gold">Privacy Policy</Link></li>
                <li><Link to="/terms-conditions" onClick={() => window.scrollTo(0, 0)} className="transition-colors hover:text-brand-gold">Terms &amp; Conditions</Link></li>
                <li><Link to="/refund-policy" onClick={() => window.scrollTo(0, 0)} className="transition-colors hover:text-brand-gold">Refund Policy</Link></li>
                <li><Link to="/shipping-policy" onClick={() => window.scrollTo(0, 0)} className="transition-colors hover:text-brand-gold">Shipping Policy</Link></li>
                <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="transition-colors hover:text-brand-gold">Contact</Link></li>
              </ul>
            </div>

            <div className="md:text-right xl:text-right">
              <p className="font-sans text-[11px] font-bold tracking-[0.2em] uppercase text-brand-navy/70 mb-4">
                Copyright
              </p>
              <p className="font-sans text-sm text-brand-navy/80">
                &copy; 2026 JUTORIA. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* JUTORIA AI Assistant — floating widget, visible on every public page */}
      <JutoriaAssistantWidget />

    </div>
  );
}