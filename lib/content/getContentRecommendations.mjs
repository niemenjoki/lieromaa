import { CONTENT_TYPES } from '../site/constants.mjs';
import { getAllContent } from './getAllContent.mjs';

const DEFAULT_MAX_RECOMMENDATIONS = 3;
const PINNED_SCORE = 1000;
const MIN_DIVERSE_RECOMMENDATION_SCORE = 12;

function normalizeText(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function normalizeList(values = []) {
  return Array.from(new Set(values.map((value) => normalizeText(value)).filter(Boolean)));
}

function stemToken(token) {
  return token
    .replace(/(iss[aä]|ist[aä]|ill[aä]|ilt[aä]|lle|ssa|sta|lla|ksi|kin|iin|in)$/u, '')
    .replace(/[^a-zåäö0-9]/giu, '');
}

function getContentTerms(content) {
  const values = [
    content.title,
    content.description,
    content.articleSection,
    content.category?.name,
    ...(content.keywords ?? []),
    ...(content.tags ?? []),
  ];

  return Array.from(
    new Set(
      values
        .join(' ')
        .toLowerCase()
        .split(/\s+/u)
        .map(stemToken)
        .filter((token) => token.length >= 5)
    )
  );
}

function slugifySegment(value) {
  return String(value ?? '').replaceAll(' ', '-');
}

function getContentDate(content) {
  return content.updatedAt ?? content.publishedAt ?? '';
}

function getContentHref(content) {
  if (content.type === CONTENT_TYPES.GUIDE) {
    return `/opas/${slugifySegment(content.category?.name)}/${content.slug}`;
  }

  return `/blogi/julkaisu/${content.slug}`;
}

function getContentTypeLabel(type) {
  if (type === CONTENT_TYPES.GUIDE) {
    return 'Opas';
  }

  return 'Blogi';
}

function getContentCtaLabel(type) {
  if (type === CONTENT_TYPES.GUIDE) {
    return 'Lue opas';
  }

  return 'Avaa julkaisu';
}

function getPinnedItems(recommendedContent) {
  if (!recommendedContent) {
    return [];
  }

  if (Array.isArray(recommendedContent)) {
    return recommendedContent;
  }

  return recommendedContent.pinned ?? [];
}

function getExcludedItems(recommendedContent) {
  if (!recommendedContent || Array.isArray(recommendedContent)) {
    return [];
  }

  return recommendedContent.exclude ?? [];
}

function getContentKey(content) {
  return `${content.type}:${content.slug}`;
}

function normalizeReference(reference) {
  if (!reference) {
    return null;
  }

  if (typeof reference === 'string') {
    return reference;
  }

  if (!reference.type || !reference.slug) {
    return null;
  }

  return `${reference.type}:${reference.slug}`;
}

function countCommonItems(left = [], right = []) {
  const rightSet = new Set(normalizeList(right));
  return normalizeList(left).filter((item) => rightSet.has(item)).length;
}

function getGuidePositionDistance(current, candidate) {
  const currentPosition = Number(current.category?.pagePosition);
  const candidatePosition = Number(candidate.category?.pagePosition);

  if (!Number.isFinite(currentPosition) || !Number.isFinite(candidatePosition)) {
    return null;
  }

  return Math.abs(currentPosition - candidatePosition);
}

export function scoreContentRecommendation({ current, candidate, pinned = false }) {
  if (
    !current ||
    !candidate ||
    (current.type === candidate.type && current.slug === candidate.slug)
  ) {
    return null;
  }

  const sharedKeywords = countCommonItems(current.keywords, candidate.keywords);
  const sharedTags = countCommonItems(current.tags, candidate.tags);
  const sharedTerms = countCommonItems(
    getContentTerms(current),
    getContentTerms(candidate)
  );
  let score = sharedKeywords * 8 + sharedTags * 10 + Math.min(sharedTerms, 5) * 2;
  const reasons = [];

  if (sharedKeywords >= 2 || sharedTags >= 1 || sharedTerms >= 3) {
    reasons.push('Samaa aihetta');
  }

  if (
    current.articleSection &&
    candidate.articleSection &&
    normalizeText(current.articleSection) === normalizeText(candidate.articleSection)
  ) {
    score += 6;
    reasons.push('Sama teema');
  }

  if (
    current.type === CONTENT_TYPES.GUIDE &&
    candidate.type === CONTENT_TYPES.GUIDE &&
    current.category?.name &&
    candidate.category?.name &&
    normalizeText(current.category.name) === normalizeText(candidate.category.name)
  ) {
    score += 12;
    const pageDistance = getGuidePositionDistance(current, candidate);

    if (pageDistance !== null) {
      score += Math.max(0, 8 - pageDistance * 2);
      reasons.push(pageDistance <= 1 ? 'Seuraava käytännön vaihe' : 'Samasta oppaasta');
    } else {
      reasons.push('Samasta oppaasta');
    }
  }

  if (current.type && candidate.type && current.type !== candidate.type) {
    score += 3;
    reasons.push(
      candidate.type === CONTENT_TYPES.GUIDE ? 'Käytännön opas' : 'Taustalukemista'
    );
  }

  if (pinned) {
    score += PINNED_SCORE;
    reasons.unshift('Suositeltu jatkolukeminen');
  }

  const timestamp = Date.parse(getContentDate(candidate));
  if (Number.isFinite(timestamp)) {
    score += timestamp / 100000000000000;
  }

  return {
    ...candidate,
    ctaLabel: getContentCtaLabel(candidate.type),
    href: getContentHref(candidate),
    recommendationReason: reasons[0] ?? 'Jatka lukemista',
    recommendationScore: score,
    typeLabel: getContentTypeLabel(candidate.type),
  };
}

function getRecommendationPool() {
  const posts = getAllContent({ type: CONTENT_TYPES.POST }).map((content) => ({
    ...content,
    type: CONTENT_TYPES.POST,
  }));
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE }).map((content) => ({
    ...content,
    type: CONTENT_TYPES.GUIDE,
  }));

  return [...posts, ...guides];
}

