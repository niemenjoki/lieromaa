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

export async function GET(request) {
  const language = getPublicRequestLanguage(request);
  if (!isSameOriginRequest(request)) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED, language),
      { status: 403 }
    );
  }

  const token = request.nextUrl.searchParams.get('token')?.trim() || '';
  if (!token) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.INVALID_REQUEST, language),
      { status: 400 }
    );
  }

  let endpoint;
  let headers;
  try {
    endpoint = buildPickupServiceEndpoint('/api/public/pickup/session', { token });
    headers = getPickupServiceHeaders(language, { Accept: 'application/json' });
  } catch (error) {
    console.error('Pickup service configuration error:', error);
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
    return await forwardPickupJson(upstreamResponse, language);
  } catch (error) {
    console.error('Pickup session forwarding failed:', error);
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }
}
