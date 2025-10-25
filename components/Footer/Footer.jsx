import Link from 'next/link';

import { LICENSE_URL, REPO_URL } from '@/data/vars.mjs';

import Socials from '../Socials/Socials.jsx';
import classes from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={classes.Footer}>
      <div className={classes.Left}>
        <ul className={classes.Links}>
          <li>
            <Link href={'/blogi'}>Blogi</Link>
          </li>
          <li>
            <Link href={'/madot'}>Osta kompostimatoja</Link>
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
          <li>
            <Link href={'/tilausehdot'}>Tilausehdot</Link>
          </li>
        </ul>

        <div className={classes.NoMobile}>
          <div>
            &copy; 2025
            {new Date().getFullYear() > 2025 && `-${new Date().getFullYear()}`} Lieromaa |
            Joonas Niemenjoki. Koodi ja sisältö on
            <a href={LICENSE_URL} target="_blank" rel="license noopener noreferrer">
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
          {new Date().getFullYear() > 2025 && `-${new Date().getFullYear()}`} Lieromaa |
          Joonas Niemenjoki
        </div>
        <div>
          Koodi ja sisältö on
          <a href={LICENSE_URL} target="_blank" rel="license noopener noreferrer">
            {' '}
            lisensoitu
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
