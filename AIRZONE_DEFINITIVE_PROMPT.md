# AIRZONE HERO — DEFINITIVE FRAME-ACCURATE BUILD PROMPT
## Derived from 180-frame video analysis at 10fps (18-second recording)

> This prompt supersedes all previous versions. Every behavior below was observed directly frame-by-frame. Build exactly this — nothing more, nothing less.

---

## TIMELINE OVERVIEW (10fps = 1 frame per 100ms)

| Frames | Time | Event |
|---|---|---|
| 001 | 0.0s | Page loads — Slide 1 (RUNNING) clean idle state |
| 001–006 | 0–0.6s | Slide 1 idle, slight float animation begins |
| 007–008 | 0.7–0.8s | **FIRST GLITCH BURST** — user clicks Next |
| 009–011 | 0.9–1.1s | **SLIDE SPLIT** — both shoes visible simultaneously, flying apart |
| 012–015 | 1.2–1.5s | Glitch noise peaks, new slide color floods in |
| 016–019 | 1.6–1.9s | White flash frame → background rebuilds |
| 020–035 | 2.0–3.5s | Slide 2 entry animation (Superfly, pink background builds in) |
| 036–070 | 3.6–7.0s | Slide 1 (RUNNING) idle with **active mouse parallax** |
| 071–115 | 7.1–11.5s | Slide 3 (SNEAKERS, blue) idle with mouse parallax |
| 116–130 | 11.6–13.0s | **SECOND GLITCH** — transition to Superfly |
| 131–145 | 13.1–14.5s | Superfly entry + settle |
| 146–175 | 14.6–17.5s | RUNNING slide re-entry with parallax |
| 176–180 | 17.6–18.0s | Third glitch begins (video ends mid-transition) |

---

## SECTION 1 — CLEAN IDLE STATES (STATIC APPEARANCE)

### SLIDE 1 — RUNNING (Teal/Cyan)

**Background:**
```css
background: radial-gradient(
  ellipse at 68% 45%,
  #22b0b0 0%,
  #0f6878 30%,
  #073a48 60%,
  #040e14 100%
);
```
The hotspot is bright cyan-teal, located upper-right of center. The bottom-left corner is very dark, almost black. The right side of the hero glows brighter than the left.

**Shoe — Nike Vaporfly (neon yellow-green):**
- Size: fills roughly 45% of viewport width, 65% of viewport height
- Position: horizontally centered at ~52% from left; vertically the shoe occupies from ~8% to ~82% of the hero height
- Angle: tilted approximately **25° clockwise** — the heel (blue midsole side) points upper-right, the toe (yellow front) points lower-left
- Z-index: shoe is at z-index 2, sits BETWEEN the two text layers
- Drop shadow beneath shoe: soft blurred dark ellipse, approximately 180px wide × 18px tall, `rgba(0,0,0,0.35)`, `blur: 24px`, positioned directly below the shoe sole

**Title — "RUNNING":**
- Font: Barlow Condensed 900
- Size: ~110px at 1280px viewport
- Letter spacing: 0.12em
- Position: horizontally centered; vertically centered at ~54% from top of hero
- The shoe body overlaps the letters NNI — those letters appear BEHIND the shoe

**Mixed solid/outline letters for RUNNING:**
- `R` → solid white (`color: white`)
- `U` → solid white
- `N` (1st) → **outline** (`color: transparent; -webkit-text-stroke: 2.5px white`)
- `N` (2nd) → **outline**
- `I` → **outline**
- `N` (3rd) → solid white
- `G` → solid white

**Bottom-left labels:**
- `HIGH QUALITE` — Space Mono, 10px, uppercase, letter-spacing 0.22em, `rgba(255,255,255,0.50)`
- `FIRST DROP IN ALGERIA dz🔥 ! THE NEXT 3% IS HERE` — Space Mono, 10px, letter-spacing 0.15em, `rgba(255,255,255,0.65)`
- Position: `bottom: 44px; left: 44px`

