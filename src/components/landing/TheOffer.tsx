import { Button } from '@/components/ui/button';

interface TheOfferProps {
  stockCount: number;
}

export const TheOffer = ({ stockCount }: TheOfferProps) => {
  const scrollToOrderForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const bonuses = [
    {
      icon: "✨",
      title: "FREE Luxury Silk Bonnet",
      description: "Protects your hair while the formula works overnight (for orders paid before delivery)"
    },
    {
      icon: "✨",
      title: "FREE Hair Growth Ebook",
      description: "My exact routine—what I do every single night"
    },
    {
      icon: "✨",
      title: "FREE Express Shipping (pay before delivery orders only)",
      description: "On ₦69,750 & ₦218,750 bundles only"
    },
  ];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Celebratory gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gold/10 via-background to-gold/10" />
      
      {/* Decorative sparkles */}
      <div className="absolute top-10 left-10 text-2xl opacity-60 animate-pulse">✨</div>
      <div className="absolute top-20 right-20 text-3xl opacity-40 animate-pulse delay-300">✨</div>
      <div className="absolute bottom-20 left-1/4 text-xl opacity-50 animate-pulse delay-700">✨</div>
      <div className="absolute bottom-10 right-10 text-2xl opacity-40 animate-pulse delay-500">✨</div>

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* Gift box header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-4xl">🎁</span>
            <h2 className="font-cinzel text-3xl md:text-4xl lg:text-5xl text-gold">
              YOUR BONUS
            </h2>
            <span className="text-4xl">🎁</span>
          </div>
          <p className="font-serif text-xl md:text-2xl text-foreground">
            Get the Full Authentic Fulani Hair Gro™ System
          </p>
        </div>

        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mb-12" />

        {/* What's included */}
        <div className="text-center mb-10">
          <p className="font-cinzel text-lg md:text-xl text-gold mb-8">Every order paid before delivery comes with:</p>
          
          <div className="space-y-4 max-w-lg mx-auto">
            {bonuses.map((bonus, i) => (
              <div 
                key={i} 
                className="flex items-start gap-4 text-left bg-card/50 border border-gold/20 rounded-lg p-4 hover:border-gold/40 transition-colors"
              >
                <span className="text-2xl flex-shrink-0">{bonus.icon}</span>
                <div>
                  <p className="font-cinzel text-gold text-lg">{bonus.title}</p>
                  <p className="text-muted-foreground text-sm font-serif italic">
                    ({bonus.description})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Decorative divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mb-10" />

        {/* Tagline */}
        <p className="text-center font-serif text-xl md:text-2xl text-foreground/90 italic mb-6 md:mb-8">
          "Experience my family's 400-year-old hair growth ritual."
        </p>

        {/* Price justification story */}
        <div className="max-w-3xl mx-auto mb-8 md:mb-10">
          <div className="bg-card/70 border border-gold/30 rounded-2xl px-6 py-5 md:px-8 md:py-6 text-left space-y-3 font-serif text-lg md:text-2xl text-foreground/90">
            <h3 className="font-cinzel text-sm md:text-base tracking-[0.35em] uppercase text-gold mb-1">
              The Price They Said Was "Too Low"
            </h3>
            <p>
              When I first shared the price for Fulani Hair Gro™, my co-founder told me I was crazy. "We could charge
              <span className="font-semibold"> ₦200,000 per set</span> for this formula," she said.
            </p>
            <p>
              And she wasn&apos;t wrong. A single hair transplant in Turkey can cost
              <span className="font-semibold"> ₦15,000,000 or more</span>. Similar DHT-focused treatments in medical spas
              regularly go for <span className="font-semibold">₦550,000–₦1,500,000 per month</span>.
            </p>
            <p>
              But I didn&apos;t bring Fulani Hair Gro™ out of my family cupboard just to get rich. I exposed it to the world
              because women deserve an <span className="font-semibold">affordable solution that actually works</span>—not
              another treatment that keeps them trapped in an expensive cycle.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <Button 
            onClick={scrollToOrderForm}
            size="lg"
            className="gold-gradient text-background font-cinzel text-lg md:text-xl px-8 md:px-12 py-6 md:py-8 hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(218,165,32,0.4)]"
          >
            <span className="mr-2">👑</span>
            YES! I WANT THE AUTHENTIC FORMULA
            <span className="ml-2">👑</span>
          </Button>

          {/* Stock warning */}
          <div className="mt-6 inline-flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-destructive font-semibold text-xl">
              Only {stockCount} bundles left in this batch
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
