import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import {
  PUBLIC_MESSAGE_CODES,
  createPublicErrorBody,
  getPublicRequestLanguage,
} from '@/lib/api/publicLanguage';
import { getClientIp } from '@/lib/invoicePayment/clientIp';
import {
  buildPickupServiceEndpoint,
  forwardPickupJson,
  getPickupServiceHeaders,
  getPickupServiceTimeout,
} from '@/lib/pickup/orderServiceProxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kentät, jotka maksusivu (app/(fi)/maksa/InvoicePaymentClient.jsx) lukee.
const SESSION_FIELDS = ['status', 'language', 'invoiceNumber', 'amountCents', 'dueDate'];

function selectSessionFields(data) {
  const selected = { ok: true };
  for (const field of SESSION_FIELDS) {
    if (data[field] !== undefined) {
      selected[field] = data[field];
    }
  }
  return selected;
}

// Laskun maksusivun haku tilausjärjestelmästä. Koodi kulkee kyselyparametrina, eikä sitä kirjata lokiin.
export async function GET(request) {
  const language = getPublicRequestLanguage(request);
  if (!isSameOriginRequest(request)) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED, language),
      { status: 403 }
    );
  }

  const code = request.nextUrl.searchParams.get('code')?.trim() || '';
  if (!code || code.length > 20) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.INVALID_REQUEST, language),
      { status: 400 }
    );
  }

  let endpoint;
  let headers;
  try {
    endpoint = buildPickupServiceEndpoint('/api/public/invoice-payment/session', {
      code,
    });
    headers = getPickupServiceHeaders(language, {
      Accept: 'application/json',
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
      method: 'GET',
      headers,
      signal: getPickupServiceTimeout(),
      cache: 'no-store',
    });
    return await forwardPickupJson(upstreamResponse, language, {
      label: 'Invoice payment session request',
      selectResponse: selectSessionFields,
    });
  } catch (error) {
    console.error('Invoice payment session forwarding failed:', error);
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }
}
