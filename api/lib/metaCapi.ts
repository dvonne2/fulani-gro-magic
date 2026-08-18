import { createMetaCapi } from 'vitalvida-meta-tracking/server';

function parseEnvList(value: string | undefined): string[] | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // fall through
    }
  }
  const list = trimmed.split(',').map(s => s.trim()).filter(Boolean);
  return list.length ? list : undefined;
}

function createCapi() {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_ACCESS_TOKEN;
  const apiVersion = process.env.META_API_VERSION;

  if (!pixelId || !accessToken || !apiVersion) {
    console.warn('[Meta CAPI] not configured');
    return null;
  }

  return createMetaCapi({
    pixelId,
    accessToken,
    apiVersion,
    testEventCode: process.env.META_TEST_EVENT_CODE,
    allowedOrigins: parseEnvList(process.env.META_CAPI_ALLOWED_ORIGINS),
    allowedSourceHosts: parseEnvList(process.env.META_CAPI_ALLOWED_SOURCE_HOSTS),
  });
}

export const metaCapi = createCapi();
