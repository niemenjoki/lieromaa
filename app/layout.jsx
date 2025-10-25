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

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.lieromaa.fi/#website',
      url: 'https://www.lieromaa.fi',
      name: 'Lieromaa',
      description:
        'Matokompostointi kotona on helppoa! Tilaa kotimaiset kompostimadot (Eisenia fetida) ja tutustu käytännön oppaisiin ja kompostointivinkkeihin.',
      publisher: {
        '@type': 'Organization',
        '@id': 'https://www.lieromaa.fi/#organization',
        name: 'Lieromaa',
      },
      inLanguage: 'fi',
    },
    {
      '@type': 'Organization',
      '@id': 'https://www.lieromaa.fi/#organization',
      name: 'Lieromaa',
      url: 'https://www.lieromaa.fi',
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://www.lieromaa.fi/#logo',
        url: 'https://www.lieromaa.fi/images/luomuliero_logo_1024.avif',
        contentUrl: 'https://www.lieromaa.fi/images/luomuliero_logo_1024.avif',

        width: 1024,
        height: 1024,
      },
      sameAs: ['https://www.instagram.com/lieromaa'],
      founder: { '@id': 'https://www.lieromaa.fi/#joonas' },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: 'lieromaa@gmail.com',
        availableLanguage: 'fi',
      },
      foundingDate: '2024-10-01',
      foundingLocation: { '@type': 'Place', name: 'Finland' },
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'FI',
      },
    },
    {
      '@type': 'Person',
      '@id': 'https://www.lieromaa.fi/#joonas',
      name: 'Joonas Niemenjoki',
      url: 'https://www.linkedin.com/in/joonasniemenjoki',
      jobTitle: 'Founder',
      worksFor: { '@id': 'https://www.lieromaa.fi/#organization' },
      sameAs: ['https://www.linkedin.com/in/joonasniemenjoki'],
      image: 'https://www.lieromaa.fi/images/portrait2024.avif',
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fi" className={rubik.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
          }}
        />
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
