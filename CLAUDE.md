# JUTORIA (jutoriahome.com)

Premium eco-friendly handmade home décor — B2B/wholesale focused e-commerce +
public marketing site, operated by SIRCOMMERCE GROUP LTD.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS (utility classes only, no separate CSS files per component)
- React Router (`react-router-dom`)
- Firebase: Firestore (products database), Firebase Storage (product images),
  Firebase Auth (admin login)
- Hosted on Hostinger (static `dist/` build uploaded to `public_html`)

## Project structure

- `src/pages/public/` — public marketing/e-commerce pages (Home, Products,
  ProductDetail, Contact, CorporateInformation, Wholesale, etc.)
- `src/pages/admin/` — Admin Panel (login-protected): ProductForm.tsx (add/edit
  product incl. image upload), Products.tsx (product list)
- `src/layouts/PublicLayout.tsx` — shared Header + Footer for all public pages
  (nav links, social links, footer contact info, footer WhatsApp Icon component)
- `src/components/product/ProductGallery.tsx` — product image gallery/lightbox
- `src/services/firebase/` — `config.ts` (Firebase init incl. Storage),
  `products.ts` (Firestore CRUD + `uploadProductImage()` for Storage uploads)
- `src/data/` — static seed data (`products.json`, `materials.ts`, etc.) used
  as fallback before Firestore loads
- `storage.rules` / `firestore.rules` — NOT auto-deployed (no Firebase CLI in
  most dev setups here); after editing, paste manually into Firebase Console →
  Firestore/Storage → Rules → Publish

## Design conventions

- Brand colors via Tailwind theme tokens: `brand-navy`, `brand-gold`,
  `brand-ivory`, `brand-offwhite` — always use these, never raw hex
- Fonts: `font-serif` for headings, `font-sans` for body text
- Buttons/cards mostly use `rounded-[2px]` (sharp, minimal corners) —
  intentional brand style, not a default to "fix"
- Bengali code comments are used throughout for context/rationale — keep this
  pattern when adding non-obvious logic

## Product images — important context

All product images are uploaded via the Admin Panel's **"Upload Images"**
button (ProductForm.tsx → `uploadProductImage()` in `products.ts`), which
puts them in Firebase Storage at `product-images/{sku}/{timestamp}-{filename}`
and stores the resulting URL in Firestore. Images are **not** stored in
`public_html/product-master/` anymore — that folder only contains empty
placeholder scaffolding left over from an earlier manual workflow and should
be treated as legacy/unused.

`ProductGallery.tsx` identifies the active/thumbnail image by **array index**,
not by URL string — this was a deliberate fix for a bug where two images
with an identical URL would silently collide and one would visually replace
the other. Don't revert to URL-based identification.

## Deployment

1. `npm install` (first time only)
2. `npm run build` → produces `dist/`
3. Upload the entire contents of `dist/` to Hostinger's `public_html`,
   replacing what's there. Safe to delete `public_html` entirely first — no
   product data or images live there (see above), everything is in Firebase.
4. Firestore/Storage rule changes require manually re-publishing in the
   Firebase Console (see `firestore.rules` / `storage.rules` above) — this
   repo's rule files are the source of truth to copy from, but publishing
   itself isn't automated.

## Contact info — single source of truth per surface

Verified emails/phones live in three places and must stay in sync manually
when they change:

- `src/pages/public/Contact.tsx` — Contact page
- `src/pages/public/CorporateInformation.tsx` — team cards + office contact
  blocks
- `src/layouts/PublicLayout.tsx` — footer "Get In Touch" section

Each phone number should have both a `tel:` link and a `wa.me/` WhatsApp link
(digits only, no `+`, no spaces/dashes). Each page/section defines its own
small `WhatsAppIcon` SVG component locally (lucide-react has no WhatsApp
glyph) — `PublicLayout.tsx` instead adds a `'whatsapp'` case to its existing
`SocialBrandIcon` switch. Follow whichever pattern the file already uses.
