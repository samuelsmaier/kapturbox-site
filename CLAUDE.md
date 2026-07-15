# hermes-zoom-in — KapturBox marketing site ("The Sky Pages")

Full rebuild of kapturbox.com: a traditional vertical-scroll page set in a dark
engraved sky. Parallax cloud plates and a distant ancient Greek city drift
behind the sections; Hermes (copperplate engraving, neon pink envelope) is the
hero artifact. Full email creative opens in an inspectable viewer, testimonials
page side to side, and the full team is visible.
HISTORY: this was a 3D fly-through ("The Flight") until 2026-07-14 — Sam
loved the dolly but not the pattern; the flight code lives in git history.

## Files
- `index.html` — all content, sections in DOM order (also the a11y/fallback order)
- `styles.css` — tokens at top; `.flat` base document + `.page` enhanced mode
- `main.js` — core work viewer, testimonial deck, and nav for every viewport;
  enhanced desktop adds hero video, #sky parallax clouds, horizon pan, reveals
- `assets/` — hermes-dark.png + motion/mask, plates/, team/, testimonials/, work/
- `vendor/` — gsap.min.js, ScrollTrigger.min.js (no CDN at runtime)

## Run
`python3 -m http.server 4173` then http://localhost:4173

## Deploy
GitHub: `https://github.com/samuelsmaier/kapturbox-site`  
Cloudflare Pages project: `kapturbox-site`  
```bash
git archive HEAD | tar -x -C /tmp/kb-pages-deploy
wrangler pages deploy /tmp/kb-pages-deploy --project-name=kapturbox-site
```
Preview: `https://kapturbox-site.pages.dev` (or latest `*.kapturbox-site.pages.dev`)

## Design law (do not drift)
- Light engraving ink on charcoal #191b1a. ONE accent: neon pink #ed188f —
  wordmark period, the italic "Retention" in the h1, actions, and small status
  labels. No additional accent hues.
- Type: IM Fell English (display/quotes only), Instrument Sans (body),
  IBM Plex Mono (labels/stats/captions). No other faces.
- 0px corners, light hairline borders, flat surfaces, restrained shadows, and
  no decorative color gradients. Aquatint grain is the only page texture.
- Sam's taste (hard-won): one signature device at a time; iterate in the smallest
  possible increments; when he asks for "more creative," get a visual reference
  before guessing.
- Photos run grayscale so they live in the etching's tonal world; real campaign
  creative (work section) stays full color — the exhibits are the exception.
