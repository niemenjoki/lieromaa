import { NextResponse } from 'next/server';

import {
  buildServerPageView,
  sendServerPageView,
} from '@/lib/analytics/serverPageView.mjs';

export function proxy(request, event) {
  const pageView = buildServerPageView({
    method: request.method,
    url: request.url,
    headers: request.headers,
    cookies: { get: (name) => request.cookies.get(name)?.value },
    env: process.env,
  });

  if (pageView) {
    event.waitUntil(sendServerPageView(pageView, { env: process.env }));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      // Pages only: no API routes, build assets or files with an extension.
      source: '/((?!api|_next/static|_next/image|.*\\..*).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
        { type: 'header', key: 'sec-purpose', value: '(.*)prefetch(.*)' },
      ],
    },
  ],
};
