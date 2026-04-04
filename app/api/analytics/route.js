import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}"`);
  }

  return value;
}

function buildAnalyticsServiceEndpoint(baseUrl) {
  return `${baseUrl.replace(/\/+$/, '')}/api/public/analytics`;
}

function jsonResponse(body, init) {
  return Response.json(body, init);
}

export async function POST(request) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse(
      {
        ok: false,
        message: 'Virheellinen analytiikkapyyntö.',
      },
      { status: 403 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse(
      {
        ok: false,
        message: 'Analytiikkadatan lukeminen epäonnistui.',
      },
      { status: 400 }
    );
  }

  let analyticsServiceUrl;
  let orderServiceToken;
  try {
    analyticsServiceUrl = buildAnalyticsServiceEndpoint(
      getRequiredEnv('ORDER_SERVICE_URL')
    );
    orderServiceToken = getRequiredEnv('ORDER_SERVICE_TOKEN');
  } catch (error) {
    console.error('Analytics service configuration error:', error);
    return jsonResponse(
      {
        ok: false,
        message: 'Analytiikkapalvelu ei ole juuri nyt käytettävissä.',
      },
      { status: 500 }
    );
  }

  try {
    const upstreamResponse = await fetch(analyticsServiceUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Order-Token': orderServiceToken,
      },
      body: JSON.stringify(payload || {}),
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 5000),
      cache: 'no-store',
    });

    if (!upstreamResponse.ok) {
      const responseData = await upstreamResponse.json().catch(() => null);
      return jsonResponse(
        {
          ok: false,
          message: responseData?.message || 'Analytiikkadatan lähetys epäonnistui.',
        },
        { status: upstreamResponse.status || 502 }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Analytics forwarding failed:', error);
    return jsonResponse(
      {
        ok: false,
        message: 'Analytiikkadatan lähetys epäonnistui.',
      },
      { status: 502 }
    );
  }
}
