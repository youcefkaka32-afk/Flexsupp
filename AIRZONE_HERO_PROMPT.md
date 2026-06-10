# AIRZONE — Exact Hero Section Replica
## Exhaustive Build Prompt for Manus / Google AI Studio / Codex

> **Goal:** Produce a pixel-perfect, fully interactive replica of the AirZone sneaker e-commerce hero slider. Every layout measurement, color, typographic rule, animation behavior, glitch effect, noise texture, and interaction must match the reference screenshots exactly. Use placeholder PNG images where real product images are not yet available, but every other detail must be production-accurate.

---

## 1. TECH STACK

- **Framework:** Vanilla HTML + CSS + JavaScript (single `.html` file) OR React + Tailwind — whichever the implementer prefers. All animations must use **GSAP 3** (loaded from CDN).
- **Fonts required:**
  - `Barlow Condensed` — weight **900** — for the giant hero category title (RUNNING / SUPERFLY / SNEAKERS). Load from Google Fonts.
  - `Space Mono` — weight **400** — for the monospace labels ("HIGH QUALITE", subtitle line, "VOIR PLUS", nav arrows). Load from Google Fonts.
  - The brand logo **AIR✳ZONE** uses a custom graffiti/street font. Use `Permanent Marker` or `Russo One` as a substitute — it must look hand-drawn/graffiti-style, white, bold.
- **Libraries:**
  - `gsap@3` + `gsap/CustomEase` — for all transitions and glitch timelines
  - No Three.js, no WebGL — the shoe visuals are flat PNG images with CSS transforms only

---

## 2. OVERALL PAGE LAYOUT

### 2.1 — Viewport
- Hero section is **100vw × 100vh**, full-bleed, no scrollbar visible during hero.
- Overflow hidden on the hero wrapper.

### 2.2 — Navbar (position: absolute, top: 0, left: 0, right: 0, z-index: 100)
- **Left:** Logo `AIR✳ZONE` — graffiti font, white, ~32px, positioned at approx `top: 16px, left: 24px`.
- **Center:** Navigation links — `ACCUEIL` | `BOUTIQUE` | `À PROPOS` — uppercase, ~13px, letter-spacing 0.15em, white, Space Mono or similar monospace. The active page (`ACCUEIL` on slide 1, `BOUTIQUE` on slide 2) has a subtle **underline** beneath it.
- **Right:** `LOGIN / REGISTER` text link, a search icon (🔍), a cart icon with a small green badge showing `0`, and `0 DA` text. All white, ~12-13px.
- Navbar background: **fully transparent** — it floats over the hero gradient. No background color, no blur backdrop.

### 2.3 — Left & Right Ghost Nav Circles
- Two large **circles** (approx 120px diameter), drawn with `border: 1px solid rgba(255,255,255,0.12)`, position absolute, centered vertically at 50% of the hero.
- Left circle: partly clipped at the left edge of viewport (center at x ≈ -20px).
- Right circle: partly clipped at the right edge of viewport (center at x ≈ calc(100vw + 20px)).
- These circles are purely decorative and do NOT move.

### 2.4 — Prev / Next Arrow Buttons
- Positioned inside the ghost circles, centered within them.
- Left arrow: `←` (a simple thin horizontal arrow, Unicode `←` or SVG line), white, ~22px.
- Right arrow: `→`, same style.
- Both use Space Mono font. No background, no border on the button itself.
- On hover: arrows brighten to full white opacity (they are ~50% opacity at rest).

### 2.5 — Bottom-Left Info Block
- Position: `absolute, bottom: 44px, left: 48px`.
- Line 1: `HIGH QUALITE` — Space Mono, uppercase, ~10px, letter-spacing 0.22em, white at **40% opacity**.
- Line 2: Slide-specific subtitle (see slide data below) — Space Mono, ~11px, letter-spacing 0.15em, white at **65% opacity**.
- Both lines change per slide with a **fade+slide-up** entrance animation (each letter or word fades in with staggered delay).

