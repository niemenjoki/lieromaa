import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import { REVIEW_ERROR_MESSAGE } from '@/lib/copy/reviewMessages';

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
  if (!isSameOriginRequest(request)) {
    return jsonResponse(
      {
        ok: false,
        message: 'Virheellinen lähetyspyyntö.',
      },
      { status: 403 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: 'Arvostelun lukeminen epäonnistui.',
      },
      { status: 400 }
    );
  }

  let reviewServiceUrl;
  try {
    reviewServiceUrl = buildReviewServiceEndpoint(getRequiredEnv('ORDER_SERVICE_URL'));
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
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload || {}),
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
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
      reviewId: responseData.reviewId || null,
    });
  } catch (error) {
    console.error('Review submission forwarding failed:', error);
    return jsonResponse(
      {
        ok: false,
        message: REVIEW_ERROR_MESSAGE,
      },
      { status: 502 }
    );
  }
}
