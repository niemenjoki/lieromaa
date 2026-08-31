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
  if (!value) throw new Error(`Missing required environment variable "${name}"`);
  return value;
}

export async function GET(request) {
  const language = getPublicRequestLanguage(request);
  if (!isSameOriginRequest(request)) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED, language),
      { status: 403 }
    );
  }

  const sessionId = new URL(request.url).searchParams.get('session_id') || '';
  const runtimeMode = process.env.NODE_ENV === 'production' ? 'live' : 'test';
  if (!new RegExp(`^cs_${runtimeMode}_[A-Za-z0-9]+$`).test(sessionId)) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.INVALID_REQUEST, language),
      { status: 400 }
    );
  }

  try {
    const baseUrl = getRequiredEnv('ORDER_SERVICE_URL').replace(/\/+$/, '');
    const token = getRequiredEnv('ORDER_SERVICE_TOKEN');
    const endpoint = new URL(`${baseUrl}/api/public/orders/payment-status`);
    endpoint.searchParams.set('sessionId', sessionId);
    const upstream = await fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'X-Order-Token': token,
        [LIEROMAA_LANGUAGE_HEADER]: language,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
    });
    const data = await upstream.json().catch(() => null);
    if (!upstream.ok || !data?.ok) {
      return Response.json(
        createPublicErrorBody(
          data?.code || PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE,
          language,
          data?.message
        ),
        { status: upstream.status || 502 }
      );
    }

    return Response.json(
      {
        ok: true,
        orderId: data.orderId,
        paymentStatus: data.paymentStatus,
        checkoutStatus: data.checkoutStatus,
        outcomeCode: data.outcomeCode,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Payment status proxy failed:', error);
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }
}
