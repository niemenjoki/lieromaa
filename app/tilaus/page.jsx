import { createPageMetadata } from '@/lib/metadata/createPageMetadata';

import classes from './CheckoutPage.module.css';
import CheckoutPageClient from './CheckoutPageClient';

const pageMetadata = {
  title: 'Tilaus | Lieromaa',
  description:
    'Tarkista ostoskorisi, valitse toimitustapa ja lähetä Lieromaan tuotteiden tilaus helposti yhdeltä sivulta.',
  canonicalUrl: '/tilaus',
  robots: {
    index: false,
    follow: true,
  },
};

export function generateMetadata() {
  return createPageMetadata(pageMetadata);
}

export default function CheckoutPage() {
  return (
    <div className={classes.CheckoutPage}>
      <h1>Tilaus</h1>
      <CheckoutPageClient />
    </div>
  );
}
