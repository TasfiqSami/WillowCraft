# SEO and GEO

All search and AI-crawler output comes from one pure module, `src/seo.js`. The build (`scripts/build-vercel.mjs`), the dev server (`server.mjs`) and the browser router (`src/app.js`) share it, so titles, descriptions, canonicals and structured data cannot drift apart.

## What it does
- Prerenders every route to `public/<route>/index.html` with a unique title, description, canonical, Open Graph / Twitter tags, JSON-LD and readable content. Crawlers that do not run JavaScript see real page content; the SPA takes over in browsers.
- Unknown routes get `404.html` with `noindex`.
- Generates `robots.txt`, `sitemap.xml`, `llms.txt` and `manifest.webmanifest`.
- Draft pages (`/terms`, `/privacy`, `/shipping`, `/refunds`, `/maintenance`) and empty announcements/leaderboard/gallery are `noindex, follow` and left out of the sitemap.

## Honesty rules
- Stats and infrastructure in `src/config.js` marked `confirmed: false` never appear in structured data or crawler text.
- No ratings, offers, prices, founding dates or products are emitted unless real data exists.
- FAQ entries whose answer only says "not supplied/confirmed" are excluded from FAQPage markup.

## Configuration
- `SITE_URL` sets the canonical origin (default `https://www.willowcraft.top`). Set it in Vercel if the primary domain changes.
- Edit per-route titles/descriptions in the `PAGES` map in `src/seo.js`.
- To opt out of AI crawlers, uncomment the example block in `robotsTxt()`.

## Verify
```
npm run build:vercel
npm run check:seo
```
The check covers titles/descriptions (length, uniqueness), one H1, canonicals, JSON-LD parsing, noindex on drafts, sitemap/robots consistency and required assets.

## After deploying
1. Confirm one domain redirects to the other (apex to `www`, or the reverse) in Vercel > Domains, matching `SITE_URL`.
2. Submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools.
3. Test a few URLs with the Rich Results Test. `llms.txt` is a convention with unproven effect; it is harmless but not a ranking factor.
