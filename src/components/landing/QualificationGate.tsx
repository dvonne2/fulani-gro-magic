import { Button } from '@/components/ui/button';

interface QualificationGateProps {
  onQualified: () => void;
}

export const QualificationGate = ({ onQualified }: QualificationGateProps) => {
  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const benefits = [
    "Type 3 Hair Loss (Visible scalp through thinning)",
    "Type 4 Hair Loss (Significant bald patches)",
    "Chronic traction alopecia",
    "Post-partum hair loss",
    "Menopausal hair thinning",
    "Stress-induced shedding (Telogen Effluvium)"
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" id="order">
      {/* Dark background */}
      <div 
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, hsl(var(--background)), #0a0505, hsl(var(--background)))' }}
      />

      <div className="max-w-3xl mx-auto px-4 md:px-6 relative z-10">
        {/* Crown icon */}
        <div className="text-center mb-6">
          <span className="text-6xl md:text-7xl">👑</span>
        </div>

        {/* Header */}
        <h2 className="font-cinzel text-2xl md:text-4xl text-center text-gold mb-4">
          Ready To Transform Your Hair?
        </h2>

        {/* Divider */}
        <div className="w-full h-px bg-gold/40 mb-10" />

        {/* Message */}
        <div className="text-center space-y-6 mb-10">
          <p className="font-serif text-lg md:text-xl text-foreground">
            <span className="text-gold">Fulani Hair Gro™</span> works best for women with:
          </p>

          {/* Benefits list */}
          <div className="bg-card/50 border border-gold/20 rounded-xl p-6 text-left max-w-md mx-auto mb-6">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <span className="text-gold">✓</span>
                <span className="font-serif text-foreground/90">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Eligibility block */}
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-left">
            <div className="bg-card/60 border border-gold/30 rounded-xl p-5">
              <h3 className="font-cinzel text-sm md:text-base tracking-[0.25em] uppercase text-gold mb-3">
                Perfect For
              </h3>
              <ul className="font-serif text-sm md:text-base text-foreground/90 space-y-1.5">
                <li>⚫ Women 25+ experiencing hormone-related thinning</li>
                <li>⚫ Thinning all over the scalp or crown thinning</li>
                <li>⚫ Widening parts or shrinking ponytails</li>
                <li>⚫ Excessive shedding (more than 100 hairs daily)</li>
                <li>⚫ Women who&apos;ve failed with other treatments</li>
              </ul>
            </div>

            <div className="bg-card/40 border border-destructive/40 rounded-xl p-5">
              <h3 className="font-cinzel text-sm md:text-base tracking-[0.25em] uppercase text-destructive mb-3">
                Not Recommended For
              </h3>
              <ul className="font-serif text-sm md:text-base text-foreground/90 space-y-1.5">
                <li>⚫ Complete baldness (no follicles left to save)</li>
                <li>⚫ Alopecia areata (autoimmune condition)</li>
                <li>⚫ Chemotherapy-related hair loss</li>
                <li>⚫ Women under 25 (often different causes)</li>
              </ul>
            </div>
          </div>

          <p className="font-serif text-lg text-gold font-semibold mt-6">
            If this sounds like you, order now and start your transformation!
          </p>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gold/40 mb-10" />

        {/* CTA Box */}
        <div className="bg-card border-2 border-gold/40 rounded-2xl p-6 md:p-8 text-center">
          <h3 className="font-sans text-sm md:text-base font-bold tracking-widest uppercase text-gold mb-6">
            Choose Your Package
          </h3>

          {/* Primary CTA - Show Packages */}
          <Button
            onClick={scrollToOrderForm}
            size="lg"
            className="w-full gold-gradient text-background hover:scale-105 shadow-[0_0_30px_rgba(218,165,32,0.4)] font-sans text-sm md:text-base tracking-widest uppercase py-6 transition-all duration-300 mb-4"
          >
            <span className="mr-2">👑</span>
            View Packages & Pricing
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 my-6">
            <div className="h-px w-16 bg-border" />
            <span className="text-muted-foreground text-sm">OR</span>
            <div className="h-px w-16 bg-border" />
          </div>

          {/* Secondary CTA - Direct Order */}
          <Button
            onClick={scrollToOrderForm}
            variant="outline"
            size="lg"
            className="w-full border-gold/40 text-gold hover:bg-gold/10 font-sans text-sm tracking-widest uppercase py-6"
          >
            <span className="mr-2">🛒</span>
            Order Now — ₦69,750
          </Button>
        </div>
      </div>
    </section>
  );
};