### 2.6 — Bottom-Right "VOIR PLUS"
- Position: `absolute, bottom: 44px, right: 48px`.
- Text: `VOIR PLUS` — Space Mono, uppercase, ~12px, letter-spacing 0.22em, **white, full opacity**, bold feel.
- Has a thin `border-bottom: 1px solid rgba(255,255,255,0.4)` underline.
- On slide 2 (Superfly/pink), the text is slightly larger (~13px) and more prominent.
- Cursor: pointer.

### 2.7 — Bottom Sound/Mute Button
- Small icon at `bottom-right corner` of the hero, position `absolute, bottom: 16px, right: 16px`.
- Two vertical bars (like a pause icon or audio wave), white, ~18px, opacity 60%.

---

## 3. SLIDE DATA — 3 SLIDES TOTAL

### SLIDE 1 — RUNNING
| Property | Value |
|---|---|
| Title | **RUNNING** |
| Background | Radial gradient: dark teal-navy at edges → vivid cyan-teal `#1a8a8e` at center-right. Exact hex progression: `#0b2a2e` → `#0f5060` → `#1a9090` → `#30b0aa`. The bottom-left corner fades to near-black `#060e0f`. |
| Subtitle line 1 | `HIGH QUALITE` |
| Subtitle line 2 | `FIRST DROP IN ALGERIA dz🔥 ! THE NEXT 3% IS HERE` |
| Shoe image | Nike Vaporfly / ZoomX style running shoe, neon yellow-green (`#c8ff00`) colorway with dark navy swoosh and orange-red midsole cushion pod. Transparent PNG. |
| Shoe position | Horizontally centered, vertically spanning from near the top of the viewport down through the hero title, oversized — the shoe is roughly 65–70% of the viewport height. It sits slightly right of center (about 55% from left). |
| Shoe angle | Tilted approximately **25–30° clockwise** — the toe points to upper-right, heel to lower-left. |
| Text position | The word `RUNNING` is centered horizontally at roughly **50–55% from the top** of the hero. The shoe image overlaps the text both in front and behind — specifically, letters `NN` and `I` appear to go BEHIND the shoe (z-index layering). |

### SLIDE 2 — SUPERFLY
| Property | Value |
|---|---|
| Title | **SUPERFLY** |
| Background | Solid radial gradient pink-red: bright hot pink `#ee1166` at top-center → deep crimson `#aa0044` at bottom → soft blush `#f08090` at very bottom. The entire background is saturated pink/magenta — no teal or dark. |
| Subtitle line 1 | `HIGH QUALITE` |
| Subtitle line 2 | `SUPERFLY NEXXXXXXXXXXXT GÉNÉRATION` |
| Shoe image | Nike Mercurial Superfly football/soccer cleat. Hot pink (`#ff1166`) body with black Swoosh, white upper fade at the heel, metallic silver studs at sole, small yellow-green accent near sole. |
| Shoe position | Centered horizontally, large, spanning from near the top of the viewport. Tilted approximately **15–20° clockwise** — the toe to upper-right, heel lower-left. |
| Text position | `SUPERFLY` is centered, at approx **50–58% from top**. The shoe overlaps the text similarly. |

### SLIDE 3 — SNEAKERS
| Property | Value |
|---|---|
| Title | **SNEAKERS** |
| Background | Dark navy-black with a strong **blue textile/denim texture** overlay. Base color: `#040c1a`. The texture is visible as a woven/canvas pattern in blue — it creates a denim/canvas impression. This is NOT a noise grain; it is a **repeating coarse woven pattern**. |
| Subtitle line 1 | `HIGH QUALITE` |
| Subtitle line 2 | `DZ THE ONE AND ONLY IN ALGERIA DZ` (the second line uses italic style for the italic portion shown) |
| Shoe image | ASICS Gel-Kayano / retro runner style. White and silver-grey colorway with black paneling, chunky sole, loose laces hanging down. The shoe is photographed from a **slightly above-angle**, looking down at it. |
| Shoe position | **Right-aligned** — the shoe sits at the right half of the viewport, roughly 55–100% from left. It is angled differently from slides 1 & 2: nose pointing to upper-left, heel to lower-right. The laces hang loosely down. |
| Title position | `SNEAKERS` is left-aligned — it starts from the **left edge of the viewport** (x ≈ 0, or even slightly negative clipping). It is vertically centered in the hero. |

