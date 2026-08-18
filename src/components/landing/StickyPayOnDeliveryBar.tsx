export function StickyPayOnDeliveryBar() {
  const scrollToForm = () => {
    const el = document.getElementById('order-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <button
      onClick={scrollToForm}
      type="button"
      className="sticky top-0 z-50 w-full bg-red-600 px-3 py-2 text-center text-white shadow-md transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-inset md:py-3"
      aria-label="Buy now with pay on delivery nationwide delivery"
    >
      <span className="inline-flex w-full items-center justify-center gap-1 text-xs font-bold uppercase tracking-wide md:gap-3 md:text-base">
        <span>Buy Now</span>
        <span className="hidden font-normal opacity-80 md:inline" aria-hidden="true">|</span>
        <span className="hidden md:inline">Pay On Delivery</span>
        <span className="hidden font-normal opacity-80 md:inline" aria-hidden="true">|</span>
        <span className="hidden md:inline">Nationwide Delivery</span>
        <span className="md:hidden">Pay On Delivery</span>
        <span className="md:hidden">Nationwide Delivery</span>
      </span>
    </button>
  );
}
