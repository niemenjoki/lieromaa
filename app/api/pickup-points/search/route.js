import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const DEFAULT_POSTI_AUTH_URL = 'https://gateway-auth.posti.fi/api/v1/token';
const DEFAULT_POSTI_GATEWAY_URL = 'https://gateway.posti.fi';
const DEFAULT_POSTI_API_VERSION = '2025-04';
const PICKUP_POINT_ERROR_MESSAGE = 'Noutopistehaku ei ole juuri nyt käytettävissä.';

let tokenCache = {
  accessToken: '',
  expiresAt: 0,
};

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}"`);
  }

  return value;
}

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

function buildPickupPointSearchUrl() {
  const gatewayUrl =
    trimValue(process.env.POSTI_API_GATEWAY_URL) || DEFAULT_POSTI_GATEWAY_URL;
  const apiVersion =
    trimValue(process.env.POSTI_API_VERSION) || DEFAULT_POSTI_API_VERSION;

  return `${gatewayUrl.replace(/\/+$/, '')}/${apiVersion}/pickuppoints`;
}

function buildPickupPointSearchBody({ street, postalCode, city, limit }) {
  return {
    searchCriteria: {
      location: {
        postcode: postalCode,
        countryCode: 'FI',
        ...(street ? { street } : {}),
        ...(city ? { city } : {}),
      },
      serviceFilters: {},
    },
    limit,
  };
}

function normalizePickupPoint(point) {
  const location = point?.location ?? {};

  return {
    id: trimValue(point?.id),
    name: trimValue(point?.publicName),
    careOf: trimValue(point?.careOf),
    street: trimValue(location?.street),
    postalCode: trimValue(location?.postcode),
    city: trimValue(location?.city),
    municipality: trimValue(location?.municipality),
    specificLocation: trimValue(location?.specificLocation),
    parcelLocker: Boolean(point?.parcelLocker),
    routingServiceCode: trimValue(point?.routingServiceCode),
    distanceInMeters:
      Number.isFinite(Number(point?.distanceInMeters)) &&
      Number(point?.distanceInMeters) >= 0
        ? Number(point.distanceInMeters)
        : null,
  };
}

async function getAccessToken() {
  if (tokenCache.accessToken && tokenCache.expiresAt > Date.now() + 30_000) {
    return tokenCache.accessToken;
  }

  const authUrl = trimValue(process.env.POSTI_API_AUTH_URL) || DEFAULT_POSTI_AUTH_URL;
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: getRequiredEnv('POSTI_API_CLIENT_ID'),
    client_secret: getRequiredEnv('POSTI_API_CLIENT_SECRET'),
  });

  const response = await fetch(authUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });

  const responseData = await response.json().catch(() => null);
  if (!response.ok || !responseData?.access_token) {
    throw new Error('Posti access token request failed.');
  }

  const expiresInSeconds = Math.max(60, Number(responseData.expires_in) || 300);
  tokenCache = {
    accessToken: responseData.access_token,
    expiresAt: Date.now() + expiresInSeconds * 1000,
  };

  return tokenCache.accessToken;
}

export async function GET(request) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse(
      {
        ok: false,
        message: 'Virheellinen noutopistehaku.',
      },
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
      {
        ok: false,
        message: 'Anna vähintään postinumero noutopistehakua varten.',
      },
      { status: 400 }
    );
  }

  if (!isMainlandFinlandPostalCode(postalCode)) {
    return jsonResponse(
      {
        ok: false,
        message:
          'Noutopistehaku on käytettävissä vain manner-Suomen 5-numeroisilla postinumeroilla.',
      },
      { status: 400 }
    );
  }

  let accessToken;
  try {
    accessToken = await getAccessToken();
  } catch (error) {
    console.error('Pickup point search configuration error:', error);
    return jsonResponse(
      {
        ok: false,
        message: PICKUP_POINT_ERROR_MESSAGE,
      },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(buildPickupPointSearchUrl(), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Language': 'fi',
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        buildPickupPointSearchBody({
          street,
          postalCode,
          city,
          limit,
        })
      ),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });

    const responseData = await response.json().catch(() => null);
    if (!response.ok || !Array.isArray(responseData?.pickupPoints)) {
      console.error('Pickup point search failed:', responseData);
      return jsonResponse(
        {
          ok: false,
          message: PICKUP_POINT_ERROR_MESSAGE,
        },
        { status: response.status || 502 }
      );
    }

    return jsonResponse({
      ok: true,
      pickupPoints: responseData.pickupPoints
        .map(normalizePickupPoint)
        .filter((point) => isMainlandFinlandPostalCode(point.postalCode)),
    });
  } catch (error) {
    console.error('Pickup point search request failed:', error);
    return jsonResponse(
      {
        ok: false,
        message: PICKUP_POINT_ERROR_MESSAGE,
      },
      { status: 502 }
    );
  }
}
