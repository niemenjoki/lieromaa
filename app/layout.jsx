import { Rubik } from 'next/font/google';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import AdSenseConsentGate from '@/components/AdSense/AdSenseConsentGate';
import Analytics from '@/components/Analytics/Analytics';
import { CartProvider } from '@/components/Cart/CartProvider';
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import { ADSENSE_CONSENT_ENABLED } from '@/lib/site/adsense';
import { getSiteNavigation } from '@/lib/siteStructure.mjs';
import { createSiteStructuredData } from '@/lib/structuredData/createSiteStructuredData';

import './globals.css';

config.autoAddCss = false;

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export default function RootLayout({ children }) {
  const navigation = getSiteNavigation();
  const structuredData = createSiteStructuredData();

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
          <CartProvider>
            <Navbar navigation={navigation} />
            <main>{children}</main>
            <Footer navigation={navigation} />
          </CartProvider>
        </div>
        <Analytics />
        {ADSENSE_CONSENT_ENABLED ? <AdSenseConsentGate /> : null}
      </body>
    </html>
  );
}
