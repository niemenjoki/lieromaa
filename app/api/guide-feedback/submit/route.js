import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import { resolveUpstreamFailure } from '@/lib/api/upstreamError';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const GUIDE_FEEDBACK_ERROR_MESSAGE =
  'Viestin lähetys epäonnistui. Yritä hetken kuluttua uudelleen.';
const GUIDE_FEEDBACK_INVALID_BODY_MESSAGE = 'Viestin lukeminen epäonnistui.';

// Kentät, jotka GuideFeedbackBox lähettää, ja niiden enimmäispituudet. Tilausjärjestelmän
// palautereitti (public-guide-feedback.js) lukee samat kentät. Viesti tarkistetaan siellä
// tarkemmin (enintään 4000 merkkiä välilyöntien siistimisen jälkeen), joten tässä raja on väljempi.
// Sivun osoite ja viittaaja voivat olla pitkiä, joten ne lyhennetään eikä niitä hylätä.
const REJECTED_WHEN_TOO_LONG = Object.freeze({
  _gotcha: 500,
  feedbackType: 40,
  feedbackTypeLabel: 100,
  message: 8000,
  email: 254,
});
const TRUNCATED = Object.freeze({
  pageContext: 300,
  pageTitle: 300,
  pageUrl: 1000,
  referrer: 1000,
});

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

// Palauttaa vain tunnetut kentät merkkijonoina, tai null, jos runko ei kelpaa.
function pickGuideFeedbackFields(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null;
  }

  const fields = {};
  for (const [name, maxLength] of Object.entries({
    ...REJECTED_WHEN_TOO_LONG,
    ...TRUNCATED,
  })) {
    const value = payload[name];
    if (value === undefined || value === null) {
      continue;
    }
    if (typeof value !== 'string') {
      return null;
    }
    if (name in REJECTED_WHEN_TOO_LONG && value.length > maxLength) {
      return null;
    }
    fields[name] = value.slice(0, maxLength);
  }

  return fields;
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
        message: GUIDE_FEEDBACK_INVALID_BODY_MESSAGE,
      },
      { status: 400 }
    );
  }

  const feedback = pickGuideFeedbackFields(payload);
  if (!feedback) {
    return jsonResponse(
      {
        ok: false,
        message: GUIDE_FEEDBACK_INVALID_BODY_MESSAGE,
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
        ...feedback,
        requestContext,
      }),
      signal: AbortSignal.timeout(Number(process.env.ORDER_SERVICE_TIMEOUT_MS) || 10000),
    });

    const responseData = await upstreamResponse.json().catch(() => null);
    if (!upstreamResponse.ok || !responseData?.ok) {
      const failure = resolveUpstreamFailure(upstreamResponse, responseData, {
        label: 'Guide feedback submission',
      });
      return jsonResponse(
        {
          ok: false,
          message: failure.publicData?.message || GUIDE_FEEDBACK_ERROR_MESSAGE,
        },
        { status: failure.status }
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