---

## 4. TYPOGRAPHY — THE HERO TITLE (CRITICAL)

This is the most distinctive design detail. Study carefully:

### 4.1 — Letter Rendering
The giant title text (`RUNNING`, `SUPERFLY`, `SNEAKERS`) is rendered in **Barlow Condensed 900** at approximately `clamp(80px, 11vw, 130px)`. Letter-spacing: `0.10em` to `0.14em`. ALL CAPS always.

### 4.2 — The Mixed Solid/Outline Letter Effect
This is key and must be exact:

**SLIDE 1 — "RUNNING":**
- `R` → **solid white fill**
- `U` → **solid white fill**
- `N` (first) → **outline only** (transparent fill, `white 2.5px stroke`)
- `N` (second) → **outline only**
- `I` → **outline only**
- `N` (third) → **solid white fill**
- `G` → **solid white fill**

So the pattern is: SOLID, SOLID, OUTLINE, OUTLINE, OUTLINE, SOLID, SOLID. The outline letters appear "hollow" with only the stroke visible.

**SLIDE 2 — "SUPERFLY":**
- `S` → solid white
- `U` → solid white
- `P` → solid white
- `E` → solid white
- `R` → solid white
- `F` → **outline only**
- `L` → **outline only**
- `Y` → **outline only**

Pattern: 5 solid, then 3 outline at the end.

**SLIDE 3 — "SNEAKERS":**
- `S` → **outline only**
- `N` → solid white (OR this entire word might be all solid — the SNEAKERS slide appears to be mostly solid white with only the S being slightly different). Look at image 6: the word appears fully solid white — this slide may be all solid.

### 4.3 — Z-index Layering with the Shoe
The hero title sits at the **same z-index level as the shoe image, split**:
- A "back text layer" (z-index below the shoe) renders certain letters
- A "front text layer" (z-index above the shoe) renders others

On slide 1 (RUNNING), the middle letters `NNI` appear to be BEHIND the shoe body. `R`, `U` appear in front/around the toe area; `NG` at the end is fully in front.

Implementation approach: render the title **twice** — once behind the shoe (`z-index: 1`) and once in front (`z-index: 3`). The shoe is at `z-index: 2`. Use `clip-path` or simply show/hide specific letter spans based on their overlap with the shoe position.

---

## 5. SHOE IMAGE — MOUSE PARALLAX BEHAVIOR

### 5.1 — Idle Float Animation
When no mouse interaction: the shoe floats up and down continuously.
- `transform: translateY(0px)` → `translateY(-18px)` → back, using a smooth `ease-in-out` sine wave.
- Duration: **4 seconds**, infinite loop.
- Also a very slight rotation oscillation: ±2° on the Z axis, synced to the float.

### 5.2 — Mouse Move Parallax (3D Tilt)
On `mousemove` over the hero:
- Calculate normalized mouse position: `normX = (mouseX / heroWidth) - 0.5` (range -0.5 to +0.5)
- Calculate normalized mouse Y: `normY = (mouseY / heroHeight) - 0.5`
- Apply to shoe element:
  ```
  transform: perspective(900px)
             rotateY(normX * 18deg)
             rotateX(normY * -12deg)
             translateZ(30px)
             scale(1.04)
  ```
- Use GSAP `gsap.quickTo(shoe, "rotateY", { duration: 0.6, ease: "power2.out" })` for smooth lerping — do NOT use CSS transition alone, as it feels sluggish.
- The shoe element should have `transform-style: preserve-3d` and `will-change: transform`.

### 5.3 — Mouse Leave
On `mouseleave`, GSAP animates all rotation values back to 0 over 1.2s with `elastic.out(1, 0.5)` ease.

---

## 6. SLIDE TRANSITION — THE GLITCH EFFECT (CRITICAL)

This is the most important interaction to get right. When the user clicks Prev or Next:

