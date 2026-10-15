# Clothing Rack Canvas turn — opt-in integration

The Notion guide describes a 480×480 WebP frame sequence per garment. This repository currently uses the original CSS 3D rack; **do not replace it** until real, licensed and product-accurate frame sequences are available.

## Prepared player

`assets/clothing-turn-player.js` exposes `window.ClothingTurnPlayer`. It preloads **all** frames before activation, plays forward/backward at approximately 1.1 seconds, supports reduced-motion and cancels animation on teardown. It deliberately does not manipulate the current rack DOM. No changes to production HTML are needed until assets are verified.

## Integrate after asset validation

1. Prepare a transparent, accurately photographed front and side view for one 369 garment; label synthetic angles as generated and never as genuine photography.
2. Export settled turn frames in order to `public/frames/<product-id>/001.webp`, etc. Ensure that any print text remains correctly oriented. Avoid white boxes and check every frame.
3. Add the player script to a staging copy of the page, create a canvas inside the matching rack slot, and initialize the player with the ordered frame URLs.
4. Await `player.preload()`; only when it returns true, show the canvas and hide the existing CSS garment for that slot. On failed frames keep the CSS garment visible.
5. Connect mouseenter/focus/touch selection to `player.setOpen(true)` and mouseleave/blur to `player.setOpen(false)`. Call `destroy()` when replacing rack content.
6. Validate hover, reverse animation, keyboard, touch, performance and product fidelity on real mobile and desktop before production deployment.

This is a **foundation module**, not a claim that actual 369 garment videos or frames have been produced.
