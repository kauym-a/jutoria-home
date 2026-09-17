import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Providers (অথেন্টিকেশন বা লগইন চেকিং সিস্টেম)
import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Layouts
import PublicLayout from './layouts/PublicLayout';
// AdminLayout code-split নিচে (Admin Pages সেকশনে) — পাবলিক ভিজিটর কখনো এই কোড লোড করবে না

// Public Pages
import Home from './pages/public/Home';
import Products from './pages/public/Products';
import Wholesale from './pages/public/Wholesale';
import OurStory from './pages/public/OurStory';
import Sustainability from './pages/public/Sustainability';
import Contact from './pages/public/Contact';
import ProductDetail from './pages/public/ProductDetail';
import Materials from './pages/public/Materials';
import MaterialDetail from './pages/public/MaterialDetail';
import Categories from './pages/public/Categories';
import CategoryDetail from './pages/public/CategoryDetail';
import AmazonUSA from './pages/public/AmazonUSA';
import ClientsMarkets from './pages/public/ClientsMarkets';
import PlaceholderPage from './pages/public/PlaceholderPage';
import PrivacyPolicy from './pages/public/legal/PrivacyPolicy';
import TermsConditions from './pages/public/legal/TermsConditions';
import ShippingPolicy from './pages/public/legal/ShippingPolicy';
import RefundPolicy from './pages/public/legal/RefundPolicy';
import JutoriaAI from './pages/public/JutoriaAI';
import CompanyProfile from './pages/public/CompanyProfile';
import PeopleArtisans from './pages/public/PeopleArtisans';
import CorporateInformation from './pages/public/CorporateInformation';
import NotFound from './pages/public/NotFound';

// Admin Pages — React.lazy() দিয়ে code-split করা। এই পেজগুলো শুধু /admin/* রুটে গেলেই
// লোড হয় — পাবলিক ভিজিটর (যারা কখনো লগইন পেজেই যায় না) এই JS একদমই ডাউনলোড করে না।
// প্রতিটা lazy import নিচে <Suspense>-এর ভেতরে রেন্ডার হয় (রুট লেভেলে, App() ফাংশনের শেষে)।
const Login = lazy(() => import('./pages/admin/Login'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('./pages/admin/Products'));
const AdminProductForm = lazy(() => import('./pages/admin/ProductForm'));
const AdminCategories = lazy(() => import('./pages/admin/Categories'));
const AdminCategoryForm = lazy(() => import('./pages/admin/CategoryForm'));
const AdminLeads = lazy(() => import('./pages/admin/Leads'));
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));

// Suspense fallback — খুব ছোট, ব্র্যান্ড কালারে, শুধু admin চাঙ্ক লোড হওয়ার সময় দেখা যায়
// (পাবলিক পেজ কখনো এটা ট্রিগার করে না, কারণ ওগুলোর কোনো কম্পোনেন্টই lazy নয়)।
function AdminLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-offwhite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-navy/20 border-t-brand-gold" />
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        {/* AuthProvider এখন BrowserRouter-এর ভেতরে (আগে বাইরে ছিল) — useLocation() দিয়ে
            /admin/* রুট কিনা রিয়েলটাইমে ডিটেক্ট করার জন্য router context দরকার। এটা
            পাবলিক পেজে Firebase Auth সম্পূর্ণ স্কিপ করার জন্য প্রয়োজনীয় (দেখুন
            AuthProvider.tsx-এর কমেন্ট)। */}
        <AuthProvider>
          <ScrollToTop />
          {/* একটাই top-level Suspense — নিচের lazy() admin কম্পোনেন্টগুলোর যেকোনোটা suspend
              করলে এটাই ধরে (React ট্রি-অনুযায়ী কাজ করে, JSX নেস্টিং-এ Route-এর মাঝে
              Suspense বসানো যায় না — react-router এটা সাপোর্ট করে না)। পাবলিক পেজের কোনো
              কম্পোনেন্ট lazy নয়, তাই তারা এটা কখনো ট্রিগার করে না। */}
          <Suspense fallback={<AdminLoadingFallback />}>
          <Routes>
            {/* Public Routes - সাধারণ কাস্টমারদের জন্য */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />

              {/* PRODUCT COLLECTION */}
              <Route path="/products" element={<Products />} />
              <Route path="/product/:sku" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:slug" element={<CategoryDetail />} />

              {/* MATERIALS — real content, shared with Home page grid */}
              <Route path="/materials" element={<Materials />} />
              <Route path="/materials/:slug" element={<MaterialDetail />} />

              {/* COMPANY */}
              <Route path="/our-story" element={<OurStory />} />
              <Route path="/company-profile" element={<CompanyProfile />} />
              <Route path="/people" element={<PeopleArtisans />} />
              <Route path="/corporate-information" element={<CorporateInformation />} />

              {/* OUR GALLERY */}
              <Route path="/gallery/products" element={<PlaceholderPage eyebrow="Our Gallery" title="Product Gallery" description="A full visual catalogue of JUTORIA products, styled and photographed." />} />
              <Route path="/gallery/lifestyle" element={<PlaceholderPage eyebrow="Our Gallery" title="Lifestyle" description="JUTORIA pieces styled in real living spaces." />} />
              <Route path="/gallery/craftsmanship" element={<PlaceholderPage eyebrow="Our Gallery" title="Craftsmanship" description="Behind-the-scenes photos of the hand-weaving and sewing process." />} />
              <Route path="/gallery/materials" element={<PlaceholderPage eyebrow="Our Gallery" title="Materials Gallery" description="Close-up photography of jute, seagrass, bamboo and every natural fiber we work with." />} />

              {/* CLIENTS & MARKETS */}
              <Route path="/clients-markets" element={<ClientsMarkets />} />

              {/* WHOLESALE */}
              <Route path="/wholesale" element={<Wholesale />} />

              {/* SHOP ON AMAZON */}
              <Route path="/amazon-usa" element={<AmazonUSA />} />

              {/* JUTORIA AI */}
              <Route path="/jutoria-ai" element={<JutoriaAI />} />

              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/contact" element={<Contact />} />

              {/* LEGAL */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/refund-policy" element={<RefundPolicy />} />

              {/* 404 — matches any unrecognized path under the public layout, keeps header/footer */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Login - শুধু আপনার লগইন করার জন্য (এতে কোনো মেনু/ফুটার থাকবে না) */}
            <Route path="/admin/login" element={<Login />} />

            {/* Protected Admin Routes - লগইন ছাড়া কেউ এখানে ঢুকতে পারবে না */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/products/new" element={<AdminProductForm />} />
                <Route path="/admin/products/:sku/edit" element={<AdminProductForm />} />

                <Route path="/admin/categories" element={<AdminCategories />} />
                <Route path="/admin/categories/new" element={<AdminCategoryForm />} />
                <Route path="/admin/categories/:slug/edit" element={<AdminCategoryForm />} />

                <Route path="/admin/leads" element={<AdminLeads />} />

                {/* ভবিষ্যতে Admin এর RFQ, CMS পেজগুলো এখানে যুক্ত হবে */}
              </Route>
            </Route>
          </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;