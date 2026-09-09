import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Send, ArrowRight, Phone } from 'lucide-react';
import products from '../../data/products.json';
import { materials } from '../../data/materials';
import { companyKnowledge } from '../../data/assistantKnowledge';

// ⚠️ এখানে আসল WhatsApp Business নম্বর বসান (দেশের কোড সহ, শুরুতে + বা 00 ছাড়া — যেমন 8801XXXXXXXXX)।
// Contact.tsx-এও এখন পর্যন্ত একই প্লেসহোল্ডার নম্বর ব্যবহৃত হয়েছে — আসল নম্বর এলে দুই জায়গাতেই বসাতে হবে।
const WHATSAPP_NUMBER = '8801XXXXXXXXX';

function buildWhatsAppLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

type ProductRecord = {
  sku: string;
  name: string;
  excel_fields?: Record<string, any>;
};

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  link?: { label: string; to: string };
  whatsapp?: string; // present ⇒ show a "Continue on WhatsApp" action with this prefilled message
};

// ============================================================
// এটা একটা RULE-BASED (কীওয়ার্ড-ম্যাচিং) অ্যাসিস্ট্যান্ট — কোনো external AI API লাগে না,
// তাই এখনই কাজ করবে, কোনো API key ছাড়াই। এটা products.json ও materials.ts থেকে সরাসরি
// ডেটা পড়ে উত্তর দেয় — মানে products.json-এ নতুন প্রোডাক্ট যোগ করলে অ্যাসিস্ট্যান্ট
// নিজে থেকেই সেগুলো নিয়ে উত্তর দিতে পারবে, কোড না ছুঁয়েই।
//
// এটা প্রকৃত LLM (যেমন Claude) নয় — জটিল/অস্পষ্ট প্রশ্নে এটা সীমাবদ্ধ, তখন এটা
// মানুষের সাথে যোগাযোগের পরামর্শ দেয়। প্রকৃত AI দিয়ে upgrade করতে একটা Anthropic API key
// ও একটা ছোট ব্যাকএন্ড ফাংশন (Firebase Cloud Function) দরকার হবে।
// ============================================================

