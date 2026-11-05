import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import {
  LIEROMAA_LANGUAGE_HEADER,
  PUBLIC_MESSAGE_CODES,
  createPublicErrorBody,
  getPublicRequestLanguage,
} from '@/lib/api/publicLanguage';
import { createUpstreamErrorResponse } from '@/lib/api/upstreamError';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}"`);
  }

  return value;
}

function buildReviewServiceEndpoint(baseUrl) {
  return `${baseUrl.replace(/\/+$/, '')}/api/public/reviews`;
}

function jsonResponse(body, init) {
  return Response.json(body, init);
}

export async function POST(request) {
  const language = getPublicRequestLanguage(request);
  if (!isSameOriginRequest(request)) {
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED, language),
      { status: 403 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.INVALID_REQUEST, language),
      { status: 400 }
    );
  }

  let reviewServiceUrl;
  try {
    reviewServiceUrl = buildReviewServiceEndpoint(getRequiredEnv('ORDER_SERVICE_URL'));
  } catch (error) {
    console.error('Review service configuration error:', error);
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetch(reviewServiceUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        [LIEROMAA_LANGUAGE_HEADER]: language,
      },
      body: JSON.stringify(payload || {}),
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
    });

    const responseData = await upstreamResponse.json().catch(() => null);
    if (!upstreamResponse.ok || !responseData?.ok) {
      return createUpstreamErrorResponse(upstreamResponse, responseData, language, {
        label: 'Review submission',
      });
    }

    return jsonResponse({
      ok: true,
      reviewId: responseData.reviewId || null,
    });
  } catch (error) {
    console.error('Review submission forwarding failed:', error);
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }
}
