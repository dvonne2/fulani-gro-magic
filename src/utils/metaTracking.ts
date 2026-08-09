// src/utils/metaTracking.ts
// Complete Meta Pixel + CAPI tracking — single file, zero dependencies

import { CAPI_ENDPOINT } from '@/config/api';
import { getExternalId } from './externalIdMirroring';
import { getAutoInjectedPostalCode, getGranularCityWithPostal } from './postalCodeMapping';

declare global {
  interface Window {
    fbq: ((...args: any[]) => void) & { callMethod?: (...args: any[]) => void; queue?: any[]; loaded?: boolean };
    __metaPixelsInitialized?: boolean;
    __pvEventId?: string;
  }
}

// ============================================
// PIXEL ROUTING
// ============================================
const PIXEL_1 = '220381209723501';
const SINGLE_PIXEL_EVENTS = new Set(['Purchase', 'InitiateCheckout']);

// ============================================
// PERSISTENT DEDUP — survives page reloads
// ============================================
const DEDUP_STORAGE_KEY = 'fhg_meta_dedup';
const DEDUP_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours — same user, same day = 1 event

function loadDedup(): Set<string> {
  try {
    const raw = localStorage.getItem(DEDUP_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Date.now() < parsed.expiresAt) {
        return new Set<string>(parsed.keys);
      }
      localStorage.removeItem(DEDUP_STORAGE_KEY);
    }
  } catch {}
  return new Set<string>();
}

function saveDedup(set: Set<string>): void {
  try {
    localStorage.setItem(
      DEDUP_STORAGE_KEY,
      JSON.stringify({
        keys: Array.from(set),
        expiresAt: Date.now() + DEDUP_TTL_MS,
      })
    );
  } catch {}
}

let dedupSet = loadDedup();

// Blanket-blocked events: these event names should never fire again (e.g. recovery links)
const blanketBlocked = new Set<string>();

function hasFired(key: string): boolean {
  if (dedupSet.has(key)) return true;
  // Check blanket block: if key starts with any blocked prefix (e.g. "browser_FormStart")
  for (const blocked of blanketBlocked) {
    if (key.startsWith(blocked)) return true;
  }
  return false;
}

function markFired(key: string): void {
  dedupSet.add(key);
  saveDedup(dedupSet);
}

// ============================================
// IDENTITY-BASED EVENT IDs — deterministic dedup
// ============================================
// Uses SHA-256 of (eventName + identity) so Browser + CAPI always
// send the SAME event_id. Meta deduplicates them as one event.
let _sessionSeed: string | null = null;
function getSessionSeed(): string {
  if (_sessionSeed) return _sessionSeed;
  try {
    const stored = localStorage.getItem('fhg_session_seed');
    if (stored) { _sessionSeed = stored; return stored; }
  } catch {}
  _sessionSeed = Math.random().toString(36).slice(2);
  try { localStorage.setItem('fhg_session_seed', _sessionSeed); } catch {}
  return _sessionSeed;
}

async function makeEventId(eventName: string, identity?: string): Promise<string> {
  const seed = identity || getSessionSeed();
  const raw = `${eventName}_${seed}`;
  const hash = await sha256raw(raw);
  return hash.slice(0, 16); // 16-char hex = plenty unique
}

