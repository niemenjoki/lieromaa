export const SUPPORTED_LANGUAGES = Object.freeze(['fi', 'en']);
export const DEFAULT_LANGUAGE = 'fi';

export const LANGUAGE_LOCALES = Object.freeze({
  fi: 'fi-FI',
  en: 'en-FI',
});

export const OPEN_GRAPH_LOCALES = Object.freeze({
  fi: 'fi_FI',
  en: 'en_FI',
});

export function assertLanguage(value) {
  if (!SUPPORTED_LANGUAGES.includes(value)) {
    throw new Error(`Unsupported language "${String(value)}".`);
  }

  return value;
}

export function normalizeLanguage(value, { defaultLanguage = DEFAULT_LANGUAGE } = {}) {
  if (value === undefined || value === null || value === '') {
    return assertLanguage(defaultLanguage);
  }

  const normalizedValue = String(value).trim().toLowerCase();
  return assertLanguage(normalizedValue);
}

export function getFormattingLocale(language) {
  return LANGUAGE_LOCALES[assertLanguage(language)];
}

export function getOpenGraphLocale(language) {
  return OPEN_GRAPH_LOCALES[assertLanguage(language)];
}
