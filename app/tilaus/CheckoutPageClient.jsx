'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

import { useCart } from '@/components/Cart/CartProvider';
import SafeLink from '@/components/SafeLink/SafeLink';
import { ORDER_SUCCESS_MESSAGE } from '@/lib/copy/orderMessages';
import { formatFinnishDate } from '@/lib/dates/formatFinnishDate';
import { getCartOrderQuote, getDefaultCartShippingOption } from '@/lib/orders/cartOrder';
import { submitOrderForm } from '@/lib/orders/submitOrderForm';
import {
  findProductKeyBySku,
  formatPrice,
  getCartShippingOptions,
  getProductAvailability,
} from '@/lib/pricing/catalog';

import classes from './CheckoutPage.module.css';

const PICKUP_POINT_SEARCH_ENDPOINT = '/api/pickup-points/search';
const steps = ['Kori', 'Toimitus', 'Maksu', 'Tiedot', 'Vahvistus'];
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const BUSINESS_TIME_ZONE = 'Europe/Helsinki';

function formatPickupPointDistance(distanceInMeters) {
  const numericValue = Number(distanceInMeters);
  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return '';
  }

  if (numericValue < 1000) {
    return `${Math.round(numericValue)} m`;
  }

  return `${(numericValue / 1000).toLocaleString('fi-FI', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })} km`;
}

function getPickupPointTypeLabel(point) {
  return point.parcelLocker ? 'Pakettiautomaatti' : 'Postin palvelupiste';
}

function formatPickupPointOptionLabel(point) {
  return [
    point.name,
    [getPickupPointTypeLabel(point), formatPickupPointDistance(point.distanceInMeters)]
      .filter(Boolean)
      .join(', '),
    point.city || point.municipality,
  ]
    .filter(Boolean)
    .join(' | ');
}

function getTodayInBusinessTimeZone() {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: BUSINESS_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(new Date());
  const valueByType = Object.fromEntries(parts.map((part) => [part.type, part.value]));

  return new Date(
    Date.UTC(
      Number(valueByType.year),
      Number(valueByType.month) - 1,
      Number(valueByType.day)
    )
  );
}

function addDays(date, days) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

function getFollowingMonday(date, weeksAhead = 1) {
  const day = date.getUTCDay();
  const daysUntilMonday = (8 - day) % 7 || 7;
  return addDays(date, daysUntilMonday + (weeksAhead - 1) * 7);
}

function getNextBusinessDay(date) {
  let nextDate = addDays(date, 1);

  while (nextDate.getUTCDay() === 0 || nextDate.getUTCDay() === 6) {
    nextDate = addDays(nextDate, 1);
  }

  return nextDate;
}

function parseIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) {
    return null;
  }

  const [year, month, day] = value.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function formatIsoDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getEstimatedShippingDate(lines) {
  const today = getTodayInBusinessTimeZone();
  const productKeys = [
    ...new Set(
      lines
        .map((line) => line.productKey || findProductKeyBySku(line.sku))
        .filter(Boolean)
    ),
  ];
  let estimatedDate = productKeys.includes('starterKit')
    ? getFollowingMonday(today, 2)
    : productKeys.includes('worms')
      ? getFollowingMonday(today, 1)
      : getNextBusinessDay(today);

  for (const productKey of productKeys) {
    const earliestShippingDate = getProductAvailability(productKey).earliestShippingDate;
    const parsedDate = parseIsoDate(earliestShippingDate);

    if (parsedDate && parsedDate.getTime() > estimatedDate.getTime()) {
      estimatedDate = parsedDate;
    }
  }

  return formatIsoDate(estimatedDate);
}

