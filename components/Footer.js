import Link from 'next/link';

import { LICENSE_URL, REPO_URL } from '@/data/vars';
import classes from '@/styles/Footer.module.css';
import Socials from './Socials';

const Footer = () => {
  return (
    <footer className={classes.Footer}>
      <div className={classes.Left}>
        <ul className={classes.Links}>
          <li>
            <Link href={'/blogi'}>Blogi</Link>
          </li>
          <li>
            <Link href={'/madot'}>Mistä kompostimatoja?</Link>
          </li>
          <li>
            <Link href={'/matolaskuri'}>Kompostimatojen laskuri</Link>
          </li>

          <li>
            <Link href={'/tietoa'}>Tietoa sivustosta</Link>
          </li>
          <li>
            <Link href={'/tietosuoja'}>Tietosuoja</Link>
          </li>
        </ul>

        <div className={classes.NoMobile}>
          <div>
            &copy; 2025
            {new Date().getFullYear() > 2025 &&
              `-${new Date().getFullYear()}`}{' '}
            Luomuliero | Joonas Niemenjoki. Koodi ja sisältö on
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="license noopener noreferrer"
            >
              {' '}
              lisensoitu
            </a>
          </div>
          <div></div>
        </div>
      </div>
      <div className={classes.Right}>
        <ul className={classes.Links}>
          <li>
            <a target="_blank" rel="noreferrer" href={REPO_URL}>
              Lähdekoodi
            </a>
          </li>
          <li className={classes.Socials}>
            <Socials />
          </li>
        </ul>
      </div>
      <div className={classes.Mobile}>
        <div>
          &copy; 2025
          {new Date().getFullYear() > 2025 &&
            `-${new Date().getFullYear()}`}{' '}
          Luomuliero | Joonas Niemenjoki
        </div>
        <div>
          Koodi ja sisältö on
          <a
            href={LICENSE_URL}
            target="_blank"
            rel="license noopener noreferrer"
          >
            {' '}
            lisensoitu
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
