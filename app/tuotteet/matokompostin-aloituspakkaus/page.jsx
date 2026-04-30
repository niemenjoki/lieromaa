import ImageSlider from '@/components/ImageSlider/ImageSlider';
import SafeLink from '@/components/SafeLink/SafeLink';
import {
  formatPrice,
  getProductShippingOptions,
  getProductVariants,
} from '@/lib/pricing/catalog';
import { starterKitPageContent } from '@/lib/products/starterKitPageContent';
import { ORDER_CONTACT_EMAIL } from '@/lib/site/contact';

import AddToCartPanel from '../AddToCartPanel';
import classes from '../ProductPage.module.css';
import ProductReviewsSection from '../ProductReviewsSection';
import VariantPriceDisplay from '../VariantPriceDisplay';
import { faqItems, galleryImages, h1 } from './pageMetadata';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export const dynamic = 'force-static';

const starterKitVariants = getProductVariants('starterKit');
const wormVariants = getProductVariants('worms');
const starterKitShippingOptions = getProductShippingOptions('starterKit');
const starterKitPickupOption =
  starterKitShippingOptions.find((option) => option.id === 'posti_noutopiste') ?? null;
const starterKitHomeOption =
  starterKitShippingOptions.find((option) => option.id === 'posti_kotiinkuljetus') ??
  null;
const starterKitLocalPickupOption =
  starterKitShippingOptions.find((option) => option.id === 'nouto') ?? null;
const starterKitComponentCosts = starterKitPageContent.componentCosts;
const starterKitComponentCostTotal = Number(
  starterKitComponentCosts.reduce((sum, item) => sum + item.price, 0).toFixed(2)
);
const starterKitBasePrice = Math.ceil(starterKitComponentCostTotal);

function formatWormPackageLabel(variant) {
  const weight = variant.weightGrams ?? variant.amount;
  const estimate = variant.estimatedWormCount
    ? ` (noin ${variant.estimatedWormCount} matoa)`
    : '';

  return `${weight} g${estimate}`;
}

