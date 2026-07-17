'use client';

import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import CartButton from '@/components/Cart/CartButton';
import SafeImage from '@/components/SafeImage/SafeImage';
import SiteSearch from '@/components/SiteSearch/SiteSearch';
import ThemeToggler from '@/components/ThemeToggler/ThemeToggler';
import {
  getLanguageSwitchHref,
  getRouteKeyForPath,
  getRoutePath,
} from '@/lib/i18n/routes.mjs';

import Toggler from '../NavToggler/NavToggler.jsx';
import SafeLink from '../SafeLink/SafeLink';
import Socials from '../Socials/Socials.jsx';
import classes from './Navbar.module.css';

function renderNavigationLink(link, onClick) {
  return (
    <SafeLink href={link.href} lang={link.lang} onClick={onClick}>
      {link.label}
      {link.badge ? <span className={classes.LanguageBadge}>{link.badge}</span> : null}
    </SafeLink>
  );
}

function renderDesktopItem(item) {
  if (item.kind === 'menu') {
    return (
      <li key={item.label} className={classes.Dropdown}>
        <span>{item.label}</span>
        <ul className={classes.DropdownMenu}>
          {item.items.map((link) => (
            <li key={link.href}>{renderNavigationLink(link)}</li>
          ))}
        </ul>
      </li>
    );
  }

  return <li key={item.href}>{renderNavigationLink(item)}</li>;
}

export default function Navbar({ language, navigation, searchItems, copy }) {
  const [isOpen, setIsOpen] = useState(false);
  const [locationSuffix, setLocationSuffix] = useState('');
  const pathname = usePathname();
  const targetLanguage = language === 'en' ? 'fi' : 'en';
  const pageKey = getRouteKeyForPath(pathname);
  const currentHref = `${pathname}${locationSuffix}`;
  const languageSwitchHref = pageKey
    ? getLanguageSwitchHref({
        pageKey,
        language: targetLanguage,
        currentHref,
      })
    : getRoutePath('home', targetLanguage);

  useEffect(() => {
    const updateLocationSuffix = () =>
      setLocationSuffix(
        `${globalThis.location?.search || ''}${globalThis.location?.hash || ''}`
      );
    updateLocationSuffix();
    globalThis.addEventListener?.('hashchange', updateLocationSuffix);
    globalThis.addEventListener?.('popstate', updateLocationSuffix);
    return () => {
      globalThis.removeEventListener?.('hashchange', updateLocationSuffix);
      globalThis.removeEventListener?.('popstate', updateLocationSuffix);
    };
  }, [pathname]);
  const closeMenu = () => {
    setIsOpen(false);
    if (typeof document !== 'undefined') {
      document.body.classList.remove('nav-open');
    }
  };

  const toggleIsOpen = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      if (typeof document !== 'undefined') {
        document.body.classList.toggle('nav-open', newState);
      }
      return newState;
    });
  };

  return (
    <nav className={classes.Navbar}>
      <div className={classes.Inner}>
        {/* LEFT */}
        <div className={classes.Left}>
          <SafeLink href={getRoutePath('home', language)} className={classes.LogoLink}>
            <SafeImage
              src="/images/lieromaa_logo.svg"
              alt={copy.navbar.logoAlt}
              width={40}
              height={40}
              className={classes.Logo}
              priority
              unoptimized
            />
            <span className={classes.Brand}>Lieromaa</span>
          </SafeLink>
        </div>

        {/* RIGHT */}
        <div className={classes.Right}>
          <ul className={classes.Links}>
            {navigation.desktopItems.map((item) => renderDesktopItem(item))}
            <li>
              <ThemeToggler copy={copy.theme} style={{ fontSize: '24px' }} />
            </li>
          </ul>

          {searchItems ? (
            <SiteSearch
              searchItems={searchItems}
              variant="navbar"
              resultLimit={5}
              label={copy.navbar.searchLabel}
            />
          ) : null}

          <CartButton language={language} copy={copy.cart} />

          <SafeLink
            href={languageSwitchHref}
            lang={copy.navbar.languageSwitchLanguage}
            className={classes.LanguageSwitch}
          >
            {copy.navbar.languageSwitchLabel}
          </SafeLink>

          <span className={classes.MobileThemeToggler}>
            <ThemeToggler copy={copy.theme} style={{ fontSize: '26px' }} />
          </span>

          {/* Mobile toggler */}
          <span className={classes.Toggler}>
            <Toggler
              className={classes.Toggler}
              drawerOpen={isOpen}
              clicked={toggleIsOpen}
              copy={copy.navigation}
            />
          </span>
        </div>
      </div>

      {/* MOBILE OVERLAY */}
      <div className={`${classes.MobileMenu} ${isOpen ? classes.MobileOpen : ''}`}>
        <div className={classes.MobileContent}>
          {searchItems ? (
            <div className={classes.MobileSearch}>
              <SiteSearch
                searchItems={searchItems}
                variant="mobile"
                resultLimit={4}
                label={copy.navbar.searchLabel}
                onNavigate={closeMenu}
              />
            </div>
          ) : null}
          {navigation.mobileSections.map((section, sectionIndex) => (
            <div
              key={section.heading ?? `mobile-section-${sectionIndex}`}
              className={classes.MobileSection}
            >
              {section.heading && <h3>{section.heading}</h3>}
              <ul>
                {section.items.map((link) => (
                  <li key={link.href}>{renderNavigationLink(link, closeMenu)}</li>
                ))}
              </ul>
            </div>
          ))}
          <div className={classes.MobileSection}>
            <ul>
              <li>
                <SafeLink
                  href={languageSwitchHref}
                  lang={copy.navbar.languageSwitchLanguage}
                  onClick={closeMenu}
                >
                  {copy.navbar.languageSwitchLabel}
                </SafeLink>
              </li>
            </ul>
          </div>
          <div className={classes.MobileSection}>
            <h3>{copy.navbar.followHeading}</h3>
            <ul>
              <li className={classes.Socials}>
                <Socials />
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
