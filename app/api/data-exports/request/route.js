import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable "${name}"`);
  return value;
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
    const response = await fetch(`${baseUrl}/api/public/data-exports/request`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Order-Token': getRequiredEnv('ORDER_SERVICE_TOKEN'),
      },
      body: JSON.stringify({
        orderId: payload?.orderId,
        email: payload?.email,
        _gotcha: payload?._gotcha,
        requestContext: {
          forwardedFor: request.headers.get('x-forwarded-for') || '',
        },
      }),
      cache: 'no-store',
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
    });
    if (!response.ok) {
      throw new Error(`Data export service returned ${response.status}`);
    }

    return Response.json(
      { ok: true },
      { status: 202, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Data export request forwarding failed:', error);
    return Response.json({ ok: false }, { status: 502 });
  }
}
