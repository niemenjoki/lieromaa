'use client';

import { useState } from 'react';

import classes from '../ProductPage.module.css';

const PACKAGE_PRICES = { 50: 84, 100: 94, 200: 114 };
const POSTAGE_PRICE = 10.9;

const formatPrice = (value) =>
  value.toLocaleString('fi-FI', {
    minimumFractionDigits: value % 1 ? 2 : 0,
    maximumFractionDigits: 2,
  });

export default function OrderForm() {
  const [delivery, setDelivery] = useState('postitus');
  const [amount, setAmount] = useState('100');

  const packagePrice = PACKAGE_PRICES[amount] ?? 0;
  const postage = delivery === 'postitus' ? POSTAGE_PRICE : 0;
  const total = packagePrice + postage;

  return (
    <form
      className={classes.CalculatorForm}
      action="https://formspree.io/f/xkgpdwpa"
      method="POST"
    >
      <input type="text" name="_gotcha" style={{ display: 'none' }} />
      <input type="hidden" name="tuote" value="Matokompostorin aloituspakkaus" />

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
