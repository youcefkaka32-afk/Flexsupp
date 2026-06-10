# Design System Inspired by AirZone

## 1. Visual Theme & Atmosphere

AirZone's design system embodies high-energy athletic culture with a digital-forward aesthetic. The visual language combines bold neon accents against dark, tech-influenced backgrounds, creating a dynamic and modern e-commerce environment. The brand conveys performance, speed, and innovation through sharp contrasts and vibrant accent colors that pop against neutral foundations. This design celebrates premium sportswear and running culture with a contemporary edge—mixing dark mode sophistication with electric highlights that energize the user experience.

**Key Characteristics**
- High contrast dark backgrounds with electric neon accents
- Bold, confident typography emphasizing product focus
- Vibrant accent palette (lime green, cyan, coral) for call-to-action elements
- Clean, minimal layouts with strategic color emphasis
- Tech-forward aesthetic blending digital and athletic culture
- Premium feel through generous whitespace and sophisticated typography

## 2. Color Palette & Roles

### Primary
- **Success/Action** (`#459647`): Primary call-to-action, discount badges, interactive success states, and product highlights (most frequently used)

### Accent Colors
- **Neon Green** (`#00D084`): Secondary highlight for promotional elements and accents
- **Lime Green** (`#7BDCB5`): Tertiary accent for subtle highlights and interactive states
- **Cyan Blue** (`#8ED1FC`): Accent for technical elements and alternative CTAs
- **Primary Blue** (`#0693E3`): Link colors and secondary interactive states
- **Coral Orange** (`#FF6900`): Energetic highlight for featured content
- **Salmon Pink** (`#F78DA7`): Soft accent for refined promotional messaging

### Interactive
- **Button Default Background** (`#F3F3F3`): Standard button and neutral interactive surfaces
- **Button Text** (`#3E3E3E`): High-contrast text on light interactive elements
- **Link Active** (`#333333`): Primary text links and navigation focus states
- **Border Muted** (`#E9E9E9`): Subtle borders and dividers

### Neutral Scale
- **Heading Black** (`#333333`): Primary headings and high-contrast text
- **Body Text** (`#636363`): Primary body copy and standard content text (most frequently used)
- **Secondary Text** (`#767676`): Secondary information and reduced-emphasis content
- **Tertiary Text** (`#A5A5A5`): Disabled states, captions, and de-emphasized copy
- **Light Border** (`#BBBBBB`): Subtle dividers and border accents
- **Background White** (`#FFFFFF`): Page backgrounds and content surfaces
- **Deep Black** (`#000000`): Maximum contrast and dark overlays

### Surface & Borders
- **Light Surface** (`#F3F3F3`): Button backgrounds and subtle surface containers
- **Subtle Border** (`#E9E9E9`): Fine dividers and minimal visual separation
- **Muted Border** (`#BBBBBB`): Standard borders and container outlines
- **Neutral Divider** (`#A5A5A5`): Section separators and visual hierarchy

### Semantic / Status
- **Error Red** (`#CB2027`): Error messages and danger states (primary)
- **Error Alt Red** (`#CF2E2E`): Alternative error state for emphasis
- **Warning Yellow** (`#FCB900`): Warning alerts and cautionary messages

## 3. Typography Rules

