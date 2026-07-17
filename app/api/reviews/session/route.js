import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import {
  LIEROMAA_LANGUAGE_HEADER,
  PUBLIC_MESSAGE_CODES,
  createPublicErrorBody,
  getPublicRequestLanguage,
} from '@/lib/api/publicLanguage';

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
  const language = getPublicRequestLanguage(request);
  if (!isSameOriginRequest(request)) {
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED, language),
      { status: 403 }
    );
  }

  const token = request.nextUrl.searchParams.get('token')?.trim() || '';
  if (!token) {
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.INVALID_REQUEST, language),
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
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetch(reviewServiceUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        [LIEROMAA_LANGUAGE_HEADER]: language,
      },
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
      cache: 'no-store',
    });

    const responseData = await upstreamResponse.json().catch(() => null);
    if (!upstreamResponse.ok || !responseData?.ok) {
      return jsonResponse(
        createPublicErrorBody(
          responseData?.code || PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE,
          language,
          responseData?.message || undefined
        ),
        { status: upstreamResponse.status || 502 }
      );
    }

    return jsonResponse({
      ok: true,
      status: responseData.status || 'ready',
      orderId: responseData.orderId || '',
      productKey: responseData.productKey || '',
      productName: responseData.productName || '',
      productTargets: Array.isArray(responseData.productTargets)
        ? responseData.productTargets
        : [],
      testMode: Boolean(responseData.testMode),
      language: responseData.language === 'en' ? 'en' : 'fi',
    });
  } catch (error) {
    console.error('Review session forwarding failed:', error);
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }
}
