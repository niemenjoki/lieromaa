import classes from './ProductPage.module.css';

export default function WormAmountFinePrint() {
  return (
    <p className={classes.FinePrint}>
      Madot myydään painon perusteella: 25 g, 50 g, 75 g ja 100 g vastaavat karkeasti noin
      50, 100, 150 ja 200 matoa. Todellinen matojen määrä vaihtelee yksilöiden koon
      mukaan.
    </p>
  );
}
