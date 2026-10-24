import {
  LIEROMAA_LANGUAGE_HEADER,
  PUBLIC_MESSAGE_CODES,
  createPublicErrorBody,
} from '@/lib/api/publicLanguage';

// Noutoajan varaussivun välitys tilausjärjestelmään (orders-ingest /api/public/pickup/*). Token kulkee
// kyselyparametrina tai rungossa, eikä sitä kirjata lokiin.

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}"`);
  }

  return value;
}

export function buildPickupServiceEndpoint(pathname, searchParams = {}) {
  const endpoint = new URL(
    pathname,
    getRequiredEnv('ORDER_SERVICE_URL').replace(/\/+$/, '')
  );
  for (const [key, value] of Object.entries(searchParams)) {
    endpoint.searchParams.set(key, value);
  }
  return endpoint.toString();
}

export function getPickupServiceHeaders(language, extra = {}) {
  return {
    'X-Order-Token': getRequiredEnv('ORDER_SERVICE_TOKEN'),
    [LIEROMAA_LANGUAGE_HEADER]: language,
    ...extra,
  };
}

export function getPickupServiceTimeout() {
  return AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000);
}

export async function forwardPickupJson(upstreamResponse, language) {
  const responseData = await upstreamResponse.json().catch(() => null);
  if (!upstreamResponse.ok || !responseData?.ok) {
    return Response.json(
      createPublicErrorBody(
        responseData?.code || PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE,
        language,
        responseData?.message || undefined
      ),
      { status: upstreamResponse.status || 502 }
    );
  }

  return Response.json(responseData, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
