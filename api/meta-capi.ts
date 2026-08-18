import type { VercelRequest, VercelResponse } from '@vercel/node';
import { metaCapi } from './lib/metaCapi.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  if (!metaCapi) {
    return res.status(503).json({ ok: false, error: 'Meta CAPI not configured' });
  }

  const body = (req.body as Record<string, any>) || {};
  const eventName = body.event_name;

  const args = { body, headers: req.headers };

  let result;
  switch (eventName) {
    case 'PageView':
      result = await metaCapi.sendPageView(args);
      break;
    case 'ViewContent':
      result = await metaCapi.sendViewContent(args);
      break;
    case 'InitiateCheckout':
      result = await metaCapi.sendInitiateCheckout(args);
      break;
    default:
      return res.status(400).json({ ok: false, error: 'Unknown event_name' });
  }

  return res.status(200).json(result);
}
