import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import SiteShell, { siteFontClassName } from '@/components/SiteShell/SiteShell';
import { getSiteSearchIndex } from '@/lib/search/siteSearchIndex.mjs';
import { getSiteNavigation } from '@/lib/siteStructure.mjs';

import '../globals.css';

config.autoAddCss = false;

export default function FinnishRootLayout({ children }) {
  return (
    <html lang="fi" className={siteFontClassName} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <SiteShell
          language="fi"
          navigation={getSiteNavigation()}
          searchItems={getSiteSearchIndex()}
        >
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
