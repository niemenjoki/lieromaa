'use client';

import { useEffect } from 'react';

import {
  ANALYTICS_OPT_OUT_STORAGE_KEY,
  ANALYTICS_OPT_OUT_STORAGE_VALUE,
} from '@/lib/analytics/optOut';

export default function Page() {
  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(
        ANALYTICS_OPT_OUT_STORAGE_KEY,
        ANALYTICS_OPT_OUT_STORAGE_VALUE
      );
    } catch {}

    globalThis.location.replace('/');
  }, []);

  return (
    <main style={{ padding: '24px', fontFamily: 'Georgia, serif' }}>
      <p>Hetki...</p>
    </main>
  );
}
