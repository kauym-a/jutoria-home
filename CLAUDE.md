# JUTORIA (jutoriahome.com)

Premium eco-friendly handmade home décor — B2B/wholesale focused e-commerce +
public marketing site, operated by SIRCOMMERCE GROUP LTD.

## Where the live site lives

**The live site is the Astro project in `astro-site/`.** The React/Vite app at
the repo root (`src/`, `index.html`, `vite.config.ts`, `scripts/prerender.mjs`,
root `package.json`) is the retired previous version, kept only temporarily
as a rollback reference. It is **not built or deployed** — don't edit it.

## Tech stack (`astro-site/`)

- Astro (static output) + TypeScript, Tailwind CSS v4 (utility classes only)
- Public pages ship **no React** — all interactivity is CSS or small vanilla
  `<script>`s (mobile menu, product gallery, filters, forms, chat widget)
- Admin Panel is a React app (`src/app/`, React Router) mounted `client:only`
  at `/admin`; only `/admin/*` loads React
- Firebase: Firestore (products/categories/leads), Storage (product images),
  Auth (admin login). Public pages read Firestore **at build time** via the
  plain REST client (`src/lib/firestoreRest.ts`) — never in the browser
- Hosted on Hostinger (static `astro-site/dist/` uploaded to `public_html`),
  behind Cloudflare

## Project structure (`astro-site/src/`)

- `pages/` — one file per route; dynamic routes (`product/[sku]`,
  `categories/[slug]`, `materials/[slug]`) use `getStaticPaths()` with
  build-time Firestore data. `sitemap.xml.ts` is generated from the same data.
- `layouts/PublicLayout.astro` — shared header/footer/mobile menu/chat widget
- `components/` — `Icon.astro` (any lucide icon by kebab-case name, rendered
  at build time), `Img.astro` (optimized responsive `<img>`), `ProductCard`,
  `ProductGallery` (zero-JS, radio + CSS), `InquiryForm` (contact/wholesale
  → Firestore `leads`), `ChatPanel` (rule-based assistant)
- `lib/` — `products.ts`/`categories.ts` (build-time fetch with static
  fallback), `images.ts` (image pipeline, see below), `chat/engine.ts`, `seo.ts`
- `app/` — the Admin Panel, copied from the old site with its original folder
  layout so relative imports are unchanged (`app/services/firebase/` is also
  used by the public inquiry form, loaded only on submit)
- `data/` — static fallback data (`products.json`, `materials.ts`, …)
- `assets/site/` — copies of `public/` content images so the build can resize
  them (git stores identical files once)

## Design conventions

- Brand colors via Tailwind theme tokens (`global.css` `@theme`): `brand-navy`,
  `brand-gold`, `brand-ivory`, `brand-offwhite` — always use these, never raw hex
- Fonts: `font-serif` (Playfair Display) for headings, `font-sans` (Inter) for
  body — self-hosted via fontsource with metric-matched fallbacks (no layout
  shift on swap)
- Buttons/cards mostly use `rounded-[2px]` — intentional brand style
- Bengali code comments are used throughout for context/rationale — keep this
  pattern when adding non-obvious logic
- Keep public pages React-free; don't add `client:*` islands to public pages
  without a strong reason (that's what made the old site slow)

## Images

Product/category images are uploaded via the Admin Panel ("Upload Images",
`app/services/firebase/productsAdmin.ts`) to Firebase Storage and their URLs
stored in Firestore. At build time `lib/images.ts` downloads each one once,
resizes it to responsive WebP sizes and caches the result in
`node_modules/.astro/jutoria-img/` (cached across CI runs); the files are served
from `/_img/`. Firebase download URLs are immutable (new image = new URL), so
the cache never goes stale. Local images go through Astro's own pipeline.

`public/product-master/` **is still in use** (Wholesale page and the
`products.json` fallback reference it) — don't delete it.

The product gallery identifies images by **array index**, not URL — a
deliberate fix for duplicate-URL images colliding. Don't change that.

## Deployment (automatic)

`.github/workflows/deploy.yml` builds `astro-site/` and FTPs `dist/` to
Hostinger, then purges Cloudflare. It runs on:

- push to `master`
- `repository_dispatch` (`content-updated`) — sent by the Cloud Function below
  whenever a product/category is saved in the Admin Panel (~1-2 min to live)
- hourly schedule — safety net; skips uploading if nothing changed
- manual: GitHub → Actions → Deploy to Hostinger → Run workflow

Admin edits therefore appear on the public site after a rebuild, not instantly.

Local: `cd astro-site && npm install && npm run build && npm run preview`.

`.htaccess` lives in `astro-site/public/` (real 404s via `404.html`; `/admin/*`
rewritten to the admin app). Firestore/Storage rule changes are still published
manually in the Firebase Console (`firestore.rules` / `storage.rules` are the
source of truth).

### Auto-rebuild Cloud Function (one-time setup)

`functions/index.js` triggers the rebuild on `products/*` and `categories/*`
writes. Requires the Firebase **Blaze** plan. Setup:

1. Create a GitHub fine-grained token for `kauym-a/jutoria-home` with
   repository permission **Contents: Read and write**.
2. `npm install -g firebase-tools` → `firebase login`
3. From the repo root:
   `firebase functions:secrets:set GITHUB_DEPLOY_TOKEN --project jutoria`
   (paste the token)
4. `firebase deploy --only functions --project jutoria` (if it reports a
   Firestore location mismatch, set `REGION` in `functions/index.js` to the
   database's location)

## Contact info — single source of truth per surface

Verified emails/phones live in three places and must stay in sync manually
when they change:

- `astro-site/src/pages/contact.astro` — Contact page
- `astro-site/src/pages/corporate-information.astro` — team cards + office
  contact blocks
- `astro-site/src/layouts/PublicLayout.astro` — footer "Get In Touch" section

Each phone number should have both a `tel:` link and a `wa.me/` WhatsApp link
(digits only, no `+`, no spaces/dashes). WhatsApp/LinkedIn glyphs come from
`components/SocialIcon.astro` (lucide has no brand icons).

⚠️ The chat assistant's WhatsApp number (`src/lib/chat/engine.ts`,
`WHATSAPP_NUMBER`) is still the placeholder `8801XXXXXXXXX` carried over from
the old site — replace it with the real WhatsApp Business number.
