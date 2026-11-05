import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import {
  PUBLIC_MESSAGE_CODES,
  createPublicErrorBody,
  getPublicRequestLanguage,
} from '@/lib/api/publicLanguage';
import { getClientIp } from '@/lib/invoicePayment/clientIp';
import { isStripeCheckoutUrl } from '@/lib/orders/stripeCheckoutUrl';
import {
  buildPickupServiceEndpoint,
  forwardPickupJson,
  getPickupServiceHeaders,
  getPickupServiceTimeout,
} from '@/lib/pickup/orderServiceProxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Selaimelle palautetaan vain Stripen maksusivun osoite.
function selectCheckoutFields(data) {
  return isStripeCheckoutUrl(data.url) ? { ok: true, url: data.url } : null;
}

// Avaa laskulle maksusivun (Stripe Checkout) ja palauttaa sen osoitteen.
export async function POST(request) {
  const language = getPublicRequestLanguage(request);
  if (!isSameOriginRequest(request)) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED, language),
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const code = String(body?.code || '').trim();
  if (!code || code.length > 20) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.INVALID_REQUEST, language),
      { status: 400 }
    );
  }

  let endpoint;
  let headers;
  try {
    endpoint = buildPickupServiceEndpoint('/api/public/invoice-payment/checkout');
    headers = getPickupServiceHeaders(language, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Lieromaa-Client-Ip': getClientIp(request),
    });
  } catch (error) {
    console.error('Invoice payment service configuration error:', error);
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code }),
      signal: getPickupServiceTimeout(),
      cache: 'no-store',
    });
    return await forwardPickupJson(upstreamResponse, language, {
      label: 'Invoice payment checkout request',
      selectResponse: selectCheckoutFields,
    });
  } catch (error) {
    console.error('Invoice payment checkout forwarding failed:', error);
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }
}
