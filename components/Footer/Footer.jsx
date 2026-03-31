'use client';

import { useState } from 'react';

import SafeLink from '@/components/SafeLink/SafeLink';
import Socials from '@/components/Socials/Socials';
import { ADSENSE_CONSENT_ENABLED } from '@/data/site/adsense';
import { LICENSE_URL, REPO_URL } from '@/data/site/constants.mjs';

import classes from './Footer.module.css';

export default function Footer({ navigation }) {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear === startYear ? `${startYear}` : `${startYear}–${currentYear}`;
  const [consentMessage, setConsentMessage] = useState('');
  const canManageConsent = ADSENSE_CONSENT_ENABLED;

  const handleConsentSettingsClick = () => {
    const openConsentPreferences = globalThis.window?.__lieromaaOpenConsentPreferences;
    const opened =
      typeof openConsentPreferences === 'function' ? openConsentPreferences() : false;

    setConsentMessage(
      opened
        ? ''
        : 'Evästeasetuksia ei voitu avata juuri nyt. Yritä ladata sivu uudelleen.'
    );
  };

  return (
    <footer className={classes.Footer}>
      <div className={classes.Inner}>
        <div className={classes.Columns}>
          {navigation.footerColumns.map((column) => (
            <div key={column.heading}>
              <h3>{column.heading}</h3>
              <ul>
                {column.items.map((link) => (
                  <li key={link.href}>
                    <SafeLink href={link.href}>{link.label}</SafeLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className={classes.Socials}>
            <h3>Seuraa</h3>
            <Socials />
          </div>
        </div>

        <div className={classes.Bottom}>
          <p>&copy; {yearRange} Joonas Niemenjoki</p>
          <p className={classes.SafeLinks}>
            {canManageConsent ? (
              <>
                <button
                  type="button"
                  className={classes.LinkButton}
                  onClick={handleConsentSettingsClick}
                >
                  Muuta evästeasetuksia
                </button>
                {' | '}
              </>
            ) : null}
            <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">
              Lisenssi
            </a>
            {' | '}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              Lähdekoodi
            </a>
          </p>
          {consentMessage ? (
            <p className={classes.ConsentMessage} role="status">
              {consentMessage}
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
