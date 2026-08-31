# Lieromaa

[**lieromaa.fi**](https://www.lieromaa.fi), a Finnish-language website dedicated to **vermicomposting** (worm composting) and sustainable waste management.

> Turning kitchen scraps into rich soil naturally, with worms

---

## Overview

**Lieromaa** is a Finnish educational website and blog about worm composting. It teaches how to compost household biowaste efficiently, provides DIY guides for compost bins, and promotes sustainable soil enrichment methods.

This repository contains the **source code for the Lieromaa website**, built with **Next.js**. The live site is hosted on [Vercel](https://vercel.com).

> **Note:** All public-facing content on the site is written in **Finnish**.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/)
- **Language:** JavaScript (ES Modules)
- **Styling:** CSS Modules
- **Hosting:** [Vercel](https://vercel.com)
- **Static Assets:** Optimized using [Sharp](https://sharp.pixelplumbing.com/) for AVIF/WEBP/JPEG variants
- **Content:** Markdown posts with YAML front matter

## Local checkout development

Copy the tracked `.env.example` to the ignored `.env.local` and run the separate development instance of `lieromaa-orders` on `127.0.0.1:3013`. This avoids the production-style container that normally occupies port `3010`. Local `next dev` identifies itself as Stripe `test` mode, and the order service refuses the request unless it is also running in test mode with an `sk_test_...` key. The browser is redirected to Stripe's real hosted Checkout sandbox; this repository does not implement a fake payment UI.

Production builds identify themselves as Stripe `live` mode. The home-server order service independently requires live credentials when `NODE_ENV=production`. Stripe secret keys and webhook secrets belong only to the home-server runtime and must never be added to this repository or to Vercel. Vercel needs only the existing `ORDER_SERVICE_URL`, `ORDER_SERVICE_TOKEN`, and optional timeout setting.

- **Data:** JSON-based structured datasets (e.g., Finnish worm sellers)

---

## Contribution

Lieromaa is intended to be a solo project.

That being said, if you have found a bug or an improvement opportunity, feel free to create an issue and I'll check it out.

If you want to contribute to writing content on the blog, contact me at info@lieromaa.fi and we can discuss how we could make that possible.

---

## License

The source code is licensed under the MIT license.

The website's content is licensed under Creative Commons Attribution 4.0 International license.

See [`LICENSE`](LICENSE) for details.

---

## Author

**Joonas Niemenjoki**

- [lieromaa.fi](https://www.lieromaa.fi)
- Contact me at: info@lieromaa.fi
