import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// .env.local ফাইলে রাখা গোপন চাবিগুলো এখানে কল করা হয়েছে
const firebaseConfig = {
  apiKey: "AIzaSyBj1FbTsncBzCs4ehorjNb8rdIkn71henI",
  authDomain: "jutoria.firebaseapp.com",
  projectId: "jutoria",
  storageBucket: "jutoria.firebasestorage.app",
  messagingSenderId: "1023187148927",
  appId: "1:1023187148927:web:407c73e2ca57ab3b4ddf4a"
};

// Initialize Firebase (ডাটাবেস কানেকশন চালু করা হলো)
const app = initializeApp(firebaseConfig);

// Initialize Firestore Database (প্রোডাক্ট ও লিড সেভ করার জন্য)
export const db = getFirestore(app);

// Firebase Authentication ইচ্ছাকৃতভাবে এখানে eagerly initialize করা হয় না। getAuth(app)
// কল করলেই Auth SDK নিজে থেকে একটা hidden iframe (iframe.js) + googleapis-এর
// "relyingparty/getProjectConfig" নেটওয়ার্ক কল চালু করে দেয় (cross-tab/cross-domain
// persistence sync-এর জন্য) — Google PageSpeed Insights-এ jutoriahome.com-এর হোমপেজে
// এটাই ৩+ সেকেন্ড ক্রিটিক্যাল-পাথ লেটেন্সি হিসেবে ফ্ল্যাগ হয়েছিল, অথচ পাবলিক পেজে
// (Home, Wholesale, ইত্যাদি) কোনো UI-ই auth স্টেটের ওপর নির্ভর করে না — শুধু
// /admin/* রুটেই দরকার (দেখুন AuthProvider.tsx)। তাই getAuth() এখন lazy — শুধু
// /admin/* রুটে ঢোকার পরেই প্রথমবার কল হয়, ফলাফল ক্যাশ করা থাকে (একাধিকবার কল হলেও
// getAuth(app) একই ইনস্ট্যান্স রিটার্ন করে, কিন্তু Promise ক্যাশ করাতে dynamic
// import('firebase/auth')-ও একবারই হয়)।
let authPromise: Promise<import('firebase/auth').Auth> | null = null;
export function getFirebaseAuth() {
  if (!authPromise) {
    authPromise = import('firebase/auth').then(({ getAuth }) => getAuth(app));
  }
  return authPromise;
}

// Initialize Firebase Storage (প্রোডাক্ট ইমেজ আপলোড করার জন্য — Admin Panel থেকে
// সরাসরি আপলোড, যাতে Hostinger-এ ম্যানুয়ালি ফাইল রেখে সেই একই নাম হুবহু টাইপ করে
// আবার Admin Panel-এ বসাতে না হয়। এতে টাইপো-জনিত ভুল (যেমন 501 বনাম 502) বন্ধ হয়ে যায়।
export const storage = getStorage(app);

export default app;