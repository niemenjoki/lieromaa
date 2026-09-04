'use client';

import { useState } from 'react';

import SafeLink from '@/components/SafeLink/SafeLink';
import Socials from '@/components/Socials/Socials';
import ThemeToggler from '@/components/ThemeToggler/ThemeToggler';
import { ADSENSE_CONSENT_ENABLED } from '@/lib/site/adsense';
import { openConsentPreferences } from '@/lib/site/consentPreferences';
import { LICENSE_URL, REPO_URL } from '@/lib/site/constants.mjs';
import { BUSINESS_ID, CONTACT_EMAIL, CONTACT_PHONE } from '@/lib/site/contact';
import { ORGANIZATION_NAME } from '@/lib/site/schema.mjs';
import { WORM_HUNT_FOOTER_SLOT_ID } from '@/lib/wormHunt/placementTargets.mjs';

import classes from './Footer.module.css';

const PUBLIC_BUSINESS_LOCATION = 'Järvenpää';

const LOCALE_COPY = Object.freeze({
  fi: Object.freeze({
    eyebrow: 'Biologinen kierto / Järvenpää',
    description:
      'Paikallisesti kasvatetut kompostimadot, käytännön oppaat ja työkalut ravinteiden kiertoon.',
    directoryLabel: 'Lieromaan sivukartta',
    registryHeading: 'Lieromaan tiedot',
    organizationLabel: 'Yritys',
    locationLabel: 'Sijainti',
    contactLabel: 'Yhteys',
    phoneLabel: 'Puhelin',
    languageLabel: 'Kieli',
    languageAction: 'In English',
    languageHref: '/en',
    languageCode: 'en',
    languageAriaLabel: 'Vaihda englanninkieliselle sivustolle',
    appearanceLabel: 'Ulkoasu',
    linkCountSingular: 'linkki',
    linkCountPlural: 'linkkiä',
  }),
  en: Object.freeze({
    eyebrow: 'Biological loop / Järvenpää',
    description:
      'Locally raised compost worms, practical guidance and tools for nutrient cycling.',
    directoryLabel: 'Lieromaa site directory',
    registryHeading: 'Lieromaa details',
    organizationLabel: 'Operator',
    locationLabel: 'Location',
    contactLabel: 'Contact',
    phoneLabel: 'Phone',
    languageLabel: 'Language',
    languageAction: 'Suomeksi',
    languageHref: '/',
    languageCode: 'fi',
    languageAriaLabel: 'Switch to the Finnish site',
    appearanceLabel: 'Appearance',
    linkCountSingular: 'link',
    linkCountPlural: 'links',
  }),
});

function FooterLink({ link }) {
  const content = (
    <>
      <span>{link.label}</span>
      {link.badge ? <span className={classes.LanguageBadge}>{link.badge}</span> : null}
    </>
  );

  if (link.external) {
    return <a href={link.href}>{content}</a>;
  }

  return (
    <SafeLink href={link.href} lang={link.lang}>
      {content}
    </SafeLink>
  );
}

function FooterLinkList({ items }) {
  return (
    <ul>
      {items.map((link) => (
        <li key={`${link.href}-${link.label}`}>
          <FooterLink link={link} />
        </li>
      ))}
    </ul>
  );
}

