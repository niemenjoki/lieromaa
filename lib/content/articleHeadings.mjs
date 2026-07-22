const ATX_HEADING_PATTERN = /^(#{2,3})[\t ]+(.+?)[\t ]*$/u;
const FENCE_PATTERN = /^[\t ]{0,3}(`{3,}|~{3,})/u;

const NAMED_ENTITIES = Object.freeze({
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  quot: '"',
});

function decodeEntity(match, entity) {
  const normalizedEntity = entity.toLowerCase();

  if (normalizedEntity in NAMED_ENTITIES) {
    return NAMED_ENTITIES[normalizedEntity];
  }

  const isHex = normalizedEntity.startsWith('#x');
  const isDecimal = normalizedEntity.startsWith('#');
  if (!isHex && !isDecimal) return match;

  const codePoint = Number.parseInt(
    normalizedEntity.slice(isHex ? 2 : 1),
    isHex ? 16 : 10
  );
  if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
    return match;
  }

  return String.fromCodePoint(codePoint);
}

function headingMarkdownToText(value) {
  return String(value ?? '')
    .replace(/!\[([^\]]*)\]\([^)]*\)/gu, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/gu, '$1')
    .replace(/<[^>]+>/gu, '')
    .replace(/`+([^`]+?)`+/gu, '$1')
    .replace(/[*_~]/gu, '')
    .replace(/\\([\\`*_[\]{}()#+\-.!>])/gu, '$1')
    .replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|quot);/giu, decodeEntity)
    .replace(/\s+/gu, ' ')
    .trim();
}

export function slugifyArticleHeading(value) {
  const slug = headingMarkdownToText(value)
    .normalize('NFKD')
    .replace(/\p{Mark}+/gu, '')
    .toLocaleLowerCase('fi-FI')
    .replace(/&/gu, ' ja ')
    .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
    .replace(/^-+|-+$/gu, '');

  return slug || 'osio';
}

export function extractArticleHeadings(source) {
  const headings = [];
  const idCounts = new Map();
  let activeFence = null;

  for (const line of String(source ?? '').split(/\r?\n/u)) {
    const fenceMatch = line.match(FENCE_PATTERN);

    if (activeFence) {
      if (
        fenceMatch &&
        fenceMatch[1][0] === activeFence.marker &&
        fenceMatch[1].length >= activeFence.length &&
        line.slice(fenceMatch[0].length).trim() === ''
      ) {
        activeFence = null;
      }
      continue;
    }

    if (fenceMatch) {
      activeFence = { marker: fenceMatch[1][0], length: fenceMatch[1].length };
      continue;
    }

    const headingMatch = line.match(ATX_HEADING_PATTERN);
    if (!headingMatch) continue;

    const level = headingMatch[1].length;
    const rawText = headingMatch[2].replace(/[\t ]+#+[\t ]*$/u, '').trim();
    const text = headingMarkdownToText(rawText) || 'Osio';
    const baseId = slugifyArticleHeading(text);
    const occurrence = (idCounts.get(baseId) ?? 0) + 1;
    idCounts.set(baseId, occurrence);

    headings.push({
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
      level,
      text,
    });
  }

  return headings;
}