### Font Family
**Primary:** `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `Roboto`, `"Helvetica Neue"`, sans-serif (system font stack for body and UI)

**Secondary:** `Alice`, serif (https://fonts.googleapis.com/ — used for display and premium headings)

**Display:** `ADLaM Display`, serif (https://fonts.googleapis.com/ — used for accent text and labels)

**Monospace:** `IBM Plex Mono`, monospace (used for navigation and action text)

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| **Display Large** | Alice | 34px | 500 | 47.6px | 0px | Hero and banner headlines |
| **Heading 2** | Alice | 15px | 400 | 21px | 0px | Section subheadings |
| **Heading 3** | -apple-system | 14px | 400 | 19.6px | 0px | Card titles and subsections |
| **Body** | -apple-system | 14px | 400 | 22.4px | 0px | Primary content and descriptions |
| **Button / Link** | -apple-system | 13px | 600 | 15.6px | 0px | Interactive elements and CTAs |
| **Label / Caption** | ADLaM Display | 13px | 400 | 15.6px | 0px | Metadata, price labels, and captions |
| **Input Placeholder** | -apple-system | 14px | 600 | 22.4px | 0px | Form field text |
| **Navigation** | -apple-system | 14px | 400 | 22.4px | 0px | Menu and tab labels |

### Principles
- System fonts prioritize performance and clarity, ensuring fast load times and native platform consistency
- Alice serif is reserved for premium display moments that command attention in hero sections
- Bold weight (`600`) used exclusively for interactive elements to establish clear click targets
- Generous line height (1.6x–1.8x) enhances readability across body text and promotes visual breathing room
- Monospace fonts (`IBM Plex Mono`) create technical emphasis on navigation and action-oriented messaging
- Letter spacing remains tight (0px) to maintain compact, modern appearance while preserving legibility

## 4. Component Stylings

### Buttons

#### Primary Button
- **Background:** `#459647`
- **Text Color:** `#FFFFFF`
- **Font Size:** `13px`
- **Font Weight:** `600`
- **Font Family:** `-apple-system`
- **Padding:** `5px 20px`
- **Height:** `42px`
- **Border Radius:** `0px`
- **Border:** `0px solid transparent`
- **Box Shadow:** `none`
- **Line Height:** `15.6px`
- **Hover State:** Background `#3A8039`, Text `#FFFFFF`
- **Active State:** Background `#2D6630`, Text `#FFFFFF`
- **Disabled State:** Background `#A5A5A5`, Text `#FFFFFF`, opacity `0.6`

#### Secondary Button
- **Background:** `#F3F3F3`
- **Text Color:** `#3E3E3E`
- **Font Size:** `13px`
- **Font Weight:** `600`
- **Font Family:** `-apple-system`
- **Padding:** `5px 20px`
- **Height:** `42px`
- **Border Radius:** `0px`
- **Border:** `1px solid #E9E9E9`
- **Box Shadow:** `none`
- **Line Height:** `15.6px`
- **Hover State:** Background `#EEEEEE`, Text `#333333`
- **Active State:** Background `#E9E9E9`, Text `#333333`

#### Ghost Button (Overlay / Hero)
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#FFFFFF`
- **Font Size:** `30px`
- **Font Weight:** `600`
- **Font Family:** `IBM Plex Mono`
- **Padding:** `0px`
- **Height:** `61px`
- **Border Radius:** `0px`
- **Border:** `0px solid rgba(255, 255, 255, 0.35)`
- **Box Shadow:** `none`
- **Line Height:** `60px`
- **Hover State:** Text `#00D084`, Border `rgba(255, 255, 255, 0.7)`
- **Active State:** Text `#7BDCB5`, Border `rgba(255, 255, 255, 1)`

### Cards & Containers

#### Product Card
- **Background:** `#FFFFFF`
- **Text Color:** `#636363`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Font Family:** `-apple-system`
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Border:** `0px solid transparent`
- **Box Shadow:** `none`
- **Line Height:** `22.4px`
- **Discount Badge:** Background `#459647`, Text `#FFFFFF`, Border Radius `50%`, Padding `4px 8px`

#### Container Surface
- **Background:** `#F3F3F3`
- **Padding:** `16px 20px`
- **Border Radius:** `0px`
- **Border:** `1px solid #BBBBBB`

### Inputs & Forms

#### Search Input (Large / Hero)
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#FFFFFF`
- **Font Size:** `48px`
- **Font Weight:** `600`
- **Font Family:** `-apple-system`
- **Padding:** `0px`
- **Height:** `110px`
- **Border Radius:** `5px`
- **Border:** `0px solid rgba(255, 255, 255, 0.2)`
- **Box Shadow:** `none`
- **Line Height:** `76.8px`
- **Placeholder Color:** `rgba(255, 255, 255, 0.5)`
- **Focus State:** Border `1px solid rgba(255, 255, 255, 0.5)`, Box Shadow `0px 0px 8px rgba(0, 0, 0, 0.15)`

