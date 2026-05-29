import Breadcrumbs from '@/components/Breadcumbs/Breadcrumbs';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import SafeLink from '@/components/SafeLink/SafeLink';
import {
  formatPrice,
  getProductShippingOptions,
  getProductVariants,
} from '@/lib/pricing/catalog';
import { ORDER_CONTACT_EMAIL } from '@/lib/site/contact';

import AddToCartPanel from '../AddToCartPanel';
import classes from '../ProductPage.module.css';
import ProductReviewsSection from '../ProductReviewsSection';
import VariantPriceDisplay from '../VariantPriceDisplay';
import { breadcrumbItems, faqItems, galleryImages, h1 } from './pageMetadata';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export const dynamic = 'force-static';

const starterKitVariants = getProductVariants('starterKit').filter(
  (variant) => !variant.hideFromVariantSelector
);
const wormVariants = getProductVariants('worms');
const starterKitShippingOptions = getProductShippingOptions('starterKit');
const starterKitPickupOption =
  starterKitShippingOptions.find((option) => option.id === 'posti_noutopiste') ?? null;
const starterKitHomeOption =
  starterKitShippingOptions.find((option) => option.id === 'posti_kotiinkuljetus') ??
  null;
const starterKitLocalPickupOption =
  starterKitShippingOptions.find((option) => option.id === 'nouto') ?? null;

function formatWormPackageLabel(variant) {
  const weight = variant.weightGrams ?? variant.amount;
  const estimate = variant.estimatedWormCount
    ? ` (noin ${variant.estimatedWormCount} matoa)`
    : '';

  return `${weight} g${estimate}`;
}

