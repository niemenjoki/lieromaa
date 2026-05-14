import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import {
  getContentMetadata,
  getContentRecommendations,
  scoreContentRecommendation,
} from '@/lib/content/index.mjs';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';

describe('content recommendations', () => {
  test('guide recommendations exclude the current guide and include useful cross-type reading', () => {
    const guide = getContentMetadata({
      type: CONTENT_TYPES.GUIDE,
      slug: 'voiko-kompostimadot-laittaa-lampokompostoriin',
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
          recommendation.slug === 'voiko-kompostimadot-laittaa-lampokompostoriin'
      ),
      false
    );
    assert.equal(
      recommendations.some(
        (recommendation) => recommendation.type === CONTENT_TYPES.POST
      ),
      true
    );
    assert.equal(
      recommendations.some(
        (recommendation) =>
          recommendation.slug === 'matokompostointi-talvella-toimiiko-se-ulkona-suomessa'
      ),
      true
    );
  });

  test('metadata-pinned recommendations are placed before automatic matches', () => {
    const guide = getContentMetadata({
      type: CONTENT_TYPES.GUIDE,
      slug: 'voiko-kompostimadot-laittaa-lampokompostoriin',
    });

    const recommendations = getContentRecommendations({
      current: {
        ...guide,
        type: CONTENT_TYPES.GUIDE,
        recommendedContent: {
          pinned: [
            {
              type: CONTENT_TYPES.POST,
              slug: 'lampokompostori-vai-matokomposti-paras-ratkaisu-keittiojatteelle',
            },
          ],
        },
      },
    });

    assert.equal(
      recommendations[0].slug,
      'lampokompostori-vai-matokomposti-paras-ratkaisu-keittiojatteelle'
    );
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
});
