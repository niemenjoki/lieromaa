import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import {
  PUBLIC_MESSAGE_CODES,
  createPublicErrorBody,
  getPublicRequestLanguage,
} from '@/lib/api/publicLanguage';
import {
  buildPickupServiceEndpoint,
  forwardPickupJson,
  getPickupServiceHeaders,
  getPickupServiceTimeout,
} from '@/lib/pickup/orderServiceProxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  const language = getPublicRequestLanguage(request);
  if (!isSameOriginRequest(request)) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED, language),
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  const token = String(body?.token || '').trim();
  const slotId = Number(body?.slotId);
  if (!token || !Number.isInteger(slotId) || slotId <= 0) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.INVALID_REQUEST, language),
      { status: 400 }
    );
  }

  let endpoint;
  let headers;
  try {
    endpoint = buildPickupServiceEndpoint('/api/public/pickup/book');
    headers = getPickupServiceHeaders(language, {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  } catch (error) {
    console.error('Pickup service configuration error:', error);
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ token, slotId }),
      signal: getPickupServiceTimeout(),
      cache: 'no-store',
    });
    return await forwardPickupJson(upstreamResponse, language);
  } catch (error) {
    console.error('Pickup booking forwarding failed:', error);
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }
}
