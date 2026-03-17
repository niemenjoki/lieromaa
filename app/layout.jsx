import { Rubik } from 'next/font/google';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import AdSenseConsentGate from '@/components/AdSense/AdSenseConsentGate';
import Analytics from '@/components/Analytics/Analytics';
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import VisitorFeedbackWidget from '@/components/VisitorFeedbackWidget/VisitorFeedbackWidget';
import { CONTACT_EMAIL } from '@/data/contact';
import {
  AUTHOR_ID,
  AUTHOR_NAME,
  ORGANIZATION_ID,
  ORGANIZATION_NAME,
  SCHEMA_LANGUAGE,
  SITE_LOGO_URL,
  WEBSITE_ID,
} from '@/data/siteSchema.mjs';
import { SITE_URL } from '@/data/vars.mjs';

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
      '@id': WEBSITE_ID,
      url: SITE_URL,
      name: ORGANIZATION_NAME,
      description:
        'Matokompostointi kotona on helppoa! Tilaa kotimaiset kompostimadot (Eisenia fetida) ja tutustu käytännön oppaisiin ja kompostointivinkkeihin.',
      publisher: {
        '@type': 'Organization',
        '@id': ORGANIZATION_ID,
        name: ORGANIZATION_NAME,
      },
      inLanguage: SCHEMA_LANGUAGE,
    },
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: ORGANIZATION_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: SITE_LOGO_URL,
        contentUrl: SITE_LOGO_URL,

        width: 1024,
        height: 1024,
      },
      sameAs: ['https://www.instagram.com/lieromaa'],
      founder: { '@id': AUTHOR_ID },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Support',
        email: CONTACT_EMAIL,
        availableLanguage: SCHEMA_LANGUAGE,
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
      '@id': AUTHOR_ID,
      name: AUTHOR_NAME,
      url: 'https://www.linkedin.com/in/joonasniemenjoki',
      jobTitle: 'Founder',
      worksFor: { '@id': ORGANIZATION_ID },
      sameAs: ['https://www.linkedin.com/in/joonasniemenjoki'],
      image: `${SITE_URL}/images/portrait2024.avif`,
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
        <VisitorFeedbackWidget />
        <Analytics />
        <AdSenseConsentGate />
      </body>
    </html>
  );
}
