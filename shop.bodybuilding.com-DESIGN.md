# Design System Inspired by Bodybuilding.com

## 1. Visual Theme & Atmosphere

Bodybuilding.com's design system embodies an energetic, performance-driven aesthetic rooted in the fitness and supplement industry. The visual identity combines bold, high-contrast elements with a modern digital fitness platform sensibility. Deep blacks and rich purples create an immersive, premium atmosphere while bright accent blues punctuate key actions and calls-to-action. The design prioritizes clarity and directness, featuring strong typography and decisive interactive elements that guide users toward product discovery and purchasing decisions. The mood is aspirational yet approachable—combining athletic energy with professional product presentation. Geometric precision and consistent spacing reinforce trust and reliability, essential for a nutrition and supplement retailer.

**Key Characteristics**
- High contrast dark backgrounds with vibrant purple and blue accents
- Bold, imposing typography hierarchy for product showcasing
- Clean geometric forms with precise spacing systems
- Premium black and white palette anchoring all content
- Bright accent colors driving conversion and attention
- Modern sans-serif and geometric display fonts
- Athlete-centric imagery paired with minimalist UI elements
- Clear visual separation between promotional and product areas

## 2. Color Palette & Roles

### Primary
- **Brand Purple** (`#574CD5`): Primary interactive elements, CTAs, featured product highlights, brand identity anchor
- **Brand Blue** (`#3B60FF`): Secondary CTAs, accent highlights, interactive state indicators

### Accent Colors
- **Bright Blue** (`#496DDF`): Tertiary accent for buttons, links, and supplementary interactive elements
- **Success Green** (`#298266`): Success states, confirmations, positive feedback indicators

### Interactive
- **Text on Brand** (`#212121`): Primary text color for elements on brand-colored backgrounds
- **Link Text** (`#212121`): Default link text, underlined for clarity

### Neutral Scale
- **Pure Black** (`#000000`): Navigation bars, primary text on light backgrounds, high-contrast elements
- **Pure White** (`#FFFFFF`): Text on dark backgrounds, primary surface for hero sections
- **Dark Charcoal** (`#262735`): Secondary text, borders, subtle dividers
- **Medium Gray** (`#69727B`): Body text, secondary content, form labels
- **Light Gray** (`#4B5563`): Tertiary text, disabled states, helper text

### Surface & Borders
- **Off-White Background** (`#F2F2F8`): Light card backgrounds, subtle section backgrounds
- **Light Surface** (`#EFF1F7`): Secondary surface color for layered card systems
- **Neutral Gray** (`#F2F2F2`): Alternative light surface, form backgrounds
- **Near Black** (`#090909`): Deep shadows, extreme contrast text
- **Very Dark Gray** (`#1A1A1A`): Alternative dark surface, secondary navigation

## 3. Typography Rules

### Font Family
**Primary Display**: Druk Bold (geometric, bold, athletic)
Fallback: `'Arial Black', sans-serif`

**Secondary Display**: RBNo2 (bold, modern, product-focused)
Fallback: `'Trebuchet MS', sans-serif`

**Body & UI**: Noto Sans (clear, modern, accessible)
Fallback: `'Segoe UI', Tahoma, sans-serif`

**Accent UI**: Poppins (friendly, modern, secondary actions)
Fallback: `'Helvetica Neue', sans-serif`

**Code/Spec**: MonoSpec-Regular (technical, precise)
Fallback: `'Courier New', monospace`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|-----------------|-------|
| Display H1 | Druk Bold | 60.75px | 400 | 60.75px | normal | Hero headlines, major page titles |
| Display H2 | RBNo2 | 27px | 700 | 31.2px | normal | Section headers, promotional blocks |
| Heading H3 | Druk Bold | 28.8px | 400 | 31.68px | normal | Section subheadings, category titles |
| Heading H4 | Noto Sans | 18px | 700 | 25.2px | normal | Card titles, subsection headers |
| Heading H5 | Noto Sans | 14px | 700 | 14px | normal | Form labels, badge text |
| Body Large | Noto Sans | 16px | 400 | normal | normal | Primary body text, descriptions |
| Body Regular | Noto Sans | 14px | 400 | normal | normal | Secondary body text, meta information |
| Button Text | Poppins | 16px | 400 | 16px | normal | CTA labels, button text |
| Button Small | Noto Sans | 15.024px | 700 | 15.024px | normal | Secondary buttons, compact actions |
| Input Text | Noto Sans | 14px | 400 | normal | normal | Form inputs, search fields |
| Caption | Poppins | 12px | 400 | normal | normal | Fine print, disclaimers, helper text |
| Accent Spec | accessibly | 35px | 400 | 35px | normal | Large numeric displays, special emphasis |
| Icon Label | Noto Sans | 14px | 600 | 14px | normal | Icon descriptions, feature callouts |

