import { PACKAGES } from '@/config/packages';
import { useState, useEffect, useCallback, useMemo, useRef, CSSProperties, memo } from 'react';
import { getCheckoutAttemptId, clearCheckoutAttemptId } from '@/utils/orderId';
import { fireTikTokLeadSync, fireTikTokInitiateCheckout } from '@/utils/tiktokTracking';
import { meta } from '@/utils/metaTracking';
import { PHONE_DISPLAY } from '@/config/api';
import { BundleCard, BundlePackage } from "./BundleDropdown";

const BASE_PATH = import.meta.env.BASE_URL || '/';

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim().toLowerCase());
const isValidPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return /^(?:0\d{10}|234\d{10}|\d{10})$/.test(digits);
};

function extractCityFromAddress(
  state: string,
  address: string,
  lgasData?: Record<string, string[]> | null
): string | undefined {
  if (!state || !address) return undefined;
  const lower = address.toLowerCase();
  const lgas = lgasData?.[state];
  if (lgas) {
    for (const lga of lgas) {
      const area = lga.toLowerCase();
      if (area.length > 2 && lower.includes(area)) {
        return area;
      }
    }
  }
  // Fallback to the last comma/line segment, skipping if it equals the state name
  const parts = address.split(/,|\n/).map(p => p.trim()).filter(Boolean);
  if (parts.length === 0) return undefined;
  const last = parts[parts.length - 1].toLowerCase();
  if (last !== state.toLowerCase() && last.length > 2) return last;
  if (parts.length > 1) {
    const prev = parts[parts.length - 2].toLowerCase();
    if (prev !== state.toLowerCase() && prev.length > 2) return prev;
  }
  return undefined;
}

// Debounce hook for performance optimization
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const packageMapping: Record<string, string> = {
  'PKG-001': 'Self Love Plus',
  'PKG-002': 'Self Love Return',
  'PKG-003': 'Self Love B2GOF',
  'PKG-004': 'Self Love Plus B2GOF',
  'PKG-005': 'Family Saves'
};

const packageNameToId: Record<string, string> = Object.fromEntries(Object.entries(packageMapping).map(([id, name]) => [String(name).trim().toUpperCase(), id]));
const resolvePkgId = (v: any): string => {
  const s = String(v ?? "").trim();
  if (!s) return "";
  if (s.startsWith("PKG-")) return s;
  const key = s.toUpperCase();
  return packageNameToId[key] || "";
};

const PACKAGE_CONTENTS: Record<string, string[]> = {
  'Self Love Plus': ['1 500ml Net Shampoo', '1 150ml Net Pomade', '1 500ml Net Conditioner'],
  'Self Love Return': ['3 x 150ml Net Pomade'],
  'Self Love B2GOF': ['3 500ml Net Shampoo', '3 x 150ml Net Pomade'],
  'Self Love Plus B2GOF': ['3 500ml Net Shampoo', '3 x 150ml Net Pomade', '3 500ml Net Conditioner'],
  'Family Saves': ['10 500ml Net Shampoo', '10 150ml Net Pomade', '10 500ml Net Conditioner']
};

const nigerianStates = ['Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'FCT', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'];

