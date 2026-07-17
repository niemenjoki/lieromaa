'use client';

import { useEffect, useMemo, useState } from 'react';

import { useCart } from '@/components/Cart/CartProvider';
import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import { trackAnalyticsEvent } from '@/lib/analytics/events';
import { getProductMessages } from '@/lib/i18n/messages.mjs';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import {
  formatPrice,
  getAvailableProductVariants,
  getProductCartAddOns,
  getProductOrderConfig,
  getProductVariants,
} from '@/lib/pricing/catalog';
import { getProductCatalogEntry } from '@/lib/products/catalog.mjs';

import PreparedWormBinSelector from './PreparedWormBinSelector';
import classes from './ProductPage.module.css';

function getDefaultVariant(productKey, variants, language) {
  const orderConfig = getProductOrderConfig(productKey, language);
  const availableVariants = variants.filter((variant) => variant.isAvailable);

  return (
    availableVariants.find(
      (variant) => String(variant.amount) === String(orderConfig.defaultVariantAmount)
    ) ??
    availableVariants[0] ??
    null
  );
}

function formatVariantLabel(productKey, variant, language) {
  const orderConfig = getProductOrderConfig(productKey, language);
  return orderConfig.getVariantLabel({
    amount: variant.amount,
    priceFormatted: formatPrice(variant.price, language),
    variant,
  });
}

function formatRelatedVariantLabel(productKey, variant, language) {
  return formatVariantLabel(productKey, variant, language);
}

