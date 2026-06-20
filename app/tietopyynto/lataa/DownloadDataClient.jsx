'use client';

import { useEffect, useState } from 'react';

import classes from '../DataRequestPage.module.css';

function getFilename(response) {
  const disposition = response.headers.get('content-disposition') || '';
  const match = disposition.match(/filename="([^"]+)"/);
  return match?.[1] || 'lieromaa-tilaustiedot.json';
}

export default function DownloadDataClient() {
  const [token, setToken] = useState('');
  const [isReady, setIsReady] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fragment = new URLSearchParams(globalThis.location.hash.slice(1));
    setToken(fragment.get('token') || '');
    globalThis.history.replaceState(null, '', globalThis.location.pathname);
    setIsReady(true);
  }, []);

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
        },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.message || 'Latauslinkki on virheellinen, käytetty tai vanhentunut.'
        );
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = getFilename(response);
      link.click();
      URL.revokeObjectURL(objectUrl);
      setToken('');
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : 'Tietojen lataaminen epäonnistui.'
      );
    } finally {
      setIsDownloading(false);
    }
  }

  if (!isReady) {
    return <p>Tarkistetaan latauslinkkiä...</p>;
  }

  return (
    <>
      {!token ? (
        <p className={classes.Error} role="alert">
          Latauslinkki puuttuu tai se on jo käytetty.
        </p>
      ) : (
        <button
          className={classes.Button}
          type="button"
          onClick={download}
          disabled={isDownloading}
        >
          {isDownloading ? 'Ladataan...' : 'Lataa tiedot JSON-tiedostona'}
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
