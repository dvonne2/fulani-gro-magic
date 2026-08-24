import React from 'react';
import { PACKAGES } from '@/config/packages';
import shampooImg from '@/assets-optimized/products/shampoo.webp';
import pomadeImg from '@/assets-optimized/products/pomade.webp';
import conditionerImg from '@/assets-optimized/products/conditioner.webp';

const getProductQty = (items: string, product: string): number => {
  const match = items.toLowerCase().match(new RegExp(`(\\d+)[^+]*?${product}`));
  return match ? parseInt(match[1], 10) : 0;
};

const BASE_PATH = import.meta.env.BASE_URL || '/';

export const BundleSelector = () => {
  const formatPrice = (price: number) => `₦${price.toLocaleString()}`;
  const formatSavings = (original: number, current: number) => `Save ₦${(original - current).toLocaleString()}`;

  return (
    <div className="bundle-selector">
      <style>{`
        :root{--ivory:#FBF6EC;--card:#FFFFFF;--espresso:#2B1D0E;--cocoa:#6B5638;--gold:#C9971C;--gold-deep:#A87A10;--gold-soft:#F3E3BC;--gold-wash:#FFF8E7;--rose:#8E2F3C;--rose-soft:#F9E7EA;--radius:18px}
        .bundle-selector *{margin:0;padding:0;box-sizing:border-box}
        .bundle-selector body{font-family:'Montserrat',system-ui,sans-serif;background:var(--ivory);color:var(--espresso);padding:64px 20px 88px;-webkit-font-smoothing:antialiased}
        .bundle-selector .intro{max-width:640px;margin:0 auto 52px;text-align:center}
        .bundle-selector .intro .kicker{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;color:var(--gold-deep);border-top:1px solid var(--gold-soft);border-bottom:1px solid var(--gold-soft);padding:8px 18px;margin-bottom:18px}
        .bundle-selector .intro h1{font-family:'Cinzel',serif;font-weight:600;font-size:clamp(30px,4.5vw,44px);line-height:1.12;letter-spacing:-0.01em}
        .bundle-selector .intro p{margin-top:14px;color:var(--cocoa);font-size:16px;line-height:1.6}
        .bundle-selector .grid{max-width:1240px;margin:0 auto;display:grid;gap:22px;grid-template-columns:repeat(auto-fit,minmax(228px,1fr));align-items:stretch}
        .bundle-selector .card{position:relative;background:var(--card);border:1px solid #EADFC8;border-radius:var(--radius);padding:34px 26px 28px;display:flex;flex-direction:column;box-shadow:0 1px 2px rgba(43,29,14,.04);transition:transform .18s ease, box-shadow .18s ease}
        .bundle-selector .card:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(43,29,14,.10)}
        .bundle-selector .card.popular{background:linear-gradient(180deg,var(--gold-wash) 0%,#FFFFFF 62%);border:1.5px solid var(--gold);box-shadow:0 16px 36px rgba(169,122,16,.18)}
        .bundle-selector .badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#B8860B,#D4AF37,#EAC85E);color:#231703;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;padding:7px 16px;border-radius:999px;white-space:nowrap;box-shadow:0 4px 10px rgba(169,122,16,.35)}
        .bundle-selector .tier{font-size:11px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:var(--cocoa);text-align:center;margin-bottom:10px}
        .bundle-selector .pkg{font-family:'Cinzel',serif;font-weight:600;font-size:22px;text-align:center;line-height:1.2;min-height:2.4em;display:flex;align-items:center;justify-content:center}
        .bundle-selector .was{text-align:center;margin-top:12px;color:#A99878;font-size:15px;text-decoration:line-through}
        .bundle-selector .price{font-family:'Montserrat',system-ui,sans-serif;font-weight:800;font-size:clamp(30px,3vw,38px);text-align:center;color:var(--gold-deep);margin-top:2px;letter-spacing:-0.02em;font-variant-numeric:tabular-nums}
        .bundle-selector .price .naira{font-size:.62em;vertical-align:baseline;margin-right:1px}
        .bundle-selector .save{display:block;width:max-content;margin:10px auto 0;background:var(--rose-soft);color:var(--rose);font-size:12.5px;font-weight:700;letter-spacing:.04em;padding:5px 12px;border-radius:999px}
        .bundle-selector ul{list-style:none;margin:24px 0 26px;flex:1}
        .bundle-selector li{display:flex;gap:10px;align-items:flex-start;padding:9px 0;font-size:14.5px;line-height:1.45;color:#4A3A24;border-bottom:1px solid #F2EAD8}
        .bundle-selector li:last-child{border-bottom:none}
        .bundle-selector li::before{content:"✦";color:var(--gold);font-size:12px;line-height:1.6;flex:0 0 auto}
        .bundle-selector li strong{color:var(--espresso);font-weight:600}
        .bundle-selector .cta{display:block;text-align:center;text-decoration:none;font-weight:700;font-size:14px;letter-spacing:.08em;text-transform:uppercase;padding:15px 12px;border-radius:12px;color:var(--gold-deep);border:1.5px solid var(--gold);transition:background .15s ease,color .15s ease,box-shadow .15s ease}
        .bundle-selector .cta:hover{background:var(--gold-wash)}
        .bundle-selector .cta:focus-visible{outline:3px solid var(--gold);outline-offset:2px}
        .bundle-selector .card.popular .cta{background:linear-gradient(135deg,#B8860B,#D4AF37,#EAC85E);color:#231703;border-color:transparent;box-shadow:0 8px 18px rgba(169,122,16,.32)}
        .bundle-selector .card.popular .cta:hover{filter:brightness(1.05)}
        .bundle-selector .footnote{max-width:640px;margin:40px auto 0;text-align:center;color:var(--cocoa);font-size:13.5px;line-height:1.6}
        .bundle-selector .product-imgs{display:flex;justify-content:center;gap:8px;margin:18px 0 4px}
        .bundle-selector .product-img-wrap{position:relative;display:inline-block}
        .bundle-selector .product-imgs img{width:60px;height:60px;object-fit:contain;border-radius:8px;background:#faf9f7;padding:4px}
        .bundle-selector .qty-badge{position:absolute;top:-6px;right:-6px;background:var(--gold-deep);color:#fff;font-size:10px;font-weight:700;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 4px rgba(0,0,0,.15)}
        @media (prefers-reduced-motion:reduce){.bundle-selector .card,.bundle-selector .card:hover{transition:none;transform:none}}
      `}</style>
      
      <div className="mb-12">
        <div className="grid grid-cols-1 gap-4">
          {[
            { n: '1', w: 600, h: 396 },
            { n: '2', w: 600, h: 96 },
            { n: '3', w: 600, h: 227 },
            { n: '4', w: 600, h: 163 },
            { n: '5', w: 600, h: 131 },
            { n: '6', w: 600, h: 386 },
          ].map(({ n, w, h }) => (
            <div
              key={n}
              className="rounded-xl overflow-hidden shadow-sm border border-[#EADFC8] bg-white w-full"
            >
              <img
                src={`${BASE_PATH}assets/${n}.webp`}
                alt={`Fulani Hair Gro result ${n}`}
                className="w-full h-auto object-cover"
                width={w}
                height={h}
                loading="lazy"
                decoding="async"
                fetchpriority="low"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <img
            src={`${BASE_PATH}assets/9.webp`}
            alt="Result 9"
            className="w-full h-auto rounded-xl border border-[#EADFC8] shadow-sm"
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
          <img
            src={`${BASE_PATH}assets/10.webp`}
            alt="Result 10"
            className="w-full h-auto rounded-xl border border-[#EADFC8] shadow-sm"
            width="600"
            height="600"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
        </div>
      </div>

      <header id="bundle-selector" className="intro">
        <span className="kicker">Fulani Hair Gro · 50% Off Bundles</span>
        <h1>Choose the bundle that fits your hair grow journey</h1>
        <p>Every bundle ships nationwide with payment on delivery. The more you commit, the more you save.</p>
      </header>

      <main className="grid">
        {PACKAGES.map((pkg) => (
          <section key={pkg.id} className={`card ${pkg.isPopular ? 'popular' : ''}`}>
            {pkg.isPopular && <span className="badge">★ Best Deal</span>}
            {pkg.label && <p className="tier">{pkg.label}</p>}
            <h2 className="pkg">{pkg.displayName || pkg.name}</h2>
            {pkg.id === 'PKG-004' ? (
              <>
                <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, letterSpacing: '0.14em', color: '#A87A10', textTransform: 'uppercase', margin: '8px 0 6px' }}>
                  BUY 2, GET 1 FREE
                </p>
                <ul style={{ listStyle: 'none', margin: '0 0 12px', padding: 0, textAlign: 'left', fontSize: '13px', lineHeight: '1.5', color: '#4A3A24' }}>
                  {pkg.offerBullets?.map((b, i) => (
                    <li key={i} style={{ padding: '5px 0', borderBottom: i < (pkg.offerBullets?.length || 0) - 1 ? '1px solid #F2EAD8' : 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: '#C9971C', fontWeight: 700 }}>✦</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ background: '#FFFBF3', border: '1.5px solid #EADFC8', borderRadius: 10, padding: '10px 12px', margin: '0 0 14px', width: '100%', boxSizing: 'border-box' }}>
                  {pkg.valueBreakdown?.map((row, i) => (
                    <div key={i} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10,
                      padding: '7px 0', borderBottom: i < (pkg.valueBreakdown?.length || 0) - 1 ? '1px solid #EADFC8' : 'none',
                      fontSize: '13px', color: row.strong ? '#92400E' : '#4A3A24',
                      fontWeight: row.strong ? 700 : 500,
                      background: row.strong ? 'linear-gradient(90deg,#FEF3C7,#FFF7ED)' : 'transparent',
                      margin: '0 -12px', paddingLeft: 12, paddingRight: 12,
                    }}>
                      <span style={{ flex: '1 1 auto', minWidth: 0, lineHeight: 1.4 }}>{row.label}</span>
                      <span style={{ flex: '0 0 auto', whiteSpace: 'nowrap', fontWeight: row.strong ? 800 : 600, fontVariantNumeric: 'tabular-nums' }}>{formatPrice(row.amount)}</span>
                    </div>
                  ))}
                </div>
                <p className="was" style={{ marginTop: 0 }}><span className="naira">₦</span>{formatPrice(pkg.referencePrice || pkg.originalPrice).replace('₦', '')}</p>
                <p className="price"><span className="naira">₦</span>{formatPrice(pkg.price).replace('₦', '')}</p>
                <span className="save" style={{ background: '#FEF3C7', color: '#92400E', fontSize: '12px', padding: '5px 14px' }}>
                  YOU SAVE {formatPrice((pkg.referencePrice || pkg.originalPrice) - pkg.price).replace('₦', '')}
                </span>
                {pkg.tagline && (
                  <p style={{ textAlign: 'center', fontSize: '12px', fontWeight: 800, color: '#166534', marginTop: '10px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {pkg.tagline}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="was"><span className="naira">₦</span>{formatPrice(pkg.originalPrice).replace('₦', '')}</p>
                <p className="price"><span className="naira">₦</span>{formatPrice(pkg.price).replace('₦', '')}</p>
                {pkg.deliveryFee > 0 && (
                  <p style={{ textAlign: 'center', fontSize: '13px', color: '#6B5638', marginTop: '4px' }}>
                    Product: ₦{pkg.price.toLocaleString()} + Delivery: ₦{pkg.deliveryFee.toLocaleString()} · Total payable: ₦{(pkg.price + pkg.deliveryFee).toLocaleString()}
                  </p>
                )}
                <span className="save">{formatSavings(pkg.originalPrice, pkg.price)}{pkg.isPopular ? ' 🔥' : ''}</span>
                <div className="product-imgs">
                  {getProductQty(pkg.items, 'shampoo') > 0 && (
                    <span className="product-img-wrap">
                      <img src={shampooImg} alt="Shampoo" width="60" height="60" loading="lazy" decoding="async" />
                      {getProductQty(pkg.items, 'shampoo') > 1 && <span className="qty-badge">×{getProductQty(pkg.items, 'shampoo')}</span>}
                    </span>
                  )}
                  {getProductQty(pkg.items, 'pomade') > 0 && (
                    <span className="product-img-wrap">
                      <img src={pomadeImg} alt="Pomade" width="60" height="60" loading="lazy" decoding="async" />
                      {getProductQty(pkg.items, 'pomade') > 1 && <span className="qty-badge">×{getProductQty(pkg.items, 'pomade')}</span>}
                    </span>
                  )}
                  {getProductQty(pkg.items, 'conditioner') > 0 && (
                    <span className="product-img-wrap">
                      <img src={conditionerImg} alt="Conditioner" width="60" height="60" loading="lazy" decoding="async" />
                      {getProductQty(pkg.items, 'conditioner') > 1 && <span className="qty-badge">×{getProductQty(pkg.items, 'conditioner')}</span>}
                    </span>
                  )}
                </div>
                <ul>
                  <li><strong>{pkg.items}</strong></li>
                  {pkg.freeItems && <li>{pkg.freeItems}</li>}
                  <li><strong>90-day money-back guarantee</strong></li>
                  <li>Nationwide delivery</li>
                  <li>Pay on delivery</li>
                </ul>
              </>
            )}
            <a className="cta" href={`#order-form?package=${pkg.slug}`}>Order Now{pkg.isPopular ? ' — Best Deal' : ''}</a>
          </section>
        ))}
      </main>

    </div>
  );
};
