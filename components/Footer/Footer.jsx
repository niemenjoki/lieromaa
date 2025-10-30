'use client';

import SafeLink from '@/components/SafeLink/SafeLink';
import Socials from '@/components/Socials/Socials';
import { LICENSE_URL, REPO_URL } from '@/data/vars.mjs';

import classes from './Footer.module.css';

export default function Footer() {
  const startYear = 2025;
  const currentYear = new Date().getFullYear();
  const yearRange =
    currentYear === startYear ? `${startYear}` : `${startYear}–${currentYear}`;

  return (
    <footer className={classes.Footer}>
      <div className={classes.Inner}>
        <div className={classes.Columns}>
          <div>
            <h3>Tuotteet</h3>
            <ul>
              <li>
                <SafeLink href="/tuotteet/madot">Kompostimadot</SafeLink>
              </li>
              {/*<li>
                <SafeLink href="/tuotteet/matokompostin-aloituspakkaus">
                  Aloituspakkaus
                </SafeLink>
              </li>*/}
            </ul>
            <h3 style={{ marginTop: '2rem' }}>Blogi</h3>
            <ul>
              <li>
                <SafeLink href="/blogi">Viimeisimmät julkaisut</SafeLink>
              </li>
            </ul>
          </div>

          <div>
            <h3>Oppaat</h3>
            <ul>
              <li>
                <SafeLink href="/opas/kompostorin-perustaminen">
                  Kompostorin perustaminen
                </SafeLink>
              </li>
              <li>
                <SafeLink href="/opas/kompostorin-hoito">Kompostorin hoito</SafeLink>
              </li>
              <li>
                <SafeLink href="/opas/kompostin-hyödyntäminen">
                  Kompostin hyödyntäminen
                </SafeLink>
              </li>
            </ul>
          </div>

          <div>
            <h3>Muut sivut</h3>
            <ul>
              <li>
                <SafeLink href="/blogi">Blogi</SafeLink>
              </li>
              <li>
                <SafeLink href="/matolaskuri">Matolaskuri</SafeLink>
              </li>
              <li>
                <SafeLink href="/tietoa">Tietoa sivustosta</SafeLink>
              </li>
              <li>
                <SafeLink href="/tietosuoja">Tietosuoja</SafeLink>
              </li>
              <li>
                <SafeLink href="/tilausehdot">Tilausehdot</SafeLink>
              </li>
            </ul>
          </div>

          <div className={classes.Socials}>
            <h3>Seuraa</h3>
            <Socials />
          </div>
        </div>

        <div className={classes.Bottom}>
          <p>&copy; {yearRange} Joonas Niemenjoki</p>
          <p className={classes.SafeLinks}>
            <a href={LICENSE_URL} target="_blank" rel="noopener noreferrer">
              Lisenssi
            </a>
            {' | '}
            <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
              Lähdekoodi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
