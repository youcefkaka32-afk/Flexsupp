# DESIGN.md — Flex Supps Design System

## Creative North Star: "Dark Athletic Editorial"

Flex Supps is where raw bodybuilding energy meets hyper-modern Swiss minimalism.
Think: the visual weight of a SSENSE product page crossed with the energy of a Supreme drop.
Pure black, hyper-red, typographic violence, cinematic restraint.

---

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| `--black` | `#000000` | Page ground |
| `--bg-dark` | `#0a0a0a` | Slightly elevated surfaces |
| `--bg-deep` | `#080808` | Footer, modals, deepest panels |
| `--white` | `#ffffff` | Primary text, headings |
| `--red` | `#E31B23` | THE brand accent — used sparingly and intentionally |
| `--red-accent` | `#c8151d` | Red hover, active states |
| `--text-dim` | `rgba(255,255,255,0.7)` | Body copy |
| `--text-muted` | `rgba(255,255,255,0.45)` | Captions, meta |
| `--border` | `rgba(255,255,255,0.06)` | Structural dividers |

**Rules:**
- Never use `#000000` pure black as the only dark — always tint slightly warm or use `#080808`
- Red is used for: brand logo accent, active nav underline, CTAs, eyebrow labels, price highlights, badge accents
- NEVER use red as a background for large areas — only accents and single-line elements
- No gradients except: subtle radial glows, noise textures, cinematic vignettes

---

## Typography

| Role | Font | Weight | Style |
|------|------|--------|-------|
| Display / Headlines | Barlow Condensed | 900 | UPPERCASE |
| Body copy | Inter | 400–600 | Sentence case |
| Mono labels / eyebrows | IBM Plex Mono | 500–700 | UPPERCASE |

**Rules:**
- `Barlow Condensed 900 UPPERCASE` for ALL section titles, product names, CTAs, banners
- `Inter` for descriptive body copy only — never for headlines
- `IBM Plex Mono` for metadata: prices, SKUs, filter labels, eyebrow labels
- Letter-spacing: `0.08–0.14em` on display, `0.18–0.24em` on mono eyebrows
- Line height: 0.9–1.0 for massive display text, 1.7–1.9 for body
- Never use italic on display text

---

## Spacing & Rhythm

- Section padding: `100–140px` vertical on desktop, `60–80px` on mobile
- `section-shell`: max-width `1240px`, centered, with `24px` horizontal gutter
- Grid gutters: `24px` standard, `48px` between major content blocks
- Never use symmetric equal-weight columns — prefer asymmetric layouts (60/40, 70/30)

---

## Component Rules

### Buttons
- Primary CTA: `background: #E31B23`, `color: #fff`, `font: Barlow Condensed 900`, `letter-spacing: 0.2em`, NO border-radius
- Ghost button: `border: 1px solid rgba(255,255,255,0.2)`, transparent background
- Hover: shift 1–2px up, darken red for primary, white fill for ghost
- NO rounded corners on CTAs. Sharp edges communicate force.

### Cards / Product Cards
- Never nest a card inside a card
- Product cards: image-first, no box-shadow, 1px subtle border on hover only
- Quick-add button slides up from bottom — not a static overlay
- Price in `Barlow Condensed` with red color
- Brand name in `IBM Plex Mono` small-caps red

### Filters / Pills
- Filter pills: sharp rectangle, `1px border`, hover = red border + red text
- Active: full red background, white text
- Never use rounded pill shapes (border-radius > 0)

### Sections
- Each section needs ONE design idea executed with confidence, not three medium ideas
- Avoid symmetric 3-equal-column grids with icon + title + text — that is the most recognizable AI-generated pattern
- Alternate: full-bleed horizontal panels, typographic slams, asymmetric splits

---

## Motion & Animation

- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` — decelerate in, no bounce
- NEVER use `bounce` or `elastic` easing
- Entrance: translate Y upward (48px → 0), opacity 0 → 1, duration 0.7–1.2s
- Hover: 160–200ms transitions, 1–2px translate up for lift
- Scroll-triggered via GSAP ScrollTrigger or Intersection Observer
- Page transitions: cinematic clip-path diagonal wipe

---

## Anti-Patterns (Never Do These)

These are the 10 most common AI-generated frontend tells — all banned:

1. **Icon tile above heading** — rounded square with centered icon above h2. Never.
2. **Cards in cards** — a card component wrapping another card component.
3. **3-equal-column grid** — three identical cards in a row with icon+title+text. Use asymmetric layouts.
4. **Generic gradient** — `linear-gradient(to right, #purple, #blue)`. Only our specific red glow is allowed.
5. **Gray text on colored backgrounds** — always use near-white or specific opacity values.
6. **Rounded CTAs** — `border-radius > 4px` on buttons. We use sharp edges.
7. **Stock-feeling layout** — centered h2 + centered paragraph above a card grid. Always offset or slam text.
8. **Inline color that contradicts the system** — no ad-hoc color values outside the token system.
9. **Excessive padding between sections** — sections bleed into each other for cinematic continuity.
10. **Logo placeholder behavior** — font fallback to system-ui on Barlow. Always have the Google Font import.

---

## Section-by-Section Guidelines

### Hero (DO NOT TOUCH — PERFECT AS-IS)
WebGL background, 3D product models, cinematic red atmosphere. This is the gold standard.

### Featured Products
Full-bleed magazine slider. Massive overlapping product name typography behind the image.
Momentum drag. NO visible scrollbar. NO dot indicators.

### Brands
Two-row living marquee in opposite directions. Logos white/gray, hover: scale up + white.
Never a static grid of brand logos.

### Categories
Full-bleed parallax panels. Each category fills viewport width.
Typography slams diagonally across panels. No thumbnail card grid.

### Why Us / Brand Manifesto
Typography-driven. 3 massive numbered declarations. No icons. No bullets. No cards.

### About Page
Cinematic editorial. Scrolling story sentences. Count-up stats. Black-and-white imagery with red overlays.

### Shop / Boutique
Sticky sidebar filters. Magazine-style product grid. Quick-add on hover, not a static button.

### Footer
Dark (#080808), ghost wordmark at 6% opacity, red hairline at top.
Column layout with social links. NEVER white or cream background.

### Cart Drawer
Dark panel (#0a0a0a), slides from right. Red accent on brand label, total in large Barlow Condensed.

### Checkout Modal
Dark centered modal (#0d0d0d). Red top accent line. Forms with dark inputs.
