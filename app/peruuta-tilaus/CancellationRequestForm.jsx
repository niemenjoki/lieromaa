'use client';

import { useId, useState } from 'react';

import classes from './CancellationRequestPage.module.css';

const CANCELLATION_ENDPOINT = '/api/orders/cancel';

export default function CancellationRequestForm() {
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
      setSubmitError('Täytä nimi ja sähköposti.');
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
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        throw new Error(data?.message || 'Peruuttamisilmoituksen lähetys epäonnistui.');
      }

      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Peruuttamisilmoituksen lähetys epäonnistui. Yritä hetken kuluttua uudelleen.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={classes.Success} aria-live="polite">
        <h2>Peruuttamisilmoitus vastaanotettu</h2>
        <p>
          Saat automaattisen vahvistuksen sähköpostiisi. Olen erikseen yhteydessä
          palautus- ja maksujärjestelyistä tilauksen tilanteen ja sisällön mukaan.
        </p>
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
          <span>Nimi</span>
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
          <span>Sähköposti</span>
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
          <span>Puhelinnumero (valinnainen)</span>
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
          <span>Tilausnumero (jos tiedossa)</span>
          <input
            id={orderReferenceId}
            type="text"
            name="tilauksen_tunniste"
            value={orderReference}
            onChange={(event) => setOrderReference(event.target.value)}
            placeholder="Esimerkiksi LRM-..."
          />
        </label>
      </div>

      <fieldset className={classes.Fieldset}>
        <legend>Toivottu yhteydenottotapa</legend>
        <label>
          <input
            type="radio"
            name="toivottu_yhteydenottotapa"
            value="email"
            checked={preferredContactMethod === 'email'}
            onChange={() => setPreferredContactMethod('email')}
          />
          <span>Sähköposti</span>
        </label>
        <label>
          <input
            type="radio"
            name="toivottu_yhteydenottotapa"
            value="phone_call"
            checked={preferredContactMethod === 'phone_call'}
            onChange={() => setPreferredContactMethod('phone_call')}
          />
          <span>Puhelu</span>
        </label>
        <label>
          <input
            type="radio"
            name="toivottu_yhteydenottotapa"
            value="text_message"
            checked={preferredContactMethod === 'text_message'}
            onChange={() => setPreferredContactMethod('text_message')}
          />
          <span>Tekstiviesti</span>
        </label>
        <label>
          <input
            type="radio"
            name="toivottu_yhteydenottotapa"
            value="whatsapp_message"
            checked={preferredContactMethod === 'whatsapp_message'}
            onChange={() => setPreferredContactMethod('whatsapp_message')}
          />
          <span>WhatsApp-viesti</span>
        </label>
      </fieldset>

      <fieldset className={classes.Fieldset}>
        <legend>Ilmoitus koskee</legend>
        <label>
          <input
            type="radio"
            name="peruuttamisen_laajuus"
            value="full"
            checked={cancellationScope === 'full'}
            onChange={() => setCancellationScope('full')}
          />
          <span>Koko tilausta</span>
        </label>
        <label>
          <input
            type="radio"
            name="peruuttamisen_laajuus"
            value="partial"
            checked={cancellationScope === 'partial'}
            onChange={() => setCancellationScope('partial')}
          />
          <span>Osaa tilauksesta</span>
        </label>
      </fieldset>

      <label className={classes.Field} htmlFor={orderDetailsId}>
        <span>Tilauksen tiedot</span>
        <small className={classes.FieldHint}>
          Kerro omin sanoin tilauksestasi, jotta peruutusilmoitus saadaan kohdennettua
          oikealle tilaukselle. Jos syötit ylempänä tarkan tilausnumeron, tilauksen muita
          tietoja ei tarvita.
        </small>
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
          {isSubmitting ? 'Lähetetään...' : 'Vahvista peruuttamisilmoituksen lähetys'}
        </button>
      </div>
    </form>
  );
}
