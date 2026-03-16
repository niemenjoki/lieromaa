import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

import { merchantCatalog, productDefinitions } from '../../data/productCatalog.mjs';
import { SITE_URL } from '../../data/vars.mjs';

const pricingFile = path.join(process.cwd(), 'data', 'pricing.json');
const outputFile = path.join(process.cwd(), 'public', 'google-merchant-feed.xml');
const imageQuality = 82;

function readPricingMap() {
  const raw = fs.readFileSync(pricingFile, 'utf8');
  const parsed = JSON.parse(raw);
  return parsed?.prices ?? {};
}

function escapeXml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function formatPrice(value) {
  return `${(Number(value) || 0).toFixed(2)} EUR`;
}

function getVariantAmount(sku) {
  return Number(String(sku).split('-').pop()) || 0;
}

async function ensureMerchantImage(imagePath) {
  const relativePath = String(imagePath || '').replace(/^\/+/, '');
  const sourcePath = path.join(process.cwd(), 'public', relativePath);
  const webpPath = sourcePath.replace(/\.[^.]+$/, '.webp');

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing product image for Merchant feed: ${sourcePath}`);
  }

  const shouldGenerate =
    !fs.existsSync(webpPath) ||
    fs.statSync(webpPath).mtimeMs <= fs.statSync(sourcePath).mtimeMs;

  if (shouldGenerate) {
    await sharp(sourcePath).webp({ quality: imageQuality }).toFile(webpPath);
  }

  return `${SITE_URL}/${path.relative(path.join(process.cwd(), 'public'), webpPath).replace(/\\/g, '/')}`;
}

async function buildItems() {
  const priceMap = readPricingMap();
  const items = [];

  for (const [productKey, product] of Object.entries(productDefinitions)) {
    const merchantProduct = merchantCatalog[productKey];

    if (!merchantProduct) {
      throw new Error(`Missing Merchant Center metadata for product "${productKey}"`);
    }

    const shippingPrice = priceMap[product.shippingSku];

    if (shippingPrice == null) {
      throw new Error(`Missing shipping price for SKU "${product.shippingSku}"`);
    }

    const imageUrls = [];
    for (const imagePath of merchantProduct.imagePaths) {
      imageUrls.push(await ensureMerchantImage(imagePath));
    }

    for (const sku of product.variantSkus) {
      const price = priceMap[sku];

      if (price == null) {
        throw new Error(`Missing price for SKU "${sku}"`);
      }

      const amount = getVariantAmount(sku);
      const title = merchantProduct.title(amount);
      const description = merchantProduct.description(amount);
      const link = `${SITE_URL}${merchantProduct.linkPath}`;

      const additionalImageLinks = imageUrls
        .slice(1)
        .map(
          (imageUrl) =>
            `      <g:additional_image_link>${escapeXml(imageUrl)}</g:additional_image_link>`
        )
        .join('\n');
      const additionalImageBlock = additionalImageLinks
        ? `${additionalImageLinks}\n`
        : '';

      items.push(`    <item>
      <title>${escapeXml(title)}</title>
      <link>${escapeXml(link)}</link>
      <description>${escapeXml(description)}</description>
      <g:id>${escapeXml(sku)}</g:id>
      <g:title>${escapeXml(title)}</g:title>
      <g:description>${escapeXml(description)}</g:description>
      <g:link>${escapeXml(link)}</g:link>
      <g:image_link>${escapeXml(imageUrls[0])}</g:image_link>
${additionalImageBlock}      <g:availability>${escapeXml(merchantProduct.availability)}</g:availability>
      <g:price>${escapeXml(formatPrice(price))}</g:price>
      <g:condition>${escapeXml(merchantProduct.condition)}</g:condition>
      <g:brand>${escapeXml(merchantProduct.brand)}</g:brand>
      <g:identifier_exists>${escapeXml(merchantProduct.identifierExists)}</g:identifier_exists>
      <g:product_type>${escapeXml(merchantProduct.productType)}</g:product_type>
      <g:shipping>
        <g:country>FI</g:country>
        <g:service>${escapeXml(merchantProduct.shippingService)}</g:service>
        <g:price>${escapeXml(formatPrice(shippingPrice))}</g:price>
      </g:shipping>
    </item>`);
    }
  }

  return items.join('\n');
}

async function main() {
  console.log('🔍 Generating Google Merchant Center XML feed...');

  const items = await buildItems();
  const now = new Date().toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml('Lieromaa - Google Merchant Center feed')}</title>
    <link>${escapeXml(SITE_URL)}</link>
    <description>${escapeXml('Tuotefeed Lieromaan Google Merchant Centeria varten.')}</description>
    <lastBuildDate>${escapeXml(now)}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, xml, 'utf8');

  console.log(`✅ Google Merchant Center feed written to ${outputFile}\n`);
}

main().catch((err) => {
  console.error('❌ Error generating Google Merchant Center feed:', err);
  process.exit(1);
});