#### Search Input (Standard)
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `rgba(255, 255, 255, 0.7)`
- **Font Size:** `14px`
- **Font Weight:** `600`
- **Font Family:** `-apple-system`
- **Padding:** `0px 70px 0px 20px`
- **Height:** `70px`
- **Border Radius:** `5px`
- **Border:** `0px solid rgba(255, 255, 255, 0.2)`
- **Box Shadow:** `none`
- **Line Height:** `22.4px`
- **Placeholder Color:** `rgba(255, 255, 255, 0.5)`
- **Focus State:** Border `1px solid rgba(255, 255, 255, 0.5)`

#### Form Field Input
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `rgba(255, 255, 255, 0.8)`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Font Family:** `-apple-system`
- **Padding:** `0px 15px`
- **Height:** `42px`
- **Width:** `100%`
- **Border Radius:** `5px`
- **Border:** `2px solid rgba(255, 255, 255, 0.2)`
- **Box Shadow:** `none`
- **Line Height:** `22.4px`
- **Placeholder Color:** `rgba(255, 255, 255, 0.5)`
- **Focus State:** Border `2px solid rgba(255, 255, 255, 0.6)`, Background `rgba(255, 255, 255, 0.05)`
- **Error State:** Border `2px solid #CB2027`, Background `rgba(203, 32, 39, 0.05)`

### Navigation

#### Header Navigation
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#636363`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Font Family:** `-apple-system`
- **Padding:** `0px 10px`
- **Height:** `42px`
- **Border Radius:** `0px`
- **Border:** `0px solid transparent`
- **Box Shadow:** `none`
- **Line Height:** `22.4px`
- **Hover State:** Text Color `#333333`, Border Bottom `2px solid #459647`
- **Active State:** Text Color `#459647`, Border Bottom `2px solid #459647`

#### Dropdown Menu
- **Background:** `#FFFFFF`
- **Text Color:** `#636363`
- **Font Size:** `14px`
- **Padding:** `8px 0px`
- **Border Radius:** `0px`
- **Border:** `1px solid #E9E9E9`
- **Box Shadow:** `rgba(0, 0, 0, 0.15) 0px 0px 3px 0px`
- **Item Hover:** Background `#F3F3F3`, Text Color `#333333`

### Links

#### Text Link (Inline)
- **Background:** `transparent`
- **Text Color:** `#333333`
- **Font Size:** `14px`
- **Font Weight:** `400`
- **Font Family:** `-apple-system`
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Border:** `0px solid transparent`
- **Line Height:** `22.4px`
- **Text Decoration:** `underline`
- **Hover State:** Text Color `#459647`, Text Decoration `underline`
- **Active State:** Text Color `#3A8039`, Text Decoration `underline`

#### CTA Link
- **Background:** `#F3F3F3`
- **Text Color:** `#3E3E3E`
- **Font Size:** `13px`
- **Font Weight:** `600`
- **Font Family:** `-apple-system`
- **Padding:** `5px 20px`
- **Height:** `42px`
- **Border Radius:** `0px`
- **Border:** `1px solid #E9E9E9`
- **Line Height:** `15.6px`
- **Hover State:** Background `#EEEEEE`, Text Color `#333333`

### Badges

#### Discount Badge
- **Background:** `#459647`
- **Text Color:** `#FFFFFF`
- **Font Size:** `13px`
- **Font Weight:** `600`
- **Padding:** `4px 8px`
- **Border Radius:** `50%`
- **Font Family:** `-apple-system`

#### New Badge
- **Background:** `#00D084`
- **Text Color:** `#FFFFFF`
- **Font Size:** `13px`
- **Font Weight:** `600`
- **Padding:** `4px 12px`
- **Border Radius:** `5px`
- **Font Family:** `-apple-system`

## 5. Layout Principles

### Spacing System
Base unit: `4px`