async function sha256raw(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256(value: string): Promise<string> {
  const data = new TextEncoder().encode(value.trim().toLowerCase());
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function isFbqReady(): boolean {
  return window.__metaPixelsInitialized === true && typeof window.fbq === 'function' && typeof window.fbq.callMethod === 'function';
}

function waitForFbq(maxMs = 5000, interval = 100): Promise<boolean> {
  return new Promise((resolve) => {
    if (isFbqReady()) {
      resolve(true);
      return;
    }
    const start = Date.now();
    const timer = setInterval(() => {
      if (isFbqReady()) {
        clearInterval(timer);
        resolve(true);
        return;
      }
      if (Date.now() - start > maxMs) {
        clearInterval(timer);
        resolve(false);
      }
    }, interval);
  });
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  let normalized = digits;
  if (digits.startsWith('0')) normalized = '234' + digits.slice(1);
  else if (!digits.startsWith('234')) normalized = '234' + digits;
  if (normalized.length === 13 && normalized.startsWith('234')) return normalized;
  return '';
}

function normalizeName(value: string): string {
  return value
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, maxAgeDays: number): void {
  try {
    const maxAge = maxAgeDays * 24 * 60 * 60;
    document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
  } catch {}
}

function isValidFbp(value: string | unknown): value is string {
  return typeof value === 'string' && value.startsWith('fb.');
}

function getFbp(): string | null {
  const cookie = getCookie('_fbp');
  if (isValidFbp(cookie)) return cookie;
  return getPersistedFbp();
}

function getFbc(): string | null {
  const cookieFbc = getCookie('_fbc');
  if (cookieFbc) return cookieFbc;
  // Use the persisted fbc before generating a new one from the URL fbclid,
  // so the creation timestamp and exact formatting are preserved.
  const persisted = getPersistedFbc();
  if (persisted) return persisted;
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  if (fbclid) return `fb.1.${Date.now()}.${fbclid}`;
  return null;
}


function getFbclidFromFbc(value: string): string | null {
  const match = value.match(/^fb\.1\.\d+\.(.+)$/);
  return match ? match[1] : null;
}

function getPersistedFbcData(): { fbc: string; fbclid: string; timestamp: number; expiresAt: number } | null {
  try {
    const raw = localStorage.getItem('meta_fbc_data');
    if (raw) {
      const data = JSON.parse(raw);
      if (Date.now() < data.expiresAt) {
        return {
          fbc: data.fbc,
          fbclid: data.fbclid || '',
          timestamp: data.timestamp || Date.now(),
          expiresAt: data.expiresAt,
        };
      }
      localStorage.removeItem('meta_fbc_data');
    }
  } catch {}
  return null;
}

export function captureFbclid(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlFbclid = params.get('fbclid');
    const cookieFbc = getCookie('_fbc');

    // Use an existing fbc that matches the current URL fbclid to preserve the
    // original creation timestamp. Only build a fresh fbc when no valid match exists.
    const persistedData = getPersistedFbcData();
    let fbc: string | null = null;
    let matchedFbclid = '';

    if (cookieFbc && getFbclidFromFbc(cookieFbc) === urlFbclid) {
      fbc = cookieFbc;
      matchedFbclid = getFbclidFromFbc(cookieFbc) || '';
    } else if (urlFbclid && persistedData?.fbclid === urlFbclid) {
      fbc = persistedData.fbc;
      matchedFbclid = persistedData.fbclid;
    } else if (urlFbclid) {
      fbc = `fb.1.${Date.now()}.${urlFbclid}`;
      matchedFbclid = urlFbclid;
    } else if (cookieFbc) {
      fbc = cookieFbc;
      matchedFbclid = getFbclidFromFbc(cookieFbc) || '';
    } else if (persistedData) {
      fbc = persistedData.fbc;
      matchedFbclid = persistedData.fbclid;
    }

    if (fbc) {
      const fbcToStore = fbc;
      const fbclidToStore = matchedFbclid || urlFbclid || '';
      const storedTimestamp = persistedData?.fbc === fbcToStore ? persistedData.timestamp : Date.now();
      localStorage.setItem(
        'meta_fbc_data',
        JSON.stringify({
          fbc: fbcToStore,
          fbclid: fbclidToStore,
          timestamp: storedTimestamp,
          expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
        })
      );
      // Write the real _fbc cookie so the browser pixel picks it up natively.
      // Only overwrite when the URL carries a fresh fbclid or the cookie is missing.
      if (urlFbclid || !cookieFbc) {
        setCookie('_fbc', fbcToStore, 30);
      }
    }

    // Capture and persist _fbp cookie for click attribution
    const fbp = getFbp();
    if (fbp) {
      localStorage.setItem(
        'meta_fbp_persist',
        JSON.stringify({
          fbp,
          timestamp: Date.now(),
          expiresAt: Date.now() + 90 * 24 * 60 * 60 * 1000, // 90 days
        })
      );
      // Restore the _fbp cookie if it was cleared so browser events keep the device ID
      if (!getCookie('_fbp')) {
        setCookie('_fbp', fbp, 90);
      }
    }

    // Re-set the cookies server-side (HTTP Set-Cookie). Safari ITP caps
    // JS-written cookies at 7 days; server-set cookies keep the full 30/90 days.
    if ((fbc || fbp) && !sessionStorage.getItem('fhg_attribution_synced')) {
      sessionStorage.setItem('fhg_attribution_synced', '1');
      fetch('/api/set-attribution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
        body: JSON.stringify({ fbc: fbc || undefined, fbp: fbp || undefined }),
      }).catch(() => {
        sessionStorage.removeItem('fhg_attribution_synced');
      });
    }
  } catch {}
}

