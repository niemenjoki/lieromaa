import { getProductCatalogEntry } from '@/data/productCatalog.mjs';

import PromoBox from '../PromoBox/Promobox';
import SafeLink from '../SafeLink/SafeLink';

const starterKit = getProductCatalogEntry('starterKit');

export default function StarterKitPromo() {
  if (!starterKit.promo) {
    return null;
  }

  return (
    <PromoBox>
      <strong>{starterKit.promo.badge}</strong> {starterKit.promo.description}{' '}
      <SafeLink
        href={starterKit.canonicalUrl}
        style={{ color: 'var(--highlight-alt)', fontWeight: 600 }}
      >
        {starterKit.promo.linkLabel}
      </SafeLink>
    </PromoBox>
  );
}
