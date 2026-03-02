import Advert from '@/components/Advert/Advert';
import ImageSlider from '@/components/ImageSlider/ImageSlider';
import SafeLink from '@/components/SafeLink/SafeLink';

import classes from '../ProductPage.module.css';
import OrderForm from './OrderForm';
import structuredData from './structuredData.json';

export { default as generateMetadata } from './generateMetadata';

export const dynamic = 'force-static';

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
        <h1>Lieromaan matokompostorin aloituspakkaus on nyt tilattavissa</h1>

        <div className={classes.Content}>
          <ImageSlider
            maxWidth="800px"
            images={[
              {
                src: '/images/starterkit/aloituspakkaus_suljettu_matokompostori.avif',
                alt: 'Suljettu musta matokompostori oransseilla kahvoilla vaaleaa taustaa vasten.',
                priority: true,
                loading: 'eager',
              },
              {
                src: '/images/starterkit/aloituspakkaus_sisalto_ylhaalta_kuvattuna.avif',
                alt: 'Matokompostin aloituspakkauksen sisältö ylhäältä kuvattuna: kolme mustaa laatikkoa, kookoskuituharkot ja erillinen astia kuivikkeelle.',
              },
              {
                src: '/images/starterkit/aloituspakkaus_kompostimadot_toimitusastiassa.avif',
                alt: 'Kompostimadot toimitusastiassa omassa kasvualustassaan valmiina siirrettäväksi kompostoriin.',
              },
              {
                src: '/images/starterkit/aloituspakkaus_kompostimadot_lahella.avif',
                alt: 'Lähikuva elävistä kompostimadoista kosteassa ja ilmavassa kasvualustassa.',
              },
            ]}
          />

          <section>
            <p>
              Tämä aloituspakkaus on suunniteltu sinulle, joka haluat aloittaa
              matokompostoinnin suoraan toimivalla kokonaisuudella. Kaikki tarvittava on
              mukana - kompostorilaatikot, valmiiksi mitattu kookoskuitu petimateriaaliksi
              sekä tietenkin valitsemasi määrä kompostimatoja. Sinun tarvitsee lisätä 4,5
              litraa vettä sekaan ja siirtää madot uuteen kotiinsa.
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
              <li>Aloituspakkaus + 50 matoa - 84 €</li>
              <li>Aloituspakkaus + 100 matoa - 94 €</li>
              <li>Aloituspakkaus + 200 matoa - 114 €</li>
              <li>Postitus 10,90 € tai nouto Järvenpäästä 0 €</li>
            </ul>
            <p className={classes.HelperText}>
              Laske sopiva määrä <SafeLink href="/matolaskuri">matolaskurilla</SafeLink>
            </p>
            <a className={classes.PrimaryCTA} href="#tilaa">
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
              <li>Valitsemasi määrä kompostimatoja (50 / 100 / 200)</li>
              <li>Sähköiset ohjeet kompostorin käyttöönotolle</li>
            </ul>
          </section>

          <section id="hinnoittelu">
            <h2>Mistä hinta muodostuu</h2>

            <p>
              Haluan hinnoitella paketin läpinäkyvästi. Alla on perusosan kustannusrakenne
              ilman matoja.
            </p>

            <ul>
              <li>Kompostilaatikot: 26,97 €</li>
              <li>Kookoskuitu petimateriaaliksi: 3,80 €</li>
              <li>Rakentaminen, viimeistely ja pakkaus: 30 €</li>
              <li>
                <strong>Yhteensä: 60,77 €</strong>
              </li>
            </ul>

            <p>
              Perusosa on hinnoiteltu 60 euroon. Tähän lisätään madot samalla hinnalla
              kuin erikseen myytävissä matopaketeissa:
            </p>

            <ul>
              <li>+ 50 matoa: 20 €</li>
              <li>+ 100 matoa: 30 €</li>
              <li>+ 200 matoa: 50 €</li>
            </ul>

            <p>
              Lopulliset paketit ovat 80 €, 90 € ja 110 €. Työosuus on 30 €, muut kulut
              ovat materiaaleja.
            </p>
          </section>

          <section id="toimitus">
            <h2>Toimitus ja maksaminen</h2>
            <p>
              Tee tilaus alla olevalla lomakkeella. Vahvistan tilauksen manuaalisesti 1-2
              arkipäivän kuluessa varmistaakseni saatavuuden ja säiden puolesta
              turvallisen lähetysajankohdan.
            </p>
            <p>
              Laskutus tulee <strong>OP Kevytyrittäjä</strong> -palvelun kautta
              sähköpostiin aikaisintaan silloin, kun lähetys on postitettu. Maksuaika on
              14 päivää.
            </p>
          </section>

          <section id="tilaa">
            <OrderForm />
          </section>

          <section id="faq">
            <h2>Usein kysytyt kysymykset</h2>

            <h3>Haiseeko matokompostori?</h3>
            <p>
              Oikein hoidettuna matokompostori on hajuton. Hajuhaitat liittyvät yleensä
              liialliseen ruokintaan tai liikaan kosteuteen.
            </p>

            <h3>Kuinka nopeasti kompostointi käynnistyy?</h3>
            <p>
              Madot alkavat käsitellä biojätettä heti, mutta ensimmäisten viikkojen aikana
              ruokintaa suositellaan maltillisena.
            </p>

            <h3>Voiko kompostoria pitää sisätiloissa?</h3>
            <p>
              Kyllä. Läpivirtauskompostori soveltuu hyvin sisäkäyttöön, kun
              kosteustasapaino ja ruokinta pidetään hallinnassa.
            </p>
          </section>

          <section id="yhteys">
            <p>
              Voit kysyä aloituspakkauksesta myös suoraan:{' '}
              <strong>lieromaa@gmail.com</strong>
            </p>
          </section>
        </div>
      </article>

      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </>
  );
}
