import Advert from '@/components/Advert';
import Layout from '@/components/Layout';
import { SITE_URL } from '@/data/vars';
import classes from '@/styles/AboutPage.module.css';
import Image from 'next/image';
import portrait from '../public/images/portrait2024.png';

const AboutPage = () => {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'Tietoa Luomulierosta',
      description:
        'Tietoa sivuston ylläpitäjästä Joonas Niemenjoesta ja Luomulieron toiminnasta. Luomuliero keskittyy matokompostointiin ja kestävään jätehuoltoon Suomessa.',
      url: 'https://www.luomuliero.fi/tietoa',
      author: {
        '@type': 'Person',
        name: 'Joonas Niemenjoki',
        url: 'https://www.linkedin.com/in/joonasniemenjoki/',
        affiliation: {
          '@type': 'Organization',
          name: 'Luomuliero',
        },
      },
      publisher: {
        '@type': 'Organization',
        name: 'Luomuliero (Joonas Niemenjoki, Y-tunnus 3002257-7)',
        logo: 'https://www.luomuliero.fi/icons/apple-touch-icon.png',
      },
      mainEntity: {
        '@type': 'WebSite',
        name: 'Luomuliero',
        url: 'https://www.luomuliero.fi',
      },
    },
  ];

  return (
    <Layout title={'Tietoa | Luomuliero'} structuredData={structuredData}>
      <div className={classes.AboutPage}>
        <div className={classes.Info}>
          <Image
            src={portrait}
            alt="Valokuva Joonas Niemenjoesta"
            placeholder="blur"
            width={200}
            height={200}
          />
          <h1>Joonas Niemenjoki</h1>
        </div>
        <div className={classes.Bio}>
          <p>
            Moi👋 Olen Joonas, ja ylläpidän pientä matofarmia kotonani
            Järvenpäässä. Kasvatan vapaa-ajallani matoja pääasiassa omaa
            kompostointia varten sekä tuottaakseni matokakkaa oman pienen
            puutarhan tarpeisiin. Myyn myös pieniä määriä matoja
            kiinnostuneille.
          </p>
          <p>
            Ammatiltani olen automaatioinsinööri ja työskentelen
            rakennusautomaation ohjelmoijana. Tämä sivusto keskittyy kuitenkin
            pääasiassa kompostointiin.
          </p>
        </div>
      </div>
      <Advert adClient="ca-pub-5560402633923389" adSlot="1051764153" />
    </Layout>
  );
};

export default AboutPage;
