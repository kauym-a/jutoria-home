import { useState } from 'react';

type ImageEntry = { filename?: string; role?: string; url: string; confidence?: string };

export default function ProductGallery({ images }:{ images: ImageEntry[] }) {
  if (!images || images.length === 0) return <div className="bg-brand-offwhite p-8 text-center">No images available</div>;

  // NOTE: ইনডেক্স দিয়ে identify করা হয়, url বা role দিয়ে নয় — কারণ দুইটা ভিন্ন
  // ছবির url ভুলবশত হুবহু এক হয়ে গেলে (যেমন কপি-পেস্ট করে সেভ করার সময়), আগে এই
  // কম্পোনেন্ট সেটাকে "একই ছবি" ধরে একটাকে সাইলেন্টলি বাদ দিয়ে দিত — ফলে একটা
  // ছবির জায়গায় আরেকটার ছবি দেখাতো। ইনডেক্স কখনো ডুপ্লিকেট হয় না, তাই এই বাগ ক্লাস
  // পুরোপুরি বন্ধ হয়ে যায়।
  const primaryIndex = Math.max(0, images.findIndex((i) => i.role === 'primary'));
  const [selectedIndex, setSelectedIndex] = useState(primaryIndex);
  const activeImage = images[selectedIndex] ?? images[0];
  const others = images
    .map((img, i) => ({ img, i }))
    .filter(({ i }) => i !== selectedIndex);

  return (
    <div className="space-y-4">
      <div className="flex min-h-[420px] items-center justify-center overflow-hidden rounded-lg border border-brand-navy/10 bg-brand-offwhite p-4 sm:min-h-[480px] lg:min-h-[560px]">
        <img
          src={activeImage.url}
          alt={activeImage.filename || ''}
          className="max-h-[560px] w-full object-contain object-center"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {others.map(({ img, i }) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectedIndex(i)}
            className="overflow-hidden rounded-md border border-brand-navy/10 bg-brand-offwhite p-1 transition-all duration-200 hover:border-brand-gold/60"
            aria-label={`View ${img.filename || `image ${i + 1}`}`}
          >
            <img loading="lazy" decoding="async"
              src={img.url}
              alt={img.filename || ''}
              className="h-24 w-full object-contain object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
