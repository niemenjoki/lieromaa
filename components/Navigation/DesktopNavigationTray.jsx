'use client';

import SiteSearch from '@/components/SiteSearch/SiteSearch';
import ThemeToggler from '@/components/ThemeToggler/ThemeToggler';
import { ADSENSE_CONSENT_ENABLED } from '@/lib/site/adsense';

import classes from './DesktopNavigation.module.css';
import NavigationAuxiliaryLink from './NavigationAuxiliaryLink';
import NavigationConsentButton from './NavigationConsentButton';

export default function DesktopNavigationTray({
  copy,
  guideCategories = [],
  id,
  labelledBy,
  labels,
  onNavigate,
  productItems = [],
  searchItems,
  secondarySections = [],
  settingsSection,
  type,
}) {
  if (type === 'guides') {
    return (
      <section
        id={id}
        className={classes.Tray}
        aria-labelledby={labelledBy}
        data-navigation-tray="guides"
      >
        <div className={classes.TrayInner}>
          <div className={classes.GuideCategories}>
            {guideCategories.map((category) => (
              <section key={category.href} className={classes.GuideCategory}>
                <h2>
                  <NavigationAuxiliaryLink item={category} onNavigate={onNavigate} />
                </h2>
                {category.items?.length ? (
                  <ul>
                    {category.items.map((item) => (
                      <li key={item.href}>
                        <NavigationAuxiliaryLink item={item} onNavigate={onNavigate} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          {searchItems?.length ? (
            <div className={classes.TraySearch}>
              <p className={classes.TrayEyebrow}>{labels.searchGuides}</p>
              <SiteSearch
                searchItems={searchItems}
                variant="guide-navigation"
                label={labels.searchLabel}
                clearLabel={labels.clearSearch}
                placeholder={labels.searchPlaceholder}
                resultLimit={5}
                onNavigate={onNavigate}
              />
            </div>
          ) : null}
        </div>
      </section>
    );
  }

  if (type === 'products') {
    return (
      <section
        id={id}
        className={`${classes.Tray} ${classes.ProductTray}`}
        aria-labelledby={labelledBy}
        data-navigation-tray="products"
      >
        <ul className={classes.ProductList}>
          {productItems.map((item) => (
            <li key={item.href}>
              <NavigationAuxiliaryLink item={item} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={`${classes.Tray} ${classes.SecondaryTray}`}
      aria-labelledby={labelledBy}
      data-navigation-tray="secondary"
    >
      <div className={classes.SecondaryGrid}>
        {secondarySections.map((section, index) => (
          <section key={section.heading ?? `secondary-${index}`}>
            {section.heading ? <h2>{section.heading}</h2> : null}
            <ul>
              {section.items.map((item) => (
                <li key={item.href}>
                  <NavigationAuxiliaryLink item={item} onNavigate={onNavigate} />
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className={classes.DesktopSettings}>
          <h2>{settingsSection?.heading ?? labels.language}</h2>
          <ul>
            {settingsSection?.languageLink ? (
              <li>
                <NavigationAuxiliaryLink
                  item={settingsSection.languageLink}
                  onNavigate={onNavigate}
                />
              </li>
            ) : null}
            <li className={classes.DesktopSettingRow}>
              <span>{labels.appearance}</span>
              <ThemeToggler copy={copy.theme} />
            </li>
            {ADSENSE_CONSENT_ENABLED ? (
              <li>
                <NavigationConsentButton
                  className={classes.DesktopSettingButton}
                  failureMessage={labels.consentFailure}
                  label={labels.cookieSettings}
                  messageClassName={classes.DesktopSettingMessage}
                  onOpened={onNavigate}
                />
              </li>
            ) : null}
          </ul>
        </section>
      </div>
    </section>
  );
}
