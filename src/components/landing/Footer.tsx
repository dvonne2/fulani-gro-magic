export const Footer = () => {
  return (
    <footer className="py-12 border-t border-gray-200 footer-green">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        
        <div className="w-full h-px bg-gray-200 mb-6"></div>
        
                
        <div className="text-center space-y-2 mb-6">
          <p className="font-sans text-xs text-gray-500 leading-relaxed">
            This Site Is Not A Part Of The Facebook Website Or Facebook Inc. Additionally, This Site Is Not Endorsed By Facebook In Any Way. FACEBOOK Is A Trademark Of FACEBOOK, Inc.
          </p>
          <p className="font-sans text-xs text-gray-500">
            © 2025, Fulani Hair Gro | Policy | Terms
          </p>
          <p className="font-sans text-xs text-gray-500 leading-relaxed">
            The contents of this website, text, images, products are sold or distributed by Fulani Hair Gro and protected under the Nigeria Copyright Act pursuant to Nigeria and International Copyright Laws. Copy/Edit/Use of our contents without my express written permission and you WILL be subject to the maximum fine/penalty imposed by the Law.
          </p>
        </div>
        
        <div className="flex items-center justify-center mb-8">
          <a
            href="#order-form"
            data-form-cta="true"
            className="relative inline-flex items-center justify-center gap-2 text-white font-sans text-xs md:text-sm tracking-widest uppercase px-8 md:px-10 py-3 rounded-xl font-bold hover:scale-105 transition-transform duration-300 overflow-hidden group cta-with-arrow footer-cta-button"
          >
            <span className="relative z-10">ORDER NOW PAY ON DELIVERY</span>
            <span className="arrow-indicator"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 group-hover:translate-x-full transition-transform duration-1000 ease-out footer-shine-effect"
            ></span>

            {/* Text with glow */}
            <span className="relative z-10 drop-shadow-lg footer-glow-text">
              Go To Order Form
            </span>
          </a>
        </div>
        
        {/* Add CSS animations */}
        <style>{`
          @keyframes bling-pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.02);
              opacity: 0.9;
            }
          }
          
          .footer-cta-button {
            animation: bling-pulse 2s ease-in-out infinite;
            background: linear-gradient(90deg, #15803d 0%, #14502d 50%, #15803d 100%);
            background-size: 200% 100%;
            background-position: center center;
            transition: transform 0.3s ease;
          }
          
          .footer-shine-effect {
            transform: translateX(-100%);
          }
          
          .footer-glow-text {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
          }
        `}</style>
        
        <div className="w-full h-px bg-gray-200 mb-6"></div>
        
        <p className="font-sans text-xs text-gray-500 mb-2">
          © 2025 Fulani Hair Gro™. All Rights Reserved.
        </p>
        <p className="font-sans text-xs text-red-600 font-bold mb-4">
          ⚠️ BEWARE OF IMITATIONS. Only purchase from official channels.
        </p>

        <p className="font-sans text-[0.7rem] text-gray-400 mb-1 leading-snug">
          The contents of this website, text, images, products are sold or distributed by VITALVIDA.NG and protected under the Nigeria
          Copyright Act pursuant to Nigeria and International Copyright Laws. Copy/Edit/Use of our contents without my express written
          permission and you WILL be subject to the maximum fine/penalty imposed by the Law.
        </p>
        <p className="font-sans text-[0.5rem] text-gray-400 leading-snug">
          This website is not a part of the Facebook website or Facebook Inc. FACEBOOK is a trademark of FACEBOOK, Inc.
        </p>
      </div>
    </footer>
  );
};