export function getPersistedFbc(): string | null {
  try {
    const raw = localStorage.getItem('meta_fbc_data');
    if (raw) {
      const data = JSON.parse(raw);
      if (Date.now() < data.expiresAt) return data.fbc;
    }
  } catch {}
  return null;
}

export function getPersistedFbp(): string | null {
  try {
    const raw = localStorage.getItem('meta_fbp_persist');
    if (raw) {
      const data = JSON.parse(raw);
      if (Date.now() < data.expiresAt && isValidFbp(data.fbp)) return data.fbp;
    }
  } catch {}
  return null;
}

/**
 * Re-initialize Meta pixel with Advanced Matching data after email/phone capture.
 * This improves Event Match Quality by providing Meta with user identifiers.
 */
export async function reinitPixelWithUserData(data: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  state?: string;
  city?: string;
  gender?: string;
  externalId?: string;
}): Promise<void> {
  const fbqReady = await waitForFbq();
  if (!fbqReady || typeof window.fbq !== 'function') {
    console.warn('[Meta] fbq not loaded, cannot re-init with user data');
    return;
  }

  const pixelIds = [PIXEL_1];
  const userData: Record<string, any> = {};

  if (data.email) userData.em = await sha256(data.email);
  const normalizedPhone = data.phone ? normalizePhone(data.phone) : '';
  if (normalizedPhone) userData.ph = await sha256(normalizedPhone);
  const firstName = data.firstName ? normalizeName(data.firstName) : '';
  const lastName = data.lastName ? normalizeName(data.lastName) : '';
  if (firstName) userData.fn = await sha256(firstName);
  if (lastName) userData.ln = await sha256(lastName);
  if (data.state) userData.st = await sha256(data.state);
  if (data.city || data.state) {
    const { city: granularCity, postalCode } = getGranularCityWithPostal(data.state, data.city, undefined, undefined);
    if (granularCity) userData.ct = await sha256(granularCity);
    if (postalCode) userData.zp = await sha256(postalCode);
    else {
      const autoPostal = getAutoInjectedPostalCode(data.state, data.city, undefined, undefined);
      if (autoPostal) userData.zp = await sha256(autoPostal);
    }
  }
  const gender = data.gender?.toLowerCase() === 'm' ? 'm' : (data.gender ? 'f' : undefined);
  if (gender) userData.ge = gender;
  // Prefer an email-derived external_id: it is identical on every device the
  // customer uses, which strengthens Meta's cross-device identity graph.
  const emailExternalId = data.email ? await sha256(data.email) : null;
  const externalId = emailExternalId || data.externalId || getExternalId();
  if (externalId) userData.external_id = externalId;
  userData.country = 'ng';

  // Add browser identifiers so the pixel connects browser and click IDs
  // with every event, improving attribution and match quality.
  const fbp = getFbp();
  const fbc = getFbc();
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;

  // If the pixel was already initialized by analytics-deferred.js, do not
  // call fbq('init') again to avoid the 'Duplicate Pixel ID' console warning.
  // The user data is still persisted to fhg_identity for the next page load.
  if (window.__metaPixelsInitialized) {
    console.log('[Meta] Pixel already initialized; updating identity only');
  } else {
    pixelIds.forEach((pixelId) => {
      try {
        window.fbq('init', pixelId, userData);
      } catch (err) {
        console.error(`[Meta] Failed to init pixel ${pixelId}:`, err);
      }
    });
    window.__metaPixelsInitialized = true;
    console.log('[Meta] Pixel initialized with Advanced Matching data:', Object.keys(userData));
  }

  // Persist identity so future page views and top-of-funnel events can reuse the same match keys
  try {
    localStorage.setItem(
      'fhg_identity',
      JSON.stringify({
        email: data.email,
        phone: data.phone,
        firstName,
        lastName,
        state: data.state,
        city: data.city,
        gender,
        capturedAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      })
    );
  } catch {}
}

