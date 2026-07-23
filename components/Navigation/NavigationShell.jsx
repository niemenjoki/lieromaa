'use client';

import DesktopNavigation from './DesktopNavigation';
import MobileNavigation from './MobileNavigation';
import classes from './NavigationShell.module.css';
import WormNavigationProvider, { useWormNavigation } from './WormNavigationProvider';

const LABELS = Object.freeze({
  fi: Object.freeze({
    appearance: 'Ulkoasu',
    close: 'Sulje',
    consentFailure:
      'Evästeasetuksia ei voitu avata juuri nyt. Yritä ladata sivu uudelleen.',
    cookieSettings: 'Evästeasetukset',
    guideCategories: 'Aihealueet',
    guideContext: 'Oppaiden aihealueet',
    language: 'Kieli',
    more: 'Lisää',
    moreDescription: 'Tietoa, asiointi ja asetukset',
    openGuideTray: 'Avaa oppaiden valikko',
    openMore: 'Avaa lisää linkkejä',
    openSearch: 'Avaa sivustohaku',
    primaryNavigation: 'Päänavigaatio',
    clearSearch: 'Tyhjennä haku',
    searchGuides: 'Etsi sisältöä',
    searchLabel: 'Hae sivustolta',
    searchPlaceholder: 'Hae oppaita, tuotteita tai aiheita',
    searchTitle: 'Haku',
  }),
  en: Object.freeze({
    appearance: 'Appearance',
    close: 'Close',
    consentFailure:
      'Cookie settings could not be opened right now. Please reload the page and try again.',
    cookieSettings: 'Cookie settings',
    guideCategories: 'Topics',
    guideContext: 'Guide topics',
    language: 'Language',
    more: 'More',
    moreDescription: 'Information, services, and settings',
    openGuideTray: 'Open the guides menu',
    openMore: 'Open more links',
    openSearch: 'Open site search',
    primaryNavigation: 'Primary navigation',
    clearSearch: 'Clear search',
    searchGuides: 'Find content',
    searchLabel: 'Search the site',
    searchPlaceholder: 'Search guides, products, or topics',
    searchTitle: 'Search',
  }),
});

function selectNavigationItems(primaryItems, ids) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return primaryItems;
  }

  const itemsById = new Map(primaryItems.map((item) => [item.id, item]));
  return ids.map((id) => itemsById.get(id)).filter(Boolean);
}

function NavigationSurfaces({ copy, labels, language, navigation, searchItems }) {
  const { destinationId, originId, phase, routeActiveId, token } = useWormNavigation();
  const primaryItems = navigation.primaryItems ?? [];
  const mobilePrimaryItems = selectNavigationItems(
    primaryItems,
    navigation.mobileDockIds
  );
  const desktopPrimaryItems = selectNavigationItems(
    primaryItems,
    navigation.desktopPrimaryIds
  );
  const guideCategories = navigation.guideCategories ?? [];
  const productItems = navigation.productItems ?? [];
  const secondarySections = navigation.secondarySections ?? [];
  const settingsSection = navigation.settingsSection ?? null;

  return (
    <div
      className={classes.Shell}
      data-navigation-shell="true"
      data-navigation-active-id={routeActiveId ?? ''}
      data-worm-origin-id={originId ?? ''}
      data-worm-destination-id={destinationId ?? ''}
      data-worm-phase={phase}
      data-worm-token={token}
    >
      <DesktopNavigation
        copy={copy}
        guideCategories={guideCategories}
        labels={labels}
        language={language}
        primaryItems={primaryItems}
        productItems={productItems}
        desktopPrimaryItems={desktopPrimaryItems}
        searchItems={searchItems}
        secondarySections={secondarySections}
        settingsSection={settingsSection}
      />
      <MobileNavigation
        copy={copy}
        guideCategories={guideCategories}
        labels={labels}
        language={language}
        primaryItems={primaryItems}
        mobilePrimaryItems={mobilePrimaryItems}
        searchItems={searchItems}
        secondarySections={secondarySections}
        settingsSection={settingsSection}
      />
    </div>
  );
}

export default function NavigationShell({
  copy,
  language = 'fi',
  navigation = {},
  searchItems = [],
}) {
  const normalizedLanguage = language === 'en' ? 'en' : 'fi';
  const labels = {
    ...LABELS[normalizedLanguage],
    searchLabel: copy?.navbar?.searchLabel ?? LABELS[normalizedLanguage].searchLabel,
  };
  const primaryItems = navigation.primaryItems ?? [];

  return (
    <WormNavigationProvider primaryItems={primaryItems}>
      <NavigationSurfaces
        copy={copy}
        labels={labels}
        language={normalizedLanguage}
        navigation={navigation}
        searchItems={searchItems ?? []}
      />
    </WormNavigationProvider>
  );
}
