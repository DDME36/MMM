# Wish butterfly

Created using the built-in image generation tool for the three wish cards. The original transparent PNG is saved at `public/assets/images/wish-butterfly.png`. The optimized 320-pixel transparent WebP served by the website is `public/assets/images/wish-butterfly.webp` (about 40 KB).

The butterfly uses two clipped halves of the same asset, animated independently for wing beats. Six finite flights appear once when all wish cards are open together, stay near the viewport edges, ignore pointer input, and are removed after their final fade or when the wish section leaves view. Edit the image path in `CONFIG.secrets.butterflyImage` and timing in `CONFIG.motion.butterflyFlightMs` / `butterflyFlapMs`.

## Final generation prompt

Use case: stylized-concept. Asset type: a single isolated butterfly sprite for a warm, intimate birthday website. One exquisite small butterfly, seen directly from above with both wings fully spread, bilaterally symmetrical, slender body precisely centered on the vertical centerline and pointing upward. Graceful organic scalloped wings in dusty blush pink, warm ivory and restrained rose-gold veins, delicate translucent satin-paper texture, fine natural wing markings and tiny pearlescent flecks. Refined and softly luminous, not a cartoon, not an icon, not plastic. Entire butterfly and both antennae within frame with a little clear margin; flat orthographic view so the two wing halves can later be animated independently. A genuinely transparent background, clean soft alpha edges, no floor, no cast shadow, no glow baked into surrounding pixels, no flowers, no scenery, no text or watermark. Square composition.
