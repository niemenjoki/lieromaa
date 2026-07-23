import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import safeRoutes from '@/generated/site/safeRoutes.json';
import { getGuidePath } from '@/lib/content/guideRoutes.mjs';
import { getAllContent, getBlogTagArchives } from '@/lib/content/index.mjs';
import { getEnglishNavigation } from '@/lib/i18n/englishNavigation.mjs';
import {
  findActiveNavigationItem,
  normalizeNavigationPath,
} from '@/lib/navigation/activeRoute.mjs';
import { CONTENT_TYPES } from '@/lib/site/constants.mjs';
import { getSiteNavigation } from '@/lib/siteStructure.mjs';

function flattenSectionLinks(sections) {
  return sections.flatMap((section) => section.items);
}

describe('responsive site navigation data', () => {
  test('projects the exact Finnish mobile and desktop primary destinations', () => {
    const navigation = getSiteNavigation();

    assert.deepEqual(
      navigation.primaryItems.map(({ id, label, href }) => ({ id, label, href })),
      [
        { id: 'home', label: 'Koti', href: '/' },
        { id: 'guides', label: 'Oppaat', href: '/opas' },
        { id: 'blog', label: 'Blogi', href: '/blogi' },
        { id: 'calculator', label: 'Laskuri', href: '/matolaskuri' },
        { id: 'shop', label: 'Tuotteet', href: '/tuotteet' },
      ]
    );
    assert.equal(new Set(navigation.primaryItems.map((item) => item.id)).size, 5);
    assert.deepEqual(
      navigation.mobileDockIds
        .map((id) => navigation.primaryItems.find((item) => item.id === id))
        .map(({ label, href }) => ({ label, href })),
      [
        { label: 'Koti', href: '/' },
        { label: 'Oppaat', href: '/opas' },
        { label: 'Blogi', href: '/blogi' },
        { label: 'Tuotteet', href: '/tuotteet' },
      ]
    );
    assert.deepEqual(
      navigation.desktopPrimaryIds.map(
        (id) => navigation.primaryItems.find((item) => item.id === id)?.label
      ),
      ['Oppaat', 'Blogi', 'Tuotteet']
    );
  });

  test('builds the guide tray from all real guide categories', () => {
    const navigation = getSiteNavigation();

    assert.deepEqual(
      navigation.guideCategories.map(({ label, count }) => ({ label, count })),
      [
        { label: 'Matokompostorin perustaminen', count: 6 },
        { label: 'Matokompostorin hoito', count: 6 },
        { label: 'Matokompostin hyödyntäminen', count: 4 },
        { label: 'Lämpökompostointi', count: 3 },
      ]
    );
    const actualGuideItems = navigation.guideCategories
      .flatMap((category) => category.items)
      .map(({ href, label }) => ({ href, label }))
      .sort((left, right) => left.href.localeCompare(right.href, 'fi'));
    const expectedGuideItems = getAllContent({ type: CONTENT_TYPES.GUIDE })
      .map((guide) => ({
        href: getGuidePath({
          categoryName: guide.category.name,
          guideSlug: guide.slug,
        }),
        label: guide.title,
      }))
      .sort((left, right) => left.href.localeCompare(right.href, 'fi'));

    assert.deepEqual(actualGuideItems, expectedGuideItems);
    assert.equal(
      navigation.guideCategories.every(
        (category) => category.items.length === category.count
      ),
      true
    );
    assert.equal(
      navigation.guideCategories
        .flatMap((category) => [
          category.href,
          ...category.items.map((item) => item.href),
        ])
        .every((href) => safeRoutes.includes(href)),
      true
    );
  });

  test('keeps the shop active across product and checkout routes only', () => {
    const { primaryItems } = getSiteNavigation();

    for (const pathname of [
      '/tuotteet',
      '/tuotteet/madot',
      '/tuotteet/kompostorin-kuituseos',
      '/tilaus',
      '/madot',
    ]) {
      assert.equal(findActiveNavigationItem(primaryItems, pathname)?.id, 'shop');
    }

    for (const pathname of ['/tilausehdot', '/madot/ei-ole-olemassa']) {
      assert.equal(findActiveNavigationItem(primaryItems, pathname), null);
    }
  });

  test('keeps support, legal, and language destinations available', () => {
    const finnishNavigation = getSiteNavigation();
    const englishNavigation = getEnglishNavigation();
    const finnishSecondaryHrefs = flattenSectionLinks(
      finnishNavigation.secondarySections
    ).map((link) => link.href);
    const englishFooterHrefs = flattenSectionLinks(englishNavigation.footerColumns).map(
      (link) => link.href
    );

    for (const href of [
      '/matolaskuri',
      '/tietoa',
      '/tietoa/mista-lieromaan-madot-tulevat',
      '/tilausehdot',
      '/peruuta-tilaus',
      '/tietopyynto',
      '/tietosuoja',
    ]) {
      assert.equal(finnishSecondaryHrefs.includes(href), true, href);
    }

    assert.deepEqual(
      finnishNavigation.secondarySections.map((section) => section.heading),
      ['Työkalut', 'Lieromaa', 'Asiointi', 'Tietosuoja']
    );
    assert.deepEqual(finnishNavigation.settingsSection.languageLink, {
      href: '/en',
      label: 'In English',
      lang: 'en',
    });
    assert.equal(
      flattenSectionLinks(finnishNavigation.secondarySections).find(
        (link) => link.href === '/tietopyynto'
      )?.label,
      'Tietopyyntö'
    );

    for (const href of [
      '/en/order-and-delivery-terms',
      '/en/cancel-order',
      '/en/data-request',
      '/en/privacy',
      '/opas?from=en',
    ]) {
      assert.equal(englishFooterHrefs.includes(href), true, href);
    }
  });

  test('builds the requested footer groups from real indexable blog tags', () => {
    const navigation = getSiteNavigation();

    assert.deepEqual(
      navigation.footerColumns.map((column) => column.heading),
      ['Oppaat', 'Blogi', 'Tuotteet', 'Työkalut', 'Lieromaa', 'Asiointi ja tietosuoja']
    );

    const blogColumn = navigation.footerColumns.find(
      (column) => column.heading === 'Blogi'
    );
    const expectedCategoryLinks = getBlogTagArchives()
      .filter((tagArchive) => tagArchive.indexable)
      .map(({ href, label }) => ({ href, label }));

    assert.deepEqual(blogColumn.items, [
      { href: '/blogi', label: 'Kaikki julkaisut' },
      ...expectedCategoryLinks,
    ]);
    assert.equal(
      navigation.footerColumns
        .flatMap((column) => column.items)
        .find((link) => link.href === '/tietopyynto')?.label,
      'Tietopyyntö'
    );
  });

  test('matches encoded Finnish paths and tolerates malformed URL escapes', () => {
    const navigation = getSiteNavigation();
    const activeGuide = findActiveNavigationItem(
      navigation.primaryItems,
      '/opas/kompostin-hy%C3%B6dynt%C3%A4minen/matokakan-kaytto'
    );

    assert.equal(activeGuide?.id, 'guides');
    assert.equal(
      normalizeNavigationPath('/opas/kompostin-hy%C3%B6dynt%C3%A4minen/'),
      '/opas/kompostin-hyödyntäminen'
    );
    assert.equal(normalizeNavigationPath('/opas/%E0%A4%A'), '/opas/%E0%A4%A');
  });
});