**Scale:**
- `4px`: Micro spacing, tight gaps between inline elements
- `8px`: Extra small padding, compact component spacing
- `12px`: Small padding, comfortable internal spacing
- `16px`: Standard padding, default component and section spacing
- `20px`: Medium gap, breathing room between content blocks
- `40px`: Large padding, section padding and container gutters
- `108px`: Extra large margin, major section separation

**Usage Context:**
- `4px` – Icon-to-text spacing, tight button internal spacing
- `8px` – Form field internal padding, minimal gaps
- `12px` – Card padding, narrow gutters
- `16px` – Standard section padding, comfortable component spacing
- `20px` – Gap between major content sections, content card spacing
- `40px` – Full section padding, container padding
- `108px` – Hero section separation, major layout breaks

### Grid & Container
- **Max Width:** `1240px` (primary content container)
- **Column Strategy:** 12-column grid for desktop, flexible single-column on mobile
- **Gutters:** `16px` to `20px` between grid columns
- **Section Patterns:** Full-width hero sections with centered content, card-based product grids (3–4 columns on desktop)

### Whitespace Philosophy
Generous whitespace creates a premium atmosphere. Spacing is deliberate and generous rather than compressed, allowing content to breathe and product imagery to command attention. Vertical rhythm is maintained through consistent line heights (1.6x–1.8x) and predictable section gaps (20px–40px). Minimal gaps between related elements create visual grouping; larger gaps separate distinct content zones.

### Border Radius Scale
- `0px`: Primary component style—flat, angular aesthetic emphasizing modernity
- `5px`: Subtle rounding for form inputs and secondary containers, maintains edge definition
- `50%`: Discount and status badges, full circular appearance

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| **Flat (Level 0)** | No shadow, `0px` border | Primary buttons, flat cards, standard components |
| **Subtle (Level 1)** | `rgba(0, 0, 0, 0.15) 0px 0px 3px 0px` | Dropdown menus, floating labels, lifted containers |
| **Raised (Level 2)** | `rgba(0, 0, 0, 0.2) 0px 4px 12px 0px` | Modals, prominent cards, overlays (inferred) |

**Shadow Philosophy:** AirZone embraces minimal depth through flat design and careful use of subtle shadows. Shadows are reserved for interactive elements that require visual distinction—dropdowns, floating states, and emphasis—rather than comprehensive layering. This approach maintains the modern, tech-forward aesthetic while ensuring interactive elements feel tangible and responsive. Dark backgrounds naturally define depth through contrast; light shadows appear only on light surfaces.

## 7. Do's and Don'ts

### Do
- **Use `#459647` for all primary CTAs**, discount badges, and positive actions to establish consistent brand identity
- **Maintain sharp, angular component styling** with `0px` border radius for primary elements—it defines AirZone's modern edge
- **Layer accent colors strategically**—neon greens (`#00D084`, `#7BDCB5`) and cyan (`#8ED1FC`) energize secondary interactions without overwhelming primary messaging
- **Keep backgrounds transparent on dark overlays** to maintain neon-on-dark contrast that drives engagement
- **Apply generous padding (`16px` to `40px`)** to create premium spacing and allow product imagery prominence
- **Use system fonts (`-apple-system`) for body and navigation**, reserving Alice serif for high-impact hero displays
- **Bold weight (`600`) exclusively for interactive elements** (buttons, links, labels) to establish clear affordances
- **Test all color combinations on both light and dark backgrounds** due to dual-theme usage (dark heroes, light content)

