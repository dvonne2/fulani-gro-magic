import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const orderEmbed = readFileSync(join(root, 'src', 'components', 'OrderFormEmbed.tsx'), 'utf8');
const orderApi = readFileSync(join(root, 'api', 'order.ts'), 'utf8');

describe('OrderFormEmbed payload handoff', () => {
  it('sends metaExternalId from trackingContext to /api/order', () => {
    assert.match(orderEmbed, /metaExternalId:\s*trackingContext\.externalId/);
  });
  it('sends genuine fbp from trackingContext to /api/order', () => {
    assert.match(orderEmbed, /fbp:\s*trackingContext\.fbp\s*\?\?\s*undefined/);
  });
  it('sends genuine fbc from trackingContext to /api/order', () => {
    assert.match(orderEmbed, /fbc:\s*trackingContext\.fbc\s*\?\?\s*undefined/);
  });
});

describe('api/order.ts sendPurchase data wiring', () => {
  it('event_id is the generated orderId', () => {
    assert.match(orderApi, /event_id:\s*orderId/);
  });
  it('external_id is sourced from body.metaExternalId', () => {
    assert.match(orderApi, /external_id:\s*String\(body\.metaExternalId\s*\|\|\s*''\)/);
  });
  it('fbp is sourced from body.fbp', () => {
    assert.match(orderApi, /fbp:\s*body\.fbp\s*\|\|\s*undefined/);
  });
  it('fbc is sourced from body.fbc', () => {
    assert.match(orderApi, /fbc:\s*body\.fbc\s*\|\|\s*undefined/);
  });
  it('Purchase uses orderId as event_id, includes phone, name, email, state, city, value, currency, content', () => {
    assert.match(orderApi, /event_name:\s*'Purchase'/);
    assert.match(orderApi, /currency:\s*'NGN'/);
    assert.match(orderApi, /value:\s*Number\(body\.amount\)/);
    assert.match(orderApi, /content_name:\s*body\.package/);
    assert.match(orderApi, /content_type:\s*'product'/);
  });
  it('Purchase is sent after Google Sheets append and before success response', () => {
    const sendIndex = orderApi.indexOf('await sendMetaPurchase(');
    const appendIndex = orderApi.indexOf('sheets.spreadsheets.values.append(');
    const successReturnIndex = orderApi.indexOf("return res.status(200).json({\n      ok: true,");
    assert(sendIndex > -1, 'sendMetaPurchase call not found');
    assert(appendIndex > -1, 'Sheets append not found');
    assert(successReturnIndex > -1, 'success handler return not found');
    assert(sendIndex > appendIndex, 'sendMetaPurchase must happen after append');
    assert(successReturnIndex > sendIndex, 'success response must happen after sendMetaPurchase');
  });
});