### Principles
- Use Druk Bold for bold, attention-grabbing headlines to establish brand presence
- Reserve RBNo2 for product-focused section headers and promotional blocks
- Maintain consistent 14px–16px body text for readability and accessibility
- Apply 700 weight for all interactive text (buttons, links) to increase clickability perception
- Use 400 weight for body and secondary copy to reduce cognitive load
- Keep line-height normal (1.5–1.6 implied) for body text; tight for headers
- Apply letter-spacing: normal across all roles for optimal readability
- Ensure minimum 14px for all interactive elements to meet accessibility standards

## 4. Component Stylings

### Buttons

#### Primary Button (Brand Purple)
- **Background**: `#574CD5`
- **Text Color**: `#212121`
- **Font**: Noto Sans, 16px, weight 400
- **Padding**: `12px 24px`
- **Border Radius**: `5px`
- **Border**: none
- **Box Shadow**: `rgba(25, 27, 30, 0.03) 0px 0px 5px 0px`
- **Height**: auto (min `44px`)
- **Width**: auto
- **Hover State**: Background `#496DDF`, text `#212121`
- **Active State**: Background `#3B60FF`, text `#212121`
- **Disabled State**: Background `#69727B`, text `#FFFFFF`, opacity 0.5

#### Secondary Button (Outlined)
- **Background**: transparent
- **Text Color**: `#FFFFFF`
- **Font**: Noto Sans, 15.024px, weight 700
- **Padding**: `12px 24px`
- **Border Radius**: `5px`
- **Border**: `2px solid #FFFFFF`
- **Box Shadow**: none
- **Height**: auto (min `44px`)
- **Width**: auto
- **Hover State**: Background `#FFFFFF`, text `#000000`
- **Active State**: Background `#F2F2F8`, text `#000000`

#### Ghost Button (Transparent)
- **Background**: transparent
- **Text Color**: `#FFFFFF`
- **Font**: Noto Sans, 16px, weight 400
- **Padding**: `8px 16px`
- **Border Radius**: `0px`
- **Border**: none
- **Box Shadow**: none
- **Height**: auto
- **Width**: auto
- **Hover State**: Text Color `#574CD5`, opacity 0.8
- **Active State**: Text Color `#3B60FF`

#### Icon Button (Circular)
- **Background**: `#574CD5`
- **Text Color**: `#212121`
- **Font**: accessibly, 35px, weight 400
- **Padding**: `0px`
- **Border Radius**: `100%`
- **Border**: none
- **Box Shadow**: none
- **Height**: `45px`
- **Width**: `45px`
- **Hover State**: Background `#496DDF`
- **Active State**: Background `#3B60FF`

### Cards & Containers

#### Product Card
- **Background**: `#FFFFFF`
- **Text Color**: `#212121`
- **Font**: Noto Sans, 16px, weight 400
- **Padding**: `20px`
- **Border Radius**: `12px`
- **Border**: `1px solid #EFF1F7`
- **Box Shadow**: `rgba(25, 27, 30, 0.03) 0px 0px 5px 0px`
- **Width**: 100%
- **Hover State**: Box Shadow `rgba(0, 0, 0, 0.1) 0px 10px 20px -5px`

