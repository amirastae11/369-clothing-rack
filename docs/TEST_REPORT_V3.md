# 369 Clothing — v3 regression test (2026-10-15)

- Chromium + reduced-motion: 320 / 390 / 768 / 1440 px: **PASS**.
- HTML metadata, main heading, 17 products, responsive width, 4 rack tabs, product detail and size selection: **PASS**.
- Demo bag quantity + official links, no collection of phone/address in demo checkout: **PASS**.
- Catalog filter counts: all=17, pants=3, qzip=1, jackets=4: **PASS**.
- JavaScript page errors in local interactive tests: **0**.
- Simulated WordPress media failures: retries unresized original then clearly labels schematic fallback: **PASS**.
- Actual photo downloads/visual cutouts, Safari on-device and live WooCommerce checkout: **UNVERIFIED / NOT ENABLED**.

These tests were done in local Chromium using media fixtures; their success is not a guarantee of fully correct live images.
