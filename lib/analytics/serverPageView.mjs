import {
  ANALYTICS_OPT_OUT_PATH,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
} from './optOut.js';
import { isAnalyticsExcludedPath } from './pathPolicy.mjs';

const BOT_USER_AGENT_PATTERN =
  /bot|crawl|spider|slurp|preview|monitor|headless|lighthouse|pagespeed|facebookexternalhit|embedly|curl|wget|python|httpclient|okhttp|axios|node-fetch|go-http|java\//i;
const UTM_QUERY_KEYS = {
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
  utmContent: 'utm_content',
  utmTerm: 'utm_term',
};

function normalizeHost(value) {
  try {
    return new URL(value).host.toLowerCase().replace(/^www\./, '');
  } catch {
    return '';
  }
}

function getClientIp(headers) {
  const forwardedFor = String(headers.get('x-forwarded-for') || '')
    .split(',')[0]
    .trim();

  return forwardedFor || String(headers.get('x-real-ip') || '').trim();
}

// Page views are recorded on the server without storing anything in the
// browser. Prefetches are excluded by the proxy matcher.
export function buildServerPageView({ method, url, headers, cookies, env }) {
  if (env.VERCEL_ENV !== 'production' || method !== 'GET') {
    return null;
  }

  const requestUrl = new URL(url);
  const path = requestUrl.pathname;
  const userAgent = String(headers.get('user-agent') || '').trim();
  const ip = getClientIp(headers);

  if (
    path === ANALYTICS_OPT_OUT_PATH ||
    isAnalyticsExcludedPath(path) ||
    !ip ||
    !userAgent ||
    BOT_USER_AGENT_PATTERN.test(userAgent) ||
    !headers.get('accept-language') ||
    headers.get('sec-gpc') === '1' ||
    headers.get('dnt') === '1' ||
    cookies.get(ANALYTICS_OPT_OUT_STORAGE_KEY) === ANALYTICS_OPT_OUT_STORAGE_VALUE
  ) {
    return null;
  }

  const referrerHost = normalizeHost(headers.get('referer') || '');
  const campaign = Object.fromEntries(
    Object.entries(UTM_QUERY_KEYS).map(([field, key]) => [
      field,
      String(requestUrl.searchParams.get(key) || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 120),
    ])
  );

  return {
    payload: {
      path,
      startedAt: new Date().toISOString(),
      referrerHost:
        referrerHost && referrerHost !== normalizeHost(requestUrl.href)
          ? referrerHost
          : '',
      ...campaign,
    },
    client: { ip, userAgent },
  };
}

export async function sendServerPageView(
  { payload, client },
  { env, fetchImpl = fetch }
) {
  if (!env.ORDER_SERVICE_URL || !env.ORDER_SERVICE_TOKEN) {
    return;
  }

  try {
    await fetchImpl(
      `${env.ORDER_SERVICE_URL.replace(/\/+$/, '')}/api/public/analytics/pageview`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Order-Token': env.ORDER_SERVICE_TOKEN,
          'X-Analytics-Client-Ip': client.ip,
          'X-Analytics-User-Agent': client.userAgent,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(Number(env.ORDER_SERVICE_TIMEOUT_MS) || 5000),
        cache: 'no-store',
      }
    );
  } catch {
    // Analytics must never affect the page; the error is not logged because the
    // request carries the visitor's IP address.
  }
}
