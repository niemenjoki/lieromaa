import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const GUIDE_FEEDBACK_ERROR_MESSAGE =
  'Viestin lähetys epäonnistui. Yritä hetken kuluttua uudelleen.';

function getRequiredEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable "${name}"`);
  }

  return value;
}

function buildGuideFeedbackServiceEndpoint(baseUrl) {
  return `${baseUrl.replace(/\/+$/, '')}/api/public/guide-feedback`;
}

function jsonResponse(body, init) {
  return Response.json(body, init);
}

export async function POST(request) {
  if (!isSameOriginRequest(request)) {
    return jsonResponse(
      {
        ok: false,
        message: 'Virheellinen lähetyspyyntö.',
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
        message: 'Viestin lukeminen epäonnistui.',
      },
      { status: 400 }
    );
  }

  let guideFeedbackServiceUrl;
  let orderServiceToken;
  try {
    guideFeedbackServiceUrl = buildGuideFeedbackServiceEndpoint(
      getRequiredEnv('ORDER_SERVICE_URL')
    );
    orderServiceToken = getRequiredEnv('ORDER_SERVICE_TOKEN');
  } catch (error) {
    console.error('Guide feedback service configuration error:', error);
    return jsonResponse(
      {
        ok: false,
        message: GUIDE_FEEDBACK_ERROR_MESSAGE,
      },
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
    const upstreamResponse = await fetch(guideFeedbackServiceUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-Order-Token': orderServiceToken,
      },
      body: JSON.stringify({
        ...(payload || {}),
        requestContext,
      }),
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
    });

    const responseData = await upstreamResponse.json().catch(() => null);
    if (!upstreamResponse.ok || !responseData?.ok) {
      return jsonResponse(
        {
          ok: false,
          message: responseData?.message || GUIDE_FEEDBACK_ERROR_MESSAGE,
        },
        { status: upstreamResponse.status || 502 }
      );
    }

    return jsonResponse({
      ok: true,
      messageId: responseData.messageId || null,
    });
  } catch (error) {
    console.error('Guide feedback forwarding failed:', error);
    return jsonResponse(
      {
        ok: false,
        message: GUIDE_FEEDBACK_ERROR_MESSAGE,
      },
      { status: 502 }
    );
  }
}
