'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import SafeLink from '@/components/SafeLink/SafeLink';
import {
  ORDER_SUBMIT_ENDPOINT,
  ORDER_SUCCESS_MESSAGE,
} from '@/data/commerce/orderMessages';
import { findDiscountForSku } from '@/lib/discounts/findDiscountForSku';
import { getOrderQuote } from '@/lib/orders/getOrderQuote';
import { submitOrderForm } from '@/lib/orders/submitOrderForm';
import {
  formatPrice,
  getProductOrderConfig,
  getProductPricing,
  getProductShippingOptions,
  getProductVariant,
  getProductVariants,
} from '@/lib/pricing/catalog';

import classes from './ProductPage.module.css';
import WormAmountFinePrint from './WormAmountFinePrint';

const PICKUP_POINT_SEARCH_ENDPOINT = '/api/pickup-points/search';
const emptyAddressFields = {
  line1: '',
  postalCode: '',
  city: '',
};

const discountDateFormatter = new Intl.DateTimeFormat('fi-FI', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
});

function formatAutomaticDiscountLabel(discount) {
  if (!discount) {
    return '';
  }

  return discount.type === 'percentage'
    ? `-${formatPrice(discount.value)} %`
    : `-${formatPrice(discount.amount)} €`;
}

function formatDiscountValidUntil(value) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : discountDateFormatter.format(date);
}

function getAutomaticDiscountNotice(variant) {
  if (!variant?.discount) {
    return '';
  }

  const validUntilText = variant.discount.validUntil
    ? ` Tarjous voimassa ${formatDiscountValidUntil(variant.discount.validUntil)} asti.`
    : '';

  return `Norm. ${formatPrice(variant.basePrice)} € (${formatAutomaticDiscountLabel(variant.discount)}). 30 päivän alin hinta: ${formatPrice(variant.discount.lowestPrice30Days)} €.${validUntilText}`;
}

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

function joinPickupPointAddress(point) {
  const postalLine = [point.postalCode, point.city || point.municipality]
    .filter(Boolean)
    .join(' ');

  return [point.street, postalLine].filter(Boolean).join(', ');
}

function getPickupPointTypeLabel(point) {
  return point.parcelLocker ? 'Pakettiautomaatti' : 'Postin palvelupiste';
}

function formatPickupPointOptionLabel(point) {
  const postalLine = joinPickupPointAddress(point);
  const distanceLabel = formatPickupPointDistance(point.distanceInMeters);

  return [
    point.name,
    [getPickupPointTypeLabel(point), distanceLabel].filter(Boolean).join(', '),
    point.specificLocation,
    postalLine,
  ]
    .filter(Boolean)
    .join(' | ');
}

function ShippingHelpTexts({ texts }) {
  if (!Array.isArray(texts) || texts.length === 0) {
    return null;
  }

  return (
    <>
      {texts.map((line) => (
        <p key={line} className={classes.HelperText}>
          {line}
        </p>
      ))}
    </>
  );
}

