import { google } from 'googleapis';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { randomBytes, createHash } from 'crypto';

function generateServerOrderId(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = randomBytes(4).toString('hex').toUpperCase();
  return `FHS-${ts}-${rnd}`;
}

function getSheets() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!email || !key) return null;
  const auth = new google.auth.JWT({
    email,
    key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return google.sheets({ version: 'v4', auth });
}

const SHEET_RANGE = 'Orders!A:O';

// Meta CAPI config (must be set in Vercel project environment)
function getMetaConfig() {
  return {
    pixelId: process.env.META_PIXEL_ID?.trim() || '',
    accessToken: process.env.META_ACCESS_TOKEN?.trim() || '',
    apiVersion: process.env.META_API_VERSION?.trim() || '',
  };
}

function firstForwardedIp(value: string | string[] | undefined): string {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return '';
  return raw
    .split(',')
    .map((part) => part.trim())
    .find(Boolean) || '';
}

function getClientIp(req: VercelRequest): string {
  return (
    firstForwardedIp(req.headers['x-vercel-forwarded-for']) ||
    firstForwardedIp(req.headers['x-real-ip']) ||
    firstForwardedIp(req.headers['x-forwarded-for']) ||
    req.socket?.remoteAddress ||
    ''
  );
}

function sha256Hex(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

function normalizePhoneDigits(phone: string | undefined): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('0')) return '234' + digits.slice(1);
  if (!digits.startsWith('234')) return '234' + digits;
  return digits;
}

interface CAPIResult {
  ok: boolean;
  status?: number;
  meta?: any;
}

async function sendMetaPurchase(
  orderId: string,
  body: Record<string, any>,
  req: VercelRequest
): Promise<CAPIResult> {
  const config = getMetaConfig();
  if (!config.pixelId || !config.accessToken || !config.apiVersion) {
    console.error('[CAPI Purchase] Meta not configured, skipping CAPI Purchase');
    return { ok: false, status: 500, meta: { error: 'Meta not configured' } };
  }

  const fullName = String(body.name || '').trim();
  const nameParts = fullName.split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const userData: Record<string, any> = {};
  if (firstName) userData.fn = sha256Hex(firstName);
  if (lastName) userData.ln = sha256Hex(lastName);
  if (body.email) userData.em = sha256Hex(String(body.email));
  if (body.phone) userData.ph = sha256Hex(normalizePhoneDigits(String(body.phone)));
  if (body.state) userData.st = sha256Hex(String(body.state));
  userData.country = 'ng';
  userData.client_ip_address = getClientIp(req);
  userData.client_user_agent = (Array.isArray(req.headers['user-agent']) ? req.headers['user-agent'][0] : req.headers['user-agent']) || '';

  const packageName = String(body.package || 'Fulani Hair Gro');
  const sku = String(body.sku || packageName);
  const quantity = Number(body.quantity) || 1;
  const productAmount = Number(body.productAmount) || 0;
  const total = Number(body.amount) || 0;

  const event = {
    event_name: 'Purchase',
    event_id: orderId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: (Array.isArray(req.headers.referer) ? req.headers.referer[0] : req.headers.referer) || 'https://fulanihairsecrets.com/',
    user_data: userData,
    custom_data: {
      value: total,
      currency: 'NGN',
      order_id: orderId,
      content_type: 'product',
      content_name: packageName,
      content_ids: [sku],
      contents: [{ id: sku, quantity, item_price: productAmount }],
      num_items: quantity,
    },
  };

  const metaUrl = new URL(
    `https://graph.facebook.com/${config.apiVersion}/${config.pixelId}/events`
  );
  metaUrl.searchParams.set('access_token', config.accessToken);

  try {
    const metaRes = await fetch(metaUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }),
    });

    const text = await metaRes.text();
    let metaBody: any = null;
    try { metaBody = JSON.parse(text); } catch {}

    if (!metaRes.ok) {
      console.error('[CAPI Purchase] Meta error:', metaRes.status, metaBody);
      return { ok: false, status: metaRes.status, meta: metaBody };
    }

    console.log('[CAPI Purchase] Meta accepted for order:', orderId, metaBody);
    return { ok: true, status: metaRes.status, meta: metaBody };
  } catch (err) {
    console.error('[CAPI Purchase] Request failed:', err);
    return { ok: false };
  }
}

// In-memory idempotency cache for the lifetime of this serverless container.
// It prevents the same checkout attempt from being written twice if the
// browser sends rapid duplicate requests before the redirect unloads the page.
const recentOrderIds = new Map<string, string>();
const MAX_RECENT_CACHE = 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = (req.body as Record<string, any>) || {};
  const required = ['name', 'phone', 'package', 'state', 'address', 'amount'];
  const productAmount = Number(body.productAmount) || 0;
  const deliveryFee = Number(body.deliveryFee) || 0;
  const quantity = Number(body.quantity) || 1;
  const sku = String(body.sku || '');
  const missing = required.filter((k) => !body[k]);
  if (missing.length) {
    return res.status(400).json({ ok: false, error: `Missing: ${missing.join(', ')}` });
  }

  const orderId = generateServerOrderId();
  const checkoutAttemptId =
    typeof body.checkoutAttemptId === 'string' ? body.checkoutAttemptId : '';

  // If this exact checkout attempt was already processed in this container,
  // return the original order ID instead of creating a duplicate.
  if (checkoutAttemptId && recentOrderIds.has(checkoutAttemptId)) {
    const existingOrderId = recentOrderIds.get(checkoutAttemptId) as string;
    console.log('[Sheets] Duplicate checkout attempt detected:', checkoutAttemptId);
    return res.status(200).json({ ok: true, orderId: existingOrderId });
  }

  const sheets = getSheets();
  if (!sheets) {
    return res.status(500).json({ ok: false, error: 'Google Sheets not configured' });
  }
  const spreadsheetId = process.env.SHEET_ID;
  if (!spreadsheetId) {
    return res.status(500).json({ ok: false, error: 'SHEET_ID not set' });
  }

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: SHEET_RANGE,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          new Date().toLocaleString('sv-SE', { timeZone: 'Africa/Lagos' }),
          orderId,
          body.name,
          body.phone,
          body.email || '',
          body.address,
          body.state,
          body.package,
          Number(body.amount),
          body.deliveryDate || '',
          'website',
          productAmount,
          deliveryFee,
          quantity,
          sku,
        ]],
      },
    });
    if (checkoutAttemptId) {
      recentOrderIds.set(checkoutAttemptId, orderId);
      if (recentOrderIds.size > MAX_RECENT_CACHE) {
        const first = recentOrderIds.keys().next().value;
        if (first !== undefined) recentOrderIds.delete(first);
      }
    }

    const capiResult = await sendMetaPurchase(orderId, body, req);
    return res.status(200).json({
      ok: true,
      orderId,
      capi: capiResult.ok,
      capiDetails: {
        status: capiResult.status,
        events_received: capiResult.meta?.events_received,
        fbtrace_id: capiResult.meta?.fbtrace_id,
        messages: capiResult.meta?.messages,
      },
    });
  } catch (e: any) {
    const cause = e.cause ? ` (${e.cause.message || e.cause})` : '';
    const msg = String(e.message || 'unknown error') + cause;
    console.error('[Sheets]', msg, e);
    return res.status(502).json({ ok: false, orderId, error: 'Could not record order', diagnostic: msg });
  }
}
