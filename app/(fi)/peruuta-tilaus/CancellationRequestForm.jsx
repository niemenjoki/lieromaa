'use client';

import { useId, useState } from 'react';

import { getTransactionMessages } from '@/lib/i18n/messages.mjs';

import classes from './CancellationRequestPage.module.css';

const CANCELLATION_ENDPOINT = '/api/orders/cancel';

export default function CancellationRequestForm({ language = 'fi' }) {
  const copy = getTransactionMessages(language).cancellation;
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('email');
  const [orderReference, setOrderReference] = useState('');
  const [cancellationScope, setCancellationScope] = useState('full');
  const [orderDetails, setOrderDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const customerNameId = useId();
  const customerEmailId = useId();
  const customerPhoneId = useId();
  const orderReferenceId = useId();
  const orderDetailsId = useId();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const trimmedName = customerName.trim();
    const trimmedEmail = customerEmail.trim();
    const trimmedOrderDetails = orderDetails.trim();

    if (!trimmedName || !trimmedEmail) {
      setSubmitError(copy.requiredError);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch(CANCELLATION_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-Lieromaa-Language': language,
        },
        body: JSON.stringify({
          _gotcha: String(formData.get('_gotcha') || ''),
          customerName: trimmedName,
          customerEmail: trimmedEmail,
          customerPhone: customerPhone.trim(),
          preferredContactMethod,
          orderReference: orderReference.trim(),
          cancellationScope,
          orderDetails: trimmedOrderDetails,
          language,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || copy.submitFailed);
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : copy.submitFailedRetry);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={classes.Success} aria-live="polite">
        <h2>{copy.successHeading}</h2>
        <p>{copy.successBody}</p>
      </div>
    );
  }

  return (
    <form
      action={CANCELLATION_ENDPOINT}
      method="POST"
      className={classes.Form}
      onSubmit={handleSubmit}
      data-analytics-form="cancellation-request"
    >
      <input
        type="text"
        name="_gotcha"
        className={classes.Gotcha}
        tabIndex="-1"
        autoComplete="off"
      />

      <div className={classes.FieldGrid}>
        <label className={classes.Field} htmlFor={customerNameId}>
          <span>{copy.fields.name}</span>
          <input
            id={customerNameId}
            type="text"
            name="nimi"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
            autoComplete="name"
            required
          />
        </label>

        <label className={classes.Field} htmlFor={customerEmailId}>
          <span>{copy.fields.email}</span>
          <input
            id={customerEmailId}
            type="email"
            name="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </label>

        <label className={classes.Field} htmlFor={customerPhoneId}>
          <span>{copy.fields.phone}</span>
          <input
            id={customerPhoneId}
            type="tel"
            name="phone"
            value={customerPhone}
            onChange={(event) => setCustomerPhone(event.target.value)}
            autoComplete="tel"
          />
        </label>

        <label className={classes.Field} htmlFor={orderReferenceId}>
          <span>{copy.fields.orderReference}</span>
          <input
            id={orderReferenceId}
            type="text"
            name="tilauksen_tunniste"
            value={orderReference}
            onChange={(event) => setOrderReference(event.target.value)}
            placeholder={copy.fields.orderReferencePlaceholder}
          />
        </label>
      </div>

      <fieldset className={classes.Fieldset}>
        <legend>{copy.fields.contactMethod}</legend>
        <label>
          <input
            type="radio"
            name="toivottu_yhteydenottotapa"
            value="email"
            checked={preferredContactMethod === 'email'}
            onChange={() => setPreferredContactMethod('email')}
          />
          <span>{copy.fields.contactEmail}</span>
        </label>
        <label>
          <input
            type="radio"
            name="toivottu_yhteydenottotapa"
            value="phone_call"
            checked={preferredContactMethod === 'phone_call'}
            onChange={() => setPreferredContactMethod('phone_call')}
          />
          <span>{copy.fields.phoneCall}</span>
        </label>
        <label>
          <input
            type="radio"
            name="toivottu_yhteydenottotapa"
            value="text_message"
            checked={preferredContactMethod === 'text_message'}
            onChange={() => setPreferredContactMethod('text_message')}
          />
          <span>{copy.fields.textMessage}</span>
        </label>
        <label>
          <input
            type="radio"
            name="toivottu_yhteydenottotapa"
            value="whatsapp_message"
            checked={preferredContactMethod === 'whatsapp_message'}
            onChange={() => setPreferredContactMethod('whatsapp_message')}
          />
          <span>{copy.fields.whatsapp}</span>
        </label>
      </fieldset>

      <fieldset className={classes.Fieldset}>
        <legend>{copy.fields.scope}</legend>
        <label>
          <input
            type="radio"
            name="peruuttamisen_laajuus"
            value="full"
            checked={cancellationScope === 'full'}
            onChange={() => setCancellationScope('full')}
          />
          <span>{copy.fields.fullScope}</span>
        </label>
        <label>
          <input
            type="radio"
            name="peruuttamisen_laajuus"
            value="partial"
            checked={cancellationScope === 'partial'}
            onChange={() => setCancellationScope('partial')}
          />
          <span>{copy.fields.partialScope}</span>
        </label>
      </fieldset>

      <label className={classes.Field} htmlFor={orderDetailsId}>
        <span>{copy.fields.orderDetails}</span>
        <small className={classes.FieldHint}>{copy.fields.orderDetailsHint}</small>
        <textarea
          id={orderDetailsId}
          name="tilauksen_tiedot"
          rows="5"
          value={orderDetails}
          onChange={(event) => setOrderDetails(event.target.value)}
          placeholder=""
        />
      </label>

      {submitError ? (
        <p className={classes.Error} role="alert">
          {submitError}
        </p>
      ) : null}

      <div className={classes.Actions}>
        <button type="submit" className={classes.SubmitButton} disabled={isSubmitting}>
          {isSubmitting ? copy.submitting : copy.submit}
        </button>
      </div>
    </form>
  );
}