const lgasByState: { [key: string]: string[] } = {
  'Lagos': ['Agege', 'Ajeromi-Ifelodun', 'Alimosho', 'Amuwo-Odofin', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa', 'Ibeju-Lekki', 'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland', 'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
  'FCT': ['Abaji', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Municipal Area Council'],
  'Rivers': ['Port Harcourt', 'Obio-Akpor', 'Okrika', 'Ogu-Bolo', 'Eleme', 'Tai', 'Gokana', 'Khana', 'Oyigbo', 'Bonny', 'Degema'],
  'Oyo': ['Ibadan North', 'Ibadan South-West', 'Ibadan South-East', 'Ibadan North-East', 'Akinyele', 'Lagelu', 'Egbeda', 'Oluyole'],
  'Kano': ['Kano Municipal', 'Dala', 'Gwale', 'Fagge', 'Tarauni', 'Nassarawa', 'Kumbotso', 'Ungogo'],
  'Kaduna': ['Kaduna North', 'Kaduna South', 'Chikun', 'Igabi', 'Zaria', 'Sabon Gari'],
};


// All styles as objects
const S: { [key: string]: CSSProperties } = {
  container: { margin: '0 auto', padding: '40px 20px', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#fafbfc' },
  box: { background: '#ffffff', borderRadius: 16, padding: '36px 32px 32px', width: '100%', position: 'relative', overflow: 'visible', boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)' },
  // Mobile-specific container styles
  containerMobile: { padding: '0', maxWidth: '100%' },
  boxMobile: { padding: '16px 8px', borderRadius: 0 },
  step: { fontSize: 14, fontWeight: 600, color: '#666', margin: '0 0 8px' },
  bar: { height: 8, background: '#E0E0E0', borderRadius: 4, overflow: 'hidden', marginBottom: 20 },
  fill: { height: '100%', background: 'linear-gradient(90deg, #36CA37, #2eb82e)', transition: 'width 0.3s' },
  label: { display: 'block', fontSize: 13, fontWeight: 800, color: '#1a1a1a', textTransform: 'uppercase' as const, margin: '16px 0 8px' },
  req: { color: '#D30000' },
  input: { width: '100%', padding: '14px 16px', background: '#F9F9F9', border: '2px solid #DAA520', borderRadius: 10, fontSize: 16, fontWeight: 600, color: '#1a1a1a', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' },
  inputFocus: { borderColor: '#DAA520' },
  hint: { fontSize: 12, color: '#666', margin: '6px 0 0' },
  pkgs: { display: 'flex', flexDirection: 'column' as const, gap: 10, marginTop: 12 },
  card: { display: 'block', position: 'relative' as const, padding: '20px 18px', background: '#ffffff', border: '2px solid #e5e7eb', borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s ease', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' },
  cardSel: { borderColor: '#059669', background: '#f0fdf4', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.15)' },
  // Mobile-specific styles
  cardMobile: { padding: '10px 10px 10px 36px' },
  cardSelMobile: { padding: '10px 10px 10px 36px' },
  radio: { position: 'absolute' as const, left: 16, top: 18, width: 24, height: 24, border: '3px solid #d1d5db', borderRadius: '50%', background: '#fff', boxSizing: 'border-box' as const, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  radioSel: { borderColor: '#059669', background: '#059669' },
  check: { color: '#fff', fontSize: 14, fontWeight: 'bold' as const },
  pop: { position: 'absolute' as const, top: -10, right: 10, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, padding: '4px 8px', borderRadius: 12, textTransform: 'uppercase' as const },
  r1: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 },
  name: { fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: '1.3' },
  nameMobile: { fontSize: 14 },
  pr: { textAlign: 'right' as const },
  old: { fontSize: 12, color: '#6b7280', textDecoration: 'line-through', marginRight: 6 },
  newP: { fontSize: 20, fontWeight: 800, color: '#059669' },
  newPMobile: { fontSize: 16 },
  r2: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  items: { fontSize: 12, fontWeight: 600, color: '#555' },
  itemsMobile: { fontSize: 11 },
  disc: { fontSize: 12, fontWeight: 800, color: '#D30000' },
  discMobile: { fontSize: 11 },
  free: { background: 'linear-gradient(135deg, #2E8B2E, #3CB371)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '6px 12px', borderRadius: 6, textAlign: 'center' as const, margin: '6px 0' },
  freeMobile: { fontSize: 10, padding: '4px 8px', margin: '4px 0' },
  dur: { fontSize: 10, fontWeight: 600, color: '#888', textAlign: 'center' as const, marginTop: 4 },
  durMobile: { fontSize: 9, marginTop: 2 },
  pay: { fontSize: 10, color: '#666', textAlign: 'center' as const, margin: '16px 0' },
  // Mobile styles for "How did you hear about us"
  hearAboutUsGridMobile: { display: 'flex', flexDirection: 'column' as const, gap: 12, marginTop: 12 },
  hearAboutUsOptionMobile: { display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', color: '#1a1a1a', minHeight: 44, padding: '12px', background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 8, fontSize: 14, fontWeight: 600, transition: 'background 0.2s' },
  hearAboutUsOptionHoverMobile: { background: '#F0F0F0', borderColor: '#DAA520' },
  btn: { width: '100%', background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff', border: 'none', borderRadius: 12, padding: '20px 24px', fontSize: 17, fontWeight: '700', letterSpacing: '0.02em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.3s ease', fontFamily: 'Inter, system-ui, sans-serif', boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)', textTransform: 'none' as const },
  btnDis: { background: '#d1d5db', cursor: 'not-allowed', boxShadow: 'none' },
  back: { background: '#F0F0F0', color: '#666', border: 'none', borderRadius: 10, padding: '18px 24px', fontSize: 14, fontWeight: 'bold' as const, cursor: 'pointer', fontFamily: 'inherit' },
  sum: { background: '#F9F9F9', border: '1px solid #E0E0E0', borderRadius: 10, padding: 16, marginTop: 16 },
  sr: { display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#666', margin: '8px 0' },
  tot: { display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 800, borderTop: '1px solid #E0E0E0', paddingTop: 12, marginTop: 8 },
  suc: { textAlign: 'center' as const, padding: '40px 20px' },
  sucIcon: { width: 60, height: 60, background: '#36CA37', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, color: '#fff', margin: '0 auto 20px' },
};

const postOrderToFulani = (bodyString: string) => {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      const blob = new Blob([bodyString], { type: 'application/x-www-form-urlencoded;charset=UTF-8' });
      const ok = navigator.sendBeacon(WEBHOOK_URL, blob);
      if (ok) return;
    }
  } catch {
    // ignore
  }

  fetch(WEBHOOK_URL, {
    method: 'POST',
    mode: 'no-cors',
    keepalive: true,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: bodyString
  }).catch((error) => {
    console.error('postOrderToFulani fallback fetch failed:', error);
  });
};

function OrderFormEmbed() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    address: '',
    state: '',
    package: '',
    deliveryDate: '',
    deliveryType: 'next_day'
  });

  // Load LGA data lazily so it does not end up in the main JS bundle.
  const nigeriaLgasRef = useRef<Record<string, string[]> | null>(null);
  useEffect(() => {
    import('@/data/nigeriaLGAs.json')
      .then((mod: any) => {
        nigeriaLgasRef.current = mod.default as Record<string, string[]>;
      })
      .catch(() => {});
  }, []);

  // Feed form state into the module's InitiateCheckout lifecycle.
  // The module fires once name + valid Nigerian phone are present.
  useEffect(() => {
    const city = extractCityFromAddress(form.state, form.address, nigeriaLgasRef.current);
    const pkg = form.package ? PACKAGES.find(p => p.slug === form.package) : undefined;
    const deliveryFee = form.deliveryType === 'same_day' ? 5000 : 3000;
    const value = pkg ? pkg.price + deliveryFee : undefined;
    meta.updateCheckout({
      name: form.name,
      phone: form.phone,
      email: form.email,
      state: form.state,
      city,
      contentName: pkg?.name,
      contentIds: pkg ? [pkg.sku || pkg.id] : undefined,
      contentType: 'product',
      value,
      currency: 'NGN',
      numItems: pkg?.quantity,
    }).catch(() => {});
  }, [form.name, form.phone, form.email, form.state, form.address, form.package, form.deliveryType]);

  // Delivery date constraints must be computed on the client only
  // to avoid hydration mismatches between server and browser time.
  const [deliveryDateMin, setDeliveryDateMin] = useState('');
  const [deliveryDateMax, setDeliveryDateMax] = useState('');
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const max = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0];
    setDeliveryDateMin(today);
    setDeliveryDateMax(max);
  }, []);

  // Auto-select package from URL parameter
  useEffect(() => {
    const extractPackageFromUrl = () => {
      // Check both query parameters and hash fragment
      let selectedPackage = null;
      
      // Debug: Log current URL
      console.log('Current URL:', window.location.href);
      console.log('Current hash:', window.location.hash);
      console.log('Current search:', window.location.search);
      
      // Try query parameters first
      const urlParams = new URLSearchParams(window.location.search);
      selectedPackage = urlParams.get('package');
      console.log('Package from query params:', selectedPackage);
      
      // If not found, try hash fragment format (#order-form?package=...)
      if (!selectedPackage && window.location.hash) {
        const hashString = window.location.hash.split('?')[1] || '';
        console.log('Hash string for params:', hashString);
        const hashParams = new URLSearchParams(hashString);
        selectedPackage = hashParams.get('package');
        console.log('Package from hash params:', selectedPackage);
      }
      
      return selectedPackage;
    };

    // Initial check
    const selectedPackage = extractPackageFromUrl();
    if (selectedPackage) {
      console.log('Setting package to:', selectedPackage);
      setForm(prev => ({ ...prev, package: selectedPackage }));
      
      // Debug: Log the form state after setting
      setTimeout(() => {
        console.log('Form state after package set:', { package: selectedPackage });
      }, 100);
    }

    // Also listen for hash changes (in case user navigates after page load)
    const handleHashChange = () => {
      const selectedPackage = extractPackageFromUrl();
      if (selectedPackage) {
        console.log('Hash change - setting package to:', selectedPackage);
        setForm(prev => ({ ...prev, package: selectedPackage }));
        
        // Ensure we stay on the form after hash change
        setTimeout(() => {
          const formElement = document.getElementById('order-form');
          if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  const [submitting, setSubmitting] = useState(false);
  const submitStarted = useRef(false);

  const submit = async () => {
    if (submitting || submitStarted.current) return;
    submitStarted.current = true;

    // Validate required fields
    console.log('[OrderForm] Form state before validation:', form);
    if (!form.name || !form.phone || !form.whatsapp || !form.email || !form.address || !form.state || !form.package || !form.deliveryDate) {
      const missing = [];
      if (!form.name) missing.push('name');
      if (!form.phone) missing.push('phone');
      if (!form.whatsapp) missing.push('WhatsApp number');
      if (!form.email) missing.push('email address');
      if (!form.address) missing.push('address');
      if (!form.state) missing.push('state');
      if (!form.package) missing.push('package');
      if (!form.deliveryDate) missing.push('preferred delivery date');
      alert(`Please fill in all required fields. Missing: ${missing.join(', ')}`);
      submitStarted.current = false;
      return;
    }
    if (!isValidEmail(form.email)) {
      alert('Please enter a valid email address.');
      submitStarted.current = false;
      return;
    }
    if (!isValidPhone(form.phone)) {
      alert('Please enter a valid Nigerian phone number.');
      submitStarted.current = false;
      return;
    }
    if (!isValidPhone(form.whatsapp)) {
      alert('Please enter a valid Nigerian WhatsApp number.');
      submitStarted.current = false;
      return;
    }

    setSubmitting(true);

    try {
      // Reuse the same checkout attempt ID for this submission (and any
      // immediate retry) so the backend can deduplicate accidental double-clicks.
      const checkoutAttemptId = getCheckoutAttemptId();
      const pkg = PACKAGES.find(p => p.slug === form.package);
      const packagePrice = pkg?.price || 0;

      if (packagePrice === 0) {
        alert('Please select a package');
        submitStarted.current = false;
        setSubmitting(false);
        return;
      }

      const currentDeliveryFee = form.deliveryType === 'same_day' ? 5000 : 3000;
      const total = packagePrice + currentDeliveryFee;

      const city = extractCityFromAddress(form.state, form.address, nigeriaLgasRef.current);

      const trackingContext = meta.getTrackingContext();

      const payload = {
        checkoutAttemptId,
        name: form.name,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email.trim().toLowerCase(),
        address: form.address,
        state: form.state,
        package: pkg?.name || form.package,
        amount: total,
        productAmount: packagePrice,
        deliveryFee: currentDeliveryFee,
        quantity: pkg?.quantity || 1,
        sku: pkg?.sku || '',
        deliveryDate: form.deliveryDate || '',
        lga: form.lga || '',
        city: city || undefined,
        landmark: form.landmark || '',
        paymentMethod: 'Pay on Delivery',
        utm_source: localStorage.getItem('src') || '',
        click_id: '',
        landing_page_url: window.location.href,
        metaExternalId: trackingContext.externalId,
        fbp: trackingContext.fbp ?? undefined,
        fbc: trackingContext.fbc ?? undefined,
      };

      console.log('[OrderForm] Sending payload to /api/order:', payload);

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.error || 'Failed to submit order. Please try again.');
      }

      // Server is the authority on the final confirmed order ID.
      const confirmedOrderId = result.orderId;
      const thankYouOrderId = confirmedOrderId;

      // The checkout attempt ID is consumed; a future checkout must generate a new one.
      clearCheckoutAttemptId();

      // Persist confirmed order data so Thank You page can fire Purchase event
      try {
        localStorage.setItem('fhg_order_data', JSON.stringify({
          orderId: thankYouOrderId,
          email: payload.email,
          phone: payload.phone,
          fullName: payload.name,
          totalAmount: total,
          packageAmount: packagePrice,
          deliveryFee: currentDeliveryFee,
          paymentType: 'PBD',
          packageName: payload.package,
          state: payload.state,
          lga: payload.lga,
          numItems: pkg?.quantity || 1,
        }));
      } catch (e) {
        console.error('[OrderForm] Failed to persist order data:', e);
      }

      window.location.replace(`/thank-you${thankYouOrderId ? `?order=${thankYouOrderId}` : ''}`);
    } catch (error: any) {
      console.error('[OrderForm] Order failed:', error);
      alert(error?.message || 'An error occurred. Please try again.');
      setSubmitting(false);
      submitStarted.current = false;
    }
  };


  return (
    <div id="order-form" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif', position: 'relative' }}>
      {/* Close Button */}
      <button 
        onClick={(e) => {
          e.preventDefault(); // Prevent any default behavior
          e.stopPropagation(); // Stop event bubbling
          // Close the form - you can customize this action
          const formContainer = document.querySelector('.order-form-container') as HTMLElement;
          if (formContainer) {
            formContainer.style.display = 'none';
          }
        }}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'transparent',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#666',
          width: '30px',
          height: '30px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'background 0.2s ease',
          zIndex: 1000 // Ensure it's above other elements
        }}
        onMouseOver={(e) => {
          e.target.style.background = '#f5f5f5';
        }}
        onMouseOut={(e) => {
          e.target.style.background = 'transparent';
        }}
      >
        ×
      </button>

      {/* Important Notice */}
      <div style={{ 
        background: '#d82726', 
        color: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '30px',
        border: '2px solid #a61f1f',
        fontSize: '14px',
        fontWeight: '600',
        lineHeight: '1.5'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <span style={{ fontSize: '20px', fontWeight: 'bold', flexShrink: 0 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>IMPORTANT:</div>
            <div>Before submitting this form, you MUST ensure you are available to pay and receive the order within 24-48 hours of ordering. DO NOT ORDER IF YOU ARE NOT READY TO RECEIVE IN 24 HOURS.</div>
          </div>
        </div>
      </div>

      <h2 style={{ textAlign: 'left', color: '#1f4d34', marginBottom: '30px', fontSize: '48px', fontWeight: 'bold', lineHeight: '1.1' }}>
        PLACE YOUR ORDER HERE!
      </h2>
      
      <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '3px solid #d82726', textAlign: 'left' }}>
        {/* Your Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            Your Name
          </label>
          <input
            type="text"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="e.g. Chidinma Okafor"
            value={form.name}
            onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Your Phone Number */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            Your Phone Number
          </label>
          <input
            type="tel"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="e.g. 08012345678"
            value={form.phone}
            onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
          />
        </div>

        {/* Your WhatsApp Number */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            Your WhatsApp Number *
          </label>
          <input
            type="tel"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="e.g. 08012345678"
            value={form.whatsapp}
            onChange={e => setForm(prev => ({ ...prev, whatsapp: e.target.value }))}
            required
          />
        </div>

        {/* Your Email Address */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            Your Email Address *
          </label>
          <input
            type="email"
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px',
              fontSize: '16px'
            }}
            placeholder="e.g. yourname@gmail.com"
            value={form.email}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        {/* Your Home/Office Address */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            Your Home/Office Address
          </label>
          <textarea
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px',
              fontSize: '16px',
              minHeight: '80px',
              resize: 'vertical'
            }}
            placeholder="House number, street, area, city"
            value={form.address}
            onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
          />
        </div>

        {/* Your Delivery State */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            Your Delivery State
          </label>
          <select
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #ddd', 
              borderRadius: '6px',
              fontSize: '16px',
              backgroundColor: '#fff'
            }}
            value={form.state}
            onChange={e => setForm(prev => ({ ...prev, state: e.target.value }))}
            aria-label="Select your state"
          >
            <option value="">Select your state</option>
            <option value="Abia">Abia</option>
            <option value="Adamawa">Adamawa</option>
            <option value="Akwa Ibom">Akwa Ibom</option>
            <option value="Anambra">Anambra</option>
            <option value="Bauchi">Bauchi</option>
            <option value="Bayelsa">Bayelsa</option>
            <option value="Benue">Benue</option>
            <option value="Borno">Borno</option>
            <option value="Cross River">Cross River</option>
            <option value="Delta">Delta</option>
            <option value="Ebonyi">Ebonyi</option>
            <option value="Edo">Edo</option>
            <option value="Ekiti">Ekiti</option>
            <option value="Enugu">Enugu</option>
            <option value="FCT">FCT - Abuja</option>
            <option value="Gombe">Gombe</option>
            <option value="Imo">Imo</option>
            <option value="Jigawa">Jigawa</option>
            <option value="Kaduna">Kaduna</option>
            <option value="Kano">Kano</option>
            <option value="Katsina">Katsina</option>
            <option value="Kebbi">Kebbi</option>
            <option value="Kogi">Kogi</option>
            <option value="Kwara">Kwara</option>
            <option value="Lagos">Lagos</option>
            <option value="Nasarawa">Nasarawa</option>
            <option value="Niger">Niger</option>
            <option value="Ogun">Ogun</option>
            <option value="Ondo">Ondo</option>
            <option value="Osun">Osun</option>
            <option value="Oyo">Oyo</option>
            <option value="Plateau">Plateau</option>
            <option value="Rivers">Rivers</option>
            <option value="Sokoto">Sokoto</option>
            <option value="Taraba">Taraba</option>
            <option value="Yobe">Yobe</option>
            <option value="Zamfara">Zamfara</option>
          </select>
        </div>

        {/* Select Your Package */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#333' }}>
            Select Your Product
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PACKAGES.map((pkg) => {
              const isSelected = form.package === pkg.slug;
              return (
                <label
                  key={pkg.slug}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    padding: '12px',
                    border: `2px solid ${isSelected ? '#d82726' : '#ddd'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#f0f8ff' : '#fff',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <input
                    type="radio"
                    name="package"
                    value={pkg.slug}
                    checked={isSelected}
                    onChange={e => setForm(prev => ({ ...prev, package: e.target.value }))}
                    style={{ cursor: 'pointer', marginTop: '3px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111' }}>
                        {pkg.name}
                        {pkg.label && (
                          <span style={{
                            marginLeft: '8px',
                            fontSize: '10px',
                            fontWeight: '700',
                            color: '#fff',
                            backgroundColor: pkg.isPopular ? '#d82726' : '#059669',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            textTransform: 'uppercase',
                          }}>
                            {pkg.label}
                          </span>
                        )}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: '800', color: '#059669' }}>
                        ₦{pkg.price.toLocaleString('en-NG')}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {pkg.items} · + delivery fee (select below)
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Delivery Fee Selection */}
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
            Delivery Fee
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <label style={{ flex: 1, padding: '12px', border: form.deliveryType === 'next_day' ? '2px solid #244beb' : '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', backgroundColor: form.deliveryType === 'next_day' ? '#f0f4ff' : '#fff' }}>
              <input type="radio" name="deliveryType" value="next_day" checked={form.deliveryType === 'next_day'} onChange={e => setForm(prev => ({ ...prev, deliveryType: e.target.value }))} style={{ marginRight: '8px' }} />
              <span style={{ fontWeight: '600', color: '#333' }}>1–3 Days Delivery</span>
              <span style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '4px' }}>₦3,000</span>
            </label>
            <label style={{ flex: 1, padding: '12px', border: form.deliveryType === 'same_day' ? '2px solid #244beb' : '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', backgroundColor: form.deliveryType === 'same_day' ? '#f0f4ff' : '#fff' }}>
              <input type="radio" name="deliveryType" value="same_day" checked={form.deliveryType === 'same_day'} onChange={e => setForm(prev => ({ ...prev, deliveryType: e.target.value }))} style={{ marginRight: '8px' }} />
              <span style={{ fontWeight: '600', color: '#333' }}>24 Hours Delivery</span>
              <span style={{ display: 'block', fontSize: '14px', color: '#666', marginTop: '4px' }}>₦5,000</span>
            </label>
          </div>
        </div>

        {/* Preferred Delivery Date */}
        <div style={{ marginBottom: '30px' }}>
          <label
            htmlFor="delivery-date"
            style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}
          >
            Preferred Delivery Date * (within 48 hours only)
          </label>
          <input
            id="delivery-date"
            type="date"
            aria-label="Preferred delivery date (within next 48 hours)"
            suppressHydrationWarning
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
            value={form.deliveryDate}
            onChange={e => setForm(prev => ({ ...prev, deliveryDate: e.target.value }))}
            required
            onFocus={e => e.target.showPicker?.()}
            onClick={e => e.target.showPicker?.()}
            min={deliveryDateMin}
            max={deliveryDateMax}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Please select a delivery date within the next 48 hours
          </div>
        </div>

        {/* Order Summary */}
        <div style={S.sum}>
          {(() => {
            const pkg = PACKAGES.find(p => p.slug === form.package);
            const currentDeliveryFee = form.deliveryType === 'same_day' ? 5000 : 3000;
            const total = (pkg?.price || 0) + currentDeliveryFee;
            return (
              <>
                <div style={S.sr}><span>Product</span><span>{pkg?.name || '—'}</span></div>
                <div style={S.sr}><span>Quantity</span><span>{pkg?.quantity || 1}</span></div>
                <div style={S.sr}><span>Product amount</span><span>₦{(pkg?.price || 0).toLocaleString('en-NG')}</span></div>
                <div style={S.sr}><span>Delivery fee</span><span>₦{currentDeliveryFee.toLocaleString('en-NG')}</span></div>
                <div style={S.tot}><span>Total payable</span><span>₦{total.toLocaleString('en-NG')}</span></div>
              </>
            );
          })()}
        </div>

        {/* Order Button */}
        <button
          style={{
            width: '100%',
            padding: '18px',
            background: '#244beb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'background 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
          onClick={() => {
            submit();
          }}
          disabled={submitting}
        >
          <span style={{ filter: 'brightness(0) invert(1)' }}>🛒</span> SUBMIT ORDER
        </button>
      </div>
    </div>
  );
}

export default memo(OrderFormEmbed);
