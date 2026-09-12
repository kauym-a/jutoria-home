import { useState } from 'react';

type ImageEntry = { filename?: string; role?: string; url: string; confidence?: string };

export default function ProductGallery({ images, productName }:{ images: ImageEntry[]; productName?: string }) {
  if (!images || images.length === 0) return <div className="bg-brand-offwhite p-8 text-center">No images available</div>;

  // অল্ট টেক্সট বানানোর হেল্পার — আপলোড করা raw filename (যেমন "1699999999-IMG_0231.jpg")
  // কখনো ব্যবহারযোগ্য অল্ট টেক্সট না, তাই প্রোডাক্টের নাম + view নম্বর/role দিয়ে বর্ণনামূলক
  // অল্ট বানানো হয় — filename শুধু productName-ও না থাকলে শেষ ফলব্যাক হিসেবে থাকে।
  const buildAlt = (img: ImageEntry, index: number) => {
    if (productName) {
      const roleLabel = img.role && img.role !== 'primary' ? ` — ${img.role}` : '';
      return `${productName}${roleLabel || ` — view ${index + 1}`}`;
    }
    return img.filename || `Product image ${index + 1}`;
  };

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
          alt={buildAlt(activeImage, selectedIndex)}
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
              alt={buildAlt(img, i)}
              className="h-24 w-full object-contain object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
