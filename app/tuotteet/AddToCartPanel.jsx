'use client';

import { useEffect, useMemo, useState } from 'react';

import { useCart } from '@/components/Cart/CartProvider';
import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import { trackAnalyticsEvent } from '@/lib/analytics/events';
import { formatCartLineLabel } from '@/lib/orders/cartOrder';
import {
  formatPrice,
  getAvailableProductVariants,
  getProductOrderConfig,
  getProductVariants,
} from '@/lib/pricing/catalog';
import { getProductCatalogEntry } from '@/lib/products/catalog.mjs';

import ProductAvailabilityNotice from './ProductAvailabilityNotice';
import classes from './ProductPage.module.css';

function getDefaultVariant(productKey, variants) {
  const orderConfig = getProductOrderConfig(productKey);
  const availableVariants = variants.filter((variant) => variant.isAvailable);

  return (
    availableVariants.find(
      (variant) => String(variant.amount) === String(orderConfig.defaultVariantAmount)
    ) ??
    availableVariants[0] ??
    null
  );
}

function formatVariantLabel(productKey, variant) {
  const product = getProductCatalogEntry(productKey);
  const label = formatCartLineLabel({ product, productKey, variant });
  return `${label} - ${formatPrice(variant.price)} €`;
}

function ProductOptionCheckbox({ productKey, checked, onChange }) {
  const product = getProductCatalogEntry(productKey);
  const variant = getAvailableProductVariants(productKey)[0] ?? null;

  if (!variant) {
    return null;
  }

  return (
    <label className={classes.CheckOption}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {product.image ? (
        <SafeImage
          src={product.image.url}
          alt=""
          width={72}
          height={54}
          sizes="72px"
          className={classes.AddOnImage}
        />
      ) : null}
      <span className={classes.OptionContent}>
        <span className={classes.OptionTitle}>
          {formatVariantLabel(productKey, variant)}
        </span>
        <span className={classes.FinePrint}>{product.productDescription}</span>
      </span>
    </label>
  );
}

