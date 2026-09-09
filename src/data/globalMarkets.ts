export type MarketRegion = {
  id: string;
  name: string;
  countries: string[];
};

// সোর্স স্ক্রিনশট অনুযায়ী হুবহু — Middle East-এর দেশগুলো Asia-এর অধীনেই রাখা হয়েছে,
// কাঠামো নিজে থেকে বদলানো হয়নি।
export const marketRegions: MarketRegion[] = [
  {
    id: 'europe',
    name: 'European Markets',
    countries: ['Germany', 'Netherlands', 'Denmark', 'France', 'Italy', 'Poland', 'Norway', 'United Kingdom'],
  },
  {
    id: 'north-america',
    name: 'North American Markets',
    countries: ['United States of America', 'Canada'],
  },
  {
    id: 'asia',
    name: 'Asian Markets',
    countries: ['Turkey', 'Japan', 'Saudi Arabia', 'United Arab Emirates', 'Qatar', 'Kuwait', 'Oman'],
  },
  {
    id: 'south-america',
    name: 'South American Markets',
    countries: ['Brazil', 'Argentina'],
  },
];

export type Testimonial = {
  quote: string;
  country: string;
  countryCode: string; // flag emoji base
  role: string;
};

// সরাসরি ক্লায়েন্টদের কাছ থেকে পাওয়া, verified টেস্টিমোনিয়াল — শব্দ পরিবর্তন করা হয়নি।
export const testimonials: Testimonial[] = [
  {
    quote:
      "Working with JUTORIA has been a wonderful experience. Their natural fiber products are beautifully crafted and of excellent quality. We appreciate their reliability, attention to detail, and sustainable approach to production. JUTORIA is a trusted partner for our business and we are excited about our continuing collaboration.",
    country: 'Germany',
    countryCode: 'DE',
    role: 'Home Décor Importer & Retailer',
  },
  {
    quote:
      "JUTORIA has been an excellent partner for our business. The quality of their natural fiber products is consistently outstanding, and their craftsmanship truly reflects care and authenticity. Communication, lead times, and packaging all meet our expectations. We look forward to a long-term partnership.",
    country: 'Poland',
    countryCode: 'PL',
    role: 'Home Décor Importer & Retailer',
  },
];