function formatBoxCount(count) {
  const numericCount = Number(count) || 0;
  return numericCount === 1 ? '1 laatikko' : `${numericCount} laatikkoa`;
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
        <Breadcrumbs items={breadcrumbItems} />
        <h1>{h1}</h1>

        <div className={classes.Content}>
          <section className={classes.ProductHero}>
            <ImageSlider images={galleryImages} />

            <div className={classes.HeroDetails}>
              <div className={classes.HeroText}>
                <p className={classes.Lead}>
                  Tämä aloituspakkaus on suunniteltu niille, jotka haluavat aloittaa
                  matokompostoinnin valmiiksi valmistellulla laatikkomallilla ja laajentaa
                  samaa järjestelmää myöhemmin tarvittaessa.
                </p>
                <p>
                  Valitse tilaukseen yksi, kaksi tai kolme laatikkoa. Mukana tulee kansi
                  ja kookoskuitua uuden kompostorin käynnistämiseen. Voit lisätä
                  ostoskoriin myös kompostimadot ja Lieromaan{' '}
                  <SafeLink href="/tuotteet/kompostorin-kuituseos">
                    kuituseoksen,
                  </SafeLink>{' '}
                  jos haluat varautua biojätteen määrän vaihteluun.
                </p>
                <p>
                  Yhden laatikon malli on edullisin tapa kokeilla. Kahden ja kolmen
                  laatikon mallit helpottavat kierron rakentamista, kun komposti kasvaa ja
                  haluat erottaa aktiivisen ruokintakerroksen kypsyvästä materiaalista.
                </p>
              </div>

              <aside className={classes.SummaryCard}>
                <h2>Tilaa helposti</h2>
                <ul className={classes.FeatureList}>
                  <li>Valitse 1, 2 tai 3 laatikkoa</li>
                  <li>Laatikot, kansi ja kookoskuitu toimitetaan samassa paketissa.</li>
                  <li>
                    Useamman laatikon avulla voit luoda läpivirtauskompostorin, mikä
                    helpottaa matokakan keräystä.
                  </li>
                </ul>

                <h3>Hinta</h3>
                <ul className={classes.PriceList}>
                  {starterKitVariants.map((variant) => (
                    <li key={variant.sku}>
                      <VariantPriceDisplay
                        title={formatBoxCount(variant.binCount ?? variant.amount)}
                        variant={variant}
                      />
                    </li>
                  ))}
                </ul>

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
                <h3>1 laatikko: edullinen kokeilu</h3>
                <p>
                  Sopii pienelle biojätemäärälle ja matokompostoinnin kokeiluun.
                  Matokakkaa 3-4 kuukauden välein.
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>2 laatikkoa: tilaa kasvuun</h3>
                <p>
                  Matokakka kerätään 2-3 kuukauden välein alemmasta laatikosta ylemmän
                  kerroksen yhä prosessoituessa.
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>3 laatikkoa: sujuvin arki</h3>
                <p>
                  Matokakkaa voi kerätä 1-2 kuukauden välein alimmasta laatikosta,
                  ylempien prosessoituessa.
                </p>
              </div>
            </div>
          </section>

          <section id="sisalto" className={classes.SectionStack}>
            <h2>Mitä paketti sisältää?</h2>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Laatikot mallin mukaan</h3>
                <ul className={classes.CleanList}>
                  <li>
                    1 laatikko: 1 umpipohjainen kompostorilaatikko, petimateriaali ja
                    kansi
                  </li>
                  <li>
                    2 laatikkoa: 1 umpipohjainen ja 1 rei'itetty kompostorilaatikko,
                    petimateriaali kumpaankin laatikkoon ja kansi
                  </li>
                  <li>
                    3 laatikkoa: 1 umpipohjainen ja 2 rei'itettyä kompostorilaatikkoa,
                    petimateriaali jokaiseen laatikkoon ja kansi
                  </li>
                </ul>
              </div>

              <div className={classes.InfoCard}>
                <h3>Kaikissa malleissa</h3>
                <ul className={classes.CleanList}>
                  <li>kestävät 14 L muovilaatikot, valmiiksi valmisteltuina</li>
                  <li>valmiiksi mitattu määrä kookoskuitua petimateriaaliksi</li>
                  <li id="mitat">yhden laatikon ulkomitat 40 x 30 x 19 cm</li>
                  <li>pinottuna jokainen lisälaatikko kasvattaa korkeutta noin 4 cm</li>
                  <li>2 laatikkoa pinottuna noin 23 cm, 3 laatikkoa noin 27 cm</li>
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
                  normaalisti viimeistään kahden päivän kuluessa. Jos lisäät mukaan
                  kompostimatoja, varmistan samalla niiden saatavuuden.
                </p>
                <p>
                  Lasku tulee OP Kevytyrittäjä -palvelun kautta sähköpostiin.{' '}
                  <strong>
                    Maksuaika on 7 vuorokautta tilauksen noudosta tai postituksesta.
                  </strong>
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>Toimitus</h3>
                <p>
                  Lähetän matoja sisältäviä tilauksia vain maanantaisin, jotta madot eivät
                  jää postin varastoon viikonlopuksi.
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
                  Aloituspakkauksella on 14 päivän peruuttamisoikeus käyttämättömälle
                  tuotteelle.
                </p>
                <p>
                  Postitettuja matotilauksia ei voi peruuttaa, koska kompostimatoja ei
                  voida palautuksen jälkeen käsitellä tai myydä edelleen tavanomaisena
                  tuotteena. Muilla tuotteilla on kuitenkin normaali peruuttamisoikeus,
                  vaikka ne olisi tilattu samassa tilauksessa matojen kanssa.
                </p>
                <p>
                  Jos tuotteessa tai toimituksessa on virhe, ole yhteydessä suoraan
                  asiakaspalveluun. Tarkemmat ehdot löytyvät{' '}
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
            <h2>Miksi valita useampi laatikko?</h2>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Yksi laatikko pitää aloituksen pienenä</h3>
                <p>
                  Yksi laatikko sopii kokeiluun ja pienelle biojätemäärälle. Komposti
                  käynnistyy samalla tavalla kuin isommissa malleissa: ensin rakennetaan
                  yksi kostea petikerros ja ruokinta pidetään maltillisena.
                </p>
                <p>
                  Kun komposti kasvaa, samaan järjestelmään voi lisätä uusia laatikoita ja
                  siirtää ruokinnan seuraavaan kerrokseen.
                </p>
              </div>

              <div className={classes.InfoCard}>
                <h3>Lisälaatikot helpottavat kiertoa</h3>
                <p>
                  Kun uusi rei'itetty laatikko lisätään päälle, ruokinta siirtyy ylimpään
                  kerrokseen ja alempi kerros saa kypsyä rauhallisemmin. Madot hakeutuvat
                  vähitellen uutta ruokaa kohti.
                </p>
                <p>
                  Kolmen laatikon malli antaa eniten joustoa: ylhäällä on aktiivinen
                  ruokintakerros, keskellä siirtyvä kerros ja alimpana kypsyvä materiaali,
                  joka on helpompi ottaa talteen oikeaan aikaan.
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
                  Madot selviävät useita viikkoja kompostorin omalla kostealla
                  petimateriaalilla. Jos olet epävarma ruokamäärästä, on turvallisempaa
                  lisätä liian vähän kuin liikaa jätettä.
                </li>
                <li>Mieto metsämäinen tuoksu kertoo, että komposti on kunnossa.</li>
                <li>
                  Pieni määrä nestettä tai tiivistymistä on normaalia, kunhan massa ei ole
                  vetinen.
                </li>
              </ul>
              <p>
                Jos haluat viikko viikolta etenevän aloitusrytmin, katso opas{' '}
                <SafeLink href="/opas/kompostorin-hoito/ensimmaiset-30-paivaa-matokompostorin-kaynnistys">
                  Ensimmäiset 30 päivää uudessa matokompostorissa
                </SafeLink>
                .
              </p>
            </div>
          </section>

          <section id="hinnoittelu" className={classes.SectionStack}>
            <h2>Mallien hinnat</h2>

            <div className={classes.CardGrid}>
              <div className={classes.InfoCard}>
                <h3>Aloituspakkaus ilman matoja</h3>
                <p>
                  Kaikissa malleissa on mukana valitsemasi laatikot, yksi kansi ja
                  kookoskuitua käynnistämiseen. Kompostimadot lisätään ostoskoriin
                  erikseen, jos tarvitset ne mukaan.
                </p>
                <ul className={classes.CleanList}>
                  {starterKitVariants.map((variant) => (
                    <li key={variant.sku}>
                      {formatBoxCount(variant.binCount ?? variant.amount)}:{' '}
                      {formatPrice(variant.price)} €
                    </li>
                  ))}
                </ul>
              </div>

              <div className={classes.InfoCard}>
                <h3>Kompostimadot lisätään erikseen</h3>
                <p>
                  Kompostimadot voi lisätä ostoskoriin samalla hinnalla kuin erikseen
                  myytävissä matopaketeissa.
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
