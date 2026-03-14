'use client';

import { useEffect, useState } from 'react';

import { findDiscountForSku } from '@/lib/discounts/findDiscountForSku';
import {
  formatPrice,
  getProductPricing,
  getProductShippingOptions,
  getProductVariant,
  getProductVariants,
} from '@/lib/pricing/catalog';

import classes from '../ProductPage.module.css';

const starterKitProduct = getProductPricing('starterKit');
const starterKitVariants = getProductVariants('starterKit');
const starterKitShippingOptions = getProductShippingOptions('starterKit');
const defaultStarterKitVariant =
  getProductVariant('starterKit', 100) ?? starterKitVariants[0] ?? null;
const defaultDelivery = starterKitShippingOptions[0]?.id ?? 'postitus';

export default function OrderForm() {
  const [delivery, setDelivery] = useState(defaultDelivery);
  const [amount, setAmount] = useState(
    defaultStarterKitVariant ? String(defaultStarterKitVariant.amount) : ''
  );
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountFeedback, setDiscountFeedback] = useState('');
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);

  const currentVariant =
    starterKitVariants.find((variant) => String(variant.amount) === amount) ??
    defaultStarterKitVariant;
  const packagePrice = currentVariant?.price ?? 0;
  const currentSku = currentVariant?.sku ?? '';
  const currentShippingOption =
    starterKitShippingOptions.find((option) => option.id === delivery) ??
    starterKitShippingOptions[0];
  const postage = currentShippingOption?.price ?? 0;

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
      <input type="hidden" name="tuote" value={starterKitProduct.name} />
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
        {starterKitVariants.map((variant) => (
          <label key={variant.sku}>
            <input
              type="radio"
              name="maara"
              value={variant.amount}
              checked={amount === String(variant.amount)}
              onChange={() => setAmount(String(variant.amount))}
            />
            Aloituspakkaus + {variant.amount} matoa – {formatPrice(variant.price)} €
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Toimitustapa</legend>
        {starterKitShippingOptions.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="toimitus"
              value={option.id}
              checked={delivery === option.id}
              onChange={() => setDelivery(option.id)}
            />
            {option.label}
            {option.price > 0 ? ` (${formatPrice(option.price)} €)` : ''}
          </label>
        ))}
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
