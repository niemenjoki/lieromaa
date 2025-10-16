import Image from 'next/image';

import Advert from '@/components/Advert/Advert';
import { SITE_URL } from '@/data/vars';
import portrait from '@/public/images/portrait2024.png';
import classes from '@/styles/AboutPage.module.css';

// 🧠 Build-time metadata (replaces <Layout> props)
export const metadata = {
  title: 'Tietoa | Luomuliero',
  description:
    'Luomuliero tarjoaa käytännön tietoa matokompostoinnista Suomessa – kokemukseen perustuvia ohjeita ja vinkkejä kompostoijalle.',
  alternates: {
    canonical: `${SITE_URL}/tietoa`,
  },
  openGraph: {
    title: 'Tietoa | Luomuliero',
    description:
      'Luomuliero tarjoaa käytännön tietoa matokompostoinnista Suomessa – kokemukseen perustuvia ohjeita ja vinkkejä kompostoijalle.',
    url: `${SITE_URL}/tietoa`,
    images: [
      {
        url: 'https://www.luomuliero.fi/icons/apple-touch-icon.png',
        width: 180,
        height: 180,
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Tietoa | Luomuliero',
    description:
      'Luomuliero tarjoaa käytännön tietoa matokompostoinnista Suomessa – kokemukseen perustuvia ohjeita ja vinkkejä kompostoijalle.',
  },
};

// ✅ Structured data injection
const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Tietoa Luomulierosta',
    description:
      'Luomuliero tarjoaa käytännön tietoa matokompostoinnista Suomessa – kokemukseen perustuvia ohjeita ja vinkkejä kompostoijalle.',
    url: 'https://www.luomuliero.fi/tietoa',
    author: {
      '@type': 'Person',
      name: 'Joonas Niemenjoki',
      url: 'https://www.linkedin.com/in/joonasniemenjoki/',
      affiliation: {
        '@type': 'Organization',
        name: 'Luomuliero',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'Luomuliero (Joonas Niemenjoki, Y-tunnus 3002257-7)',
      logo: 'https://www.luomuliero.fi/icons/apple-touch-icon.png',
    },
    mainEntity: {
      '@type': 'WebSite',
      name: 'Luomuliero',
      url: 'https://www.luomuliero.fi',
    },
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className={classes.AboutPage}>
        <div className={classes.Info}>
          <Image
            src={portrait}
            alt="Valokuva Joonas Niemenjoesta"
            placeholder="blur"
            width={200}
            height={200}
            priority
          />
          <h1>Joonas Niemenjoki</h1>
        </div>

        <div className={classes.Bio}>
          <h2>Minusta</h2>
          <p>
            Hei, olen <strong>Joonas Niemenjoki</strong> — Luomuliero.fi-sivuston
            perustaja. Asun Järvenpäässä, olen pienen lapsen isä ja innokas
            matokompostoinnin harrastaja. Päivätyössäni ohjelmoin lämpöpumppujärjestelmiä
            ja optimoin niitä toimimaan mahdollisimman energiatehokkaasti. Kestävä
            elintapa ja luonnon kiertokulku ovat minulle tärkeitä — niistä kumpuaa koko
            Luomulieron idea.
          </p>

          <h2>Miten kaikki alkoi</h2>
          <p>
            Keväällä 2024 muutimme kerrostalosta rivitaloon ja hankimme perinteisen
            lämpökompostorin biojätteille. Alku ei mennyt putkeen: kompostori ei toiminut
            odotetusti ja jouduin opettelemaan kaiken itse. Kun löysin YouTubesta videoita{' '}
            <em>matokompostoinnista</em>, innostuin kokeilemaan. Aloitin pienellä määrällä
            kompostimatoja, ja nyt suuri osa kotimme biojätteestä kiertää niiden kautta
            takaisin maaperään.
          </p>

          <h2>Miksi perustin Luomulieron</h2>
          <p>
            Halusin jakaa käytännön kokemuksia, joita ei löydy virallisista ohjeista.
            Monet kompostointia käsittelevät sivustot tarjoavat yleisluontoista tietoa —
            minä taas kirjoitan siitä, mitä{' '}
            <strong>olen itse kokeillut ja todennut toimivaksi</strong>. Tavoitteeni on
            tehdä Luomulierosta Suomen paras paikka oppia matokompostoinnista ja innostaa
            yhä useampia kierrättämään biojätteensä helposti ja ympäristöystävällisesti.
          </p>

          <h2>Visioni</h2>
          <p>
            Toivon, että jonain päivänä matokompostointi on suomalaisille yhtä arkinen
            asia kuin jätteiden lajittelu. Näen sen osana koulujen ja päiväkotien opetusta
            konkreettisena tapana näyttää, miten luonnon kiertokulku toimii.
          </p>

          <hr />

          <p>
            <small>
              Luomuliero.fi on yksityinen harrastajavetoinen sivusto. En edusta mitään
              virallista tahoa, vaan jaan tietoa ja vinkkejä omien kokemusteni pohjalta.
            </small>
          </p>
        </div>
      </div>

      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