async function fireBrowserEvent(
  type: 'track' | 'trackCustom',
  eventName: string,
  data: Record<string, any>,
  eventId: string
): Promise<boolean> {
  // Use eventId in dedup key so different orders can fire but same order can't double-fire
  const key = `browser_${eventName}_${eventId}`;
  if (eventName !== 'Purchase' && hasFired(key)) {
    console.log(`[Meta] Browser skip duplicate (persisted): ${eventName} [${eventId}]`);
    return true;
  }
  const fbqReady = await waitForFbq();
  if (!fbqReady || typeof window.fbq !== 'function') {
    console.warn(`[Meta] fbq not ready, skipping: ${eventName}`);
    return false; // Don't markFired — pixel may load later and event should retry
  }
  try {
    if (SINGLE_PIXEL_EVENTS.has(eventName)) {
      // Conversion events route to Pixel 1 only
      if (type === 'trackCustom') {
        window.fbq('trackSingleCustom', '220381209723501', eventName, data, { eventID: eventId });
      } else {
        window.fbq('trackSingle', '220381209723501', eventName, data, { eventID: eventId });
      }
      console.log(`[Meta] Browser trackSingle (220381209723501): ${eventName}`, data, `eventID=${eventId}`);
    } else {
      // PageView and ViewContent reach all initialized pixels for audience building
      window.fbq(type, eventName, data, { eventID: eventId });
      console.log(`[Meta] Browser ${type}: ${eventName}`, data, `eventID=${eventId}`);
    }
    if (eventName !== 'Purchase') markFired(key);
    return true;
  } catch (err) {
    console.warn(`[Meta] Browser ${type} failed for ${eventName}:`, err);
    return false;
  }
}

async function fireCAPIEvent(
  eventName: string,
  eventId: string,
  userData: Record<string, any>,
  customData: Record<string, any>,
  testEventCode?: string
): Promise<boolean> {
  // Use eventId in dedup key so different orders can fire but same order can't double-fire
  const key = `capi_${eventName}_${eventId}`;
  if (hasFired(key)) {
    console.log(`[Meta] CAPI skip duplicate (persisted): ${eventName} [${eventId}]`);
    return true;
  }

  const fbp = getFbp();
  const fbc = getFbc();
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  try {
    const payload: Record<string, any> = {
      event_name: eventName,
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: window.location.href,
      user_data: userData,
      custom_data: (() => {
        const capiCustomData = { ...customData };
        const numericValue = Number(capiCustomData.value);
        if (numericValue > 0) {
          capiCustomData.value = numericValue;
          capiCustomData.currency = 'NGN';
        } else {
          delete capiCustomData.value;
          delete capiCustomData.currency;
        }
        return capiCustomData;
      })(),
    };
    // Add test_event_code for test mode routing
    if (testEventCode) {
      payload.test_event_code = testEventCode;
    }
    const res = await fetch(CAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    });
    if (!res.ok) {
      throw new Error(`CAPI request failed: HTTP ${res.status}`);
    }
    const result = await res.json();
    markFired(key);
    console.log(`[Meta] CAPI sent: ${eventName}`, result);
    return true;
  } catch (err) {
    console.error(`[Meta] CAPI error: ${eventName}`, err);
    return false;
  }
}

