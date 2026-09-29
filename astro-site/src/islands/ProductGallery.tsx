import { useState } from 'react';

// মূল src/components/product/ProductGallery.tsx থেকে অপরিবর্তিত পোর্ট করা — এটাই একমাত্র
// React island /product/:sku পেজে (client:load, কারণ এই ছবিটাই পেজের LCP এলিমেন্ট)।
// Astro এই কম্পোনেন্টের initial output সার্ভার-সাইডে স্ট্যাটিক HTML হিসেবে রেন্ডার করে
// দেয় (তাই ছবি hydration ছাড়াই সাথে সাথে পেইন্ট হয়), শুধু থাম্বনেইল ক্লিকের
// ইন্টারঅ্যাক্টিভিটির জন্যই client-এ হাইড্রেট হয়।
type ImageEntry = { filename?: string; role?: string; url: string; confidence?: string };

export default function ProductGallery({ images, productName }: { images: ImageEntry[]; productName?: string }) {
  if (!images || images.length === 0) return <div className="bg-brand-offwhite p-8 text-center">No images available</div>;

  const buildAlt = (img: ImageEntry, index: number) => {
    if (productName) {
      const roleLabel = img.role && img.role !== 'primary' ? ` — ${img.role}` : '';
      return `${productName}${roleLabel || ` — view ${index + 1}`}`;
    }
    return img.filename || `Product image ${index + 1}`;
  };

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
          fetchPriority="high"
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
