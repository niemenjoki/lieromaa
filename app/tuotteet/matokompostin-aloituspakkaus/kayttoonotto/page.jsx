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
        <p>
          Sisältö riippuu siitä, valitsitko 1, 2 vai 3 laatikon mallin. Kaikki mallit
          käynnistetään silti samalla tavalla: vain yksi aktiivinen laatikko on käytössä
          alussa.
        </p>
        <ul>
          <li>1 laatikko: 1 umpohjainen laatikko ja kansi</li>
          <li>2 laatikkoa: 1 umpohjainen ja 1 rei'itetty laatikko sekä kansi</li>
          <li>3 laatikkoa: 1 umpohjainen ja 2 rei'itettyä laatikkoa sekä kansi</li>
          <li>
            Nykyisen kompostorin lisäkerrokset: valitsemasi määrä rei'itettyjä laatikoita
            ja yksi kansi
          </li>
          <li>Kuiva kookoskuitu petimateriaaliksi</li>
          <li>
            Kompostimadot ja noin 0,5 litraa kasvualustaa sisältävä rasia, jos tilasit
            madot mukaan
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
          sivuun. Aloittavassa kompostorissa käyttöönotto tehdään umpohjaisessa
          laatikossa. Jos mukana tuli rei'itettyjä laatikoita, pidä ne aluksi tyhjinä ja
          sivussa.
        </p>

        <p>
          Jos tilasit laatikoita nykyisen Lieromaan kompostorin lisäkerroksiksi, älä lisää
          uutta laatikkoa automaattisesti heti. Lisää rei'itetty lisälaatikko vasta, kun
          nykyinen ylin kerros on osittain käsitelty ja haluat siirtää ruokinnan uuteen
          kerrokseen.
        </p>

        <p>
          Lisää ensimmäiseen aktiiviseen laatikkoon noin{' '}
          <strong>1,5 litraa kookoskuitua</strong>. Aloittavassa kompostorissa tämä on
          umpohjainen laatikko. Lisää vettä vähitellen pienissä erissä ja sekoita välillä.
          Vettä kuluu yleensä noin <strong>3,5 litraa</strong>, mutta oikea määrä riippuu
          siitä, miten kuivaa kuitu on.
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
          jakautuu tasaisemmin. Tarkista kosteus puristamalla materiaalia voimakkaasti
          nyrkissä: sopivan kosteasta kuidusta irtoaa 1-2 tippaa vettä, ei enempää eikä
          vähempää.
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
          Matojen mukana tuleva noin 0,5 litran kasvualusta sisältää valmiiksi mikrobeja,
          jotka auttavat hajotusprosessia käynnistymään uudessa petimateriaalissa.
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
          kuin liian paljon. Madot selviävät kompostorin omaa kosteaa petimateriaalia
          syömällä useita viikkoja.
        </p>

        <h2>4. Lisäkerroksen lisääminen</h2>

        <p>
          Jos käytössäsi on 2 tai 3 laatikon malli, lisää seuraava rei'itetty laatikko
          päälle vasta, kun nykyinen ylin laatikko on pääasiassa prosessoitu mutta ei
          vielä täysin valmis. Jos käytössäsi on 1 laatikon malli, jatka ruokintaa samassa
          laatikossa ja kerää matokakka myöhemmin käsin.
        </p>

        <p>
          Nykyiseen kompostoriin lisättävä laatikko toimii samalla tavalla: lisää se
          ylimmän kerroksen päälle vasta, kun komposti on valmis siirtymään seuraavaan
          ruokintakerrokseen.
        </p>

        <p>
          Jos alemmassa laatikossa on liian paljon materiaalia eikä uusi laatikko mahdu
          tiiviisti sen päälle, voit siirtää osan vanhasta materiaalista uuteen
          laatikkoon.
        </p>

        <p>
          Sekoita 1,5 litraa kookoskuitua ja lisää vettä vähitellen pienissä erissä. Vettä
          kuluu yleensä noin 3,5 litraa, mutta tarkista kosteus puristustestillä:
          voimakkaasti nyrkissä puristettaessa materiaalista pitäisi irrota 1-2 tippaa
          vettä. Kun vesi on imeytynyt, lisää petimateriaali äsken lisättyyn laatikkoon.
        </p>

        <p>
          Tämän jälkeen ruokinta tehdään vain ylimpään aktiiviseen laatikkoon. Madot
          siirtyvät ajan myötä ylöspäin ravinnon perässä.
        </p>

        <h2>5. Kolmannen kerroksen lisääminen</h2>

        <p>
          Jos käytössäsi on 3 laatikon malli, lisää kolmas laatikko samaan tapaan vasta,
          kun toinenkin laatikko on pääasiassa prosessoitu. Kahden laatikon mallissa voit
          jatkaa kahdella kerroksella tai tilata myöhemmin lisää laatikoita.
        </p>

        <p>Kolmella laatikolla järjestelmä alkaa muodostaa selkeän rakenteen:</p>

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
          Sadonkorjuu riippuu siitä, montako laatikkoa kompostorissa on käytössä. Yhdellä
          laatikolla matokakka kerätään käsin esimerkiksi valoerottelulla tai siirtämällä
          ruokintaa laatikon toiseen reunaan ennen keräämistä.
        </p>

        <p>
          Kahdella laatikolla alempi kerros voi kypsyä rauhallisemmin, kun ruokinta on
          siirretty ylempään laatikkoon. Kolmella laatikolla kierto on sujuvin: kun ylin
          laatikko on jälleen lähes käsitelty, alin laatikko on yleensä valmis
          käytettäväksi.
        </p>

        <p>
          Kolmen laatikon kierrossa kerää alimman laatikon sisältö talteen. Sen jälkeen
          siirrä:
        </p>

        <ul>
          <li>keskimmäisen laatikon sisältö alimpaan laatikkoon</li>
          <li>ylimmän laatikon sisältö keskimmäiseen laatikkoon</li>
        </ul>

        <p>
          Lisää ylimpään laatikkoon uusi kerros kosteaa tuoretta petimateriaalia ja jatka
          ruokintaa normaalisti. Kahden laatikon mallissa sama ajatus toimii
          yksinkertaisemmin: kerää kypsynyt alempi kerros, siirrä aktiivinen kerros alas
          ja lisää päälle uusi rei'itetty laatikko, jos sellainen on käytössä.
        </p>

        <p>
          Pikkuhiljaa ruokintamäärää voidaan lisätä. Madot syövät noin kaksi kertaa
          painonsa verran viikossa. Esimerkiksi 100 matoa käsittelee noin 100 g biojätettä
          viikossa, mutta määrä vaihtelee olosuhteiden mukaan.
        </p>

        <p>
          Hyvissä olosuhteissa matojen määrä kaksinkertaistuu noin kolmessa kuukaudessa,
          jolloin myös käsittelykapasiteetti kasvaa vähitellen: noin kaksinkertaiseksi
          kolmessa kuukaudessa ja nelinkertaiseksi puolessa vuodessa.
        </p>

        <p>
          Tarkemmat ohjeet jatkuvaan hoitoon löydät sivulta{' '}
          <SafeLink href="/opas/kompostorin-hoito">Kompostorin hoito</SafeLink>.
          Ensimmäisen kuukauden ruokintarytmiä varten katso myös{' '}
          <SafeLink href="/opas/kompostorin-hoito/ensimmaiset-30-paivaa-matokompostorin-kaynnistys">
            Ensimmäiset 30 päivää uudessa matokompostorissa
          </SafeLink>
          . Voit myös ottaa yhteyttä osoitteeseen <strong>{ORDER_CONTACT_EMAIL}</strong>.
        </p>
      </div>
    </>
  );
}
