import { useState, useEffect, lazy, Suspense, useRef } from 'react';
import type { ReactNode } from 'react';
import { useAfterHeroLoad, useIdleLoad } from '@/hooks/useIdleLoad';
import { StickyPayOnDeliveryBar } from '@/components/landing/StickyPayOnDeliveryBar';
import { UrgencyBanner } from '@/components/landing/UrgencyBanner';
import { TopStoryBanner } from '@/components/landing/TopStoryBanner';
import { StickyElements } from '@/components/landing/StickyElements';
import { TopIntentPopup } from '@/components/landing/TopIntentPopup';
import { HairProblemsSection } from '@/components/landing/HairProblemsSection';
import { Footer } from '@/components/landing/Footer';
// Valentine promo ended
// import { ValentineCountdown } from '@/components/ValentineCountdown';

// Lazy load below-fold components
const Guarantee = lazy(() =>
  import('@/components/landing/Guarantee').then((m) => ({ default: m.Guarantee }))
);
const FAQ = lazy(() => import('@/components/landing/FAQ').then((m) => ({ default: m.FAQ })));
import cashOnDeliveryImg from '@/assets-optimized/products/cash-on-delivery-icon-1024x345-7sgjf338-2-1.webp';

type LazySectionProps = {
  children: ReactNode;
  minHeightClassName?: string;
  rootMargin?: string;
};

const LazySection = ({
  children,
  minHeightClassName = 'min-h-[1px]',
  rootMargin = '800px 0px'
}: LazySectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) return;
    const el = ref.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setIsVisible(true);
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div ref={ref} className={minHeightClassName}>
      {isVisible ? <Suspense fallback={null}>{children}</Suspense> : null}
    </div>
  );
};

const purchaseNotifications = [
  { name: "Hajia F.", location: "Banana Island", product: "6-Month Supply", time: "2 mins ago" },
  { name: "Alhaja M.", location: "Maitama, Abuja", product: "Complete Set", time: "5 mins ago" },
  { name: "Mrs. A.", location: "Lekki Phase 1", product: "Growth Pomade", time: "8 mins ago" },
  { name: "Dr. O.", location: "Victoria Island", product: "6-Month Supply", time: "12 mins ago" },
  { name: "Princess Z.", location: "Kano", product: "Complete System", time: "15 mins ago" },
  { name: "Chief Mrs. N.", location: "Ikoyi", product: "6-Month Supply", time: "18 mins ago" },
  { name: "Hajia B.", location: "Asokoro", product: "Complete Set", time: "23 mins ago" },
  { name: "Mrs. K.", location: "Ikeja GRA", product: "Growth Pomade", time: "27 mins ago" },
  { name: "Obinna", location: "Ikeja", product: "B2GOF Bundle for his wife!", time: "3 mins ago" },
  { name: "Chukwuemeka", location: "Lekki", product: "Premium Bundle for wife", time: "6 mins ago" },
  { name: "Ahmed", location: "Abuja", product: "Complete Set", time: "9 mins ago" },
  { name: "Tunde", location: "Victoria Island", product: "6-Month Supply (gift)", time: "11 mins ago" },
];

const getCountdownToMidnight = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0); // today at 24:00 (start of next day)

  const diffMs = midnight.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};

