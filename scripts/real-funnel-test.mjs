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
  capiResponses: [],
  fbq: [],
  globals: {},
  cookies: {},
  console: [],
  pageErrors: [],
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

page.on('console', (msg) => evidence.console.push({ type: msg.type(), text: msg.text() }));
page.on('pageerror', (err) => evidence.pageErrors.push(String(err.message || err)));

page.on('request', (req) => {
  const url = req.url();
  if (url.includes('/api/order')) {
    try { evidence.orderPostData = JSON.parse(req.postData() || '{}'); } catch {}
  }
  if (url.includes('facebook.com/tr')) {
    try {
      const u = new URL(url);
      evidence.fbq.push({ ev: u.searchParams.get('ev'), eid: u.searchParams.get('eid'), url });
    } catch { evidence.fbq.push({ url }); }
  }
});

page.on('response', (resp) => {
  const url = resp.url();
  if (url.includes('/api/meta-capi')) {
    resp.text().then((body) => {
      try { evidence.capiResponses.push({ url, status: resp.status(), body, json: JSON.parse(body) }); } catch {}
    }).catch(() => {});
  }
});

try {
  await page.goto(SITE, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await setTimeout(4000);

  evidence.globals.pageView = await page.evaluate(() => ({
    __vvPageViewEventId: window.__vvPageViewEventId ?? null,
    __vvVisitorId: window.__vvVisitorId ?? null,
    __vvPixelLoaded: window.__vvPixelLoaded ?? null,
  }));
  evidence.cookies.home = await context.cookies();

  // Scroll past 20% to trigger natural ViewContent
  const doc = await page.evaluate(() => ({ sh: document.documentElement.scrollHeight, ih: window.innerHeight }));
  const target = Math.floor(doc.sh * 0.25);
  await page.evaluate((y) => window.scrollTo(0, y), target);
  await setTimeout(5000);

  evidence.globals.viewContent = await page.evaluate(() => ({
    __vvPageViewEventId: window.__vvPageViewEventId ?? null,
    __vvVisitorId: window.__vvVisitorId ?? null,
  }));

  // Enter name + phone to trigger natural InitiateCheckout
  await page.locator('input[placeholder*="Chidinma" i], input[placeholder*="name" i]').first().fill(name);
  const tels = await page.locator('input[type="tel"]').all();
  if (tels[0]) await tels[0].fill(phone);
  await setTimeout(1000);
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
    __vvPageViewEventId: window.__vvPageViewEventId ?? null,
    __vvVisitorId: window.__vvVisitorId ?? null,
  }));

  // Submit one order
  const orderResponsePromise = page.waitForResponse(
    (r) => r.url().includes('/api/order') && r.request().method() === 'POST',
    { timeout: 30000 }
  );
  await page.locator('button:has-text("SUBMIT ORDER")').click();

  const orderResp = await orderResponsePromise;
  evidence.order = { status: orderResp.status() };
  try { evidence.order.json = await orderResp.json(); } catch {}

  await page.waitForURL('**/thank-you**', { timeout: 30000 }).catch(() => {});
  await setTimeout(4000);

  evidence.thankYouUrl = page.url();
  evidence.cookies.final = await context.cookies();
  evidence.globals.final = await page.evaluate(() => ({
    __vvPageViewEventId: window.__vvPageViewEventId ?? null,
    __vvVisitorId: window.__vvVisitorId ?? null,
  }));

  await browser.close();
  console.log(JSON.stringify(evidence, null, 2));
} catch (e) {
  await browser.close();
  console.log(JSON.stringify({ error: String(e.message || e), evidence }, null, 2));
}
