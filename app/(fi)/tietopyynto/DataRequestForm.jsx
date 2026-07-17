'use client';

import { useId, useState } from 'react';

import { getTransactionMessages } from '@/lib/i18n/messages.mjs';

import classes from './DataRequestPage.module.css';

export default function DataRequestForm({ language = 'fi' }) {
  const copy = getTransactionMessages(language).dataRequest;
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
      setError(copy.requiredError);
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
          'X-Lieromaa-Language': language,
        },
        body: JSON.stringify({
          orderId: normalizedOrderNumber,
          email: normalizedEmail,
          _gotcha: String(formData.get('_gotcha') || ''),
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || copy.submitFailed);
      }

      setIsSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : copy.submitFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div aria-live="polite">
        <h2>{copy.successHeading}</h2>
        <p>{copy.genericSuccess}</p>
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
        <span>{copy.orderNumber}</span>
        <input
          id={orderId}
          name="orderId"
          type="text"
          value={orderNumber}
          onChange={(event) => setOrderNumber(event.target.value)}
          placeholder={copy.orderNumberPlaceholder}
          autoCapitalize="characters"
          autoCorrect="off"
          spellCheck="false"
          required
        />
      </label>

      <label className={classes.Field} htmlFor={emailId}>
        <span>{copy.email}</span>
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
        {isSubmitting ? copy.submitting : copy.submit}
      </button>
    </form>
  );
}
