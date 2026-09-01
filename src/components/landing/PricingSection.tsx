import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import shampooImg from '@/assets-optimized/products/shampoo.webp';
import conditionerImg from '@/assets-optimized/products/conditioner.webp';
import pomadeImg from '@/assets-optimized/products/pomade.webp';
import fullBundleImg from '@/assets-optimized/products/66750-bundle.webp';

interface PricingSectionProps {
  countdown: { hours: number; minutes: number; seconds: number };
  stockCount: number;
  commitmentChecks: boolean[];
  onCommitmentChange: (index: number) => void;
}

export const PricingSection = ({ countdown, stockCount, commitmentChecks, onCommitmentChange }: PricingSectionProps) => {
  const location = useLocation();
  // Valentine promo ended - use original bundles only
  const isValentineRoute = false;
  
  // Original bundles
  const valentineBundles = [
    {
      name: "SELF 💕 PLUS",
      price: "₦27,450",
      promo: "40% OFF",
      savings: "",
      contents: "1 Shampoo, 1 Pomade, 1 Conditioner",
      bestFor: "New Customers (Trial)",
      popular: false
    },
    {
      name: "SELF 💕 RETURN",
      price: "₦35,750",
      promo: "43% OFF",
      savings: "",
      contents: "3× Pomade",
      bestFor: "Returning Fans",
      popular: false
    },
    {
      name: "SELF 💕 B2GOF",
      price: "₦48,750",
      promo: "52% OFF",
      savings: "",
      contents: "2+1 Shampoo, 2+1 Pomade",
      bestFor: "Value Seekers",
      popular: false
    },
    {
      name: "SELF 💕 PLUS B2GOF",
      price: "₦58,750",
      promo: "60% OFF",
      savings: "",
      contents: "2× Shampoo | 2× Pomade | 2× Conditioner",
      bestFor: "Most Popular",
      popular: true
    },
    {
      name: "Family Saves",
      price: "₦199,000",
      promo: "35% OFF",
      savings: "",
      contents: "6+4 of each product",
      bestFor: "Bulk/Group Buying",
      popular: false
    }
  ];

  // Original prices for main site
  const originalBundles = [
    {
      name: "SELF 💕 PLUS",
      price: "₦32,750",
      promo: "",
      savings: "",
      contents: "1 Shampoo, 1 Pomade, 1 Conditioner",
      bestFor: "New Customers (Trial)",
      popular: false
    },
    {
      name: "SELF 💕 RETURN",
      price: "₦42,750",
      promo: "",
      savings: "",
      contents: "3× Pomade",
      bestFor: "Returning Fans",
      popular: false
    },
    {
      name: "SELF 💕 B2GOF",
      price: "₦52,750",
      promo: "",
      savings: "",
      contents: "2× Shampoo, 2× Pomade, 2× Conditioner",
      bestFor: "Value Seekers",
      popular: false
    },
    {
      name: "SELF 💕 PLUS B2GOF",
      price: "₦66,750",
      promo: "",
      savings: "",
      contents: "2× Shampoo | 2× Pomade | 2× Conditioner",
      bestFor: "Most Popular",
      popular: true
    },
    {
      name: "Family Saves",
      price: "₦215,000",
      promo: "",
      savings: "",
      contents: "6+4 of each product",
      bestFor: "Bulk/Group Buying",
      popular: false
    }
  ];

  const bundles = originalBundles; // Always use original bundles

  return (
    <section id="order" className="py-16 px-4 text-center bg-[#F9F9F9]">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gold mb-4">
          🌟 Special Hair Growth Bundles
        </h2>
        <p className="text-base md:text-lg text-[#333333] mb-8">
          Choose your perfect hair transformation package
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {bundles.map((bundle, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl p-6 border-2 ${
                bundle.popular 
                  ? 'border-[#B80F66] shadow-xl scale-105' 
                  : 'border-gray-200'
              } relative`}
            >
              {bundle.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-[#B80F66] text-white px-4 py-1 rounded-full text-sm font-bold">
                    💕 MOST POPULAR
                  </div>
                </div>
              )}
              
              <h3 className="text-xl md:text-2xl font-bold text-[#333333] mb-2">
                {bundle.name}
              </h3>
              
              <div className="mb-4">
                <div className="text-3xl md:text-4xl font-bold text-[#B80F66] mb-1">
                  {bundle.price}
                </div>
                <div className="text-lg font-semibold text-[#B80F66]">
                  {bundle.promo}
                </div>
              </div>
              
              <div className="text-gray-700 mb-4">
                <div className="text-sm mb-2">
                  <strong>Contents:</strong> {bundle.contents}
                </div>
                <div className="text-sm">
                  <strong>Best For:</strong> {bundle.bestFor}
                </div>
              </div>
              
              <a 
                href="#order-form"
                data-form-cta="true"
                className={`block w-full py-3 px-6 rounded-lg font-bold text-center transition-transform ${
                  bundle.popular
                    ? 'bg-gradient-to-r from-[#5ec239] to-[#4cae4e] text-white hover:scale-105'
                    : 'bg-gray-100 text-gray-900 hover:scale-[1.02]'
                }`}
              >
                {bundle.popular ? '🌟 Claim This Bundle' : 'Select Bundle'}
              </a>
            </div>
          ))}
        </div>
        
        <p className="text-xl text-[#333333]">
          ✓ 365-Day Guarantee &nbsp;•&nbsp; ✓ Free Shipping on ₦66,750 &amp; ₦215,000 bundles (pay before delivery orders only)
        </p>
      </div>
    </section>
  );
};