const Index = () => {
  // Prevent hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Idle load non-critical components to reduce TBT
  const loadNonCritical = useIdleLoad(500); // Load after 500ms idle
  const afterHero = useAfterHeroLoad();

  // State management
  const [stockCount, setStockCount] = useState(43);
  const [viewerCount, setViewerCount] = useState(427);
  const [showPurchaseNotif, setShowPurchaseNotif] = useState(false);
  const [currentNotif, setCurrentNotif] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [showTopIntent, setShowTopIntent] = useState(false);
  const [hasShownTopIntent, setHasShownTopIntent] = useState(false);

  // Countdown Timer - always counts down to local midnight today
  useEffect(() => {
    if (!afterHero) return;
    const timer = setInterval(() => {
      setCountdown(getCountdownToMidnight());
    }, 1000);

    // Set initial value immediately in case the interval hasn't fired yet
    setCountdown(getCountdownToMidnight());

    return () => clearInterval(timer);
  }, [afterHero]);

  // Viewer count fluctuation (social proof)
  useEffect(() => {
    if (!afterHero) return;
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 15) - 7; // -7 to +7
        const next = prev + change;
        // Keep between 195 and 956
        return Math.max(195, Math.min(956, next));
      });
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, [afterHero]);

  // Stock decreasing
  useEffect(() => {
    if (!afterHero) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setStockCount(prev => Math.max(7, prev - 1));
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [afterHero]);

  // Purchase notifications
  useEffect(() => {
    if (!afterHero) return;
    const showNotification = () => {
      setCurrentNotif(prev => (prev + 1) % purchaseNotifications.length);
      setShowPurchaseNotif(true);
      setTimeout(() => setShowPurchaseNotif(false), 4000);
    };
    
    const interval = setInterval(showNotification, 8000);
    const firstTimeout = setTimeout(showNotification, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(firstTimeout);
    };
  }, [afterHero]);

  // Scroll progress + sticky bar
  // Cache max scroll to avoid forcing layout on every scroll event
  const maxScrollRef = useRef(0);
  useEffect(() => {
    if (!afterHero) return;
    const updateMaxScroll = () => {
      maxScrollRef.current = document.documentElement.scrollHeight - window.innerHeight;
    };
    updateMaxScroll();
    window.addEventListener('resize', updateMaxScroll);

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const maxScroll = maxScrollRef.current || 1;
        const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
        setScrollProgress(progress);
        setShowStickyBar(scrolled > 600);
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateMaxScroll);
    };
  }, [afterHero]);

  // Transactional popup gating (mobile-first): show only after 8s OR 50% scroll depth
  useEffect(() => {
    if (!afterHero) return;
    if (hasShownTopIntent) return;

    const fireTopIntent = () => {
      if (hasShownTopIntent) return;
      setShowTopIntent(true);
      setHasShownTopIntent(true);
    };

    const timer = window.setTimeout(fireTopIntent, 8000);

    let ticking = false;
    const handleScroll = () => {
      if (hasShownTopIntent) return;
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const docHeight = maxScrollRef.current || 1;
        const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

        if (progress >= 50) {
          fireTopIntent();
          window.removeEventListener('scroll', handleScroll);
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [afterHero, hasShownTopIntent]);



  // FormStart tracking - fires once per session on first CTA click ONLY (not on form interactions)
  // This prevents FormStart from firing on Step 2
  useEffect(() => {
    if (typeof window === 'undefined') return;

    type WindowWithTracking = Window & {
      fbq?: (...args: unknown[]) => unknown;
    };

    const fireFormStart = () => {
      try {
        if (window.sessionStorage.getItem('formStartFired') === '1') return;
        window.sessionStorage.setItem('formStartFired', '1');
      } catch (error) {
        console.error('sessionStorage unavailable (private browsing mode?):', {
          error: error instanceof Error ? error.message : error
        });
        return; // Don't fire if sessionStorage is unavailable
      }

      // dataLayer removed - Google Analytics not used
      // trackFormStart(); // Tracking removed
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Only fire FormStart on CTA buttons, NOT on form container clicks
      const cta = target.closest('[data-form-cta="true"]');

      if (cta) {
        fireFormStart();
      }
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      <StickyPayOnDeliveryBar />
      <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      
      {/* Footer sticky bar temporarily hidden */}
      {false && mounted && afterHero && (
        <StickyElements 
          showStickyBar={showStickyBar}
          viewerCount={viewerCount}
          stockCount={stockCount}
          showPurchaseNotif={showPurchaseNotif}
          currentNotif={purchaseNotifications[currentNotif]}
          scrollProgress={scrollProgress}
        />
      )}
      
      {/* Valentine promo ended - countdown removed */}
      
      <main>
        <TopStoryBanner />

        <HairProblemsSection />

        
        
        
        {mounted && loadNonCritical && (
          <Suspense fallback={null}>
            <FAQ />
          </Suspense>
        )}
      </main>
      
      {mounted && <Footer />}
      
      <TopIntentPopup
        show={showTopIntent}
        onClose={() => setShowTopIntent(false)}
      />
    </div>
    </>
  );
};

export default Index;