function findMatchingProducts(query: string): ProductRecord[] {
  const q = query.toLowerCase();
  return (products as ProductRecord[]).filter((p) => {
    const haystack = [
      p.name,
      p.sku,
      p.excel_fields?.['Material Composition'],
      p.excel_fields?.['Color'],
      p.excel_fields?.['Shape'],
    ]
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

function respond(query: string): { text: string; link?: { label: string; to: string }; whatsapp?: string } {
  const q = query.toLowerCase().trim();

  if (/^(hi|hello|hey|salam|assalamu|namaste|start)\b/.test(q)) {
    return {
      text: "Hello! I'm the JUTORIA assistant. I can help with product pricing, MOQ, materials, wholesale process, or connecting you with our team. What would you like to know?",
    };
  }

  // Product / price / MOQ lookup
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

  // Material lookup
  const material = findMatchingMaterial(q);
  if (material) {
    return {
      text: material.longDesc,
      link: { label: `More on ${material.name}`, to: `/materials/${material.slug}` },
    };
  }
  if (/material|fiber|fibre|jute|seagrass|bamboo/.test(q)) {
    return {
      text: "We work with seven natural fibers: Jute, Seagrass, Bamboo, Hogla Leaf, Cane/Rattan, Water Hyacinth and Kans Grass. Which one are you interested in?",
      link: { label: 'Browse All Materials', to: '/materials' },
    };
  }

  // Wholesale / bulk process
  if (/wholesale|bulk|b2b|distributor|import|reseller/.test(q)) {
    return {
      text: companyKnowledge.wholesaleProcess,
      link: { label: 'Start a Wholesale Inquiry', to: companyKnowledge.contactPage },
      whatsapp: "Hi JUTORIA, I'm interested in a wholesale order — could we discuss on WhatsApp?",
    };
  }

  // Shipping / export
  if (/ship|shipping|delivery|export|incoterm|fob|port|lead time/.test(q)) {
    return { text: companyKnowledge.shipping };
  }

  // Customization / private label
  if (/custom|private label|white label|branding|logo/.test(q)) {
    return { text: companyKnowledge.customization };
  }

  // Certification
  if (/certif|compliance|bsci|amfori|audit|ethical|sustainab/.test(q)) {
    return { text: companyKnowledge.certifications };
  }

  // Contact / human
  if (/contact|email|phone|call|whatsapp|human|talk to|speak to|representative/.test(q)) {
    return {
      text: `You can reach our wholesale team directly at ${companyKnowledge.contactEmail}, on WhatsApp, or via the inquiry form for a tracked response.`,
      link: { label: 'Go to Contact Page', to: companyKnowledge.contactPage },
      whatsapp: 'Hi JUTORIA, I have a question and would like to talk to your team.',
    };
  }

  // About / company
  if (/who are you|about jutoria|company|legal|registered/.test(q)) {
    return { text: companyKnowledge.companyLegal };
  }

  // Fallback
  return {
    text: "I'm not fully sure on that one yet — for anything specific I can't answer, our wholesale team can help directly, including on WhatsApp.",
    link: { label: 'Contact the Team', to: companyKnowledge.contactPage },
    whatsapp: "Hi JUTORIA, I have a question your website assistant couldn't answer.",
  };
}

const SUGGESTED_PROMPTS = [
  'What is your MOQ?',
  'Tell me about jute',
  'How does wholesale work?',
  'How do I contact your team?',
];

export function JutoriaAssistantPanel({ standalone = false }: { standalone?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: "Hi, I'm the JUTORIA AI Assistant. Ask me about product pricing, MOQ, materials, wholesale process, or how to reach our team.",
    },
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = { id: `${Date.now()}-u`, role: 'user', text: trimmed };
    const answer = respond(trimmed);
    const botMsg: ChatMessage = {
      id: `${Date.now()}-a`,
      role: 'assistant',
      text: answer.text,
      link: answer.link,
      whatsapp: answer.whatsapp,
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput('');
  };

  return (
    <div className={`flex flex-col bg-white ${standalone ? 'h-[70vh] max-w-2xl mx-auto border border-brand-navy/10 rounded-[4px] shadow-premium' : 'h-full'}`}>
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-5 space-y-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-3 rounded-[3px] text-sm font-sans leading-relaxed ${
                m.role === 'user'
                  ? 'bg-brand-navy text-brand-ivory'
                  : 'bg-brand-offwhite text-brand-navy border border-brand-navy/10'
              }`}
            >
              <p>{m.text}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {m.link && (
                  <Link to={m.link.to} className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-gold hover:text-brand-navy transition-colors">
                    {m.link.label} <ArrowRight size={12} />
                  </Link>
                )}
                {m.whatsapp && (
                  <a
                    href={buildWhatsAppLink(m.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#25D366] hover:text-brand-navy transition-colors"
                  >
                    Continue on WhatsApp <ArrowRight size={12} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {messages.length <= 1 && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => send(p)}
              className="text-xs font-sans px-3 py-1.5 border border-brand-navy/15 rounded-full text-brand-navy/70 hover:border-brand-gold hover:text-brand-gold transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-brand-navy/10 p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about pricing, MOQ, materials..."
          className="flex-grow px-3 py-2.5 text-sm font-sans bg-brand-offwhite border border-brand-navy/10 rounded-[2px] focus:outline-none focus:border-brand-gold"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-10 h-10 bg-brand-navy text-brand-gold rounded-[2px] hover:bg-brand-gold hover:text-brand-navy transition-colors flex-shrink-0"
          aria-label="Send"
        >
          <Send size={16} />
        </button>
        <a
          href={buildWhatsAppLink('Hi JUTORIA, I have a question.')}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-10 h-10 bg-[#25D366] text-white rounded-[2px] hover:bg-[#1DA851] transition-colors flex-shrink-0"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
        >
          <Phone size={16} />
        </a>
      </form>
    </div>
  );
}

export default function JutoriaAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full bg-brand-navy text-brand-gold shadow-premium-hover flex items-center justify-center hover:bg-brand-gold hover:text-brand-navy transition-colors duration-300"
        aria-label="Open JUTORIA AI Assistant"
      >
        {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      <div
        className={`fixed bottom-24 right-6 z-[60] w-[92vw] max-w-sm h-[65vh] max-h-[520px] bg-white border border-brand-navy/10 rounded-[4px] shadow-premium-hover overflow-hidden transition-all duration-300 origin-bottom-right flex flex-col ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-brand-navy text-brand-ivory flex-shrink-0">
          <span className="font-serif font-bold text-sm">JUTORIA AI Assistant</span>
          <button onClick={() => setIsOpen(false)} aria-label="Close" className="text-brand-ivory/70 hover:text-brand-gold">
            <X size={18} />
          </button>
        </div>
        <div className="flex-grow overflow-hidden">
          <JutoriaAssistantPanel />
        </div>
      </div>
    </>
  );
}
