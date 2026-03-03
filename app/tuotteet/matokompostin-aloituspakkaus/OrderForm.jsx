'use client';

import { useEffect, useState } from 'react';

import { findDiscountForSku } from '@/lib/discounts/findDiscountForSku';

import classes from '../ProductPage.module.css';

const PACKAGE_PRICES = { 50: 84, 100: 94, 200: 114 };
const SKU_BY_AMOUNT = {
  50: 'starterkit-50',
  100: 'starterkit-100',
  200: 'starterkit-200',
};
const POSTAGE_PRICE = 10.9;

const formatPrice = (value) =>
  value.toLocaleString('fi-FI', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });

export default function OrderForm() {
  const [delivery, setDelivery] = useState('postitus');
  const [amount, setAmount] = useState('100');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountFeedback, setDiscountFeedback] = useState('');
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);

  const packagePrice = PACKAGE_PRICES[amount] ?? 0;
  const currentSku = SKU_BY_AMOUNT[amount] ?? '';
  const postage = delivery === 'postitus' ? POSTAGE_PRICE : 0;

  useEffect(() => {
    if (!appliedDiscount) {
      return;
    }

    if (appliedDiscount.appliesToSku !== currentSku) {
      setAppliedDiscount(null);
      setDiscountFeedback('Alennus poistettiin, koska valittu tuote muuttui.');
    }
  }, [appliedDiscount, currentSku]);

  const discountFromProductPrice =
    appliedDiscount?.type === 'percentage'
      ? Number(((packagePrice * appliedDiscount.value) / 100).toFixed(2))
      : appliedDiscount?.type === 'fixed'
        ? Math.min(packagePrice, appliedDiscount.value)
        : 0;

  const shippingDiscount = appliedDiscount?.type === 'free_shipping' ? postage : 0;
  const total = packagePrice - discountFromProductPrice + postage - shippingDiscount;

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
        setDiscountFeedback('Alennuskoodia ei tunnistettu');
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

  return (
    <form
      className={classes.CalculatorForm}
      action="https://formspree.io/f/xkgpdwpa"
      method="POST"
    >
      <input type="text" name="_gotcha" style={{ display: 'none' }} />
      <input type="hidden" name="tuote" value="Matokompostorin aloituspakkaus" />
      <input type="hidden" name="sku" value={currentSku} />
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

      <fieldset>
        <legend>Valitse paketti</legend>
        {Object.entries(PACKAGE_PRICES).map(([qty, price]) => (
          <label key={qty}>
            <input
              type="radio"
              name="maara"
              value={qty}
              checked={amount === qty}
              onChange={() => setAmount(qty)}
            />
            Aloituspakkaus + {qty} matoa – {price} €
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Toimitustapa</legend>
        <label>
          <input
            type="radio"
            name="toimitus"
            value="postitus"
            checked={delivery === 'postitus'}
            onChange={() => setDelivery('postitus')}
          />
          Posti (10,90 €)
        </label>
        <label>
          <input
            type="radio"
            name="toimitus"
            value="nouto"
            checked={delivery === 'nouto'}
            onChange={() => setDelivery('nouto')}
          />
          Nouto Järvenpäästä
        </label>
      </fieldset>

      {delivery === 'postitus' && (
        <div className={classes.AddressGroup}>
          <label>
            Postiosoite
            <input type="text" name="osoite" required />
          </label>
          <label>
            Postinumero
            <input type="text" name="postinumero" required />
          </label>
          <label>
            Postitoimipaikka
            <input type="text" name="toimipaikka" required />
          </label>
        </div>
      )}

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

      <button type="submit">Tilaa aloituspakkaus ({formatPrice(total)} €)</button>

      <p className={classes.Note}>
        Saat manuaalisen tilausvahvistuksen 1–2 arkipäivässä.
      </p>
    </form>
  );
}
