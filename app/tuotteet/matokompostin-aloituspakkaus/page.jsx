import Advert from '@/components/Advert/Advert';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import SafeLink from '@/components/SafeLink/SafeLink';
import { STARTER_KIT_SHIPPING_SCHEDULE_TEXT } from '@/data/commerce/shippingSchedule.mjs';
import { starterKitPageContent } from '@/data/pages/products/starterKit.js';
import { ORDER_CONTACT_EMAIL } from '@/data/site/contact';
import {
  formatPrice,
  getProductShippingOptions,
  getProductVariants,
} from '@/lib/pricing/catalog';

import ProductOrderForm from '../ProductOrderForm';
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
const starterKitComponentCosts = starterKitPageContent.componentCosts;
const starterKitComponentCostTotal = Number(
  starterKitComponentCosts.reduce((sum, item) => sum + item.price, 0).toFixed(2)
);
const starterKitBasePrice = Math.ceil(starterKitComponentCostTotal);

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
          <ImageSlider maxWidth="800px" images={galleryImages} />

          <section>
            <p>
              Tämä aloituspakkaus on suunniteltu sinulle, joka haluat aloittaa
              matokompostoinnin suoraan toimivalla kokonaisuudella. Kaikki tarvittava on
              mukana - kompostorilaatikot, valmiiksi mitattu kookoskuitu petimateriaaliksi
              sekä tietenkin valitsemasi määrä kompostimatoja. Sinun tarvitsee lisätä
              vettä sekaan ja siirtää madot uuteen kotiinsa.
            </p>

            <p>
              Aloituspakkauksen kolmen laatikon läpivirtauskompostori tekee arjesta
              vaivatonta. Toisin kuin yksilaatikkoisessa ratkaisussa, kompostia ei
              tarvitse tyhjentää kerralla, vaan ruokajäte lisätään ylimpään laatikkoon ja
              valmis matokakka kerätään alimmasta. Rakenne tukee jatkuvaa matokakan
              "virtausta", hyvää ilman kiertoa ja kosteuden hallintaa, mikä auttaa
              pitämään olosuhteet tasaisina ja kompostoinnin käynnissä.
            </p>
          </section>

          <aside>
            <h3>Paketit ja hinnat</h3>
            <ul>
              {starterKitVariants.map((variant) => (
                <li key={variant.sku}>
                  <VariantPriceDisplay
                    title={`Aloituspakkaus + ${variant.amount} matoa`}
                    variant={variant}
                  />
                </li>
              ))}
              <li>
                {starterKitShippingOptions
                  .map((option) => `${option.label} ${formatPrice(option.price)} €`)
                  .join(' tai ')}
              </li>
            </ul>
            <p className={classes.HelperText}>
              Laske sopiva määrä <SafeLink href="/matolaskuri">matolaskurilla</SafeLink>
            </p>
            <p className={classes.HelperText}>
              Katso vaiheittainen{' '}
              <SafeLink href="/tuotteet/matokompostin-aloituspakkaus/kayttoonotto">
                käyttöönotto-ohje
              </SafeLink>
            </p>
            <a className={classes.PrimaryCTA} href="#tilaa" data-analytics-cta="order">
              Tilaa aloituspakkaus
            </a>
          </aside>

          <section id="kenelle">
            <h2>Kenelle aloituspakkaus sopii?</h2>
            <ul>
              <li>
                Ensimmäiseksi matokompostoriksi, kun haluat tehdä siitä mahdollisimman
                helppoa ja pitkäjänteistä
              </li>
              <li>Kerros-, rivi- tai omakotitaloon biojätteen käsittelyyn</li>
              <li>
                Harrastajalle, joka arvostaa selkeää kiertoa ja valmiiksi testattua
                rakennetta
              </li>
            </ul>
          </section>

          <section id="miksi-lapivirtaus">
            <h2>Miksi läpivirtauskompostori on toimiva valinta</h2>

            <p>
              Yksilaatikkoisessa kompostorissa kaikki materiaali prosessoituu samassa
              tilassa, johon uutta biojätettä lisätään. Ennen matokakan keräämistä on
              yleensä odotettava useita kuukausia, että koko kompostorin sisältö on
              prosessoitunut. Sen jälkeen koko kompostori tyhjennetään, täytetään
              petimateriaalilla ja odotus aloitetaan uudestaan.
            </p>

            <p>
              Kolmen laatikon läpivirtausmallissa kompostointi etenee kerroksittain. Ruoka
              lisätään aina ylimpään laatikkoon ja madot siirtyvät vähitellen ylöspäin
              ravinnon perässä. Kypsä matokakka siirtyy pikkuhiljaa kohti alinta kerrosta,
              josta sen voi kerätä ilman koko järjestelmän pysäyttämistä, vaikka ylin
              kerros olisi vielä täynnä prosessoimatonta materiaalia.
            </p>
          </section>

          <section id="eka-viikot">
            <h2>Miltä ensimmäiset viikot näyttävät?</h2>

            <p>
              Ensimmäiset viikot ovat asettumisvaihe. Madot totuttelevat uuteen
              ympäristöön ja kompostin mikrobiologia käynnistyy vähitellen.
            </p>

            <ul>
              <li>
                On tavallista, että osa madoista yrittää aluksi kiivetä reunoja pitkin
                eivätkä syö biojätettä ollenkaan - tämä on normaalia ja tilanne tasoittuu
                tavallisesti 1-2 viikon aikana, kun madot tottuvat uuteen ympäristöönsä.
              </li>
              <li>
                Ruokaa lisätään varsinkin aluksi pieninä annoksina ja määrää kasvatetaan
                vasta, kun edellinen jäte on kokonaan kadonnut kompostorista.
              </li>
              <li>
                Madot selviävät useita viikkoja pelkällä kostealla petimateriaalilla. Jos
                olet epävarma ruokamäärästä, on turvallisempaa lisätä liian vähän kuin
                liikaa jätettä.
              </li>
              <li>Mieto metsämäinen tuoksu kertoo, että komposti on kunnossa.</li>
              <li>
                Pieni määrä nestettä tai tiivistymistä on normaalia, kunhan massa ei ole
                vetinen.
              </li>
            </ul>
          </section>

          <section id="sisalto">
            <h2>Mitä aloituspakkaus sisältää</h2>
            <ul>
              <li>3 kestävää 14 L muovilaatikkoa, valmiiksi porattuina</li>
              <li>Valmiiksi mitattu määrä petimateriaalia</li>
              <li>
                Valitsemasi määrä kompostimatoja (
                {starterKitVariants.map((variant) => variant.amount).join(' / ')})
              </li>
              <li>
                Sähköiset{' '}
                <SafeLink href="/tuotteet/matokompostin-aloituspakkaus/kayttoonotto">
                  ohjeet kompostorin käyttöönotolle
                </SafeLink>
              </li>
            </ul>
          </section>

          <section id="mitat">
            <h2>Mitat</h2>
            <ul>
              <li>
                Kompostorin ulkomitat koottuna: leveys 30 cm, syvyys 40 cm, korkeus 27 cm
              </li>
            </ul>
          </section>

          <section id="hinnoittelu">
            <h2>Mistä hinta muodostuu</h2>

            <p>
              Haluan hinnoitella paketin läpinäkyvästi. Alla on perusosan kustannusrakenne
              ilman matoja.
            </p>

            <ul>
              {starterKitComponentCosts.map((item) => (
                <li key={item.label}>
                  {item.label}: {formatPrice(item.price)} €
                </li>
              ))}
              <li>
                <strong>Yhteensä: {formatPrice(starterKitComponentCostTotal)} €</strong>
              </li>
            </ul>

            <p>
              Perusosa on hinnoiteltu {formatPrice(starterKitBasePrice)} euroon. Tähän
              lisätään madot samalla hinnalla kuin erikseen myytävissä matopaketeissa:
            </p>

            <ul>
              {wormVariants.map((variant) => (
                <li key={variant.sku}>
                  <VariantPriceDisplay
                    title={`+ ${variant.amount} matoa`}
                    variant={variant}
                  />
                </li>
              ))}
            </ul>

            <p>Valmiit paketit muodostuvat seuraavasti:</p>
            <ul>
              {starterKitVariants.map((variant) => (
                <li key={`${variant.sku}-final`}>
                  <VariantPriceDisplay
                    title={`Aloituspakkaus + ${variant.amount} matoa`}
                    variant={variant}
                  />
                </li>
              ))}
            </ul>
            <p>
              Työosuus sisältyy perusosan hintaan, loput kulut muodostuvat materiaaleista.
            </p>
          </section>

          <section id="toimitus">
            <h2>Toimitus ja maksaminen</h2>
            <p>
              Tee tilaus alla olevalla lomakkeella. Vahvistan tilauksen manuaalisesti 1-2
              arkipäivän kuluessa varmistaakseni saatavuuden, valmisteluajan ja säiden
              puolesta turvallisen lähetysajankohdan.
            </p>
            <p>
              Laskutus tulee <strong>OP Kevytyrittäjä</strong> -palvelun kautta
              sähköpostiin aikaisintaan silloin, kun lähetys on postitettu. Maksuaika on 7
              päivää.
            </p>
            <p>
              Aloituspakkaus sisältää eläviä kompostimatoja, joten lähetykset lähtevät
              vain maanantaisin. {STARTER_KIT_SHIPPING_SCHEDULE_TEXT} Tarkempi
              toimitusaika ilmoitetaan tilausvahvistuksessa.
            </p>
            <p>
              Aloituspakkauksella on 14 päivän peruuttamisoikeus itse pakkauksen osalta.
              Pakettiin sisältyvien kompostimatojen osuutta ei kuitenkaan hyvitetä, jos
              lähetys on ehditty toimittaa. Tarkemmat ehdot löytyvät{' '}
              <SafeLink href="/tilausehdot">tilaus- ja toimitusehdoista</SafeLink>.
            </p>
          </section>

          <section id="tilaa">
            <ProductOrderForm productKey="starterKit" />
          </section>

          <section id="faq">
            <h2>Usein kysytyt kysymykset</h2>

            {faqItems.map((item) => (
              <div key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </section>

          <section id="yhteys">
            <p>
              Voit kysyä aloituspakkauksesta myös suoraan:{' '}
              <strong>{ORDER_CONTACT_EMAIL}</strong>
            </p>
          </section>

          <ProductReviewsSection productKey="starterKit" />
        </div>
      </article>

      <Advert />
    </>
  );
}
