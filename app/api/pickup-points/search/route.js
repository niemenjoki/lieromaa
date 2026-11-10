import {
  PostiPickupError,
  createPostiPickupClient,
} from '@niemenjoki/posti-pickup-points';

import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import {
  PUBLIC_MESSAGE_CODES,
  createPublicErrorBody,
  getPublicRequestLanguage,
} from '@/lib/api/publicLanguage';
import { getPublicUpstreamStatus } from '@/lib/api/upstreamError';
import { getTransactionMessages } from '@/lib/i18n/messages.mjs';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Postin rajapinta, tunnuksen välimuisti ja tulosten muoto tulevat paketista
// @niemenjoki/posti-pickup-points. Asiakas luodaan kerran samoilla asetuksilla, jotta
// tunnuksen välimuisti toimii, ja uudelleen vain, jos asetukset muuttuvat.
let cachedClient = { key: '', client: null };

function jsonResponse(body, init) {
  return Response.json(body, init);
}

function trimValue(value) {
  return String(value || '').trim();
}

function normalizePostalCode(value) {
  return trimValue(value).replace(/\s+/g, '');
}

function isMainlandFinlandPostalCode(value) {
  return /^\d{5}$/.test(value) && !value.startsWith('22');
}

function getSearchLimit(value) {
  if (value === null || value === undefined || String(value).trim() === '') {
    return 8;
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 8;
  }

  return Math.min(12, Math.max(1, Math.round(numericValue)));
}

function getPostiClient() {
  const options = {
    clientId: trimValue(process.env.POSTI_API_CLIENT_ID),
    clientSecret: trimValue(process.env.POSTI_API_CLIENT_SECRET),
    authUrl: trimValue(process.env.POSTI_API_AUTH_URL),
    gatewayUrl: trimValue(process.env.POSTI_API_GATEWAY_URL),
    apiVersion: trimValue(process.env.POSTI_API_VERSION),
  };
  const key = JSON.stringify(options);
  if (cachedClient.client && cachedClient.key === key) {
    return cachedClient.client;
  }

  const client = createPostiPickupClient({
    ...options,
    // Haetaan globaali fetch vasta kutsuhetkellä, jotta testien korvaama fetch on käytössä.
    fetch: (...args) => globalThis.fetch(...args),
  });
  cachedClient = { key, client };
  return client;
}

// Selaimelle palautetaan samat kentät kuin ennen pakettia, ei Postin alkuperäistä vastausta.
function toPublicPickupPoint(point) {
  return {
    id: point.id,
    name: point.name,
    careOf: point.careOf,
    street: point.street,
    postalCode: point.postalCode,
    city: point.city,
    municipality: point.municipality,
    specificLocation: point.specificLocation,
    parcelLocker: point.parcelLocker,
    routingServiceCode: point.routingServiceCode,
    // Postin null-etäisyys oli ennen pakettia 0 (Number(null)). Paketti antaa null, joten vanha arvo palautetaan.
    distanceInMeters:
      point.distanceInMeters === null && point.raw?.distanceInMeters === null
        ? 0
        : point.distanceInMeters,
  };
}

function getFailureStatus(error) {
  if (!(error instanceof PostiPickupError)) {
    return 502;
  }

  if (error.code === 'missing_credentials' || error.code === 'auth_failed') {
    return 503;
  }

  if (error.code === 'upstream_error') {
    return getPublicUpstreamStatus(error.status);
  }

  return 502;
}

function logFailure(error) {
  if (error instanceof PostiPickupError) {
    console.error(
      `Pickup point search failed (${error.code}${error.status ? `, status ${error.status}` : ''}):`,
      error.details ?? error.message
    );
    return;
  }

  console.error('Pickup point search request failed:', error);
}

export async function GET(request) {
  const language = getPublicRequestLanguage(request);
  const copy = getTransactionMessages(language).checkout;
  if (!isSameOriginRequest(request)) {
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED, language),
      { status: 403 }
    );
  }

  const postalCode = normalizePostalCode(
    request.nextUrl.searchParams.get('postalCode') || ''
  );
  const street = trimValue(request.nextUrl.searchParams.get('street') || '');
  const city = trimValue(request.nextUrl.searchParams.get('city') || '');
  const limit = getSearchLimit(request.nextUrl.searchParams.get('limit'));

  if (!postalCode) {
    return jsonResponse(
      createPublicErrorBody('invalid_postcode', language, copy.postcodeInvalid),
      { status: 400 }
    );
  }

  if (!isMainlandFinlandPostalCode(postalCode)) {
    return jsonResponse(
      createPublicErrorBody(
        'invalid_postcode',
        language,
        language === 'en'
          ? 'Pickup-point search is available only for five-digit postcodes in mainland Finland.'
          : 'Noutopistehaku on käytettävissä vain manner-Suomen 5-numeroisilla postinumeroilla.'
      ),
      { status: 400 }
    );
  }

  try {
    const pickupPoints = await getPostiClient().search({
      postalCode,
      street,
      city,
      limit,
      language,
    });

    return jsonResponse({
      ok: true,
      pickupPoints: pickupPoints
        .filter((point) => isMainlandFinlandPostalCode(point.postalCode))
        .map(toPublicPickupPoint),
    });
  } catch (error) {
    logFailure(error);
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: getFailureStatus(error) }
    );
  }
}
