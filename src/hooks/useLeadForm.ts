import { useState } from 'react';
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

export function useLeadForm(source: LeadSource) {
  const [values, setValues] = useState<Fields>(EMPTY);
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
