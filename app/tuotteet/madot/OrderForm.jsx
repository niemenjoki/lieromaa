'use client';

import { useEffect, useMemo, useState } from 'react';

import { findDiscountForSku } from '@/lib/discounts/findDiscountForSku';

import classes from '../ProductPage.module.css';

const AMOUNT_PRICES = {
  50: 20,
  100: 30,
  200: 50,
};
const SKU_BY_AMOUNT = {
  50: 'worms-50',
  100: 'worms-100',
  200: 'worms-200',
};

const POSTAGE_PRICE = 8.9;
const FROST_FEE = 3;

const formatPrice = (value) => {
  if (value % 1 === 0) {
    return value.toLocaleString('fi-FI');
  }

  return value.toLocaleString('fi-FI', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export default function OrderForm() {
  const [delivery, setDelivery] = useState('postitus');
  const [amount, setAmount] = useState('100');
  const [frostFee, setFrostFee] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountFeedback, setDiscountFeedback] = useState('');
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);

  const showFrostCharge = useMemo(() => {
    const currentMonth = new Date().getMonth() + 1;
    return currentMonth >= 9 || currentMonth <= 5;
  }, []);

  const wormPrice = amount ? (AMOUNT_PRICES[amount] ?? 0) : 0;
  const currentSku = SKU_BY_AMOUNT[amount] ?? '';
  const postage = delivery === 'postitus' ? POSTAGE_PRICE : 0;
  const frost = showFrostCharge && frostFee ? FROST_FEE : 0;

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

  return (
    <form
      className={classes.CalculatorForm}
      action="https://formspree.io/f/xyznlyow"
      method="POST"
    >
      <input type="text" name="_gotcha" style={{ display: 'none' }} />
      <input type="hidden" name="tuote" value="Kompostimadot" />
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

      <label>
        Puhelinnumero
        <input type="tel" name="phone" />
      </label>

      <fieldset>
        <legend>Toimitustapa</legend>
        <label>
          <input
            type="radio"
            name="toimitus"
            value="postitus"
            checked={delivery === 'postitus'}
            onChange={() => setDelivery('postitus')}
          />{' '}
          Posti (8,90 €)
        </label>
        <label>
          <input
            type="radio"
            name="toimitus"
            value="nouto"
            checked={delivery === 'nouto'}
            onChange={() => setDelivery('nouto')}
          />{' '}
          Nouto Järvenpäästä
        </label>
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
            Maksan pakkastoimituslisän (3 €)
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
        <label>
          <input
            type="radio"
            name="maara"
            value="50"
            checked={amount === '50'}
            onChange={() => setAmount('50')}
          />{' '}
          50 matoa – 20 €
        </label>
        <label>
          <input
            type="radio"
            name="maara"
            value="100"
            checked={amount === '100'}
            onChange={() => setAmount('100')}
          />{' '}
          100 matoa – 30 €
        </label>
        <label>
          <input
            type="radio"
            name="maara"
            value="200"
            checked={amount === '200'}
            onChange={() => setAmount('200')}
          />{' '}
          200 matoa – 50 €
        </label>
      </fieldset>

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

      <button type="submit">Lähetä tilaus</button>
      <p className={classes.Note}>
        Saat manuaalisen vahvistuksen ja laskun sähköpostiisi 1–2 arkipäivän sisällä.
      </p>
    </form>
  );
}
