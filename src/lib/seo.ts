// ============================================================
// ছোট, ফ্রেমওয়ার্ক-ফ্রি SEO হেল্পার — canonical/OG URL এবস্যলিউট করা এবং JSON-LD
// (Organization, Product, BreadcrumbList) বানানোর জন্য কমন লজিক এখানে রাখা হলো, যাতে
// প্রতিটা পেজে একই স্ট্রিং বারবার হার্ডকোড না হয়। প্রতিটা পেজ নিজের <Helmet> ব্লকে এগুলো
// বসায় — এই ফাইলটা শুধু ডেটা তৈরি করে, কোনো JSX রেন্ডার করে না।
// ============================================================

export const SITE_URL = 'https://jutoriahome.com';
export const SITE_NAME = 'JUTORIA';

/** একটা সাইট-রিলেটিভ পাথ (যেমন "/products") কে ফুল absolute URL বানায় — OG/canonical ট্যাগের জন্য এটা বাধ্যতামূলক, রিলেটিভ পাথ সোশ্যাল ক্রলাররা রিজলভ করতে পারে না। */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

/** সব পাবলিক পেজে একবার বসানোর জন্য Organization JSON-LD — ব্র্যান্ড এনটিটি ও নলেজ প্যানেল এলিজিবিলিটির জন্য সহায়ক। */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: 'SIRCOMMERCE GROUP LTD',
    url: SITE_URL,
    logo: absoluteUrl('/logo.png'),
    address: {
      '@type': 'PostalAddress',
      streetAddress: '69 Wingfield Road, Great Barr',
      addressLocality: 'Birmingham',
      postalCode: 'B42 2QB',
      addressCountry: 'GB',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+44-7435-945500',
      contactType: 'sales',
      email: 'wholesale@jutoriahome.com',
    },
    sameAs: [
      'https://facebook.com/jutoriahome',
      'https://instagram.com/jutoria.home',
      'https://threads.net/@jutoriahome',
      'https://tiktok.com/@jutoriahome',
      'https://youtube.com/@jutoriahome',
      'https://www.pinterest.com/jutoriahome',
      'https://linkedin.com/company/jutoriahome',
      'https://x.com/jutoriahomecom',
    ],
  };
}

/** ব্রেডক্রাম্ব ট্রেইল থেকে BreadcrumbList JSON-LD — items ধরুন [{name:'Home', path:'/'}, ...]। */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type ProductLike = {
  sku: string;
  name: string;
  description?: string;
  category?: string;
  images?: { url: string }[];
  excel_fields?: Record<string, string>;
};

/**
 * প্রোডাক্ট পেজের জন্য Product JSON-LD। এখানে ইচ্ছাকৃতভাবে কোনো "offers"/price বসানো
 * হয়নি — এটা B2B হোলসেল ক্যাটালগ, ফিক্সড রিটেইল প্রাইস পাবলিকলি দেখানো হয় না, আর
 * schema.org-এর Offer টাইপে price বাধ্যতামূলক — ভুয়া দাম বসানোর চেয়ে বাদ দেওয়া ভালো।
 */
export function productJsonLd(product: ProductLike, canonicalPath: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    sku: product.sku,
    description: product.description || `${product.name} — premium eco-friendly handmade home décor from JUTORIA.`,
    image: (product.images || []).map((i) => i.url).filter(Boolean),
    url: absoluteUrl(canonicalPath),
    brand: { '@type': 'Brand', name: SITE_NAME },
    ...(product.category ? { category: product.category } : {}),
    ...(product.excel_fields
      ? {
          additionalProperty: Object.entries(product.excel_fields).map(([name, value]) => ({
            '@type': 'PropertyValue',
            name,
            value,
          })),
        }
      : {}),
  };
}
