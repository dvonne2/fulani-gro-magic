import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import { usePrefetch } from '@/hooks/usePrefetch';
import { useAfterHeroLoad } from '@/hooks/useIdleLoad';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
const ReviewForm = lazy(() =>
  import('@/components/reviews/ReviewForm').then((m) => ({ default: m.ReviewForm }))
);
const ReviewsList = lazy(() =>
  import('@/components/reviews/ReviewsList').then((m) => ({ default: m.ReviewsList }))
);

const BASE_PATH = import.meta.env.BASE_URL || '/';

// Lazy load heavy images - they're below the fold
const fulaniDaysImage = `${BASE_PATH}assets/Gemini_Generated_Image_1knotm1knotm1kno-700.webp`;
const fulaniExpertImage = `${BASE_PATH}assets/Gemini_Generated_Image_xt4o0ixt4o0ixt4o.webp`;
const hajiaMaryamTestimonial = `${BASE_PATH}assets/Hajia%20Maryam%20Testimonial.webp`;
const mamaTitiTestimonial1 = `${BASE_PATH}assets/Mama%20Titi%20Testimonial1.webp`;
const mamaTiti2 = `${BASE_PATH}assets/Mama%20Titi%202.webp`;

// Lazy load OrderForm - 38KB component, preload after hero renders
const OrderForm = lazy(() => import('../OrderFormEmbed'));
const BundleSelector = lazy(() =>
  import('./BundleSelector').then((m) => ({ default: m.BundleSelector }))
);
import { PreFormStockWarning } from './PreFormStockWarning';

