// ============================================================
// PageSpeed Insights-এর "Network dependency tree" audit-এ ধরা পড়েছে যে হোমপেজ লোড
// হওয়ার সময় Firestore JS SDK একটা persistent bidirectional "Listen/channel" streaming
// কানেকশন খুলছিল (রিয়েল-টাইম sync সাপোর্টের জন্য SDK-এর বিল্ট-ইন আচরণ — এমনকি
// getDocs() দিয়ে এক-বারের রিডেও, দেখুন config.ts-এর getFirestoreCtx() কমেন্ট), আর
// Lighthouse এই পুরো চেইনটাকে (JS bundle → Firestore SDK চাংক → একাধিক chained
// Listen/channel রিকোয়েস্ট, প্রতিটা কয়েক সেকেন্ড) critical rendering path-এর অংশ
// হিসেবে ধরে নিচ্ছিল — "Maximum critical path latency: 25,665 ms" পর্যন্ত দেখিয়েছে,
// যেটাই FCP/LCP-কে ভয়াবহভাবে পিছিয়ে দিচ্ছিল।
//
// পাবলিক ভিজিটরদের এই streaming/রিয়েল-টাইম sync আদৌ দরকার নেই — একবার পেজ লোড হওয়ার
// সময় সাম্প্রতিক ডেটা পেলেই যথেষ্ট (scripts/prerender.mjs ঠিক এই কারণেই বিল্ড-টাইমে
// রুট লিস্ট আনতে সরাসরি Firestore-এর plain REST API ব্যবহার করে, SDK না)। এই ফাইলটা
// সেই একই প্রমাণিত টেকনিক ক্লায়েন্ট-সাইডে (ব্রাউজারে) প্রয়োগ করে — সাধারণ fetch() GET
// রিকোয়েস্ট, কোনো streaming connection ছাড়াই, তাই Firestore SDK-এর ~120KB চাংকটাও
// পাবলিক ভিজিটরদের জন্য একদমই লোড হয় না (Admin Panel-এর write/auth-নির্ভর কাজের
// জন্য SDK-ভিত্তিক ফাংশনগুলো (fetchAllProducts, upsertProduct ইত্যাদি) products.ts/
// categories.ts-এ অপরিবর্তিতই আছে — শুধু পাবলিক "active" রিড দুটোই REST-এ সরানো হলো)।
// ============================================================

const PROJECT_ID = 'jutoria';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

function decodeValue(value: FirestoreValue): unknown {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.nullValue !== undefined) return null;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.arrayValue) return (value.arrayValue.values || []).map(decodeValue);
  if (value.mapValue) return decodeFields(value.mapValue.fields || {});
  return undefined;
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    out[key] = decodeValue(value);
  }
  return out;
}

/**
 * একটা কালেকশনের সব ডকুমেন্ট plain REST fetch() দিয়ে আনে ও প্লেইন JS অবজেক্টে ডিকোড
 * করে দেয় (Firestore REST API-এর typed-value ফরম্যাট, যেমন {stringValue: "..."},
 * নিজে থেকেই বুঝে নেয়)। pageSize=300 যথেষ্ট — এই প্রজেক্টের কোনো কালেকশনই এখনো এত
 * বড় না (৭০+ প্রোডাক্ট, ৭টা ক্যাটাগরি)। ব্যর্থ হলে থ্রো করে — কলার (useProducts.ts/
 * useCategories.ts) আগে থেকেই catch করে static fallback-এ চলে যায়।
 */
export async function fetchCollectionViaRest<T>(collectionName: string, pageSize = 300): Promise<T[]> {
  const res = await fetch(`${BASE_URL}/${collectionName}?pageSize=${pageSize}`);
  if (!res.ok) throw new Error(`Firestore REST fetch failed for ${collectionName}: ${res.status}`);
  const data: { documents?: { fields?: Record<string, FirestoreValue> }[] } = await res.json();
  return (data.documents || []).map((doc) => decodeFields(doc.fields || {}) as T);
}
