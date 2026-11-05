import {
  LIEROMAA_LANGUAGE_HEADER,
  PUBLIC_MESSAGE_CODES,
  createPublicErrorBody,
} from '@/lib/api/publicLanguage';
import { createUpstreamErrorResponse } from '@/lib/api/upstreamError';

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

// selectResponse rajaa onnistuneen vastauksen kentät. Jos se palauttaa null, vastausta ei
// välitetä, ja asiakas saa 502:n ja yleisen virheen.
export async function forwardPickupJson(
  upstreamResponse,
  language,
  { label = 'Order service request', selectResponse } = {}
) {
  const responseData = await upstreamResponse.json().catch(() => null);
  if (!upstreamResponse.ok || !responseData?.ok) {
    return createUpstreamErrorResponse(upstreamResponse, responseData, language, {
      label,
    });
  }

  const publicData = selectResponse ? selectResponse(responseData) : responseData;
  if (!publicData) {
    console.error(`${label} returned a response that cannot be passed to the browser.`);
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }

  return Response.json(publicData, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
