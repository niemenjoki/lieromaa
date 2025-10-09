import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';

import { SITE_URL } from '@/data/vars';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Footer from './Footer';
import Navbar from './Navbar';

const Layout = ({
  title,
  description,
  children,
  canonical,
  structuredData,
  showTermsLink,
}) => {
  const router = useRouter();
  const canonicalUrl = canonical || `${SITE_URL}${router.asPath}`;
  const isDev =
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' ||
        window.location.hostname.startsWith('192.168.') ||
        window.location.hostname === '127.0.0.1'));

  return (
    <div className="container">
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
        />
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta
          name="description"
          property="og:description"
          content={description}
        />
        <meta
          property="og:image"
          content="https://www.luomuliero.fi/icons/apple-touch-icon.png"
        />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <meta name="theme-color" content="#0e111b" />
        {structuredData &&
          structuredData.map((data, index) => (
            <script
              key={index}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
            />
          ))}
      </Head>

      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        client="ca-pub-5560402633923389"
        crossOrigin="anonymous"
      />
      <Navbar />
      <main>{children}</main>
      <Footer showTermsLink={showTermsLink} />
      {!isDev && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
    </div>
  );
};

Layout.defaultProps = {
  title: 'Luomuliero',
  keywords:
    'aloittelijan opas,biojäte,ekologisuus,kierrätys,kompostin hyödyntäminen,kompostivertailu,kompostointi talvella,kompostorin hoito,kompostorin perustaminen,lapset,lämpökompostointi,matokompostointi,puutarha',
  description:
    'Luomuliero tarjoaa käytännön tietoa matokompostoinnista Suomessa – omiin kokemuksiin perustuvia ohjeita, mittauksia ja vinkkejä.',
};

export default Layout;
