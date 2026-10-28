import { ORGANIZATION_NAME } from '@/lib/site/schema.mjs';

// Served at /manifest.webmanifest; Next adds the link to every page.
export default function manifest() {
  return {
    theme_color: '#0e111b',
    background_color: '#0e111b',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    name: ORGANIZATION_NAME,
    short_name: 'lieromaa',
    description:
      'Tietoa ja vinkkejä matokompostoinnista, kierrätyksestä. Lieromaa auttaa tekemään jätteestä ravinnerikasta multaa!',
    icons: [
      {
        src: '/icons/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
