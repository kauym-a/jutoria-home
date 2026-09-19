import { initializeApp } from 'firebase/app';

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

// Firestore SDK-ও (Auth/Storage-এর মতোই) আর eagerly ইম্পোর্ট করা হয় না। আগে এখানে
// টপ-লেভেলে `import { getFirestore } from 'firebase/firestore'` + `export const db =
// getFirestore(app)` ছিল — মানে config.ts ইম্পোর্ট করা মাত্রই (products.ts/
// categories.ts/leads.ts-এর মাধ্যমে প্রতিটা পাবলিক পেজেই হয়) পুরো Firestore SDK-টা
// এন্ট্রি চাংকে ঢুকে যেত এবং dist/index.html-এ modulepreload হিসেবে high-priority-তে
// fetch হতো — মোবাইল PageSpeed-এ হোমপেজের হিরো ভিডিও/ছবির সাথে ব্যান্ডউইথ কম্পিট করে
// FCP/LCP খারাপ করছিল। এখন dynamic import — প্রথমবার getFirestoreCtx() কল হলেই SDK +
// db instance লোড হয়, ফলাফল (একবারই ঘটা dynamic import + db instance) ক্যাশ করা থাকে।
let firestoreCtxPromise: ReturnType<typeof loadFirestoreCtx> | null = null;
function loadFirestoreCtx() {
  return import('firebase/firestore').then(
    ({
      getFirestore, collection, doc, getDocs, getDoc, setDoc, deleteDoc,
      query, where, serverTimestamp, addDoc, updateDoc, orderBy,
    }) => ({
      db: getFirestore(app),
      collection, doc, getDocs, getDoc, setDoc, deleteDoc,
      query, where, serverTimestamp, addDoc, updateDoc, orderBy,
    }),
  );
}
export function getFirestoreCtx() {
  if (!firestoreCtxPromise) {
    firestoreCtxPromise = loadFirestoreCtx();
  }
  return firestoreCtxPromise;
}

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

// Firebase Storage-ও (Auth-এর মতোই) ইচ্ছাকৃতভাবে eagerly initialize করা হয় না।
// আগে এখানে সরাসরি `export const storage = getStorage(app)` ছিল — module scope-এই
// কল হতো, যেটার মানে config.ts (public পেজেও দরকার হয় শুধু `db`-এর জন্য) ইম্পোর্ট
// করা মাত্রই Storage SDK-এর পুরো কোড bundle-এ ঢুকে যেত, productsAdmin.ts/
// categoriesAdmin.ts-কে আলাদা ফাইলে সরানোর পরও (দেখুন সেই ফাইলগুলোর কমেন্ট) —
// কারণ ref()/uploadBytes() কারা ইম্পোর্ট করছে সেটা আসল সমস্যা ছিল না, getStorage(app)
// eagerly কল হওয়াটাই ছিল। এখন এটাও lazy — Admin Panel-এর আপলোড ফাংশনগুলোই একমাত্র
// কলার, যেগুলো এমনিতেই lazy-loaded admin চাংকে থাকে।
let storagePromise: Promise<import('firebase/storage').FirebaseStorage> | null = null;
export function getFirebaseStorage() {
  if (!storagePromise) {
    storagePromise = import('firebase/storage').then(({ getStorage }) => getStorage(app));
  }
  return storagePromise;
}

export default app;