export default function ProductOrderForm({ productKey }) {
  const pathname = usePathname();
  const product = getProductPricing(productKey);
  const orderConfig = getProductOrderConfig(productKey);
  const variants = getProductVariants(productKey);
  const shippingOptions = getProductShippingOptions(productKey);
  const defaultVariant =
    getProductVariant(productKey, orderConfig.defaultVariantAmount) ??
    variants[0] ??
    null;
  const defaultAmount = defaultVariant ? String(defaultVariant.amount) : '';
  const defaultDelivery = shippingOptions[0]?.id ?? 'nouto';

  const [delivery, setDelivery] = useState(defaultDelivery);
  const [amount, setAmount] = useState(defaultAmount);
  const [selectedExtraCharges, setSelectedExtraCharges] = useState({});
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountFeedback, setDiscountFeedback] = useState('');
  const [isCheckingDiscount, setIsCheckingDiscount] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formStartedAt, setFormStartedAt] = useState('');
  const [submissionId, setSubmissionId] = useState('');
  const [addressFields, setAddressFields] = useState(emptyAddressFields);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [pickupPointError, setPickupPointError] = useState('');
  const [isSearchingPickupPoints, setIsSearchingPickupPoints] = useState(false);
  const [pickupPointFallbackAllowed, setPickupPointFallbackAllowed] = useState(false);
  const [selectedPickupPointId, setSelectedPickupPointId] = useState('');
  const [selectedPickupPoint, setSelectedPickupPoint] = useState(null);

  const currentVariant =
    variants.find((variant) => String(variant.amount) === amount) ?? defaultVariant;
  const currentSku = currentVariant?.sku ?? '';
  const selectedShippingOption =
    shippingOptions.find((option) => option.id === delivery) ??
    shippingOptions[0] ??
    null;
  const selectedFulfillmentType =
    selectedShippingOption?.fulfillmentType ?? 'local_pickup';
  const deliveryRequiresPhone =
    selectedFulfillmentType === 'pickup_point' ||
    selectedFulfillmentType === 'home_delivery';
  const pickupSearchVisible = selectedFulfillmentType === 'pickup_point';
  const deliveryAddressVisible = selectedFulfillmentType === 'home_delivery';
  const quote =
    currentSku && delivery
      ? getOrderQuote({
          productKey,
          sku: currentSku,
          shippingMethod: delivery,
          discount: appliedDiscount,
          selectedExtraCharges,
        })
      : null;
  const activeExtraCharges = quote?.extraCharges.filter((charge) => charge.active) ?? [];

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
    setDelivery(defaultDelivery);
    setAmount(defaultAmount);
    setSelectedExtraCharges({});
    setDiscountCode('');
    setAppliedDiscount(null);
    setDiscountFeedback('');
    setIsSubmitting(false);
    setIsSubmitted(false);
    setSubmitError('');
    setAddressFields(emptyAddressFields);
    setPickupPoints([]);
    setPickupPointError('');
    setIsSearchingPickupPoints(false);
    setPickupPointFallbackAllowed(false);
    setSelectedPickupPointId('');
    setSelectedPickupPoint(null);
  }, [defaultAmount, defaultDelivery, productKey]);

  useEffect(() => {
    setFormStartedAt(String(Date.now()));
    setSubmissionId(globalThis.crypto?.randomUUID?.() || `${productKey}-${Date.now()}`);
  }, [productKey]);

  useEffect(() => {
    if (shippingOptions.some((option) => option.id === delivery)) {
      return;
    }

    setDelivery(defaultDelivery);
  }, [defaultDelivery, delivery, shippingOptions]);

  const handleDiscountChange = (event) => {
    setDiscountCode(event.target.value);
    setAppliedDiscount(null);
    setDiscountFeedback('');
  };

  const handleAddressFieldChange = (fieldName, value) => {
    setAddressFields((current) => ({
      ...current,
      [fieldName]: value,
    }));

    if (pickupSearchVisible) {
      setPickupPoints([]);
      setPickupPointError('');
      setSelectedPickupPointId('');
      setSelectedPickupPoint(null);
    }
  };

  const handleDeliveryChange = (nextDelivery) => {
    setDelivery(nextDelivery);
    setSubmitError('');
    setPickupPoints([]);
    setPickupPointError('');
    setPickupPointFallbackAllowed(false);
    setSelectedPickupPointId('');
    setSelectedPickupPoint(null);
  };

  const handlePickupPointSelection = (pickupPointId) => {
    const nextPoint = pickupPoints.find((point) => point.id === pickupPointId) ?? null;

    setSelectedPickupPointId(pickupPointId);
    setSelectedPickupPoint(nextPoint);
    setPickupPointError('');
    setSubmitError('');
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

  const searchPickupPoints = async () => {
    const postalCode = addressFields.postalCode.trim();
    const street = addressFields.line1.trim();
    const city = addressFields.city.trim();

    if (!postalCode) {
      setPickupPointError('Anna vähintään postinumero, niin voin hakea noutopaikat.');
      return;
    }

    setIsSearchingPickupPoints(true);
    setPickupPointError('');
    setPickupPoints([]);
    setPickupPointFallbackAllowed(false);
    setSelectedPickupPointId('');
    setSelectedPickupPoint(null);

    try {
      const searchParams = new URLSearchParams({
        postalCode,
      });
      if (street) {
        searchParams.set('street', street);
      }
      if (city) {
        searchParams.set('city', city);
      }

      const response = await fetch(
        `${PICKUP_POINT_SEARCH_ENDPOINT}?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
          cache: 'no-store',
        }
      );

      const responseData = await response.json().catch(() => null);
      if (!response.ok || !responseData?.ok) {
        if (response.status >= 500) {
          setPickupPointFallbackAllowed(true);
        }
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
      setPickupPointFallbackAllowed(true);
      setPickupPointError(
        error instanceof Error ? error.message : 'Noutopisteiden haku epäonnistui.'
      );
    } finally {
      setIsSearchingPickupPoints(false);
    }
  };

  const handleExtraChargeChange = (fieldName, checked) => {
    setSelectedExtraCharges((current) => ({
      ...current,
      [fieldName]: checked,
    }));
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

  const renderVariantSection = () => (
    <>
      <fieldset>
        <legend>{orderConfig.variantLegend}</legend>
        {variants.map((variant) => (
          <label
            key={variant.sku}
            className={variant.discount ? classes.VariantOptionLabel : undefined}
          >
            <input
              type="radio"
              name="maara"
              value={variant.amount}
              checked={amount === String(variant.amount)}
              onChange={() => setAmount(String(variant.amount))}
            />
            <span className={classes.VariantOptionContent}>
              <span>
                {orderConfig.getVariantLabel({
                  amount: variant.amount,
                  price: variant.price,
                  priceFormatted: formatPrice(variant.price),
                  basePrice: variant.basePrice,
                  basePriceFormatted: formatPrice(variant.basePrice),
                  discount: variant.discount,
                  variant,
                  productKey,
                })}
              </span>
              {variant.discount ? (
                <span className={classes.VariantDiscountNote}>
                  {getAutomaticDiscountNotice(variant)}
                </span>
              ) : null}
            </span>
          </label>
        ))}
      </fieldset>
      {orderConfig.showWormAmountFinePrint ? <WormAmountFinePrint /> : null}
    </>
  );

  const total = quote?.total ?? 0;
  const totalFormatted = formatPrice(total);
  const discountProductAmount = quote?.discountAmounts.productAmount ?? 0;
  const shippingDiscount = quote?.discountAmounts.shippingAmount ?? 0;
  const selectedShippingHelpTexts =
    selectedShippingOption?.helperTexts ?? orderConfig.shippingHelperTexts ?? [];

  return (
    <form
      className={classes.CalculatorForm}
      action={ORDER_SUBMIT_ENDPOINT}
      method="POST"
      onSubmit={handleSubmit}
      data-analytics-form="order"
    >
      <input type="text" name="_gotcha" style={{ display: 'none' }} />
      <input type="hidden" name="tuote" value={product.name} />
      <input type="hidden" name="tuote_avain" value={productKey} />
      <input type="hidden" name="sku" value={currentSku} />
      <input type="hidden" name="lomake_aloitettu_ms" value={formStartedAt} />
      <input type="hidden" name="submission_id" value={submissionId} />
      <input type="hidden" name="sivu_polku" value={pathname ?? ''} />
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
        <input type="tel" name="phone" required={deliveryRequiresPhone} />
      </label>

      {orderConfig.variantSelectorPosition === 'beforeFulfillment'
        ? renderVariantSection()
        : null}

      <fieldset>
        <legend>Toimitustapa</legend>
        {shippingOptions.map((option) => (
          <label key={option.id}>
            <input
              type="radio"
              name="toimitus"
              value={option.id}
              checked={delivery === option.id}
              onChange={() => handleDeliveryChange(option.id)}
            />{' '}
            {option.label}
            {option.price > 0 ? ` (${formatPrice(option.price)} €)` : ''}
          </label>
        ))}
      </fieldset>

      {activeExtraCharges.map((charge) => (
        <fieldset key={charge.key} className={classes.FrostCharge}>
          <legend>{charge.label}</legend>
          {charge.descriptionLines?.map((line) => (
            <p key={line} className={classes.HelperText}>
              {line}
            </p>
          ))}
          <label>
            <input
              type="checkbox"
              name={charge.fieldName}
              value={charge.checkedValue ?? 'on'}
              checked={Boolean(selectedExtraCharges[charge.fieldName])}
              onChange={(event) =>
                handleExtraChargeChange(charge.fieldName, event.target.checked)
              }
            />{' '}
            {charge.checkboxLabel} ({formatPrice(charge.price)} €)
          </label>
          {charge.helperTextLines?.map((line) => (
            <p key={line} className={classes.HelperText}>
              {line}
            </p>
          ))}
        </fieldset>
      ))}

      {pickupSearchVisible ? (
        <>
          <div className={classes.AddressGroup}>
            <label>
              Katuosoite (valinnainen)
              <input
                type="text"
                name="osoite"
                value={addressFields.line1}
                onChange={(event) =>
                  handleAddressFieldChange('line1', event.target.value)
                }
                autoComplete="street-address"
              />
            </label>
            <label>
              Postinumero
              <input
                type="text"
                name="postinumero"
                value={addressFields.postalCode}
                onChange={(event) =>
                  handleAddressFieldChange('postalCode', event.target.value)
                }
                required={pickupSearchVisible}
                autoComplete="postal-code"
              />
            </label>
            <label>
              Kaupunki (valinnainen)
              <input
                type="text"
                name="toimipaikka"
                value={addressFields.city}
                onChange={(event) => handleAddressFieldChange('city', event.target.value)}
                autoComplete="address-level2"
              />
            </label>
          </div>

          <button
            type="button"
            className={classes.SecondaryButton}
            onClick={searchPickupPoints}
            disabled={isSearchingPickupPoints}
          >
            {isSearchingPickupPoints ? 'Haetaan noutopaikkoja...' : 'Hae noutopaikat'}
          </button>

          {pickupPointError ? (
            <p className={classes.HelperText} role="status">
              {pickupPointError}
            </p>
          ) : null}

          {pickupPoints.length > 0 ? (
            <fieldset>
              <legend>Valitse noutopaikka</legend>
              <label className={classes.StackedField}>
                <span className={classes.FieldLabel}>Noutopaikkalista</span>
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
            </fieldset>
          ) : null}

          {selectedPickupPoint ? (
            <div className={classes.SelectedPickupPoint}>
              <strong>Valittu noutopaikka:</strong>{' '}
              {[
                selectedPickupPoint.name,
                selectedPickupPoint.specificLocation,
                joinPickupPointAddress(selectedPickupPoint),
              ]
                .filter(Boolean)
                .join(', ')}
            </div>
          ) : null}
        </>
      ) : null}

      {deliveryAddressVisible ? (
        <div className={classes.AddressGroup}>
          <label>
            Toimitusosoite
            <input
              type="text"
              name="osoite"
              value={addressFields.line1}
              onChange={(event) => handleAddressFieldChange('line1', event.target.value)}
              required={deliveryAddressVisible}
              autoComplete="street-address"
            />
          </label>
          <label>
            Postinumero
            <input
              type="text"
              name="postinumero"
              value={addressFields.postalCode}
              onChange={(event) =>
                handleAddressFieldChange('postalCode', event.target.value)
              }
              required={deliveryAddressVisible}
              autoComplete="postal-code"
            />
          </label>
          <label>
            Postitoimipaikka
            <input
              type="text"
              name="toimipaikka"
              value={addressFields.city}
              onChange={(event) => handleAddressFieldChange('city', event.target.value)}
              required={deliveryAddressVisible}
              autoComplete="address-level2"
            />
          </label>
        </div>
      ) : null}

      {orderConfig.variantSelectorPosition === 'afterFulfillment'
        ? renderVariantSection()
        : null}

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
            ? `Alennus tuotteesta ${appliedDiscount.value} % (-${formatPrice(discountProductAmount)} €)`
            : appliedDiscount.type === 'fixed'
              ? `Alennus tuotteesta -${formatPrice(discountProductAmount)} €`
              : `Toimitus alennuksella: -${formatPrice(shippingDiscount)} €`}
        </p>
      ) : null}

      <label>
        Viesti (valinnainen)
        <textarea name="lisatiedot" rows="3" />
      </label>

      {pickupSearchVisible && pickupPointFallbackAllowed ? (
        <p className={classes.HelperText}>
          Jos noutopistehaku ei ole käytettävissä tai haluat toivoa tiettyä noutopaikkaa
          ilman valintaa, voit kirjoittaa tähän toivomasi Postin noutopaikan tai
          automaatin. Muuten voin lähettää paketin myös pelkän postinumeron perusteella.
        </p>
      ) : null}

      <ShippingHelpTexts texts={selectedShippingHelpTexts} />

      <p className={classes.OrderTotal}>
        Yhteensä: <strong>{totalFormatted} €</strong>
      </p>
      <p className={classes.Note}>
        Painamalla alla olevaa painiketta teet sitovan tilauksen. Maksu tapahtuu
        tilausvahvistuksen jälkeen OP Kevytyrittäjä -palvelun kautta lähetettävällä
        laskulla.
      </p>
      <p className={classes.Note}>
        Ennen tilausta tutustu{' '}
        <SafeLink href="/tilausehdot">tilaus- ja toimitusehtoihin</SafeLink> sekä{' '}
        <SafeLink href="/tietosuoja">tietosuojaselosteeseen</SafeLink>.
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
            : orderConfig.submitButtonLabel({
                total,
                totalFormatted,
                productKey,
                productName: product.name,
              })}
      </button>

      {orderConfig.confirmationNote ? (
        <p className={classes.Note}>{orderConfig.confirmationNote}</p>
      ) : null}
    </form>
  );
}
