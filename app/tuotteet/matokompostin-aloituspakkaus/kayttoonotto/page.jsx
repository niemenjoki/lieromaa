import SafeImage from '@/components/SafeImage/SafeImage';
import SafeLink from '@/components/SafeLink/SafeLink';

import classes from './StarterKitSetup.module.css';
import structuredData from './structuredData.json';

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
          <li>Kuiva kookoskuitu</li>
          <li>Kompostimadot ja vanhaa petimateriaalia sisältävä rasia</li>
        </ul>
        <h2>1. Kookoskuidun kostutus pohjalaatikossa</h2>

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
          Ota kompostin laatikot erilleen toisistaan ja siirrä matorasia erilleen
          laatikoista.
        </p>

        <p>
          Varmista, että kookoskuitu on umpinaisessa pohjalaatikossa, ei rei'itetyssä
          laatikossa. Kaada kuidun sekaan 4.5 litraa vettä tasaisesti koko pinnalle.
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
          Anna veden imeytyä 30 minuuttia. Sekoita kerran noin puolessa välissä, jotta
          kosteus jakautuu tasaisemmin.
        </p>

        <SafeImage
          src="/images/starterkit/aloituspakkaus_kuidun_sekoittelu.avif"
          alt="Kookoskuitua puristellaan ja hajotetaan käsin pohjalaatikossa, jotta kaikki kuiva materiaali kastuu"
          width={1200}
          height={800}
          sizes="(max-width: 800px) 100vw, 800px"
          priority={false}
          loading="lazy"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        <p>
          Puristele ja hajota suurimmat kuivat kuitupaakut. Kaiken materiaalin ei tarvitse
          olla täysin tasaisen kosteaa - kosteus tasaantuu itsestään ja matojen liike
          nopeuttaa prosessia.
        </p>

        <h2>2. Kerrosten rakentaminen</h2>

        <p>
          Siirrä osa kostutetusta materiaalista yhteen rei'itetyistä laatikoista.
          Pohjalaatikkoon jätetään vain sen verran petimateriaalia, että kun rei'itetty
          laatikko asetetaan sen päälle ja painetaan kevyesti alas, sen pohja koskettaa ja
          painaa materiaalia aavistuksen.
        </p>

        <p>
          Oikea määrä näkyy siitä, että materiaalin pinta tasoittuu. Huomaa, ettei
          petimateriaali saa puristua tiiviiksi vaan sen tulee painautua vain kevyesti.
        </p>
        <SafeImage
          src="/images/starterkit/aloituspakkaus_painauma_kuidussa.avif"
          alt="Petimateriaalissa näkyy ylemmän laatikon jättämä pieni painauma."
          width={1200}
          height={800}
          sizes="(max-width: 800px) 100vw, 800px"
          priority={false}
          loading="lazy"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        <p>
          Toista sama keskikerroksen kanssa. Kun ylin laatikko painetaan sen päälle,
          petimateriaali painuu hieman kasaan. Loput materiaalista jää ylimpään
          laatikkoon.
        </p>

        <p>
          Nyt sinulla pitäisi olla kasassa kolmikerroksinen läpivirtauskompostori.
          Alimmassa ja keskimmäisessä kerroksessa on juuri sen verran petimateriaalia,
          että ylempi laatikko painaa sitä kevyesti kasaan. Ylimmässä laatikossa on hieman
          enemmän petimateriaalia.
        </p>

        <h2>3. Matojen lisääminen ja totuttelu</h2>

        <p>
          Kaada koko matorasian sisältö ylimpään laatikkoon. Vanha petimateriaali sisältää
          hyödyllisiä mikrobeja, jotka käynnistävät hajotusprosessin tehokkaasti.
        </p>

        <p>Anna matojen kaivautua petimateriaaliin itse. Älä sekoita.</p>

        <p>
          Sulje kansi ja anna matojen olla rauhassa 48 tuntia ilman ruokintaa. Tämä
          vähentää stressiä ja parantaa sopeutumista.
        </p>

        <h2>4. Ensimmäinen ruokinta</h2>

        <p>
          Kahden vuorokauden jälkeen voit antaa ensimmäisen, hyvin pienen ruokinnan.
          Esimerkiksi ruokalusikallinen banaania riittää. Jos olet epävarma, mitä madoille
          voi antaa ruoaksi, katso{' '}
          <SafeLink href="/opas/kompostorin-hoito/mita-matokompostoriin-saa-laittaa-mita-ei-saa">
            Mitä kompostoriin saa laittaa ja mitä ei?
          </SafeLink>
        </p>

        <p>
          Seuraava ruokinta annetaan noin viikon kuluttua ensimmäisestä. Varmista aina,
          että edellinen ruoka on kadonnut kokonaan ennen uuden lisäämistä.
        </p>

        <p>
          Pikkuhiljaa ruokintamäärää voidaan lisätä. Madot syövät noin kaksi kertaa
          painonsa verran viikossa ja madot painaa keskimäärin 0.5 grammaa. Toisin sanoen
          esimerkiksi 100 matoa käsittelee noin 100 grammaa biojätettä viikossa. Tarkempi
          käsittelytahti vaihtelee lämpötilan, kosteuden ja jätteen sisällön mukaan.
        </p>

        <p>
          Olosuhteiden ollessa kunnossa populaatio voi kaksinkertaistua noin kolmessa
          kuukaudessa, jolloin myös käsittelykapasiteetti kasvaa.
        </p>

        <p>
          Tarkemmat ohjeet jatkuvaan hoitoon löydät tältä sivustolta kohdasta{' '}
          <SafeLink href="/opas/kompostorin-hoito">Kompostorin hoito</SafeLink>. Voit myös
          laittaa sähköpostia <strong>lieromaa@gmail.com</strong>, niin autan parhaani
          mukaan.
        </p>
      </div>
    </>
  );
}
