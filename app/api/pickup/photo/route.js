import { isSameOriginRequest } from '@/lib/api/isSameOriginRequest';
import { getPublicRequestLanguage } from '@/lib/api/publicLanguage';
import {
  buildPickupServiceEndpoint,
  getPickupServiceHeaders,
  getPickupServiceTimeout,
} from '@/lib/pickup/orderServiceProxy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

// Kuistin kuva näytetään vain voimassa olevan varauksen tehneelle (tilausjärjestelmä tarkistaa tokenin).
export async function GET(request) {
  const language = getPublicRequestLanguage(request);
  if (!isSameOriginRequest(request)) {
    return new Response(null, { status: 403 });
  }

  const token = request.nextUrl.searchParams.get('token')?.trim() || '';
  if (!token) {
    return new Response(null, { status: 400 });
  }

  try {
    const upstreamResponse = await fetch(
      buildPickupServiceEndpoint('/api/public/pickup/photo', { token }),
      {
        method: 'GET',
        headers: getPickupServiceHeaders(language),
        signal: getPickupServiceTimeout(),
        cache: 'no-store',
      }
    );
    const contentType = String(upstreamResponse.headers.get('content-type') || '')
      .split(';')[0]
      .trim()
      .toLowerCase();
    if (!upstreamResponse.ok || !ALLOWED_TYPES.has(contentType)) {
      return new Response(null, {
        status: upstreamResponse.ok ? 502 : upstreamResponse.status,
      });
    }

    return new Response(await upstreamResponse.arrayBuffer(), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'private, no-store',
        'X-Robots-Tag': 'noindex',
      },
    });
  } catch (error) {
    console.error('Pickup photo forwarding failed:', error);
    return new Response(null, { status: 502 });
  }
}
