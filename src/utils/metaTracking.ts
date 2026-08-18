import { createMetaBrowser } from 'vitalvida-meta-tracking/browser';

const pixelId = typeof __META_PIXEL_ID__ !== 'undefined' ? __META_PIXEL_ID__ : '';

export const meta = createMetaBrowser({
  pixelId,
  capiEndpoint: '/api/meta-capi',
  country: 'ng',
  onError: (err) => {
    console.error('[Meta Browser]', err);
  },
});
