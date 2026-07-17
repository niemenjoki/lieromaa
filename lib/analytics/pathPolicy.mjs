export const ANALYTICS_EXCLUDED_PATHS = Object.freeze([
  '/tietopyynto/lataa',
  '/en/data-request/download',
]);

export function isAnalyticsExcludedPath(pathname) {
  return ANALYTICS_EXCLUDED_PATHS.includes(String(pathname || ''));
}
