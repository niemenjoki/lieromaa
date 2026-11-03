import EnglishInvoicePaymentPage from '../page';

export { generateMetadata } from '../page';

// The payment code is read from the address in the browser, so the page HTML is the same for every code.
export const dynamic = 'force-dynamic';

export default EnglishInvoicePaymentPage;
