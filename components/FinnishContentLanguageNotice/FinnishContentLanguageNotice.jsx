'use client';

import { useEffect, useState } from 'react';

import SafeLink from '@/components/SafeLink/SafeLink';
import useHydrated from '@/hooks/useHydrated';

import classes from './FinnishContentLanguageNotice.module.css';

const STORAGE_KEY = 'lieromaa-finnish-content-notice';

function getSessionStorage() {
  try {
    return globalThis.sessionStorage || null;
  } catch {
    return null;
  }
}

function isNoticeStored() {
  try {
    return getSessionStorage()?.getItem(STORAGE_KEY) === 'visible';
  } catch {
    return false;
  }
}

function storeNotice(isVisible) {
  try {
    if (isVisible) {
      getSessionStorage()?.setItem(STORAGE_KEY, 'visible');
    } else {
      getSessionStorage()?.removeItem(STORAGE_KEY);
    }
  } catch {
    // Without session storage the notice lasts only for this page.
  }
}

export default function FinnishContentLanguageNotice({ copy }) {
  const isHydrated = useHydrated();
  const [isDismissed, setIsDismissed] = useState(false);
  const searchParams = new URLSearchParams(
    isHydrated ? (globalThis.location?.search ?? '') : ''
  );
  const isOpenedFromEnglish = searchParams.get('from') === 'en';
  const isVisible =
    isHydrated && !isDismissed && (isOpenedFromEnglish || isNoticeStored());

  useEffect(() => {
    if (isOpenedFromEnglish) {
      storeNotice(true);
    }
  }, [isOpenedFromEnglish]);

  const dismiss = () => {
    storeNotice(false);
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