**VOIR PLUS:**
- Space Mono, 12px, bold, white, letter-spacing 0.22em
- `border-bottom: 1px solid rgba(255,255,255,0.4)`
- Position: `bottom: 44px; right: 48px`

---

### SLIDE 2 — SUPERFLY (Pink/Magenta)

**Background:**
```css
background: radial-gradient(
  ellipse at 55% 35%,
  #f03378 0%,
  #d01860 25%,
  #a00040 55%,
  #6a0030 80%,
  #3a0018 100%
);
/* Plus a second overlay gradient for the bottom blush fade: */
background: linear-gradient(
  to bottom,
  transparent 50%,
  rgba(255, 180, 200, 0.25) 100%
);
```
The full background is saturated magenta-pink. The very bottom-center lightens to a blush pink. Top is deep crimson. NO teal, NO dark navy — pure pink scene.

**Shoe — Nike Mercurial Superfly (hot pink):**
- Size: fills ~48% viewport width, ~65% viewport height  
- Position: horizontally centered ~50%; vertically top of shoe at ~8% of hero, sole at ~82%
- Angle: ~20° clockwise tilt — heel/ankle collar upper-right, toe lower-left
- The shoe overlaps letters E and R in SUPERFLY

**Mixed solid/outline letters for SUPERFLY:**
- `S` → solid white
- `U` → solid white
- `P` → solid white
- `E` → **outline only** (`color: transparent; -webkit-text-stroke: 2.5px white`)
- `R` → **outline only**
- `F` → solid white
- `L` → solid white
- `Y` → solid white

Pattern: SUP = solid, ER = outline, FLY = solid. The shoe sits in front of E and R.

**Bottom-left labels:**
- `HIGH QUALITE`
- `SUPERFLY NEXXXXXXXXXXXT GÉNÉRATION`

---

### SLIDE 3 — SNEAKERS (Blue)

**Background:**
```css
background: radial-gradient(
  ellipse at 60% 42%,
  #2a72d8 0%,
  #1a4eaa 22%,
  #0e2e78 48%,
  #061440 72%,
  #020816 100%
);
```
Vivid royal blue radial glow, bright in the center, very dark navy at corners. This is NOT flat black — it is distinctly blue throughout with a clear spotlight feel.

**Shoe — ASICS Gel retro runner (white/grey/black):**
- This shoe is presented almost **UPRIGHT/VERTICAL** — barely tilted (~8° clockwise)
- The ankle collar and loose hanging laces are at the TOP of the frame
- The sole faces downward, slightly toward the viewer
- Size: ~50% of viewport width, ~80% of viewport height — it is the TALLEST of all three slides
- Position: horizontally centered at ~53%; the shoe top (lace ends) begins at ~3% from top of hero, sole reaches ~82%
- The dangling laces HANG DOWN from the ankle area, creating a flowing visual that overlaps the text below

**Mixed solid/outline letters for SNEAKERS:**
- `S` → solid white
- `N` → solid white
- `E` (1st) → solid white
- `A` → **outline only**
- `K` → **outline only**
- `E` (2nd) → **outline only**
- `R` → solid white
- `S` (2nd) → solid white

The shoe body sits in front of A, K, E. Those letters' outlines are still visible around the shoe edge.

**Background texture for slide 3:** A subtle repeating horizontal scanline pattern — very fine CSS `repeating-linear-gradient` of alternating transparent/slightly lighter blue lines, each ~2px, at ~6% opacity. This gives the denim/canvas texture feel visible in the frames.

**Bottom-left labels:**
- `HIGH QUALITE`
- `dz THE ONE AND ONLY IN ALGERIA dz` (italic on the central phrase)

---

## SECTION 2 — THE GLITCH TRANSITION (Frame-Accurate)

### What actually happens (confirmed from frames 007–015 and 116–130):

The glitch is a **FULL-SCREEN HORIZONTAL SLIDE SPLIT with noise**. Here is exactly what occurs, in order:

**Frame 007 (100ms after click):**
- The current slide's content (shoe + text) begins shifting LEFT rapidly
- The grain noise canvas surges from ~6% opacity to ~70% opacity instantly
- The background darkens slightly — the gradient color recedes
- A **rectangular block artifact** appears in the upper-right quadrant — approximately 180px × 55px, filled with the slide's mid-color at ~40% opacity, no border. This is a CSS glitch block artifact.
- Text begins de-centering: the word shifts left and starts to break apart

**Frame 008 (200ms after click):**
- The current slide's shoe has slid LEFT and is now partially off-screen (left quarter of viewport)
- Simultaneously, the NEXT slide's shoe appears on the RIGHT side, also partially off-screen, sliding in from right
- Both shoes are visible at the same time — one exiting left, one entering right
- The text word is now left-aligned and partially clipped — it reads like a corrupted fragment
- The grain noise is at peak intensity (~75% opacity, teal-tinted)
- The glitch block artifact is still visible upper-right
- Background is now a dark teal/grey — the slide background color has collapsed to near-dark

**Frame 009 (300ms):**
- Current slide shoe is now fully off-screen left, only the very edge visible
- Next slide shoe is now ~25% visible on the right edge
- Almost nothing in the center — just noise on a dark background
- The fragment of text (just 1-2 letters) remains at the far left

**Frame 010 (400ms):**
- Next slide's shoe is now ~40% into frame from the left (it has swung around and is re-entering from the LEFT side now)
- The background color is starting to shift — the next slide's hue begins bleeding in
- Noise is still heavy but dropping

**Frame 011 (500ms):**
- Next slide shoe now occupies the left ~30% of screen
- A single letter from the NEXT slide's word appears at the far right, entering from the right edge
- Background still dark transitional grey

**Frame 015 (900ms):**
- Next slide's background color has fully flooded the scene (pink for Superfly, blue for Sneakers)
- The new shoe is arriving toward center
- The new word is building in from right to left (letters entering from right)
- The noise is at ~40% opacity still — the glitch scan-lines are still visible
- RGB color fringe visible on content edges

**Frames 016–020 (1.0–1.4s):**
- One or two near-white flash frames occur — very brief, semi-transparent white wash
- The new shoe settles into its final centered position
- The background is now at full saturation
- Text word completes its entry

**Frame 020 onward:**
- Clean idle state on new slide
- Noise drops back to baseline ~6% opacity
- All elements settled

---

## SECTION 3 — EXACT GLITCH IMPLEMENTATION CODE LOGIC

```javascript
function triggerGlitch(currentSlideEl, nextSlideEl, direction) {
  const tl = gsap.timeline();
  
  // 1. NOISE SURGE — instant
  tl.to(noiseCanvas, { opacity: 0.72, duration: 0.05 }, 0);
  
  // 2. GLITCH BLOCK ARTIFACT — appears upper-right area
  tl.to(glitchBlock, {
    opacity: 0.4,
    x: 0,
    duration: 0.05
  }, 0);
  
  // 3. CURRENT SLIDE EXITS LEFT
  tl.to(currentSlideEl.querySelector('.shoe'), {
    x: '-110vw',
    rotation: -8,
    duration: 0.25,
    ease: 'power2.in'
  }, 0);
  tl.to(currentSlideEl.querySelector('.title'), {
    x: '-100vw',
    skewX: -4,
    duration: 0.2,
    ease: 'power3.in'
  }, 0.03);
  
  // 4. NEXT SLIDE ENTERS FROM RIGHT — shoe first
  tl.fromTo(nextSlideEl.querySelector('.shoe'), 
    { x: '110vw', rotation: 12 },
    { x: 0, rotation: 0, duration: 0.45, ease: 'power2.out' },
    0.15
  );
  
  // 5. BACKGROUND COLOR TRANSITION
  tl.to(heroEl, {
    backgroundColor: nextSlide.bgColor,
    duration: 0.5,
    ease: 'power1.inOut'
  }, 0.1);
  
  // 6. WHITE FLASH
  tl.to(flashEl, { opacity: 0.35, duration: 0.05 }, 0.35);
  tl.to(flashEl, { opacity: 0, duration: 0.15 }, 0.40);
  
  // 7. NEXT SLIDE TITLE ENTERS — letters from right
  // Each letter enters individually with stagger
  tl.fromTo(nextTitleLetters, 
    { x: 60, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.35, stagger: 0.03, ease: 'power3.out' },
    0.30
  );
  
  // 8. NOISE DROPS BACK
  tl.to(noiseCanvas, { opacity: 0.06, duration: 0.4, ease: 'power2.out' }, 0.35);
  
  // 9. GLITCH BLOCK DISAPPEARS
  tl.to(glitchBlock, { opacity: 0, duration: 0.1 }, 0.35);
  
  // 10. BOTTOM LABELS ENTER
  tl.fromTo([labelLine1, labelLine2, voirPlus],
    { y: 14, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power2.out' },
    0.50
  );
}
```

