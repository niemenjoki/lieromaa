import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { HOT_COMPOSTING_GUIDE_SLUGS } from '@/lib/content/hotCompostingGuide.mjs';
import {
  getAllContent,
  getContentMetadata,
  getContentRecommendations,
  scoreContentRecommendation,
} from '@/lib/content/index.mjs';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';

// The hot composting guides are curated in code, so their slugs are stable.
const CURRENT_GUIDE_SLUG = HOT_COMPOSTING_GUIDE_SLUGS.at(-1);

describe('content recommendations', () => {
  test('guide recommendations exclude the current guide and include useful cross-type reading', () => {
    const guide = getContentMetadata({
      type: CONTENT_TYPES.GUIDE,
      slug: CURRENT_GUIDE_SLUG,
    });

    const recommendations = getContentRecommendations({
      current: {
        ...guide,
        type: CONTENT_TYPES.GUIDE,
      },
    });

    assert.equal(recommendations.length, 3);
    assert.equal(
      recommendations.some(
        (recommendation) =>
          recommendation.type === CONTENT_TYPES.GUIDE &&
          recommendation.slug === CURRENT_GUIDE_SLUG
      ),
      false
    );
    assert.equal(
      recommendations.some(
        (recommendation) => recommendation.type === CONTENT_TYPES.POST
      ),
      true
    );
  });

  test('metadata-pinned recommendations are placed before automatic matches', () => {
    const guide = getContentMetadata({
      type: CONTENT_TYPES.GUIDE,
      slug: CURRENT_GUIDE_SLUG,
    });

    const pinnedPost = getAllContent({ type: CONTENT_TYPES.POST }).at(-1);
    assert.ok(pinnedPost, 'at least one blog post should be published');

    const recommendations = getContentRecommendations({
      current: {
        ...guide,
        type: CONTENT_TYPES.GUIDE,
        recommendedContent: {
          pinned: [{ type: CONTENT_TYPES.POST, slug: pinnedPost.slug }],
        },
      },
    });

    assert.equal(recommendations[0].slug, pinnedPost.slug);
    assert.equal(recommendations[0].recommendationReason, 'Suositeltu jatkolukeminen');
  });

  test('guide category proximity increases score for adjacent guide pages', () => {
    const adjacentGuide = scoreContentRecommendation({
      current: {
        type: CONTENT_TYPES.GUIDE,
        slug: 'current',
        keywords: ['matokompostointi'],
        category: {
          name: 'kompostorin perustaminen',
          pagePosition: 4,
        },
      },
      candidate: {
        type: CONTENT_TYPES.GUIDE,
        slug: 'adjacent',
        title: 'Adjacent guide',
        description: 'Adjacent guide',
        keywords: ['matokompostointi'],
        category: {
          name: 'kompostorin perustaminen',
          pagePosition: 5,
        },
      },
    });
    const distantGuide = scoreContentRecommendation({
      current: {
        type: CONTENT_TYPES.GUIDE,
        slug: 'current',
        keywords: ['matokompostointi'],
        category: {
          name: 'kompostorin perustaminen',
          pagePosition: 4,
        },
      },
      candidate: {
        type: CONTENT_TYPES.GUIDE,
        slug: 'distant',
        title: 'Distant guide',
        description: 'Distant guide',
        keywords: ['matokompostointi'],
        category: {
          name: 'kompostorin perustaminen',
          pagePosition: 10,
        },
      },
    });

    assert.ok(adjacentGuide.recommendationScore > distantGuide.recommendationScore);
  });

  test('hot composting pages recommend the other guides in the curated cluster', () => {
    const guide = getContentMetadata({
      type: CONTENT_TYPES.GUIDE,
      slug: HOT_COMPOSTING_GUIDE_SLUGS[0],
    });
    const recommendations = getContentRecommendations({
      current: {
        ...guide,
        type: CONTENT_TYPES.GUIDE,
        recommendedContent: {
          pinned: HOT_COMPOSTING_GUIDE_SLUGS.filter((slug) => slug !== guide.slug).map(
            (slug) => ({ type: CONTENT_TYPES.GUIDE, slug })
          ),
        },
      },
      maxRecommendations: HOT_COMPOSTING_GUIDE_SLUGS.length - 1,
    });

    assert.deepEqual(
      recommendations.map(({ type, slug }) => `${type}:${slug}`).sort(),
      HOT_COMPOSTING_GUIDE_SLUGS.filter((slug) => slug !== guide.slug)
        .map((slug) => `${CONTENT_TYPES.GUIDE}:${slug}`)
        .sort()
    );
  });
});
