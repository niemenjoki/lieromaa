'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useCart } from '@/components/Cart/CartProvider';
import SafeLink from '@/components/SafeLink/SafeLink';
import { trackAnalyticsEvent } from '@/lib/analytics/events';
import {
  getEstimatedShippingDate as getEstimatedShippingDateForProducts,
  getTodayInBusinessTimeZone,
  getVisibleEarliestShippingDate,
} from '@/lib/commerce/shippingEstimate.mjs';
import { formatDate, formatDistance } from '@/lib/i18n/formatters.mjs';
import { getTransactionMessages } from '@/lib/i18n/messages.mjs';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import {
  getCartErrorMessage,
  getCartOrderQuote,
  getDefaultCartShippingOption,
} from '@/lib/orders/cartOrder';
import { submitOrderForm } from '@/lib/orders/submitOrderForm';
import {
  findProductKeyBySku,
  formatCurrency,
  formatPrice,
  getCartShippingOptions,
  getProductAvailability,
  getProductPricing,
} from '@/lib/pricing/catalog';

import classes from './CheckoutPage.module.css';

const PICKUP_POINT_SEARCH_ENDPOINT = '/api/pickup-points/search';
const POSTCODE_PATTERN = /^\d{5}$/;

function getPickupPointTypeLabel(point, copy) {
  return point.parcelLocker
    ? copy.pickupPointTypes.parcelLocker
    : copy.pickupPointTypes.servicePoint;
}

function formatPickupPointOptionLabel(point, language, copy) {
  return [
    point.name,
    [
      getPickupPointTypeLabel(point, copy),
      formatDistance(point.distanceInMeters, language),
    ]
      .filter(Boolean)
      .join(', '),
    point.city || point.municipality,
  ]
    .filter(Boolean)
    .join(' | ');
}

function getProductKeysFromLines(lines) {
  return [
    ...new Set(
      lines
        .map((line) => line.productKey || findProductKeyBySku(line.sku))
        .filter(Boolean)
    ),
  ];
}

function getShippingScheduleKeysFromLines(lines) {
  return [
    ...new Set([
      ...getProductKeysFromLines(lines),
      ...lines.map((line) => line.shippingScheduleKey).filter(Boolean),
    ]),
  ];
}

function getEstimatedShippingDate(lines) {
  const productKeys = getProductKeysFromLines(lines);
  const availabilityDatesByProductKey = Object.fromEntries(
    productKeys.map((productKey) => [
      productKey,
      getProductAvailability(productKey).earliestShippingDate,
    ])
  );

  return getEstimatedShippingDateForProducts({
    productKeys: getShippingScheduleKeysFromLines(lines),
    availabilityDatesByProductKey,
  });
}

function getAvailabilityDelaySnapshot(lines) {
  const today = getTodayInBusinessTimeZone();
  const productKeys = getProductKeysFromLines(lines);

  return (
    productKeys
      .map((productKey) => {
        const availability = getProductAvailability(productKey);
        const product = getProductPricing(productKey);

        return getVisibleEarliestShippingDate({
          earliestShippingDate: availability.earliestShippingDate,
          normalHandlingWindowDays: Number(product?.schema?.handlingTime?.maxValue),
          now: today,
        });
      })
      .filter(Boolean)
      .sort()
      .at(-1) ?? ''
  );
}