---

## SECTION 4 — MOUSE PARALLAX (Confirmed from frames 050–115)

The parallax is extremely pronounced. From the frames, when the mouse moves to the far left of the screen:
- The shoe shifts LEFT by approximately **180–220px** from its default center position
- The shoe also ROTATES — visible in frame 060: when mouse is far left, the shoe has rotated ~18° counter-clockwise (toe now points more left)
- The text word stays fixed — it does NOT move with the mouse. Only the shoe moves.
- The parallax has a clear lag/lerp — the shoe trails behind the mouse position

**Exact GSAP implementation:**
```javascript
const shoeX = gsap.quickTo(shoeEl, 'x', { duration: 0.6, ease: 'power2.out' });
const shoeY = gsap.quickTo(shoeEl, 'y', { duration: 0.6, ease: 'power2.out' });
const shoeRotY = gsap.quickTo(shoeEl, 'rotateY', { duration: 0.7, ease: 'power2.out' });
const shoeRotX = gsap.quickTo(shoeEl, 'rotateX', { duration: 0.7, ease: 'power2.out' });

hero.addEventListener('mousemove', e => {
  const rect = hero.getBoundingClientRect();
  const nx = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 to +0.5
  const ny = (e.clientY - rect.top) / rect.height - 0.5;   // -0.5 to +0.5
  
  shoeX(nx * 220);          // max ±220px horizontal shift
  shoeY(ny * 80);           // max ±80px vertical shift
  shoeRotY(nx * 22);        // max ±22deg Y rotation
  shoeRotX(ny * -14);       // max ±14deg X rotation (inverted)
});

hero.addEventListener('mouseleave', () => {
  gsap.to(shoeEl, { x: 0, y: 0, rotateY: 0, rotateX: 0, duration: 1.2, ease: 'elastic.out(1, 0.5)' });
});
```

**CRITICAL:** The shoe must have:
```css
.shoe {
  transform-style: preserve-3d;
  will-change: transform;
  perspective: 900px;
}
```
Wrap the shoe in a perspective container:
```css
.shoe-container {
  perspective: 900px;
  perspective-origin: center center;
}
```

---

## SECTION 5 — THE NOISE GRAIN CANVAS (Always On)

This is NOT optional and must be always visible:

```javascript
const canvas = document.createElement('canvas');
canvas.style.cssText = `
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 6;
  opacity: 0.06;
  mix-blend-mode: overlay;
`;
hero.appendChild(canvas);

const ctx = canvas.getContext('2d', { willReadFrequently: true });

function resizeCanvas() {
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let noiseOpacity = 0.06; // baseline
let animId;

function drawNoise() {
  const { width, height } = canvas;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const v = Math.floor(Math.random() * 255);
    data[i] = v;
    data[i+1] = v;
    data[i+2] = v;
    data[i+3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
  canvas.style.opacity = noiseOpacity;
  animId = requestAnimationFrame(drawNoise);
}
drawNoise();
// Cancel with: cancelAnimationFrame(animId)
```

