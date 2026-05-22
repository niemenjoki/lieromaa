const PATH_STOP_WORDS = new Set([
  'blogi',
  'haku',
  'julkaisu',
  'opas',
  'page',
  'sivu',
  'tag',
  'tuote',
  'tuotteet',
]);

export function decodeSearchText(value = '') {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function normalizeSearchQuery(value = '') {
  return decodeSearchText(value)
    .toLocaleLowerCase('fi-FI')
    .replace(/https?:\/\/[^/\s]+/g, ' ')
    .replace(/[/?#&=+_.:;()[\]{}"'`|\\]+/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function createPathSearchQuery(pathname = '') {
  return normalizeSearchQuery(pathname)
    .split(' ')
    .filter((part) => part && !PATH_STOP_WORDS.has(part) && !/^\d+$/.test(part))
    .join(' ');
}

export function isProductLikeSearchQuery(query = '') {
  return /\b(aloituspakkaus|kuituseos|madot|osta|tilaa|tuote|tuotteet)\b/i.test(query);
}
