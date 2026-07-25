export const commerceMessages = Object.freeze({
  shippingSchedule: Object.freeze({
    mondayOnly:
      'Parcels containing live worms are dispatched only on Mondays so that the worms are not left in Posti’s network over a weekend.',
    worms: 'Order by Saturday for dispatch on the following Monday.',
    compostChow:
      'The compost fibre mix is dispatched on Mondays. Order by Saturday for dispatch on the following Monday.',
    preparedWormBin:
      'An order containing a ready-to-use worm bin is dispatched on the third Monday after the order is placed. This gives the bin approximately two extra weeks to settle compared with an ordinary worm order.',
  }),
  shippingOptions: Object.freeze({
    postiPickup: Object.freeze({
      label: 'Posti pickup point or parcel locker',
      helperTexts: Object.freeze([
        'The parcel is delivered to your selected Posti pickup point. Posti may redirect it to another pickup point if, for example, your selected location is full.',
      ]),
    }),
    postiHome: Object.freeze({
      label: 'Posti home delivery at an agreed time',
      helperTexts: Object.freeze([
        'Posti arranges the delivery time with you through the OmaPosti app, by text message or by email.',
      ]),
    }),
    localPickup: Object.freeze({
      label: 'Local pickup in Järvenpää',
      helperTexts: Object.freeze([
        'If you select local pickup, I will contact you to arrange the details.',
      ]),
    }),
  }),
  addOns: Object.freeze({
    preparedWormBin: Object.freeze({
      name: 'Ready-to-use 14-litre worm bin',
      label: 'Ready-to-use 14-litre worm bin',
      imageAlt: 'Open 14-litre worm bin with prepared moist worm bedding',
    }),
    smallCompostChow: Object.freeze({
      name: 'Lieromaa compost fibre mix',
      label: 'Compost fibre mix, 150 g',
      description: 'The small pack is only available as an add-on to a worm package.',
    }),
  }),
  order: Object.freeze({
    default: Object.freeze({
      variantLegend: 'Select quantity',
      submitButtonLabel: 'Place order',
    }),
    worms: Object.freeze({
      variantLegend: 'Select the worm weight',
      variantDescriptionPrefix: 'You can estimate a suitable starting amount',
      variantDescriptionLinkLabel: 'with the worm calculator',
      variantLabel({ weight, estimatedWormCount, priceFormatted }) {
        const estimateText = estimatedWormCount ? ` (~${estimatedWormCount} worms)` : '';
        return `${weight} g${estimateText} – ${priceFormatted} €`;
      },
      submitButtonLabel: 'Place order',
    }),
    compostChow: Object.freeze({
      variantLegend: 'Pack size',
      variantDescription: 'Choose the pack size that best suits your needs.',
      variantLabel({ weight, priceFormatted }) {
        return `${weight} g – ${priceFormatted} €`;
      },
      submitButtonLabel: 'Place order',
    }),
    invoiceTiming: Object.freeze({
      postal:
        'Lieromaa will send the invoice directly by email after the order has been handed to Posti. The payment term is 7 days.',
      localPickup:
        'Lieromaa will send the invoice directly by email after you have collected the order. The payment term is 7 days.',
    }),
  }),
  extraCharges: Object.freeze({
    frostProtection: Object.freeze({
      label: 'Frost-protection surcharge',
      checkboxLabel: 'Add the frost-protection surcharge',
      descriptionLines: Object.freeze([
        'When the outdoor temperature is below −5 °C, shipping worms requires extra packaging material to keep them alive. Frost conditions are assessed from the lowest forecast temperature at the departure location in Järvenpää and at the delivery address.',
      ]),
      helperTextLines: Object.freeze([
        'You may also order without the surcharge during freezing weather, in which case the parcel will be sent as soon as the weather becomes warmer.',
      ]),
    }),
  }),
  cart: Object.freeze({
    productNames: Object.freeze({
      worms: 'Compost worms (Eisenia fetida)',
      compostChow: 'Lieromaa compost fibre mix',
    }),
    wormLineLabel({ weight, estimatedWormCount }) {
      const estimateText = estimatedWormCount ? ` (~${estimatedWormCount} worms)` : '';
      return `${weight} g compost worms${estimateText}`;
    },
    errors: Object.freeze({
      unknown_product: ({ sku }) => `Unknown product "${sku}".`,
      product_unavailable: ({ sku }) => `Product "${sku}" is not currently available.`,
      prepared_bin_requires_worms: () =>
        'The ready-to-use worm bin can only be ordered with compost worms.',
      prepared_bin_limit: () =>
        'Each worm package can have no more than one ready-to-use worm bin.',
      small_fibre_mix_requires_worms: () =>
        'The 150 g compost fibre mix can only be ordered as an add-on to a worm package.',
      worm_package_limit: ({ limit }) =>
        `An order can contain no more than ${limit} worm packages.`,
      fibre_mix_limit: ({ limit }) =>
        `An order can contain no more than ${limit} packs of compost fibre mix.`,
      invalid_shipping_method: () => 'The selected delivery method is not valid.',
      cart_empty: () => 'The shopping cart is empty.',
      cart_update_failed: () => 'The shopping cart could not be updated.',
      cart_validation_failed: () =>
        'The order details could not be verified. Reload the page and try again.',
      order_quote_failed: () => 'The order total could not be calculated.',
    }),
  }),
});

export default commerceMessages;
