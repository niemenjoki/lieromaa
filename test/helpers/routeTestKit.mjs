// Shared helpers for the API route tests that check upstream calls. Every test
// sets its own environment and fetch mock, and both are restored afterwards, so
// no test can reach a real order service.

export const TEST_ORDER_SERVICE_URL = 'https://orders.example.test';
export const TEST_ORDER_SERVICE_TOKEN = 'test-order-token-5f1c';
export const ORDER_SERVICE_ENV = Object.freeze({
  ORDER_SERVICE_URL: TEST_ORDER_SERVICE_URL,
  ORDER_SERVICE_TOKEN: TEST_ORDER_SERVICE_TOKEN,
  ORDER_SERVICE_TIMEOUT_MS: '2000',
});

// Sets the given variables for the duration of fn. A value of undefined
// removes the variable.
export async function withTemporaryEnv(env, fn) {
  const previous = new Map();
  for (const [key, value] of Object.entries(env)) {
    previous.set(key, process.env[key]);
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    return await fn();
  } finally {
    for (const [key, value] of previous.entries()) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}

// Replaces fetch with handler and records every call as { url, init }.
export async function withMockFetch(handler, fn) {
  const calls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    calls.push({ url: String(url), init });
    return handler(String(url), init, calls.length);
  };

  try {
    return await fn(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

export function getHeader(init, name) {
  const headers = init?.headers;
  if (!headers) {
    return undefined;
  }
  if (typeof headers.get === 'function') {
    return headers.get(name) ?? undefined;
  }

  const match = Object.keys(headers).find(
    (key) => key.toLowerCase() === name.toLowerCase()
  );
  return match === undefined ? undefined : headers[match];
}

// A minimal request with full control over the headers, for checks that the
// shared createRouteRequest helper does not allow (no Origin, no forwarded
// headers and so on).
export function createBareRequest({
  method = 'GET',
  url = 'https://www.lieromaa.fi/api/test',
  headers = {},
  json,
} = {}) {
  const headerMap = new Headers(headers);

  return {
    method,
    url,
    nextUrl: new URL(url),
    headers: { get: (name) => headerMap.get(name) },
    async json() {
      if (json === undefined) {
        throw new SyntaxError('Unexpected end of JSON input');
      }
      return json;
    },
    async formData() {
      throw new TypeError('formData was not configured for this request');
    },
  };
}

export function timeoutError() {
  return new DOMException('The operation was aborted due to timeout', 'TimeoutError');
}

export function nonJsonResponse(status = 503) {
  return new Response('<html><body>upstream proxy error page</body></html>', {
    status,
    headers: { 'Content-Type': 'text/html' },
  });
}
