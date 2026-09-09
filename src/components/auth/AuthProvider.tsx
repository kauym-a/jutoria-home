import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase/config';
import { useAuthStore } from '../../store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, isLoading } = useAuthStore();

  useEffect(() => {
    // ফায়ারবেস চেক করবে কেউ আগে থেকে লগইন করে আছে কিনা
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // ইউজার পেলে স্টোরে সেভ করবে, না পেলে null করে দেবে
    });

    // ক্লিনআপ ফাংশন (যখন কম্পোনেন্টটি আর দরকার হবে না তখন লিসেনার বন্ধ করে দেবে)
    return () => unsubscribe();
  }, [setUser]);

  // ফায়ারবেস যতক্ষণ চেক করবে, ততক্ষণ একটি সুন্দর প্রিমিয়াম লোডিং স্ক্রিন দেখাবে
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-offwhite">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-navy/20 border-t-brand-gold rounded-full animate-spin"></div>
          <p className="font-serif text-brand-navy font-medium tracking-widest uppercase text-sm">
            Loading JUTORIA...
          </p>
        </div>
      </div>
    );
  }

  // চেকিং শেষ হলে ওয়েবসাইটের আসল কন্টেন্ট দেখাবে
  return <>{children}</>;
}