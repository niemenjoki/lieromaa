'use client';

import { useEffect, useState } from 'react';

import SafeLink from '@/components/SafeLink/SafeLink';

import classes from './FinnishContentLanguageNotice.module.css';

const STORAGE_KEY = 'lieromaa-finnish-content-notice';

export default function FinnishContentLanguageNotice({ copy }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(globalThis.location?.search ?? '');
    if (searchParams.get('from') === 'en') {
      globalThis.sessionStorage?.setItem(STORAGE_KEY, 'visible');
    }

    setIsVisible(globalThis.sessionStorage?.getItem(STORAGE_KEY) === 'visible');
  }, []);

  const dismiss = () => {
    globalThis.sessionStorage?.removeItem(STORAGE_KEY);
    setIsVisible(false);
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
