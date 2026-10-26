'use client';

import { useEffect, useState } from 'react';

import SafeLink from '@/components/SafeLink/SafeLink';
import useHydrated from '@/hooks/useHydrated';

import classes from './FinnishContentLanguageNotice.module.css';

const STORAGE_KEY = 'lieromaa-finnish-content-notice';

export default function FinnishContentLanguageNotice({ copy }) {
  const isHydrated = useHydrated();
  const [isDismissed, setIsDismissed] = useState(false);
  const searchParams = new URLSearchParams(
    isHydrated ? (globalThis.location?.search ?? '') : ''
  );
  const isOpenedFromEnglish = searchParams.get('from') === 'en';
  const isVisible =
    isHydrated &&
    !isDismissed &&
    (isOpenedFromEnglish ||
      globalThis.sessionStorage?.getItem(STORAGE_KEY) === 'visible');

  useEffect(() => {
    if (isOpenedFromEnglish) {
      globalThis.sessionStorage?.setItem(STORAGE_KEY, 'visible');
    }
  }, [isOpenedFromEnglish]);

  const dismiss = () => {
    globalThis.sessionStorage?.removeItem(STORAGE_KEY);
    setIsDismissed(true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside className={classes.Notice} aria-live="polite">
      <p>{copy.message}</p>
      <div className={classes.Actions}>
        <SafeLink href="/en" lang="en">
          {copy.backLabel}
        </SafeLink>
        <button type="button" onClick={dismiss}>
          {copy.dismissLabel}
        </button>
      </div>
    </aside>
  );
}
