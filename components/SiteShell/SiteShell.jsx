import { Rubik } from 'next/font/google';

import AdSenseConsentGate from '@/components/AdSense/AdSenseConsentGate';
import Analytics from '@/components/Analytics/Analytics';
import { CartProvider } from '@/components/Cart/CartProvider';
import FinnishContentLanguageNotice from '@/components/FinnishContentLanguageNotice/FinnishContentLanguageNotice';
import Footer from '@/components/Footer/Footer';
import Navbar from '@/components/Navbar/Navbar';
import { getCommonMessages } from '@/lib/i18n/messages.mjs';
import { ADSENSE_CONSENT_ENABLED } from '@/lib/site/adsense';
import { createSiteStructuredData } from '@/lib/structuredData/createSiteStructuredData';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const siteFontClassName = rubik.variable;

export default function SiteShell({
  children,
  language,
  navigation,
  searchItems = null,
}) {
  const copy = getCommonMessages(language);
  const structuredData = createSiteStructuredData(language);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <div className="container">
        <CartProvider language={language}>
          <Navbar
            language={language}
            navigation={navigation}
            searchItems={searchItems}
            copy={copy}
          />
          {language === 'fi' ? (
            <FinnishContentLanguageNotice copy={copy.finnishContentNotice} />
          ) : null}
          <main>{children}</main>
          <Footer navigation={navigation} copy={copy.footer} />
        </CartProvider>
      </div>
      <Analytics />
      {ADSENSE_CONSENT_ENABLED ? <AdSenseConsentGate /> : null}
    </>
  );
}
