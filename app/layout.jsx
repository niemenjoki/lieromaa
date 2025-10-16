import { Rubik } from 'next/font/google';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar.jsx';

import './globals.css';

config.autoAddCss = false;

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
};

export const metadata = {
  title: {
    default: 'Luomuliero',
    template: '%s | Luomuliero',
  },
  description: 'Kotimainen matokompostointi ja kompostimatojen myynti.',
  openGraph: {
    type: 'website',
    url: 'https://www.luomuliero.fi',
    siteName: 'Luomuliero',
    images: [
      {
        url: 'https://www.luomuliero.fi/icons/apple-touch-icon.png',
        width: 180,
        height: 180,
        alt: 'Luomuliero logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@luomuliero',
    images: ['https://www.luomuliero.fi/icons/apple-touch-icon.png'],
  },
  icons: {
    icon: '/icons/favicon.ico',
    apple: '/icons/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fi" className={rubik.variable}>
      <body>
        <div className="container">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
