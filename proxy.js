import { NextResponse } from 'next/server';

import { lookuRequestHeaders, trackPageview } from '@/lib/looku/next.js';
import { LOOKU_OPTIONS } from '@/lib/looku/options.js';

// Page views are recorded on the server with Looku, and nothing is stored in the
// browser. The address goes on to the not-found pages in a signed request header,
// so they can tell Looku that the page does not exist (lib/looku/options.js).
export async function proxy(request, event) {
  trackPageview(request, event, LOOKU_OPTIONS);
  return NextResponse.next({
    request: { headers: await lookuRequestHeaders(request, LOOKU_OPTIONS) },
  });
}

export const config = {
  matcher: [
    {
      // Pages only: no API routes, build assets or files with an extension. A
      // character class matches the dot without escaping.
      source: '/((?!api|_next/static|_next/image|.*[.]).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
        { type: 'header', key: 'sec-purpose', value: '(.*)prefetch(.*)' },
      ],
    },
  ],
};
