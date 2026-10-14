# 369 Clothing × Mkurugenzi — Cloudflare Pages

Interactive Persian storefront for 369 Clothing, based on the original Mkurugenzi CSS 3D clothing-rack engine.

## Live entry point

- **index.html** is a self-contained HTML/CSS/JS deployment entry point. Open it locally or deploy this repository's root directory to Cloudflare Pages.
- **assets/** currently contains older prototype assets retained for source history. The current `index.html` does not depend on those files.
- No npm install or build process is required for this standalone deployment.

## Cloudflare Pages with GitHub

1. In Cloudflare **Workers & Pages**, choose **Create application → Pages → Connect to Git**.
2. Select **amirastae11/369-clothing-rack**, not **beauty-store**. If the repo is missing, allow it in the Cloudflare Pages GitHub installation permissions.
3. Use production branch **main**, Framework preset **None**, leave **Build command** empty, set **Build output directory** to **.** (the repository root).
4. Choose **Save and Deploy**. Cloudflare creates an HTTPS `*.pages.dev` address.
5. Subsequent commits to **main** will trigger automatic deployments once this Pages project is linked to the repository.

## Important limitations

- Product photos load from the 369 Clothing website via online URLs; these are not yet cached locally.
- Catalog and prices are a snapshot, not live stock/price synchronization. Verify all items before accepting orders.
- Shopping bag/checkout is **demo-only**; no live payment gateway or confirmed order processing is configured.
- Rack motion uses the upstream CSS 3D and JavaScript engine, without migrating to Three.js.

## License and attribution

Derived portions of Mkurugenzi are subject to the original GPL-2.0-or-later licensing. See [LICENSE-THIRD-PARTY.md](LICENSE-THIRD-PARTY.md), the upstream [Mkurugenzi repository](https://github.com/KabuorJnr/mkurugenzi), and the inline upstream attribution within the current entry point. Embedded fonts follow their SIL Open Font License. Product names, images, and 369 branding belong to their respective owners.

## Rollback

The Git history retains earlier prototypes. A prior version can be restored by reverting the relevant commit, without modifying **beauty-store**.

## Cloudflare Workers (GitHub import wizard)

The project also supports the Cloudflare **Workers** wizard (the one showing **Deploy command: `npx wrangler deploy`**):

- Project name: `369-clothing-rack`.
- Build command: leave blank.
- Deploy command: `npx wrangler deploy`.
- Preview command: `npx wrangler preview`.
- Production branch: `main`.

The `wrangler.toml` points to `public/` for static assets. `public/index.html` is the exact HTML copied from the repository root; the original root `index.html` remains for Cloudflare Pages and direct static hosts. Upon successful Worker deployment Cloudflare provides a free HTTPS `*.workers.dev` address. Pages projects instead use `*.pages.dev`.

