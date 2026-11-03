// Private pages: data downloads and invoice payment pages, whose address contains the invoice payment code.
// A path is excluded together with its subpaths, as in the Looku connector.
export const ANALYTICS_EXCLUDED_PATHS = Object.freeze([
  '/tietopyynto/lataa',
  '/en/data-request/download',
  '/maksa',
  '/en/pay',
]);

export function isAnalyticsExcludedPath(pathname) {
  const path = String(pathname || '');
  return ANALYTICS_EXCLUDED_PATHS.some(
    (excluded) => path === excluded || path.startsWith(`${excluded}/`)
  );
}