#### Hero Card (Dark)
- **Background**: `#262735`
- **Text Color**: `#FFFFFF`
- **Font**: Druk Bold, 60.75px, weight 400 (for headlines)
- **Padding**: `64px`
- **Border Radius**: `0px`
- **Border**: none
- **Box Shadow**: none
- **Width**: 100%
- **Accent Overlay**: Linear gradient `rgba(87, 76, 213, 0.2)` top-left to transparent

#### Feature Card (Icon Box)
- **Background**: `#F2F2F8`
- **Text Color**: `#262735`
- **Font**: Noto Sans, 14px, weight 600
- **Padding**: `28px 24px`
- **Border Radius**: `8px`
- **Border**: `1px solid #EFF1F7`
- **Box Shadow**: none
- **Icon Color**: `#574CD5`
- **Hover State**: Background `#EFF1F7`

#### Modal / Overlay
- **Background**: `#FFFFFF`
- **Text Color**: `#212121`
- **Padding**: `40px`
- **Border Radius**: `12px`
- **Box Shadow**: `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`
- **Backdrop**: `rgba(0, 0, 0, 0.5)`

### Inputs & Forms

#### Text Input
- **Background**: `#FFFFFF`
- **Text Color**: `#212121`
- **Border**: `1px solid #EFF1F7`
- **Border Radius**: `3px`
- **Font**: Noto Sans, 14px, weight 400
- **Padding**: `12px 16px`
- **Height**: `44px`
- **Focus State**: Border `1px solid #574CD5`, Box Shadow `0px 0px 0px 3px rgba(87, 76, 213, 0.1)`
- **Error State**: Border `1px solid #FF4444`, Box Shadow `0px 0px 0px 3px rgba(255, 68, 68, 0.1)`
- **Disabled State**: Background `#F2F2F2`, text `#69727B`, border `1px solid #EFF1F7`
- **Placeholder**: Color `#69727B`, opacity 0.6

#### Textarea
- **Background**: `#FFFFFF`
- **Text Color**: `#212121`
- **Border**: `1px solid #EFF1F7`
- **Border Radius**: `3px`
- **Font**: Noto Sans, 14px, weight 400
- **Padding**: `12px 16px`
- **Min Height**: `120px`
- **Resize**: vertical
- **Focus State**: Border `1px solid #574CD5`, Box Shadow `0px 0px 0px 3px rgba(87, 76, 213, 0.1)`

#### Select / Dropdown
- **Background**: `#FFFFFF`
- **Text Color**: `#212121`
- **Border**: `1px solid #EFF1F7`
- **Border Radius**: `3px`
- **Font**: Noto Sans, 14px, weight 400
- **Padding**: `12px 16px`
- **Height**: `44px`
- **Icon Color**: `#574CD5`
- **Focus State**: Border `1px solid #574CD5`

#### Checkbox
- **Size**: `20px × 20px`
- **Border**: `2px solid #EFF1F7`
- **Border Radius**: `3px`
- **Background (Unchecked)**: `#FFFFFF`
- **Background (Checked)**: `#574CD5`
- **Checkmark Color**: `#FFFFFF`
- **Focus State**: Box Shadow `0px 0px 0px 3px rgba(87, 76, 213, 0.1)`

#### Radio Button
- **Size**: `20px × 20px`
- **Border**: `2px solid #EFF1F7`
- **Border Radius**: `50%`
- **Background (Unchecked)**: `#FFFFFF`
- **Dot Color (Checked)**: `#574CD5`
- **Dot Size**: `10px`
- **Focus State**: Box Shadow `0px 0px 0px 3px rgba(87, 76, 213, 0.1)`

### Navigation

#### Top Navigation Bar
- **Background**: `#000000`
- **Text Color**: `#FFFFFF`
- **Font**: Poppins, 16px, weight 400
- **Height**: `64px`
- **Padding**: `16px 32px`
- **Box Shadow**: none
- **Link Color**: `#FFFFFF`
- **Link Hover State**: Color `#574CD5`
- **Active Link**: Color `#574CD5`, underline `2px solid #574CD5`
- **Logo Area**: Logo `60px` height, positioned left