async function buildUserData(info: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  state?: string;
  city?: string;
  gender?: string;
  externalId?: string;
}): Promise<Record<string, any>> {
  const stored = getStoredIdentityRaw();
  if (stored) {
    if (!info.email) info.email = stored.email;
    if (!info.phone) info.phone = stored.phone;
    if (!info.firstName) info.firstName = stored.firstName;
    if (!info.lastName) info.lastName = stored.lastName;
    if (!info.state) info.state = stored.state;
    if (!info.city) info.city = stored.city;
    if (!info.gender) info.gender = stored.gender;
  }
  const ud: Record<string, any> = {};
  if (info.email) ud.em = [await sha256(info.email)];
  const normalizedPhone = info.phone ? normalizePhone(info.phone) : '';
  if (normalizedPhone) ud.ph = [await sha256(normalizedPhone)];
  const firstName = info.firstName ? normalizeName(info.firstName) : '';
  const lastName = info.lastName ? normalizeName(info.lastName) : '';
  if (firstName) ud.fn = [await sha256(firstName)];
  if (lastName) ud.ln = [await sha256(lastName)];
  if (info.state) ud.st = [await sha256(info.state)];
  if (info.city || info.state) {
    const { city: granularCity, postalCode } = getGranularCityWithPostal(info.state, info.city, undefined, undefined);
    if (granularCity) ud.ct = [await sha256(granularCity)];
    else if (info.city) ud.ct = [await sha256(info.city)];
    if (postalCode) ud.zp = [await sha256(postalCode)];
    else {
      const autoPostal = getAutoInjectedPostalCode(info.state, info.city, undefined, undefined);
      if (autoPostal) ud.zp = [await sha256(autoPostal)];
    }
  }
  const gender = info.gender?.toLowerCase() === 'm' ? 'm' : (info.gender ? 'f' : undefined);
  if (gender) ud.ge = [await sha256(gender)];
  ud.country = [await sha256('ng')];
  // Send both external_ids: the email hash (cross-device stable) and the
  // browser-scoped ref code (continuity with past events and magic links).
  const externalIds: string[] = [];
  if (info.email) externalIds.push(await sha256(info.email));
  const browserExternalId = info.externalId || getExternalId();
  if (browserExternalId && !externalIds.includes(browserExternalId)) externalIds.push(browserExternalId);
  if (externalIds.length) ud.external_id = externalIds;
  if (typeof navigator !== 'undefined' && navigator.userAgent) ud.client_user_agent = navigator.userAgent;
  const fbp = getFbp();
  const fbc = getFbc();
  if (fbp) ud.fbp = fbp;
  if (fbc) ud.fbc = fbc;
  return ud;
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function getStoredIdentityRaw(): Record<string, any> | null {
  try {
    const stored = localStorage.getItem('fhg_identity');
    if (stored) {
      const data = JSON.parse(stored);
      if (Date.now() < data.expiresAt) return data;
    }
  } catch {}
  return null;
}

async function getStoredIdentity(): Promise<Record<string, any>> {
  return buildUserData({});
}

// ============================================
// EXPORTED FUNCTIONS
// ============================================

export interface OrderData {
  orderId: string;
  email?: string;
  phone?: string;
  fullName?: string;
  totalAmount: number;
  packageAmount?: number;
  packageName?: string;
  paymentType?: 'PBD' | 'POD' | string;
  state?: string;
  lga?: string;
  numItems?: number;
}

export async function fireThankYouEvents(order: OrderData): Promise<boolean> {
  // Guard: skip test orders to prevent leaking to production
  if (order.orderId?.startsWith('TEST_') || order.orderId === 'TEST_ORDER_123') {
    console.log('[META] Test order detected, skipping all Pixel/CAPI events', order.orderId);
    return true;
  }

  console.log('[Meta] Firing thank-you events for order:', order.orderId);

  // Detect test mode from URL
  const isTestMode = typeof window !== 'undefined' && window.location.search.includes('test=1');
  const testEventCode = isTestMode ? 'TEST12345' : undefined;

  // Get attribution data from localStorage
  const mediaBuyer = typeof localStorage !== 'undefined' ? localStorage.getItem('mb') || '' : '';
  const source = typeof localStorage !== 'undefined' ? localStorage.getItem('src') || '' : '';

  const nameParts = (order.fullName || '').trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  const userData = await buildUserData({
    email: order.email,
    phone: order.phone,
    firstName,
    lastName,
    state: order.state,
    city: order.lga,
    gender: 'f',
  });
  const amount = Number(order.totalAmount) || 0;
  const pkgAmount = Number(order.packageAmount) || amount;
  // 1. PURCHASE — Fire only via CAPI to avoid fbevents NGN/value warnings
  const purchaseEventId = await makeEventId('Purchase', order.orderId);

  // Derive package SKU from package name (simple mapping)
  const packageSku = order.packageName?.replace(/\s+/g, '_').toUpperCase() || 'FULANI_HAIR_GRO';
  const contentIds = [packageSku];

  // Re-initialize the browser pixel with Advanced Matching so it can still
  // contribute to identity and matching, even though we are not firing the
  // browser Purchase event from this build.
  await reinitPixelWithUserData({
    email: order.email,
    phone: order.phone,
    firstName,
    lastName,
    state: order.state,
    city: order.lga,
    gender: 'f',
  });

  // Fire Purchase via CAPI only. The browser fbq build currently loaded does
  // not accept NGN as a valid Purchase currency, and CAPI already carries the
  // correct value/currency for Meta attribution.
  const capiFired = await fireCAPIEvent('Purchase', purchaseEventId, userData, {
    value: amount > 0 ? amount : undefined,  // Full amount payable (product + delivery)
    currency: amount > 0 ? 'NGN' : undefined,
    content_ids: contentIds,
    content_name: order.packageName || 'Fulani Hair Gro',
    content_type: 'product',
    contents: [{
      id: packageSku,
      quantity: order.numItems || 1,
      item_price: pkgAmount,
    }],
    num_items: order.numItems || 1,
    media_buyer: mediaBuyer,
    source: source,
  }, testEventCode);

  console.log('[Meta] Thank-you events complete (CAPI Purchase only)');
  return capiFired;
}

let leadSyncFired = false;

export async function fireLeadSync(info: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}): Promise<void> {
  console.log('[Meta] fireLeadSync called:', { info, leadSyncFired });

  if (leadSyncFired) {
    console.log('[Meta] LeadSync already fired, skipping');
    return;
  }
  if (!info.email && !info.phone) {
    console.log('[Meta] LeadSync: No email or phone provided, skipping');
    return;
  }

  leadSyncFired = true;
  console.log('[Meta] LeadSync: Proceeding with event firing');

  // Get attribution data from localStorage
  const mediaBuyer = typeof localStorage !== 'undefined' ? localStorage.getItem('mb') || '' : '';
  const source = typeof localStorage !== 'undefined' ? localStorage.getItem('src') || '' : '';

  const userData = await buildUserData(info);
  const identity = info.phone || info.email || '';
  const eventId = await makeEventId('LeadSync', identity);
  await fireBrowserEvent('trackCustom', 'LeadSync', {
    content_category: 'identity_capture',
    media_buyer: mediaBuyer,
    source: source,
  }, eventId);
  await fireCAPIEvent('LeadSync', eventId, userData, {
    value: 0,
    content_category: 'identity_capture',
    media_buyer: mediaBuyer,
    source: source,
  });
  try {
    localStorage.setItem(
      'fhg_identity',
      JSON.stringify({
        email: info.email,
        phone: info.phone,
        firstName: info.firstName,
        lastName: info.lastName,
        capturedAt: Date.now(),
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      })
    );
  } catch {}
  console.log('[Meta] LeadSync fired');
}