function groupCartLines(lines) {
  const addOnsByParentSku = new Map();

  for (const line of lines.filter((candidate) => candidate.isAddOn)) {
    const parentAddOns = addOnsByParentSku.get(line.parentSku) ?? [];
    parentAddOns.push(line);
    addOnsByParentSku.set(line.parentSku, parentAddOns);
  }

  return lines
    .filter((line) => !line.isAddOn)
    .map((line) => ({
      line,
      addOns: addOnsByParentSku.get(line.sku) ?? [],
    }));
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

export default function CheckoutPageClient({ language }) {
  const copy = getTransactionMessages(language).checkout;
  const formRef = useRef(null);
  const trackedCheckoutEventsRef = useRef(new Set());
  const { items, itemCount, isHydrated, setItemQuantity, removeItem, clearCart } =
    useCart();
  const shippingOptions = getCartShippingOptions(language);
  const defaultShipping = getDefaultCartShippingOption(language);
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

  const analyticsItems = useMemo(
    () => items.map((item) => ({ sku: item.sku, quantity: item.quantity || 1 })),
    [items]
  );

  const trackCheckoutStep = useCallback(
    (eventName, detail = {}) => {
      const eventKey = detail.onceKey || eventName;
      if (eventKey && trackedCheckoutEventsRef.current.has(eventKey)) {
        return;
      }

      if (eventKey) {
        trackedCheckoutEventsRef.current.add(eventKey);
      }

      trackAnalyticsEvent(eventName, {
        eventTarget: 'checkout',
        eventValue: items.map((item) => item.sku).join(','),
        eventItems: analyticsItems,
        ...detail,
      });
    },
    [analyticsItems, items]
  );

  useEffect(() => {
    if (!isHydrated || !itemCount) {
      return;
    }

    trackCheckoutStep('cart_view');
  }, [isHydrated, itemCount, trackCheckoutStep]);

  const quoteResult = useMemo(() => {
    if (!items.length || !shippingMethod) {
      return {
        quote: null,
        error: '',
      };
    }

    try {
      return {
        quote: getCartOrderQuote({ items, shippingMethod, language }),
        error: '',
      };
    } catch (error) {
      return {
        quote: null,
        error: getCartErrorMessage(error, language),
      };
    }
  }, [items, language, shippingMethod]);
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
      POSTCODE_PATTERN.test(addressFields.postalCode.trim()) &&
      addressFields.city.trim());
  const hasInvalidPostcode =
    addressVisible &&
    Boolean(addressFields.postalCode.trim()) &&
    !POSTCODE_PATTERN.test(addressFields.postalCode.trim());
  const customerFieldsReady =
    customerFields.name.trim() &&
    customerFields.email.trim() &&
    customerFields.phone.trim();
  const estimatedShippingDate = quote ? getEstimatedShippingDate(quote.items) : '';
  const availabilityDelaySnapshot = quote
    ? getAvailabilityDelaySnapshot(quote.items)
    : '';
  const estimatedShippingLabel =
    fulfillmentType === 'local_pickup'
      ? copy.estimatedPickupDate
      : copy.estimatedDispatchDate;
  const cartLineGroups = groupCartLines(quote?.items ?? []);

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
    trackCheckoutStep('checkout_shipping_selected', {
      eventTarget: nextShippingMethod,
      onceKey: `checkout_shipping_selected:${nextShippingMethod}`,
    });
  };

  const handleShippingContinue = () => {
    trackCheckoutStep('cart_shipping_continue', {
      eventTarget: shippingMethod,
    });
    setStep(2);
  };

  const handleCustomerFieldChange = (fieldName, value) => {
    setCustomerFields((current) => ({
      ...current,
      [fieldName]: value,
    }));

    if (String(value || '').trim()) {
      trackCheckoutStep('checkout_contact_started');
    }
  };

  const handleCartQuantityChange = (sku, quantity, parentSku = '') => {
    const result = setItemQuantity(sku, quantity, parentSku);
    setCartFeedback(result.ok ? '' : result.message || copy.quantityUpdateFailed);
    return result.ok;
  };

  const handleRemoveItem = (sku, parentSku = '') => {
    removeItem(sku, parentSku);
    setCartFeedback('');
  };

  const handlePickupPointSelection = (pickupPointId) => {
    const nextPoint = pickupPoints.find((point) => point.id === pickupPointId) ?? null;

    setSelectedPickupPointId(pickupPointId);
    setSelectedPickupPoint(nextPoint);
    setPickupPointError('');
    setSubmitError('');

    if (nextPoint) {
      trackCheckoutStep('checkout_pickup_selected', {
        eventTarget: 'pickup_point',
      });
    }
  };

  const searchPickupPoints = async () => {
    const postalCode = addressFields.postalCode.trim();
    const street = addressFields.line1.trim();
    const city = addressFields.city.trim();

    if (!street || !postalCode || !city) {
      setPickupPointError(copy.addressRequired);
      return;
    }

    if (!POSTCODE_PATTERN.test(postalCode)) {
      setPickupPointError(copy.postcodeInvalid);
      return;
    }

    setIsSearchingPickupPoints(true);
    setPickupPointError('');
    setPickupPoints([]);
    setSelectedPickupPointId('');
    setSelectedPickupPoint(null);
    trackCheckoutStep('checkout_pickup_search_started', {
      eventTarget: 'pickup_point',
    });

    try {
      const searchParams = new URLSearchParams({ postalCode });
      searchParams.set('street', street);
      searchParams.set('city', city);

      const response = await fetch(
        `${PICKUP_POINT_SEARCH_ENDPOINT}?${searchParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'X-Lieromaa-Language': language,
          },
          cache: 'no-store',
        }
      );
      const responseData = await response.json().catch(() => null);

      if (!response.ok || !responseData?.ok) {
        throw new Error(responseData?.message || copy.pickupSearchFailed);
      }

      const nextPickupPoints = Array.isArray(responseData.pickupPoints)
        ? responseData.pickupPoints
        : [];
      setPickupPoints(nextPickupPoints);

      if (nextPickupPoints.length === 0) {
        setPickupPointError(copy.pickupSearchEmpty);
      }
    } catch (error) {
      setPickupPointError(
        error instanceof Error ? error.message : copy.pickupSearchFailed
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
      await submitOrderForm(formRef.current, { language });
      trackAnalyticsEvent('order_submit_success', {
        eventTarget: 'checkout',
        eventValue: items.map((item) => item.sku).join(','),
        eventItems: analyticsItems,
      });
      clearCart();
      setIsSubmitted(true);
    } catch (error) {
      trackAnalyticsEvent('order_submit_failed', {
        eventTarget: 'checkout',
        eventValue: error instanceof Error ? 'submit_error' : 'unknown_error',
        eventItems: analyticsItems,
      });
      setSubmitError(error instanceof Error ? error.message : copy.submitFailed);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isHydrated) {
    return <p className={classes.HelperText}>{copy.loadingCart}</p>;
  }

  if (!itemCount || isSubmitted) {
    const followUpHref = isSubmitted
      ? getRoutePath('gettingStarted', language)
      : getRoutePath('products', language);
    const followUpLabel = isSubmitted
      ? copy.successFollowUpLabel
      : copy.emptyFollowUpLabel;

    return (
      <div className={classes.Panel}>
        <p>{isSubmitted ? copy.successMessage : copy.emptyMessage}</p>
        {isSubmitted ? (
          <p className={classes.HelperText}>
            {copy.successCancellation}{' '}
            <SafeLink href={getRoutePath('cancelOrder', language)}>
              {copy.cancellationLink}
            </SafeLink>
            .
          </p>
        ) : null}
        <div className={classes.Actions}>
          <SafeLink href={followUpHref} className={classes.Button}>
            {followUpLabel}
          </SafeLink>
        </div>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className={classes.Form}
      onSubmit={handleSubmit}
      data-analytics-form="order"
    >
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
      <input type="hidden" name="sivu_polku" value={getRoutePath('checkout', language)} />
      <input type="hidden" name="language" value={language} />
      <input type="hidden" name="country" value="FI" />
      <input
        type="hidden"
        name="availability_earliest_shipping_date"
        value={availabilityDelaySnapshot}
      />
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
        {copy.steps.map((label, index) => (
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
          <h2>{copy.headings.cart}</h2>
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
            {cartLineGroups.map(({ line, addOns }) => (
              <li key={line.sku} className={classes.LineItem}>
                <div>
                  <div className={classes.LineTitle}>{line.label}</div>
                  <p className={classes.LineMeta}>
                    {copy.unitPrice({ price: formatPrice(line.unitPrice, language) })}
                  </p>
                  <div className={classes.LineActions}>
                    {line.isQuantityEditable ? (
                      <label className={classes.Field}>
                        <span>{copy.quantity}</span>
                        <CartQuantityEditor
                          quantity={line.packageQuantity}
                          onCommit={(quantity) =>
                            handleCartQuantityChange(line.sku, quantity, line.parentSku)
                          }
                        />
                      </label>
                    ) : (
                      <span className={classes.FixedQuantity}>{copy.fixedQuantity}</span>
                    )}
                    <button
                      type="button"
                      className={classes.DangerButton}
                      onClick={() => handleRemoveItem(line.sku, line.parentSku)}
                    >
                      {copy.remove}
                    </button>
                  </div>
                </div>
                <strong>{formatCurrency(line.itemTotal, language)}</strong>

                {addOns.length ? (
                  <div className={classes.AddOnGroup}>
                    <div className={classes.AddOnHeading}>{copy.addOns}</div>
                    <ul className={classes.AddOnList}>
                      {addOns.map((addOn) => (
                        <li
                          key={`${addOn.parentSku}:${addOn.sku}`}
                          className={classes.AddOnItem}
                        >
                          <div>
                            <div className={classes.AddOnTitle}>{addOn.label}</div>
                            <p className={classes.LineMeta}>
                              {copy.unitPrice({
                                price: formatPrice(addOn.unitPrice, language),
                              })}
                            </p>
                            <div className={classes.LineActions}>
                              {addOn.isQuantityEditable ? (
                                <label className={classes.Field}>
                                  <span>{copy.quantity}</span>
                                  <CartQuantityEditor
                                    quantity={addOn.packageQuantity}
                                    onCommit={(quantity) =>
                                      handleCartQuantityChange(
                                        addOn.sku,
                                        quantity,
                                        addOn.parentSku
                                      )
                                    }
                                  />
                                </label>
                              ) : (
                                <span className={classes.FixedQuantity}>
                                  {copy.fixedQuantity}
                                </span>
                              )}
                              <button
                                type="button"
                                className={classes.DangerButton}
                                onClick={() =>
                                  handleRemoveItem(addOn.sku, addOn.parentSku)
                                }
                              >
                                {copy.remove}
                              </button>
                            </div>
                          </div>
                          <strong>{formatCurrency(addOn.itemTotal, language)}</strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          {quote ? (
            <div className={classes.SummaryRows}>
              <div>
                <span>{copy.productsSubtotal}</span>
                <strong>{formatCurrency(quote.itemSubtotal, language)}</strong>
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
              {copy.continue}
            </button>
          </div>
        </section>
      ) : null}

      {step === 1 ? (
        <section className={classes.Panel}>
          <h2>{copy.headings.shipping}</h2>
          {language === 'en' ? (
            <div className={classes.InfoBox}>
              <h3>{copy.deliveryNoticeHeading}</h3>
              <p>{copy.deliveryNoticeBody}</p>
            </div>
          ) : null}
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
                  {option.price > 0
                    ? formatCurrency(option.price, language)
                    : copy.freePrice}
                </span>
              </label>
            ))}
          </div>

          {addressVisible ? (
            <div className={classes.AddressGrid}>
              <label className={classes.Field}>
                <span>
                  {deliveryAddressVisible ? copy.deliveryAddress : copy.streetAddress}
                </span>
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
                <span>{copy.postcode}</span>
                <input
                  type="text"
                  name="postinumero"
                  value={addressFields.postalCode}
                  onChange={(event) =>
                    handleAddressFieldChange('postalCode', event.target.value)
                  }
                  required={addressVisible}
                  autoComplete="postal-code"
                  inputMode="numeric"
                  pattern="[0-9]{5}"
                  maxLength="5"
                />
              </label>
              <label className={classes.Field}>
                <span>{copy.city}</span>
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
              <div className={classes.Field}>
                <span>{copy.country}</span>
                {language === 'en' ? (
                  <select
                    className={classes.ReadOnlySelect}
                    aria-label={copy.country}
                    defaultValue="FI"
                    disabled
                  >
                    <option value="FI">{copy.countryValue}</option>
                  </select>
                ) : (
                  <strong>{copy.countryValue}</strong>
                )}
              </div>
            </div>
          ) : null}

          {hasInvalidPostcode ? (
            <p className={`${classes.HelperText} ${classes.Alert}`} role="alert">
              {copy.postcodeInvalid}
            </p>
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
                    ? copy.searchingPickupPoints
                    : copy.searchPickupPoints}
                </button>
              </div>
              {pickupPointError ? (
                <p className={classes.HelperText} role="status">
                  {pickupPointError}
                </p>
              ) : null}
              {pickupPoints.length > 0 ? (
                <label className={classes.Field}>
                  <span>{copy.selectPickupPoint}</span>
                  <select
                    name="pickup_point_selection"
                    className={classes.PickupPointSelect}
                    value={selectedPickupPointId}
                    onChange={(event) => handlePickupPointSelection(event.target.value)}
                  >
                    <option value="">{copy.pickupPointPlaceholder}</option>
                    {pickupPoints.map((point) => (
                      <option key={point.id} value={point.id}>
                        {formatPickupPointOptionLabel(point, language, copy)}
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
                {formatDate(estimatedShippingDate, language, 'numeric')}.{' '}
                {copy.estimatedDateSuffix}
              </p>
            </div>
          ) : null}

          <div className={classes.Actions}>
            <button
              type="button"
              className={classes.SecondaryButton}
              onClick={() => setStep(0)}
            >
              {copy.back}
            </button>
            <button
              type="button"
              className={classes.Button}
              onClick={handleShippingContinue}
              disabled={!addressFieldsReady}
            >
              {copy.continue}
            </button>
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className={classes.Panel}>
          <h2>{copy.headings.payment}</h2>
          <div className={classes.InfoBox}>
            <p>{copy.paymentGeneral}</p>
            {language === 'en' ? (
              <p>
                {fulfillmentType === 'local_pickup'
                  ? copy.invoiceTimingLocal
                  : copy.invoiceTimingPostal}
              </p>
            ) : null}
          </div>
          <label className={classes.CheckRow}>
            <input
              type="checkbox"
              checked={paymentAcknowledged}
              onChange={(event) => {
                setPaymentAcknowledged(event.target.checked);
                if (event.target.checked) {
                  trackCheckoutStep('checkout_payment_acknowledged');
                }
              }}
            />
            <span>{copy.paymentAcknowledgement}</span>
          </label>
          <div className={classes.Actions}>
            <button
              type="button"
              className={classes.SecondaryButton}
              onClick={() => setStep(1)}
            >
              {copy.back}
            </button>
            <button
              type="button"
              className={classes.Button}
              onClick={() => setStep(3)}
              disabled={!paymentAcknowledged}
            >
              {copy.continue}
            </button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className={classes.Panel}>
          <h2>{copy.headings.contact}</h2>
          <div className={classes.Fields}>
            <label className={classes.Field}>
              <span>{copy.fields.name}</span>
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
              <span>{copy.fields.email}</span>
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
              <span>{copy.fields.phone}</span>
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
              <span>{copy.fields.message}</span>
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
              {copy.back}
            </button>
            <button
              type="button"
              className={classes.Button}
              onClick={() => setStep(4)}
              disabled={!customerFieldsReady}
            >
              {copy.continue}
            </button>
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className={classes.Panel}>
          <h2>{copy.headings.summary}</h2>
          <ul className={classes.LineList}>
            {(quote?.items ?? []).map((line) => (
              <li key={line.sku} className={classes.LineItem}>
                <span>
                  {line.packageQuantity} x {line.label}
                </span>
                <strong>{formatCurrency(line.itemTotal, language)}</strong>
              </li>
            ))}
            <li className={classes.LineItem}>
              <span>{quote?.shippingOption.label}</span>
              <strong>{formatCurrency(quote?.shippingPrice ?? 0, language)}</strong>
            </li>
          </ul>
          <div className={classes.SummaryTotal}>
            <span>{copy.total}</span>
            <strong>{formatCurrency(quote?.total ?? 0, language)}</strong>
          </div>
          <p className={classes.HelperText}>
            {copy.termsPrefix}{' '}
            <SafeLink href={getRoutePath('orderTerms', language)}>
              {copy.termsLink}
            </SafeLink>{' '}
            {copy.termsJoiner}{' '}
            <SafeLink href={getRoutePath('privacy', language)}>
              {copy.privacyLink}
            </SafeLink>
            .
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
              {copy.back}
            </button>
            <button
              type="submit"
              className={classes.Button}
              disabled={isSubmitting || Boolean(quoteResult.error)}
            >
              {isSubmitting ? copy.submitting : copy.submit}
            </button>
          </div>
        </section>
      ) : null}
    </form>
  );
}
