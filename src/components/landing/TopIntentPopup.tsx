import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import bundleSystemImg from '@/assets-optimized/products/bundle-system.webp';
import ebookImg from '@/assets-optimized/products/Screenshot 2025-12-16 at 02.01.44.webp';

interface TopIntentPopupProps {
  show: boolean;
  onClose: () => void;
}

export const TopIntentPopup = ({ show, onClose }: TopIntentPopupProps) => {
  const [todayLabel, setTodayLabel] = useState('');
  useEffect(() => {
    setTodayLabel(new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long' }));
  }, []);

  const goToOrderForm = () => {
    if (typeof window !== 'undefined') {
      const container = document.getElementById('order-form-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    onClose();
  };

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (show) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => document.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);

  // Top-intent popup disabled: always return null so popup only shows on exit intent.
  return null;

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/75"
      onClick={onClose}
    >
      <div
        className="max-w-3xl w-full rounded-2xl p-6 md:p-8 relative bg-card border border-gold/50 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Santa accent on top-left edge */}
        <div className="absolute -top-4 -left-2 w-10 h-10 flex items-center justify-center pointer-events-none">
          <span className="text-3xl">🎅</span>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-muted/60 hover:bg-muted flex items-center justify-center text-gold hover:text-foreground transition-colors"
          aria-label="Close order popup"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1.3fr] gap-6 md:gap-8 items-stretch">
          {/* Left: Self Love Plus visual */}
          <div className="hidden md:flex flex-col justify-between border border-gold/25 rounded-xl p-4 bg-background/80">
            <div>
              <p className="font-cinzel text-xs tracking-[0.3em] uppercase text-gold mb-2">Fulani Hair Gro</p>
              <h2 className="font-cinzel text-lg text-foreground mb-2">
                Self Love Plus Offer
              </h2>
              <p className="font-serif text-base md:text-xl text-[#F5F5F5]">
                1 Shampoo 
                1 Conditioner 
                1 Pomade
              </p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full max-w-[260px] aspect-[4/3] rounded-xl bg-[#111111] border border-gold/30 flex items-center justify-center overflow-hidden">
                <img
                  src={bundleSystemImg}
                  alt="Fulani Hair Gro Self Love Plus bundle"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-contain"
                  width="260"
                  height="195"
                />
              </div>
            </div>

            <div className="mt-4 space-y-1 font-serif text-base md:text-xl text-[#F5F5F5]">
              <p>Nationwide delivery</p>
              <p>Pay on Delivery — inspect before you pay</p>
            </div>
          </div>

          {/* Right: hard transactional form for Xmas Self Love Plus */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="font-cinzel text-xl md:text-2xl text-gold mb-1">
                Self Love Plus Offer 🎄
              </h2>
              <p className="font-cinzel text-sm md:text-xl text-[#F5F5F5] mb-1">
                Today only — {todayLabel}
              </p>
              <p className="text-[11px] md:text-xs text-foreground/70 mb-3">
                Nationwide delivery | Pay on Delivery | Limited December batch
              </p>

              {/* Pricing block with two-column Old/New layout */}
              <div className="mb-3 w-full rounded-lg border border-gold/60 bg-background/80 px-4 py-3">
                <div className="grid grid-cols-2 md:grid-cols-[1.1fr_1.4fr] gap-4 items-center text-foreground text-[11px] md:text-sm">
                  {/* Old price column */}
                  <div className="text-left border-r border-foreground/30 pr-3">
                    <p className="uppercase tracking-[0.18em] text-[10px] md:text-xs text-foreground/70 mb-1">
                      Old Price
                    </p>
                    <div className="relative inline-block px-1">
                      <p className="text-2xl md:text-3xl line-through text-white">
                        ₦45,750
                      </p>
                      {/* Red X cross over old price */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-[60%] border-t border-red-500 transform rotate-6"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-x-0 top-[60%] border-t border-red-500 transform -rotate-6"
                      />
                    </div>
                  </div>

                  {/* New price column */}
                  <div className="text-left pl-3">
                    <p className="uppercase tracking-[0.18em] text-[10px] md:text-xs text-gold mb-1">
                      New Price
                    </p>
                    <p className="text-2xl md:text-4xl font-black text-gold">
                      ₦27,450
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={goToOrderForm}
                  data-form-cta="true"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-gold text-black font-cinzel text-sm tracking-widest uppercase py-3 font-bold hover:scale-[1.02] transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-gold/70"
                >
                  ORDER NOW  PAY ON DELIVERY
                </button>

                              </div>

              {/* FREE ebook bonus under form */}
              <div className="mt-3 flex items-center gap-3 rounded-lg border border-gold/40 bg-background/80 px-3 py-2">
                <div className="w-10 h-14 md:w-12 md:h-16 rounded overflow-hidden border border-gold/40 flex-shrink-0 bg-black">
                  <img
                    src={ebookImg}
                    alt="Fulani Hair Gro Hair Growth Ebook cover"
                    loading="lazy"
                    width="48"
                    height="64"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <p className="font-cinzel text-[10px] md:text-xs tracking-[0.18em] uppercase text-gold mb-1">
                    Free Hair Growth Ebook (Today Only)
                  </p>
                  <p className="font-serif text-[11px] md:text-xs text-[#F5F5F5] leading-snug">
                    Worth ₦10,000 — yours free when you complete your order today.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
