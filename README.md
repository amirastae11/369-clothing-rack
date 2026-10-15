# 369 Clothing × Hangline / Mkurugenzi v3

Static interactive Persian streetwear catalog based on the **Mkurugenzi CSS 3D clothing-rack engine**, styled after the owner's Hangline screenshot. License: GPL-2.0-or-later for derived Mkurugenzi code. See [upstream](https://github.com/KabuorJnr/mkurugenzi) and LICENSE-THIRD-PARTY.md.

## Deploy to Cloudflare Workers

The deploy entry is `public/index.html`, identical to `index.html`. Keep the existing `wrangler.toml`:

- `name = "369-clothing-rack"`
- `[assets] directory = "./public"`
- Build command: empty
- Deploy command: `npx wrangler deploy`
- Production branch: `main`

Live site: https://369-clothing-rack.nayererohalamini.workers.dev/

## Current features

- Editorial ivory / forest-green design, responsive grids, 4 interactive clothing rails, product detail modal and size selection.
- Snapshot catalog of 17 real 369 Clothing items with owner-hosted public product images and TOMAN prices, category filters, lookbook and social links.
- **Demo selection bag only.** It never asks for shipping address or phone number. Per-item direct links open the real store, where availability, prices, and checkout must be verified.
- Recognizes Persian color words, enhances keyboard focus, prefers-reduced-motion and tap targets.
- If WordPress resized media fails, retries original image URL, then shows an explicitly marked schematic fallback; it is **not** a real photo.
- Schema.org Organization and WebSite metadata without unverified addresses.

## Known limitations

- Real 369 images are remotely hosted and could not be downloaded or exhaustively verified from the build environment.
- True photographic side views / transparent garment cut-outs are not available for every item; actual appearance on the 3D rail needs asset-level review.
- Catalog prices/stock are snapshots, not real-time WooCommerce sync; live payment intentionally disabled.
- iOS Safari on a real device has not been tested in this environment.
- Assets directory contains historical prototype files; the production worker serves solely from `public/`.

## Regression testing

A self-contained local regression script and technical report are included in the downloadable **v3 complete source ZIP** supplied in the ChatGPT project conversation. The test uses Chromium at 320, 390, 768 and 1440 px with synthetic media success and intentionally failing media responses. A test fixture is never part of the published HTML.

## v6 catalog clarity and photo diagnostics

See [Persian v6 technical report](docs/V6_MEDIA_AUDIT_FA.md). For a real-browser media audit of all 17 garment photos, open `/media-check.html` on the Cloudflare deployment. The main site retains Mkurugenzi CSS 3D fallback when authenticated animation frames have not been supplied. Prices and availability are not live; real checkout is still disabled.