function RelatedProductSelector({
  productKey,
  variants,
  selectedSku,
  onChange,
  language,
  copy,
  productCopy,
}) {
  const product = getProductCatalogEntry(productKey);

  if (!variants.length) {
    return null;
  }

  return (
    <div className={classes.AddOnProduct}>
      <div className={classes.CheckOption}>
        {product.image ? (
          <SafeImage
            src={product.image.url}
            alt={productCopy.imageAlts[0]}
            width={72}
            height={54}
            sizes="72px"
            className={classes.AddOnImage}
          />
        ) : null}
        <span className={classes.OptionContent}>
          <span className={classes.OptionTitle}>{productCopy.productName}</span>
          <span className={classes.FinePrint}>{productCopy.productDescription}</span>
        </span>
      </div>

      <fieldset className={classes.FormFieldset}>
        <legend className={classes.ScreenReaderOnly}>
          {copy.relatedLegend({ productName: productCopy.productName })}
        </legend>
        <div className={classes.ChoiceList}>
          <label className={classes.FormOption}>
            <input
              type="radio"
              name={`related-${productKey}`}
              value=""
              checked={!selectedSku}
              onChange={() => onChange('')}
              className={classes.ChoiceInput}
            />
            <span className={classes.OptionHeader}>
              <span className={classes.OptionMarker} aria-hidden="true">
                {!selectedSku ? '[x]' : '[ ]'}
              </span>
              <span className={classes.OptionTitle}>{copy.noRelatedProduct}</span>
            </span>
          </label>

          {variants.map((variant) => (
            <label key={variant.sku} className={classes.FormOption}>
              <input
                type="radio"
                name={`related-${productKey}`}
                value={variant.sku}
                checked={selectedSku === variant.sku}
                onChange={() => onChange(variant.sku)}
                className={classes.ChoiceInput}
              />
              <span className={classes.OptionHeader}>
                <span className={classes.OptionMarker} aria-hidden="true">
                  {selectedSku === variant.sku ? '[x]' : '[ ]'}
                </span>
                <span className={classes.OptionTitle}>
                  {formatRelatedVariantLabel(productKey, variant, language)}
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function QuantityEditor({ quantity, onCommit, label }) {
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
    <label className={classes.QuantityField}>
      <span className={classes.FieldLabel}>{label}</span>
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
    </label>
  );
}

export default function AddToCartPanel({
  productKey,
  relatedProductKeys = [],
  language,
}) {
  const { addItems, items, removeItem, setItemQuantity } = useCart();
  const variants = getProductVariants(productKey);
  const visibleVariants = variants.filter((variant) => !variant.hideFromVariantSelector);
  const defaultVariant = getDefaultVariant(productKey, visibleVariants, language);
  const [selectedSku, setSelectedSku] = useState(defaultVariant?.sku ?? '');
  const [usesExpansionMode, setUsesExpansionMode] = useState(false);
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState({});
  const [selectedAddOnSku, setSelectedAddOnSku] = useState('');
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const [feedback, setFeedback] = useState('');
  const productMessages = getProductMessages(language);
  const copy = productMessages.addToCart;
  const productCopy = productMessages.catalog[productKey];
  const orderConfig = getProductOrderConfig(productKey, language);
  const productAddOns = getProductCartAddOns(productKey, language);
  const preparedWormBin = productAddOns[0] ?? null;
  const preparedWormBinInCart = preparedWormBin
    ? items.some((item) => item.sku === preparedWormBin.sku)
    : false;
  const isPreparedWormBinSelected = preparedWormBin
    ? selectedAddOnSku === preparedWormBin.sku || preparedWormBinInCart
    : false;
  const selectedVariant =
    variants.find((variant) => variant.sku === selectedSku) ?? defaultVariant;
  const selectedExpansionVariant =
    usesExpansionMode && selectedVariant?.expansionSku
      ? variants.find((variant) => variant.sku === selectedVariant.expansionSku)
      : null;
  const selectedOrderSku = selectedExpansionVariant?.sku ?? selectedSku;
  const selectedCartItem = items.find((item) => item.sku === selectedOrderSku) ?? null;

  const relatedProductGroups = useMemo(
    () =>
      relatedProductKeys
        .map((relatedProductKey) => {
          const relatedVariants = getAvailableProductVariants(relatedProductKey);

          return {
            productKey: relatedProductKey,
            variants: relatedVariants,
          };
        })
        .filter((entry) => entry.variants.length),
    [relatedProductKeys]
  );
  const showRelatedProducts = relatedProductGroups.length > 0;

  const handleAddToCart = () => {
    const nextItems = [];

    if (selectedOrderSku) {
      nextItems.push({ sku: selectedOrderSku, quantity: 1 });

      if (isPreparedWormBinSelected && !preparedWormBinInCart) {
        nextItems.push({ sku: preparedWormBin.sku, quantity: 1 });
      }

      for (const group of relatedProductGroups) {
        const selectedRelatedSku = selectedRelatedProducts[group.productKey];
        if (selectedRelatedSku) {
          nextItems.push({ sku: selectedRelatedSku, quantity: 1 });
        }
      }
    }

    const result = addItems(nextItems);
    setFeedback(
      result.ok
        ? nextItems.length === 1
          ? copy.addedOne
          : copy.addedMany
        : result.message || copy.addFailed
    );

    if (result.ok) {
      trackAnalyticsEvent('add_to_cart', {
        eventTarget: productKey,
        eventValue: nextItems.map((item) => item.sku).join(','),
        eventItems: nextItems,
      });
      setHasAddedToCart(true);
    }
  };

  const handleCartQuantityChange = (quantity) => {
    const result = setItemQuantity(selectedOrderSku, quantity);
    if (!result.ok) {
      setFeedback(result.message || copy.quantityFailed);
    }

    return result.ok;
  };

  return (
    <div className={classes.CartPanel}>
      <div className={classes.FormSectionHeader}>
        <h3 className={classes.FormSectionTitle}>{copy.heading}</h3>
        <p className={classes.FormSectionDescription}>{productCopy.productDescription}</p>
      </div>

      {visibleVariants.length > 1 ? (
        <fieldset className={classes.FormFieldset}>
          <legend className={classes.ScreenReaderOnly}>{copy.variantLegend}</legend>
          <div className={classes.ChoiceList}>
            {visibleVariants.map((variant) => {
              const isUnavailable = !variant.isAvailable;

              return (
                <label
                  key={variant.sku}
                  className={[
                    classes.FormOption,
                    isUnavailable ? classes.FormOptionDisabled : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-disabled={isUnavailable ? 'true' : undefined}
                >
                  <input
                    type="radio"
                    name={`${productKey}-variant`}
                    value={variant.sku}
                    checked={!isUnavailable && selectedSku === variant.sku}
                    onChange={() => setSelectedSku(variant.sku)}
                    className={classes.ChoiceInput}
                    disabled={isUnavailable}
                  />
                  <span className={classes.OptionContent}>
                    <span className={classes.OptionHeader}>
                      <span className={classes.OptionMarker} aria-hidden="true">
                        {isUnavailable
                          ? '[-]'
                          : selectedSku === variant.sku
                            ? '[x]'
                            : '[ ]'}
                      </span>
                      <span className={classes.OptionTitle}>
                        {formatVariantLabel(productKey, variant, language)}
                      </span>
                    </span>
                    {isUnavailable ? (
                      <span className={classes.AvailabilityStatus}>
                        {copy.unavailable}
                      </span>
                    ) : null}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : defaultVariant ? (
        <p className={classes.OrderSummaryBox}>
          <span className={classes.OptionTitle}>
            {formatVariantLabel(productKey, defaultVariant, language)}
          </span>
        </p>
      ) : (
        <p className={classes.HelperText}>{copy.notOrderable}</p>
      )}

      {orderConfig.expansionOption && selectedVariant?.expansionSku ? (
        <label className={classes.FormOption}>
          <input
            type="checkbox"
            checked={usesExpansionMode}
            onChange={(event) => setUsesExpansionMode(event.target.checked)}
            className={classes.ChoiceInput}
          />
          <span className={classes.OptionContent}>
            <span className={classes.OptionHeader}>
              <span className={classes.OptionMarker} aria-hidden="true">
                {usesExpansionMode ? '[x]' : '[ ]'}
              </span>
              <span className={classes.OptionTitle}>
                {orderConfig.expansionOption.checkboxLabel}
              </span>
            </span>
            <span className={classes.FinePrint}>
              {orderConfig.expansionOption.helperText}
            </span>
          </span>
        </label>
      ) : null}

      {selectedCartItem ? (
        <div className={classes.CartQuantityBox}>
          <QuantityEditor
            quantity={selectedCartItem.quantity}
            onCommit={handleCartQuantityChange}
            label={copy.quantityInCart}
          />
          <button
            type="button"
            className={classes.InlineDangerButton}
            onClick={() => removeItem(selectedOrderSku)}
          >
            {copy.remove}
          </button>
        </div>
      ) : null}

      {preparedWormBin ? (
        <PreparedWormBinSelector
          addOn={preparedWormBin}
          selected={isPreparedWormBinSelected}
          onChange={setSelectedAddOnSku}
          alreadyInCart={preparedWormBinInCart}
          language={language}
        />
      ) : null}

      {showRelatedProducts ? (
        <div className={classes.FormSubsection}>
          <h4 className={classes.FormSubsectionTitle}>{copy.relatedHeading}</h4>
          <p className={classes.HelperText}>{copy.relatedDescription}</p>
          {relatedProductGroups.map((group) => (
            <RelatedProductSelector
              key={group.productKey}
              productKey={group.productKey}
              variants={group.variants}
              selectedSku={selectedRelatedProducts[group.productKey] ?? ''}
              onChange={(sku) =>
                setSelectedRelatedProducts((current) => ({
                  ...current,
                  [group.productKey]: sku,
                }))
              }
              language={language}
              copy={copy}
              productCopy={productMessages.catalog[group.productKey]}
            />
          ))}
        </div>
      ) : null}

      {feedback ? (
        <p className={classes.HelperText} role="status">
          {feedback}
        </p>
      ) : null}

      {hasAddedToCart ? (
        <div className={classes.FormActions}>
          <SafeLink
            href={getRoutePath('checkout', language)}
            className={[classes.CartActionLink, classes.SubmitButton]
              .filter(Boolean)
              .join(' ')}
            data-analytics-cta="order"
          >
            {copy.goToCart}
          </SafeLink>
          <SafeLink
            href={getRoutePath('products', language)}
            className={[classes.CartActionLink, classes.SecondaryButton]
              .filter(Boolean)
              .join(' ')}
          >
            {copy.continueShopping}
          </SafeLink>
        </div>
      ) : (
        <button
          type="button"
          className={classes.SubmitButton}
          onClick={handleAddToCart}
          data-analytics-cta="order"
          disabled={!selectedSku}
        >
          {copy.addButton}
        </button>
      )}
    </div>
  );
}
