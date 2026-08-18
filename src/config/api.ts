/**
 * Centralized API configuration.
 * All external URLs and secrets are defined here, sourced from
 * environment variables with hardcoded fallbacks for backwards compatibility.
 */

const env = (import.meta as any).env || {};

// ── Base URLs ───────────────────────────────────────────────────
const API_BASE_URL =
  env.VITE_API_BASE_URL ||
  'https://script.google.com/macros/s/AKfycby8sFH-aveFbad7n2WFv4ByJTiD0s2PnT2EYSPW__C8K-VgP6Tks8l87Fm48SAUYIph/exec';

// ── Named exports (used across the codebase) ────────────────────
export const WEBHOOK_URL = env.VITE_WEBHOOK_URL || API_BASE_URL;
export const WEBHOOK_SECRET = env.VITE_WEBHOOK_SECRET || 'fhg_orders_2024_secret';
export const FULANI_API_URL = API_BASE_URL;

// ── Contact / WhatsApp ──────────────────────────────────────────
export const WHATSAPP_NUMBER = '2348101594734';
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_ORDER_HELP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%20just%20placed%20an%20order%20and%20need%20help%20finding%20my%20details`;
export const PHONE_DISPLAY = '08101594734';
export const PHONE_TEL = `+${WHATSAPP_NUMBER}`;