function QuantityEditor({ quantity, onCommit }) {
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
      <span className={classes.FieldLabel}>Ostoskorissa</span>
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
  showWormSuggestion = false,
}) {
  const { addItems, items, removeItem, setItemQuantity } = useCart();
  const variants = getProductVariants(productKey);
  const defaultVariant = getDefaultVariant(productKey, variants);
  const [selectedSku, setSelectedSku] = useState(defaultVariant?.sku ?? '');
  const [selectedWormSku, setSelectedWormSku] = useState('');
  const [selectedRelatedProducts, setSelectedRelatedProducts] = useState({});
  const [hasAddedToCart, setHasAddedToCart] = useState(false);
  const [feedback, setFeedback] = useState('');
  const product = getProductCatalogEntry(productKey);
  const wormVariants = showWormSuggestion ? getProductVariants('worms') : [];
  const selectedCartItem = items.find((item) => item.sku === selectedSku) ?? null;

  const relatedEntries = useMemo(
    () =>
      relatedProductKeys
        .map((relatedProductKey) => ({
          productKey: relatedProductKey,
          variant: getAvailableProductVariants(relatedProductKey)[0] ?? null,
        }))
        .filter((entry) => entry.variant),
    [relatedProductKeys]
  );
  const showRelatedProducts = relatedEntries.length > 0;

  const handleAddToCart = () => {
    const nextItems = [];

    if (selectedSku) {
      nextItems.push({ sku: selectedSku, quantity: 1 });

      if (selectedWormSku) {
        nextItems.push({ sku: selectedWormSku, quantity: 1 });
      }

      for (const entry of relatedEntries) {
        if (selectedRelatedProducts[entry.productKey]) {
          nextItems.push({ sku: entry.variant.sku, quantity: 1 });
        }
      }
    }

    const result = addItems(nextItems);
    setFeedback(
      result.ok
        ? nextItems.length === 1
          ? 'Tuote lisättiin ostoskoriin.'
          : 'Tuotteet lisättiin ostoskoriin.'
        : result.message || 'Tuotteiden lisääminen epäonnistui.'
    );

    if (result.ok) {
      trackAnalyticsEvent('add_to_cart', {
        eventTarget: productKey,
        eventValue: nextItems.map((item) => item.sku).join(','),
      });
      setHasAddedToCart(true);
    }
  };

  const handleCartQuantityChange = (quantity) => {
    const result = setItemQuantity(selectedSku, quantity);
    if (!result.ok) {
      setFeedback(result.message || 'Määrän päivittäminen epäonnistui.');
    }

    return result.ok;
  };

  return (
    <div className={classes.CartPanel}>
      <div className={classes.FormSectionHeader}>
        <h3 className={classes.FormSectionTitle}>Lisää ostoskoriin</h3>
        <p className={classes.FormSectionDescription}>{product.productDescription}</p>
      </div>

      {variants.length > 1 ? (
        <fieldset className={classes.FormFieldset}>
          <legend className={classes.ScreenReaderOnly}>Valitse vaihtoehto</legend>
          <div className={classes.ChoiceList}>
            {variants.map((variant) => {
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
                        {formatVariantLabel(productKey, variant)}
                      </span>
                    </span>
                    {isUnavailable ? (
                      <span className={classes.AvailabilityStatus}>
                        Ei saatavilla juuri nyt.
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
            {formatVariantLabel(productKey, defaultVariant)}
          </span>
        </p>
      ) : (
        <p className={classes.HelperText}>Tuote ei ole tällä hetkellä tilattavissa.</p>
      )}

      {selectedCartItem ? (
        <div className={classes.CartQuantityBox}>
          <QuantityEditor
            quantity={selectedCartItem.quantity}
            onCommit={handleCartQuantityChange}
          />
          <button
            type="button"
            className={classes.InlineDangerButton}
            onClick={() => removeItem(selectedSku)}
          >
            Poista
          </button>
        </div>
      ) : null}

      {showWormSuggestion && wormVariants.length > 0 ? (
        <div className={classes.FormSubsection}>
          <h4 className={classes.FormSubsectionTitle}>Kompostimadot</h4>
          <p className={classes.HelperText}>
            Voit lisätä tilaukseen matopaketin tai ostaa pelkän aloituspakkauksen.
          </p>
          <ProductAvailabilityNotice
            productKey="worms"
            className={classes.HelperText}
            prefix="Matojen saatavuustiedote:"
            context="starterKitWormSelection"
          />
          <fieldset className={classes.FormFieldset}>
            <legend className={classes.ScreenReaderOnly}>Valitse matopaketti</legend>
            <div className={classes.ChoiceList}>
              <label className={classes.FormOption}>
                <input
                  type="radio"
                  name="starterkit-worms"
                  value=""
                  checked={!selectedWormSku}
                  onChange={() => setSelectedWormSku('')}
                  className={classes.ChoiceInput}
                />
                <span className={classes.OptionHeader}>
                  <span className={classes.OptionMarker} aria-hidden="true">
                    {!selectedWormSku ? '[x]' : '[ ]'}
                  </span>
                  <span className={classes.OptionTitle}>Ei matoja</span>
                </span>
              </label>
              {wormVariants.map((variant) => {
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
                      name="starterkit-worms"
                      value={variant.sku}
                      checked={!isUnavailable && selectedWormSku === variant.sku}
                      onChange={() => setSelectedWormSku(variant.sku)}
                      className={classes.ChoiceInput}
                      disabled={isUnavailable}
                    />
                    <span className={classes.OptionHeader}>
                      <span className={classes.OptionMarker} aria-hidden="true">
                        {isUnavailable
                          ? '[-]'
                          : selectedWormSku === variant.sku
                            ? '[x]'
                            : '[ ]'}
                      </span>
                      <span className={classes.OptionTitle}>
                        {formatVariantLabel('worms', variant)}
                      </span>
                    </span>
                    {isUnavailable ? (
                      <span className={classes.AvailabilityStatus}>
                        Ei saatavilla juuri nyt.
                      </span>
                    ) : null}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </div>
      ) : null}

      {showRelatedProducts ? (
        <div className={classes.FormSubsection}>
          <h4 className={classes.FormSubsectionTitle}>Lisätuotteet</h4>
          {relatedEntries.map((entry) => (
            <ProductOptionCheckbox
              key={entry.productKey}
              productKey={entry.productKey}
              checked={Boolean(selectedRelatedProducts[entry.productKey])}
              onChange={(checked) =>
                setSelectedRelatedProducts((current) => ({
                  ...current,
                  [entry.productKey]: checked,
                }))
              }
            />
          ))}
        </div>
      ) : null}

      {feedback ? (
        <p className={classes.HelperText} role="status">
          {feedback}{' '}
          {feedback.includes('lisättiin') && !hasAddedToCart ? (
            <SafeLink href="/tilaus">Siirry tarkistamaan tilaus</SafeLink>
          ) : null}
        </p>
      ) : null}

      {hasAddedToCart ? (
        <div className={classes.FormActions}>
          <SafeLink
            href="/tilaus"
            className={[classes.CartActionLink, classes.SubmitButton]
              .filter(Boolean)
              .join(' ')}
            data-analytics-cta="order"
          >
            Siirry ostoskoriin
          </SafeLink>
          <SafeLink
            href="/tuotteet"
            className={[classes.CartActionLink, classes.SecondaryButton]
              .filter(Boolean)
              .join(' ')}
          >
            Jatka ostoksia
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
          Lisää ostoskoriin
        </button>
      )}
    </div>
  );
}
