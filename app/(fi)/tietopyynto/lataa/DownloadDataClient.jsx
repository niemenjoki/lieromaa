'use client';

import { useState } from 'react';

import useHydrated from '@/hooks/useHydrated';
import { getTransactionMessages } from '@/lib/i18n/messages.mjs';

import classes from '../DataRequestPage.module.css';

function getFilename(response, fallbackFilename) {
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="([^"]+)"/);
  return match?.[1] || fallbackFilename;
}

export default function DownloadDataClient({ language = 'fi' }) {
  const copy = getTransactionMessages(language).download;
  const isReady = useHydrated();
  const [isTokenUsed, setIsTokenUsed] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const token =
    isReady && !isTokenUsed
      ? new URLSearchParams(globalThis.location.hash.slice(1)).get('token') || ''
      : '';

  async function download() {
    if (!token || isDownloading) return;

    setIsDownloading(true);
    setError('');
    try {
      const response = await fetch('/api/data-exports/download', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Lieromaa-Language': language,
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || copy.invalidLink);
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = getFilename(response, copy.defaultFilename);
      link.click();
      URL.revokeObjectURL(objectUrl);
      setIsTokenUsed(true);
      globalThis.history.replaceState(null, '', globalThis.location.pathname);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error ? downloadError.message : copy.downloadFailed
      );
    } finally {
      setIsDownloading(false);
    }
  }

  if (!isReady) {
    return <p>{copy.checking}</p>;
  }

  return (
    <>
      {!token ? (
        <p className={classes.Error} role="alert">
          {copy.missingLink}
        </p>
      ) : (
        <button
          className={classes.Button}
          type="button"
          onClick={download}
          disabled={isDownloading}
        >
          {isDownloading ? copy.downloading : copy.download}
        </button>
      )}
      {error ? (
        <p className={classes.Error} role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
