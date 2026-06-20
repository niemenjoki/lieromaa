'use client';

import { useId, useState } from 'react';

import classes from './DataRequestPage.module.css';

const GENERIC_SUCCESS_MESSAGE =
  'Jos antamasi tiedot vastaavat tilausta, saat sähköpostiisi pian linkin tietojen lataamiseen. Tarkista myös roskapostikansio.';

export default function DataRequestForm() {
  const orderId = useId();
  const emailId = useId();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    if (isSubmitting) return;

    const formData = new FormData(event.currentTarget);
    const normalizedOrderNumber = orderNumber.trim();
    const normalizedEmail = email.trim();
    if (!normalizedOrderNumber || !normalizedEmail) {
      setError('Täytä tilausnumero ja sähköpostiosoite.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/data-exports/request', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: normalizedOrderNumber,
          email: normalizedEmail,
          _gotcha: String(formData.get('_gotcha') || ''),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        throw new Error('Pyyntöä ei voitu lähettää. Yritä hetken kuluttua uudelleen.');
      }

      setIsSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Pyyntöä ei voitu lähettää. Yritä hetken kuluttua uudelleen.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div aria-live="polite">
        <h2>Pyyntö vastaanotettu</h2>
        <p>{GENERIC_SUCCESS_MESSAGE}</p>
      </div>
    );
  }

  return (
    <form className={classes.Form} onSubmit={handleSubmit}>
      <input
        className={classes.Gotcha}
        type="text"
        name="_gotcha"
        tabIndex="-1"
        autoComplete="off"
      />

      <label className={classes.Field} htmlFor={orderId}>
        <span>Tilausnumero</span>
        <input
          id={orderId}
          name="orderId"
          type="text"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          placeholder="Esim. LRM-260410120000AB"
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck="false"
          required
        />
      </label>

      <label className={classes.Field} htmlFor={emailId}>
        <span>Tilaukseen liitetty sähköpostiosoite</span>
        <input
          id={emailId}
          name="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </label>

      {error ? (
        <p className={classes.Error} role="alert">
          {error}
        </p>
      ) : null}

      <button className={classes.Button} type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Lähetetään...' : 'Lähetä latauslinkki'}
      </button>
    </form>
  );
}