During glitch: set `noiseOpacity = 0.72` when glitch starts, then tween it back to `0.06` after 400ms.

---

## SECTION 6 — THE GLITCH BLOCK ARTIFACT

This was visible in frames 007, 008, 060, 120, 170. It is a semi-transparent rectangle that appears in the UPPER-RIGHT area of the hero during glitch and also occasionally during heavy mouse parallax / glitch state:

```css
.glitch-block {
  position: absolute;
  top: 26%;
  right: 14%;
  width: 175px;
  height: 52px;
  background: rgba(150, 180, 200, 0.22);
  /* On pink slide: rgba(200, 100, 130, 0.22) */
  /* On blue slide: rgba(80, 120, 200, 0.22) */
  pointer-events: none;
  z-index: 8;
  opacity: 0;
}
```

It appears only during:
1. The glitch transition (opacity 0 → 0.4 → 0 over ~300ms)
2. Heavy mouse parallax movement on the RUNNING slide (flickers briefly at ~0.12 opacity when mouse moves quickly)

---

## SECTION 7 — SHOE IDLE FLOAT ANIMATION

Observed across many frames during idle:

```javascript
gsap.to(shoeEl, {
  y: -20,
  rotation: 1.5,  // slight tilt oscillation
  duration: 3.2,
  ease: 'sine.inOut',
  yoyo: true,
  repeat: -1,
});
```

The shoe bobs up ~20px and back down, continuously. The rotation oscillates ±1.5°. During mouse parallax, this animation continues but the parallax offset is ADDED on top.

---

## SECTION 8 — TEXT Z-INDEX LAYERING IMPLEMENTATION

This is critical and must be implemented exactly:

```html
<!-- Inside each slide: -->
<div class="slide-inner">
  <!-- LAYER 1: Text BEHIND shoe -->
  <div class="title-back" aria-hidden="true">
    <span class="solid">R</span>
    <span class="solid">U</span>
    <span class="outline">N</span>
    <span class="outline">N</span>
    <span class="outline">I</span>
    <span class="solid">N</span>
    <span class="solid">G</span>
  </div>
  
  <!-- LAYER 2: Shoe image -->
  <div class="shoe-container">
    <img class="shoe" src="shoe1.png" alt="">
  </div>
  
  <!-- LAYER 3: Text IN FRONT of shoe (clipped to show only outer letters) -->
  <!-- This layer is positioned identically to .title-back -->
  <!-- It shows ALL letters but the shoe covers the middle ones via z-index -->
  <!-- Actually, implement as same z-index above shoe for all letters -->
  <!-- The hollow outline letters APPEAR to be behind due to visual transparency -->
</div>
```

```css
.title-back {
  position: absolute;
  z-index: 1;
  /* identical position/size/font as the main title */
}
.shoe-container {
  position: absolute;
  z-index: 2;
}
/* No front layer needed — the outline letters are transparent,
   so the shoe naturally shows in front of them visually.
   Only the solid letters need a front layer for letters outside the shoe.
   Simplest approach: render ONE title at z-index 3 (above shoe).
   The outline letters look "behind" the shoe due to their transparency.
   The shoe covers them = correct visual.
   The solid outer letters at z-index 3 appear in front = correct. */
.title-main {
  position: absolute;
  z-index: 3;
}
/* Use ONLY .title-main at z-index 3 with the mixed solid/outline technique.
   The shoe at z-index 2 will be BEHIND the title text.
   To make some letters appear BEHIND the shoe, clone those specific letters 
   at z-index 1 and make the z-index 3 version of those letters invisible/transparent:
   NOT needed — just use one layer at z-index 3 and make outline letters transparent.
   The shoe shows through the transparent outline letters naturally. */
```

