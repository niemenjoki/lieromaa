import classes from '@/app/(fi)/tilaus/CheckoutPage.module.css';
import CheckoutPageClient from '@/app/(fi)/tilaus/CheckoutPageClient';
import { getRoutePath } from '@/lib/i18n/routes.mjs';
import { createLocalizedPageMetadata } from '@/lib/metadata/createLocalizedPageMetadata.mjs';
import { createLocalizedPageStructuredData } from '@/lib/structuredData/createLocalizedPageStructuredData.mjs';

const language = 'en';
const pageMetadata = {
  language,
  title: 'Checkout | Lieromaa',
  description:
    'Review your shopping cart, choose delivery within Finland and place your Lieromaa order in English.',
  canonicalUrl: getRoutePath('checkout', language),
  robots: {
    index: false,
    follow: true,
  },
};

export function generateMetadata() {
  return createLocalizedPageMetadata(pageMetadata);
}

export default function EnglishCheckoutPage() {
  const structuredData = createLocalizedPageStructuredData({
    ...pageMetadata,
    name: 'English checkout',
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <div className={classes.CheckoutPage}>
        <h1>Checkout</h1>
        <CheckoutPageClient language={language} />
      </div>
    </>
  );
}
