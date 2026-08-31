export const transactionMessages = Object.freeze({
  checkout: Object.freeze({
    steps: Object.freeze(['Cart', 'Delivery', 'Details', 'Payment', 'Confirmation']),
    pickupPointTypes: Object.freeze({
      parcelLocker: 'Parcel locker',
      servicePoint: 'Posti service point',
    }),
    quantityUpdateFailed: 'The quantity could not be updated.',
    addressRequired: 'Enter the address, postcode and city before searching.',
    postcodeInvalid: 'Enter a five-digit Finnish postcode.',
    pickupSearchFailed: 'The pickup-point search failed. Please try again.',
    pickupSearchEmpty:
      'No pickup points were found. Try another postcode or a more precise address.',
    submitFailed: 'The order could not be placed.',
    loadingCart: 'Loading the shopping cart...',
    successMessage:
      'Thank you for your order! Your order has been received. You will receive a personal confirmation by email within 1–2 working days.',
    emptyMessage: 'The shopping cart is empty.',
    successCancellation:
      'If you want to cancel for a reason other than a product defect, you can use the',
    cancellationLink: 'cancellation notice form',
    successFollowUpLabel: 'Getting started with compost worms',
    emptyFollowUpLabel: 'View products',
    headings: Object.freeze({
      cart: 'Shopping cart',
      shipping: 'Delivery method',
      payment: 'Payment',
      contact: 'Contact details',
      summary: 'Order summary',
    }),
    unitPrice: ({ price }) => `${price} € each`,
    quantity: 'Quantity',
    fixedQuantity: 'Quantity 1',
    addOns: 'Add-ons',
    remove: 'Remove',
    productsSubtotal: 'Products',
    discountCode: 'Discount code',
    discountCodePlaceholder: '6 letters',
    applyDiscountCode: 'Apply code',
    removeDiscountCode: 'Remove code',
    discountCodeRequired: 'Enter a discount code.',
    discountInvalid: 'The discount code is not valid.',
    discountNotApplicable:
      'The discount code does not apply to the products in your cart.',
    discountNeedsApply:
      'Apply the discount code you entered or remove it before continuing.',
    discountCheckFailed: 'The discount code could not be checked.',
    discountApplied: 'The discount code has been applied.',
    discountSummary: ({ type, value }) =>
      type === 'percentage'
        ? `Discount (${value}%)`
        : type === 'free_shipping'
          ? 'Delivery discount'
          : 'Discount',
    continue: 'Continue',
    back: 'Back',
    deliveryAddress: 'Delivery address',
    streetAddress: 'Street address',
    postcode: 'Postcode',
    city: 'City',
    country: 'Country',
    countryValue: 'Finland',
    freePrice: '0 €',
    searchingPickupPoints: 'Searching Posti pickup points...',
    searchPickupPoints: 'Search Posti pickup points',
    selectPickupPoint: 'Select a Posti pickup point',
    pickupPointPlaceholder: 'Select a pickup point from the list',
    estimatedPickupDate: 'Estimated pickup-ready date',
    estimatedDispatchDate: 'Estimated dispatch date',
    estimatedDateSuffix:
      'The actual dispatch or pickup date will be confirmed in the order confirmation.',
    paymentChoiceLegend: 'Choose a payment method',
    stripePaymentLabel: 'Pay now with MobilePay or a card',
    stripePaymentDetail:
      'Payment takes place on Stripe’s secure hosted page. Apple Pay or Google Pay may appear on a supported device.',
    invoicePaymentLabel: 'Pay by email invoice after dispatch or collection',
    invoiceTimingPostal: 'I send the invoice by email after handing your order to Posti.',
    invoiceTimingLocal: 'I send the invoice by email after you collect your order.',
    fields: Object.freeze({
      name: 'Name',
      email: 'Email address',
      phone: 'Phone number',
      message: 'Message (optional)',
    }),
    total: 'Total',
    termsPrefix: 'By placing the order, you confirm that you have read the',
    termsLink: 'order and delivery terms',
    privacyLink: 'privacy notice',
    termsJoiner: 'and the',
    submitting: 'Placing order...',
    redirectingToStripe: 'Continuing to payment...',
    submitInvoice: 'Place order',
    submitStripe: 'Continue to payment',
    stripeUnavailable:
      'The payment page could not be opened. Your cart has been kept. Please try again shortly.',
    paymentOutcomes: Object.freeze({
      orderNumber: 'Order number',
      refresh: 'Check payment status again',
      checkingHeading: 'Checking your payment',
      checkingBody: 'Please wait while the payment is confirmed securely.',
      pendingHeading: 'Your payment is being confirmed',
      pendingBody:
        'Payment may have succeeded, but confirmation has not arrived yet. Do not pay for the order again.',
      unavailableHeading: 'Payment status is temporarily unavailable',
      unavailableBody:
        'Payment may have succeeded. Your cart has been kept. Wait and check again before attempting another payment.',
      cancelledHeading: 'You returned from the payment page',
      cancelledBody:
        'The order has not been marked paid. Your order details were restored for this browser session. Check the summary and continue with the same Stripe payment or switch to an invoice.',
      expiredHeading: 'The payment page has expired',
      expiredBody:
        'Your cart has been kept. Select Stripe again to create a new payment page for the same order.',
      paidHeading: 'Payment received',
      paidBody:
        'Thank you for your order! Payment is confirmed. You will receive a personal order confirmation by email within 1–2 working days.',
      refundedHeading: 'Payment refunded',
      refundedBody:
        'The Stripe payment for this order has been returned to the original payment method.',
    }),
    deliveryNoticeHeading: 'Delivery within Finland only',
    deliveryNoticeBody:
      'I deliver to addresses and Posti pickup points in Finland. I do not ship abroad. Local pickup is available in Järvenpää.',
  }),
  cancellation: Object.freeze({
    requiredError: 'Enter your name and email address.',
    submitFailed: 'The cancellation notice could not be sent.',
    submitFailedRetry:
      'The cancellation notice could not be sent. Please try again in a moment.',
    successHeading: 'Cancellation notice received',
    successBody:
      'You will receive an automatic acknowledgement by email. I will contact you separately about return and payment arrangements, depending on the order’s status and contents. The notice does not trigger an automatic Stripe refund.',
    fields: Object.freeze({
      name: 'Name',
      email: 'Email address',
      phone: 'Phone number (optional)',
      orderReference: 'Order number (if known)',
      orderReferencePlaceholder: 'For example, LRM-...',
      contactMethod: 'Preferred contact method',
      contactEmail: 'Email',
      phoneCall: 'Phone call',
      textMessage: 'Text message',
      whatsapp: 'WhatsApp message',
      scope: 'This notice concerns',
      fullScope: 'The whole order',
      partialScope: 'Part of the order',
      orderDetails: 'Order details',
      orderDetailsHint:
        'Describe your order so that the notice can be matched to the correct order. If you entered the exact order number above, no other order details are required.',
    }),
    submitting: 'Sending...',
    submit: 'Send cancellation notice',
  }),
  dataRequest: Object.freeze({
    genericSuccess:
      'If the details you entered match an order, you will soon receive an email with a download link. Check your spam folder as well.',
    requiredError: 'Enter the order number and email address.',
    submitFailed: 'The request could not be sent. Please try again in a moment.',
    successHeading: 'Request received',
    orderNumber: 'Order number',
    orderNumberPlaceholder: 'For example, LRM-260410120000AB',
    email: 'Email address used for the order',
    submitting: 'Sending...',
    submit: 'Send download link',
  }),
  download: Object.freeze({
    defaultFilename: 'lieromaa-order-data.json',
    invalidLink: 'The download link is invalid, has already been used or has expired.',
    downloadFailed: 'Your data could not be downloaded.',
    checking: 'Checking the download link...',
    missingLink: 'The download link is missing or has already been used.',
    downloading: 'Downloading...',
    download: 'Download your data as a JSON file',
  }),
  review: Object.freeze({
    genericError: 'The review could not be sent. Please try again in a moment.',
    missingLinkAddress: 'The review link is missing from the address.',
    linkCheckFailed: 'The review link could not be checked.',
    missingLink: 'The review link is missing.',
    ratingRequired: 'Choose a star rating before sending the review.',
    productRequired: 'Select at least one product to review.',
    checking: 'Checking the review link...',
    heading: 'Leave a review',
    orderFallback: 'Your order',
    testSuccess:
      'The test review was sent successfully. It was not saved and the link can still be used.',
    success:
      'Thank you for your review! It was saved for moderation and will appear on the site after a spam check.',
    nextSteps: 'You can continue with:',
    gettingStarted: 'Getting started with compost worms',
    products: 'View products',
    ratingLegend: 'Star rating',
    starLabel: ({ value }) => `${value} out of 5 stars`,
    testMode: 'In test mode, the review is not saved and the link does not expire.',
    productLegend: 'Which products are you reviewing?',
    productHelp:
      'Select the products covered by your review. I will check your selection before publication.',
    writtenLabel: 'Written review (optional)',
    writtenPlaceholder: 'What was your experience of the product or delivery?',
    privacyHelp:
      'Do not enter identifying personal information such as your full name, address, email address or phone number. Use a first name or nickname as your display name.',
    privateLabel: 'Private feedback for Joonas (optional)',
    privatePlaceholder:
      'If something did not work as expected, you can describe it here. This field will not be published on the site.',
    displayNameLabel: 'Display name (optional)',
    displayNamePlaceholder: 'For example, Alex or a nickname',
    moderationHelp:
      'The review is saved for moderation first. It will not appear on the site until it has been approved manually.',
    submitting: 'Sending review...',
    submit: 'Send review',
    mismatchEn:
      'This review link was created for an order handled in Finnish. You can still submit the review on this page.',
  }),
  orderValidation: Object.freeze({
    validation: 'Check the form details and try again.',
    required_field: 'Complete all required fields before placing the order.',
    field_too_long: 'One of the form fields is too long.',
    invalid_email: 'Enter a valid email address.',
    cart_invalid: 'The shopping cart could not be read. Reload the page and try again.',
    cart_empty: 'The shopping cart is empty.',
    payment_acknowledgement_required:
      'Confirm the payment method before placing the order.',
    payment_provider_invalid: 'Choose a payment method before placing the order.',
    stripe_disabled: 'Stripe payment is not currently available.',
    stripe_unavailable:
      'Stripe payment could not be processed just now. Your cart has been kept.',
    duplicate_order_mismatch:
      'The cart or order details changed after the earlier payment attempt. Check the order and try again.',
    payment_provider_change_forbidden:
      'The payment method can no longer be changed for this order.',
    payment_status_not_found: 'The payment status could not be found.',
    pickup_point_invalid:
      'Search for the selected Posti pickup point again before sending the order.',
    too_fast: 'The form was submitted too quickly. Wait a moment and try again.',
    invalid_product:
      'The order product details could not be verified. Reload the page and try again.',
    product_unavailable:
      'The selected pack size is not currently available. Reload the page and try again.',
    invalid_shipping_method: 'The selected delivery method is not valid.',
    invalid_postcode: 'Enter a five-digit Finnish postcode.',
    invalid_country: 'The delivery country must be Finland.',
    invalid_language: 'The language is invalid.',
    cart_validation_failed:
      'The order product details could not be verified. Reload the page and try again.',
    unknown_product: 'The shopping cart contains an unknown product.',
    prepared_bin_requires_worms:
      'The ready-to-use worm bin can only be ordered with compost worms.',
    prepared_bin_limit:
      'Each worm package can have no more than one ready-to-use worm bin.',
    small_fibre_mix_requires_worms:
      'The 150 g compost fibre mix can only be ordered as an add-on to a worm package.',
    worm_package_limit: 'The order contains too many worm packages.',
    fibre_mix_limit: 'The order contains too many packs of compost fibre mix.',
    invalid_discount_code: 'The discount code is not valid.',
    discount_not_applicable:
      'The discount code does not apply to the products in your cart.',
  }),
});

export default transactionMessages;