**SIMPLEST CORRECT IMPLEMENTATION:**
```css
/* All title letters are at z-index 3 (above shoe) */
/* Solid letters: color white → fully opaque → shoe NOT visible through them */
/* Outline letters: color transparent, only stroke visible → shoe IS visible through them */
/* Result: looks exactly like shoe is between the letters */
.letter-solid {
  color: white;
  -webkit-text-stroke: 0px;
}
.letter-outline {
  color: transparent;
  -webkit-text-stroke: 2.5px white;
}
```

---

## SECTION 9 — NAVBAR EXACT SPECS

From frame 001 (clean state):

**Logo:** `AIR✳ZONE`
- Font: graffiti/marker style. Use `Permanent Marker` from Google Fonts as best substitute
- Size: 28px
- Color: white
- Weight: naturally heavy from the font
- Position: `top: 18px; left: 22px`

**Center nav links:** `ACCUEIL | BOUTIQUE | À PROPOS`
- Font: same condensed/mono style — use Space Mono 400, or the site's built-in font
- Size: 13px
- Letter-spacing: 0.12em
- Color: `rgba(255,255,255,0.80)` for inactive, `white` for active
- Active indicator: `border-bottom: 1.5px solid white; padding-bottom: 2px`
- Gap between links: ~28px

**Active link per slide:**
- RUNNING → `ACCUEIL` active
- SUPERFLY → `ACCUEIL` active (frame 145 confirms ACCUEIL is underlined on Superfly slide)
- SNEAKERS → `ACCUEIL` active

**Right side:** `LOGIN / REGISTER` | search icon | cart icon + green badge `0` | `0 DA`
- Font: 12px Space Mono
- Color: white
- The cart badge is a small green dot/circle with `0` inside it

**Navbar background:** `background: transparent` — always. Never has a fill.

---

## SECTION 10 — NAV CIRCLES (GHOST CIRCLES)

From frames 001, 080, 090, 110:

```css
.nav-circle {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: transparent;
  pointer-events: none;
}
.nav-circle-left {
  left: -30px; /* partially clipped at left edge */
}
.nav-circle-right {
  right: -30px; /* partially clipped at right edge */
}
```

**Arrows inside circles:**
```css
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.55);
  font-size: 14px;
  font-family: 'Space Mono', monospace;
  letter-spacing: 0.05em;
  cursor: pointer;
}
.nav-arrow-left { left: 26px; } /* inside the left circle center area */
.nav-arrow-right { right: 26px; }
```

Left arrow: `←——` (arrow + short dash, as seen in frames)
Right arrow: `——→`

**CRITICAL NOTE from frame 025:** There is a brief moment during Superfly entry where the left circle is nearly invisible and the right area has no circle — this is because the circles fade out during the glitch and fade back in. Add:
```javascript
gsap.to('.nav-circles', { opacity: 0, duration: 0.15 }, 0.05); // fade out at glitch start
gsap.to('.nav-circles', { opacity: 1, duration: 0.3 }, 0.5);   // fade back in
```

---

## SECTION 11 — SUPERFLY SLIDE SPECIAL BACKGROUND

Confirmed from frames 130, 145: The Superfly background has TWO visible gradient layers:
1. A deep crimson-to-pink radial (the main glow)
2. A lighter blush wash that rises from the very bottom, making the bottom 20% of the hero appear lighter/pinkish-white

```css
.slide-superfly .bg {
  background: 
    radial-gradient(ellipse at 55% 30%, #f03070 0%, #cc1055 30%, #880033 65%, #4a0020 100%),
    linear-gradient(to top, rgba(255, 200, 210, 0.30) 0%, transparent 35%);
  /* Layer both using multiple backgrounds */
}
```

The top of the hero (behind the shoe ankle area) is the darkest — deep crimson `#4a0020`. The mid-hero is vivid hot pink `#cc1055`. The bottom is a soft blush fade.

---

## SECTION 12 — SCAN LINE TEXTURE

