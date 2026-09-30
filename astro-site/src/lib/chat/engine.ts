import products from '../../data/products.json';
import { materials } from '../../data/materials';
import { companyKnowledge } from '../../data/assistantKnowledge';

// মূল src/components/chat/JutoriaAssistant.tsx-এর RULE-BASED (কীওয়ার্ড-ম্যাচিং) উত্তর-লজিক,
// হুবহু। কোনো external AI API লাগে না। এই মডিউল (products.json সহ ~৩৫KB) চ্যাট প্যানেলে
// প্রথম মেসেজ পাঠানোর মুহূর্তেই dynamic import হয় — পেজ লোডে ডাউনলোড হয় না।

// চ্যাটের WhatsApp নম্বর — Sir Commerce Group Ltd-এর মূল UK লাইন (+44 7311 127176), সাইটের
// অন্য সব জায়গায় (Contact, Corporate Information, ফুটার) এটাই প্রথম নম্বর। দেশের কোড সহ,
// + বা স্পেস ছাড়া। ChatPanel.astro-র "Chat on WhatsApp" বাটনও এই একই নম্বর ব্যবহার করে।
export const WHATSAPP_NUMBER = '447311127176';

export function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

type ProductRecord = { sku: string; name: string; excel_fields?: Record<string, any> };
export type Answer = { text: string; link?: { label: string; to: string }; whatsapp?: string };

function findMatchingProducts(query: string): ProductRecord[] {
  const q = query.toLowerCase();
  return (products as ProductRecord[]).filter((p) => {
    const haystack = [p.name, p.sku, p.excel_fields?.['Material Composition'], p.excel_fields?.['Color'], p.excel_fields?.['Shape']]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).some((word) => word.length > 2 && haystack.includes(word));
  });
}

function findMatchingMaterial(query: string) {
  const q = query.toLowerCase();
  return materials.find((m) => q.includes(m.slug.replace('-', ' ')) || q.includes(m.name.toLowerCase()));
}

export function respond(query: string): Answer {
  const q = query.toLowerCase().trim();

  if (/^(hi|hello|hey|salam|assalamu|namaste|start)\b/.test(q)) {
    return {
      text: "Hello! I'm the JUTORIA assistant. I can help with product pricing, MOQ, materials, wholesale process, or connecting you with our team. What would you like to know?",
    };
  }

  if (/price|cost|fob|exw|moq|quantity|quote/.test(q)) {
    const matches = findMatchingProducts(q);
    if (matches.length > 0) {
      const p = matches[0];
      const price = p.excel_fields?.['EXW Price (USD)'] || p.excel_fields?.['FOB = Export Cost'] || 'available on request';
      const moq = p.excel_fields?.['MOQ'] || 'available on request';
      return {
        text: `${p.name} (SKU: ${p.sku}) — Price: ${price}, MOQ: ${moq}. For a formal quotation on your target volume, submit a wholesale inquiry and our team will confirm current pricing.`,
        link: { label: `View ${p.name}`, to: `/product/${encodeURIComponent(p.sku)}` },
        whatsapp: `Hi JUTORIA, I'd like a quote for ${p.name} (SKU: ${p.sku}).`,
      };
    }
    return {
      text: `${companyKnowledge.moq} For an exact quote on a specific product and quantity, it's fastest to submit a wholesale inquiry directly, or message us on WhatsApp.`,
      link: { label: 'Request a Quote', to: companyKnowledge.contactPage },
      whatsapp: "Hi JUTORIA, I'd like pricing and MOQ details for a wholesale order.",
    };
  }

  const material = findMatchingMaterial(q);
  if (material) {
    return { text: material.longDesc, link: { label: `More on ${material.name}`, to: `/materials/${material.slug}` } };
  }
  if (/material|fiber|fibre|jute|seagrass|bamboo/.test(q)) {
    return {
      text: 'We work with six natural fibers: Jute, Seagrass, Bamboo, Cane/Rattan, Water Hyacinth and Kans Grass. Which one are you interested in?',
      link: { label: 'Browse All Materials', to: '/materials' },
    };
  }

  if (/wholesale|bulk|b2b|distributor|import|reseller/.test(q)) {
    return {
      text: companyKnowledge.wholesaleProcess,
      link: { label: 'Start a Wholesale Inquiry', to: companyKnowledge.contactPage },
      whatsapp: "Hi JUTORIA, I'm interested in a wholesale order — could we discuss on WhatsApp?",
    };
  }

  if (/ship|shipping|delivery|export|incoterm|fob|port|lead time/.test(q)) return { text: companyKnowledge.shipping };
  if (/custom|private label|white label|branding|logo/.test(q)) return { text: companyKnowledge.customization };
  if (/certif|compliance|bsci|amfori|audit|ethical|sustainab/.test(q)) return { text: companyKnowledge.certifications };

  if (/contact|email|phone|call|whatsapp|human|talk to|speak to|representative/.test(q)) {
    return {
      text: `You can reach our wholesale team directly at ${companyKnowledge.contactEmail}, on WhatsApp, or via the inquiry form for a tracked response.`,
      link: { label: 'Go to Contact Page', to: companyKnowledge.contactPage },
      whatsapp: 'Hi JUTORIA, I have a question and would like to talk to your team.',
    };
  }

  if (/who are you|about jutoria|company|legal|registered/.test(q)) return { text: companyKnowledge.companyLegal };

  return {
    text: "I'm not fully sure on that one yet — for anything specific I can't answer, our wholesale team can help directly, including on WhatsApp.",
    link: { label: 'Contact the Team', to: companyKnowledge.contactPage },
    whatsapp: "Hi JUTORIA, I have a question your website assistant couldn't answer.",
  };
}
