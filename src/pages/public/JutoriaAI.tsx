import { Helmet } from 'react-helmet-async';
import { JutoriaAssistantPanel } from '../../components/chat/JutoriaAssistant';

export default function JutoriaAI() {
  return (
    <>
      <Helmet>
        <title>JUTORIA AI Assistant</title>
        <meta name="description" content="Ask the JUTORIA AI Assistant about product pricing, MOQ, materials and the wholesale process." />
      </Helmet>

      <section className="border-b border-brand-navy/10 bg-[#f7f4ee]">
        <div className="container mx-auto max-w-4xl px-4 py-16 md:py-20 text-center">
          <span className="mb-5 block font-sans text-[11px] font-bold tracking-[0.24em] text-brand-gold uppercase">
            Jutoria AI
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[0.95] tracking-[-0.03em] text-brand-navy mb-6">
            Ask the JUTORIA Assistant
          </h1>
          <p className="max-w-xl mx-auto font-sans text-base md:text-lg text-brand-navy/75 font-light leading-relaxed">
            Pricing, MOQ, materials, wholesale process, or how to reach our team — ask directly below.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-brand-offwhite">
        <div className="container mx-auto px-4">
          <JutoriaAssistantPanel standalone />
        </div>
      </section>
    </>
  );
}
