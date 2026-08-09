import React, { useEffect, useMemo, useState } from 'react';

const BASE_PATH = import.meta.env.BASE_URL || '/';
const heroImageSmall = `${BASE_PATH}assets/hero-fulani-small.webp`;
const heroImageMobile = `${BASE_PATH}assets/hero-mobile.webp`;
const heroImage700 = `${BASE_PATH}assets/hero-fulani-700.webp`;
const heroImageLarge = `${BASE_PATH}assets/hero-fulani.webp`;
// Videos disabled for performance - LPV optimization
const heroVideoWebm = null;
const heroVideoMp4 = null;

interface HeroSectionProps {
  countdown: { hours: number; minutes: number; seconds: number };
  stockCount: number;
  viewerCount: number;
}

export const HeroSection = ({ countdown, stockCount, viewerCount }: HeroSectionProps) => {
  const [canEnhance, setCanEnhance] = useState(false);

  const shouldEnhanceWithVideo = useMemo(() => {
    // Videos disabled for LPV optimization
    return false;
  }, []);

  useEffect(() => {
    if (!shouldEnhanceWithVideo) return;

    let didSet = false;
    const enable = () => {
      if (didSet) return;
      didSet = true;
      setCanEnhance(true);
      cleanup();
    };

    const onFirstInteraction = () => enable();

    const opts: AddEventListenerOptions = { passive: true };
    window.addEventListener('scroll', onFirstInteraction, opts);
    window.addEventListener('click', onFirstInteraction, opts);
    window.addEventListener('touchstart', onFirstInteraction, opts);
    window.addEventListener('keydown', onFirstInteraction);

    const idleId = window.setTimeout(enable, 3500);

    const cleanup = () => {
      window.clearTimeout(idleId);
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    };

    return cleanup;
  }, [shouldEnhanceWithVideo]);

  return (
    <section className="pt-32 md:pt-44 pb-16 md:pb-32 relative overflow-hidden royal-blue-gradient valentine-pattern">
      <div className="absolute inset-0 arabian-pattern"></div>
      <div className="absolute inset-0 moroccan-tile opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Pre-headline */}
            <p className="inline-block font-sans text-base md:text-lg mb-4 bg-[#B80F66] text-white px-3 py-1.5 rounded">
              Tired of watching your edges disappear? 😔
            </p>
            
                        
            {/* Main Headline */}
            <h1 className="font-cinzel text-3xl md:text-5xl lg:text-6xl font-semibold mb-6 leading-tight">
              <span className="text-foreground">STOP HAIR LOSS IN</span>
              <br />
              <span className="animate-shimmer">7 DAYS OR LESS</span>
            </h1>
            
            {/* Flash Sale Banner */}
            <div className="p-4 md:p-6 rounded-2xl bg-destructive/20 border-2 border-gold mb-6">
              <p className="font-cinzel text-lg md:text-xl text-foreground mb-3 font-semibold">
                🔥 FLASH SALE: 69% OFF + ₦70,000 FREE Gifts
              </p>
              <div className="flex justify-center lg:justify-start gap-2">
                {[
                  { value: countdown.hours, label: 'HRS' },
                  { value: countdown.minutes, label: 'MIN' },
                  { value: countdown.seconds, label: 'SEC' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-14 md:w-16 h-14 md:h-16 bg-background rounded-lg flex items-center justify-center">
                      <span className="font-cinzel text-2xl md:text-3xl text-gold font-semibold">
                        {String(item.value).padStart(2, '0')}
                      </span>
                    </div>
                    <span className="font-sans text-[10px] text-muted-foreground mt-1">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Social Proof */}
            <p className="font-serif text-xl md:text-2xl text-foreground/80 mb-4 italic">
              Join 5,247 Nigerian women who restored their crowning glory...
            </p>
            
            {/* Expert Quote */}
            <div className="p-4 rounded-xl bg-background/20 border border-gold/30 mb-6">
              <p className="font-serif text-base md:text-lg text-foreground/90 italic">
                "The most effective natural hair restoration formula I've seen in 20 years."
              </p>
              <p className="font-sans text-sm text-gold mt-2">— Dr. Adaeze Nwosu, Consultant Trichologist, LUTH</p>
            </div>
            
            {/* Price Anchoring */}
            <div className="p-4 md:p-6 rounded-2xl bg-background/30 border border-gold/50 mb-6">
              <p className="font-sans text-sm md:text-base text-muted-foreground mb-2">
                Why spend ₦15,000,000 on hair transplants when you can get better results for:
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-3">
                <span className="font-sans text-xl text-muted-foreground line-through">₦71,500</span>
                <span className="font-cinzel text-3xl md:text-4xl text-gold font-semibold">₦32,750</span>
                <span className="px-2 py-1 bg-destructive text-foreground text-sm font-bold rounded">-54%</span>
              </div>
            </div>
            
            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 md:p-4 rounded-xl bg-background/20 border border-gold/30 text-center">
                <p className="font-cinzel text-xl md:text-2xl text-gold font-semibold">100,000+</p>
                <p className="font-sans text-xs md:text-sm text-muted-foreground">Orders Delivered</p>
              </div>
              <div className="p-3 md:p-4 rounded-xl bg-background/20 border border-gold/30 text-center">
                <p className="font-cinzel text-xl md:text-2xl text-gold font-semibold">4.9★</p>
                <p className="font-sans text-xs md:text-sm text-muted-foreground">5,247 Reviews</p>
              </div>
              <div className="p-3 md:p-4 rounded-xl bg-background/20 border border-gold/30 text-center">
                <p className="font-cinzel text-xl md:text-2xl text-[#B80F66] font-semibold animate-pulse">127</p>
                <p className="font-sans text-xs md:text-sm text-muted-foreground">Orders Today</p>
              </div>
            </div>
            
            {/* Live Activity */}
            <div className="p-3 rounded-xl bg-[#B80F66]/20 border border-[#B80F66]/50 mb-6">
              <p className="font-sans text-sm md:text-base text-[#B80F66]">
                {viewerCount} people viewing · 23 orders in last hour · Only {stockCount} left!
              </p>
            </div>
            
            {/* CTA Button */}
            <a
              href="#order-form"
              data-form-cta="true"
              className="block w-full bg-gradient-to-r from-[#5ec239] to-[#4cae4e] text-white font-sans text-base md:text-lg tracking-widest uppercase py-4 md:py-5 rounded-xl font-bold text-center mb-6 shadow-lg hover:-translate-y-1 hover:scale-[1.02] transition-transform duration-300 cta-with-arrow"
            >
              Claim My Special Offer
              <span className="arrow-indicator"></span>
            </a>

            {/* Mobile product image (shown early) */}
            <div className="block lg:hidden max-w-xs mx-auto">
              <div className="rounded-3xl mega-glow pomade-glow p-5 bg-background/10">
                <div className="relative w-full aspect-square">
                  {!canEnhance && (
                    <img
                      src={heroImageSmall}
                      srcSet={`${heroImageSmall} 300w, ${heroImageMobile} 400w, ${heroImage700} 700w`}
                      sizes="(max-width: 1023px) 300px, 400px"
                      alt="Fulani Hair Gro Complete 3-Step System"
                      className="absolute inset-0 w-full h-full object-contain"
                      width={300}
                      height={300}
                      loading="eager"
                      decoding="async"
                      fetchpriority="high"
                    />
                  )}

                  {canEnhance && (
                    <video
                      className="absolute inset-0 w-full h-full object-contain"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={heroImage700}
                    >
                      <source src={heroVideoWebm} type="video/webm" />
                      <source src={heroVideoMp4} type="video/mp4" />
                      <track kind="captions" src="/assets/hero-captions.vtt" srcLang="en" label="English" default />
                    </video>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Product Display */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Product Image */}
              <div className="w-full aspect-square rounded-3xl flex items-center justify-center mega-glow pomade-glow p-8">
                <div className="relative w-full h-full">
                  {!canEnhance && (
                    <img
                      src={heroImageSmall}
                      srcSet={`${heroImageSmall} 300w, ${heroImage700} 700w, ${heroImageLarge} 1200w`}
                      sizes="(min-width: 1024px) 400px, 300px"
                      alt="Fulani Hair Gro Complete 3-Step System"
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                      width={400}
                      height={400}
                      loading="eager"
                      decoding="async"
                      fetchpriority="high"
                    />
                  )}

                  {canEnhance && (
                    <video
                      className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 hover:scale-105"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="none"
                      poster={heroImageLarge}
                    >
                      <source src={heroVideoWebm} type="video/webm" />
                      <source src={heroVideoMp4} type="video/mp4" />
                      <track kind="captions" src="/assets/hero-captions.vtt" srcLang="en" label="English" default />
                    </video>
                  )}
                </div>
              </div>
              
              {/* Stock Badge */}
              <div className="absolute -top-4 -right-4 px-6 py-3 rounded-full bg-destructive text-foreground font-sans font-bold shadow-lg animate-pulse-red">
                Only {stockCount} Left! 🔥
              </div>
              
              {/* As Seen On Badge */}
              <div className="absolute -bottom-4 -left-4 px-6 py-3 rounded-xl gold-gradient text-background shadow-lg mega-glow">
                <p className="font-sans text-xs uppercase tracking-wider font-bold">As Seen On</p>
                <p className="font-cinzel text-base font-semibold">Bella Naija • Guardian</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};