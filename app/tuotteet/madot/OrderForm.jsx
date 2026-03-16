'use client';

import { useEffect, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import { ORDER_SUBMIT_ENDPOINT, ORDER_SUCCESS_MESSAGE } from '@/data/orderConfig';
import { findDiscountForSku } from '@/lib/discounts/findDiscountForSku';
import { submitOrderForm } from '@/lib/orders/submitOrderForm';
import {
  formatPrice,
  getProductPricing,
  getProductShippingOptions,
  getProductVariant,
  getProductVariants,
} from '@/lib/pricing/catalog';

import classes from '../ProductPage.module.css';
import WormAmountFinePrint from '../WormAmountFinePrint';

const wormProduct = getProductPricing('worms');
const wormVariants = getProductVariants('worms');
const wormShippingOptions = getProductShippingOptions('worms');
const defaultWormVariant = getProductVariant('worms', 100) ?? wormVariants[0] ?? null;
const defaultDelivery = wormShippingOptions[0]?.id ?? 'postitus';
const frostProtectionFee = {
  label: 'Pakkastoimituslisä',
  price: 3,
};
const frostProtectionLabel = `Maksan ${frostProtectionFee.label.toLowerCase()}n`;

export default function OrderForm() {
  const pathname = usePathname();
  const [delivery, setDelivery] = useState(defaultDelivery);
  const [amount, setAmount] = useState(
    defaultWormVariant ? String(defaultWormVariant.amount) : ''
  );
  const [frostFee, setFrostFee] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountFeedback, setDiscountFeedback] = useState('');
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formStartedAt, setFormStartedAt] = useState('');
  const [submissionId, setSubmissionId] = useState('');

  const showFrostCharge = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth >= 9 || currentMonth <= 5;
  }, []);

  const currentVariant =
    wormVariants.find((variant) => String(variant.amount) === amount) ??
    defaultWormVariant;
  const wormPrice = currentVariant?.price ?? 0;
  const currentSku = currentVariant?.sku ?? '';
  const currentShippingOption =
    wormShippingOptions.find((option) => option.id === delivery) ??
    wormShippingOptions[0];
  const postage = currentShippingOption?.price ?? 0;
  const frost = showFrostCharge && frostFee ? Number(frostProtectionFee.price) || 0 : 0;

  useEffect(() => {
    if (!appliedDiscount) {
      return;
    }

    if (appliedDiscount.appliesToSku !== currentSku) {
      setAppliedDiscount(null);
      setDiscountFeedback('Alennus poistettiin, koska valittu tuote muuttui.');
    }
  }, [appliedDiscount, currentSku]);

  useEffect(() => {
    setFormStartedAt(String(Date.now()));
    setSubmissionId(globalThis.crypto?.randomUUID?.() || `worms-${Date.now()}`);
  }, []);

  const discountFromProductPrice =
    appliedDiscount?.type === 'percentage'
      ? Number(((wormPrice * appliedDiscount.value) / 100).toFixed(2))
      : appliedDiscount?.type === 'fixed'
        ? Math.min(wormPrice, appliedDiscount.value)
        : 0;

  const shippingDiscount = appliedDiscount?.type === 'free_shipping' ? postage : 0;
  const total = wormPrice - discountFromProductPrice + postage - shippingDiscount + frost;

  const handleDiscountChange = (event) => {
    setDiscountCode(event.target.value);
    setAppliedDiscount(null);
    setDiscountFeedback('');
  };

  const applyDiscount = async () => {
    const plainCode = discountCode.trim();
    if (!plainCode) {
      setAppliedDiscount(null);
      setDiscountFeedback('Syötä alennuskoodi.');
      return;
    }

    setIsCheckingDiscount(true);
    try {
      const match = await findDiscountForSku({ code: plainCode, sku: currentSku });
      if (!match) {
        setAppliedDiscount(null);
        setDiscountFeedback('Alennuskoodia ei tunnistettu.');
        return;
      }

      setAppliedDiscount({
        ...match,
        appliesToSku: currentSku,
      });
      setDiscountFeedback('Alennuskoodi hyväksytty.');
    } catch {
      setAppliedDiscount(null);
      setDiscountFeedback('Alennuskoodin tarkistus epäonnistui.');
    } finally {
      setIsCheckingDiscount(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting || isSubmitted) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitOrderForm(event.currentTarget);
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Tilauksen lähetys epäonnistui.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className={classes.CalculatorForm}
      action={ORDER_SUBMIT_ENDPOINT}
      method="POST"
      onSubmit={handleSubmit}
    >
      <input type="text" name="_gotcha" style={{ display: 'none' }} />
      <input type="hidden" name="tuote" value={wormProduct.name} />
      <input type="hidden" name="tuote_avain" value="worms" />
      <input type="hidden" name="sku" value={currentSku} />
      <input type="hidden" name="lomake_aloitettu_ms" value={formStartedAt} />
      <input type="hidden" name="submission_id" value={submissionId} />
      <input type="hidden" name="sivu_polku" value={pathname ?? ''} />
      <input
        type="hidden"
        name="alennus_obfuscated_code"
        value={appliedDiscount?.obfuscatedCode ?? ''}
      />
      <input type="hidden" name="alennus_tyyppi" value={appliedDiscount?.type ?? ''} />
      <input type="hidden" name="alennus_arvo" value={appliedDiscount?.value ?? ''} />
      <input type="hidden" name="alennus_paattyy" value={appliedDiscount?.endsOn ?? ''} />

      <label>
        Nimi
        <input type="text" name="nimi" required />
      </label>

      <label>
        Sähköposti
        <input type="email" name="email" required />
      </label>

      <label>
        Puhelinnumero
        <input type="tel" name="phone" />
      </label>

      <fieldset>
        <legend>Toimitustapa</legend>
        {wormShippingOptions.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="toimitus"
              value={option.id}
              checked={delivery === option.id}
              onChange={() => setDelivery(option.id)}
            />{' '}
            {option.label}
            {option.price > 0 ? ` (${formatPrice(option.price)} €)` : ''}
          </label>
        ))}
      </fieldset>

      {showFrostCharge ? (
        <fieldset className={classes.FrostCharge}>
          <legend>Pakkastoimituslisä</legend>
          <p className={classes.HelperText}>
            Kun ulkolämpötila on alle -5 °C, matojen toimittaminen vaatii ylimääräistä
            pakkausmateriaalia matojen pitämiseksi elossa. Pakkastilanne määritetään
            alimmasta lämpötilaennusteesta matojen lähtöpaikan (Järvenpää) ja
            toimitusosoitteen perusteella.
          </p>
          <label>
            <input
              type="checkbox"
              name="pakkastoimituslisa"
              value="maksan"
              checked={frostFee}
              onChange={(event) => setFrostFee(event.target.checked)}
            />{' '}
            {frostProtectionLabel} ({formatPrice(frostProtectionFee.price)} €)
          </label>
          <p className={classes.HelperText}>
            Voit tehdä tilauksen myös ilman pakkaslisää, vaikka ulkona olisi pakkasta,
            jolloin paketti toimitetaan pikimmiten sään lämmettyä.
          </p>
        </fieldset>
      ) : null}

      {delivery === 'postitus' ? (
        <div className={classes.AddressGroup}>
          <label>
            Postiosoite
            <input
              className="address-field"
              type="text"
              name="osoite"
              required={delivery === 'postitus'}
            />
          </label>
          <label>
            Postinumero
            <input
              className="address-field"
              type="text"
              name="postinumero"
              required={delivery === 'postitus'}
            />
          </label>
          <label>
            Postitoimipaikka
            <input
              className="address-field"
              type="text"
              name="toimipaikka"
              required={delivery === 'postitus'}
            />
          </label>
        </div>
      ) : null}

      <fieldset>
        <legend>Valitse määrä</legend>
        {wormVariants.map((variant) => (
          <label key={variant.sku}>
            <input
              type="radio"
              name="maara"
              value={variant.amount}
              checked={amount === String(variant.amount)}
              onChange={() => setAmount(String(variant.amount))}
            />{' '}
            {variant.amount} matoa – {formatPrice(variant.price)} €
          </label>
        ))}
      </fieldset>
      <WormAmountFinePrint />

      <label>
        Alennuskoodi (valinnainen)
        <input
          type="text"
          name="alennuskoodi"
          value={discountCode}
          onChange={handleDiscountChange}
          autoComplete="off"
        />
      </label>
      <button
        type="button"
        className={classes.SecondaryButton}
        onClick={applyDiscount}
        disabled={isCheckingDiscount}
      >
        {isCheckingDiscount ? 'Tarkistetaan alennuskoodi...' : 'Käytä alennuskoodi'}
      </button>

      {discountFeedback ? <p className={classes.HelperText}>{discountFeedback}</p> : null}
      {appliedDiscount ? (
        <p className={classes.HelperText}>
          {appliedDiscount.type === 'percentage'
            ? `Alennus tuotteesta ${appliedDiscount.value} % (-${formatPrice(discountFromProductPrice)} €)`
            : appliedDiscount.type === 'fixed'
              ? `Alennus tuotteesta -${formatPrice(discountFromProductPrice)} €`
              : `Toimitus alennuksella: -${formatPrice(shippingDiscount)} €`}
        </p>
      ) : null}

      <label>
        Viesti (valinnainen)
        <textarea name="lisatiedot" rows="3" />
      </label>
      <p className={classes.HelperText}>
        Voit toivoa tiettyä Postin noutopaikkaa (pakettiautomaatti tai postitoimipaikka).
        Toiveen tulee löytyä Postin{' '}
        <a
          href="https://www.posti.fi/palvelupisteet-kartalla"
          target="_blank"
          rel="noopener noreferrer"
        >
          palvelupistekartalta
        </a>
        . Jos et toivo noutopaikkaa, lähetys toimitetaan ilmoittamasi postinumeron mukaan
        ensimmäiseen Postin tarjoamaan noutopisteeseen.
      </p>
      <p className={classes.HelperText}>
        Huomioithan, että Posti saattaa toiveesta huolimatta toimittaa paketin eri
        toimipisteeseen, jos esimerkiksi noutopiste on täynnä.
      </p>

      <p className={classes.OrderTotal}>
        Yhteensä: <strong>{formatPrice(total)} €</strong>
      </p>

      {submitError ? (
        <p className={classes.HelperText} role="alert">
          {submitError}
        </p>
      ) : null}

      {isSubmitted ? (
        <p className={classes.Note} role="status">
          {ORDER_SUCCESS_MESSAGE}
        </p>
      ) : null}

      <button type="submit" disabled={isSubmitting || isSubmitted}>
        {isSubmitting
          ? 'Lähetetään tilausta...'
          : isSubmitted
            ? 'Tilaus vastaanotettu'
            : 'Lähetä tilaus'}
      </button>
      <p className={classes.Note}>
        Saat manuaalisen vahvistuksen ja laskun sähköpostiisi 1–2 arkipäivän sisällä.
      </p>
    </form>
  );
}