#### Breadcrumb Navigation
- **Font**: Noto Sans, 14px, weight 400
- **Text Color**: `#69727B`
- **Separator**: `/` in `#69727B`
- **Active Link**: Color `#212121`, weight 600
- **Hover Link**: Color `#574CD5`
- **Spacing Between Items**: `8px`

#### Mobile Navigation (Hamburger)
- **Icon Size**: `24px × 24px`
- **Icon Color**: `#FFFFFF`
- **Expanded Menu Background**: `#1A1A1A`
- **Menu Item Font**: Noto Sans, 16px, weight 400
- **Menu Item Padding**: `16px 24px`
- **Menu Item Hover**: Background `#262735`, color `#574CD5`

### Badges & Tags

#### Badge (Primary)
- **Background**: `#574CD5`
- **Text Color**: `#FFFFFF`
- **Font**: Noto Sans, 12px, weight 600
- **Padding**: `4px 12px`
- **Border Radius**: `50%`
- **Border**: none
- **Height**: auto (min `24px`)

#### Badge (Success)
- **Background**: `#298266`
- **Text Color**: `#FFFFFF`
- **Font**: Noto Sans, 12px, weight 600
- **Padding**: `4px 12px`
- **Border Radius**: `2px`
- **Border**: none

#### Badge (Outline)
- **Background**: transparent
- **Text Color**: `#574CD5`
- **Font**: Noto Sans, 12px, weight 600
- **Padding**: `4px 12px`
- **Border Radius**: `3px`
- **Border**: `1px solid #574CD5`

### Pagination

#### Pagination Controls
- **Button Background**: `#FFFFFF`
- **Button Text**: `#212121`
- **Button Border**: `1px solid #EFF1F7`
- **Button Padding**: `8px 12px`
- **Button Font**: Noto Sans, 14px, weight 400
- **Button Border Radius**: `3px`
- **Active Button Background**: `#574CD5`
- **Active Button Text**: `#FFFFFF`
- **Hover Button Background**: `#F2F2F8`
- **Disabled Button**: Color `#69727B`, opacity 0.5

## 5. Layout Principles

### Spacing System

The design system uses an 8px base unit for consistent, scalable spacing:

- **XS**: `4px` — micro spacing, inline margins, minor adjustments
- **S**: `8px` — tight padding for inputs, button gaps, small components
- **SM**: `12px` — form field spacing, button groups
- **M**: `16px` — standard padding, navigation gaps, card padding
- **L**: `20px` — medium section spacing, container margins
- **XL**: `24px` — generous padding, card padding, section dividers
- **2XL**: `28px` — larger container padding
- **3XL**: `32px` — section margins, significant vertical spacing
- **4XL**: `40px` — hero padding, major layout spacing
- **5XL**: `52px` — large section separation
- **6XL**: `64px` — page-level spacing, hero sections

**Usage Context**:
- Inline / Icon spacing: `4px–8px`
- Form fields / Buttons: `12px–16px`
- Cards / Small sections: `20px–24px`
- Major sections / Hero blocks: `40px–64px`
- Page margins: `32px–64px` depending on viewport

### Grid & Container

- **Max Width**: `1440px` for desktop layouts, `100vw` for mobile
- **Column Strategy**: 12-column grid on desktop, 6-column on tablet, single column on mobile
- **Container Margin**: `32px` on desktop, `20px` on tablet, `16px` on mobile
- **Section Pattern**: Full-width sections with centered content containers
- **Gutter**: `24px` between columns
- **Card Grid**: 3 columns on desktop, 2 on tablet, 1 on mobile with `24px` gap

### Whitespace Philosophy

Bodybuilding.com employs a **generous whitespace strategy** to reduce cognitive load and guide user attention. Large sections of negative space surround hero content and primary CTAs, creating visual hierarchy and focus. Product cards are well-spaced to feel premium and discoverable. Navigation and form areas balance density with breathing room. Sections are separated by `40px–64px` vertical whitespace to create distinct content zones. This approach reduces visual clutter while maintaining a modern, premium feel.

### Border Radius Scale

