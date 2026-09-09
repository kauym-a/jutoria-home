import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { auth } from '../../services/firebase/config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // আগের কোনো এরর থাকলে মুছে ফেলবে
    setIsLoggingIn(true); // লোডিং শুরু

    try {
      // ফায়ারবেসের মাধ্যমে লগইন করার চেষ্টা
      await signInWithEmailAndPassword(auth, email, password);
      // লগইন সফল হলে ড্যাশবোর্ডে নিয়ে যাবে
      navigate('/admin/dashboard');
    } catch (err: any) {
      // লগইন ফেইল হলে এরর মেসেজ দেখাবে
      console.error("Login failed:", err.message);
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsLoggingIn(false); // লোডিং শেষ
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | JUTORIA</title>
      </Helmet>

      <div className="min-h-screen bg-brand-navy flex flex-col justify-center items-center px-4 relative overflow-hidden">
        {/* ব্যাকগ্রাউন্ডের হালকা ডিজাইন */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-gold via-brand-navy to-brand-navy"></div>

        <div className="w-full max-w-md bg-brand-offwhite p-8 md:p-12 relative z-10 shadow-2xl">
          {/* Logo & Title */}
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl font-bold text-brand-navy tracking-widest mb-2">
              JUTORIA
            </h1>
            <p className="font-sans text-sm font-semibold text-brand-gold uppercase tracking-wider">
              Secure Admin Portal
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-start gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="font-sans text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block font-sans text-sm font-semibold text-brand-navy mb-2">
                Admin Email
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-brand-navy/20 bg-white focus:outline-none focus:border-brand-gold transition-colors font-sans"
                  placeholder="admin@jutoriahome.com"
                  required
                />
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/50" />
              </div>
            </div>

            <div>
              <label className="block font-sans text-sm font-semibold text-brand-navy mb-2">
                Password
              </label>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-brand-navy/20 bg-white focus:outline-none focus:border-brand-gold transition-colors font-sans"
                  placeholder="••••••••"
                  required
                />
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/50" />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="w-full bg-brand-navy text-brand-gold py-4 font-sans font-bold tracking-wider hover:bg-brand-gold hover:text-brand-navy transition-colors duration-300 flex items-center justify-center gap-2 uppercase disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-5 h-5 border-2 border-brand-gold/30 border-t-brand-gold rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Secure Login <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-brand-navy/10 pt-6">
            <p className="font-sans text-xs text-brand-navy/50">
              Unauthorized access is strictly prohibited.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}