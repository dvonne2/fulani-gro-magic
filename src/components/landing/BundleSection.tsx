import shampooImg from '@/assets-optimized/products/shampoo.webp';
import conditionerImg from '@/assets-optimized/products/conditioner.webp';
import pomadeImg from '@/assets-optimized/products/pomade.webp';
import fullBundleImg from '@/assets-optimized/products/66750-bundle.webp';
import result1 from '@/assets-optimized/results/result-1.webp';
import result2 from '@/assets-optimized/results/result-2.webp';
import result3 from '@/assets-optimized/results/result-3.webp';
import result4 from '@/assets-optimized/results/result-4.webp';
import result5 from '@/assets-optimized/results/result-5.webp';
import result6 from '@/assets-optimized/results/result-6.webp';
import result7 from '@/assets-optimized/results/result-7.webp';
import { OptimizedImage } from '@/components/OptimizedImage';
import { usePrefetch } from '@/hooks/usePrefetch';
import { useEffect, useRef } from 'react';

export const BundleSection = () => {
  const thankYouPrefetch = usePrefetch(() => import('@/pages/ThankYou'));
  const sectionRef = useRef<HTMLElement>(null);

  const results = [
    { image: result1, caption: "Length retention goals" },
    { image: result2, caption: "Thickness & definition" },
    { image: result3, caption: "Volume perfection" },
    { image: result4, caption: "Healthy gray hair" },
    { image: result5, caption: "Major growth" },
    { image: result6, caption: "Full & lush" },
    { image: result7, caption: "Edges restored" },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 bg-background relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gold/5 pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <span className="text-gold text-sm font-bold">👑 THE COMPLETE SYSTEM</span>
          </div>
          <h2 className="font-cinzel text-3xl md:text-5xl lg:text-6xl text-foreground mb-4">
            <span className="animate-shimmer">3-Step System Bundle</span>
          </h2>
          <p className="font-sans text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for <span className="text-gold font-semibold">complete hair transformation</span> — working in harmony to cleanse, nourish, and restore.
          </p>
        </div>

        {/* Bundle Hero Display */}
        <div className="relative mb-16 md:mb-20">
          {/* Reflective gold surface effect */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-20 bg-gradient-to-t from-gold/10 via-gold/5 to-transparent rounded-full" />
          
          {/* Desktop: Arc formation / Mobile: Stacked */}
          <div className="relative flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
            {/* Step 1 - Shampoo (Left) */}
            <div className="relative md:-mr-8 md:mt-12 order-2 md:order-1">
              <div className="relative bg-gradient-to-b from-muted/50 to-background/80 rounded-2xl p-6 border border-gold/20">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-royal text-gold text-xs font-bold rounded-full border border-gold/30">
                  STEP 1
                </div>
                <OptimizedImage
                  src={shampooImg}
                  alt="Heritage Shampoo"
                  className="w-32 h-40 md:w-40 md:h-52 object-contain mx-auto"
                  width={160}
                  height={208}
                />
                <p className="font-cinzel text-sm text-foreground text-center mt-3">Heritage Shampoo</p>
                <p className="font-sans text-xs text-gold text-center">Cleanse</p>
              </div>
            </div>

            {/* Step 2 - Conditioner (Center) */}
            <div className="relative group z-20 md:-mt-8 order-1 md:order-2">
              <div className="relative bg-gradient-to-b from-gold/20 to-background/90 rounded-2xl p-8 border border-gold">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-royal text-gold text-xs font-bold rounded-full flex items-center gap-1.5 border border-gold/40">
                  STEP 2
                </div>
                <OptimizedImage
                  src={conditionerImg}
                  alt="Voluminous Conditioner"
                  className="w-40 h-40 md:w-44 md:h-44 object-contain mx-auto"
                  width={176}
                  height={176}
                />
                <p className="font-cinzel text-lg text-foreground text-center mt-4">Voluminous Conditioner</p>
                <p className="font-sans text-sm text-gold text-center">Nourish</p>
              </div>
            </div>

            {/* Step 3 - Pomade (Right) */}
            <div className="relative group md:-ml-8 md:mt-12 order-3">
              <div className="relative bg-gradient-to-b from-muted/50 to-background/80 rounded-2xl p-6 border border-gold/20">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-royal text-gold text-xs font-bold rounded-full border border-gold/30">
                  STEP 3
                </div>
                <OptimizedImage
                  src={pomadeImg}
                  alt="Growth Pomade"
                  className="w-32 h-40 md:w-40 md:h-52 object-contain mx-auto"
                  width={160}
                  height={208}
                />
                <p className="font-cinzel text-sm text-foreground text-center mt-3">Growth Pomade</p>
                <p className="font-sans text-xs text-gold text-center">Restore & Activate Growth</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bundle Value Proposition */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[ 
            { image: shampooImg, alt: 'Heritage Shampoo bottle', title: 'Gentle Cleansing', desc: 'Sulfate-free formula removes buildup without stripping natural oils' },
            { image: conditionerImg, alt: 'Voluminous Conditioner bottle', title: 'Deep Nourishment', desc: 'Wodaabe herbs penetrate each strand for lasting moisture' },
            { image: pomadeImg, alt: 'Growth Pomade jar', title: 'Follicle Activation', desc: 'Proprietary blend stimulates dormant follicles for new growth' },
          ].map((item, i) => (
            <div key={i} className="text-center p-6 rounded-xl bg-muted/30 border border-gold/10 hover:border-gold/30 transition-colors">
              <div className="mb-3 flex justify-center">
                <OptimizedImage
                  src={item.image}
                  alt={item.alt}
                  className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-2xl"
                  width={80}
                  height={80}
                />
              </div>
              <h3 className="font-cinzel text-lg text-gold mb-2">{item.title}</h3>
              <p className="font-sans text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Results Gallery */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <p className="font-cinzel text-xl md:text-2xl text-foreground">
              <span className="text-gold">Results</span> That Speak For Themselves
            </p>
            <p className="font-sans text-sm text-muted-foreground mt-2">Real customers. Real transformations. Unedited photos.</p>
          </div>
          
          {/* Scrolling gallery */}
          <div className="relative">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-7 md:gap-3 md:overflow-visible">
              {results.map((result, i) => (
                <div 
                  key={i} 
                  className="flex-shrink-0 w-32 md:w-full snap-center group"
                >
                  <div className="relative overflow-hidden rounded-xl border-2 border-gold/20 group-hover:border-gold/60 transition-all duration-300 aspect-[3/4]">
                    <OptimizedImage
                      src={result.image}
                      alt={result.caption}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      width={300}
                      height={400}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <p className="absolute bottom-2 left-2 right-2 text-xs text-gold font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      {result.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* Gradient edges for mobile scroll indicator */}
            <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-background to-transparent pointer-events-none md:hidden" />
          </div>
        </div>

        {/* Bundle Pricing CTA */}
        <div className="relative p-8 md:p-12 rounded-3xl bg-gradient-to-br from-royal via-background to-royal border-2 border-gold/40 text-center mega-glow">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-2 bg-destructive text-foreground text-sm font-bold rounded-full">
            🔥 MOST POPULAR CHOICE
          </div>
          
          {/* 3-Month Supply Image */}
          <div className="flex justify-center mb-4">
            <div className="bg-background/90 rounded-2xl p-3 border border-gold/40 inline-block">
              <OptimizedImage
                src={fullBundleImg}
                alt="Fulani Hair Gro 3-Month Supply Bundle"
                className="h-32 md:h-40 w-auto object-contain drop-shadow-2xl mx-auto"
                width={400}
                height={200}
              />
            </div>
          </div>

          <h3 className="font-cinzel text-2xl md:text-3xl text-foreground mb-2 mt-4">
            Complete 3-Step Bundle
          </h3>
          <p className="font-sans text-muted-foreground mb-1">3-Month Supply · Buy 2 Get 1 FREE</p>
          <p className="font-sans text-xs text-muted-foreground mb-6">Includes: 3x Shampoo + 3x Conditioner + 3x Pomade + FREE Bonuses</p>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-muted-foreground/80 line-through text-lg">₦214,500</span>
            <span className="font-cinzel text-4xl md:text-5xl text-gold animate-shimmer">₦66,750</span>
            <span className="px-3 py-1 bg-[#B80F66]/20 text-[#B80F66] text-sm font-bold rounded-full">SAVE ₦147,750</span>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a 
              href="#order-form"
              data-form-cta="true"
              {...thankYouPrefetch}
              className="inline-flex items-center gap-3 gold-gradient text-background font-sans text-base tracking-wider uppercase px-10 py-4 rounded-xl font-bold btn-luxury"
            >
              <span>👑</span>
              <span>Order Now</span>
              <span>👑</span>
            </a>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="text-[#B80F66]">✓</span> Pay on Delivery
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#B80F66]">✓</span> 365-Day Guarantee
            </span>
            <span className="flex items-center gap-2">
              <span className="text-[#B80F66]">✓</span> Free Shipping on ₦66,750 &amp; ₦215,000 bundles (pay before delivery orders only)
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
