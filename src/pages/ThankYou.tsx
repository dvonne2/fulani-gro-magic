import { useEffect, useRef, useState } from 'react';
import { Check, Package, Truck, Phone, CreditCard, Crown, Download, Play, Target, MessageCircle, Mail, PhoneCall, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fireTikTokPurchase } from '@/utils/tiktokTracking';
import { WHATSAPP_ORDER_HELP_LINK, WHATSAPP_LINK, PHONE_DISPLAY, PHONE_TEL } from '@/config/api';

import result1 from '@/assets-optimized/results/result-1.webp';
import result2 from '@/assets-optimized/results/result-2.webp';
import result3 from '@/assets-optimized/results/result-3.webp';
import shampoo from '@/assets-optimized/products/shampoo.webp';
import conditioner from '@/assets-optimized/products/conditioner.webp';
import pomade from '@/assets-optimized/products/pomade.webp';
import founderImg from '@/assets-optimized/products/hajara.webp';
import amina from '@/assets-optimized/testimonials/amina.webp';
import blessing from '@/assets-optimized/testimonials/blessing.webp';

// Dynamic package mapping based on actual package names from OrderFormEmbed
const packageProducts: Record<string, { title: string; items: { name: string; qty: number; image: string }[] }> = {
  "Complete Hair Growth System": {
    title: "YOUR 1-MONTH TRIAL SUPPLY",
    items: [
      { name: "Heritage Shampoo (500ml)", qty: 1, image: shampoo },
      { name: "Growth Pomade (150g)", qty: 1, image: pomade },
      { name: "Voluminous Conditioner (500ml)", qty: 1, image: conditioner },
    ]
  },
  "Self Love Return": {
    title: "YOUR 3-MONTH MAINTENANCE SUPPLY",
    items: [
      { name: "Growth Pomade (150g)", qty: 3, image: pomade },
    ]
  },
  "Self Love B2GOF": {
    title: "YOUR 3-MONTH SCALP RESET SUPPLY",
    items: [
      { name: "Heritage Shampoo (500ml)", qty: 2, image: shampoo },
      { name: "Growth Pomade (150g)", qty: 2, image: pomade },
    ]
  },
  "Self Love Plus B2GOF": {
    title: "YOUR 3-MONTH RECOVERY SYSTEM SUPPLY",
    items: [
      { name: "Heritage Shampoo (500ml)", qty: 2, image: shampoo },
      { name: "Growth Pomade (150g)", qty: 2, image: pomade },
      { name: "Voluminous Conditioner (500ml)", qty: 2, image: conditioner },
    ]
  },
  "Family Saves": {
    title: "YOUR 12-MONTH GOLD STANDARD SUPPLY",
    items: [
      { name: "Heritage Shampoo (500ml)", qty: 6, image: shampoo },
      { name: "Voluminous Conditioner (500ml)", qty: 6, image: conditioner },
      { name: "Growth Pomade (150g)", qty: 6, image: pomade },
      { name: "🎁 FREE: Heritage Shampoo (500ml)", qty: 4, image: shampoo },
      { name: "🎁 FREE: Voluminous Conditioner (500ml)", qty: 4, image: conditioner },
      { name: "🎁 FREE: Growth Pomade (150g)", qty: 4, image: pomade },
    ]
  },
  "Fulani Hair Gro Shampoo — 500 ml": {
    title: "YOUR HERITAGE SHAMPOO",
    items: [
      { name: "Heritage Shampoo (500ml)", qty: 1, image: shampoo },
    ]
  },
  "Fulani Hair Gro Conditioner — 500 ml": {
    title: "YOUR VOLUMINOUS CONDITIONER",
    items: [
      { name: "Voluminous Conditioner (500ml)", qty: 1, image: conditioner },
    ]
  },
  "Fulani Hair Gro Pomade — 150 ml": {
    title: "YOUR GROWTH POMADE",
    items: [
      { name: "Growth Pomade (150g)", qty: 1, image: pomade },
    ]
  },
};

// Global ref to prevent duplicate TikTok Purchase events across component re-renders
const purchaseFired = { current: false };