### Phase 1 — Glitch Burst (0ms → ~400ms)
A GSAP timeline fires immediately:

**Step A: Full-screen noise overlay appears**
- A `<canvas>` element or a CSS layer covers the entire hero at `z-index: 50`.
- It is filled with **animated TV static / white noise** — random pixel values in grayscale, rapidly re-drawn at ~30fps using `requestAnimationFrame` or a short JS interval.
- This noise layer has a **strong teal/cyan color tint** on slides from the teal background, and takes on the **background color tint** of the current slide.
- Opacity: flashes from 0 → 0.85 → 0 → 0.7 → 0 in rapid sequence over ~300ms.

**Step B: RGB chromatic aberration**
- The shoe image gets a CSS `filter` applied: `hue-rotate(180deg)` briefly, then rapid color channels split — simulate this with a `mix-blend-mode: screen` duplicate of the shoe shifted ±6px on X axis in red and blue.
- Duration: 2–3 rapid keyframe flickers at 30ms intervals.

**Step C: Horizontal scan-line tearing**
- Multiple thin `<div>` strips (each ~8–20px height) are created, positioned at random Y values across the hero.
- Each strip is a `overflow: hidden` window showing the current slide content, offset horizontally by ±30–80px via `translateX`.
- These strips appear and disappear in rapid succession (each visible for 30–60ms).
- This creates the "torn/sliced" look visible in images 2, 3, and 5.

**Step D: Content scramble**
- The big title text briefly shifts: random `translateX` of ±10–20px, `skewX(3deg)` for one frame.
- The bottom labels fade out.

### Phase 2 — Slide Swap (at ~350ms into the glitch)
- The current slide's content is swapped for the new slide in the DOM/state.
- The new background color transitions: a full `background` color cross-fade begins.

### Phase 3 — Entry Animation (350ms → 800ms)
- Noise overlay fades to 0.
- New shoe image enters: starts at `scale(0.85) translateY(40px) opacity(0)`, animates to `scale(1) translateY(0) opacity(1)` with GSAP `power3.out` over 500ms.
- New title text: each letter enters with a **stagger** of 30ms — `translateY(60px) opacity(0)` → `translateY(0) opacity(1)`, `power4.out`, 400ms duration.
- Background color: transitions from old slide color to new slide color over 600ms with a smooth ease.
- Bottom labels: `translateY(20px) opacity(0)` → `translateY(0) opacity(1)`, delayed by 200ms after the title starts.

---

## 7. NOISE / GRAIN TEXTURE (ALWAYS PRESENT)

This is permanently visible on every slide and is NOT just shown during the glitch:

### 7.1 — Base Grain (always on)
- A `<canvas>` element at `position: absolute, inset: 0, z-index: 4, pointer-events: none`.
- Every `requestAnimationFrame`, draw random grayscale pixels across the canvas.
- Opacity: **0.06 to 0.09** (very subtle — barely perceptible but contributes heavily to the "film grain" feel).
- Each pixel cell: 1×1px to 2×2px.
- `mix-blend-mode: overlay` on this canvas.

### 7.2 — Glitch-State Grain (during transitions only)
- The same canvas or a second canvas increases opacity to **0.7–0.85** during the glitch burst.
- The pixel cells may be slightly larger (2×3px) for a coarser look.
- Tinted with the slide's accent color: use `globalCompositeOperation = 'source-over'` with a transparent color fill after each noise frame.

### 7.3 — Slide 3 Special: Denim/Weave Texture
- The SNEAKERS slide has a DIFFERENT background texture — it looks like coarse woven canvas or denim fabric.
- This is a **repeating CSS background-image** using an SVG or base64 pattern of crossed diagonal lines at ~45°, cell size ~4–6px.
- Color: dark navy blue `#0a1428` for the "threads" on `#040c1a` background.
- Opacity: 0.5 — this texture is much more visible than the grain on the other slides.

---

## 8. TEXT ENTRY ANIMATIONS (LETTER BY LETTER)

### 8.1 — On Initial Page Load
- The first slide's title letters enter one by one from **below**, each letter starting at `translateY(80px) opacity(0)`.
- GSAP `staggerFrom` with `stagger: 0.04s`, `duration: 0.5s`, `ease: power4.out`.
- All letters move up into their final position.

