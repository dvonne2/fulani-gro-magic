import { chromium } from 'file:///opt/homebrew/lib/node_modules/playwright/index.mjs';
import { setTimeout } from 'node:timers/promises';
import { randomBytes } from 'node:crypto';

const SITE = 'https://fulanihairsecrets.com/';
const testId = randomBytes(4).toString('hex');
const name = `Chidinma ${testId}`;
const phone = `0803${Math.floor(1000000 + Math.random() * 8999999)}`;
const whatsapp = `0805${Math.floor(1000000 + Math.random() * 8999999)}`;
const email = `test+${testId}@example.com`;
const address = '12 Test Street, Ikeja, Lagos';
const packageSlug = 'self_love_plus_b2gof';
const deliveryType = 'next_day';
const deliveryDate = new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString().split('T')[0];

const evidence = {
  testId,
  order: null,
  orderPostData: null,
  capi: [],
  fbq: [],
  tr: [],
  globals: {},
  cookies: {},
  console: [],
  pageErrors: [],
  dialogs: [],
  thankYouUrl: null,
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  locale: 'en-NG',
  geolocation: { latitude: 6.5244, longitude: 3.3792 },
  permissions: ['geolocation'],
});
const page = await context.newPage();
await page.setViewportSize({ width: 1280, height: 800 });

page.addInitScript(() => {
  window.__vvFbqCalls = [];
  let current = null;
  function wrap(fn) {
    if (typeof fn !== 'function') return fn;
    return new Proxy(fn, {
      apply(target, that, args) {
        window.__vvFbqCalls.push({ args, ts: performance.now() });
        return target.apply(that, args);
      },
    });
  }
  Object.defineProperty(window, 'fbq', {
    get() { return current; },
    set(v) { current = wrap(v); },
    configurable: true,
  });
});

page.on('console', (msg) => evidence.console.push({ type: msg.type(), text: msg.text() }));
page.on('pageerror', (err) => evidence.pageErrors.push(String(err.message || err)));
page.on('dialog', (d) => { evidence.dialogs.push({ type: d.type(), message: d.message }); d.accept().catch(() => {}); });

page.on('request', (req) => {
  const url = req.url();
  if (url.includes('/api/order')) {
    try { evidence.orderPostData = JSON.parse(req.postData() || '{}'); } catch {}
  }
  if (url.includes('facebook.com/tr')) {
    try {
      const u = new URL(url);
      evidence.tr.push({ ev: u.searchParams.get('ev'), eid: u.searchParams.get('eid'), url });
    } catch { evidence.tr.push({ url }); }
  }
});

const bodyPromises = [];
page.on('response', (resp) => {
  const url = resp.url();
  if (url.includes('/api/meta-capi')) {
    const p = resp.text().then((body) => {
      const entry = { url, status: resp.status(), body };
      try { entry.json = JSON.parse(body); } catch {}
      evidence.capi.push(entry);
    }).catch(() => {});
    bodyPromises.push(p);
  }
});

try {
  await page.goto(SITE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await setTimeout(4000);

  evidence.globals.pageView = await page.evaluate(() => ({
    __vvPageViewEventId: window.__vvPageViewEventId ?? null,
    __vvVisitorId: window.__vvVisitorId ?? null,
    __vvPixelLoaded: window.__vvPixelLoaded ?? null,
    __vvFbqCalls: window.__vvFbqCalls ?? [],
    fbqVersion: window.fbq?.version ?? null,
  }));
  evidence.cookies.home = await context.cookies();

  const doc = await page.evaluate(() => ({
    sh: document.documentElement.scrollHeight,
    ih: window.innerHeight,
  }));
  const target = Math.max(1, Math.floor(doc.sh * 0.25));
  await page.evaluate((y) => window.scrollTo(0, y), target);
  await setTimeout(2000);

  // Manually exercise ViewContent CAPI endpoint to confirm it still works.
  const vcVisitorId = evidence.globals.pageView?.__vvVisitorId || `vc_vis_${randomBytes(8).toString('hex')}`;
  const vcEventId = `vc_${randomBytes(8).toString('hex')}`;
  const vcResult = await page.evaluate(async (payload) => {
    try {
      const res = await fetch('/api/meta-capi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      return { status: res.status, body: await res.text() };
    } catch (e) {
      return { error: String(e.message || e) };
    }
  }, {
    event_name: 'ViewContent',
    event_id: vcEventId,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_source_url: await page.url(),
    user_data: {
      external_id: vcVisitorId,
      fbp: undefined,
      fbc: undefined,
    },
  });
  evidence.viewContentManual = { ...vcResult, eventId: vcEventId };
  try { if (vcResult.body) evidence.viewContentManual.json = JSON.parse(vcResult.body); } catch {}

  // Fill the form
  await page.locator('input[placeholder*="Chidinma" i], input[placeholder*="name" i]').first().fill(name);
  const tels = await page.locator('input[type="tel"]').all();
  if (tels[0]) await tels[0].fill(phone);
  if (tels[1]) await tels[1].fill(whatsapp);
  await page.locator('input[type="email"]').fill(email);
  await page.getByPlaceholder('House number, street, area, city').first().fill(address);
  await page.locator('select[aria-label="Select your state"]').selectOption('Lagos');
  await page.locator(`input[type="radio"][name="package"][value="${packageSlug}"]`).check();
  await page.locator(`input[type="radio"][value="${deliveryType}"]`).check();
  await page.evaluate((d) => {
    const el = document.querySelector('input[type="date"]');
    if (!el) return;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(el, d);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }, deliveryDate);
  await setTimeout(6000);

  evidence.globals.initiateCheckout = await page.evaluate(() => ({
    __vvFbqCalls: window.__vvFbqCalls ?? [],
    __vvPageViewEventId: window.__vvPageViewEventId ?? null,
  }));

  // Submit order and capture the API response
  const orderResponsePromise = page.waitForResponse(
    (r) => r.url().includes('/api/order') && r.request().method() === 'POST',
    { timeout: 30000 }
  );
  const submit = page.locator('button:has-text("SUBMIT ORDER")');
  await submit.click();

  const orderResp = await orderResponsePromise;
  evidence.order = { status: orderResp.status() };
  try { evidence.order.json = await orderResp.json(); } catch {}

  await page.waitForURL('**/thank-you**', { timeout: 30000 }).catch(() => {});
  await setTimeout(3000);

  evidence.thankYouUrl = page.url();
  evidence.cookies.final = await context.cookies();
  evidence.globals.final = await page.evaluate(() => ({
    __vvFbqCalls: window.__vvFbqCalls ?? [],
    __vvPageViewEventId: window.__vvPageViewEventId ?? null,
  }));

  await Promise.all(bodyPromises);
  await browser.close();
  console.log(JSON.stringify(evidence, null, 2));
} catch (e) {
  await browser.close();
  console.log(JSON.stringify({ error: String(e.message || e), evidence }, null, 2));
}
