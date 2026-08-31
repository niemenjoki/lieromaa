import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import {
  LIEROMAA_LANGUAGE_HEADER,
  PUBLIC_MESSAGE_CODES,
  createPublicErrorBody,
  getPublicRequestLanguage,
} from '@/lib/api/publicLanguage';
import {
  PublicOrderValidationError,
  getOrderValidationMessage,
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

function getStripeRuntimeMode() {
  return process.env.NODE_ENV === 'production' ? 'live' : 'test';
}

function isSafeStripeCheckoutResponse(responseData) {
  if (responseData?.paymentProvider !== 'STRIPE') return true;

  const expectedPrefix = `cs_${getStripeRuntimeMode()}_`;
  if (!String(responseData.checkoutSessionId || '').startsWith(expectedPrefix)) {
    return false;
  }
  if (!responseData.checkoutUrl) return responseData.checkoutStatus === 'COMPLETE';

  try {
    const checkoutUrl = new URL(responseData.checkoutUrl);
    return (
      checkoutUrl.protocol === 'https:' && checkoutUrl.hostname === 'checkout.stripe.com'
    );
  } catch {
    return false;
  }
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

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.INVALID_REQUEST, language),
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
        createPublicErrorBody(
          error.code,
          language,
          language === 'fi'
            ? error.publicMessage
            : getOrderValidationMessage(error, language)
        ),
        { status: error.statusCode }
      );
    }

    console.error('Unexpected order validation error:', error);
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UNKNOWN_ERROR, language),
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
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
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
        'X-Lieromaa-Stripe-Mode': getStripeRuntimeMode(),
        [LIEROMAA_LANGUAGE_HEADER]: normalizedOrder.language,
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
        createPublicErrorBody(
          responseData?.code || PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE,
          language,
          responseData?.message || undefined
        ),
        { status: upstreamResponse.status || 502 }
      );
    }

    const responsePaymentProvider = String(
      responseData.paymentProvider || ''
    ).toUpperCase();
    if (responsePaymentProvider !== normalizedOrder.paymentProvider) {
      console.error('Order service returned a mismatched payment provider.', {
        requested: normalizedOrder.paymentProvider,
        received: responsePaymentProvider || 'MISSING',
      });
      return jsonResponse(
        createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
        { status: 502 }
      );
    }

    if (!isSafeStripeCheckoutResponse(responseData)) {
      console.error(
        'Order service returned a Stripe Checkout response for the wrong environment.'
      );
      return jsonResponse(
        createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
        { status: 502 }
      );
    }

    return jsonResponse({
      ok: true,
      orderId: responseData.orderId || null,
      duplicate: Boolean(responseData.duplicate),
      paymentProvider: responsePaymentProvider,
      paymentStatus: responseData.paymentStatus || 'UNPAID',
      checkoutStatus: responseData.checkoutStatus || '',
      checkoutUrl: responseData.checkoutUrl || '',
      checkoutSessionId: responseData.checkoutSessionId || '',
    });
  } catch (error) {
    console.error('Order service forwarding failed:', error);
    return jsonResponse(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }
}
