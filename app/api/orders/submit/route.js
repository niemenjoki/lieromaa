import { ORDER_ERROR_MESSAGE } from '@/data/commerce/orderMessages';
import {
  PublicOrderValidationError,
  normalizePublicOrderSubmission,
} from '@/lib/orders/normalizePublicOrder';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}"`);
  }

  return value;
}

function buildOrderServiceEndpoint(baseUrl) {
  return `${baseUrl.replace(/\/+$/, '')}/api/public/orders`;
}

function isSameOriginRequest(request) {
  const origin = request.headers.get('origin');
  if (!origin) {
    return true;
  }

  return origin === request.nextUrl.origin;
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

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: 'Lomakkeen lukeminen epäonnistui.',
      },
      { status: 400 }
    );
  }

  let normalizedOrder;
  try {
    normalizedOrder = normalizePublicOrderSubmission(formData);
  } catch (error) {
    if (error instanceof PublicOrderValidationError) {
      if (error.code === 'spam') {
        return jsonResponse({ ok: true, ignored: true });
      }

      return jsonResponse(
        {
          ok: false,
          message: error.publicMessage,
        },
        { status: error.statusCode }
      );
    }

    console.error('Unexpected order validation error:', error);
    return jsonResponse(
      {
        ok: false,
        message: ORDER_ERROR_MESSAGE,
      },
      { status: 500 }
    );
  }

  let orderServiceUrl;
  let orderServiceToken;
  try {
    orderServiceUrl = buildOrderServiceEndpoint(getRequiredEnv('ORDER_SERVICE_URL'));
    orderServiceToken = getRequiredEnv('ORDER_SERVICE_TOKEN');
  } catch (error) {
    console.error('Order service configuration error:', error);
    return jsonResponse(
      {
        ok: false,
        message: ORDER_ERROR_MESSAGE,
      },
      { status: 500 }
    );
  }

  const requestContext = {
    origin: request.headers.get('origin') || '',
    referer: request.headers.get('referer') || '',
    userAgent: request.headers.get('user-agent') || '',
    forwardedFor: request.headers.get('x-forwarded-for') || '',
  };

  try {
    const upstreamResponse = await fetch(orderServiceUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Order-Token': orderServiceToken,
        'X-Idempotency-Key': normalizedOrder.sourceRequestId,
      },
      body: JSON.stringify({
        ...normalizedOrder,
        requestContext,
      }),
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
    });

    const responseData = await upstreamResponse.json().catch(() => null);
    if (!upstreamResponse.ok || !responseData?.ok) {
      console.error('Order service rejected request:', responseData);
      return jsonResponse(
        {
          ok: false,
          message: responseData?.message || ORDER_ERROR_MESSAGE,
        },
        { status: upstreamResponse.status || 502 }
      );
    }

    return jsonResponse({
      ok: true,
      orderId: responseData.orderId || null,
      duplicate: Boolean(responseData.duplicate),
    });
  } catch (error) {
    console.error('Order service forwarding failed:', error);
    return jsonResponse(
      {
        ok: false,
        message: ORDER_ERROR_MESSAGE,
      },
      { status: 502 }
    );
  }
}
