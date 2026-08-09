import React from 'react';

export const PreFormStockWarning: React.FC = () => {
  return (
    <section className="bg-white py-10 px-4 text-center border-y border-gray-100">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-sans text-3xl md:text-4xl font-extrabold text-black mb-4">
          Warning: Limited Stock Available
        </h2>
        <h3 className="font-sans text-2xl md:text-3xl font-black text-black mb-8">
          Order in the next 2 hours for same-day dispatch
        </h3>
        <a
          href="#order-form"
          data-form-cta="true"
          className="inline-block bg-[#1a1a1a] text-white font-bold text-base md:text-lg px-8 py-4 rounded-full shadow-lg hover:scale-[1.02] transition-transform"
        >
          Claim Yours Before It&apos;s Gone
        </a>
      </div>
    </section>
  );
};
