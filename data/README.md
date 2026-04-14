Manual source-of-truth data lives here.

## Folder map

- `site/`: site-wide constants and identity that rarely change
- `pages/`: page metadata and static page-specific editorial content
- `products/`: long-lived product marketing content, SEO copy, media, FAQ, and schema text
- `copy/`: shared UI copy for order and review flows
- `operations/`: the files you are most likely to update during normal shop operations
- `published/`: public artifacts that are published to the site but maintained elsewhere first

Generated build outputs do not belong here. They live in `/generated`.

## What To Edit

### Rarely changing editorial files

- `pages/home.mjs`
  Home page metadata and summary copy.
- `pages/legal.mjs`
  Legal page metadata, descriptions, search keywords, publish/update dates.
- `pages/standalone.mjs`
  Metadata for static utility pages like the blog index, guide hub, about page, and worm calculator.
- `pages/products/starterKitSetup.mjs`
  Metadata and how-to step content for the starter kit setup page.
- `pages/products/starterKit.js`
  The starter kit component cost breakdown shown on the product page.
- `products/catalogContent.mjs`
  Product marketing content shared across metadata, structured data, sitemap, and product pages.
  Edit this when you want to change product page copy, SEO text, FAQ content, product descriptions, merchant feed copy, or product images.
  Do not use this file for prices, stock, delivery options, or order form behavior.
- `site/contact.js`
  Contact details, business identity, and customer contact links.
- `site/constants.mjs`
  Site URL, pagination counts, content type constants, and guide category slugs.
- `site/defaultMetadata.js`
  Default metadata fallback used site-wide.
- `site/schema.mjs`
  Schema.org identifiers and organization-level structured data constants.
- `site/author.js`, `site/socials.js`, `site/adsense.js`
  Author profile, social links, and ad-related configuration.
- `copy/orderMessages.js`
  Customer-facing order form success and error messages plus the submit endpoint constant.
- `copy/reviewMessages.js`
  Customer-facing review flow success and error messages plus the review endpoint constants.

### Frequently changing operational files

- `operations/commerce/pricing.json`
  Source of truth for SKU prices and shipping prices.
  Edit this when you need to change product or shipping prices.
- `operations/commerce/productAvailability.mjs`
  Temporary availability controls.
  Use `unavailableSkus` to hide specific variants from ordering.
  Use `earliestShippingDate` when orders are still accepted but deliveries need to be delayed.
- `operations/commerce/discounts.source.json`
  Manual discount-code source data.
  Each discount entry is matched against specific SKUs in `appliesToSkus`.
  `type` can be `percentage`, `fixed`, or `free_shipping`.
  `value` is the discount amount.
  `endsOn` must be `YYYY-MM-DD`.
  `code` is only written here in the source file.
  During `prepare:site`, this file is transformed into `generated/commerce/discounts.json`, and the runtime build uses that generated file instead of this source file directly.
- `operations/commerce/skuDiscounts.mjs`
  Automatic per-SKU sale configuration that affects visible storefront pricing without a code.
  Set `active: true` to enable the discount.
  `type` can be `percentage` or `fixed`.
  `value` is the discount amount.
  `lowestPrice30Days` is the required comparison price shown in the UI.
  `validUntil` must be `YYYY-MM-DD`.
- `operations/commerce/shippingSchedule.mjs`
  Shipping timing notes and machine-readable handling times used in product/order pages and schema.
- `operations/products/catalogCommerce.mjs`
  Product ordering behavior and fulfillment configuration.
  Edit this when you need to change variant SKUs, shipping option labels, extra charges, default selections, invoice timing, or other order form behavior.
  Do not use this file for marketing copy.

### Published files

- `published/reviews/approved.json`
  Public reviews that are already approved and safe to show on product pages.
