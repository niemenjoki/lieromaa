'use client';

import { useEffect } from 'react';

import {
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
  clearStoredAnalyticsState,
} from '@/lib/analytics/optOut';

export default function OptOutRedirect() {
  useEffect(() => {
    clearStoredAnalyticsState();

    try {
      globalThis.localStorage?.setItem(
        ANALYTICS_OPT_OUT_STORAGE_KEY,
        ANALYTICS_OPT_OUT_STORAGE_VALUE
      );
    } catch {}

    // The server counts page views, so the owner's opt-out must reach it too.
    document.cookie = `${ANALYTICS_OPT_OUT_STORAGE_KEY}=${ANALYTICS_OPT_OUT_STORAGE_VALUE}; Max-Age=63072000; Path=/; SameSite=Lax; Secure`;

    globalThis.location.replace('/');
  }, []);

  return null;
}
