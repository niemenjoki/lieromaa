// Selain ohjataan maksamaan vain Stripen omalle maksusivulle.
export function isStripeCheckoutUrl(value) {
  if (typeof value !== 'string' || !value) {
    return false;
  }

  try {
    const checkoutUrl = new URL(value);
    return (
      checkoutUrl.protocol === 'https:' && checkoutUrl.hostname === 'checkout.stripe.com'
    );
  } catch {
    return false;
  }
}