const ThankYou = () => {
  const [orderNumber, setOrderNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const order = params.get('order');
      if (order && order.trim().length > 0) {
        return order;
      }
      const orderId = params.get('orderId');
      if (orderId && orderId.trim().length > 0) {
        return orderId;
      }
      const entryId = params.get('entry_id');
      if (entryId && entryId.trim().length > 0) {
        return entryId;
      }
    }
    return 'UNKNOWN';
  });

  // Re-read order id after hydration (SSG renders with empty query string)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const order = params.get('order') || params.get('orderId') || params.get('entry_id') || '';
    if (order && order.trim().length > 1) {
      setOrderNumber(order.trim());
    }
  }, []);
  const [savingsAnimated, setSavingsAnimated] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [deliveryEstimate, setDeliveryEstimate] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lazy load confetti
    import('canvas-confetti').then((confettiModule) => {
      const confetti = confettiModule.default;
      
      // Meta Browser Optimization: Reduce confetti for slower devices
      const isMetaBrowser = /FB_IAB|FBAN|FBAV|Instagram/i.test(navigator.userAgent);
      const particleCount = isMetaBrowser ? 1 : 3;
      
      // Confetti explosion on load - delayed for Meta browser
      const startDelay = isMetaBrowser ? 1000 : 0;
      const duration = isMetaBrowser ? 1500 : 3000;
      const end = Date.now() + startDelay + duration;

      const frame = () => {
        confetti({
          particleCount,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#DAA520', '#FFD700', '#ffffff']
        });
        confetti({
          particleCount,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#DAA520', '#FFD700', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      
      if (startDelay > 0) {
        setTimeout(frame, startDelay);
      } else {
        frame();
      }
    });

      }, []);

  // Read order data from sessionStorage
  useEffect(() => {
    const stored = localStorage.getItem('fhg_order_data');
    if (stored) {
      try {
        setOrderData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse order data:', e);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const run = () => {
      if (loading || purchaseFired.current) return;
      const isTestMode = window.location.search.includes('test=1');
      if (isTestMode) {
        purchaseFired.current = true;
        fireTikTokPurchase({
          content_name: 'Self Love Plus',
          value: 71750,
          currency: 'NGN',
          email: 'test@fulanihairsecrets.com',
          phone: '08012345678',
          orderId: 'TEST_ORDER_123',
        });
        console.log('[TikTok] Test Purchase event fired');
        return;
      }
      if (!orderData || !orderNumber) return;
      purchaseFired.current = true;
      fireTikTokPurchase({
        content_name: orderData.packageName || 'Fulani Hair Gro',
        value: orderData.totalAmount || 0,
        currency: 'NGN',
        email: orderData.email,
        phone: orderData.phone,
        orderId: orderData.orderId || orderNumber,
      });
      console.log('[TikTok] Purchase event fired');
    };
    void run();
  }, [loading, orderData, orderNumber]);

  useEffect(() => {
    try {
      if (window.top !== window.self) {
        window.top.location.href = window.location.href;
      }
    } catch (error) {
      console.error('Iframe breakout failed (cross-origin restriction):', {
        currentUrl: window.location.href,
        error: error instanceof Error ? error.message : error
      });
    }
  }, []);

  // Force Pixel pageview on SPA navigation to /thank-you
  // Google Analytics removed - no longer used

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(amount);
  };

  const getDeliveryEstimate = (deliveryType?: string) => {
    const now = new Date();
    const formatDate = (d: Date) =>
      d.toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' });

    if (deliveryType === 'SAME_DAY') {
      return formatDate(now);
    }

    // Standard delivery: 3-5 business days
    const addBusinessDays = (start: Date, days: number): Date => {
      const result = new Date(start);
      let added = 0;
      while (added < days) {
        result.setDate(result.getDate() + 1);
        const day = result.getDay();
        if (day !== 0 && day !== 6) added++; // skip weekends
      }
      return result;
    };

    const startDate = addBusinessDays(now, 3);
    const endDate = addBusinessDays(now, 5);
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  };


  const faqs = [
    { q: "What if my order doesn't arrive?", a: "Every order is tracked. You'll receive WhatsApp updates at every stage. If anything goes wrong, we reship immediately at our cost." },
    { q: "What if it doesn't work for me?", a: "You're protected by our 365-day DOUBLE money-back guarantee. If you don't see results, we refund 2X what you paid. No questions." },
    { q: "How do I use the products correctly?", a: "Your ebook and VIP group have everything. Plus, we'll send a personalized routine within 24 hours. You'll know exactly what to do." },
    { q: "Can I change my delivery address?", a: "Yes! WhatsApp us immediately with your new address." },
    { q: "When will I see results?", a: "Most women notice reduced shedding Week 1, baby hairs Week 3, visible transformation Month 2-3. Check the timeline above!" }
  ];

  const isTestMode = typeof window !== 'undefined' && window.location.search.includes('test=1');

  // Loading state
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <p className="text-lg text-white">Loading your order details...</p>
    </div>;
  }

  // No sessionStorage data — show a reassuring confirmation with orderId from URL
  if (!orderData && !window.location.search.includes('test=1')) {
    const isKlumpPayment = localStorage.getItem('fhg_order_data') ? JSON.parse(localStorage.getItem('fhg_order_data') || '{}').paymentMethod === 'KLUMP' : false;
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mb-6">
          <Check className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed! 🎉</h1>
        {orderNumber && orderNumber !== 'UNKNOWN' && (
          <p className="text-[#DAA520] font-semibold text-lg mb-4">Order #{orderNumber}</p>
        )}
        <p className="text-gray-300 mb-2 max-w-md">
          {isKlumpPayment ? 'Your order has been received. Your Klump payment request has been submitted successfully.' : 'Your order has been received and is being processed.'}
        </p>
        <p className="text-gray-400 mb-8 max-w-md text-sm">
          {isKlumpPayment ? 'We will process your order once Klump confirms your payment.' : 'You\'ll receive a WhatsApp confirmation shortly with your delivery details. If you refreshed this page, don\'t worry — your order is safe!'}
        </p>
        <a
          href={WHATSAPP_ORDER_HELP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition mb-4"
        >
          Chat on WhatsApp for Updates
        </a>
        <p className="text-gray-500 text-xs mt-4">
          Questions? Call us at <a href={PHONE_TEL} className="text-[#DAA520] underline">{PHONE_DISPLAY}</a>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
      {/* Test Mode Banner */}
      {isTestMode && (
        <div className="bg-yellow-500 text-black p-6 text-center">
          <h2 className="text-2xl font-bold mb-2">CAPI TEST MODE ACTIVE</h2>
          <p className="text-sm mb-3">Events are being sent to Meta. Check your browser console (F12) for details.</p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-full">FormStart</span>
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-full">ViewContent</span>
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-full">InitiateCheckout</span>
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-full">Purchase</span>
            <span className="bg-black text-yellow-400 px-3 py-1 rounded-full">HighValuePurchase</span>
          </div>
          <p className="text-xs mt-3 opacity-75">Go to Meta Events Manager → Test Events tab to verify server events</p>
        </div>
      )}
      {/* Floating gold particles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      {/* SECTION 1: CELEBRATION HERO */}
      <section className="py-16 px-4 text-center relative">
        <div className="max-w-4xl mx-auto">
          {/* Animated Checkmark */}
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gold to-amber-600 flex items-center justify-center animate-[scale-in_0.5s_ease-out]">
            <Check className="w-12 h-12 text-black" strokeWidth={3} />
          </div>
          
          <h1 className="text-2xl md:text-3xl font-bold text-green-500 mb-2">✓ ORDER CONFIRMED!</h1>
          <p className="text-3xl md:text-4xl font-cinzel text-gold mb-2">
            Congratulations, {orderData?.phone ? 'Queen' : 'Guest'}! 👑
          </p>
          <p className="text-xl text-gray-300 mb-4">"You Just Made the Best Decision for Your Hair"</p>
          
          <div className="text-gray-400 mb-8">
            <p>Order ID: {orderNumber}</p>
            <p>{new Date().toLocaleDateString('en-NG', { month: 'long', day: 'numeric', year: 'numeric' })} • {new Date().toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>

          <p className="text-xl md:text-2xl bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent font-semibold max-w-3xl mx-auto mb-8">
            "While others are still struggling with products that don't work, you just invested in 400 years of PROVEN results."
          </p>

          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            You're now 1 of 15,248 Nigerian Queens with amazing hair incoming!
          </div>
        </div>
      </section>

      {/* SECTION 2: INSTANT VALIDATION */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">You Made The Right Choice. Here's Proof:</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0a0a0a] border-2 border-gold rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gold mb-2">Join The Winners</h3>
              <p className="text-gray-300 mb-4">92% of women who use the complete system see visible results within 8 weeks</p>
              <div className="w-full bg-gray-800 rounded-full h-3">
                <div className="bg-gradient-to-r from-gold to-amber-500 h-3 rounded-full transition-all duration-1000 progress-bar-92" />
              </div>
            </div>

            <div className="bg-[#0a0a0a] border-2 border-green-500 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-green-400 mb-2">Smart Investment</h3>
              <p className="text-gray-300">You just saved <span className="text-green-400 font-bold">{formatCurrency(savingsAnimated)}</span> compared to buying individually. That's a Chanel bag worth of savings! 👜</p>
            </div>

            <div className="bg-[#0a0a0a] border-2 border-gold rounded-2xl p-6 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-gold mb-2">Zero Risk</h3>
              <p className="text-gray-300">Protected by our 365-day DOUBLE money-back guarantee. If it doesn't work → You get 2X your money back</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: SMART CHOICE CALCULATOR */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto bg-[#111] border-2 border-gold rounded-3xl p-8">
          <h2 className="text-2xl font-cinzel text-gold mb-8 flex items-center gap-2">
            💰 YOUR SMART CHOICE BREAKDOWN
          </h2>
          
          <p className="text-gray-400 mb-6">What you would have spent:</p>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 line-through">6 months of salon treatments</span>
              <span className="text-gray-700 line-through">₦360,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 line-through">Products that don't work</span>
              <span className="text-gray-700 line-through">₦200,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 line-through">Hair transplant (Turkey)</span>
              <span className="text-gray-700 line-through">₦15,000,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 line-through">Emotional stress</span>
              <span className="text-gray-700 line-through">PRICELESS</span>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-6 mb-6">
            <div className="flex justify-between items-center text-xl">
              <span className="text-white">Your investment today:</span>
              <span className="text-green-400 font-bold">{formatCurrency(orderData?.totalAmount || 0)}</span>
            </div>
          </div>

          <div className="border-t-2 border-gold pt-6 text-center">
            <p className="text-gray-400 mb-2">🧠 YOUR SMART SAVINGS:</p>
            <p className="text-4xl md:text-5xl font-bold text-gold">{formatCurrency(savingsAnimated)}+</p>
            <p className="text-amber-400 mt-4 italic">"You didn't spend money. You SAVED money."</p>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHAT HAPPENS NEXT */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">Your Transformation Journey Starts NOW</h2>
          
          <div className="space-y-0">
            {[
              { icon: Check, title: 'ORDER CONFIRMED', time: 'Just now', desc: 'Your order is locked in', active: true },
              { icon: Package, title: 'PACKAGING', time: 'Within 24 hours', desc: 'Our team is preparing your products with care' },
              { icon: Truck, title: 'SHIPPING', time: '1-3 business days', desc: 'Your package is on its way!' },
              { icon: Phone, title: 'DELIVERY CALL', time: '30 mins before arrival', desc: 'Our rider will call to confirm' },
              { icon: CreditCard, title: 'PAY & RECEIVE', time: 'Delivery day', desc: 'Inspect your products, then pay. Simple!' },
              { icon: Crown, title: 'TRANSFORMATION BEGINS', time: 'Same day', desc: 'Start your journey to longer, fuller hair!' }
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step.active ? 'bg-green-500' : 'bg-[#222] border border-gold/50'}`}>
                    <step.icon className={`w-6 h-6 ${step.active ? 'text-white' : 'text-gold'}`} />
                  </div>
                  {i < 5 && <div className="w-0.5 h-16 bg-gold/30" />}
                </div>
                <div className="pb-8">
                  <p className={`font-bold ${step.active ? 'text-green-400' : 'text-gold'}`}>{step.title}</p>
                  <p className="text-sm text-gray-400">{step.time}</p>
                  <p className="text-gray-300">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 mt-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-green-400">📍 Delivering to: <span className="text-white">Lagos, Nigeria</span></p>
                <p className="text-green-400">📅 Expected arrival: <span className="text-white">{deliveryEstimate}</span></p>
                <p className="text-green-400">📱 Tracking sent via WhatsApp</p>
              </div>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                TRACK YOUR ORDER
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: ORDER SUMMARY */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-4">Here's Everything Coming Your Way:</h2>
          <p className="text-center text-xl text-gray-300 mb-8">
            Package: <span className="text-gold font-bold">{orderData?.packageName || 'Fulani Hair Gro'}</span>
          </p>
          
          <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-gold mb-4">
              {(() => {
                const currentPackage = packageProducts[orderData?.packageName || ''] || packageProducts['Complete Hair Growth System'];
                return currentPackage.title;
              })()}:
            </h3>
            <div className="space-y-4">
              {(() => {
                const currentPackage = packageProducts[orderData?.packageName || ''] || packageProducts['Complete Hair Growth System'];
                return currentPackage.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" loading="lazy" decoding="async" width="64" height="64" />
                    <span className="flex-1 text-gray-300">{item.name}</span>
                    <span className="text-gold">x{item.qty}</span>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                ));
              })()}
            </div>
          </div>

          <div className="bg-[#111] border border-green-500/30 rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-bold text-green-400 mb-4">🎁 YOUR FREE BONUSES:</h3>
            <div className="space-y-3">
              {[
                { icon: '📖', name: 'Hair Growth Secrets Ebook', value: '₦10,000' },
                { icon: '📱', name: 'VIP WhatsApp Support', value: '₦20,000' },
                { icon: '💆', name: 'Scalp Massage Guide', value: '₦5,000' },
                { icon: '🎯', name: 'Personalized Hair Plan', value: '₦15,000' }
              ].map((bonus, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-2xl">{bonus.icon}</span>
                  <span className="flex-1 text-gray-300">{bonus.name}</span>
                  <span className="text-gray-700">{bonus.value}</span>
                  <Check className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] rounded-2xl p-6 text-center">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Product:</span>
              <span className="text-gray-400">{formatCurrency(orderData?.packageAmount || 0)}</span>
            </div>
            {orderData?.deliveryFee > 0 && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Delivery Fee:</span>
                <span className="text-gray-400">{formatCurrency(orderData.deliveryFee)}</span>
              </div>
            )}
            <div className="flex justify-between mb-4">
              <span className="text-white font-bold">Total Payable:</span>
              <span className="text-white font-bold">{formatCurrency(orderData?.totalAmount || 0)}</span>
            </div>
            <div className="border-t border-gray-700 pt-4 flex justify-between items-center">
              <span className="text-xl font-bold text-green-400">YOU SAVED:</span>
              <span className="text-3xl font-bold text-green-400">{formatCurrency(savingsAnimated)} 💰</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHAT TO EXPECT */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">Get Ready For These Changes:</h2>
          
          <div className="space-y-6">
            {[
              { title: 'WEEK 1-2: The Foundation', items: ['Reduced hair shedding', 'Scalp feels cleaner and healthier', 'Less itching and irritation'], tip: 'Check your brush — less hair already!' },
              { title: 'WEEK 3-4: The Excitement Begins', items: ['Baby hairs appearing around edges', 'Hair feels stronger when styling', 'Less breakage during detangling'], tip: 'Look closely at your hairline — see them?' },
              { title: 'MONTH 2-3: Others Start Noticing', items: ['Visible new growth', 'Fuller, thicker appearance', 'Compliments start coming'], tip: 'Your hairdresser will ask what you\'re using' },
              { title: 'MONTH 4-6: Full Transformation', items: ['Dramatic transformation complete', 'Edges fully restored', 'Length you haven\'t seen in years'], tip: 'Time for that \'AFTER\' photo! 📸' }
            ].map((phase, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gold/30 rounded-2xl p-6">
                <h3 className="text-gold font-bold mb-4">{phase.title}</h3>
                <div className="space-y-2 mb-4">
                  {phase.items.map((item, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-gold/50 rounded" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-amber-400 text-sm">💡 "{phase.tip}"</p>
              </div>
            ))}
          </div>

          <div className="bg-gold/10 border border-gold/30 rounded-2xl p-6 mt-8 text-center">
            <p className="text-gold">📱 Screenshot this timeline!</p>
            <p className="text-gray-300">Check off each milestone as you hit it.</p>
            <p className="text-amber-400">We LOVE when customers send us their progress! 💕</p>
          </div>
        </div>
      </section>

      {/* SECTION 7: WELCOME TO THE FAMILY */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#111] border border-gold/30 rounded-3xl p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <img 
                src={founderImg}
                alt="Hajiya Hajara - Founder, Fulani Hair Gro"
                className="w-32 h-32 rounded-full border-4 border-gold object-cover" 
                loading="lazy"
                decoding="async"
              />
              <div>
                <p className="text-2xl text-gold mb-4">"Welcome, Queen! 👑</p>
                <p className="text-gray-300 mb-4">You're not just a customer — you're family now.</p>
                <p className="text-gray-300 mb-4">We're personally invested in YOUR transformation. That's why we offer 365-day guarantees, VIP WhatsApp support, and check in on your progress.</p>
                <p className="text-gray-300 mb-4">Your hair journey matters to us. We can't wait to see your results!</p>
                <p className="text-gray-400 italic">With love,</p>
                <p className="text-gold font-cinzel text-xl">Hajiya Hajara</p>
                <p className="text-gray-400 text-sm">Founder, Fulani Hair Gro™</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 text-center">
            <div className="bg-[#111] rounded-xl p-4">
              <p className="text-3xl font-bold text-gold">5,248+</p>
              <p className="text-gray-400 text-sm">Happy Queens</p>
            </div>
            <div className="bg-[#111] rounded-xl p-4">
              <p className="text-3xl font-bold text-gold">98.7%</p>
              <p className="text-gray-400 text-sm">Would Recommend</p>
            </div>
            <div className="bg-[#111] rounded-xl p-4">
              <p className="text-3xl font-bold text-gold">100,000+</p>
              <p className="text-gray-400 text-sm">Products Delivered</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: DIGITAL BONUSES */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-4">📲 Your Digital Bonuses Are Ready</h2>
          <p className="text-center text-gray-400 mb-12">Access NOW!</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center">
              <Download className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gold mb-2">Hair Growth Secrets Ebook</h3>
              <p className="text-gray-400 text-sm mb-4">"47 pages of expert tips for faster, healthier growth"</p>
              <Button className="w-full bg-gold hover:bg-amber-600 text-black">DOWNLOAD NOW</Button>
            </div>

            <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center">
              <Play className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gold mb-2">Scalp Massage Video Guide</h3>
              <p className="text-gray-400 text-sm mb-4">"5-minute routine that boosts blood flow by 200%"</p>
              <Button className="w-full bg-gold hover:bg-amber-600 text-black">WATCH NOW</Button>
            </div>

            <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center">
              <Target className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gold mb-2">Personalized Hair Plan</h3>
              <p className="text-gray-400 text-sm mb-4">"Custom routine sent within 24 hours via WhatsApp"</p>
              <Button className="w-full bg-gold hover:bg-amber-600 text-black">TAKE HAIR QUIZ</Button>
            </div>
          </div>

          <p className="text-center text-amber-400 mt-8">Start learning NOW so you're ready to maximize results the moment your products arrive! ⚡</p>
        </div>
      </section>

      {/* SECTION 10: TESTIMONIALS */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">You're In Great Company</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { img: amina, name: 'Hajia Amina B.', loc: 'Kano, Nigeria', quote: "I was nervous after ordering. Was this really going to work? 4 months later, I'm SO glad I trusted my gut. Best decision ever." },
              { img: blessing, name: 'Mrs. Blessing O.', loc: 'Lagos, Nigeria', quote: "The moment I got my package, I knew this was different. The quality, the smell, everything screams PREMIUM." },
              { img: founderImg, name: 'Chidinma E.', loc: 'Port Harcourt, Nigeria', quote: "I've ordered 3 times now. First for myself, then my mom, then my sister. We're all obsessed!" }
            ].map((t, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gold/30 rounded-2xl p-6">
                <div className="text-amber-400 mb-4">★★★★★</div>
                <p className="text-gray-300 text-sm mb-4 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" decoding="async" width="48" height="48" />
                  <div>
                    <p className="text-gold font-semibold">{t.name}</p>
                    <p className="text-gray-400 text-sm">{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#0a0a0a] rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1 flex items-center gap-4">
              <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center text-gray-500">BEFORE</div>
              <span className="text-gold text-2xl">→</span>
              <img src={result1} alt="After" className="w-24 h-24 rounded-lg object-cover" loading="lazy" decoding="async" width="96" height="96" />
            </div>
            <div className="text-center md:text-left">
              <p className="text-gold font-semibold">Amina O. — 8 weeks after ordering</p>
              <p className="text-amber-400">"This could be you in 2 months! 📸"</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: SUPPORT */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">Questions? We're Here For You 24/7</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <a href={WHATSAPP_LINK} className="bg-[#111] border border-green-500/30 rounded-2xl p-6 text-center hover:border-green-500 transition-colors">
              <MessageCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">WHATSAPP</h3>
              <p className="text-gray-400 mb-2">{PHONE_DISPLAY}</p>
              <p className="text-green-400 text-sm">Response: Under 2 hours</p>
            </a>

            <div className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center">
              <Mail className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">EMAIL</h3>
              <p className="text-gray-400 mb-2">admin@fulanihairsecrets.com</p>
              <p className="text-amber-400 text-sm">Response: Within 24hrs</p>
            </div>

            <a href={`tel:${PHONE_TEL}`} className="bg-[#111] border border-gold/30 rounded-2xl p-6 text-center hover:border-gold transition-colors">
              <PhoneCall className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">CALL US</h3>
              <p className="text-gray-400 mb-2">{PHONE_DISPLAY}</p>
              <p className="text-amber-400 text-sm">Hours: 9am-6pm Mon-Sat</p>
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 12: FAQ */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-12">Quick Answers For Peace of Mind</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-gold/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left"
                >
                  <span className="text-gold font-semibold">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 text-gold" /> : <ChevronDown className="w-5 h-5 text-gold" />}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4">
                    <p className="text-gray-300">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      
      {/* SECTION 14: COMMITMENT */}
      <section className="py-16 px-4 bg-[#111]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-cinzel text-center text-gold mb-8">Before You Go — Make This Promise to Yourself</h2>
          
          <div className="bg-[#0a0a0a] border-2 border-gold rounded-3xl p-8">
            <p className="text-xl text-gray-300 mb-6">"I, <span className="border-b border-gold/50 px-8">____________</span>, commit to my hair transformation.</p>
            
            <p className="text-gold mb-4">I will:</p>
            <div className="space-y-2 mb-6">
              {['Use the Complete System consistently for 90 days', 'Follow the routine every night', 'Trust the process, even when I doubt', 'Take progress photos every 2 weeks', 'Celebrate my wins, no matter how small'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gold/20 border border-gold rounded flex items-center justify-center">
                    <Check className="w-3 h-3 text-gold" />
                  </div>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            <p className="text-gold mb-4">My hair goal:</p>
            <div className="space-y-2 mb-8">
              {['Restore my edges', 'Stop shedding & breakage', 'Grow longer hair', 'Get thicker, fuller hair', 'All of the above'].map((goal, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-gold rounded-full" />
                  <span className="text-gray-300">{goal}</span>
                </div>
              ))}
            </div>

            <Button className="w-full bg-gradient-to-r from-gold to-amber-600 hover:from-amber-600 hover:to-gold text-black text-lg py-6">
              👑 I COMMIT TO MY TRANSFORMATION 👑
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 15: FINAL MOTIVATION */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 z-0">
          <img src={result2} alt="Beautiful hair" className="w-full h-full object-cover" loading="lazy" decoding="async" width="1920" height="1080" />
          <div className="absolute inset-0 bg-black/70" />
        </div>
        
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-4xl font-cinzel text-white leading-relaxed mb-8">
            Your Last Bad Hair Day Was Yesterday.
          </p>
          <div className="space-y-2 text-lg md:text-xl text-gray-300 mb-8">
            <p>Every day from now, your hair gets better.</p>
            <p>Every week, you'll see progress.</p>
            <p>Every month, more transformation.</p>
            <p className="text-gold font-semibold">In 6 months, you won't recognize yourself.</p>
          </div>
          <p className="text-2xl text-gold mb-4">Welcome to the family, Queen. 👑</p>
          <p className="text-gray-300 italic">Your journey starts the moment your package arrives.</p>
          <p className="text-gray-300 italic">We can't wait to see your results.</p>
          <p className="text-gold mt-8">— The Fulani Hair Gro™ Family</p>
        </div>
      </section>

      {/* SECTION 16: STICKY FOOTER */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#111] border-t border-gold/30 p-4 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400">
            📦 Order ID: {orderNumber} • Est. Delivery: {deliveryEstimate}
          </div>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="relative border-gold text-gold hover:bg-gold hover:text-black text-xs overflow-hidden group transition-all duration-300"
              style={{
                animation: 'bling-pulse-footer 3s ease-in-out infinite',
                boxShadow: '0 0 15px rgba(218, 165, 32, 0.4)'
              }}
            >
              {/* Sparkles for TRACK ORDER */}
              <span className="absolute inset-0 overflow-hidden">
                <span className="absolute top-1 left-1 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '0s' }}></span>
                <span className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></span>
              </span>
              <span className="relative z-10" style={{ textShadow: '0 0 8px rgba(218, 165, 32, 0.6)' }}>
                ✨ TRACK ORDER
              </span>
            </Button>
            
            <Button 
              size="sm" 
              className="relative bg-green-500 hover:bg-green-600 text-white text-xs overflow-hidden group transition-all duration-300"
              style={{
                animation: 'bling-pulse-footer 3s ease-in-out infinite',
                animationDelay: '1s',
                boxShadow: '0 0 15px rgba(34, 197, 94, 0.4)'
              }}
            >
              {/* Sparkles for WHATSAPP SUPPORT */}
              <span className="absolute inset-0 overflow-hidden">
                <span className="absolute top-1 right-1 w-1 h-1 bg-green-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></span>
                <span className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '2s' }}></span>
              </span>
              <span className="relative z-10" style={{ textShadow: '0 0 8px rgba(34, 197, 94, 0.6)' }}>
                💬 WHATSAPP SUPPORT
              </span>
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="relative border-gold text-gold hover:bg-gold hover:text-black text-xs hidden md:inline-flex overflow-hidden group transition-all duration-300"
              style={{
                animation: 'bling-pulse-footer 3s ease-in-out infinite',
                animationDelay: '2s',
                boxShadow: '0 0 15px rgba(218, 165, 32, 0.4)'
              }}
            >
              {/* Sparkles for DOWNLOAD BONUSES */}
              <span className="absolute inset-0 overflow-hidden">
                <span className="absolute top-1 left-2 w-1 h-1 bg-yellow-200 rounded-full animate-ping" style={{ animationDelay: '1s' }}></span>
                <span className="absolute bottom-1 right-2 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></span>
              </span>
              <span className="relative z-10" style={{ textShadow: '0 0 8px rgba(218, 165, 32, 0.6)' }}>
                🎁 DOWNLOAD BONUSES
              </span>
            </Button>
          </div>
          
          {/* Add CSS animations for footer buttons */}
          <style>{`
            @keyframes bling-pulse-footer {
              0%, 100% {
                transform: scale(1);
                opacity: 1;
              }
              50% {
                transform: scale(1.03);
                opacity: 0.9;
              }
            }
          `}</style>
        </div>
      </div>

      {/* Bottom padding for sticky footer */}
      <div className="h-24" />
    </div>
  );
};

export default ThankYou;
