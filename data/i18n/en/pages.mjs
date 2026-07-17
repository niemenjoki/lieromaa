export const pageMessages = Object.freeze({
  moreInFinnish: Object.freeze({
    heading: 'More worm-composting content is available in Finnish',
    description:
      'Lieromaa has a larger guide library and blog that have not yet been translated. The English section contains the product information, calculator, checkout and customer-service pages needed to order in English.',
    guidesLabel: 'Worm-composting guides',
    blogLabel: 'Lieromaa blog',
    badge: 'In Finnish',
  }),
  wormCalculator: Object.freeze({
    title: 'Worm calculator',
    description:
      'Enter your household details to estimate how much food waste you produce and what starting weight of compost worms you may need.',
    whyHeading: 'Why is the calculator useful?',
    whyBody:
      'Choosing a suitable starting amount helps keep a worm bin balanced. Too few worms cannot process all the food waste straight away, while too many may not have enough food. The calculator gives a rough estimate of the worm weight needed for the amount of suitable food waste your household produces.',
    productPrompt: 'If you’re looking to buy compost worms, you can buy them',
    productLinkLabel: 'here',
    calculatorHeading: 'Calculator',
    calculatorIntro:
      'The estimate is based on household size, diet and the assumption that the number of worms doubles in about three months. The results are only a guide: the amount of suitable food waste and the worms’ feeding rate also depend on temperature, moisture and food quality.',
    formHeading: 'Enter your household details',
    formHelp:
      'The result updates automatically when you change the household size or diet.',
    fields: Object.freeze({
      adults: 'Adults',
      teens: 'Teenagers (13–17 years)',
      children: 'Children (4–12 years)',
      toddlers: 'Toddlers (1–3 years)',
      diet: 'Diet',
    }),
    diets: Object.freeze({
      omnivore: 'Omnivorous',
      plantForward: 'Plant-forward',
      vegetarian: 'Vegetarian',
      vegan: 'Vegan',
    }),
    resultsHeading: 'Results',
    emptyResult:
      'Enter the number of people in your household to see an estimate of weekly food waste and a suitable starting weight of worms.',
    scrapsResult({ min, max }) {
      return `Your household produces an estimated ${min}–${max} g of suitable food waste per week.`;
    },
    wormResultPrefix: 'Processing that amount requires approximately',
    wormResultUnit: 'g of worms',
    resultExplanation:
      'Buying the full recommended amount lets the worm bin work at the estimated capacity immediately. You can also start with fewer worms and allow their number to grow.',
    halfStart({ weight }) {
      return `With a starting weight of approximately ${weight} g, the worms should reach the estimated amount in about 3 months.`;
    },
    quarterStart({ weight }) {
      return `With a starting weight of approximately ${weight} g, the worms should reach the estimated amount in about 6 months.`;
    },
    eighthStart({ weight }) {
      return `As a minimum option, a starting weight of approximately ${weight} g should reach full estimated capacity in about a year.`;
    },
    finePrint:
      'The calculation assumes that one worm weighs about 0.5 g and processes about 1 g of food waste per week. The number of worms is assumed to double about every 3 months.',
    tipsHeading: 'How to interpret the result',
    tips: Object.freeze([
      'If you start with fewer worms, let their number grow gradually and avoid overfeeding.',
      'If you start with the full amount, make sure suitable food waste is available from the beginning.',
      'Growth and feeding rates vary with the conditions inside the worm bin.',
    ]),
    share: Object.freeze({
      heading: 'Share this page:',
      facebook: 'Share on Facebook',
      x: 'Share on X',
      whatsapp: 'Share on WhatsApp',
      linkedin: 'Share on LinkedIn',
    }),
    recommendationsHeading: 'Related reading',
  }),
});

export default pageMessages;
