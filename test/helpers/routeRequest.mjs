function createHeaders(init = {}) {
  const headers = new Headers(init);

  return {
    get(name) {
      return headers.get(name);
    },
  };
}

export function createRouteRequest({
  method = 'GET',
  url = 'https://www.lieromaa.fi/api/test',
  origin = 'https://www.lieromaa.fi',
  host = 'www.lieromaa.fi',
  xForwardedHost = '',
  xForwardedProto = 'https',
  formData = null,
  json = null,
} = {}) {
  const nextUrl = new URL(url);
  const headers = createHeaders({
    host,
    origin,
    'x-forwarded-host': xForwardedHost || host,
    'x-forwarded-proto': xForwardedProto,
  });

  return {
    method,
    url,
    nextUrl,
    headers,
    async formData() {
      if (formData === null) {
        throw new Error('formData was not configured for this request');
      }

      return formData;
    },
    async json() {
      if (json instanceof Error) {
        throw json;
      }

      if (json === null) {
        throw new Error('json was not configured for this request');
      }

      return json;
    },
  };
}