export async function fireFormStart(): Promise<boolean> {
  const eventId = await makeEventId('FormStart');
  const ok = await fireBrowserEvent('trackCustom', 'FormStart', {}, eventId);
  if (!ok) {
    console.warn('[Meta] fbq not ready, FormStart skipped');
    return false;
  }
  const userData = await getStoredIdentity();
  await fireCAPIEvent('FormStart', eventId, userData, {
    value: 0,
    content_category: 'checkout',
  });
  return true;
}

export async function firePageViewCAPI(): Promise<void> {
  const eventId = window.__pvEventId || '';
  if (!eventId) {
    console.warn('[Meta] No PageView event_id found, skipping CAPI');
    return;
  }
  const key = `capi_PageView_${eventId}`;
  if (hasFired(key)) {
    console.log('[Meta] CAPI skip duplicate PageView');
    return;
  }
  const userData = await getStoredIdentity();
  const fbp = getFbp();
  const fbc = getFbc();
  if (fbp) userData.fbp = fbp;
  if (fbc) userData.fbc = fbc;
  try {
    const res = await fetch(CAPI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        event_name: 'PageView',
        event_id: eventId,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: window.location.href,
        user_data: userData,
        custom_data: {},
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    markFired(key);
    console.log('[Meta] CAPI PageView sent, eventID=' + eventId);
  } catch (err) {
    console.error('[Meta] CAPI PageView error:', err);
  }
}

export async function fireViewContent(data: {
  packageName: string;
  amount?: number;
  email?: string;
  phone?: string;
}): Promise<void> {
  const identity = data.phone || data.email || '';
  const eventId = await makeEventId('ViewContent', identity);
  await fireBrowserEvent('track', 'ViewContent', {
    value: Number(data.amount) || 0,
    currency: 'NGN',
    content_type: 'product',
    content_name: data.packageName,
  }, eventId);
  const userData = await buildUserData({
    email: data.email,
    phone: data.phone,
  });
  const viewContentSku = data.packageName?.replace(/\s+/g, '_').toUpperCase() || 'FULANI_HAIR_GRO';
  await fireCAPIEvent('ViewContent', eventId, userData, {
    value: Number(data.amount) || 0,
    currency: 'NGN',
    content_type: 'product',
    content_ids: [viewContentSku],
    content_name: data.packageName,
    contents: [{ id: viewContentSku, quantity: 1, item_price: Number(data.amount) || 0 }],
  });
}

export async function fireInitiateCheckout(data: {
  packageName: string;
  amount: number;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  state?: string;
  city?: string;
}): Promise<void> {
  // Get attribution data from localStorage
  const mediaBuyer = typeof localStorage !== 'undefined' ? localStorage.getItem('mb') || '' : '';
  const source = typeof localStorage !== 'undefined' ? localStorage.getItem('src') || '' : '';

  // Unique event ID per form start so a new checkout attempt is never blocked
  // by a stale dedup from a previous session.
  const eventId = await makeEventId('InitiateCheckout', Date.now().toString());
  // Browser InitiateCheckout only carries content data; value/currency go
  // through CAPI to avoid fbevents NGN validation issues.
  await fireBrowserEvent('track', 'InitiateCheckout', {
    content_type: 'product',
    content_name: data.packageName,
    media_buyer: mediaBuyer,
    source: source,
  }, eventId);
  // Fire the CAPI event and re-init as soon as we have at least one piece of
  // contact info, so Meta gets email/phone immediately.
  if (!data.email && !data.phone) return;

  await reinitPixelWithUserData({
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    state: data.state,
    city: data.city,
    gender: 'f',
  });
  const userData = await buildUserData({
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    state: data.state,
    city: data.city,
    gender: 'f',
  });
  const checkoutSku = data.packageName?.replace(/\s+/g, '_').toUpperCase() || 'FULANI_HAIR_GRO';
  await fireCAPIEvent('InitiateCheckout', eventId, userData, {
    value: Number(data.amount) || 0,
    currency: 'NGN',
    content_type: 'product',
    content_ids: [checkoutSku],
    content_name: data.packageName,
    contents: [{ id: checkoutSku, quantity: 1, item_price: Number(data.amount) || 0 }],
    num_items: 1,
    media_buyer: mediaBuyer,
    source: source,
  });
}

export async function fireCartRecovery(data: {
  orderId: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  packageName?: string;
  amount?: number;
}): Promise<void> {
  const eventId = await makeEventId('CartRecovery', data.orderId);
  await fireBrowserEvent('trackCustom', 'CartRecovery', {
    value: Number(data.amount) || 0,
    currency: 'NGN',
    content_category: 'abandoned_cart',
    content_name: data.packageName || 'Fulani Hair Gro',
    order_id: data.orderId,
  }, eventId);
  const userData = await buildUserData({
    email: data.email,
    phone: data.phone,
    firstName: data.firstName,
    lastName: data.lastName,
    externalId: data.orderId,
  });
  await fireCAPIEvent('CartRecovery', eventId, userData, {
    value: Number(data.amount) || 0,
    currency: 'NGN',
    content_category: 'abandoned_cart',
    content_name: data.packageName || 'Fulani Hair Gro',
    order_id: data.orderId,
  });
  console.log('[Meta] CartRecovery fired for order:', data.orderId);
}

/**
 * Pre-mark events as already fired so recovery sessions don't duplicate them.
 * Call this when restoring a recovery link to prevent FormStart/LeadSync
 * from re-firing with the pre-filled data.
 */
export function markEventsAsFired(events: string[]): void {
  for (const event of events) {
    // Blanket-block these event names so no future eventId variant can fire
    blanketBlocked.add(`browser_${event}`);
    blanketBlocked.add(`capi_${event}`);
  }
  if (events.includes('LeadSync')) {
    leadSyncFired = true;
  }
  console.log('[Meta] Blanket-blocked events (persisted):', events);
}

export function resetTracking(): void {
  dedupSet.clear();
  saveDedup(dedupSet);
  leadSyncFired = false;
  _sessionSeed = null;
  try { localStorage.removeItem('fhg_session_seed'); } catch {}
  try { localStorage.removeItem(DEDUP_STORAGE_KEY); } catch {}
}
