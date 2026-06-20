import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';

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
  if (!isSameOriginRequest(request)) {
    return Response.json({ ok: false }, { status: 403 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  try {
    const baseUrl = getRequiredEnv('ORDER_SERVICE_URL').replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/api/public/data-exports/download`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Order-Token': getRequiredEnv('ORDER_SERVICE_TOKEN'),
      },
      body: JSON.stringify({ token: payload?.token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      return Response.json(
        {
          ok: false,
          message: result?.message || 'Latauslinkki ei ole enää voimassa.',
        },
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
      { ok: false, message: 'Tietojen lataaminen epäonnistui.' },
      { status: 502 }
    );
  }
}
