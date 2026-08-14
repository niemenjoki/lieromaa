import wormHuntConfigSource from '../../data/operations/commerce/wormHunt.json' with { type: 'json' };
import {
  normalizeDiscountCode,
  obfuscateDiscountCode,
} from '../discounts/discountCode.mjs';

export const WORM_HUNT_LENGTH = 6;
export const WORM_HUNT_DISCOUNT_ID = 'checkout-worm-reward-15';
export const WORM_HUNT_DISCOUNT_ENDS_ON = '2099-12-31';
export const WORM_HUNT_DISCOUNT_SKUS = Object.freeze([
  'worms-25',
  'worms-50',
  'worms-75',
  'worms-100',
]);

function assert(condition, message) {
  if (!condition) {
    throw new Error(`Invalid worm hunt configuration: ${message}`);
  }
}

function normalizeWormHuntCode(value) {
  return normalizeDiscountCode(value).normalize('NFC');
}

export function createWormHuntConfig(source) {
  assert(
    source && typeof source === 'object' && !Array.isArray(source),
    'must be an object'
  );
  assert(typeof source.enabled === 'boolean', 'enabled must be true or false');
  assert(
    typeof source.code === 'string' && !/\s/u.test(source.code),
    'code must be a string without spaces'
  );

  const code = normalizeWormHuntCode(source.code);
  const letters = [...code];
  assert(
    letters.length === WORM_HUNT_LENGTH &&
      letters.every((letter) => /^\p{L}$/u.test(letter)),
    `code must contain exactly ${WORM_HUNT_LENGTH} letters without spaces`
  );

  const discountPercentage = source.discountPercentage;
  assert(
    typeof discountPercentage === 'number' &&
      Number.isFinite(discountPercentage) &&
      discountPercentage > 0 &&
      discountPercentage <= 100,
    'discountPercentage must be a number greater than 0 and no greater than 100'
  );

  return Object.freeze({
    enabled: source.enabled,
    code,
    letters: Object.freeze(letters),
    discountPercentage,
  });
}

export function createWormHuntDiscount(config = wormHuntConfig) {
  if (!config.enabled) {
    return null;
  }

  return {
    id: WORM_HUNT_DISCOUNT_ID,
    appliesToSkus: [...WORM_HUNT_DISCOUNT_SKUS],
    type: 'percentage',
    value: config.discountPercentage,
    endsOn: WORM_HUNT_DISCOUNT_ENDS_ON,
    obfuscatedCode: obfuscateDiscountCode(config.code),
  };
}

export function isWormHuntDiscountId(value) {
  return value === WORM_HUNT_DISCOUNT_ID;
}

export const wormHuntConfig = createWormHuntConfig(wormHuntConfigSource);
