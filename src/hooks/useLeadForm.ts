import { useState } from 'react';
import toast from 'react-hot-toast';
import { submitLead, type LeadInput, type LeadSource } from '../services/firebase/leads';

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
      toast.error('নাম ও ইমেইল আবশ্যক।');
      return;
    }
    setSubmitting(true);
    try {
      await submitLead({ source, ...values });
      setSubmitted(true);
      setValues(EMPTY);
      toast.success('ধন্যবাদ! আপনার ইনকোয়ারি জমা হয়েছে — আমরা শীঘ্রই যোগাযোগ করব।');
    } catch (err) {
      console.error(err);
      toast.error('জমা দিতে সমস্যা হয়েছে। একটু পরে আবার চেষ্টা করুন অথবা সরাসরি ইমেইল করুন।');
    } finally {
      setSubmitting(false);
    }
  };

  return { values, setField, submitting, submitted, handleSubmit };
}
