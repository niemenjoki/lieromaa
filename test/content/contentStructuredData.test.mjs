import assert from 'node:assert/strict';
import test from 'node:test';

import { getContentMetadata } from '@/lib/content/getContentMetadata.mjs';
import { getGuideCategorySlug } from '@/lib/content/guideRoutes.mjs';
import { HOT_COMPOSTING_GUIDES } from '@/lib/content/hotCompostingGuide.mjs';
import { getAllContent, getGuideCategoryPageData } from '@/lib/content/index.mjs';
import { CONTENT_TYPES, SITE_URL } from '@/lib/site/constants.mjs';
import { createCollectionStructuredData } from '@/lib/structuredData/createCollectionStructuredData.mjs';

test('hot composting category schema uses rendered names and canonical URL forms', () => {
  const pageData = getGuideCategoryPageData('lämpökompostointi');
  const guides = getAllContent({ type: CONTENT_TYPES.GUIDE })
    .filter((guide) => guide.category.name === 'lämpökompostointi')
    .sort((left, right) => left.category.pagePosition - right.category.pagePosition);
  const graph = createCollectionStructuredData({
    pageUrl: pageData.pageUrl,
    pageName: pageData.pageName,
    description: pageData.description,
    breadcrumbItems: pageData.breadcrumbItems,
    itemListElement: guides.map((guide, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: guide.title,
      url: `${pageData.pageUrl}/${guide.slug}`,
    })),
  })['@graph'];
  const webPage = graph.find((node) => node['@type'] === 'WebPage');
  const itemList = graph.find((node) => node['@type'] === 'ItemList');
  const breadcrumb = graph.find((node) => node['@type'] === 'BreadcrumbList');

  assert.equal(webPage.name, 'Oppaat: lämpökompostointi');
  assert.equal(webPage.url, `${SITE_URL}/opas/lämpökompostointi`);
  assert.equal(itemList.itemListElement.length, 3);
  assert.deepEqual(
    itemList.itemListElement.map(({ name }) => name),
    guides.map(({ title }) => title)
  );
  assert.ok(itemList.itemListElement.every(({ url }) => !url.includes('%')));
  assert.equal(breadcrumb.itemListElement.at(-1).name, 'Lämpökompostointi');
});

test('all hot composting guides emit canonical WebPage, Article and breadcrumb data', () => {
  for (const { slug } of HOT_COMPOSTING_GUIDES) {
    const guide = getContentMetadata({ type: CONTENT_TYPES.GUIDE, slug });
    const pageUrl = `${SITE_URL}/opas/${getGuideCategorySlug(guide.category.name)}/${slug}`;
    const graph = guide.structuredData['@graph'];
    const webPage = graph.find((node) => node['@type'] === 'WebPage');
    const article = graph.find((node) => node['@type'] === 'Article');
    const breadcrumb = graph.find((node) => node['@type'] === 'BreadcrumbList');

    assert.ok(webPage, `${slug} is missing WebPage data`);
    assert.ok(article, `${slug} is missing Article data`);
    assert.ok(breadcrumb, `${slug} is missing BreadcrumbList data`);
    assert.equal(webPage.url, pageUrl);
    assert.equal(webPage.name, guide.title);
    assert.equal(webPage.primaryImageOfPage.url, `${SITE_URL}${guide.image.url}`);
    assert.equal(article.url, pageUrl);
    assert.equal(article.headline, guide.title);
    assert.equal(article.image, `${SITE_URL}${guide.image.url}`);
    assert.equal(article.articleSection, 'Lämpökompostointi');
    assert.equal(breadcrumb['@id'], `${pageUrl}#breadcrumb`);
    assert.equal(breadcrumb.itemListElement.at(-1).name, guide.title);
    assert.equal(breadcrumb.itemListElement.at(-1).item, pageUrl);
    assert.equal(breadcrumb.itemListElement[2].name, 'Lämpökompostointi');
    assert.ok(
      breadcrumb.itemListElement.every(({ item }) => !item.includes('%')),
      `${slug} mixes encoded schema URLs`
    );
  }
});
