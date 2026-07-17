export const productMessages = Object.freeze({
  deliveryNotice: Object.freeze({
    heading: 'Delivery within Finland only',
    body: 'I deliver to addresses and Posti pickup points in Finland. I do not ship abroad. Local pickup is available in Järvenpää.',
  }),
  collection: Object.freeze({
    title: 'Products | Lieromaa',
    description:
      'Shop compost worms, a ready-to-use 14-litre worm bin and Lieromaa compost fibre mix for worm composting in Finland.',
    pageName: 'Products',
    h1: 'Lieromaa products',
    lead: 'Locally raised compost worms, a ready-to-use 14-litre worm bin and compost fibre mix to help keep a worm bin balanced.',
    unavailable: 'Temporarily unavailable',
  }),
  catalog: Object.freeze({
    worms: Object.freeze({
      pageName: 'Compost worms for worm composting in Finland',
      title: 'Buy compost worms in Finland | Lieromaa',
      description:
        'Order locally raised compost worms in Finland. Choose worms for your own bin or a ready-to-use 14-litre worm bin.',
      pageDescription:
        'Order compost worms (Eisenia fetida, commonly called red wigglers) for delivery within Finland or local pickup in Järvenpää.',
      h1: 'Buy Lieromaa compost worms (Eisenia fetida)',
      productName: 'Compost worms (Eisenia fetida)',
      productDescription:
        'Locally raised compost worms for worm composting, available in 25 g, 50 g, 75 g and 100 g packs.',
      imageAlts: Object.freeze([
        'Compost worms and active worm-bin material held in a hand',
        'Compost worms in their transport packaging',
      ]),
      schema: Object.freeze({
        material: 'Active worm-bin material, shredded cardboard, wood fibre and coir',
        returnPolicyName: 'Cancellation rights',
        returnPolicyText:
          'Dispatched worm orders cannot be cancelled because returned live compost worms cannot be handled or resold as ordinary products. I will handle any problems with the product or delivery separately through customer service.',
      }),
    }),
    compostChow: Object.freeze({
      pageName: 'Lieromaa compost fibre mix',
      title: 'Compost fibre mix | Lieromaa',
      description:
        'Lieromaa compost fibre mix is an easy-to-use supplement for balancing a worm bin when the amount of food waste varies.',
      pageDescription:
        'An easy-to-use compost fibre mix for balancing a worm bin and temporarily supplementing its food.',
      h1: 'Lieromaa compost fibre mix',
      productName: 'Lieromaa compost fibre mix',
      productDescription:
        'An easy-to-use supplement that helps support a worm bin when the amount of food waste varies.',
      imageAlts: Object.freeze([
        'A pack of Lieromaa compost fibre mix on a light background',
        'Adding compost fibre mix to a worm bin with a spoon',
        'Lieromaa compost fibre mix with a measuring spoon',
      ]),
      schema: Object.freeze({
        material:
          'Wheat bran, oat bran, soya meal, wheat flour, garden lime, zeolite and basalt',
        returnPolicyName: 'Cancellation rights',
        returnPolicyText:
          'Unopened and unused compost fibre mix has a 14-day cancellation right under the order and delivery terms. I will handle any problems with the product or delivery separately through customer service.',
      }),
    }),
  }),
  addToCart: Object.freeze({
    relatedLegend: ({ productName }) => `Select the pack size for ${productName}`,
    noRelatedProduct: 'No compost fibre mix',
    quantityInCart: 'In the shopping cart',
    addedOne: 'The product was added to the shopping cart.',
    addedMany: 'The products were added to the shopping cart.',
    addFailed: 'The products could not be added.',
    quantityFailed: 'The quantity could not be updated.',
    heading: 'Add to shopping cart',
    variantLegend: 'Select an option',
    unavailable: 'Not currently available.',
    notOrderable: 'This product cannot currently be ordered.',
    remove: 'Remove',
    relatedHeading: 'Compost fibre mix',
    relatedDescription:
      'You can add compost fibre mix to help keep your worm bin balanced.',
    reviewOrder: 'Review your order',
    goToCart: 'Go to shopping cart',
    continueShopping: 'Continue shopping',
    addButton: 'Add to shopping cart',
  }),
  preparedBin: Object.freeze({
    heading: 'Choose how to start',
    description:
      'Order worms for your own worm bin or choose a ready-to-use 14-litre worm bin that has been prepared and started for you.',
    newBadge: 'New',
    shortTitle: 'Ready-to-use worm bin',
    infoLabel: 'More information about the ready-to-use worm bin',
    closeLabel: 'Close details',
    promise:
      'Order it, receive it and begin feeding – starting worm composting could hardly be easier.',
    intro:
      'You receive your selected amount of compost worms in a prepared 14-litre worm bin. No assembly, bedding preparation or separate setup is required.',
    sections: Object.freeze([
      Object.freeze({
        heading: 'What does the worm bin contain?',
        paragraphs: Object.freeze(['The worm bin includes:']),
        bullets: Object.freeze([
          'a 14-litre food-safe plastic box with ventilation holes',
          'your selected amount of compost worms',
          'worm bedding prepared to a suitable moisture level',
          'a small amount of well-functioning bedding from an active worm bin',
          'a small first feed',
        ]),
      }),
      Object.freeze({
        heading: 'How is the worm bin started?',
        paragraphs: Object.freeze([
          'I prepare the bedding to a suitable moisture level and mix in a small amount of bedding from an active worm bin. This introduces an established microbial community and helps decomposition begin sooner.',
          'I then add your selected worms and the first small portion of food. The bin remains active for about two weeks before dispatch so that the worms can settle and microbial activity can develop.',
        ]),
        bullets: Object.freeze([]),
      }),
      Object.freeze({
        heading: 'When the worm bin arrives',
        paragraphs: Object.freeze([
          'The worm bin is ready to use as it is. Put it in a suitable place and start feeding it gradually, increasing the amount as the number of worms and the bin’s processing capacity grow.',
          'You do not need to assemble the bin or moisten and prepare the bedding separately.',
        ]),
        bullets: Object.freeze([]),
      }),
      Object.freeze({
        heading: 'Dispatch time',
        paragraphs: Object.freeze([
          'A ready-to-use worm bin is dispatched on the third Monday after the order is placed.',
          'The preparation period of about two weeks allows the worms to settle and microbial activity to begin before transport.',
        ]),
        bullets: Object.freeze([]),
      }),
      Object.freeze({
        heading: 'What is the bin like?',
        paragraphs: Object.freeze([
          'The worm bin is a durable 14-litre food-safe plastic box measuring 40 × 30 × 19 cm externally. The required ventilation holes are prepared in advance, and the bin is suitable for small-scale indoor worm composting.',
        ]),
        bullets: Object.freeze([]),
      }),
    ]),
    legend: 'Choose how to start worm composting',
    wormsOnly: 'Worms only',
    optionTitle: 'Ready-to-use 14-litre worm bin',
    shippingDelay:
      'Preparation takes about two weeks. The ready-to-use worm bin is dispatched on the third Monday after the order is placed so that microbial activity can begin and the worms can settle before transport.',
    alreadyInCart:
      'The ready-to-use worm bin is already in your shopping cart. You can remove it in the cart.',
  }),
  availability: Object.freeze({
    limitedAndDelayed:
      'Due to high demand, larger worm packs are currently limited and dispatch is delayed. Smaller orders can still be placed as normal. Orders placed now will be dispatched on ',
    limited:
      'Due to high demand, larger worm packs are currently limited. Smaller orders can still be placed as normal.',
    delayed:
      'Dispatch is currently delayed due to high demand. Orders placed now will be dispatched on ',
  }),
  price: Object.freeze({
    unavailable: 'Not available',
    lowestPricePrefix: 'Lowest price in the previous 30 days:',
    offerValid: 'Offer valid until',
    offerUntil: '.',
  }),
  reviews: Object.freeze({
    heading: 'Customer reviews',
    verifiedCount: ({ count }) =>
      `${count} ${count === 1 ? 'review' : 'reviews'} from verified buyers`,
    distributionLabel: 'Rating distribution',
    starLabel: ({ value }) => `${value} ${value === 1 ? 'star' : 'stars'}`,
    hideWritten: 'Hide written reviews',
    showWritten: ({ count }) => `Show written reviews (${count})`,
    anonymous: 'Anonymous buyer',
    reviewStarLabel: ({ rating }) => `${rating} out of 5 stars`,
    finnishNotice: 'Reviews are shown in their original language.',
    finnishBadge: 'In Finnish',
    showMore: ({ count }) => `Show ${count} more reviews`,
    showRest: 'Show the remaining reviews',
    ratingOnly: ({ count }) =>
      `${count} ${count === 1 ? 'customer left' : 'customers left'} a star rating without a written review. These ratings are included in the average and distribution.`,
  }),
  imageSlider: Object.freeze({
    firstSlide: 'This is the first image',
    lastSlide: 'This is the last image',
    nextSlide: 'Next image',
    previousSlide: 'Previous image',
    paginationBullet: 'Go to image {{index}}',
  }),
});

export default productMessages;