- **None**: `0px` — sharp edges for hero sections, full-width backgrounds, major dividers
- **Minimal**: `2px` — badges, small tags, subtle refinement
- **Small**: `3px` — form inputs, compact elements
- **Medium**: `5px` — buttons, small cards, moderate softness
- **Large**: `8px` — secondary cards, feature blocks
- **Extra Large**: `12px` — product cards, modals, primary containers
- **Full**: `50%` or `100%` — circular buttons, avatar images, icon buttons

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Base / Ground (0) | No shadow | Large sections, page backgrounds, navigation |
| Raised (1) | `rgba(25, 27, 30, 0.03) 0px 0px 5px 0px` | Cards, subtle containers, secondary UI |
| Elevated (2) | `rgba(0, 0, 0, 0.1) 0px 4px 12px -2px` | Hovered cards, interactive elements, secondary modals |
| High (3) | `rgba(0, 0, 0, 0.15) 0px 8px 24px -4px` | Dropdowns, floating elements, menus |
| Modal / Overlay (4) | `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px` | Primary modals, popups, highest-priority overlays |

**Shadow Philosophy**: Bodybuilding.com uses subtle, minimal shadows to create depth without overwhelming the visual hierarchy. Shadows increase in intensity only when functional separation is needed (modals, dropdowns, hover states). The design avoids heavy or dramatic shadows, instead relying on color contrast and spacing for visual clarity. Shadows use a dark, slightly desaturated black (`rgba(0, 0, 0, X%)`) to feel natural and refined. Vertical offset increases with elevation, emphasizing the height relationship between layers.

## 7. Do's and Don'ts

### Do

- **Use Brand Purple (`#574CD5`) for all primary CTAs** — buttons, form submissions, key conversions
- **Apply high contrast between text and background** — maintain minimum WCAG AA standard (4.5:1 for body text)
- **Group related inputs vertically with 12px gaps** — keeps form structure clear and scannable
- **Use bold typography (600–700 weight) for all interactive elements** — increases perceived clickability
- **Maintain consistent 44px minimum touch target size** — accessibility for mobile users
- **Apply generous padding (`20px–24px`) on cards** — premium presentation and breathing room
- **Use generous section spacing (`40px–64px`) between content blocks** — visual clarity and mental breaks
- **Pair Druk Bold headlines with Noto Sans body text** — creates clear visual hierarchy
- **Implement focus states with 3px blue shadow on all interactive elements** — keyboard accessibility
- **Use `rgba(87, 76, 213, 0.1)` for subtle background tints** — brand reinforcement without overwhelming

### Don't

- **Don't use colors outside the defined palette** — maintains brand consistency and accessibility
- **Don't use body text smaller than 14px** — compromises readability on all devices
- **Don't apply shadows larger than level 4** — visual clutter and loss of hierarchy
- **Don't use light gray text (`#69727B`) on light backgrounds** — contrast failure and accessibility issues
- **Don't create touch targets smaller than 44px** — mobile usability failure
- **Don't mix multiple display fonts in a single section** — visual confusion and unprofessionalism
- **Don't use white space less than 12px between related elements** — crowded, overwhelming appearance
- **Don't apply brand purple to non-interactive elements** — dilutes interaction signaling
- **Don't stack borders and shadows on the same element** — redundant visual noise
- **Don't forget to test all color combinations for WCAG AA compliance** — legal and ethical requirement

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile (XS) | 320px–639px | Single column, full-width elements, 16px margins, stacked navigation, 14px body text |
| Tablet (SM) | 640px–1023px | 2 columns for cards, 20px margins, hamburger menu, 16px body text, reduced padding |
| Desktop (MD) | 1024px–1439px | 3-column grid, 32px margins, full navigation bar, 16px body text, standard padding |
| Large Desktop (LG) | 1440px+ | Max-width container, 4-column grid for some sections, 32px margins, 18px display text |

### Touch Targets

- **Minimum Size**: `44px × 44px` for all interactive elements
- **Comfortable Size**: `48px–56px` for primary buttons and navigation items
- **Padding Around Targets**: `8px–12px` spacing to prevent accidental activation
- **Hover Areas**: Extend hover state to `56px` to accommodate finger touch
- **Text Links**: Minimum `44px` height with extra vertical padding if text is small

