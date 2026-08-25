import React, { useState, useRef, useEffect } from "react";
import { Gift, Package } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
// Extend your existing Package type with these fields, or merge below into it.

export interface BundleItem {
  name: string;
  qty: number;
  freeQty: number;
  freeName: string;
  image?: string;
}

export interface BundlePackage {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  originalPrice: number;
  badge: "popular" | "best_value" | null;
  description?: string;
  bestFor: string;
  bestForColor: string;
  bestForBg: string;
  socialProof?: string | null;
  items: BundleItem[];
}

export interface BundleDropdownProps {
  packages: BundlePackage[];
  value: string;                      // selected package id — wire to form.pkg
  onChange: (pkg: BundlePackage) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

// ─── Per-bundle identity colours ──────────────────────────────────────────────
const CARD_COLORS: Record<string, { idle: string; hover: string; sel: string; selBg: string; btn: string }> = {
  "PKG-004": { idle: "#22C55E", hover: "#16A34A", sel: "#16A34A", selBg: "#FFFDF5", btn: "#16A34A" },
};
const DEFAULT_COLOR = { idle: "#D1D5DB", hover: "#6B7280", sel: "#111827", selBg: "#F9FAFB", btn: "#111827" };

// ─── Inject keyframes once ────────────────────────────────────────────────────
const injectKeyframes = () => {
  if (typeof document !== "undefined" && !document.getElementById("bundle-shake-style")) {
    const s = document.createElement("style");
    s.id = "bundle-shake-style";
    s.textContent = `
      @keyframes bundleShake {
        0%,100% { transform: translateX(0); }
        15%      { transform: translateX(-4px); }
        30%      { transform: translateX(4px); }
        45%      { transform: translateX(-3px); }
        60%      { transform: translateX(3px); }
        75%      { transform: translateX(-1px); }
        90%      { transform: translateX(1px); }
      }
      @keyframes cardGlow {
        0%   { box-shadow: 0 0 0px rgba(34,197,94,0); }
        50%  { box-shadow: 0 0 22px rgba(34,197,94,0.45); }
        100% { box-shadow: 0 0 0px rgba(34,197,94,0); }
      }
      @keyframes badgePulse {
        0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
        25% { opacity: 0.4; transform: scale(1.2) rotate(25deg); }
        50% { opacity: 0.3; transform: scale(1.25) rotate(-25deg); }
        75% { opacity: 0.4; transform: scale(1.2) rotate(15deg); }
      }
    `;
    document.head.appendChild(s);
  }
};

// ─── CornerBadge ──────────────────────────────────────────────────────────────
function CornerBadge({ badge }: { badge: BundlePackage["badge"] }) {
  if (!badge) return null;
  const cfg = badge === "popular"
    ? { label: "🔥 BEST DEAL", bg: "#DC2626", color: "#fff" }
    : { label: "🏆 BEST VALUE",   bg: "#B45309", color: "#fff" };
  return (
    <div style={{
      position: "absolute", top: -2, right: -2,
      background: cfg.bg, color: cfg.color,
      fontSize: 11, fontWeight: 800, padding: "5px 12px",
      borderRadius: "0 10px 0 10px", letterSpacing: "0.04em",
      zIndex: 2,
      animation: "badgePulse 0.5s ease-in-out infinite",
    }}>
      {cfg.label}
    </div>
  );
}

// ─── ItemRow ──────────────────────────────────────────────────────────────────
function ItemRow({ item, bundleId }: { item: BundleItem; bundleId: string }) {
  // STYLE 1: Red Ribbon for PKG-004 (Self Love Plus B2GOF / ₦55,950)
  // STYLE 2: Solid Green Pill for PKG-005 (Family Saves / ₦180,800)
  const isPremiumBundle = bundleId === 'PKG-004';
  const isGreenPillBundle = bundleId === 'PKG-005';

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
      {item.image ? (
        // Show repeated images when qty > 1, single image otherwise
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          {Array.from({ length: item.qty }).map((_, i) => (
            <img
              key={i}
              src={item.image}
              alt={item.name}
              loading="lazy"
              decoding="async"
              width="36"
              height="36"
              style={{
                width: 36, height: 36, borderRadius: 8,
                objectFit: "cover", background: "#F3F4F6",
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{
          width: 32, height: 32, borderRadius: 8, flexShrink: 0,
          background: "#2D5016", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 12, fontWeight: 800,
        }}>
          {item.qty}×
        </div>
      )}
      <span style={{ fontSize: 14, fontWeight: 500, color: "#111" }}>{item.name}</span>
      {item.freeQty > 0 && (
        <>
          <span style={{ fontSize: 13, color: "#9CA3AF" }}>+</span>
          {/* Free product image(s) */}
          {item.image && (
            <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
              {Array.from({ length: item.freeQty }).map((_, i) => (
                <img
                  key={i}
                  src={item.image}
                  alt={item.freeName}
                  loading="lazy"
                  decoding="async"
                  style={{ width: 32, height: 32, borderRadius: 6, objectFit: "cover", background: "#F3F4F6" }}
                />
              ))}
            </div>
          )}
          {isPremiumBundle ? (
            // STYLE 1: Red Ribbon (two-part pill)
            <div style={{
              display: "inline-flex",
              alignItems: "stretch",
              borderRadius: 8,
              overflow: "hidden",
              fontSize: 13,
              boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
            }}>
              <div style={{
                background: "#D63232",
                color: "#FFFFFF",
                padding: "7px 10px",
                letterSpacing: "0.04em",
                fontWeight: 600,
              }}>
                FREE
              </div>
              <div style={{
                background: "#FFFFFF",
                color: "#D63232",
                border: "1.5px solid #D63232",
                borderLeft: "none",
                padding: "7px 12px",
                fontWeight: 600,
              }}>
                {item.freeQty} {item.freeName}
              </div>
            </div>
          ) : isGreenPillBundle ? (
            // STYLE 2: Solid Green Pill with gift icon
            <div style={{
              background: "#2D7A2F",
              color: "#FFFFFF",
              padding: "7px 14px",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}>
              <Gift size={14} color="#FFFFFF" />
              FREE {item.freeQty} {item.freeName}
            </div>
          ) : (
            // Default style for other bundles (original styling)
            <div style={{
              border: "1.5px dashed #D97706",
              borderRadius: 8, padding: "3px 10px",
              fontSize: 12, fontWeight: 700, color: "#D97706",
              background: "#FFFBEB",
            }}>
              FREE {item.freeQty} {item.freeName}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── EquationRow (for PKG-004 only) ───────────────────────────────────────────────
function EquationRow({ itemName }: { itemName: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
      {/* "Pay for X [Item]" pill */}
      <div style={{
        background: "#2D3E1F",
        color: "#FFFFFF",
        padding: "6px 12px",
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 13,
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        Pay for <span style={{ background: "rgba(255,255,255,0.2)", padding: "1px 7px", borderRadius: 4, fontSize: 13 }}>2</span> {itemName}
      </div>

      {/* "+" connector */}
      <span style={{ fontSize: 16, fontWeight: 600, color: "#2D3E1F", margin: "0 2px" }}>+</span>

      {/* "Get X FREE" pill */}
      <div style={{
        background: "#FFFFFF",
        color: "#D63232",
        border: "1.5px solid #D63232",
        padding: "6px 12px",
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 13,
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        Get <span style={{ background: "#D63232", color: "#FFFFFF", padding: "1px 7px", borderRadius: 4, fontSize: 13 }}>1</span> FREE
      </div>

      {/* "=" symbol */}
      <span style={{ fontSize: 18, fontWeight: 700, color: "#2D7A2F", margin: "0 4px" }}>=</span>

      {/* "X [Item]" total pill */}
      <div style={{
        background: "#2D7A2F",
        color: "#FFFFFF",
        padding: "6px 14px",
        borderRadius: 6,
        fontWeight: 700,
        fontSize: 14,
        whiteSpace: "nowrap",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        <span style={{ background: "#FFFFFF", color: "#2D7A2F", padding: "1px 8px", borderRadius: 4, fontSize: 13, fontWeight: 700 }}>3</span> {itemName}
      </div>
    </div>
  );
}

// ─── YoullReceiveBlock (for PKG-004 only) ───────────────────────────────────────────
function YoullReceiveBlock() {
  return (
    <div style={{
      background: "#2D7A2F",
      color: "#FFFFFF",
      borderRadius: 10,
      padding: "14px 18px",
      marginTop: 14,
    }}>
      {/* Header */}
      <div style={{
        fontSize: 11,
        letterSpacing: "0.1em",
        fontWeight: 600,
        opacity: 0.9,
        textTransform: "uppercase",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}>
        <Package size={14} color="#FFFFFF" />
        You'll Receive — All in One Package
      </div>

      {/* Item lines */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, fontSize: 15, fontWeight: 600 }}>
        <div style={{
          width: 28, height: 28,
          background: "#FFFFFF",
          color: "#2D7A2F",
          borderRadius: "50%",
          fontWeight: 700,
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          3
        </div>
        <span>Shampoos <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.85 }}>(500ml each)</span></span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, fontSize: 15, fontWeight: 600 }}>
        <div style={{
          width: 28, height: 28,
          background: "#FFFFFF",
          color: "#2D7A2F",
          borderRadius: "50%",
          fontWeight: 700,
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          3
        </div>
        <span>Conditioners <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.85 }}>(500ml each)</span></span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 15, fontWeight: 600 }}>
        <div style={{
          width: 28, height: 28,
          background: "#FFFFFF",
          color: "#2D7A2F",
          borderRadius: "50%",
          fontWeight: 700,
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          3
        </div>
        <span>Pomades <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.85 }}>(150ml each)</span></span>
      </div>
    </div>
  );
}

// ─── BundleCard ───────────────────────────────────────────────────────────────
interface BundleCardProps {
  bundle: BundlePackage;        // bundle data
  isSelected: boolean;          // controlled selection state from parent
  onSelect: (id: string) => void;  // click handler from parent
  showCTA?: boolean;            // default true; pass false for inline usage
  variant?: 'main' | 'secondary'; // default 'main'; pass 'secondary' for de-emphasized styling
  // Legacy props for dropdown compatibility
  isHov?: boolean;
  onEnter?: () => void;
  onLeave?: () => void;
}

function BundleCard({ bundle, isSelected, onSelect, showCTA = true, variant = 'main', isHov, onEnter, onLeave }: BundleCardProps) {
  const discount = Math.round((1 - bundle.price / bundle.originalPrice) * 100);
  const c = CARD_COLORS[bundle.id] ?? DEFAULT_COLOR;

  // Local hover state for CTA button when used inline (no parent hover management)
  const [ctaHov, setCtaHov] = React.useState(false);

  // Local card hover state for inline usage
  const [cardHov, setCardHov] = React.useState(false);

  // Use parent hover if provided, otherwise use local state
  const effectiveHov = isHov !== undefined ? isHov : cardHov;

  // Inject keyframes on mount only (client-side)
  React.useEffect(() => {
    injectKeyframes();
  }, []);
  
  const borderColor = isSelected ? c.sel : effectiveHov ? c.hover : c.idle;
  const bg = isSelected ? c.selBg : effectiveHov ? c.selBg : "#fff";
  
  const isSecondary = variant === 'secondary';
  const cardPadding = isSecondary ? "12px 16px 10px" : "16px 16px 14px";
  const cardOpacity = isSecondary ? 0.85 : 1;
  const borderWidth = bundle.id === 'PKG-004' ? "4px" : (isSecondary ? "2px" : "3px");

  return (
    <div
      id={bundle.id === 'PKG-004' ? 'bundle-plus-b2gof' : undefined}
      onClick={() => onSelect(bundle.id)}
      onMouseEnter={() => {
        setCardHov(true);
        if (onEnter) onEnter();
      }}
      onMouseLeave={() => {
        setCardHov(false);
        if (onLeave) onLeave();
      }}
      style={{
        position: "relative", borderRadius: 12, padding: cardPadding,
        border: `${borderWidth} solid ${borderColor}`, background: bg,
        cursor: "pointer", transition: "background 0.15s, border-color 0.15s, box-shadow 0.15s, filter 0.15s", marginBottom: 2,
        outline: isSelected ? `1px solid ${c.idle}` : "none",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        filter: cardHov && !isSelected ? "brightness(1.05)" : "brightness(1)",
        opacity: cardOpacity,
      }}
    >
      <CornerBadge badge={bundle.badge} />

      {/* Name + price */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", paddingRight: bundle.badge ? 100 : 0 }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, color: "#111" }}>{bundle.name}</div>
          {bundle.subtitle && (
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 2 }}>{bundle.subtitle}</div>
          )}
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 13, color: "#9CA3AF", textDecoration: "line-through" }}>
            {fmt(bundle.originalPrice)}
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#166534", lineHeight: 1.1 }}>
            {fmt(bundle.price)}
          </div>
          <div style={{
            display: "inline-block", marginTop: 3,
            background: "#FEE2E2", color: "#DC2626",
            fontSize: 11, fontWeight: 800, padding: "2px 7px", borderRadius: 6,
          }}>
            {discount}% OFF
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginTop: 12 }}>
        {bundle.id === 'PKG-004' ? (
          // Special equation rows for SELF LOVE PLUS B2GOF
          <>
            <EquationRow itemName="Shampoo" />
            <EquationRow itemName="Conditioner" />
            <EquationRow itemName="Pomade" />
            <YoullReceiveBlock />
          </>
        ) : (
          // Standard item rows for all other bundles
          bundle.items.map((item, i) => <ItemRow key={i} item={item} bundleId={bundle.id} />)
        )}
      </div>

      {/* Description */}
      {bundle.description && (
        <div style={{ fontSize: 12, color: "#4B5563", textAlign: "center", marginTop: 8, lineHeight: 1.5 }}>
          {bundle.description}
        </div>
      )}

      {/* Best for */}
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <span style={{
          fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20,
          background: bundle.bestForBg, color: bundle.bestForColor,
        }}>
          Best for: {bundle.bestFor}
        </span>
      </div>

      {/* Social proof */}
      {bundle.socialProof && (
        <div style={{
          marginTop: 10, padding: "8px 12px", borderRadius: 8,
          background: "#ECFDF5", color: "#065F46",
          fontSize: 13, fontWeight: 700, textAlign: "center",
        }}>
          {bundle.socialProof}
        </div>
      )}

      {/* CTA */}
      {showCTA && (
        <div style={{ marginTop: 12 }}>
        {isSelected ? (
          <div style={{
            width: "100%", padding: "12px 0", borderRadius: 10, boxSizing: "border-box",
            background: c.btn, color: "#fff", fontSize: 14, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            letterSpacing: "0.01em",
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#fff" strokeWidth="1.5" />
              <polyline points="4.5,8 7,10.5 11.5,5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            ✓ Bundle Selected
          </div>
        ) : (
          <div
            onMouseEnter={() => setCtaHov(true)}
            onMouseLeave={() => setCtaHov(false)}
            style={{
              width: "100%", padding: "12px 0", borderRadius: 10, boxSizing: "border-box",
              background: ctaHov ? "#22C55E" : "#F3F4F6",
              border: ctaHov ? `2px solid #16A34A` : "1.5px solid #D1D5DB",
              color: ctaHov ? "#fff" : "#374151",
              fontSize: 14, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "background 0.18s, border-color 0.18s, color 0.18s",
              animation: ctaHov ? "bundleShake 0.55s ease-out" : "none",
              boxShadow: ctaHov ? `0 4px 14px rgba(34,197,94,0.5)` : "none",
              letterSpacing: "0.01em",
            }}
          >
            {isHov ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Click Here To Buy This Bundle
              </>
            ) : "Click Here To Buy This Bundle"}
          </div>
        )}
        </div>
      )}
    </div>
  );
}

export { BundleCard };
