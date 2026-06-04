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

    globalThis.location.replace('/');
  }, []);

  return null;
}