function diversifyRecommendations({ current, recommendations, maxRecommendations }) {
  const selected = recommendations.slice(0, maxRecommendations);

  if (
    ![CONTENT_TYPES.POST, CONTENT_TYPES.GUIDE].includes(current.type) ||
    selected.some((recommendation) => recommendation.type !== current.type)
  ) {
    return selected;
  }

  const crossTypeRecommendation = recommendations.find(
    (recommendation) =>
      recommendation.type !== current.type &&
      recommendation.recommendationScore >= MIN_DIVERSE_RECOMMENDATION_SCORE
  );

  if (!crossTypeRecommendation) {
    return selected;
  }

  const replacementIndex = selected.findLastIndex(
    (recommendation) => recommendation.recommendationScore < PINNED_SCORE
  );

  if (replacementIndex === -1) {
    return selected;
  }

  const diversified = [...selected];
  diversified.splice(replacementIndex, 1, crossTypeRecommendation);

  return diversified.sort(
    (left, right) => right.recommendationScore - left.recommendationScore
  );
}

export function getContentRecommendations({
  current,
  maxRecommendations = DEFAULT_MAX_RECOMMENDATIONS,
}) {
  if (!current) {
    return [];
  }

  const normalizedCurrent = {
    ...current,
    keywords: normalizeList(current.keywords),
    tags: normalizeList(current.tags),
  };
  const pinnedKeys = new Set(
    getPinnedItems(current.recommendedContent).map(normalizeReference).filter(Boolean)
  );
  const excludedKeys = new Set(
    getExcludedItems(current.recommendedContent).map(normalizeReference).filter(Boolean)
  );
  excludedKeys.add(getContentKey(normalizedCurrent));

  const scoredRecommendations = getRecommendationPool()
    .filter((candidate) => !excludedKeys.has(getContentKey(candidate)))
    .map((candidate) =>
      scoreContentRecommendation({
        current: normalizedCurrent,
        candidate,
        pinned: pinnedKeys.has(getContentKey(candidate)),
      })
    )
    .filter(Boolean)
    .sort((left, right) => right.recommendationScore - left.recommendationScore);

  return diversifyRecommendations({
    current: normalizedCurrent,
    recommendations: scoredRecommendations,
    maxRecommendations,
  });
}
