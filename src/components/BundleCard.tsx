import { useState } from "react";

const bundle = {
  name: "Complete Hair Growth System",
  subtitle: "The 30-Day Test",
  priceWas: "₦65,500",
  priceNow: "₦27,450",
  discount: "50% OFF",
  tag: "New Customer Trial",
  items: [
    { qty: "1×", name: "500ml Heritage Shampoo" },
    { qty: "1×", name: "150g Growth Pomade" },
    { qty: "1×", name: "500ml Voluminous Conditioner" },
  ],
};

export default function BundleCard({ onSelect }: { onSelect?: (bundle: any) => void }) {
  const [selected, setSelected] = useState(false);

  const handleSelect = () => {
    setSelected(true);
    onSelect?.(bundle);
  };

  return (
    <>
      <style>{`
        .bc-card {
          background: #ffffff;
          border-radius: 24px;
          padding: 32px 28px 28px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.04), 0 12px 40px rgba(0,0,0,0.09);
          position: relative;
          overflow: hidden;
          font-family: 'Montserrat', sans-serif;
          animation: bc-rise 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes bc-rise {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #1f4d34, #3a8c5c, #1f4d34);
        }
        .bc-top-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .bc-left { display: flex; align-items: flex-start; gap: 12px; }
        .bc-radio {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 1.5px solid;
          border-color: ${selected ? "#1f4d34" : "#ccc"};
          background: ${selected ? "#1f4d34" : "transparent"};
          flex-shrink: 0;
          margin-top: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .bc-radio-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: white;
          opacity: ${selected ? 1 : 0};
          transition: opacity 0.2s;
        }
        .bc-name {
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-weight: 800;
          color: #111;
          line-height: 1.15;
          letter-spacing: -0.01em;
        }
        .bc-sub {
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #aaa;
          margin-top: 3px;
          text-align: left;
        }
        .bc-price-col { text-align: right; flex-shrink: 0; }
        .bc-price-was {
          font-size: 12px;
          color: #ccc;
          text-decoration: line-through;
          font-weight: 300;
        }
        .bc-price-now {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #1f4d34;
          line-height: 1;
          margin-top: 1px;
        }
        .bc-off {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #c0392b;
          background: #fff0ee;
          border: 1px solid #fad4cf;
          border-radius: 4px;
          padding: 2px 6px;
          margin-top: 5px;
        }
        .bc-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e8e3dc, transparent);
          margin: 18px 0;
        }
        .bc-section-label {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #bbb;
          margin-bottom: 10px;
        }
        .bc-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .bc-item {
          display: flex;
          align-items: center;
          gap: 13px;
          background: #faf9f7;
          border: 1px solid #eeebe5;
          border-radius: 12px;
          padding: 12px 16px;
          transition: background 0.2s, transform 0.2s;
          animation: bc-rise 0.55s cubic-bezier(0.22,1,0.36,1) both;
        }
        .bc-item:hover { background: #f2efe9; transform: translateX(3px); }
        .bc-qty {
          width: 30px; height: 30px;
          border-radius: 8px;
          background: #1f4d34;
          color: #fff;
          font-size: 12px;
          font-weight: 600;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .bc-item-name {
          font-size: 15px;
          font-weight: 500;
          color: #1a1a1a;
          letter-spacing: 0.01em;
        }
        .bc-tag-row { display: flex; justify-content: center; margin-bottom: 20px; }
        .bc-tag {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: #1f4d34;
          background: #ebf5f0;
          border: 1px solid #c0dece;
          border-radius: 100px;
          padding: 5px 14px;
        }
        .bc-cta {
          width: 100%;
          padding: 18px 24px;
          background: #1f4d34;
          border: none;
          border-radius: 14px;
          font-family: 'Montserrat', sans-serif;
          font-size: 16px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: #ffffff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          box-shadow: 0 4px 18px rgba(31,77,52,0.35);
        }
        .bc-cta:hover {
          background: #163824;
          transform: translateY(-2px);
          box-shadow: 0 8px 28px rgba(31,77,52,0.45);
        }
        .bc-cta:active { transform: translateY(0); }
        .bc-cta-arrow { font-size: 18px; transition: transform 0.25s; }
        .bc-cta:hover .bc-cta-arrow { transform: translateX(5px); }
        .bc-micro {
          text-align: center;
          font-size: 11px;
          color: #bbb;
          font-weight: 300;
          margin-top: 10px;
          letter-spacing: 0.03em;
        }
      `}</style>

      <div className="bc-card">
        {/* Header */}
        <div className="bc-top-row">
          <div className="bc-left">
            <div className="bc-radio" onClick={() => setSelected(!selected)}>
              <div className="bc-radio-dot" />
            </div>
            <div>
              <div className="bc-name">{bundle.name}</div>
              <div className="bc-sub">{bundle.subtitle}</div>
            </div>
          </div>
          <div className="bc-price-col">
            <div className="bc-price-was">{bundle.priceWas}</div>
            <div className="bc-price-now">{bundle.priceNow}</div>
            <div className="bc-off">{bundle.discount}</div>
          </div>
        </div>

        <div className="bc-divider" />

        {/* Items */}
        <div className="bc-section-label">What's included</div>
        <div className="bc-items">
          {bundle.items.map((item, i) => (
            <div
              className="bc-item"
              key={i}
              style={{ animationDelay: `${0.1 + i * 0.08}s` }}
            >
              <div className="bc-qty">{item.qty}</div>
              <span className="bc-item-name">{item.name}</span>
            </div>
          ))}
        </div>

        {/* Tag */}
        <div className="bc-tag-row">
          <span className="bc-tag">{bundle.tag}</span>
        </div>

        {/* CTA */}
        <button className="bc-cta" onClick={handleSelect}>
          {selected ? "Bundle Selected ✓" : "Select This Bundle"}
          {!selected && <span className="bc-cta-arrow">→</span>}
        </button>
        <p className="bc-micro">Pay on Delivery · Easy returns</p>
      </div>
    </>
  );
}
