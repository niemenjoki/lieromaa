'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import useToggle from '@/hooks/useToggle';

import Toggler from '../NavToggler/NavToggler.jsx';
import Socials from '../Socials/Socials';
import ThemeToggler from '../ThemeToggler/ThemeToggler.jsx';
import classes from './Navbar.module.css';
import logo from '/public/images/lieromaa_logo.png';

const Navbar = () => {
  const pathname = usePathname();
  const [isOpen, toggleIsOpen] = useToggle(false);

  const navLinks = [
    { href: '/blogi', text: 'Blogi' },
    { href: '/madot', text: 'Osta matoja', highlight: true },
    { href: '/matolaskuri', text: 'Laskuri' },
    { href: '/tietoa', text: 'Tietoa' },
  ];

  return (
    <header className={classes.NavbarWrapper}>
      <div className={classes.Navbar}>
        <div className={classes.Brand}>
          <Link href="/" className={classes.BrandLink}>
            <Image
              src={logo}
              alt="Lieromaa logo"
              width={40}
              height={40}
              className={classes.Logo}
              priority
            />
            <span className={classes.BrandName}>Lieromaa</span>
          </Link>
        </div>
        <span className={classes.Toggler}>
          <Toggler drawerOpen={isOpen} clicked={toggleIsOpen} />
        </span>
        <nav className={[classes.Nav, isOpen ? classes.Open : ''].join(' ')}>
          <ul className={classes.Drawer}>
            <li>
              <ThemeToggler style={{ fontSize: '28px' }} />
            </li>

            {navLinks.map((link) => (
              <li key={link.href} onClick={() => toggleIsOpen(false)}>
                <Link
                  href={link.href}
                  className={[
                    classes.NavButton,
                    pathname === link.href ? classes.Active : '',
                  ].join(' ')}
                  style={{
                    color: link.highlight ? 'var(--highlight-alt)' : undefined,
                  }}
                >
                  {link.text}
                </Link>
              </li>
            ))}

            <li className={classes.Socials}>
              <Socials />
            </li>
          </ul>
        </nav>
      </div>

      <div className={classes.Divider}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z" />
        </svg>
      </div>
    </header>
  );
};

export default Navbar;
