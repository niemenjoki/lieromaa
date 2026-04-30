import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';
import { ORDER_CONTACT_EMAIL } from '@/lib/site/contact';

import classes from './StarterKitSetup.module.css';
import structuredData from './structuredData.js';

export { default as generateMetadata } from './generateMetadata';

export default function StarterKitSetupPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <div className={classes.Content}>
        <h1>Aloituspakkauksen käyttöönotto</h1>

        <h2>Pakkauksen sisältö</h2>
        <ul>
          <li>Umpipohjainen laatikko - 1 kpl</li>
          <li>Rei'itetty laatikko - 2 kpl</li>
          <li>Kansi - 1 kpl</li>
          <li>Kuiva kookoskuitu petimateriaaliksi</li>
          <li>
            Kompostimadot ja vanhaa petimateriaalia sisältävä rasia, jos tilasit madot
            mukaan
          </li>
        </ul>

        <h2>1. Ensimmäisen kerroksen petimateriaali</h2>

        <SafeImage
          src="/images/starterkit/aloituspakkaus_pohjalaatikko_kuiva_kuitu.avif"
          alt="Umpipohjainen laatikko, jossa kuiva kookoskuitu ja matorasia poistettuna ennen veden lisäämistä"
          width={1200}
          height={800}
          sizes="(max-width: 800px) 100vw, 800px"
          priority={false}
          loading="lazy"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        <p>
          Ota laatikot erilleen toisistaan. Jos tilasit madot mukaan, siirrä matorasia
          sivuun. Käyttöönotto aloitetaan yhdellä laatikolla.
        </p>

        <p>
          Lisää umpinaiseen pohjalaatikkoon noin<strong>3,5 litraa kookoskuitua</strong>.
          Lisää tämän jälkeen noin <strong>1,5 litraa vettä</strong> tasaisesti koko
          pinnalle.
        </p>

        <SafeImage
          src="/images/starterkit/aloituspakkaus_vesi_kuidun_seassa.avif"
          alt="Umpipohjainen laatikko, jossa kuivan kookoskuidun sekaan on kaadettu vettä"
          width={1200}
          height={800}
          sizes="(max-width: 800px) 100vw, 800px"
          priority={false}
          loading="lazy"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        <p>
          Anna veden imeytyä noin 30 minuuttia. Sekoita kerran puolivälissä, jotta kosteus
          jakautuu tasaisemmin.
        </p>

        <SafeImage
          src="/images/starterkit/aloituspakkaus_kuidun_sekoittelu.avif"
          alt="Kookoskuitua puristellaan ja hajotetaan käsin pohjalaatikossa"
          width={1200}
          height={800}
          sizes="(max-width: 800px) 100vw, 800px"
          priority={false}
          loading="lazy"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        <p>
          Puristele suurimmat kuivat paakut auki. Kaiken materiaalin ei tarvitse olla
          täysin tasaisen kosteaa - kosteus tasaantuu itsestään.
        </p>

        <h2>2. Matojen lisääminen ja käynnistys</h2>

        <p>
          Jos tilasit madot mukaan, kaada koko matorasian sisältö petimateriaalin päälle.
          Matojen mukana tuleva vanha petimateriaali sisältää valmiiksi mikrobeja, jotka
          tehostavat hajotusprosessin käynnistymistä.
        </p>

        <p>Anna matojen kaivautua petimateriaaliin itse. Älä sekoita.</p>

        <p>Sulje kansi ja anna matojen olla rauhassa noin 48 tuntia ilman ruokintaa.</p>

        <h2>3. Ensimmäinen ruokinta</h2>

        <p>
          Kahden vuorokauden jälkeen voit antaa ensimmäisen, hyvin pienen ruokinnan.
          Esimerkiksi ruokalusikallinen banaania riittää. Jos olet epävarma, mitä
          kompostoriin saa laittaa, katso{' '}
          <SafeLink href="/opas/kompostorin-hoito/mita-matokompostoriin-saa-laittaa-mita-ei-saa">
            Mitä kompostoriin saa laittaa ja mitä ei?
          </SafeLink>
        </p>

        <p>
          Jatka ruokintaa noin kerran viikossa. Tarkista aina ennen ruokintaa, onko ruokaa
          jäljellä edelliseltä ruokinnalta. Jos ruokaa on vielä reilusti, älä lisää ruokaa
          vaan odota toinen viikko ennen ruoan lisäämistä. Jos ruoka on kokonaan kadonnut,
          voit lisätä hieman enemmän ruokaa kuin edellisellä ruokintakerralla. Ole
          kuitenkin tarkkana, ettet ruoki liikaa. Liika ruoka ehtii mädäntyä ja alkaa
          haista ennen kuin madot ehtivät prosessoida sen. Ruoki mieluummin liian vähän
          kuin liian paljon. Madot selviävät pelkkää petimateriaalia syömällä useita
          viikkoja.
        </p>

        <h2>4. Toisen kerroksen lisääminen</h2>

        <p>
          Kun ensimmäinen laatikko on pääasiassa prosessoitu (mutta ei vielä täysin
          valmista), lisää sen päälle uusi rei'itetty laatikko.
        </p>

        <p>
          Jos alemmassa laatikossa on liian paljon materiaalia, eikä uusi laatikko mahdu
          tiiviisti sen päälle, voit siirtää osan vanhasta materiaalista uuteen
          laatikkoon.
        </p>

        <p>
          Sekoita 3,5 litraa kookoskuitua ja 1,5 litraa vettä ja sekoita sitä kevyesti.
          Kun vesi on imeytynyt, lisää petimateriaali äsken lisättyyn laatikkoon.
        </p>

        <p>
          Tämän jälkeen ruokinta tehdään aina vain ylimpään laatikkoon. Madot siirtyvät
          ajan myötä ylöspäin ravinnon perässä.
        </p>

        <h2>5. Kolmannen kerroksen lisääminen</h2>

        <p>
          Kun toinenkin laatikko on pääasiassa prosessoitu, lisää kolmas laatikko samaan
          tapaan kuin aiemmin lisäsit toisen laatikon.
        </p>

        <p>Nyt järjestelmä alkaa muodostaa selkeän rakenteen:</p>

        <ul>
          <li>
            <strong>Ylin laatikko:</strong> Madot käsittelevät ruokajätettä aktiivisesti
          </li>
          <li>
            <strong>Keskimmäinen:</strong> Siirtymäkerros, jossa madot prosessoivat vielä
            ruokajätteen jäämiä kunnes siirtyvät hiljalleen kohti ylintä laatikkoa.
          </li>
          <li>
            <strong>Alin laatikko:</strong> Kypsytyskerros, jossa mikrobit kypsyttävät
            matojen prosessoiman jätteen loppuun
          </li>
        </ul>

        <h2>6. Sadonkorjuu ja jatkuva käyttö</h2>

        <p>
          Kun ylin laatikko on jälleen lähes käsitelty, alin laatikko on valmis
          käytettäväksi.
        </p>

        <p>Kerää alimman laatikon koko sisältö talteen. Sen jälkeen siirrä:</p>

        <ul>
          <li>keskimmäisen laatikon sisältö alimpaan laatikkoon</li>
          <li>ylimmän laatikon sisältö keskimmäiseen laatikkoon</li>
        </ul>

        <p>
          Lisää ylimpään laatikkoon uusi kerros kosteaa tuoretta petimateriaalia ja jatka
          ruokintaa normaalisti.
        </p>

        <p>
          Pikkuhiljaa ruokintamäärää voidaan lisätä. Madot syövät noin kaksi kertaa
          painonsa verran viikossa. Esimerkiksi 100 matoa käsittelee noin 100 g biojätettä
          viikossa, mutta määrä vaihtelee olosuhteiden mukaan.
        </p>

        <p>
          Hyvissä olosuhteissa populaatio kaksinkertaistuu noin kolmessa kuukaudessa,
          jolloin myös käsittelykapasiteetti kasvaa kolmessa kuukaudessa kaksinkertaiseksi
          ja puolessa vuodessa nelinkertaiseksi.
        </p>

        <p>
          Tarkemmat ohjeet jatkuvaan hoitoon löydät sivulta{' '}
          <SafeLink href="/opas/kompostorin-hoito">Kompostorin hoito</SafeLink>. Voit myös
          ottaa yhteyttä osoitteeseen <strong>{ORDER_CONTACT_EMAIL}</strong>.
        </p>
      </div>
    </>
  );
}
