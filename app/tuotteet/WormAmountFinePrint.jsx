import classes from './ProductPage.module.css';

export default function WormAmountFinePrint() {
  return (
    <p className={classes.FinePrint}>
      Matomäärä arvioidaan painon perusteella. Kompostimadon keskipaino on tyypillisesti
      noin 0,4-0,6 g, mutta käytämme laskennassa arviota 0,6 g / mato. Todellinen
      yksilömäärä voi vaihdella arviolta noin ±10 % matojen kokojakaumasta riippuen.
    </p>
  );
}
