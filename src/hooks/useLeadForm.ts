import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { LeadInput, LeadSource } from '../services/firebase/leads';

// ============================================================
// /wholesale ও /contact — দুটো ইনকোয়ারি ফর্মই এই hook ব্যবহার করে। প্রতিটা পেজ তার
// নিজের JSX/লেবেল রাখে, শুধু ইনপুটগুলো এই hook-এর state-এ বাঁধে। সাবমিট করলে
// Firestore-এর 'leads' কালেকশনে সেভ হয় (services/firebase/leads.ts)।
// ============================================================

type Fields = Omit<LeadInput, 'source'>;

const EMPTY: Fields = {
  name: '',
  email: '',
  company: '',
  country: '',
  type: '',
  productInterest: '',
  quantity: '',
  message: '',
};

// আগে ProductDetail.tsx-এর "Wholesale Inquiry" বাটন চাপলে কাস্টমার একটা খালি ফর্মে
// এসে পড়তেন — কোন প্রোডাক্ট নিয়ে জিজ্ঞাসা করছেন সেটা মনে রেখে/খাতায় লিখে "Products of
// Interest" ফিল্ডে নিজে টাইপ করতে হতো। এখন প্রোডাক্ট পেজ থেকে ?product=...&sku=...
// query param দিয়ে লিংক করা হয় (দেখুন ProductDetail.tsx), আর এখানে সেটা পড়ে
// productInterest/message ফিল্ড আগে থেকেই ভরে দেওয়া হয় — কাস্টমার চাইলে edit করতে
// পারেন, কিন্তু কিছু না করলেও সঠিক প্রোডাক্ট রেফারেন্স-সহই সাবমিট হবে। `type` ফিল্ড
// ইচ্ছাকৃতভাবে prefill করা হয়নি — Contact.tsx-এ এটা "Inquiry Type" (Wholesale, Bulk
// Order...) আর Wholesale.tsx-এ সম্পূর্ণ ভিন্ন জিনিস "Business Type" (Retailer,
// Importer...) বোঝায়, দুই পেজে একই মান বসালে একটাতে ভুল/অচেনা অপশন সিলেক্ট হয়ে যেত।
function buildInitialValues(searchParams: URLSearchParams): Fields {
  const productName = searchParams.get('product');
  if (!productName) return EMPTY;
  const sku = searchParams.get('sku');
  const label = sku ? `${productName} (SKU: ${sku})` : productName;
  return {
    ...EMPTY,
    productInterest: label,
    message: `I'm interested in ${label}. Please share pricing, MOQ and lead time.`,
  };
}

export function useLeadForm(source: LeadSource) {
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState<Fields>(() => buildInitialValues(searchParams));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const setField = (key: keyof Fields, value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!values.name.trim() || !values.email.trim()) {
      toast.error('Name and email are required.');
      return;
    }
    setSubmitting(true);
    try {
      // Firestore/leads.ts dynamically imported শুধু সাবমিট করার সময় — এই ফর্ম
      // (wholesale/contact) ইউজার কখনো সাবমিট না করলে Firestore write-path কোড
      // (collection/addDoc ইত্যাদি) পেজের ইনিশিয়াল বান্ডলে ডাউনলোডই হয় না।
      const { submitLead } = await import('../services/firebase/leads');
      await submitLead({ source, ...values });
      setSubmitted(true);
      setValues(EMPTY);
      toast.success("Thank you! Your inquiry has been submitted — we'll be in touch shortly.");
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong submitting your inquiry. Please try again shortly, or email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return { values, setField, submitting, submitted, handleSubmit };
}
