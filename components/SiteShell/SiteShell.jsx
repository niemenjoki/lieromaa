import { Rubik } from 'next/font/google';

import AdSenseConsentGate from '@/components/AdSense/AdSenseConsentGate';
import Analytics from '@/components/Analytics/Analytics';
import { CartProvider } from '@/components/Cart/CartProvider';
import FinnishContentLanguageNotice from '@/components/FinnishContentLanguageNotice/FinnishContentLanguageNotice';
import Footer from '@/components/Footer/Footer';
import NavigationShell from '@/components/Navigation/NavigationShell';
import { getCommonMessages } from '@/lib/i18n/messages.mjs';
import { ADSENSE_CONSENT_ENABLED } from '@/lib/site/adsense';
import { createSiteStructuredData } from '@/lib/structuredData/createSiteStructuredData';

const rubik = Rubik({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-site',
});

export const siteFontClassName = rubik.variable;

const themeInitializationScript = `(() => {
  let isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  try {
    const storedTheme = window.localStorage.getItem('darkMode');
    if (storedTheme === 'true') isDark = true;
    else if (storedTheme === 'false') isDark = false;
    else if (storedTheme !== null) window.localStorage.removeItem('darkMode');
  } catch {}
  document.documentElement.classList.toggle('dark', isDark);
  document.body.classList.toggle('dark', isDark);
})();`;

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
      <script dangerouslySetInnerHTML={{ __html: themeInitializationScript }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <div className="container">
        <CartProvider language={language}>
          <a className="skip-link" href="#main-content">
            {language === 'fi' ? 'Siirry sisältöön' : 'Skip to content'}
          </a>
          <NavigationShell
            language={language}
            navigation={navigation}
            searchItems={searchItems}
            copy={copy}
          />
          {language === 'fi' ? (
            <FinnishContentLanguageNotice copy={copy.finnishContentNotice} />
          ) : null}
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer
            language={language}
            navigation={navigation}
            copy={copy.footer}
            themeCopy={copy.theme}
          />
        </CartProvider>
      </div>
      <Analytics />
      {ADSENSE_CONSENT_ENABLED ? <AdSenseConsentGate /> : null}
    </>
  );
}
