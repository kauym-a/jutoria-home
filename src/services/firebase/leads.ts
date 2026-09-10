import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// ============================================================
// পাবলিক সাইটের দুটো ফর্ম — /wholesale-এর "Let's Discuss Your Collection" এবং
// /contact-এর "Send an Inquiry" — সাবমিট করলে ডেটা এখানে, Firestore-এর 'leads'
// কালেকশনে সেভ হয়। `source` ফিল্ড দিয়ে কোন ফর্ম থেকে এসেছে তা বোঝা যায়।
//
// ভিজিটর শুধু নতুন lead তৈরি (create) করতে পারে — পড়া/এডিট/মুছা শুধু লগইন করা Admin
// (নিয়ম: firestore.rules)। তাই এখানে static fallback নেই।
// ============================================================

const LEADS_COLLECTION = 'leads';

export type LeadSource = 'wholesale' | 'contact';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'closed';

export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'closed'];

/** ভিজিটর যা যা জমা দেয়। */
export type LeadInput = {
  source: LeadSource;
  name: string;
  email: string;
  company?: string;
  country?: string;
  /** wholesale ফর্মে "Business Type", contact ফর্মে "Inquiry Type" */
  type?: string;
  productInterest?: string;
  quantity?: string;
  message?: string;
};

/** Firestore-এ সংরক্ষিত পূর্ণ রেকর্ড। */
export type Lead = LeadInput & {
  id: string;
  status: LeadStatus;
  createdAt?: { seconds: number; nanoseconds: number } | null;
};

/** নতুন lead জমা দেয় (পাবলিক — লগইন লাগে না)। */
export async function submitLead(input: LeadInput): Promise<void> {
  // খালি/undefined ফিল্ড বাদ দিয়ে পরিষ্কার অবজেক্ট বানাই
  const clean: Record<string, unknown> = { status: 'new', createdAt: serverTimestamp() };
  for (const [k, v] of Object.entries(input)) {
    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (trimmed) clean[k] = trimmed;
    } else if (v != null) {
      clean[k] = v;
    }
  }
  await addDoc(collection(db, LEADS_COLLECTION), clean);
}

/** সব lead আনে (admin — নতুন আগে)। */
export async function fetchAllLeads(): Promise<Lead[]> {
  const q = query(collection(db, LEADS_COLLECTION), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, 'id'>) }));
}

/** একটা lead-এর স্ট্যাটাস বদলায় (admin)। */
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  await updateDoc(doc(db, LEADS_COLLECTION, id), { status });
}

/** একটা lead মুছে ফেলে (admin)। */
export async function deleteLead(id: string): Promise<void> {
  await deleteDoc(doc(db, LEADS_COLLECTION, id));
}