export default function Footer({ language = 'fi', navigation, copy, themeCopy }) {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear === startYear ? `${startYear}` : `${startYear}–${currentYear}`;
  const localeCopy = LOCALE_COPY[language] ?? LOCALE_COPY.fi;
  const [consentMessage, setConsentMessage] = useState('');
  const canManageConsent = ADSENSE_CONSENT_ENABLED;

  const handleConsentSettingsClick = () => {
    const opened = openConsentPreferences();

    setConsentMessage(opened ? '' : copy.consentFailure);
  };

  return (
    <footer className={classes.Footer}>
      <div className={classes.Inner}>
        <section className={classes.RootHeader} aria-labelledby="footer-lieromaa-title">
          <div className={classes.BrandBlock}>
            <p className={classes.Eyebrow}>{localeCopy.eyebrow}</p>
            <h2 id="footer-lieromaa-title">Lieromaa</h2>
            <p className={classes.Description}>{localeCopy.description}</p>
          </div>

          <div className={classes.RootActions}>
            <SafeLink
              href={localeCopy.languageHref}
              lang={localeCopy.languageCode}
              className={classes.LanguageSwitch}
              aria-label={localeCopy.languageAriaLabel}
            >
              <span>{localeCopy.languageLabel}</span>
              <strong>{localeCopy.languageAction}</strong>
              <span aria-hidden="true">↗</span>
            </SafeLink>

            <div className={classes.Socials}>
              <span className={classes.SocialLabel}>{copy.followHeading}</span>
              <Socials />
            </div>
          </div>
        </section>

        <div className={classes.RootSignal} aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
        </div>

        <nav className={classes.DesktopIndex} aria-label={localeCopy.directoryLabel}>
          {navigation.footerColumns.map((column, index) => (
            <section key={column.heading} className={classes.IndexColumn}>
              <h3>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {column.heading}
              </h3>
              <FooterLinkList items={column.items} />
            </section>
          ))}
        </nav>

        <nav className={classes.MobileIndex} aria-label={localeCopy.directoryLabel}>
          {navigation.footerColumns.map((column, index) => {
            const itemCount = column.items.length;
            const countLabel = `${itemCount} ${
              itemCount === 1 ? localeCopy.linkCountSingular : localeCopy.linkCountPlural
            }`;
            const sectionNumber = String(index + 1).padStart(2, '0');

            if (column.mobilePresentation === 'direct') {
              return (
                <section key={column.heading} className={classes.MobileDirectGroup}>
                  <div className={classes.MobileDirectHeading}>
                    <span aria-hidden="true">{sectionNumber}</span>
                    <h3>{column.heading}</h3>
                    <span className={classes.GroupCount} aria-hidden="true">
                      {itemCount}
                    </span>
                    <span className={classes.VisuallyHidden}>{countLabel}</span>
                  </div>
                  <FooterLinkList items={column.items} />
                </section>
              );
            }

            return (
              <details key={column.heading} className={classes.MobileGroup}>
                <summary>
                  <span aria-hidden="true">{sectionNumber}</span>
                  <strong>{column.heading}</strong>
                  <span className={classes.GroupCount} aria-hidden="true">
                    {itemCount}
                  </span>
                  <span className={classes.VisuallyHidden}>{countLabel}</span>
                  <span className={classes.DisclosureMark} aria-hidden="true">
                    <span className={classes.DisclosureClosed}>+</span>
                    <span className={classes.DisclosureOpen}>−</span>
                  </span>
                </summary>
                <FooterLinkList items={column.items} />
              </details>
            );
          })}
        </nav>

        <div id={WORM_HUNT_FOOTER_SLOT_ID} className={classes.WormHuntSlot} />

        <section className={classes.Registry} aria-labelledby="footer-registry-title">
          <h2 id="footer-registry-title" className={classes.VisuallyHidden}>
            {localeCopy.registryHeading}
          </h2>
          <dl>
            <div>
              <dt>{localeCopy.organizationLabel}</dt>
              <dd>
                <strong>{ORGANIZATION_NAME}</strong>
                <span>
                  {copy.businessIdLabel} {BUSINESS_ID}
                </span>
              </dd>
            </div>
            <div>
              <dt>{localeCopy.locationLabel}</dt>
              <dd>{PUBLIC_BUSINESS_LOCATION}</dd>
            </div>
            <div>
              <dt>{localeCopy.contactLabel}</dt>
              <dd>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </dd>
            </div>
            <div>
              <dt>{localeCopy.phoneLabel}</dt>
              <dd>
                <a href={`tel:${CONTACT_PHONE.replaceAll(' ', '')}`}>{CONTACT_PHONE}</a>
              </dd>
            </div>
          </dl>
        </section>

        <div className={classes.Bottom}>
          <p>
            &copy; {yearRange} Joonas Niemenjoki
            <span aria-hidden="true"> / </span>
            <strong>{ORGANIZATION_NAME}</strong>
          </p>
          <div className={classes.SafeLinks}>
            {canManageConsent ? (
              <>
                <button
                  type="button"
                  className={classes.LinkButton}
                  onClick={handleConsentSettingsClick}
                >
                  {copy.consentSettings}
                </button>
                <span aria-hidden="true"> / </span>
              </>
            ) : null}
            <span className={classes.AppearanceUtility}>
              <span>{localeCopy.appearanceLabel}</span>
              <ThemeToggler copy={themeCopy} />
            </span>
            <span aria-hidden="true"> / </span>
            <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">
              {copy.licence}
            </a>
            <span aria-hidden="true"> / </span>
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              {copy.sourceCode}
            </a>
          </div>
          {consentMessage ? (
            <p className={classes.ConsentMessage} role="status" aria-live="polite">
              {consentMessage}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
