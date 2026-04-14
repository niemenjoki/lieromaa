import { REVIEW_ERROR_MESSAGE } from '@/data/copy/reviewMessages';
import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}"`);
  }

  return value;
}

function buildReviewServiceEndpoint(baseUrl, token) {
  const endpoint = new URL('/api/public/reviews/session', baseUrl.replace(/\/+$/, ''));
  endpoint.searchParams.set('token', token);
  return endpoint.toString();
}

function jsonResponse(body, init) {
  return Response.json(body, init);
}

export async function GET(request) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse(
      {
        ok: false,
        message: 'Virheellinen tarkistuspyyntö.',
      },
      { status: 403 }
    );
  }

  const token = request.nextUrl.searchParams.get('token')?.trim() || '';
  if (!token) {
    return jsonResponse(
      {
        ok: false,
        message: 'Arvostelulinkki puuttuu.',
      },
      { status: 400 }
    );
  }

  let reviewServiceUrl;
  try {
    reviewServiceUrl = buildReviewServiceEndpoint(
      getRequiredEnv('ORDER_SERVICE_URL'),
      token
    );
  } catch (error) {
    console.error('Review service configuration error:', error);
    return jsonResponse(
      {
        ok: false,
        message: REVIEW_ERROR_MESSAGE,
      },
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetch(reviewServiceUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
      cache: 'no-store',
    });

    const responseData = await upstreamResponse.json().catch(() => null);
    if (!upstreamResponse.ok || !responseData?.ok) {
      return jsonResponse(
        {
          ok: false,
          message: responseData?.message || REVIEW_ERROR_MESSAGE,
        },
        { status: upstreamResponse.status || 502 }
      );
    }

    return jsonResponse({
      ok: true,
      status: responseData.status || 'ready',
      orderId: responseData.orderId || '',
      productKey: responseData.productKey || '',
      productName: responseData.productName || '',
    });
  } catch (error) {
    console.error('Review session forwarding failed:', error);
    return jsonResponse(
      {
        ok: false,
        message: REVIEW_ERROR_MESSAGE,
      },
      { status: 502 }
    );
  }
}
