export const ANALYTICS_OPT_OUT_PATH = '/7b0d4de4-7896-4f1f-b8f4-c7d94d9bf7a8';
export const ANALYTICS_OPT_OUT_STORAGE_KEY = '__lrm_b71f4c2d8a9e';
export const ANALYTICS_OPT_OUT_STORAGE_VALUE = '9f74b6b1-8d62-498c-8ee1-1db93a5f6d28';
export const ANALYTICS_VISITOR_STORAGE_KEY = 'lieromaa.analytics.visitor';
export const ANALYTICS_SESSION_STORAGE_KEY = 'lieromaa.analytics.session';

export function clearStoredAnalyticsState() {
  try {
    globalThis.localStorage?.removeItem(ANALYTICS_VISITOR_STORAGE_KEY);
  } catch {}

  try {
    globalThis.sessionStorage?.removeItem(ANALYTICS_SESSION_STORAGE_KEY);
  } catch {}
}
