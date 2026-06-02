import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';

import classes from './WormSource.module.css';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export const dynamic = 'force-static';

const breadcrumbs = [
  { name: 'Tietoa', href: '/tietoa' },
  { name: 'Mistä madot tulevat?' },
];

export default function WormSourcePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.WormSourcePage}>
        <Breadcrumbs items={breadcrumbs} />

        <div className={classes.Content}>
          <section className={classes.Hero}>
            <div className={classes.HeroCopy}>
              <p className={classes.Eyebrow}>Lieromaan madot</p>
              <h1>Mistä Lieromaan kompostimadot tulevat?</h1>
              <p className={classes.Lead}>
                Lieromaan kompostimadot kasvavat kotonani, lämmitetyssä autotallissa.
                Tällä sivulla on tietoa ja kuvia omista kompostoreistani ja tilausten
                käsittelypaikasta.
              </p>
            </div>

            <figure className={classes.HeroImage}>
              <SafeImage
                src="/images/content/lieromaan_matojen_hoitopiste.avif"
                alt="Lieromaan matojen hoitopiste, pakkauspöytä ja matokompostorit lämmitetyssä kotitallissa"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 42rem"
                priority
              />
              <figcaption className={classes.Caption}>
                Samalla pöydällä tarkistan kompostorit, punnitsen tilaukset ja pakkaan
                madot matkaan.
              </figcaption>
            </figure>
          </section>

          <section className={classes.FeatureSection}>
            <div className={classes.TextStack}>
              <h2>Pienestä alusta omaan järjestelmään</h2>
              <p>
                Aloitin keväällä 2024 noin tuhannella kompostimadolla. Nyt pääjärjestelmä
                on kolmen noin 50 litran laatikon pino, joka toimii samalla
                läpivirtausperiaatteella kuin Lieromaan{' '}
                <SafeLink href="/tuotteet/matokompostin-aloituspakkaus">
                  matokompostorin aloituspakkaus
                </SafeLink>
                .
              </p>
              <p>
                Kolme pienempää 14 litran laatikkoa ovat erillisiä varmistus- ja
                kokeilukompostoreita. Niissä testaan esimerkiksi petimateriaaleja ja
                ilmanvaihdon vaikutusta kosteuden hallintaan. Tärkein tehtävä on kuitenkin
                varmistus: kaikki madot eivät ole yhden järjestelmän varassa, jos jotain
                odottamatonta tapahtuu.
              </p>
            </div>

            <dl className={classes.FactList}>
              <div className={classes.Fact}>
                <dt>Alku</dt>
                <dd>Noin 1000 matoa keväällä 2024.</dd>
              </div>
              <div className={classes.Fact}>
                <dt>Pääkompostori</dt>
                <dd>Kolmen noin 50 litran laatikon läpivirtausjärjestelmä.</dd>
              </div>
              <div className={classes.Fact}>
                <dt>Varmistus</dt>
                <dd>Kolme erillistä 14 litran kokeilukompostoria.</dd>
              </div>
            </dl>
          </section>

          <section className={classes.SplitSection}>
            <figure className={classes.ImageFrame}>
              <SafeImage
                src="/images/content/lieromaan_paakompostorin_aktiivinen_kerros.avif"
                alt="Lieromaan pääkompostorin aktiivinen kerros, jossa näkyy petimateriaalia ja yksi kompostimato"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 32rem"
              />
              <figcaption className={classes.Caption}>
                Pääkompostorin aktiivinen kerros ei ole kaunis, eikä sen tarvitsekaan
                olla, kunhan se toimii.
              </figcaption>
            </figure>

            <div className={classes.TextStack}>
              <h2>Maanantai on matopäivä</h2>
              <p>
                Maanantai on Lieromaan matojen hoito- ja lähetyspäivä. Avaan laatikot,
                katson mitä kompostissa tapahtuu ja möyhin petimateriaalia, jotta se pysyy
                ilmavana. Jos komposti tuntuu liian kostealta, lisään kuivaa
                petimateriaalia.
              </p>
              <p>
                Ruokintaa varten kerään viikon aikana kotimme biojätettä pakastimeen.
                Yleensä madot saavat noin viisi litraa ruokajätettä viikossa, mutta en
                mittaa määrää tarkasti. Jos biojätettä on vähän, käytän tarvittaessa
                erillistä{' '}
                <SafeLink href="/tuotteet/kompostorin-kuituseos">kuituseosta</SafeLink>{' '}
                lisäravintona.
              </p>
            </div>
          </section>

          <section className={classes.SplitSection}>
            <div className={classes.TextStack}>
              <h2>Miten tilauksen madot kerätään?</h2>
              <p>
                Kun tilauksia on, laitan pakkausrasiaan tuoretta kosteaa petimateriaalia,
                asetan rasian vaa'alle ja taaraan vaa'an. Sen jälkeen kerään
                kompostimatoja kompostorista, kunnes vaaka näyttää asiakkaan tilaaman
                painon.
              </p>
              <p>
                Mukaan tulee myös materiaalia aktiivisesta kompostorista, jotta matojen
                mukana uuteen matokompostoriin siirtyy hyödyllistä mikrobielämää.
              </p>
            </div>

            <figure className={classes.ImageFrame}>
              <SafeImage
                src="/images/content/kompostimadot_petimateriaalissa_kadella.avif"
                alt="Kompostimatoja kosteassa petimateriaalissa hansikkaalla kädellä"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 32rem"
              />
              <figcaption className={classes.Caption}>
                Tilattavat madot poimitaan suoraan toimivasta matokompostista.
              </figcaption>
            </figure>
          </section>

          <section className={classes.FeatureSection}>
            <div className={classes.TextStack}>
              <h2>Miksi erilliset kokeilulaatikot ovat mukana?</h2>
              <p>
                Pienissä 14 litran kompostoreissa madot prosessoivat materiaalia
                rauhallisemmin kuin pääpinossa. Kun laatikko on valmis, kerään matokakan
                valoerottelulla ja käynnistän laatikon uudelleen.
              </p>
            </div>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Petimateriaalin kokeilut</h3>
                <p>
                  Olen testannut esimerkiksi kookoskuitua ja silputtua pahvia. Kokeilut
                  auttavat näkemään, miten eri materiaalit käyttäytyvät oikeassa
                  kompostissa.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>Ilmanvaihto ja kosteus</h3>
                <p>
                  Olen porannut pieniä laatikoita eri tavoilla, jotta näen miten
                  ilmanvaihto vaikuttaa kosteuteen ja kompostin tuntumaan.
                </p>
              </div>
              <div className={classes.InfoCard}>
                <h3>Varmistus odottamattomia tilanteita varten</h3>
                <p>
                  Pienet kompostorit ovat varajärjestelmä. Jos pääpinolle tapahtuisi
                  jotain yllättävää, kaikki madot eivät olisi samassa kompostorissa.
                </p>
              </div>
            </div>
          </section>

          <section className={classes.SplitSection}>
            <figure className={classes.ImageFrame}>
              <SafeImage
                src="/images/content/pahvi_ja_kookoskuitu_petimateriaalina.avif"
                alt="Kaksi pientä matokompostoria, joissa vertaillaan silputtua pahvia ja kookoskuitua petimateriaalina"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 32rem"
              />
              <figcaption className={classes.Caption}>
                Kookoskuitu ja silputtu pahvi käyttäytyvät eri tavoin, joten kokeilen
                molempia käytännössä.
              </figcaption>
            </figure>

            <figure className={classes.ImageFrame}>
              <SafeImage
                src="/images/content/kompostimadot_pahvipetimateriaalissa.avif"
                alt="Kompostimatoja silputun pahvin päällä pienessä kokeilukompostorissa"
                width={1200}
                height={900}
                sizes="(max-width: 760px) 100vw, 32rem"
              />
              <figcaption className={classes.Caption}>
                Myös pienissä kokeilulaatikoissa tärkeintä on, että madot voivat hyvin.
              </figcaption>
            </figure>
          </section>
        </div>
      </article>
    </>
  );
}