### Collapsing Strategy

- **Hero Section**: Full-width background on mobile, padding reduced from `64px` to `40px`
- **Navigation**: Horizontal menu on desktop → hamburger menu on tablet/mobile at `640px` breakpoint
- **Product Grid**: 3 columns → 2 columns at `1023px` → 1 column at `639px`
- **Product Cards**: `24px` gap on desktop → `16px` gap on tablet → `12px` gap on mobile
- **Padding Reduction**: `32px` page margin on desktop → `20px` on tablet → `16px` on mobile
- **Font Scaling**: 
  - H1: `60.75px` (desktop) → `40px` (tablet) → `28px` (mobile)
  - H3: `28.8px` (desktop) → `24px` (tablet) → `20px` (mobile)
  - Body: `16px` (desktop/tablet) → `14px` (mobile for density)
- **Button Stacking**: Full-width buttons on mobile, side-by-side on desktop
- **Modal Sizing**: Full viewport minus `20px` margin on mobile, centered at `500px` width on desktop
- **Image Scaling**: 100% width containers on mobile, max `100%` object-fit on all sizes

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA Background**: Brand Purple (`#574CD5`)
- **Secondary CTA Background**: Brand Blue (`#3B60FF`)
- **Success/Confirmation**: Success Green (`#298266`)
- **Page Background / Section**: Pure White (`#FFFFFF`) or Off-White (`#F2F2F8`)
- **Navigation / Dark Sections**: Pure Black (`#000000`) or Very Dark Gray (`#262735`)
- **Body Text on Light**: Pure Black (`#000000`) or Medium Gray (`#69727B`)
- **Body Text on Dark**: Pure White (`#FFFFFF`)
- **Primary Heading**: Druk Bold or RBNo2, `#000000` or `#574CD5`
- **Form Input Background**: Pure White (`#FFFFFF`)
- **Form Input Border**: Light Surface (`#EFF1F7`)
- **Disabled State**: Medium Gray (`#69727B`) with 0.5 opacity
- **Link Text**: Medium Gray (`#69727B`) with hover `#574CD5`
- **Secondary/Subtle Text**: Medium Gray (`#69727B`)
- **Borders / Dividers**: Light Surface (`#EFF1F7`)
- **Card Shadows**: `rgba(25, 27, 30, 0.03) 0px 0px 5px 0px`
- **Modal Overlay**: `rgba(0, 0, 0, 0.5)` with box shadow `rgba(0, 0, 0, 0.25) 0px 25px 50px -12px`

### Iteration Guide

1. **Base all primary buttons on Brand Purple (`#574CD5`)** with `16px` Noto Sans text, `5px` border radius, `12px 24px` padding, and minimum `44px` height
2. **Apply Druk Bold at `60.75px` for hero H1 headlines** with line-height `60.75px` and color `#FFFFFF` or `#000000` depending on background
3. **Use RBNo2 at `27px` weight 700 for product section headers** with `#574CD5` color or `#FFFFFF` on dark backgrounds
4. **Structure all form fields with Noto Sans `14px` weight 400**, `3px` border radius, `1px solid #EFF1F7` border, and `44px` minimum height
5. **Maintain 8px base spacing unit** — all padding, margins, and gaps must be multiples of `8px`
6. **Apply consistent `12px` border radius to product cards** with `20px` padding and subtle shadow `rgba(25, 27, 30, 0.03) 0px 0px 5px 0px`
7. **Implement focus states on all interactive elements** with `0px 0px 0px 3px rgba(87, 76, 213, 0.1)` box shadow
8. **Use full-width sections with centered max-width `1440px` container** for responsive layouts
9. **Scale typography down at tablet (`1023px`) and mobile (`639px`) breakpoints** — reduce display sizes by 30–40%
10. **Always verify color contrast against WCAG AA standards** before shipping — text (`#212121` on `#FFFFFF` = 12:1 ✓, `#574CD5` on `#FFFFFF` = 3.9:1 ⚠ use only for large text or icons)