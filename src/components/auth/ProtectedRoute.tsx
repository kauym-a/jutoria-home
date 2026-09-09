import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuthStore();

  // যদি লগইন চেক করার কাজ চলতে থাকে, তবে কিছুই দেখাবে না
  if (isLoading) {
    return null; 
  }

  // যদি ইউজার লগইন করা না থাকে (user = null), তবে তাকে ধাক্কা দিয়ে Login পেজে পাঠিয়ে দেবে
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // আর যদি ইউজার লগইন করা থাকে, তবে তাকে ড্যাশবোর্ডের ভেতরের পেজগুলো (<Outlet />) দেখতে দেবে
  return <Outlet />;
}