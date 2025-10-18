import Image from 'next/image';
import Link from 'next/link';

import Advert from '@/components/Advert/Advert';
import PostRecommendation from '@/components/PostRecommendation/PostRecommendation';
import { getPostRecommendations } from '@/lib/posts';

import classes from './Madot.module.css';
import structuredData from './structuredData.json';

const title = 'Osta kompostimatoja – Eisenia fetida -madot matokompostointiin';
const description =
  'Tilaa kotimaisia kompostimatoja (Eisenia fetida) helposti postitettuna koko Suomeen. Aloita oma matokomposti Lieromaan madoilla!';

export async function generateMetadata() {
  const canonicalUrl = 'https://www.lieromaa.fi/madot';
  const image =
    'https://www.lieromaa.fi/images/wormspage/kompostimadot-kammenella-eisenia-fetida.jpg';

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: [
        {
          url: image,
          width: 1080,
          height: 1620,
          alt: 'Kompostimadot kämmenellä',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: '@lieromaa',
      images: [image],
    },
  };
}

export const dynamic = 'force-static';

export default async function Page() {
  const recommendedPosts = await getPostRecommendations({
    self: 'madot',
    keywords: [
      'eisenia fetida',
      'kasvit',
      'kompostorin hoito',
      'kompostorin perustaminen',
      'matojen hankinta',
      'matojen hankinta',
      'matokakka',
      'matokompostointi',
      'opas',
      'puutarha',
      'ravinteet',
      'suomi',
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.WormsPage}>
        <h1>{title}</h1>

        <div className={classes.Content}>
          <div className={classes.Flex}>
            <Image
              src="/images/wormspage/kompostimatoja_kammenella.png"
              alt="Noin 100 kompostimatoa läjässä kämmenellä"
              width={1080}
              height={1620}
              sizes="(max-width: 600px) 100vw, 800px"
              priority={false}
              loading="lazy"
              style={{ height: 'auto' }}
            />
            <div>
              <p>
                Kasvatan ja myyn kotimaisia kompostimatoja (<em>Eisenia fetida</em>)
                omasta kotikompostistani. Madot ovat täysin kotimaisia ja kasvaneet
                luonnonmukaisesti* ilman kemikaaleja.
              </p>

              <p>
                Kompostimadot ovat erinomainen tapa muuttaa biojäte ravinteikkaaksi
                mullaksi kotona. Matokompostori voidaan pitää sisätiloissa, se on hajuton
                ja helppohoitoinen. Madot hajottavat jätettä tehokkaasti, jopa oman
                painonsa verran viikossa, ja populaatio tuplaantuu noin kolmen kuukauden
                välein. Kastematoja vilkkaammin kiemurtelevat kompostimadot sopivat myös
                hyvin onkimadoiksi.
              </p>

              <p>
                Pakkaus sisältää noin 50 kompostimatoa ja niiden kasvualustaa (pahvi- ja
                puusilppu, kookoskuori, puutarhamulta).
              </p>

              <p>
                Matoja ei saa tilattua suoraan verkkosivun kautta, koska haluan varmistaa
                matojen saatavuuden ennen tilauksen vahvistamista. Toimintani on
                pienimuotoista ja joudun pitämään myynnin rajallisena, jotta matojen määrä
                omassa kompostissani ei vähene liikaa. Ota sen sijaan suoraan yhteyttä
                minuun (ohjeet alempana), niin vahvistan saatavuuden ennen maksua.
              </p>

              <h2>Hinnat</h2>
              <ul>
                <li>50 matoa 20€</li>
                <li>100 matoa 30€</li>
                <li>200 matoa 50€</li>
              </ul>

              <p>
                Jos et ole varma kuinka paljon tarvitset matoja, kokeile sivustolta
                löytyvää <Link href="/matolaskuri">matolaskuria</Link>
              </p>

              <h2>Tilaaminen</h2>
              <p>Jos haluat tilata matoja tai sinulla on kysyttävää, laita viestiä:</p>
              <ul>
                <li>
                  📧 Sähköpostitse: <strong>lieromaa@gmail.com</strong>
                </li>
                <li>
                  📸 Instagramissa:{' '}
                  <a
                    href="https://www.instagram.com/lieromaa"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @lieromaa
                  </a>
                </li>
                <li>
                  💬 WhatsAppissa:{' '}
                  <a
                    href="https://api.whatsapp.com/send?phone=358503365054&text=Hei!%20Olen%20kiinnostunut%20kompostimadoista."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Lähetä viesti WhatsAppissa
                  </a>
                </li>
              </ul>

              <h2>Toimitus ja nouto</h2>
              <p>
                Madot toimitetaan pakasterasiassa postitettuna tai ne voi noutaa
                Järvenpäästä. Suosittelen hakemaan postitetut madot heti
                saapumisilmoituksen saapuessa, koska madot voivat elää suljetussa rasiassa
                vain noin 5 vrk. Lähetän matopakkauksia vain maanantaisin ja tiistaisin,
                jotta madot eivät jää viikonlopuksi Postin kyytiin.
              </p>

              <h2>Maksaminen</h2>
              <p>
                Toivon, että tilaukset maksetaan MobilePayllä, mutta voimme sopia myös
                muista maksutavoista kuten käteinen noudon yhteydessä tai tilisiirto.
              </p>

              <p className={classes.WormsPageNote}>
                Lieromaa on kaupparekisteriin rekisteröiity toiminimi, jota käytän
                toimiessani yksityisenä elinkeinonharjoittaja (Y-tunnus: 3002257-7). En
                ole arvolisäverolain 3 § mukaan arvonlisäverovelvollinen vähäisen
                toiminnan vuoksi ja kaikki sivuston hinnat ovat näin ollen verottomia.
              </p>

              <p className={classes.WormsPageNote}>
                *Maininta “luonnonmukaisesti” viittaa omiin toimintatapoihini, kuten
                kemikaalittomaan ja kotimaiseen kasvatukseen. En kuulu Ruokaviraston,
                Ely-keskuksen tai Valviran luomuvalvontaan, enkä ole maksanut
                luomu-nimityksen käyttöoikeudesta. Kyse ei ole virallisesta
                luomusertifioidusta tuotannosta.
              </p>
            </div>
          </div>
        </div>
      </article>

      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
      <PostRecommendation
        posts={recommendedPosts}
        customTitle="Aiheeseen liittyviä blogijulkaisuja"
      />
    </>
  );
}
