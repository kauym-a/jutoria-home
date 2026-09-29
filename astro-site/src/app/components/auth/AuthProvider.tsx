import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { setUser, setLoading, isLoading } = useAuthStore();
  const location = useLocation();

  // পাবলিক পেজে (Home, Wholesale, ইত্যাদি) কোনো UI-ই auth স্টেটের ওপর নির্ভর করে না —
  // শুধু /admin/* রুটেই (ProtectedRoute, AdminLayout) দরকার। getAuth()/onAuthStateChanged
  // চালু করলেই Firebase Auth-এর hidden iframe + relyingparty/getProjectConfig নেটওয়ার্ক
  // চেইন ট্রিগার হয়ে যায় (Google PageSpeed Insights-এ jutoriahome.com হোমপেজে এটাই ৩+
  // সেকেন্ড ক্রিটিক্যাল-পাথ লেটেন্সি হিসেবে ফ্ল্যাগ হয়েছিল) — তাই পাবলিক রুটে এটা
  // সম্পূর্ণ স্কিপ করা হচ্ছে, শুধু /admin/* রুটে ঢুকলেই lazily চালু হয়।
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (!isAdminRoute) {
      // পাবলিক রুটে থাকা অবস্থায় auth-এর জন্য অপেক্ষা করার কিছু নেই — সাথে সাথে
      // লোডিং গেট বন্ধ করে দেওয়া হচ্ছে (আসলে নিচের render লজিকে isAdminRoute না
      // থাকলে গেটই দেখানো হয় না, কিন্তু state-টা সঠিক রাখার জন্য এটাও সেট করা হলো)।
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    (async () => {
      // firebase/auth এবং getFirebaseAuth() দুটোই ডাইনামিকালি ইমপোর্ট হচ্ছে — এই কোড
      // (এবং এর ভেতরের Auth SDK) শুধু /admin/* রুটে গেলেই ডাউনলোড হবে, পাবলিক পেজের
      // ইনিশিয়াল বান্ডলে কখনোই থাকবে না।
      const [{ onAuthStateChanged }, { getFirebaseAuth }] = await Promise.all([
        import('firebase/auth'),
        import('../../services/firebase/config'),
      ]);
      if (cancelled) return;
      const auth = await getFirebaseAuth();
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user); // ইউজার পেলে স্টোরে সেভ করবে, না পেলে null করে দেবে
      });
    })();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [isAdminRoute, setUser, setLoading]);

  // scripts/prerender.mjs পাবলিক প্রোডাক্ট পেজ prerender করার আগে window.__PRERENDER__ = true
  // সেট করে দেয় — শুধু তখনই এই লোডিং গেট স্কিপ করা হয়, যাতে Firebase Auth resolve হওয়ার
  // অপেক্ষা না করে সাথে সাথে আসল কনটেন্ট (আর Helmet-এর og:title/og:image) রেন্ডার হয়ে যায়।
  const isPrerendering =
    typeof window !== 'undefined' && (window as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true;

  // ফায়ারবেস যতক্ষণ চেক করবে, ততক্ষণ একটি সুন্দর প্রিমিয়াম লোডিং স্ক্রিন দেখাবে — শুধু
  // /admin/* রুটে (পাবলিক রুটে এই গেটই নেই, isAdminRoute false মানে সবসময় children রেন্ডার হয়)
  if (isAdminRoute && isLoading && !isPrerendering) {
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

  // চেকিং শেষ হলে ওয়েবসাইটের আসল কন্টেন্ট দেখাবে
  return <>{children}</>;
}
