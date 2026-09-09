import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Providers (অথেন্টিকেশন বা লগইন চেকিং সিস্টেম)
import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

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

// Admin Pages
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductForm from './pages/admin/ProductForm';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
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

                {/* ভবিষ্যতে Admin এর Categories, Leads পেজগুলো এখানে যুক্ত হবে */}
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;