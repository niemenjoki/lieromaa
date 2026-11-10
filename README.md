# Lieromaa

Source code for [**lieromaa.fi**](https://www.lieromaa.fi), my small vermicomposting (worm composting) business in
Finland: an online shop for composting worms and starter kits, and guides on composting kitchen waste with worms.

Most of the site is in Finnish. The shop, the order and delivery terms, the privacy notice and a getting-started
guide are also in English under [`/en`](https://www.lieromaa.fi/en).

## Tech stack

- [Next.js](https://nextjs.org/) App Router, JavaScript (ES modules), CSS Modules
- Guides and blog posts as MDX (`content/<type>/<slug>/body.mdx` with `meta.json`), products and other data as
  JSON in `data/`
- Images converted with [Sharp](https://sharp.pixelplumbing.com/) to AVIF, WebP and JPEG
- Hosted on [Vercel](https://vercel.com)
- Orders, payments ([Stripe Checkout](https://stripe.com/payments/checkout)), invoices and bookkeeping run in a
  separate self-hosted order service. This repository only calls it.
- Analytics: [Looku](https://github.com/niemenjoki/looku), server-side and cookieless

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

The checkout needs the separate order service running in Stripe test mode. Local `next dev` always identifies
itself as test mode, so it cannot create live payments. Stripe keys never go into this repository or Vercel;
Vercel only needs `ORDER_SERVICE_URL` and `ORDER_SERVICE_TOKEN`.

Analytics: `proxy.js` sends a signed page view for each page request. With analytics consent,
`components/Analytics/LookuAnalytics.jsx` also sends reading time, scroll depth and named events through
`app/api/looku`, which forwards them without the IP address. Only Vercel production sends data (`LOOKU_ENDPOINT`,
`LOOKU_SITE_ID`, `LOOKU_SIGNING_KEY`); local development and previews send nothing.

## Contributing

Lieromaa is a one-person project. Bug reports and suggestions are welcome as
[issues](https://github.com/niemenjoki/lieromaa/issues). If you would like to write for the guides, email
info@lieromaa.fi.

## License

Source code under the MIT License, site content under Creative Commons Attribution 4.0 International. See
[`LICENSE.md`](LICENSE.md).

Made by Joonas Niemenjoki · [lieromaa.fi](https://www.lieromaa.fi) · info@lieromaa.fi