### Don't
- **Don't apply rounded corners to primary components**—maintain `0px` radius for structural clarity and modern aesthetic
- **Don't overuse bright accent colors**—limit neon green and cyan to highlights; neutral tones provide visual rest
- **Don't pair low-contrast text colors on transparent or light backgrounds**—always maintain minimum WCAG AA contrast
- **Don't mix serif and sans-serif fonts in the same content zone** without intentional hierarchy (Alice + system fonts only in headings/body separation)
- **Don't use more than two accent colors per interface screen** to avoid visual chaos and maintain focus
- **Don't apply drop shadows to elements on dark backgrounds** unless absolutely necessary for interactive affordance—contrast handles depth
- **Don't reduce standard padding below `8px`** or `12px`; this system requires generous internal spacing for premium feel
- **Don't deviate from the specified typography sizes and weights**—hierarchy clarity depends on strict adherence

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|------------|
| **Mobile** | `320px` – `639px` | Single-column layout, full-width components, `12px` padding, hero text `18px–24px` |
| **Tablet** | `640px` – `1023px` | 2-column grid, reduced hero height, `16px` padding, `24px` gaps between sections |
| **Desktop** | `1024px` – `1240px` | 3–4 column grid, full `1240px` container, hero sections at full height, `20px` gaps |
| **Large Desktop** | `1241px`+ | Max-width `1240px` container centered, no further expansion |

### Touch Targets
- **Minimum Height:** `42px` for all interactive elements (buttons, inputs, links)
- **Minimum Width:** `44px` for icon buttons and small CTAs
- **Minimum Padding:** `8px` around small interactive targets to ensure comfortable tap zones
- **Spacing Between Targets:** Minimum `8px` gap to prevent accidental adjacent taps on mobile

### Collapsing Strategy
- **Hero Sections:** Scale proportionally on mobile; text size reduces from `34px` to `24px`, padding from `40px` to `16px`
- **Product Grids:** Collapse from 4 columns (desktop) → 2 columns (tablet) → 1 column (mobile)
- **Navigation:** Transform horizontal navigation into hamburger menu below `640px`; dropdown menus remain available on tablet+
- **Form Inputs:** Expand to full width on mobile (100%); maintain max-width on desktop (`340px` for search)
- **Cards:** Remove top padding on mobile; reduce side padding to `12px` for comfortable thumb access

## 9. Agent Prompt Guide

### Quick Color Reference
- **Primary CTA:** Success Green (`#459647`) — all primary buttons, badges, positive actions
- **Secondary CTA:** Light Gray (`#F3F3F3`) — secondary buttons, alternative interactions
- **Background/Surface:** White (`#FFFFFF`) — content backgrounds and card surfaces
- **Heading Text:** Dark Charcoal (`#333333`) — primary headings, high-contrast copy
- **Body Text:** Medium Gray (`#636363`) — standard body content, descriptions
- **Secondary Text:** Light Gray (`#A5A5A5`) — captions, metadata, disabled states
- **Accent Highlights:** Neon Green (`#00D084`), Cyan (`#8ED1FC`), Coral (`#FF6900`) — energetic secondary highlights
- **Error State:** Error Red (`#CB2027`) — validation errors, danger alerts
- **Warning State:** Warning Yellow (`#FCB900`) — cautionary messages, alerts
- **Border/Divider:** Light Gray (`#BBBBBB`) — subtle separators, container outlines

### Iteration Guide

1. **Every primary button must use `#459647` background with `#FFFFFF` text**, `13px` bold system font, `42px` height, `0px` border radius—this is non-negotiable brand identity
2. **All interactive text elements require minimum `13px` bold weight** in system font to ensure clear affordance; underline text links for clarity
3. **Maintain `0px` border radius on primary components** (buttons, cards, containers) except for form inputs which use `5px`—this defines the modern, angular aesthetic
4. **Apply `16px` to `20px` padding to all major sections**; reduce to `12px` only on mobile—spacing creates premium feel and product prominence
5. **On dark backgrounds (hero sections), use only transparent backgrounds and white/accent text**; reserve solid surfaces for light content zones
6. **Form validation states**: Error borders `#CB2027`, warning text `#FCB900`; always pair with accessible helper text
7. **Scale typography precisely**: Display `34px`, headings `15px`, body `14px`, labels `13px`—never interpolate between sizes
8. **Limit accent colors to 1–2 per interface screen** (e.g., green badges + cyan highlights); secondary accents are for emphasis only
9. **Test all components at minimum touch size `42px` × `42px`** and verify 8px minimum spacing between interactive elements
10. **Respect the color hierarchy**: Primary green drives attention (sales/CTAs), neutrals provide foundation, bright accents energize secondary interactions only