export const TopStoryBanner = () => {
  const thankYouPrefetch = usePrefetch(() => import('@/pages/ThankYou'));
  const afterHero = useAfterHeroLoad();
  const [expandedIngredient, setExpandedIngredient] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    if (!afterHero) return;
    try {
      void import('../OrderFormEmbed');
    } catch (error) {
      console.error('Order form prefetch failed:', error);
    }
  }, [afterHero]);

  return (
    <section
      id="hero"
      className="bg-white px-4 pt-2 pb-4 mt-0 md:pt-3 md:pb-6 md:mt-0"
      {...thankYouPrefetch}
    >
      <style>{`
        @keyframes aggressiveBurst {
          0%, 5%, 45%, 100% { transform: translateX(0) scale(1); }
          7% { transform: translateX(-8px) rotate(-4deg) scale(1.03); }
          10% { transform: translateX(8px) rotate(4deg) scale(1.03); }
          13% { transform: translateX(-8px) rotate(-4deg) scale(1.03); }
          16% { transform: translateX(8px) rotate(4deg) scale(1.03); }
          19% { transform: translateX(-6px) rotate(-3deg) scale(1.02); }
          22% { transform: translateX(6px) rotate(3deg) scale(1.02); }
          25% { transform: translateX(-4px) rotate(-2deg) scale(1.02); }
          28% { transform: translateX(4px) rotate(2deg) scale(1.02); }
          31% { transform: translateY(-6px) scale(1.05); }
          34% { transform: translateY(3px) scale(1.03); }
          37% { transform: translateY(-3px) scale(1.04); }
          40% { transform: translateY(1px) scale(1); }
        }
        .aggressive-cta {
          animation: aggressiveBurst 5s ease-in-out infinite;
          will-change: transform;
          transform: translateZ(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .aggressive-cta { animation: none; }
        }
      `}</style>

      <div className="mx-auto text-center">
        {/* Bundle Image */}
        <div className="mt-6 w-full -mx-4 md:mx-auto md:max-w-4xl aspect-[1055/1491] bg-gray-50">
          <picture className="block w-full">
            <source
              media="(max-width: 767px)"
              srcSet={`${BASE_PATH}assets/newhero-665.webp`}
              type="image/webp"
            />
            <img
              src={`${BASE_PATH}assets/newhero.webp`}
              alt="Product Bundle"
              className="w-full h-auto object-contain"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              width="1055"
              height="1491"
            />
          </picture>
        </div>

        <div className="mt-10 text-center">
          <a
            href="#order-form"
            data-form-cta="true"
            className="flex items-center justify-center gap-2 bg-[#FF0000] text-white font-semibold px-10 md:px-14 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform w-full cta-with-arrow aggressive-cta"
            style={{ fontSize: '20px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> TAKE ACTION NOW
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-3 px-2">
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-700 whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5ec239" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            100% Genuine Product — Not Sold In Stores
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-700 whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5ec239" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Pay On Delivery Available
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-700 whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5ec239" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            1–3 Day Nationwide Delivery
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-gray-700 whitespace-nowrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#5ec239" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            30-Day Money-Back Guarantee
          </span>
        </div>

        <div className="mt-6 max-w-3xl mx-auto text-center space-y-4">
          <h2 className="font-black text-2xl md:text-4xl text-black uppercase tracking-tight leading-tight">
            INTRODUCING THE COMPLETE GROWTH SYSTEM THAT WORKS WITH YOUR HAIR
          </h2>
          <p className="text-base md:text-lg text-black leading-relaxed">
            Made from my grandmother's special blend of traditional herbs from Maiduguri, Northern Nigeria. For years, thousands of women and men across Nigeria have trusted Fulani Hair Gro to help keep their <strong>scalp clean</strong>, <strong>fight dandruff</strong>, <strong>reduce hair breakage</strong>, and <strong>enjoy fuller, longer, healthier hair</strong>. That's because every product in the Fulani Hair Gro System has a unique purpose. <strong>Together,</strong> they work in harmony to <strong>deliver better results</strong> than using a single product alone.
          </p>
        </div>

        {/* 3-Step System Preview */}
        <div className="w-full max-w-5xl mx-auto mt-10 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {[
              { img: `${BASE_PATH}assets/Shampoo1.webp`, label: 'Fulani Hair Gro™ Shampoo', price: 14999 },
              { img: `${BASE_PATH}assets/Conditioner2.webp`, label: 'Fulani Hair Gro™ Conditioner', price: 14999 },
              { img: `${BASE_PATH}assets/pomade3.webp`, label: 'Fulani Hair Gro™ Hair Pomade', price: 17999 },
            ].map((item, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="mx-auto w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden bg-gray-50 shadow-md">
                  <img
                    src={item.img}
                    alt={item.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    width="208"
                    height="208"
                  />
                </div>
                <p className="text-base md:text-lg font-semibold text-gray-900">{item.label}</p>
                <p className="text-lg md:text-xl font-bold text-[#B80F66]">₦{item.price.toLocaleString('en-NG')}</p>
                {item.label === 'Fulani Hair Gro™ Shampoo' && (
                  <a
                    href="#bundle-selector"
                    onClick={(e) => { e.preventDefault(); const el = document.getElementById('bundle-selector'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    data-form-cta="true"
                    className="inline-block bg-[#5ec239] text-white font-semibold px-6 py-2 rounded-lg text-sm hover:scale-105 transition-transform mt-1"
                  >
                    Order Now
                  </a>
                )}
                {item.label === 'Fulani Hair Gro™ Conditioner' && (
                  <a
                    href="#bundle-selector"
                    onClick={(e) => { e.preventDefault(); const el = document.getElementById('bundle-selector'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    data-form-cta="true"
                    className="inline-block bg-[#5ec239] text-white font-semibold px-6 py-2 rounded-lg text-sm hover:scale-105 transition-transform mt-1"
                  >
                    Order Now
                  </a>
                )}
                {item.label === 'Fulani Hair Gro™ Hair Pomade' && (
                  <a
                    href="#bundle-selector"
                    onClick={(e) => { e.preventDefault(); const el = document.getElementById('bundle-selector'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }}
                    data-form-cta="true"
                    className="inline-block bg-[#5ec239] text-white font-semibold px-6 py-2 rounded-lg text-sm hover:scale-105 transition-transform mt-1"
                  >
                    Order Now
                  </a>
                )}
                {item.label === 'Fulani Hair Gro™ Shampoo' && (
                  <div className="mt-3 text-left">
                    <h3 className="font-sans font-bold text-sm md:text-base text-gray-900 mb-2">
                      Why Your Hair Needs Our Shampoo
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      You can pour oil on your hair every single day...
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      If your scalp is unhealthy, don&apos;t expect healthy hair growth.
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Your hair grows from your scalp. That&apos;s why the first step to healthier, longer-looking hair is keeping your scalp clean and healthy.
                    </p>
                  </div>
                )}

                {item.label === 'Fulani Hair Gro™ Conditioner' && (
                  <div className="mt-3 text-left">
                    <h3 className="font-sans font-bold text-sm md:text-base text-gray-900 mb-2">
                      Why Your Hair Needs Our Conditioner
                    </h3>
                    <h4 className="font-sans font-bold text-sm text-gray-800 mb-1">
                      Hair Doesn&apos;t Stop Growing...
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      <strong>It Breaks.</strong>
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      If your hair snaps every time you comb, wash or style it, you&apos;ll never enjoy the length you&apos;ve worked so hard to grow.
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      That&apos;s why Fulani Hair Gro Conditioner helps soften, nourish and strengthen your hair—helping reduce breakage so you can retain more of your natural length.
                    </p>
                  </div>
                )}

                {item.label === 'Fulani Hair Gro™ Hair Pomade' && (
                  <div className="mt-3 text-left">
                    <h3 className="font-sans font-bold text-sm md:text-base text-gray-900 mb-2">
                      Why Your Hair Needs Our Pomade
                    </h3>
                    <h4 className="font-sans font-bold text-sm text-gray-800 mb-1">
                      Hair Needs To Be Fed
                    </h4>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      A clean scalp is only the beginning.
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      Strong, healthy-looking hair needs daily nourishment to help support healthy growth.
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      Without the right nourishment, hair can become dry, weak and prone to breakage.
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      That&apos;s why Fulani Hair Gro Pomade is carefully formulated to nourish your scalp and hair follicle, helping support longer, fuller, healthier-looking hair.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Hero CTA moved above the growth system heading */}

        {/* Complete System Explainer */}
        <div className="mt-20 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-black text-2xl md:text-3xl text-black uppercase tracking-tight mb-6">
            See ehn!! Healthy Hair Needs More Than One Miracle Product
          </h2>
          <ul className="text-left max-w-2xl mx-auto space-y-3 mb-6 text-lg text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-[#5ec239] text-xl">✔</span>
              <span>Oil will not cleanse your scalp.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5ec239] text-xl">✔</span>
              <span>Shampoo will not nourish and protect your hair</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#5ec239] text-xl">✔</span>
              <span>One cream can&apos;t solve every cause of hair breakage.</span>
            </li>
          </ul>
          <p className="text-lg md:text-xl text-gray-700">
            You need a complete combination. That&apos;s why Fulani Hair Gro is a complete hair growth system. Each product has a unique purpose, and together they help support longer, fuller, stronger, healthier-looking hair.
          </p>
        </div>

        {/* Hair Concerns Cards */}
        <div className="mt-20 max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-black text-2xl md:text-3xl text-black uppercase tracking-tight mb-3">
            Is This You?
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            If you're struggling with any of these hair concerns, you're in the right place
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {[
              {
                title: 'Thinning edges',
                benefit: 'Regrow edges with daily use',
              },
              {
                title: 'Bald patches',
                benefit: 'Stimulates dormant hair follicles',
              },
              {
                title: 'Postpartum hair loss',
                benefit: 'Gentle formula safe for hormonal recovery',
              },
              {
                title: 'Slow hair growth',
                benefit: 'See visible results in 8–12 weeks',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-lg text-left"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FCE8E8] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C62828" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-gray-900 text-base md:text-lg">{item.title}</p>
                  <p className="flex items-center gap-1 text-[#B80F66] text-sm md:text-base font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#B80F66" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3v18"/>
                      <path d="M5 10l7-7 7 7"/>
                      <path d="M5 14l7 7 7-7"/>
                    </svg>
                    {item.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HOW IT WORKS Section */}
        <div className="mt-8 text-center">
          <strong 
            className="block"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Montserrat, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '31px',
              fontWeight: '700',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '3px solid #DAA520',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#FFF8DC',
              display: 'inline-block',
              width: 'auto',
              margin: '0 auto'
            }}
          >
            HOW IT WORKS
          </strong>

          <div className="mt-8 -mx-4 md:mx-auto" style={{ maxWidth: '1000px' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <img
                src={`${BASE_PATH}assets/7.webp`}
                alt="Before Fulani Hair Gro"
                className="w-full h-auto"
                style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                width="600"
                height="900"
                loading="lazy"
                decoding="async"
              />
              <img
                src={`${BASE_PATH}assets/8.webp`}
                alt="After Fulani Hair Gro"
                className="w-full h-auto"
                style={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                width="600"
                height="600"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Your Journey Section */}
          {/* Milestone Cards */}
          <div className="mt-8" style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '24px',
              padding: '0 16px'
            }}>
              
              {/* Card 1 - After 1 Month */}
              <div 
                style={{
                  backgroundColor: '#F5E6D3', // Tan/sandy background
                  border: '2px solid #D4A574',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  color: '#DAA520', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  After 1 Month
                </div>
                <h3 style={{ 
                  color: '#3E2723', // Dark brown
                  fontSize: '20px', 
                  fontWeight: '700',
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}>
                  Hair Begins to Transform
                </h3>
                <ul style={{ 
                  color: '#4A4A4A',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  margin: '0',
                  paddingLeft: '20px'
                }}>
                  <li>Your hair length and density will start to improve</li>
                  <li>You will start to get more compliments from people</li>
                  <li>Edges will start to grow</li>
                  <li>Hair will be more hydrated</li>
                  <li>Reduction of hair breakage will start to happen</li>
                </ul>
              </div>

              {/* Card 2 - After 3 Months */}
              <div 
                style={{
                  backgroundColor: '#F5E6D3', // Tan/sandy background
                  border: '2px solid #D4A574',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  color: '#DAA520', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  After 3 Months
                </div>
                <h3 style={{ 
                  color: '#3E2723', // Dark brown
                  fontSize: '20px', 
                  fontWeight: '700',
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}>
                  Visible Dramatic Results
                </h3>
                <ul style={{ 
                  color: '#4A4A4A',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  margin: '0',
                  paddingLeft: '20px'
                }}>
                  <li>Increase in length, density and thickness</li>
                  <li>You will notice you are more confident about your hair</li>
                  <li>Dandruff is gone</li>
                  <li>Alot of reduction in hair breakage</li>
                  <li>Even fuller hair roots</li>
                  <li>Hair grows 2-3x faster than normal</li>
                </ul>
              </div>

              {/* Card 3 - In 12 Months */}
              <div 
                style={{
                  backgroundColor: '#F5E6D3', // Tan/sandy background
                  border: '2px solid #D4A574',
                  borderRadius: '12px',
                  padding: '24px',
                  textAlign: 'center',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              >
                <div style={{ 
                  color: '#DAA520', 
                  fontSize: '18px', 
                  fontWeight: '700',
                  marginBottom: '8px',
                  textTransform: 'uppercase'
                }}>
                  In 12 Months
                </div>
                <h3 style={{ 
                  color: '#3E2723', // Dark brown
                  fontSize: '20px', 
                  fontWeight: '700',
                  marginBottom: '16px',
                  lineHeight: '1.3'
                }}>
                  Your Hair, Transformed Forever
                </h3>
                <ul style={{ 
                  color: '#4A4A4A',
                  fontSize: '14px',
                  lineHeight: '1.6',
                  textAlign: 'left',
                  margin: '0',
                  paddingLeft: '20px'
                }}>
                  <li>You won't need to use haircare products as often</li>
                  <li>You'll flaunt your natural long, thick, soft hair</li>
                  <li>You'll feel younger and more confident</li>
                  <li>No more itching of scalp</li>
                  <li>Dandruff free guaranteed</li>
                </ul>
              </div>

            </div>
          </div>

        {/* HOW TO USE Section */}
        <div className="mt-8 text-center">
          <strong 
            className="block"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Montserrat, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '24px',
              fontWeight: '700',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecoration: 'none'
            }}
          >
            HOW TO USE:
          </strong>
          
          <div 
            className="mt-6 text-left"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Montserrat, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '16px',
              fontWeight: '400',
              textTransform: 'none',
              textDecoration: 'none',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>Shampoo:</strong><br/>
              Apply generously to scalp and hair. Leave for 3–5 minutes. Rinse thoroughly.
            </p>
            
            <p style={{ margin: '0 0 12px 0' }}>
              <strong>Conditioner:</strong><br/>
              Apply to damp hair. Leave for 3–5 minutes. Rinse out.
            </p>
            
            <p style={{ margin: '0 0 0 0' }}>
              <strong>Pomade:</strong><br/>
              Apply to scalp once daily. Massage gently. Do not rinse.
            </p>
          </div>
        </div>

                  </div>

        {/* Customer Reviews Summary */}
        <div className="mt-12 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-8">PROVEN RESULTS</h2>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            {/* Rating Score */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex items-center gap-3">
                <span className="text-6xl md:text-7xl font-light text-black">4.8</span>
                <div className="flex text-black">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-1">Based on 264 reviews</p>
            </div>

            {/* Rating Breakdown */}
            <div className="w-full max-w-xs space-y-2">
              {[
                { stars: 5, count: 223 },
                { stars: 4, count: 36 },
                { stars: 3, count: 5 },
                { stars: 2, count: 0 },
                { stars: 1, count: 0 },
              ].map((item) => (
                <div key={item.stars} className="flex items-center gap-2 text-sm">
                  <span className="flex items-center gap-1 w-8">
                    {item.stars} <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-black"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-black rounded-full"
                      style={{ width: `${(item.count / 264) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-gray-600">{item.count}</span>
                </div>
              ))}
            </div>

            {/* Write A Review Button */}
            <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
              <DialogTrigger asChild>
                <button
                  data-review-trigger
                  className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform"
                >
                  Write A Review
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-light text-left">Share your thoughts</DialogTitle>
                  <DialogDescription className="text-left">* required fields</DialogDescription>
                </DialogHeader>

                {reviewDialogOpen && (
                  <Suspense fallback={null}>
                    <ReviewForm onSuccess={() => setReviewDialogOpen(false)} />
                  </Suspense>
                )}
              </DialogContent>
            </Dialog>

            </div>
        </div>

        {/* ORDER FORM */}
        <div id="order-form-container" className="px-4 md:px-6 max-w-4xl mx-auto mt-6">
            <section className="bg-white px-4 md:px-9 py-9 text-center border-y border-gray-200 relative overflow-hidden">
              <div className="max-w-[550px] mx-auto mb-6">
                {/* Customers say summary */}
                <div className="mb-6 text-left border-b border-gray-200 pb-6">
                  <h3
                    style={{
                      color: '#A1A1AA',
                      fontFamily: 'Montserrat, HelveticaNeue, "Helvetica Neue", sans-serif',
                      fontSize: '26px',
                      fontWeight: '300',
                      textAlign: 'left',
                      textTransform: 'none',
                      marginBottom: '10px'
                    }}
                  >
                    Customers say
                  </h3>
                  <p
                    style={{
                      color: '#A1A1AA',
                      fontFamily: 'Montserrat, HelveticaNeue, "Helvetica Neue", sans-serif',
                      fontSize: '12px',
                      fontWeight: '400',
                      textAlign: 'left',
                      marginBottom: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      gap: '5px'
                    }}
                  >
                    <span style={{ fontSize: '14px' }}>✨</span> Generated from customer reviews.
                  </p>
                  <p
                    style={{
                      color: '#333333',
                      fontFamily: 'Montserrat, HelveticaNeue, "Helvetica Neue", sans-serif',
                      fontSize: '14px',
                      fontWeight: '400',
                      textAlign: 'left',
                      lineHeight: '1.6',
                      marginBottom: '20px'
                    }}
                  >
                    Customers consistently praise Fulani Hair Gro™ for helping them achieve fuller, longer, healthier-looking hair. Many report thicker-looking hair, less breakage, improved length retention, and fuller edges after using the complete system consistently. Reviewers also mention feeling more confident as friends and family begin noticing the difference.
                  </p>
                  <button
                    style={{
                      border: '1px solid #A1A1AA',
                      borderRadius: '9999px',
                      padding: '8px 16px',
                      color: '#6B7280',
                      fontFamily: 'Montserrat, HelveticaNeue, "Helvetica Neue", sans-serif',
                      fontSize: '13px',
                      fontWeight: '400',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    Read summary by topics
                  </button>

                </div>

                <div className="grid grid-cols-1 gap-2">
                </div>
              </div>

              {afterHero ? (
                <Suspense fallback={<div className="min-h-[200px]" />}>
                  <BundleSelector />
                </Suspense>
              ) : (
                <div className="min-h-[200px]" />
              )}
              
              <PreFormStockWarning />
              
              <div id="order-form">
                {afterHero ? (
                  <Suspense fallback={<div className="min-h-[400px] flex items-center justify-center"><span className="text-gold font-semibold">Loading order form...</span></div>}>
                    <OrderForm />
                  </Suspense>
                ) : (
                  <div className="min-h-[400px]" />
                )}
              </div>
            </section>
          </div>

        <div className="mt-8 text-center">
          <strong 
            className="block"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Montserrat, HelveticaNeue, "Helvetica Neue", sans-serif',
              fontSize: '31px',
              fontWeight: '700',
              textAlign: 'center',
              textTransform: 'uppercase',
              textDecoration: 'none',
              border: '3px solid #DAA520',
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#FFF8DC',
              display: 'inline-block',
              width: 'auto',
              margin: '0 auto'
            }}
          >
            WHY CHOOSE FULANI HAIR GRO?
          </strong>
          
          <div className="border border-[#E6E6E6] px-6 md:px-14 py-8 md:py-10 mt-4 mb-4">
            <blockquote className="text-center">
              <p className="leading-tight text-[#B80F66] uppercase font-bold relative" style={{ fontSize: '14px' }}>
                <span className="absolute -left-4 -top-2 text-4xl text-[#B80F66] opacity-30">"</span>
                Trusted by Thousands of Women Who Successfully Regrew Their Hair Edges with FULANI HAIR GRO
                <span className="absolute -right-4 -bottom-2 text-4xl text-[#B80F66] opacity-30">"</span>
              </p>
            </blockquote>
          </div>
          
        {/* Hajara Personal Story */}
        <p
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          My name is Hajara and I come from the Fulani lineage of women who have kept the secret of growing long, healthy African hair very close to their hearts.

I was born and bred in Ogbomosho, Nigeria, but my family comes from the Fula tribe bordering Nigeria and Chad. As a little girl, I watched the women in my family use organic and traditional beauty secrets to care for their hair and skin. But me being a tomboy, I never bothered to learn those secrets (I regret it… lol).
        </p>


        <p
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Fast forward after my second baby… ah.

My hair disgraced me.

My edges vanished. Both sides smooth like I polished it. Proper Iya eko situation. My scalp was itching like crazy. The dandruff was not small flakes o. The type that if you scratch, blood will almost come out. My hair became thin. Flat. No volume.

I panicked.

I bought premium shampoos. I did treatments. I went to my trichologist friend (yes, the same one that is now my co-founder). She checked everything and said it was hormones. She said stop wigs. Stop combing too much. Eat vegetables.

I did all that.
        </p>

        <p
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Still nothing.

By the time I turned 33, my grandfather passed. We travelled to Maiduguri for the burial. Very emotional time.

Two days after the burial, my grandmother — 72 years old o — woke me up early morning and handed me one local shampoo and one pomade.

She just said, "Use it once a week. Don't stop."

That's it.

No big explanation.

I said okay.

I started using it consistently.

Before I knew it, the itching reduced. The dandruff cleared. Small small hairs started showing. My edges started filling up again. My hair became thicker.

That was when I realized… these women were not playing all these years.

With my grandmother's blessing, I carried that same herbal combination and worked with my co-founder (London-trained trichologist) to refine it properly with science.

So when you choose Fulani Hair Gro, you're not buying vibes.

You're using something that:

Fulani women have used for generations.
I personally used when my own hair was failing me.
And we have now refined with proper scientific knowledge.

This thing is not hype.
        </p>

        <p
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          It's proven heritage.
        </p>

        <p
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          And if it brought my edges back from the dead, imagine what it can do for you.
        </p>

        <p
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          — Hajara 😌
        </p>

        {/* Additional CTA Button */}
        <div className="mt-8 text-center">
          <a
            href="#order-form"
            data-form-cta="true"
            className="flex items-center justify-center gap-2 bg-[#5ec239] text-white font-semibold px-10 md:px-14 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform w-full"
            style={{ fontSize: '20px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> ORDER NOW
          </a>
        </div>
        
        
                
        {/* Product Information */}
        
        
                
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, HelveticaNeue, "Helvetica Neue", sans-serif',
            fontSize: '31px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'uppercase',
            textDecoration: 'none'
          }}
        >
          Why Women Are Switching to Fulani Hair Gro
        </strong>
        
        <strong 
          className="mt-6 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '700',
            textAlign: 'left',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          FULANI HAIR GRO PROPRIETARY BLEND
          <br />
          (family secret)
        </strong>

        <p
          className="mt-6"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'left',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          These group of herbs are plucked from the bushes in Maiduguri and has been a heirloom amongst the women in my Fulani family for centuries. People think Fulani women have naturally long hair and that is partly the truth but any woman can have naturally long hair if she uses the right herbs in her hair.
        </p>
        
        {/* Accordion Item 1: Mung Bean & Red Clover */}
        <div className="mt-4">
          <button
            onClick={() => setExpandedIngredient(expandedIngredient === 'mung' ? null : 'mung')}
            style={{
              width: '100%',
              background: '#F5F5F5',
              border: '2px solid #DAA520',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left'
            }}
          >
            <strong style={{
              color: '#0A0A0A',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '16px',
              fontWeight: '700',
              textTransform: 'none',
              textDecoration: 'none'
            }}>
              MUNG BEAN & RED CLOVER
            </strong>
            <span style={{
              fontSize: '20px',
              color: '#DAA520',
              fontWeight: '700'
            }}>
              {expandedIngredient === 'mung' ? '▲' : '▼'}
            </span>
          </button>
          {expandedIngredient === 'mung' && (
            <div style={{ marginTop: '16px' }}>
              <div className="flex justify-center">
                <img
                  src={`${BASE_PATH}assets/MungBeanandRedClover_2_75x.webp`}
                  alt="Mung Bean and Red Clover"
                  className="w-auto h-auto"
                  style={{ maxWidth: '900px !important', width: '900px !important' }}
                  loading="lazy"
                  decoding="async"
                  width="900"
                  height="675"
                />
              </div>
              <p
                className="mt-6"
                style={{
                  color: '#0A0A0A',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '16px',
                  fontWeight: '400',
                  textAlign: 'center',
                  lineHeight: '1.6',
                  textDecoration: 'none',
                  textTransform: 'none'
                }}
              >
                In clinical studies, shown to help inhibit the production of hair damaging DHT and and inflammatory cytokines while fortifying the cell matrix of the derma papilla*
              </p>
            </div>
          )}
        </div>

        {/* Accordion Item 2: Curcumin */}
        <div className="mt-4">
          <button
            onClick={() => setExpandedIngredient(expandedIngredient === 'curcumin' ? null : 'curcumin')}
            style={{
              width: '100%',
              background: '#F5F5F5',
              border: '2px solid #DAA520',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left'
            }}
          >
            <strong style={{
              color: '#0A0A0A',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '16px',
              fontWeight: '700',
              textTransform: 'none',
              textDecoration: 'none'
            }}>
              CURCUMIN
            </strong>
            <span style={{
              fontSize: '20px',
              color: '#DAA520',
              fontWeight: '700'
            }}>
              {expandedIngredient === 'curcumin' ? '▲' : '▼'}
            </span>
          </button>
          {expandedIngredient === 'curcumin' && (
            <div style={{ marginTop: '16px' }}>
              <div className="flex justify-center">
                <img
                  src={`${BASE_PATH}assets/Turmeric_1_75x.webp`}
                  alt="Turmeric"
                  className="w-auto h-auto"
                  style={{ maxWidth: '900px !important', width: '900px !important' }}
                  loading="lazy"
                  decoding="async"
                  width="900"
                  height="675"
                />
              </div>
              <p
                className="mt-6"
                style={{
                  color: '#0A0A0A',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '16px',
                  fontWeight: '400',
                  textAlign: 'center',
                  lineHeight: '1.6',
                  textDecoration: 'none',
                  textTransform: 'none'
                }}
              >
                In clinical studies, highly concentrated proteins secreted from the stem cells of the turmeric root have been shown to increase the delivery of 1GF-1 & miRNA-31 to the derma papilla which helps lengthen the hair's growth (anagen) phase.*
              </p>
            </div>
          )}
        </div>

        {/* Accordion Item 3: Nicotiana Benthamiana */}
        <div className="mt-4">
          <button
            onClick={() => setExpandedIngredient(expandedIngredient === 'nicotiana' ? null : 'nicotiana')}
            style={{
              width: '100%',
              background: '#F5F5F5',
              border: '2px solid #DAA520',
              borderRadius: '8px',
              padding: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textAlign: 'left'
            }}
          >
            <strong style={{
              color: '#0A0A0A',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '16px',
              fontWeight: '700',
              textTransform: 'none',
              textDecoration: 'none'
            }}>
              NICOTIANA BENTHAMIANA
            </strong>
            <span style={{
              fontSize: '20px',
              color: '#DAA520',
              fontWeight: '700'
            }}>
              {expandedIngredient === 'nicotiana' ? '▲' : '▼'}
            </span>
          </button>
          {expandedIngredient === 'nicotiana' && (
            <div style={{ marginTop: '16px' }}>
              <div className="flex justify-center overflow-visible">
                <img
                  src={`${BASE_PATH}assets/Tobacco_1_75x.webp`}
                  alt="Tobacco"
                  className="w-auto h-auto"
                  style={{ 
                    maxWidth: '2500px !important', 
                    width: '2500px !important',
                    minWidth: '2000px !important',
                    height: 'auto !important',
                    display: 'block !important',
                    transform: 'scale(1.5) !important'
                  }}
                  loading="lazy"
                  decoding="async"
                  width="2500"
                  height="1875"
                />
              </div>
              <p
                className="mt-6"
                style={{
                  color: '#0A0A0A',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '16px',
                  fontWeight: '400',
                  textAlign: 'center',
                  lineHeight: '1.6',
                  textDecoration: 'none',
                  textTransform: 'none'
                }}
              >
                plant-based proteins cultivated and harvested from northern Nigeria have been shown to significantly increase the density of hair roots (by up to 50%)*.
              </p>
            </div>
          )}
        </div>
        
        <strong 
          className="mt-4 block"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Cinzel, serif',
            fontSize: '20px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          Size
        </strong>

        <p
          className="mt-4"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Net Shampoo Content: 500ml
        </p>

        <p
          className="mt-4"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Net Conditioner Content: 500ml
        </p>

        <p
          className="mt-4"
          style={{
            color: '#0A0A0A',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '400',
            textAlign: 'center',
            lineHeight: '1.6',
            textDecoration: 'none',
            textTransform: 'none'
          }}
        >
          Net Pomade Content: 150ml
        </p>

        
                
        <strong 
          className="mt-6 block"
          style={{
            color: '#FFFFFF',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '16px',
            fontWeight: '700',
            textAlign: 'center',
            textTransform: 'none',
            textDecoration: 'none'
          }}
        >
          #LOVEFULANIHAIRGRO
        </strong>

        {/* Our Happy Customers Section */}
        <div className="mt-8 mb-5">
          <h2 
            className="text-center mb-4"
            style={{
              color: '#0A0A0A',
              fontFamily: 'Cinzel, serif',
              fontSize: '32px',
              fontWeight: '700',
              textAlign: 'center',
              textTransform: 'none',
              textDecoration: 'none',
              lineHeight: '1.2'
            }}
          >
            Our Happy Customers Who Love FULANI HAIR GRO
          </h2>
          
          <p 
            className="text-center"
            style={{
              color: '#666',
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '18px',
              fontWeight: '400',
              textAlign: 'center',
              lineHeight: '1.5',
              marginTop: '8px',
              marginBottom: '24px'
            }}
          >
            Real Reviews From Happy Customers
          </p>

          {/* 3 Customer Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5">
            {/* Customer Box 1 - Video */}
            <div style={{
              background: '#fff',
              border: '2px solid #DAA520',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: 'none'
            }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <LiteYouTubeEmbed
                  id="myJDa7s6O5w"
                  title="Fulani Hair Gro Results Video"
                  thumbnail={`${BASE_PATH}assets/yt-thumb-myJDa7s6O5w.webp`}
                  webp
                />
              </div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '18px',
                fontWeight: '700',
                color: '#0A0A0A',
                marginBottom: '8px'
              }}>
                Customer Video Review
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5',
                fontStyle: 'italic'
              }}>
                "Watch real customer testimonials and see the amazing results for yourself!"
              </p>
            </div>

            {/* Customer Box 2 - Video */}
            <div style={{
              background: '#fff',
              border: '2px solid #DAA520',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: 'none'
            }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <LiteYouTubeEmbed
                  id="xJ4vGH2i48g"
                  title="Fulani Hair Gro Customer Testimonial"
                  thumbnail={`${BASE_PATH}assets/yt-thumb-xJ4vGH2i48g.webp`}
                  webp
                />
              </div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '18px',
                fontWeight: '700',
                color: '#0A0A0A',
                marginBottom: '8px'
              }}>
                Customer Success Story
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5',
                fontStyle: 'italic'
              }}>
                "See how Fulani Hair Gro transformed this customer's hair growth journey!"
              </p>
            </div>

            {/* Customer Box 3 - Video */}
            <div style={{
              background: '#fff',
              border: '2px solid #DAA520',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: 'none'
            }}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <LiteYouTubeEmbed
                  id="LNkhqS3-Kxo"
                  title="Fulani Hair Gro Before and After"
                  thumbnail={`${BASE_PATH}assets/yt-thumb-LNkhqS3-Kxo.webp`}
                  webp
                />
              </div>
              <h3 style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '18px',
                fontWeight: '700',
                color: '#0A0A0A',
                marginBottom: '8px'
              }}>
                Customer Transformation
              </h3>
              <p style={{
                fontFamily: 'Montserrat, sans-serif',
                fontSize: '14px',
                color: '#666',
                lineHeight: '1.5',
                fontStyle: 'italic'
              }}>
                "Watch this incredible hair transformation journey with Fulani Hair Gro!"
              </p>
            </div>
          </div>
        </div>

        {/* Green CTA Button before WHAT IS THE FULANI HAIR GRO? */}
        <div className="mt-6 text-center">
          <a
            href="#order-form"
            data-form-cta="true"
            className="flex items-center justify-center gap-2 bg-[#5ec239] text-white font-semibold px-10 md:px-14 py-4 rounded-xl shadow-lg hover:scale-105 transition-transform w-full"
            style={{ fontSize: '20px' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> ORDER NOW
          </a>
        </div>

                
        {/* Real Results Section */}
        <div style={{ marginTop: '31px', marginBottom: '21px' }}>
          <h2 style={{
            color: '#0A0A0A',
            fontFamily: 'Cinzel, serif',
            fontSize: '32px',
            fontWeight: '700',
            textAlign: 'center',
            marginBottom: '32px',
            textTransform: 'none'
          }}>
            Real Results From Real Women And Men
          </h2>
          
          <div>
            
            
            
            
            
            {/* Card 6: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/result2.webp`}
                  alt="Before and After Results 6"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="400"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Card 7: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/result3.webp`}
                  alt="Before and After Results 7"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="400"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>

            {/* Card 8: Split image with before/after labels */}
            <div style={{
              background: '#ffffff',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ position: 'relative' }}>
                <img
                  src={`${BASE_PATH}assets/result4.webp`}
                  alt="Before and After Results 8"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="400"
                />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  left: '0',
                  right: '0',
                  display: 'flex',
                  height: '40px'
                }}>
                  <div style={{
                    flex: '1',
                    background: '#F5E6D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#3E2723'
                  }}>
                    BEFORE
                  </div>
                  <div style={{
                    flex: '1',
                    background: '#DAA520',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff'
                  }}>
                    AFTER
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button before The Miracle */}
        <div className="mt-8 flex justify-center">
          <button 
            onClick={() => {
              const orderForm = document.getElementById('order-form');
              if (orderForm) {
                orderForm.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-transform duration-300 hover:scale-105 shadow-lg text-lg"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}
          >
            Click Here to Start Your Hair Recovery Journey →
          </button>
        </div>
        
        
        {/* WhatsApp Testimonials */}
        <div className="mt-6 max-w-5xl mx-auto">
          <div className="border-2 border-red-500 border-dotted rounded-2xl py-6 px-3 md:px-6">
            <p className="font-sans text-sm md:text-base font-semibold text-black mb-5 text-center">
              Reviews From Our Happy Nigerian Women
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="rounded-xl overflow-hidden p-3 bg-white border border-gray-200 shadow-sm">
                <img
                  src={hajiaMaryamTestimonial}
                  alt="WhatsApp testimonial from Hajia Maryam about her edges and confidence"
                  className="w-full h-auto object-contain"
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="800"
                />
              </div>
              <div className="rounded-xl overflow-hidden p-3 bg-white border border-gray-200 shadow-sm">
                <img
                  src={mamaTitiTestimonial1}
                  alt="WhatsApp testimonial from Mama Titi about her hair transformation"
                  className="w-full h-auto object-contain"
                  width={391}
                  height={709}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="rounded-xl overflow-hidden p-3 bg-white border border-gray-200 shadow-sm">
                <img
                  src={mamaTiti2}
                  alt="Second WhatsApp testimonial from Mama Titi showing continued results"
                  className="w-full h-auto object-contain"
                  width={391}
                  height={709}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        
        
        <section className="mt-6 text-center">
          {/* Expert Image */}
          <div className="mt-6 flex justify-center">
            <img
              src={`${BASE_PATH}assets/Gemini_Generated_Image_xt4o0ixt4o0ixt4o.webp`}
              alt="Expert"
              className="w-auto h-auto"
              style={{ maxWidth: '900px !important', width: '900px !important' }}
              loading="lazy"
              decoding="async"
              width="900"
              height="675"
            />
          </div>

          <h2 className="jandes-headline text-2xl md:text-3xl text-[#0c7a2e] mb-6">
            A Consultant Trichologist's honest opinion on Fulani Hair Gro
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <p className="jandes-quote leading-relaxed text-black">
              My name is <span className="font-semibold">Dr. Adaeze Nwosu</span>. I'm a
              <span className="font-semibold"> Consultant Trichologist at LUTH</span>, and I've spent years helping
              women with hair loss.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              Every week, I see the same heartbreak—women sitting in my office, avoiding eye contact, ashamed to show
              me their edges. They've tried expensive treatments. They've tried every product on the market. Nothing
              worked. Some are ready to give up completely.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              So when I first heard about Fulani Hair Gro, I was skeptical. Very skeptical. I've seen countless
              'miracle' hair products come and go. An herbal formula promising visible results? I've heard that story
              before.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              But something made me curious—the 400-year history behind it. This wasn't some lab-created formula. It
              was ancestral knowledge, passed down through generations of Fulani women known for their hair.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              I decided to recommend it to a few patients who had tried everything else. What did they have to lose?
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              Within weeks, I started getting calls. Photos. Thank-you messages. Women who had given up hope were
              seeing new growth along their hairlines. Edges that had been bare for years were filling in.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              I don't endorse products lightly. My reputation depends on results, not promises. But Fulani Hair Gro
              earned my recommendation—and it continues to prove me right with every patient I refer.
            </p>
            <p className="jandes-quote leading-relaxed text-black">
              If you're struggling with thinning edges and nothing has worked, I understand your frustration. But
              don't give up yet. This one is different.
            </p>
          </div>
        </section>
      </div>
    </div>
    </section>
  );
};
