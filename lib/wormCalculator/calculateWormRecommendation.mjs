const BASE_WEEKLY_WASTE_GRAMS = Object.freeze({
  adult: 250,
  teen: 300,
  child: 200,
  toddler: 120,
});

const DIET_FACTORS = Object.freeze({
  sekaruoka: 1,
  kasvispainotteinen: 1.1,
  kasvis: 1.2,
  vegaani: 1.3,
});

export function normalizePersonCount(value) {
  const parsedValue = Number.parseInt(String(value ?? ''), 10);
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : 0;
}

export function calculateWormRecommendation({ adults, teens, children, toddlers, diet }) {
  const counts = {
    adults: normalizePersonCount(adults),
    teens: normalizePersonCount(teens),
    children: normalizePersonCount(children),
    toddlers: normalizePersonCount(toddlers),
  };
  const householdSize = Object.values(counts).reduce((sum, count) => sum + count, 0);

  if (householdSize <= 0) {
    return null;
  }

  const factor = DIET_FACTORS[diet] ?? DIET_FACTORS.sekaruoka;
  const weeklyWasteGrams = Math.round(
    (counts.adults * BASE_WEEKLY_WASTE_GRAMS.adult +
      counts.teens * BASE_WEEKLY_WASTE_GRAMS.teen +
      counts.children * BASE_WEEKLY_WASTE_GRAMS.child +
      counts.toddlers * BASE_WEEKLY_WASTE_GRAMS.toddler) *
      factor
  );
  const wormsNeeded = weeklyWasteGrams;

  return {
    scraps: [Math.round(weeklyWasteGrams * 0.8), Math.round(weeklyWasteGrams * 1.2)],
    wormsNeeded,
    wormWeightGrams: Math.round(wormsNeeded * 0.5),
    options: {
      halfStart: Math.round(wormsNeeded / 2),
      halfStartWeightGrams: Math.round(Math.round(wormsNeeded / 2) * 0.5),
      quarterStart: Math.round(wormsNeeded / 4),
      quarterStartWeightGrams: Math.round(Math.round(wormsNeeded / 4) * 0.5),
      eighthStart: Math.round(wormsNeeded / 8),
      eighthStartWeightGrams: Math.round(Math.round(wormsNeeded / 8) * 0.5),
    },
  };
}

export { BASE_WEEKLY_WASTE_GRAMS, DIET_FACTORS };
