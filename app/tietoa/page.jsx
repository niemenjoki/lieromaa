import Advert from '@/components/Advert/Advert';
import SafeImage from '@/components/SafeImage/SafeImage';
import portrait from '@/public/images/portrait2024.avif';

import classes from './Tietoa.module.css';
import structuredData from './structuredData.json';

export { default as generateMetadata } from './generateMetadata';

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
          <SafeImage
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
            Hei, olen <strong>Joonas Niemenjoki</strong> — Lieromaa.fi-sivuston perustaja.
            Asun Järvenpäässä, olen pienen lapsen isä ja innokas matokompostoinnin
            harrastaja. Päivätyössäni ohjelmoin lämpöpumppujärjestelmiä ja optimoin niitä
            toimimaan mahdollisimman energiatehokkaasti. Kestävä elintapa ja luonnon
            kiertokulku ovat minulle tärkeitä — niistä kumpuaa koko Lieromaan idea.
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

          <h2>Miksi perustin Lieromaan</h2>
          <p>
            Halusin jakaa käytännön kokemuksia, joita ei löydy virallisista ohjeista.
            Monet kompostointia käsittelevät sivustot tarjoavat yleisluontoista tietoa —
            minä taas kirjoitan siitä, mitä{' '}
            <strong>olen itse kokeillut ja todennut toimivaksi</strong>. Tavoitteeni on
            tehdä Lieromaasta Suomen paras paikka oppia matokompostoinnista ja innostaa
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
              Lieromaa.fi on yksityinen harrastajavetoinen sivusto. En edusta mitään
              virallista tahoa, vaan jaan tietoa ja vinkkejä omien kokemusteni pohjalta.
            </small>
          </p>
        </div>
      </div>

      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
