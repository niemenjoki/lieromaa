import { Rubik } from 'next/font/google';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import Analytics from '@/components/Analytics/Analytics';
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';

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
  title: 'Lieromaa – Kompostimadot ja matokompostointi kotona',
  description:
    'Matokompostointi kotona on helppoa! Tilaa kotimaiset kompostimadot (Eisenia fetida) ja tutustu käytännön oppaisiin ja kompostointivinkkeihin.',
  openGraph: {
    type: 'website',
    url: 'https://www.lieromaa.fi',
    title: 'Lieromaa – Kompostimadot ja matokompostointi kotona',
    description:
      'Matokompostointi kotona on helppoa! Tilaa kotimaiset kompostimadot (Eisenia fetida) ja tutustu käytännön oppaisiin ja kompostointivinkkeihin.',
    siteName: 'Lieromaa',
    images: [
      {
        url: 'https://www.lieromaa.fi/images/luomuliero_logo_1024.png',
        width: 1024,
        height: 1024,
        alt: 'Lieromaa logo',
      },
    ],
    locale: 'fi_FI',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@lieromaa',
    images: ['https://www.lieromaa.fi/images/luomuliero_logo_1024.png'],
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
        <Analytics />
      </body>
    </html>
  );
}