### 8.2 — On Each Slide Change (after glitch)
Same stagger animation fires for the new slide title:
- `y: 80 → 0`, `opacity: 0 → 1`, stagger 0.035s, duration 0.45s, ease `power4.out`.

### 8.3 — Bottom Label Animation
- "HIGH QUALITE" and the subtitle: use a character-split approach OR treat each word as a unit.
- Each word/label: `translateY(12px) opacity(0)` → `translateY(0) opacity(1)`, stagger 80ms between the two lines, duration 0.4s, `power2.out`, delayed 250ms after shoe entry starts.

### 8.4 — "VOIR PLUS" animation
- Fades in with letter-spacing expanding: from `letter-spacing: 0` → `letter-spacing: 0.22em`, opacity 0 → 1, duration 0.6s, ease `power2.out`.

---

## 9. CUSTOM CURSOR

- Hide the default OS cursor within the hero bounds.
- Show a custom cursor: a small **white circle**, 10px diameter, solid fill, no border.
- The circle follows the mouse with a slight lag (lerp, ~0.15 factor per frame) — it trails slightly behind the actual cursor position.
- `mix-blend-mode: difference` — so it appears black on white elements and white on dark.
- No glow, no trail.

---

## 10. EXACT COLOR SPECIFICATIONS PER SLIDE

### Slide 1 — RUNNING (Teal/Cyan)
```
background: radial-gradient(ellipse at 65% 40%, #1a9090 0%, #0f5060 40%, #0b2a2e 70%, #060e0f 100%)
Navbar text: white
Title: white (solid letters) + white stroke (outline letters)
Bottom labels: rgba(255,255,255,0.40) and rgba(255,255,255,0.65)
VOIR PLUS: rgba(255,255,255,1.0)
Nav arrows: rgba(255,255,255,0.5) at rest
```

### Slide 2 — SUPERFLY (Pink/Magenta)
```
background: radial-gradient(ellipse at 55% 30%, #f03070 0%, #cc1155 40%, #880033 80%, #550022 100%)
The bottom of the background fades to a lighter blush: add a second gradient that pulls to #f090a0 at the very bottom-center.
Title: white (all letters in the solid/outline split described above)
Bottom labels: rgba(255,255,255,0.40) and rgba(255,255,255,0.60)
VOIR PLUS: white
```

### Slide 3 — SNEAKERS (Dark Navy / Denim)
```
background: #040c1a (flat, very dark navy)
Denim texture overlay: see section 7.3
Title: white (solid, starts from left edge)
Bottom labels: rgba(255,255,255,0.40) and rgba(255,255,255,0.60) with italic on subtitle
VOIR PLUS: partially clipped at right edge or slightly offset
```

---

## 11. NAVBAR ACTIVE STATE PER SLIDE

| Slide | Active nav link |
|---|---|
| Slide 1 (RUNNING) | `ACCUEIL` is underlined |
| Slide 2 (SUPERFLY) | `BOUTIQUE` is underlined |
| Slide 3 (SNEAKERS) | `ACCUEIL` is underlined |

The underline is a `border-bottom: 1px solid white`, not a decorative bar — it sits directly under the text.

---

## 12. LAYOUT MEASUREMENTS (Pixel-Level)

All values are approximate based on a 1440px wide / 780px tall viewport reference:

| Element | Value |
|---|---|
| Navbar height | ~60px |
| Logo size | ~32px font-size |
| Center nav font | 13px, letter-spacing 0.14em |
| Shoe image width | ~55–60% of viewport width |
| Shoe vertical center | ~38% from top (the shoe extends from ~5% to ~80% of vh) |
| Title font-size | ~110–120px at 1440px wide |
| Title vertical position | ~50–58% from top (overlaps shoe center) |
| Bottom labels bottom offset | 44px from bottom |
| Bottom labels left offset | 48px from left |
| VOIR PLUS right offset | 48px from right |
| Ghost circle diameter | 120px |
| Ghost circle border | 1px solid rgba(255,255,255,0.12) |
| Nav arrow font-size | 14px |