function CartQuantityEditor({ quantity, onCommit }) {
  const [draftQuantity, setDraftQuantity] = useState(String(quantity || 1));

  useEffect(() => {
    setDraftQuantity(String(quantity || 1));
  }, [quantity]);

  const commitQuantity = () => {
    const nextQuantity = Math.max(1, Math.floor(Number(draftQuantity) || 1));
    const committed = onCommit(nextQuantity);
    setDraftQuantity(String(committed === false ? quantity || 1 : nextQuantity));
  };

  return (
    <input
      className={classes.QuantityInput}
      type="text"
      inputMode="numeric"
      pattern="[0-9]*"
      value={draftQuantity}
      onChange={(event) => {
        const nextValue = event.target.value;
        if (/^\d*$/.test(nextValue)) {
          setDraftQuantity(nextValue);
        }
      }}
      onBlur={commitQuantity}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          commitQuantity();
        }
      }}
    />
  );
}

export default function CheckoutPageClient() {
  const formRef = useRef(null);
  const { items, itemCount, isHydrated, setItemQuantity, removeItem, clearCart } =
    useCart();
  const shippingOptions = getCartShippingOptions();
  const defaultShipping = getDefaultCartShippingOption();
  const [step, setStep] = useState(0);
  const [shippingMethod, setShippingMethod] = useState(defaultShipping?.id ?? '');
  const [addressFields, setAddressFields] = useState({
    line1: '',
    postalCode: '',
    city: '',
  });
  const [customerFields, setCustomerFields] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [pickupPoints, setPickupPoints] = useState([]);
  const [pickupPointError, setPickupPointError] = useState('');
  const [isSearchingPickupPoints, setIsSearchingPickupPoints] = useState(false);
  const [selectedPickupPointId, setSelectedPickupPointId] = useState('');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);
  const [paymentAcknowledged, setPaymentAcknowledged] = useState(false);
  const [formStartedAt, setFormStartedAt] = useState('');
  const [submissionId, setSubmissionId] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [cartFeedback, setCartFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setFormStartedAt(String(Date.now()));
    setSubmissionId(globalThis.crypto?.randomUUID?.() || `cart-${Date.now()}`);
  }, []);

  const quoteResult = useMemo(() => {
    if (!items.length || !shippingMethod) {
      return {
        quote: null,
        error: '',
      };
    }

    try {
      return {
        quote: getCartOrderQuote({ items, shippingMethod }),
        error: '',
      };
    } catch (error) {
      return {
        quote: null,
        error:
          error instanceof Error ? error.message : 'Tilauksen laskeminen epäonnistui.',
      };
    }
  }, [items, shippingMethod]);
  const quote = quoteResult.quote;
  const selectedShippingOption =
    shippingOptions.find((option) => option.id === shippingMethod) ??
    shippingOptions[0] ??
    null;
  const fulfillmentType = selectedShippingOption?.fulfillmentType ?? 'local_pickup';
  const pickupSearchVisible = fulfillmentType === 'pickup_point';
  const deliveryAddressVisible = fulfillmentType === 'home_delivery';
  const addressVisible = pickupSearchVisible || deliveryAddressVisible;
  const addressFieldsReady =
    !addressVisible ||
    (addressFields.line1.trim() &&
      addressFields.postalCode.trim() &&
      addressFields.city.trim());
  const customerFieldsReady =
    customerFields.name.trim() &&
    customerFields.email.trim() &&
    customerFields.phone.trim();
  const estimatedShippingDate = quote ? getEstimatedShippingDate(quote.items) : '';
  const estimatedShippingLabel =
    fulfillmentType === 'local_pickup'
      ? 'Arvioitu noutovalmiuspäivä'
      : 'Arvioitu lähetyspäivä';

  const resetPickupPoint = () => {
    setPickupPoints([]);
    setPickupPointError('');
    setSelectedPickupPointId('');
    setSelectedPickupPoint(null);
  };

  const handleAddressFieldChange = (fieldName, value) => {
    setAddressFields((current) => ({
      ...current,
      [fieldName]: value,
    }));

    if (pickupSearchVisible) {
      resetPickupPoint();
    }
  };

  const handleShippingChange = (nextShippingMethod) => {
    setShippingMethod(nextShippingMethod);
    setSubmitError('');
    resetPickupPoint();
  };

  const handleCustomerFieldChange = (fieldName, value) => {
    setCustomerFields((current) => ({
      ...current,
      [fieldName]: value,
    }));
  };

  const handleCartQuantityChange = (sku, quantity) => {
    const result = setItemQuantity(sku, quantity);
    setCartFeedback(
      result.ok ? '' : result.message || 'Määrän päivittäminen epäonnistui.'
    );
    return result.ok;
  };

  const handleRemoveItem = (sku) => {
    removeItem(sku);
    setCartFeedback('');
  };

  const handlePickupPointSelection = (pickupPointId) => {
    const nextPoint = pickupPoints.find((point) => point.id === pickupPointId) ?? null;

    setSelectedPickupPointId(pickupPointId);
    setSelectedPickupPoint(nextPoint);
    setPickupPointError('');
    setSubmitError('');
  };

  const searchPickupPoints = async () => {
    const postalCode = addressFields.postalCode.trim();
    const street = addressFields.line1.trim();
    const city = addressFields.city.trim();

    if (!street || !postalCode || !city) {
      setPickupPointError('Anna osoite, postinumero ja postitoimipaikka ennen hakua.');
      return;
    }

    setIsSearchingPickupPoints(true);
    setPickupPointError('');
    setPickupPoints([]);
    setSelectedPickupPointId('');
    setSelectedPickupPoint(null);

    try {
      const searchParams = new URLSearchParams({ postalCode });
      searchParams.set('street', street);
      searchParams.set('city', city);

      const response = await fetch(
        `${PICKUP_POINT_SEARCH_ENDPOINT}?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        }
      );
      const responseData = await response.json().catch(() => null);

      if (!response.ok || !responseData?.ok) {
        throw new Error(responseData?.message || 'Noutopisteiden haku epäonnistui.');
      }

      const nextPickupPoints = Array.isArray(responseData.pickupPoints)
        ? responseData.pickupPoints
        : [];
      setPickupPoints(nextPickupPoints);

      if (nextPickupPoints.length === 0) {
        setPickupPointError(
          'Noutopisteitä ei löytynyt tällä haulla. Kokeile toista postinumeroa tai tarkempaa osoitetta.'
        );
      }
    } catch (error) {
      setPickupPointError(
        error instanceof Error ? error.message : 'Noutopisteiden haku epäonnistui.'
      );
    } finally {
      setIsSearchingPickupPoints(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formRef.current || isSubmitting || isSubmitted || quoteResult.error) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await submitOrderForm(formRef.current);
      clearCart();
      setIsSubmitted(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Tilauksen lähetys epäonnistui.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return <p className={classes.HelperText}>Ladataan ostoskoria...</p>;
  }

  if (!itemCount || isSubmitted) {
    const followUpHref = isSubmitted ? '/opas' : '/tuotteet';
    const followUpLabel = isSubmitted ? 'Lue kompostoinnin oppaat' : 'Katso tuotteet';

    return (
      <div className={classes.Panel}>
        <p>{isSubmitted ? ORDER_SUCCESS_MESSAGE : 'Ostoskori on tyhjä.'}</p>
        <div className={classes.Actions}>
          <SafeLink href={followUpHref} className={classes.Button}>
            {followUpLabel}
          </SafeLink>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} className={classes.Form} onSubmit={handleSubmit}>
      <input type="text" name="_gotcha" style={{ display: 'none' }} />
      <input type="hidden" name="cart_items_json" value={JSON.stringify(items)} />
      <input type="hidden" name="toimitus" value={shippingMethod} />
      <input type="hidden" name="osoite" value={addressFields.line1} />
      <input type="hidden" name="postinumero" value={addressFields.postalCode} />
      <input type="hidden" name="toimipaikka" value={addressFields.city} />
      <input type="hidden" name="nimi" value={customerFields.name} />
      <input type="hidden" name="email" value={customerFields.email} />
      <input type="hidden" name="phone" value={customerFields.phone} />
      <input type="hidden" name="lisatiedot" value={customerFields.message} />
      <input
        type="hidden"
        name="maksu_vahvistettu"
        value={paymentAcknowledged ? 'ymmarretty' : ''}
      />
      <input type="hidden" name="lomake_aloitettu_ms" value={formStartedAt} />
      <input type="hidden" name="submission_id" value={submissionId} />
      <input type="hidden" name="sivu_polku" value="/tilaus" />
      <input type="hidden" name="pickup_point_id" value={selectedPickupPoint?.id ?? ''} />
      <input
        type="hidden"
        name="pickup_point_name"
        value={selectedPickupPoint?.name ?? ''}
      />
      <input
        type="hidden"
        name="pickup_point_care_of"
        value={selectedPickupPoint?.careOf ?? ''}
      />
      <input
        type="hidden"
        name="pickup_point_street"
        value={selectedPickupPoint?.street ?? ''}
      />
      <input
        type="hidden"
        name="pickup_point_postal_code"
        value={selectedPickupPoint?.postalCode ?? ''}
      />
      <input
        type="hidden"
        name="pickup_point_city"
        value={selectedPickupPoint?.city ?? ''}
      />
      <input
        type="hidden"
        name="pickup_point_municipality"
        value={selectedPickupPoint?.municipality ?? ''}
      />
      <input
        type="hidden"
        name="pickup_point_specific_location"
        value={selectedPickupPoint?.specificLocation ?? ''}
      />
      <input
        type="hidden"
        name="pickup_point_parcel_locker"
        value={selectedPickupPoint ? String(selectedPickupPoint.parcelLocker) : ''}
      />
      <input
        type="hidden"
        name="pickup_point_routing_service_code"
        value={selectedPickupPoint?.routingServiceCode ?? ''}
      />
      <input
        type="hidden"
        name="pickup_point_distance_meters"
        value={
          selectedPickupPoint?.distanceInMeters != null
            ? String(selectedPickupPoint.distanceInMeters)
            : ''
        }
      />

      <div className={classes.StepNav}>
        {steps.map((label, index) => (
          <span
            key={label}
            className={[classes.StepPill, index === step ? classes.StepPillActive : '']
              .filter(Boolean)
              .join(' ')}
          >
            {index + 1}. {label}
          </span>
        ))}
      </div>

      {step === 0 ? (
        <section className={classes.Panel}>
          <h2>Ostoskori</h2>
          {quoteResult.error ? (
            <p className={`${classes.HelperText} ${classes.Alert}`}>
              {quoteResult.error}
            </p>
          ) : null}
          {cartFeedback ? (
            <p className={`${classes.HelperText} ${classes.Alert}`} role="status">
              {cartFeedback}
            </p>
          ) : null}
          <ul className={classes.LineList}>
            {(quote?.items ?? []).map((line) => (
              <li key={line.sku} className={classes.LineItem}>
                <div>
                  <div className={classes.LineTitle}>{line.label}</div>
                  <p className={classes.LineMeta}>
                    {formatPrice(line.unitPrice)} € / kpl
                  </p>
                  <div className={classes.LineActions}>
                    <label className={classes.Field}>
                      <span>Määrä</span>
                      <CartQuantityEditor
                        quantity={line.packageQuantity}
                        onCommit={(quantity) =>
                          handleCartQuantityChange(line.sku, quantity)
                        }
                      />
                    </label>
                    <button
                      type="button"
                      className={classes.DangerButton}
                      onClick={() => handleRemoveItem(line.sku)}
                    >
                      Poista
                    </button>
                  </div>
                </div>
                <strong>{formatPrice(line.itemTotal)} €</strong>
              </li>
            ))}
          </ul>
          {quote ? (
            <div className={classes.SummaryRows}>
              <div>
                <span>Tuotteet</span>
                <strong>{formatPrice(quote.itemSubtotal)} €</strong>
              </div>
            </div>
          ) : null}
          <div className={classes.Actions}>
            <button
              type="button"
              className={classes.Button}
              onClick={() => setStep(1)}
              disabled={!quote || Boolean(quoteResult.error)}
            >
              Jatka
            </button>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className={classes.Panel}>
          <h2>Toimitustapa</h2>
          <div className={classes.ChoiceList}>
            {shippingOptions.map((option) => (
              <label key={option.id} className={classes.Choice}>
                <input
                  type="radio"
                  name="toimitus"
                  value={option.id}
                  checked={shippingMethod === option.id}
                  onChange={() => handleShippingChange(option.id)}
                />
                <span>
                  <strong>{option.label}</strong>
                  <br />
                  {option.price > 0 ? `${formatPrice(option.price)} €` : '0 €'}
                </span>
              </label>
            ))}
          </div>

          {addressVisible ? (
            <div className={classes.AddressGrid}>
              <label className={classes.Field}>
                <span>{deliveryAddressVisible ? 'Toimitusosoite' : 'Katuosoite'}</span>
                <input
                  type="text"
                  name="osoite"
                  value={addressFields.line1}
                  onChange={(event) =>
                    handleAddressFieldChange('line1', event.target.value)
                  }
                  required={addressVisible}
                  autoComplete="street-address"
                />
              </label>
              <label className={classes.Field}>
                <span>Postinumero</span>
                <input
                  type="text"
                  name="postinumero"
                  value={addressFields.postalCode}
                  onChange={(event) =>
                    handleAddressFieldChange('postalCode', event.target.value)
                  }
                  required={addressVisible}
                  autoComplete="postal-code"
                />
              </label>
              <label className={classes.Field}>
                <span>Postitoimipaikka</span>
                <input
                  type="text"
                  name="toimipaikka"
                  value={addressFields.city}
                  onChange={(event) =>
                    handleAddressFieldChange('city', event.target.value)
                  }
                  required={addressVisible}
                  autoComplete="address-level2"
                />
              </label>
            </div>
          ) : null}

          {pickupSearchVisible ? (
            <>
              <div className={classes.Actions}>
                <button
                  type="button"
                  className={classes.SecondaryButton}
                  onClick={searchPickupPoints}
                  disabled={isSearchingPickupPoints}
                >
                  {isSearchingPickupPoints
                    ? 'Haetaan Postin noutopaikkoja...'
                    : 'Hae Postin noutopaikat'}
                </button>
              </div>
              {pickupPointError ? (
                <p className={classes.HelperText} role="status">
                  {pickupPointError}
                </p>
              ) : null}
              {pickupPoints.length > 0 ? (
                <label className={classes.Field}>
                  <span>Valitse Postin noutopaikka</span>
                  <select
                    name="pickup_point_selection"
                    className={classes.PickupPointSelect}
                    value={selectedPickupPointId}
                    onChange={(event) => handlePickupPointSelection(event.target.value)}
                  >
                    <option value="">Valitse noutopaikka listasta</option>
                    {pickupPoints.map((point) => (
                      <option key={point.id} value={point.id}>
                        {formatPickupPointOptionLabel(point)}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}
            </>
          ) : null}

          {estimatedShippingDate ? (
            <div className={classes.InfoBox}>
              <h3>{estimatedShippingLabel}</h3>
              <p>
                {formatFinnishDate(estimatedShippingDate, 'numeric')}. Todellinen lähetys-
                tai noutopäivä vahvistetaan tilausvahvistuksessa.
              </p>
            </div>
          ) : null}

          <div className={classes.Actions}>
            <button
              type="button"
              className={classes.SecondaryButton}
              onClick={() => setStep(0)}
            >
              Takaisin
            </button>
            <button
              type="button"
              className={classes.Button}
              onClick={() => setStep(2)}
              disabled={!addressFieldsReady}
            >
              Jatka
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className={classes.Panel}>
          <h2>Maksu</h2>
          <div className={classes.InfoBox}>
            <p>
              Maksu tapahtuu OP-Kevytyrittäjä-palvelun sähköpostilaskulla. Laskun
              maksuaika on 7 päivää.
            </p>
          </div>
          <label className={classes.CheckRow}>
            <input
              type="checkbox"
              checked={paymentAcknowledged}
              onChange={(event) => setPaymentAcknowledged(event.target.checked)}
            />
            <span>Ymmärrän, että tilaus maksetaan sähköpostilaskulla.</span>
          </label>
          <div className={classes.Actions}>
            <button
              type="button"
              className={classes.SecondaryButton}
              onClick={() => setStep(1)}
            >
              Takaisin
            </button>
            <button
              type="button"
              className={classes.Button}
              onClick={() => setStep(3)}
              disabled={!paymentAcknowledged}
            >
              Jatka
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className={classes.Panel}>
          <h2>Yhteystiedot</h2>
          <div className={classes.Fields}>
            <label className={classes.Field}>
              <span>Nimi</span>
              <input
                type="text"
                name="nimi"
                value={customerFields.name}
                onChange={(event) =>
                  handleCustomerFieldChange('name', event.target.value)
                }
                required
                autoComplete="name"
              />
            </label>
            <label className={classes.Field}>
              <span>Sähköposti</span>
              <input
                type="email"
                name="email"
                value={customerFields.email}
                onChange={(event) =>
                  handleCustomerFieldChange('email', event.target.value)
                }
                required
                autoComplete="email"
              />
            </label>
            <label className={classes.Field}>
              <span>Puhelinnumero</span>
              <input
                type="tel"
                name="phone"
                value={customerFields.phone}
                onChange={(event) =>
                  handleCustomerFieldChange('phone', event.target.value)
                }
                required
                autoComplete="tel"
              />
            </label>
            <label className={classes.Field}>
              <span>Viesti (valinnainen)</span>
              <textarea
                name="lisatiedot"
                rows="4"
                value={customerFields.message}
                onChange={(event) =>
                  handleCustomerFieldChange('message', event.target.value)
                }
              />
            </label>
          </div>
          <div className={classes.Actions}>
            <button
              type="button"
              className={classes.SecondaryButton}
              onClick={() => setStep(2)}
            >
              Takaisin
            </button>
            <button
              type="button"
              className={classes.Button}
              onClick={() => setStep(4)}
              disabled={!customerFieldsReady}
            >
              Jatka
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className={classes.Panel}>
          <h2>Yhteenveto</h2>
          <ul className={classes.LineList}>
            {(quote?.items ?? []).map((line) => (
              <li key={line.sku} className={classes.LineItem}>
                <span>
                  {line.packageQuantity} x {line.label}
                </span>
                <strong>{formatPrice(line.itemTotal)} €</strong>
              </li>
            ))}
            <li className={classes.LineItem}>
              <span>{quote?.shippingOption.label}</span>
              <strong>{formatPrice(quote?.shippingPrice ?? 0)} €</strong>
            </li>
          </ul>
          <div className={classes.SummaryTotal}>
            <span>Yhteensä</span>
            <strong>{formatPrice(quote?.total ?? 0)} €</strong>
          </div>
          <p className={classes.HelperText}>
            Lähettämällä tilauksen vahvistat, että olet tutustunut{' '}
            <SafeLink href="/tilausehdot">tilaus- ja toimitusehtoihin</SafeLink> sekä{' '}
            <SafeLink href="/tietosuoja">tietosuojaselosteeseen</SafeLink>.
          </p>
          {submitError ? (
            <p className={`${classes.HelperText} ${classes.Alert}`} role="alert">
              {submitError}
            </p>
          ) : null}
          <div className={classes.Actions}>
            <button
              type="button"
              className={classes.SecondaryButton}
              onClick={() => setStep(3)}
            >
              Takaisin
            </button>
            <button
              type="submit"
              className={classes.Button}
              disabled={isSubmitting || Boolean(quoteResult.error)}
            >
              {isSubmitting ? 'Lähetetään tilausta...' : 'Lähetä tilaus'}
            </button>
          </div>
        </section>
      ) : null}
    </form>
  );
}
