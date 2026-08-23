import { AlertTriangle } from 'lucide-react';

interface LimitedStockWarningProps {
  stockCount: number;
}

export const LimitedStockWarning = ({ stockCount }: LimitedStockWarningProps) => {
  const batchNumber = 47;
  const totalInBatch = 150;
  const percentRemaining = Math.round((stockCount / totalInBatch) * 100);

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-white">
      {/* Warning background */}
      <div className="absolute inset-0" />

      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10">
        {/* Warning header */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
          <h2 className="font-sans text-sm md:text-base font-bold tracking-[0.2em] uppercase text-destructive">
            Extremely Limited Stock
          </h2>
          <AlertTriangle className="w-6 h-6 text-destructive animate-pulse" />
        </div>

        {/* Decorative line */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-destructive/40 to-transparent mb-6" />

        {/* Caution banner */}
        <div className="mb-10 flex justify-center">
          <div className="relative inline-flex items-center gap-4 rounded-2xl border-[3px] border-yellow-400 bg-gradient-to-r from-yellow-100/60 via-yellow-50 to-yellow-100/40 px-4 py-3 md:px-6 md:py-4 shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
            {/* Icon */}
            <div className="flex items-center justify-center">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-yellow-300/30">
                <span className="text-2xl" role="img" aria-label="Caution">
                  ⚠️
                </span>
              </div>
            </div>

            {/* Text */}
            <div className="text-left">
              <div className="font-sans text-lg md:text-xl font-extrabold tracking-[0.25em] uppercase text-[#D30000] mb-1">
                Caution
              </div>
              <div className="font-sans text-lg md:text-xl text-black">
                Only {stockCount} bundles available — order now to avoid delays.
              </div>
            </div>
          </div>
        </div>

        {/* Explanation text */}
        <div className="space-y-4 font-serif text-lg md:text-xl leading-relaxed text-center mb-6 md:mb-8 text-[#333333]">
          <p>
            Because the herbs must be <span className="font-semibold">hand-selected and infused slowly</span>
            <br className="hidden md:block" />
            (the same way my grandmother taught me), only a small batch is ever ready at a time.
          </p>
          <p>
            Once a batch finishes, <span className="font-semibold">the next one takes weeks.</span>
          </p>
          <p>
            This is why you don't see Fulani Hair Gro™ everywhere—
            <br className="hidden md:block" />
            <span className="italic">because it cannot be mass-produced.</span>
          </p>
        </div>

        {/* Media exposure warning */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-destructive/10 border border-destructive/40 rounded-2xl px-5 py-4 md:px-6 md:py-5 text-center shadow-[0_10px_30px_rgba(0,0,0,0.45)]">
            <p className="font-sans text-lg md:text-xl uppercase tracking-[0.25em] text-destructive mb-3">
              Due to Recent TV &amp; News Appearances
            </p>
            <p className="font-serif text-lg md:text-xl mb-2">
              <span className="inline-block bg-[#FDC52D] text-black px-2 py-1">
                Stock is extremely limited right now.
              </span>
            </p>
            <p className="font-serif text-lg md:text-xl">
              <span className="inline-block bg-[#FDC52D] text-black px-2 py-1">
                Warning: Due to recent media exposure, this page may be taken down to prevent server overload. If you&apos;re
                seeing this message, stock is still available — but not for long.
              </span>
            </p>
          </div>
        </div>

        {/* Exclusive offer banner */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="bg-gradient-to-r from-[#FF1493] via-[#FF69B4] to-gold/70 border border-gold/60 rounded-2xl p-5 md:p-6 text-center shadow-[0_18px_40px_rgba(0,0,0,0.6)]">
            <p className="font-sans text-lg md:text-xl tracking-[0.3em] uppercase text-gold mb-3">
              Exclusive Offer
            </p>
            <p className="font-serif text-xl md:text-2xl text-white">
              We're presently offering <span className="font-semibold text-gold">Same Day Delivery</span> and
              <span className="font-semibold text-gold"> Payment On Delivery</span> nationwide!
            </p>
          </div>
        </div>

        {/* Batch status card */}
        <div className="bg-white border-2 border-gold/30 rounded-2xl p-6 md:p-8 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🫙</span>
            <h3 className="font-cinzel text-xl md:text-2xl text-[#854d0e]">Current Batch Status:</h3>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="h-4 bg-muted rounded-full overflow-hidden border border-gold/20">
              <div 
                className="h-full bg-gradient-to-r from-gold via-gold/80 to-destructive transition-all duration-1000 ease-out rounded-full relative"
                style={{ width: `${percentRemaining}%` }}
              >
                {/* Animated shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
              </div>
            </div>
            <div className="flex justify-between mt-2 text-lg md:text-xl">
              <span className="text-[#333333]">0</span>
              <span className="text-[#854d0e] font-bold text-xl md:text-2xl">{stockCount} bundles remaining</span>
              <span className="text-[#333333]">{totalInBatch}</span>
            </div>
          </div>

          {/* Batch details */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-lg md:text-xl text-[#333333]">
            <div className="flex items-center gap-2">
              <span className="text-[#854d0e]">Batch #{batchNumber}</span>
              <span>·</span>
              <span>Hand-prepared December 2025</span>
            </div>
            <div className="text-destructive font-semibold">
              Next batch ready: Late January 2026
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
