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

function PostiPickupHelp() {
  return (
    <>
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
  const defaultDelivery = shippingOptions[0]?.id ?? 'postitus';

  const [delivery, setDelivery] = useState(defaultDelivery);
  const [amount, setAmount] = useState(
    defaultVariant ? String(defaultVariant.amount) : ''
  );
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

  const currentVariant =
    variants.find((variant) => String(variant.amount) === amount) ?? defaultVariant;
  const currentSku = currentVariant?.sku ?? '';
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
    setFormStartedAt(String(Date.now()));
    setSubmissionId(globalThis.crypto?.randomUUID?.() || `${productKey}-${Date.now()}`);
  }, [productKey]);

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
              onChange={() => setDelivery(option.id)}
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

      {delivery === 'postitus' ? (
        <div className={classes.AddressGroup}>
          <label>
            Postiosoite
            <input type="text" name="osoite" required={delivery === 'postitus'} />
          </label>
          <label>
            Postinumero
            <input type="text" name="postinumero" required={delivery === 'postitus'} />
          </label>
          <label>
            Postitoimipaikka
            <input type="text" name="toimipaikka" required={delivery === 'postitus'} />
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

      {orderConfig.shippingHelperTexts.length > 0 ? <PostiPickupHelp /> : null}

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
