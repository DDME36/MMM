# Mimiw — a little birthday story

The existing Vite, React, Tailwind CSS, and Framer Motion stack is retained. The original photographs, animated bento composition, music, and letter content remain the personal foundation. The birthday is updated to age 25, on 22 October 2026 (2569).

## Design

Mobile reading stops use the actual layout bounds of bento tiles, wish cards, and the revealed birthday letter. Whole cards are packed into the available viewport with space reserved for the sound control and progress indicator; shorter screens get separate card stops. Reading chapter containers remain steady on mobile while their own reveals, flips, particles, and background colors continue animating. Visual viewport changes retarget an active transition instead of cancelling it halfway. Geometry regression tests cover 568–932px mobile viewport heights and letters longer than one screen.

The current experience is configured entirely through `src/config.ts` and uses seven paced, scroll-driven chapters. Mouse/trackpad gestures, touch swipes, Page Up/Down and Space advance via a 1.15-second transition. Tall chapters receive intermediate reading stops. It comprises an animated envelope entrance, staggered birthday greeting and live lifetime counter, the preserved original bento, six polaroids in three paired memory scenes, three 3D secret wish cards, and an interactive CSS cake. Opening the envelope starts configured music and confetti; blowing out the candle removes the flames, releases smoke, runs bounded fireworks, and reveals a Thai-grapheme-aware typewriter letter.

The bento portrait remains `assets/images/mimiw.png` with its original floating cutout treatment, and the original SVG gradient MIMIW / PHROM sequence remains. Preserve this specific image and effect. New personal copy, colors, artwork links, dates, song links, and motion options are read from CONFIG. There is no header or footer. Only the sound control remains in the top right. The presentation always enables animations, with no visitor motion toggle, as explicitly requested.

The user confirmed 22 October 2001 at 00:00 Bangkok time as the counter start. The live counter tracks total days and remaining hours, minutes and seconds. The celebration age is independently configured as 25 for 22 October 2026. Font sources remain local Cormorant Garamond, Mali, and Sarabun. Counter numerals use lining, tabular Sarabun for clear reading.

## Generated artwork

Generated with the built-in image generation tool, then saved in this project:

- Original: `assets/images/birthday-25.png`
- Optimized web version actually served: `assets/images/birthday-25-web.webp`

Final prompt:

> Use case: stylized-concept. Asset type: full-width illustration for a personal cozy birthday website, editorial birthday still life, landscape composition. A tiny handmade strawberry vanilla birthday cake with scalloped piped pale buttercream, a few small strawberries and two elegant dusty rose wax numeral candles reading exactly 25 with tiny lit flames. Cake on a simple ceramic scalloped plate on a warm ivory tablecloth; loosely draped pale blush ribbon and two delicate garden cosmos flowers beside it. Sophisticated tactile stop-motion clay and paper illustration, soft morning window light from upper left, real soft shadows, warm creamy background #f8f4ec, muted rose #ac5665, sage green accents. Cake centered with generous empty breathing room around subject, objects fully inside frame, camera slightly above eye level, no people, no other text, no lettering, no logos, no watermark. The image should feel intimate, quiet, lovingly handmade and premium, not plasticky or glossy.

Existing photographs have optimized WebP siblings; originals remain intact. The selected ambient track is a 90-second loop excerpt with fades, stored as `assets/audio/ambient-cozy.mp3`. Ambient preloading is disabled; the song loads metadata for its real duration.

## Component resources

These were researched as useful references for future additions. This change uses the project's existing Motion library and original components; it does not install these libraries or copy their components wholesale.

- [React Bits](https://reactbits.dev/): animated React components with CSS or Tailwind variants; especially useful for selective scroll reveals and typography.
- [Aceternity UI](https://ui.aceternity.com/): React, Tailwind, and Motion components; select the free components and adapt their styling to the paper/rose palette.
- [Motion scroll animation documentation](https://motion.dev/docs/react-scroll-animations): the existing stack already supports parallax, viewport animation, and progress indicators.

## Validation

Production build and TypeScript checks pass. Server-render tests confirm that all five story sections render behind an inert entrance gate, referenced image files exist, and birthday details come from CONFIG. The automated test suite checks timezone-aware lifetime boundaries, Thai grapheme segmentation, the gated initial state, the preserved bento, six photos, three secret cards, candle flames, image references, and updates made solely through CONFIG. The original image 8 was re-encoded with EXIF orientation respected. The local preview confirmed gate entry, playing audio, a running lifetime counter, polaroid reveals, and the extinguished-candle/visible-wish state. Desktop and a 400 × 844 mobile viewport were inspected. The compact music player keeps its existing bento cell and album artwork, with live seeking, skip/back 10 seconds and desktop volume. A single fixed background interpolates the seven CONFIG chapter colors; the hero, paired photographs, orbit and drawn thread move at different depths. The user-requested presentation always enables motion; its visitor toggle and configuration switches have been removed.

Run `npm run dev` and open `http://localhost:5173/` for local review. Run `npm run build` to generate `dist/`.
