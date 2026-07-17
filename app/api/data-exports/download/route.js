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

function safeFilename(value) {
  return String(value || 'lieromaa-tilaustiedot.json').replace(/[^a-zA-Z0-9._-]/g, '-');
}

export async function POST(request) {
  const language = getPublicRequestLanguage(request);
  if (!isSameOriginRequest(request)) {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.SAME_ORIGIN_REQUIRED, language),
      { status: 403 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.INVALID_REQUEST, language),
      { status: 400 }
    );
  }

  try {
    const baseUrl = getRequiredEnv('ORDER_SERVICE_URL').replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/api/public/data-exports/download`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Order-Token': getRequiredEnv('ORDER_SERVICE_TOKEN'),
        [LIEROMAA_LANGUAGE_HEADER]: language,
      },
      body: JSON.stringify({ token: payload?.token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      return Response.json(
        createPublicErrorBody(
          result?.code || PUBLIC_MESSAGE_CODES.INVALID_REQUEST,
          language,
          result?.message || undefined
        ),
        { status: response.status || 502, headers: { 'Cache-Control': 'no-store' } }
      );
    }

    return new Response(`${JSON.stringify(result.data, null, 2)}\n`, {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-store, max-age=0',
        'Content-Disposition': `attachment; filename="${safeFilename(result.filename)}"`,
        'Content-Type': 'application/json; charset=utf-8',
        'Referrer-Policy': 'no-referrer',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('Data export download forwarding failed:', error);
    return Response.json(
      createPublicErrorBody(PUBLIC_MESSAGE_CODES.UPSTREAM_UNAVAILABLE, language),
      { status: 502 }
    );
  }
}