---

## 13. RESPONSIVENESS (MINIMUM REQUIREMENT)

- At 768px (tablet), the shoe scales down, title font-size reduces to ~70px.
- At 480px (mobile), shoe is positioned differently (centered, smaller), title at ~48px.
- The noise grain, glitch, and parallax all continue working at all breakpoints.
- The glitch transition may be slightly less intense on mobile to preserve performance.

---

## 14. PERFORMANCE NOTES

- The noise canvas must use `willReadFrequently: true` on the canvas context.
- The shoe parallax uses GSAP `quickTo` for performance — NOT `gsap.to()` on every mousemove.
- `will-change: transform` on the shoe element.
- `requestAnimationFrame` for the noise canvas loop, cancelled when the hero is not visible.
- No heavy `box-shadow` or `filter: blur()` on animated elements.

---

## 15. FILE STRUCTURE (if generating a multi-file project)

```
/
├── index.html
├── styles/
│   ├── hero.css        (hero section styles)
│   └── navbar.css      (navbar styles)
├── scripts/
│   ├── hero.js         (slide logic, GSAP timelines, noise canvas)
│   ├── parallax.js     (mouse tracking + quickTo)
│   └── glitch.js       (glitch effect system)
├── assets/
│   ├── shoes/
│   │   ├── slide1-running.png      (Nike Vaporfly, neon yellow, transparent bg)
│   │   ├── slide2-superfly.png     (Nike Mercurial Superfly, pink, transparent bg)
│   │   └── slide3-sneakers.png     (ASICS retro runner, white/grey, transparent bg)
│   └── logo/
│       └── airzone-logo.png        (or SVG — graffiti white logo)
```

If outputting a **single HTML file**, inline all CSS in `<style>` and all JS in `<script>` at the bottom of `<body>`. Load GSAP and Google Fonts via CDN links in `<head>`.

---

## 16. CDN LINKS (use these exact versions)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Space+Mono:wght@400;700&family=Permanent+Marker&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/CustomEase.min.js"></script>
```

---

## 17. WHAT TO USE AS PLACEHOLDER SHOES

Since real product PNGs may not be available, generate the shoe images using inline SVG or use these royalty-free placeholder approaches:

- Use a `<div>` with a colored silhouette shape + inline SVG path approximating a shoe profile
- OR reference a placeholder service that returns transparent PNG shoes
- The important thing is that the **position, scale, tilt angle, and z-index layering with the text** are correct — the actual shoe image content can be swapped in later

---

## SUMMARY OF WHAT MUST WORK

1. ✅ 3 slides: RUNNING (teal), SUPERFLY (pink), SNEAKERS (dark navy denim)
2. ✅ Navbar: transparent, logo + nav links + login/cart, correct active states
3. ✅ Giant title: Barlow Condensed 900, mixed solid/outline letters per slide
4. ✅ Title z-index: split rendering so shoe overlaps certain letters front/back
5. ✅ Shoe: oversized, angled, floating idle animation
6. ✅ Mouse parallax: smooth GSAP `quickTo` rotateX/Y tilt on hover
7. ✅ Glitch transition: noise canvas burst + scan-line tears + color tint + RGB split
8. ✅ Text stagger entry: GSAP letter-by-letter from below on each slide change
9. ✅ Background color cross-fade between slides
10. ✅ Noise grain: always-on subtle film grain via canvas with `mix-blend-mode: overlay`
11. ✅ Denim texture: special woven pattern on slide 3
12. ✅ Ghost nav circles: decorative, clipped at viewport edges
13. ✅ Bottom labels: HIGH QUALITE + slide subtitle + VOIR PLUS, correct fonts/opacity
14. ✅ Custom cursor: white circle with blend mode + trailing lag
15. ✅ Auto-play: slides advance every 5–6s automatically, pauses on hover

---

*End of prompt. All measurements, colors, animations, and behaviors documented above are derived from direct visual analysis of the reference screenshots. Implement everything listed — do not skip any section.*