export default async function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <article className={classes.ProductPage}>
        <h1>{h1}</h1>

        <div className={classes.Content}>
          <section className={classes.ProductHero}>
            <ImageSlider images={galleryImages} />

            <div className={classes.HeroDetails}>
              <div className={classes.HeroText}>
                <p className={classes.Lead}>
                  Tämä aloituspakkaus on suunniteltu niille, jotka haluavat
                  matokompostorin, jonka ylläpito on mahdollisimman sujuvaa arjessa.
                </p>
                <p>
                  Paketissa on kompostorilaatikot ja petimateriaali. Voit lisätä samaan
                  tilaukseen kuituseoksen, jos haluat ottaa myös ylläpidon lisäseoksen
                  mukaan heti alussa.
                </p>
                <p>
                  Kolmen laatikon pinottu kompostori tekee ylläpidosta vaivatonta:
                  ruokajäte lisätään aina ylimpään laatikkoon ja valmis matokakka kerätään
                  alimmasta, kun madot ovat siirtyneet ylempään kerrokseen. Koko
                  järjestelmää ei tarvitse tyhjentää tai käynnistää uudelleen sadonkorjuun
                  jälkeen.
                </p>
              </div>

              <aside className={classes.SummaryCard}>
                <h2>Tilaa helposti</h2>
                <ul className={classes.FeatureList}>
                  <li>Kompostori ja petimateriaali samassa paketissa.</li>
                  <li>Kolmen laatikon malli helpottaa ruokintaa ja sadonkorjuuta.</li>
                </ul>

                <h3>Hinta</h3>
                <ul className={classes.PriceList}>
                  {starterKitVariants.map((variant) => (
                    <li key={variant.sku}>
                      <VariantPriceDisplay title="Aloituspakkaus" variant={variant} />
                    </li>
                  ))}
                </ul>

                <p className={classes.HelperText}>
                  Laske taloudellesi sopiva aloitusmäärä{' '}
                  <SafeLink href="/matolaskuri">matolaskurilla.</SafeLink>
                </p>
                <p className={classes.HelperText}>
                  Katso aloituspakkauksen{' '}
                  <SafeLink href="/tuotteet/matokompostin-aloituspakkaus/kayttoonotto">
                    käyttöönotto-ohje.
                  </SafeLink>
                </p>

                <a
                  className={classes.PrimaryCTA}
                  href="#tilaa"
                  data-analytics-cta="order"
                >
                  Siirry tilaamaan
                </a>
              </aside>
            </div>
          </section>

          <ProductReviewsSection productKey="starterKit" />

          <section id="kenelle" className={classes.SectionStack}>
            <h2>Kenelle aloituspakkaus sopii?</h2>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Hyvä valinta, jos haluat helpottaa ylläpitoa</h3>
                <ul className={classes.CleanList}>
                  <li>
                    lisätä biojätteen aina ylimpään aktiiviseen laatikkoon ilman koko
                    kompostorin läpikäyntiä
                  </li>
                  <li>
                    kerätä valmista matokakkaa alimmasta laatikosta, kun madot ovat
                    siirtyneet ylempään kerrokseen
                  </li>
                  <li>
                    rakenteen, jossa sadonkorjuu ei aiheuta yksilaatikkoisen kompostorin
                    resetointia
                  </li>
                </ul>
              </div>

              <div id="sisalto" className={classes.InfoCard}>
                <h3>Mitä paketti sisältää</h3>
                <ul className={classes.CleanList}>
                  <li>3 kestävää 14 L muovilaatikkoa, valmiiksi porattuina</li>
                  <li>valmiiksi mitattu määrä petimateriaalia</li>
                  <li id="mitat">koottuna leveys 30 cm, syvyys 40 cm, korkeus 27 cm</li>
                </ul>
                <p>
                  <SafeLink href="/tuotteet/matokompostin-aloituspakkaus/kayttoonotto">
                    Katso käyttöönotto-ohjeet
                  </SafeLink>
                </p>
              </div>
            </div>
          </section>

          <section id="toimitus" className={classes.SectionStack}>
            <h2>Ennen tilausta</h2>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Maksaminen</h3>
                <p>
                  Kun tilaat aloituspakkauksen, lähetän manuaalisen tilausvahvistuksen
                  viimeistään kahden päivän kuluessa. Jos lisäät mukaan kompostimatoja,
                  varmistan samalla niiden saatavuuden.
                </p>
                <p>
                  Lasku tulee OP Kevytyrittäjä -palvelun kautta sähköpostiin.{' '}
                  <strong>Maksuaika on 7 vuorokautta.</strong>
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>Toimitus</h3>
                <p>
                  Aloituspakkaus toimitetaan Postin noutopisteeseen, kotiinkuljetuksella
                  tai noutona Järvenpäästä. Jos tilaukseen kuuluu eläviä kompostimatoja,
                  lähetän tilauksen maanantaina, jotta madot eivät jää postin varastoon
                  viikonlopuksi.
                </p>
                <p>
                  Toimitustavoiksi voit valita{' '}
                  <strong>
                    {starterKitPickupOption?.label} (
                    {formatPrice(starterKitPickupOption?.price ?? 0)} €)
                  </strong>
                  ,{' '}
                  <strong>
                    {starterKitHomeOption?.label} (
                    {formatPrice(starterKitHomeOption?.price ?? 0)} €)
                  </strong>{' '}
                  tai{' '}
                  <strong>
                    {starterKitLocalPickupOption?.label} (
                    {formatPrice(starterKitLocalPickupOption?.price ?? 0)} €)
                  </strong>
                  .
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>Palautukset</h3>
                <p>
                  Aloituspakkauksella on 14 päivän peruuttamisoikeus käyttämättömän
                  tuotteen osalta. Jos lisäät tilaukseen kompostimatoja, niiden
                  peruuttamisoikeus arvioidaan erikseen, koska kyse on elävistä
                  kompostimadoista.
                </p>
                <p>
                  Tarkemmat ehdot löytyvät{' '}
                  <SafeLink href="/tilausehdot">tilaus- ja toimitusehdoista</SafeLink>.
                </p>
              </div>
            </div>
          </section>

          <section id="tilaa" className={classes.OrderSection}>
            <div className={classes.OrderSectionHeader}>
              <h2>Tilaa aloituspakkaus</h2>
            </div>

            <AddToCartPanel
              productKey="starterKit"
              showWormSuggestion
              relatedProductKeys={['compostChow']}
            />
          </section>

          <section id="miksi-lapivirtaus" className={classes.SectionStack}>
            <h2>Miksi läpivirtauskompostori on toimiva valinta</h2>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Yksilaatikkoisen kompostorin rytmi</h3>
                <p>
                  Yksilaatikkoisessa kompostorissa kaikki materiaali prosessoituu samassa
                  tilassa, johon uutta biojätettä lisätään. Ennen matokakan keräämistä on
                  yleensä odotettava useita kuukausia, että koko kompostorin sisältö on
                  prosessoitunut.
                </p>
                <p>
                  Sen jälkeen koko kompostori tyhjennetään, täytetään petimateriaalilla ja
                  odotus aloitetaan uudestaan.
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>Läpivirtausmallin etu</h3>
                <p>
                  Kolmen laatikon pinotussa mallissa aktiivinen käsittely tapahtuu vain
                  ylimmässä ruokintakerroksessa. Kun ylin kerros on suurimmaksi osaksi
                  käsitelty, sen päälle lisätään uusi kerros ja madot siirtyvät vähitellen
                  ylöspäin ravinnon perässä.
                </p>
                <p>
                  Materiaali ei siirry laatikosta toiseen itsestään, vaan alemmat
                  kerrokset sisältävät aiemmin käsiteltyä materiaalia, joka tekeytyy
                  rauhassa matojen siirtyessä ylempiin kerroksiin. Kun alin kerros on
                  valmis ja kerätty, ylempien kerrosten sisältö siirretään käsin yhden
                  tason alas ja ylimpään laatikkoon lisätään uusi petimateriaali.
                </p>
              </div>
            </div>
          </section>

          <section id="eka-viikot" className={classes.SectionStack}>
            <h2>Miltä ensimmäiset viikot näyttävät?</h2>

            <div className={classes.InfoCard}>
              <p>
                Ensimmäiset viikot ovat asettumisvaihe. Madot totuttelevat uuteen
                ympäristöön ja kompostin mikrobiologia käynnistyy vähitellen.
              </p>

              <ul className={classes.CleanList}>
                <li>
                  On tavallista, että osa madoista yrittää aluksi kiivetä reunoja pitkin
                  eivätkä syö biojätettä ollenkaan. Tilanne tasoittuu tavallisesti 1–2
                  viikon aikana.
                </li>
                <li>
                  Ruokaa lisätään varsinkin aluksi pieninä annoksina ja määrää kasvatetaan
                  vasta, kun edellinen jäte on kokonaan kadonnut kompostorista.
                </li>
                <li>
                  Madot selviävät useita viikkoja pelkällä kostealla petimateriaalilla.
                  Jos olet epävarma ruokamäärästä, on turvallisempaa lisätä liian vähän
                  kuin liikaa jätettä.
                </li>
                <li>Mieto metsämäinen tuoksu kertoo, että komposti on kunnossa.</li>
                <li>
                  Pieni määrä nestettä tai tiivistymistä on normaalia, kunhan massa ei ole
                  vetinen.
                </li>
              </ul>
            </div>
          </section>

          <section id="hinnoittelu" className={classes.SectionStack}>
            <h2>Mistä hinta muodostuu</h2>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Perusosa ilman matoja</h3>
                <p>
                  Haluan hinnoitella paketin läpinäkyvästi. Alla on perusosan
                  kustannusrakenne ilman matoja.
                </p>
                <ul className={classes.CleanList}>
                  {starterKitComponentCosts.map((item) => (
                    <li key={item.label}>
                      {item.label}: {formatPrice(item.price)} €
                    </li>
                  ))}
                  <li>
                    <strong>
                      Yhteensä: {formatPrice(starterKitComponentCostTotal)} €
                    </strong>
                  </li>
                </ul>
              </div>

              <div className={classes.InfoCard}>
                <h3>Kompostimadot lisätään erikseen</h3>
                <p>
                  Perusosa on hinnoiteltu {formatPrice(starterKitBasePrice)} euroon.
                  Kompostimadot voi lisätä ostoskoriin samalla hinnalla kuin erikseen
                  myytävissä matopaketeissa:
                </p>
                <ul className={classes.CleanList}>
                  {wormVariants.map((variant) => (
                    <li key={variant.sku}>
                      <VariantPriceDisplay
                        title={`+ ${formatWormPackageLabel(variant)}`}
                        variant={variant}
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className={classes.InfoCard}>
                <h3>Tilauksen kokoaminen</h3>
                <ul className={classes.CleanList}>
                  <li>lisää ostoskoriin aloituspakkaus</li>
                  <li>valitse halutessasi yksi matopaketti mukaan</li>
                  <li>lisää halutessasi kuituseos kompostin ylläpitoon</li>
                </ul>
                <p>
                  Työosuus sisältyy perusosan hintaan, loput kulut muodostuvat
                  materiaaleista.
                </p>
              </div>
            </div>
          </section>

          <section id="faq" className={classes.SectionStack}>
            <h2>Usein kysytyt kysymykset</h2>

            <div className={classes.CardGrid}>
              {faqItems.map((item) => (
                <div key={item.question} className={classes.InfoCard}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="yhteys" className={classes.SectionStack}>
            <div className={classes.InfoCard}>
              <h2>Kysy ennen tilausta</h2>
              <p>
                Voit kysyä aloituspakkauksesta myös suoraan:{' '}
                <strong>{ORDER_CONTACT_EMAIL}</strong>
              </p>
            </div>
          </section>
        </div>
      </article>
    </>
  );
}