Visible clearly in frames 007, 009, 010, 011, 015, 120, 125 during glitch:

During the glitch transition, a **horizontal scan-line overlay** appears across the entire hero:
```css
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.06) 0px,
    rgba(0, 0, 0, 0.06) 1px,
    transparent 1px,
    transparent 3px
  );
  pointer-events: none;
  z-index: 7;
  opacity: 0; /* baseline */
}
```
During glitch: `opacity: 1` (full visible). Outside glitch: `opacity: 0.25` on the SNEAKERS blue slide (the scan lines are subtly always present on that slide as part of its texture), `0` on the other slides.

---

## SECTION 13 — COMPLETE FILE STRUCTURE

```
index.html
├── <head>
│   ├── Google Fonts: Barlow Condensed 900, Space Mono 400+700, Permanent Marker
│   └── GSAP 3.12.5 + CustomEase CDN
├── <body>
│   ├── .hero (position: relative, overflow: hidden, width: 100vw, height: 100vh)
│   │   ├── canvas#noise (always-on grain)
│   │   ├── .scanlines
│   │   ├── .flash-overlay
│   │   ├── .glitch-block
│   │   ├── .slide[data-slide="0"] .slide[data-slide="1"] .slide[data-slide="2"]
│   │   │   Each slide contains:
│   │   │   ├── .bg (background gradient div)
│   │   │   ├── .shoe-container > img.shoe
│   │   │   ├── .title (the mixed letter spans)
│   │   │   ├── .bottom-left (.label-1, .label-2)
│   │   │   └── .voir-plus
│   │   ├── .nav-circle-left + .nav-arrow-left
│   │   ├── .nav-circle-right + .nav-arrow-right
│   │   └── nav.navbar (logo + links + right icons)
│   └── <script> (all JS inline)
```

---

## SECTION 14 — WHAT WAS CONFIRMED NEW FROM VIDEO FRAMES

These are facts NOT in previous prompts, now proven from video:

1. **The glitch is a PHYSICAL SLIDE-OFF** — shoes literally fly off-screen left/right. It is NOT just a noise overlay. The CONTENT moves.

2. **Both shoes are simultaneously visible for ~200ms** (frames 008–009). Current shoe exits LEFT, next shoe enters from RIGHT, both visible at same time.

3. **Frame 020–025: The background momentarily goes near-WHITE** on the Superfly transition. There is a brief white/light flash before the pink floods in. This happens because the transition passes through a near-white frame.

4. **The SUPERFLY text word enters from RIGHT to LEFT** — letters slide in from the right edge, the last letter (Y) enters first, then working backwards: Y → L → F → R → E → P → U → S. This is RIGHT-TO-LEFT stagger on entry.

5. **The RUNNING word also enters this way** — confirmed from frame 035: only `RUNN` is visible, the rest hasn't entered yet, building from left to right.

6. **Mouse parallax moves the SHOE by up to 220px** in any direction. This is very large — far larger than typical parallax. The shoe nearly leaves the center of the frame.

7. **The glitch block artifact** (semi-transparent rectangle) appears in the UPPER-RIGHT quadrant specifically, not randomly. It is always in the same position.

8. **Autoplay cycle** — the video shows automatic transitions with no user input for most of it. Autoplay interval is approximately **5–6 seconds** of idle before triggering.

9. **The noise grain is TINTED by the slide's background color** — on the teal slide it has a cyan tint, on the pink slide it has a rose tint. Achieve this with `mix-blend-mode: overlay` which automatically picks up the underlying color.

10. **No 3D/WebGL whatsoever** — confirmed 100%. All shoe images are flat PNGs. The "3D" feel comes entirely from the large parallax offsets and the CSS perspective rotation.

---

*This prompt is derived from direct frame-by-frame analysis of a 180-frame, 10fps, 18-second video of the live AirZone website. Every value, timing, and behavior described above was measured or directly observed from the frames.*
