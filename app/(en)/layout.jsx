import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import SiteShell, { siteFontClassName } from '@/components/SiteShell/SiteShell';
import { getEnglishNavigation } from '@/lib/i18n/englishNavigation.mjs';
import { getDefaultMetadata } from '@/lib/metadata/getDefaultMetadata.mjs';

import '../globals.css';

config.autoAddCss = false;

export const metadata = getDefaultMetadata('en');

export default function EnglishRootLayout({ children }) {
  return (
    <html lang="en" className={siteFontClassName}>
      <body>
        <SiteShell language="en" navigation={getEnglishNavigation()}>
          {children}
        </SiteShell>
      </body>
    </html>
  );
}
