import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';

import AuthProvider from './components/auth/AuthProvider';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminProducts from './pages/admin/Products';
import AdminProductForm from './pages/admin/ProductForm';
import AdminCategories from './pages/admin/Categories';
import AdminCategoryForm from './pages/admin/CategoryForm';
import AdminLeads from './pages/admin/Leads';

// Admin Panel — মূল src/App.tsx-এর /admin/* রুটগুলো হুবহু, এখন একটা আলাদা React অ্যাপ হিসেবে
// (src/pages/admin/index.astro-তে client:only দিয়ে মাউন্ট হয়)। পাবলিক সাইটে React-ই নেই, তাই
// এই কোড শুধু /admin/*-এ গেলেই লোড হয়। .htaccess সব /admin/* রিকোয়েস্ট /admin/index.html-এ
// পাঠায়, এরপর React Router ক্লায়েন্ট-সাইডে সঠিক পেজ দেখায়। এর ভেতরের সব ফাইল (src/app/...)
// মূল সাইট থেকে একই ফোল্ডার-কাঠামোয় অপরিবর্তিত কপি করা, তাই রিলেটিভ ইমপোর্টগুলো বদলাতে হয়নি।
export default function AdminApp() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/admin/login" element={<Login />} />
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
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
