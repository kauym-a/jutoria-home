import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
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

// Initialize Firebase Authentication (এডমিন লগইন করার জন্য)
export const auth = getAuth(app);

// Initialize Firebase Storage (প্রোডাক্ট ইমেজ আপলোড করার জন্য — Admin Panel থেকে
// সরাসরি আপলোড, যাতে Hostinger-এ ম্যানুয়ালি ফাইল রেখে সেই একই নাম হুবহু টাইপ করে
// আবার Admin Panel-এ বসাতে না হয়। এতে টাইপো-জনিত ভুল (যেমন 501 বনাম 502) বন্ধ হয়ে যায়।
export const storage = getStorage(app);

export default app;