- Copy: specific > clever. No fabricated metrics. Stat line is
  "$1B+ attributed revenue generated" ($1B+ set in IM Fell, not mono — Sam's call).
- Reviews are ONE calm panel with a side-to-side quote deck. Buttons and swipe
  work on desktop, mobile, reduced-motion, and the plain fallback.
- Masthead nav: Recent work / Reviews / Work with us. Mobile keeps only the
  primary Work with us action.

## Content sources (facts only, no design inheritance)
- Testimonials + team roster extracted from the retired Desktop build
  (~/Desktop/kbsite-hermes). Revenue roster: ~/Documents/kbox/scratch/kb-lifetime-revenue.
- Hermes plates originals: ~/Desktop/kbsite-hermes/plates (dispatch-cut.png is source).

## Current state (2026-07-15 dark direction approved)
- WHOLE SITE RUNS DARK: body class="flat dark". Dark is the final direction,
  not a temporary theme experiment.
- NIGHT GROUND = "THE ETCHED SKY" (Sam picked over flat-slate and
  wiped-plate vignette, asked "a bit lighter"): ONE flat charcoal #191b1a
  (no gradient — all three --sky tokens equal it), a fine aquatint grain
  (body.dark::before, inline SVG feTurbulence, opacity .07), and ONLY the
  white-line engraved cloud plates in the sky (opacity .3-.5, still
  parallaxing) — the soft glow blobs are NOT created in dark mode (they read
  as smoke stains; main.js skips them when darkMode).
- Mechanics: tokens flip to light ink, light hairlines, and dark paper.
  Laurel/seal/city still use filter: invert(1) [hue-rotate(180deg)].
- NATIVE DARK PLATES (2026-07-15, replacing CSS inversion for the big art):
  assets/hermes-dark.png (alpha cutout still), assets/hermes-motion-dark.mp4,
  assets/plates/cloud-a-dark.png / cloud-b-dark.png (alpha cutouts).
  main.js picks files by body.dark (darkMode var); the HTML still is also the
  native dark plate so mobile and no-JS never depend on CSS inversion.
- Dark motion video (Kling 3.0 from the dark still): pedestal + statue
  STONE-STILL, wind drives the cape (Sam's brief). Verified by frame-diff:
  pedestal region ~36.5dB PSNR across the loop (static), cape region ~15.8dB
  (heavy motion). Ground crushed to true black (curves 0.13→0), audio
  stripped, 1.5MB.
- ⚠️ BLEND LAW #2: mix-blend-mode on hero art is a NO-OP — body.page .stage
  {z-index:1} isolates the stacking context, so blends never see the body
  gradient. Masks do the real compositing. Dark video mask =
  assets/hermes-mask-dark.png. Recipe (hard-won, Sam caught the fails):
  (1) threshold with geq NOT lutyuv — lutyuv clamps to TV range (floor 16 =
  the whole rect ghosts dark); (2) union the motion luminance WITH the still
  cutout's alpha — luminance alone leaves holes where the plate is dark
  (satchel, cape shadow); (3) boost mids to solidify texture; (4) feather
  right-64px/top-44px because the billowing cape exits the video frame;
  (5) the video ground remains floored to warm dark #1b1814 under the mask.
  Check for a halo against #191b1a before changing the mask or video floor.
- NB: python http.server 404s query strings — never cache-bust assets with
  ?v=; rename or plain-reload instead.
- ORDER: hero → typographic client field → services ledger → recent work →
  testimonials → studio/team → CTA.
- RECENT WORK: eight real sends sit in the moving frieze. Every tile opens a
  native dialog with the full-height creative, project navigation, keyboard
  arrows, and a mobile layout. No invented performance metrics.
- STUDIO: Sam and Joel lead, followed by a compact 20-person contact sheet so
  the 22-person claim is visually supported. CTA is a prefilled intro email.
- TRUSTED BY: intentionally all-typographic until a complete normalized logo
  set exists; do not mix real marks with text substitutes.

## Previous state (2026-07-15 identity pass)
- Hero: NO eyebrow, NO logo (Sam tried the real logo there 2026-07-15 and cut
  it — "doesn't look good there"). The headline leads. The Atlas logo asset
  stays at assets/logos/kapturbox.png for other uses.
- NIGHT ROOM: the page darkens to var(--night-ink) as you scroll into reviews
  and lifts on the way out. #night = fixed wash above #sky, below .stage;
  main.js ramps opacity + --night01/--nightpct (trapezoid over trigger
  "top 45%"→"bottom 40%", full dark by 28% progress). Reviews + masthead
  colors crossfade via color-mix(... var(--nightpct)); the laurel inverts to
  a white engraving (filter: invert(var(--night01))). Flat mode: no #night,
  reviews stays light. If more sections ever go dark, reuse the same vars.
- Brands → "Trusted by": 5 real marks grayscaled to ink (redvanly, origin,
  obagi, eastside-golf, mixed — assets/logos/) inline with 9 IM Fell text names.
  MISSING LOGOS: cuts, normal brand, little words project, milk makeup, vitaly,
  driveline, golftini, fringe sport, steel city — Sam to supply, drop in same row.
- Reviews: UNPINNED (Sam: scroll-paging felt wrong vs side-to-side arrows).
  Now a full-viewport calm section; arrows slide quotes horizontally
  (.deck flex track, --di index, wraps around). Avatars 68px, borderless.
- Frieze: mats/borders removed (Sam: "don't love the outline") — bare images.
- Studio + CTA MERGED into the finale (id="work-with-us"): Sam & Joel
  portraits (168×200 grayscale, hover color), founder about-copy, PINK
  "Work with us" button (inherits the third pink slot), join-team link,
  colophon. THE ENVELOPE IS GONE (Sam's call) — code in git history.
- Clouds calmed ~30% (blobs .28-.52, plates .12-.22) — readability first.
- What we run = THE LEDGER (Sam picked it over Motto/Proof Rows, asked to
  "spice it up"): roman-numeral index, IM Fell names, dotted leaders,
  right-aligned one-liners, hairline rules, NO graphics. Spice = entrance
  (rows rise, leaders draw via scaleX stagger) + hover (name springs 7px
  right via CSS linear() spring, description inks up, one pink dot lands at
  the leader's end — pink-on-hover is established grammar, like nav
  underlines). Old artifact-viz panels ("AI-vibe coded") deleted.

## Previous state (2026-07-14 scroll-model switch)
- MODE ARCHITECTURE: body starts `class="flat"` (the base document layout —
  mobile / reduced-motion / no-JS get exactly this, envelope arrives sealed).
  On desktop with motion OK, main.js ADDS `.page`: flat's layout stays as the
  base and page rules layer on. Flat-only overrides use `body.flat:not(.page)`.
- Sky: #sky is a fixed z-0 backdrop (12 soft blobs + 6 engraved plates) that
  parallax-drifts against scroll (per-cloud speed 0.1–0.38, sinusoidal sway,
  vertical wrap) — sections scroll over it (.stage is z-1 relative). The
  acropolis horizon is fixed at the bottom, panning with scroll (--hx).
- Recent work = THE FRIEZE (2026-07-15, replaced the print-desk pile — Sam:
  "too AI... emails are tall and narrow, I want a consistent proportional grid
  with motion, no internal scroll"). One row of 8 uniform tall panels
  (262px wide, 0.42 aspect windows, object-fit cover top — header/hero/first
  sections of each send), alternating -28px meter offset. Motion: (1) panels
  assemble with a spring settle (gsap back.out, stagger, once) as the section
  enters; (2) the row glides sideways (scrub, no pin) as the section passes;
  (3) hover lifts with a CSS linear() spring. Rejected on the way: plate-wall
  salon hang, folio spread, print-room stack (all felt wrong vs email nature).
- Pinned scene 1 — reviews: section pins for 65vh per quote; ScrollTrigger
  progress pages the deck; snap settles on quote centers (snap is SAFE here —
  no scrub-lag; the flight-era runaway was scrub+snap, documented below).
  Arrows scroll to (i+0.5)/n of the pin span.
- Pinned scene 2 — CTA: pins for 170vh; progress = --dp drives the envelope
  (letter in → flap folds → wax seal). Same CSS stage machinery as before.
- Flowing sections (brands/services/work/about) get a quiet rise-in via
  IntersectionObserver (.is-in).
- Nav (data-goto) scrolls to pin starts for pinned sections, element top - 72
  otherwise; html scroll-behavior forced "auto" in page mode (see below).

## Previous state (2026-07-14 art & vibes pass, flight era)
- Hero: hermes-motion.mp4 (cape stirs, letters flutter) plays in fly mode —
  injected by main.js over the still cutout, CSS-masked by assets/hermes-mask.png
  + multiply blend. The mask is a union of figure coverage across all video
  frames (colorkey → tmix → blur/boost close → feather; recipe re-runnable via
  ffmpeg, source video plates/hermes-motion.mp4 in ~/Desktop/kbsite-hermes).
  Flat/reduced-motion/mobile keeps the still — no video download there.
- Recent work: the two-page deck is gone. ONE "print-desk pile" collage —
  8 emails absolutely positioned with ±≤1.8° tilt, overlapping, per-item
  --x/--y/--w/--ar/--r inline vars. Hover lifts + straightens a print, travels
  the email at reading pace (--travel px set by JS), caption fades in. Items
  carry data-part so the pile flies apart as the camera passes. Flat = 2-col grid.
- Sky: drift-art spot plates REMOVED (Sam: "don't like the icons floating
  around"). Clouds carry the vibes instead: 30 soft blobs + 8 engraved cloud
  plates (assets/plates/cloud-a/b.png, gpt_image_2 in the hermes style, 2:1
  crop, colorkey-cut to alpha), all sweeping aside (smoothstepped __dx/__dy
  throw) and swelling ×1.45 as the camera pushes through; half the plates
  mirrored via __fx.
- Horizon: engraved acropolis skyline (assets/plates/city-horizon.png) fixed
  at the bottom of .stage BEHIND .world — opacity .2, top-faded by CSS mask,
  pans slowly with the camera (--hx = -cam.z*0.0014vw). Hidden in flat mode.
  Regen recipe: gpt_image_2 + hermes-cut.png style ref, then
  crop → colorkey(bg hex, 0.13:0.10) → scale; raw gens in scratchpad.
- Section emblems kept: laurel above Client words, grayscaled KB seal above
  The studio (.stop-spot).
- CTA finale: manila envelope choreographed by scroll. Dwell progress exposed
  as --dp on dwell stops; stages in CSS: s1 letter (TO/RE lines) slides in,
  s2 flap folds down (2D scaleY -1→1 fold, faces crossfade at edge-on; 3D
  rotateX projected wrong past 90°, don't go back), s3 red wax SVG seal stamps.
  .is-sealing class (dp>.42) lifts flap above the letter. TAIL=0 — the scroll
  ends exactly when the wax lands. Flat mode arrives sealed (--dp:1).
- Section CTAs: "Work with us →" on services/reviews/work (data-goto flies to
  finale), "Join our team →" (mailto) on The studio. Class .section-cta.
- Reviews: quotes upright (not italic — readability), dwell 5600, work moved
  to z 13200 so the colorful pile can't ghost behind late quotes. A hand-rolled
  "quote magnet" eases scrollY to the nearest quote center 160ms after scroll
  settles. Do NOT use ScrollTrigger snap: it reads the scrub's lagging progress
  and teleports the scroll (runaway). Also: html scroll-behavior is forced to
  "auto" in fly mode — CSS smooth turns any programmatic scroll write into a
  fight (scrollToZ passes behavior:smooth explicitly instead).
- Z map: hero 0 · brands 1700 · services 3500 · reviews 5100+5600 ·
  work 13200+1200 · studio 16800 · cta 19700+2600. Z_STEP 1450.
- ⚠️ COMPOSITING LAW: never put mix-blend-mode on a direct child of .world
  (preserve-3d). Chrome silently blanks the whole scene at far camera depths.
  Blends are safe INSIDE a .stop (stops have filter → own stacking context).

## Previous state (2026-07-14 polish pass)
- Services: SIX panels (Email, SMS, Full In-House Creative, Retention Strategy,
  Calendar Management, Partner Management), each with a small "artifact" viz
  instead of an icon: mini inbox w/ pink unread dots, SMS bubble exchange
  (border-radius allowed here — it depicts a phone screen), 3 real creative
  thumbnails (color), segment bars (VIP = pink), CSS-gradient send calendar
  with pink send days, platform tag row. Color budget: pink + real creative
  only — no new hues.
- Recent work: 8 real emails in a two-page deck (dwell-paged + arrows), hover
  travels the full email at a pace scaled to its length (capped 18s).
- Reviews: one panel, 5 quotes paged by scroll AND clickable arrows (arrows
  scroll to the matching dwell slice so scroll stays the single source of truth).
- Finale: team photos moved to The Studio as a roster grid (hover = color);
  CTA is now the pink envelope (TO KAPTURBOX / RE MY EMAIL & SMS PROGRAM),
  whole envelope = mailto. CTA sits at z=18400 so its pink never ghosts
  through the studio (saturated color needs >2800 z-gap, unlike ink panels).
- Hero: entrance stagger on load; masthead has a sky scrim gradient.

## Open
- CTA is a prefilled mailto:sam@kapturbox.co — swap for the real scheduling or
  qualification link when one is selected.
- Scroll model DECIDED 2026-07-14 (second pass): traditional vertical with
  pinned scenes. Sam first kept the flight, then cut it same day — "the going
  forward is great but I just don't know if it works." Don't relitigate.
- Deploy target: Cloudflare Pages (not wired yet). Before deploy: og:image,
  favicon file, and compress heavy PNGs — hermes cutout 1.5MB, city-horizon
  2.6MB, cloud plates ~1.5MB each (pngquant or WebP with alpha).
- Work cards are <figure> not links — Sam to supply per-brand URLs if wanted.
- Pile layout is hand-placed for ~1240px; worth a squint at 1024-1200px widths.
