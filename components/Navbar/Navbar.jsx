'use client';

import { useState } from 'react';

import SafeImage from '@/components/SafeImage/SafeImage';
import ThemeToggler from '@/components/ThemeToggler/ThemeToggler';

import Toggler from '../NavToggler/NavToggler.jsx';
import SafeLink from '../SafeLink/SafeLink';
import classes from './Navbar.module.css';
import logo from '/public/images/lieromaa_logo.avif';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen((prev) => !prev);

  return (
    <nav className={classes.Navbar}>
      <div className={classes.Inner}>
        {/* LEFT */}
        <div className={classes.Left}>
          <SafeLink href="/" className={classes.LogoLink}>
            <SafeImage
              src={logo}
              alt="Lieromaa logo"
              width={40}
              height={40}
              className={classes.Logo}
              priority
            />
            <span className={classes.Brand}>Lieromaa</span>
          </SafeLink>
        </div>

        {/* RIGHT */}
        <div className={classes.Right}>
          <ul className={classes.Links}>
            <li className={classes.Dropdown}>
              <span>Tuotteet</span>
              <ul className={classes.DropdownMenu}>
                <li>
                  <SafeLink href="/tuotteet/madot">Kompostimadot</SafeLink>
                </li>
                {/* <li>
                  <SafeLink href="/tuotteet/matokompostin-aloituspakkaus">
                    Aloituspakkaus
                  </SafeLink>
                </li> */}
              </ul>
            </li>

            {/*<li className={classes.Dropdown}>
              <span>Opas</span>
              <ul className={classes.DropdownMenu}>
                <li>
                  <SafeLink href="/opas/kompostorin-perustaminen">
                    Kompostorin perustaminen
                  </SafeLink>
                </li>
                <li>
                  <SafeLink href="/opas/kompostorin-hoito">Kompostorin hoito</SafeLink>
                </li>
                <li>
                  <SafeLink href="/opas/matokakan-kerays">Matokakan keräys</SafeLink>
                </li>
              </ul>
            </li>*/}

            <li>
              <SafeLink href="/blogi">Blogi</SafeLink>
            </li>
            <li>
              <ThemeToggler style={{ fontSize: '24px' }} />
            </li>
          </ul>

          {/* Mobile toggler */}
          <span className={classes.Toggler}>
            <Toggler
              className={classes.Toggler}
              drawerOpen={isOpen}
              clicked={toggleIsOpen}
            />
          </span>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <div className={`${classes.MobileMenu} ${isOpen ? classes.MobileOpen : ''}`}>
        <div className={classes.MobileContent}>
          <div className={classes.MobileSection}>
            <h3>Tuotteet</h3>
            <ul>
              <li>
                <SafeLink href="/tuotteet/madot">Kompostimadot</SafeLink>
              </li>
              {/*<li>
                <SafeLink href="/tuotteet/matokompostin-aloituspakkaus">Aloituspakkaus</SafeLink>
              </li>*/}
            </ul>
          </div>

          {/*<div className={classes.MobileSection}>
            <h3>Opas</h3>
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
                <SafeLink href="/opas/matokakan-kerays">Matokakan keräys</SafeLink>
              </li>
            </ul>
          </div>*/}

          <div className={classes.MobileSection}>
            <h3>Blogi</h3>
            <ul>
              <li>
                <SafeLink href="/blogi">Blogi</SafeLink>
              </li>
            </ul>
          </div>

          <div className={classes.MobileSection}>
            <ThemeToggler style={{ fontSize: '26px' }} />
          </div>
        </div>
      </div>
    </nav>
  );
}
