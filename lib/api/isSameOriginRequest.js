function normalizeProtocol(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/:$/, '');
}

function getRequestHost(request) {
  return String(
    request.headers.get('x-forwarded-host') || request.headers.get('host') || ''
  )
    .trim()
    .toLowerCase();
}

function getRequestProtocol(request) {
  const forwardedProtocol = String(request.headers.get('x-forwarded-proto') || '')
    .split(',')[0]
    .trim();

  return normalizeProtocol(
    forwardedProtocol || request.nextUrl.protocol || request.url || ''
  );
}

export function isSameOriginRequest(request) {
  const origin = request.headers.get('origin');
  if (!origin) {
    return true;
  }

  let parsedOrigin;
  try {
    parsedOrigin = new URL(origin);
  } catch {
    return false;
  }

  const requestHost = getRequestHost(request);
  if (!requestHost || parsedOrigin.host.toLowerCase() !== requestHost) {
    return false;
  }

  const requestProtocol = getRequestProtocol(request);
  return (
    !requestProtocol ||
    normalizeProtocol(parsedOrigin.protocol) === normalizeProtocol(requestProtocol)
  );
}
