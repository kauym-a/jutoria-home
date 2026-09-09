import { create } from 'zustand';
import { signOut, type User } from 'firebase/auth';
import { auth } from '../services/firebase/config';

// স্টোরে কী কী তথ্য থাকবে তার একটি নিয়ম (Type definition)
interface AuthState {
  user: User | null;         // ইউজারের তথ্য (নাম, ইমেইল ইত্যাদি)
  isAdmin: boolean;          // ইউজার কি এডমিন নাকি সাধারণ মানুষ?
  isLoading: boolean;        // লগইন চেক করার সময় লোডিং দেখাবে কিনা?
  setUser: (user: User | null) => void;  // ইউজার সেট করার ফাংশন
  setLoading: (loading: boolean) => void; // লোডিং সেট করার ফাংশন
  logout: () => Promise<void>;            // লগআউট করার ফাংশন
}

// আমাদের মূল Auth Store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAdmin: false,
  isLoading: true, // শুরুতে ধরে নিচ্ছি লোডিং হচ্ছে, যতক্ষণ না ফায়ারবেস চেক করে
  
  setUser: (user) => set({ 
    user, 
    // যদি ইউজার থাকে, তবে সে এডমিন কিনা তা সেট হবে (পরবর্তীতে এখানে আমরা নির্দিষ্ট এডমিন ইমেইল চেক করার লজিক দেব)
    isAdmin: user !== null, 
    isLoading: false 
  }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  // লগআউট করার সিস্টেম
  logout: async () => {
    try {
      await signOut(auth); // ফায়ারবেস থেকে লগআউট
      set({ user: null, isAdmin: false, isLoading: false }); // স্টোর থেকে তথ্য মুছে ফেলা
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
}));