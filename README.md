# 369 CLOTHING — Interactive clothing rack store prototype

A standalone, static site built by customizing the GPL-2.0-or-later Mkurugenzi interactive clothing-rack code. Inspired by the Mkurugenzi implementation: https://github.com/KabuorJnr/mkurugenzi

## Run
Open index.html directly in a modern browser, or run \`python3 -m http.server 8000\` in this folder and visit http://localhost:8000.
Deploy the directory as a static website to GitHub Pages, Netlify, Cloudflare Pages, or Vercel. No build command required.

## Site features
- 369 Clothing design and responsive landing page
- Original interactive 3D-like swing clothing rack and accessories wall, keyboard and touch controls
- 12 self-generated, original vector illustration products without Mkurugenzi's third-party product photos
- Catalog in assets/products.js
- Working sample bag with adjustable quantities, not connected to a payment processor

## Important — Prototype, not a live shop
Product names, inventory and USD prices are **illustrative sample placeholders**. No real payments or orders can be placed, and do not collect customer details. Replace products with actual photos and genuine prices before production. To enable real checkout integrate WordPress + WooCommerce through the original GPL plugin and configure your payment gateway, taxes, shipping, privacy policy, and local legal requirements.

## Original code and licensing
The rack and demo bag JavaScript and rack CSS are derived from KabuorJnr/mkurugenzi and remain available under GPL-2.0-or-later per the upstream README. Fonts are under SIL OFL 1.1; license texts are in assets/fonts. The newly created SVG illustrations, site layout, text and 369 Clothing branding are separate original work produced for this prototype. Upstream Mkurugenzi product images, marks and original catalog were intentionally excluded.
