import { NextResponse } from 'next/server';

import {
  ANALYTICS_OPT_OUT_PATH,
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
} from '@/lib/analytics/optOut.js';
import { ANALYTICS_EXCLUDED_PATHS } from '@/lib/analytics/pathPolicy.mjs';
import { trackPageview } from '@/lib/looku/next.js';

// Page views are recorded on the server with Looku, and nothing is stored in the
// browser. The receiver address and keys come from the environment variables
// LOOKU_ENDPOINT, LOOKU_SITE_ID and LOOKU_SIGNING_KEY. Only production sends data.
const LOOKU_OPTIONS = {
  excludePaths: [ANALYTICS_OPT_OUT_PATH, ...ANALYTICS_EXCLUDED_PATHS],
  optOutCookie: {
    name: ANALYTICS_OPT_OUT_STORAGE_KEY,
    value: ANALYTICS_OPT_OUT_STORAGE_VALUE,
  },
};

export function proxy(request, event) {
  trackPageview(request, event, LOOKU_OPTIONS);
  return NextResponse.next();
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
