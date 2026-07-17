import enCommerceMessages from '@/data/i18n/en/commerce.mjs';
import enCommonMessages from '@/data/i18n/en/common.mjs';
import enPageMessages from '@/data/i18n/en/pages.mjs';
import enProductMessages from '@/data/i18n/en/products.mjs';
import enTransactionMessages from '@/data/i18n/en/transactions.mjs';
import fiCommerceMessages from '@/data/i18n/fi/commerce.mjs';
import fiCommonMessages from '@/data/i18n/fi/common.mjs';
import fiPageMessages from '@/data/i18n/fi/pages.mjs';
import fiProductMessages from '@/data/i18n/fi/products.mjs';
import fiTransactionMessages from '@/data/i18n/fi/transactions.mjs';

import { assertLanguage } from './config.mjs';

const MESSAGE_BUNDLES = Object.freeze({
  fi: Object.freeze({
    common: fiCommonMessages,
    commerce: fiCommerceMessages,
    pages: fiPageMessages,
    products: fiProductMessages,
    transactions: fiTransactionMessages,
  }),
  en: Object.freeze({
    common: enCommonMessages,
    commerce: enCommerceMessages,
    pages: enPageMessages,
    products: enProductMessages,
    transactions: enTransactionMessages,
  }),
});

export function getMessages(language) {
  return MESSAGE_BUNDLES[assertLanguage(language)];
}

export function getMessage(language, path) {
  const pathParts = String(path || '')
    .split('.')
    .filter(Boolean);
  let value = getMessages(language);

  for (const pathPart of pathParts) {
    value = value?.[pathPart];
  }

  if (value === undefined) {
    throw new Error(`Missing ${language} message key "${String(path)}".`);
  }

  return value;
}

export function getCommonMessages(language) {
  return getMessages(language).common;
}

export function getCommerceMessages(language) {
  return getMessages(language).commerce;
}

export function getProductMessages(language) {
  return getMessages(language).products;
}

export function getTransactionMessages(language) {
  return getMessages(language).transactions;
}
