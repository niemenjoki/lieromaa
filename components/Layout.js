import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';

import { SITE_URL } from '@/data/vars';
import Footer from './Footer';
import Navbar from './Navbar';
import { Analytics } from '@vercel/analytics/next';

const Layout = ({ title, description, children, canonical }) => {
  const router = useRouter();
  const canonicalUrl = canonical || `${SITE_URL}${router.asPath}`;

  const handleRouteChange = (url) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'G-0448XXF0S0', { page_path: url });
    }
  };

  useEffect(() => {
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

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
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/icons/favicon.ico" />
        <meta name="theme-color" content="#0e111b" />
      </Head>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-0448XXF0S0"
        strategy="afterInteractive"
      />
      <Script
        id="analytics-loader"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-0448XXF0S0', { page_path: window.location.pathname });
            `,
        }}
        strategy="afterInteractive"
      />
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        client="ca-pub-5560402633923389"
        crossOrigin="anonymous"
      />
      <Navbar />
      <main>{children}</main>
      <Footer />
      <Analytics />
    </div>
  );
};

Layout.defaultProps = {
  title: 'Luomuliero',
  keywords:
    'vermicompostointi, matokomposti, kompostointi, kierrätys, luomu, puutarha',
  description:
    'Tietoa ja vinkkejä matokompostoinnista, kierrätyksestä. Luomuliero auttaa tekemään jätteestä ravinnerikasta multaa!',
};

export default Layout;
