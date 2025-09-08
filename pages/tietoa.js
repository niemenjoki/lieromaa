import Advert from '@/components/Advert';
import Layout from '@/components/Layout';
import { SITE_URL } from '@/data/vars';
import classes from '@/styles/AboutPage.module.css';
import Image from 'next/image';
import portrait from '../public/images/portrait2024.png';

const AboutPage = () => {
  return (
    <Layout title={'Tietoa | Luomuliero'}>
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
            Järvenpässä. Kasvatan vapaa-ajallani matoja pääasiassa omaa
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
      <Advert />
    </Layout>
  );
};

export default AboutPage;
