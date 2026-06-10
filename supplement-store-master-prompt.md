# SUPPLEMENT STORE — MASTER BUILD PROMPT
### For: Gemini 2.5 Pro / Google AI Studio / Codex
### Version: 2.0 | No Database | Black / White / Red

---

> **HOW TO USE THIS DOCUMENT**
> Read this in full before writing a single line of code.
> Execute **one phase at a time**. Do not move to the next phase until the current one is complete and tested.
> Each phase ends with a checkpoint. Confirm each checkpoint before proceeding.

---

## PROJECT OVERVIEW

We are building a premium supplement e-commerce website for a local Algerian bodybuilding supplement store. The store sells: whey protein, creatine, BCAA, pre-workout, multivitamins, mass gainers, and other fitness supplements.

**Design direction:** Bold, aggressive, premium athletic brand. Pure black backgrounds, crisp white typography, red as the single power accent. Think Nike meets a high-end supplement brand — zero decoration, maximum impact. Every element earns its place. Designed to convert visitors into buyers with no fluff, no distractions.

**Technology stack:**
- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Animations:** GSAP + ScrollTrigger, Framer Motion v12
- **Routing:** React Router v6
- **State management:** Zustand (with localStorage persistence for cart)
- **Data:** JSON files (no database — all product data lives in `src/data/`)
- **i18n:** i18next (Arabic / French / English — RTL support for Arabic)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Orders:** WhatsApp redirect (no payment gateway needed for Phase 1)

**Languages:** Arabic (primary), French, English. Arabic must trigger RTL layout automatically.

> **Note on the backend:** There is no database in this version. Products, categories, and all content are stored in local JSON files inside `src/data/`. The admin dashboard (Phase 8) will manage a `products.json` file directly. A real backend (Supabase or other) can be added in a future phase once the frontend is approved by the client.

---

## PHASE 0 — PROJECT SCAFFOLDING & FOLDER STRUCTURE

> **Execute this phase first. Nothing gets built until this structure exists.**

### 0.1 — Initialize the project

```bash
npm create vite@latest supplement-store -- --template react-ts
cd supplement-store
npm install
```

### 0.2 — Install all dependencies

```bash
# Core
npm install react-router-dom zustand

# Styling
npm install tailwindcss @tailwindcss/vite

# Animation
npm install gsap @gsap/react framer-motion

# i18n
npm install i18next react-i18next i18next-browser-languagedetector

# Forms & validation
npm install react-hook-form @hookform/resolvers zod

# UI utilities
npm install lucide-react clsx tailwind-merge

# Dev dependencies
npm install -D @types/node
```

### 0.3 — Exact folder structure

Create this exact structure. Do not deviate. Every folder has a purpose.

```
supplement-store/
├── public/
│   ├── locales/
│   │   ├── ar/
│   │   │   └── translation.json
│   │   ├── fr/
│   │   │   └── translation.json
│   │   └── en/
│   │       └── translation.json
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── images/              ← product images (WebP preferred)
│   ├── components/
│   │   ├── ui/                  ← Button, Badge, Card, Modal, Spinner, Input
│   │   ├── layout/              ← Navbar, Footer, PageWrapper, LanguageSwitcher
│   │   └── sections/            ← HeroSection, FeaturedProducts, CategoriesGrid, etc.
│   ├── data/
│   │   ├── products.json        ← all product data (source of truth)
│   │   ├── categories.json      ← all categories
│   │   └── promos.json          ← promo codes
│   ├── features/
│   │   ├── products/            ← ProductCard, ProductGrid, ProductFilters, ProductDetail
│   │   ├── cart/                ← CartDrawer, CartItem, CartSummary
│   │   ├── checkout/            ← CheckoutForm, OrderSummary
│   │   └── admin/               ← Dashboard, ProductManager, OrderManager, PromoManager
│   ├── hooks/
│   │   ├── useProducts.ts       ← reads from src/data/products.json
│   │   ├── useCart.ts           ← cart actions wrapper
│   │   └── usePromo.ts          ← promo code validation
│   ├── lib/
│   │   ├── utils.ts             ← clsx/twMerge helper, formatPrice, formatDate
│   │   └── constants.ts         ← site name, currency, supported locales, WhatsApp number
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ShopPage.tsx
│   │   ├── ProductPage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       ├── DashboardPage.tsx
│   │       ├── ProductsAdminPage.tsx
│   │       └── PromosAdminPage.tsx
│   ├── routes/
│   │   ├── AppRouter.tsx        ← all routes defined here
│   │   └── ProtectedRoute.tsx   ← simple PIN-based protection for /admin
│   ├── store/
│   │   └── cartStore.ts         ← Zustand cart with localStorage persistence
│   ├── types/
│   │   └── index.ts             ← all TypeScript interfaces
│   ├── i18n/
│   │   └── config.ts
│   ├── App.tsx
│   └── main.tsx
├── .gitignore
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### 0.4 — TypeScript types (src/types/index.ts)

Define ALL types here before writing any component:

```typescript
export interface Product {
  id: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  description_ar: string;
  description_fr: string;
  description_en: string;
  price: number;
  original_price?: number;       // strikethrough price for promotions
  stock: number;
  images: string[];              // paths relative to /public or /src/assets
  category_id: string;
  brand: string;
  weight_grams?: number;
  flavors?: string[];
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  slug: string;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected_flavor?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_wilaya: string;
  items: CartItem[];
  total: number;
  promo_code?: string;
  discount?: number;
  notes?: string;
  created_at: string;
}

export interface Promo {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order?: number;
  expires_at?: string;
  is_active: boolean;
}

export type Locale = 'ar' | 'fr' | 'en';
export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'featured';
```

### 0.5 — Sample data files

Populate `src/data/products.json` with 6–8 placeholder products (whey, creatine, BCAA, pre-workout, multivitamins) so every page has something to render during development. Use placeholder image paths that point to a real image or a service like `https://placehold.co/600x600/111111/ffffff?text=Product`.

Populate `src/data/categories.json` with at least 5 categories: Protéines, Créatine, BCAA, Pre-Workout, Vitamines.

Populate `src/data/promos.json` with 2 sample promo codes for testing.

**CHECKPOINT 0:** Folder structure exists, all packages installed without errors, types file created, sample data files populated. Only then proceed to Phase 1.

---

## PHASE 1 — i18n & ROUTING FOUNDATION

### 1.1 — i18n configuration (src/i18n/config.ts)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    supportedLngs: ['ar', 'fr', 'en'],
    interpolation: { escapeValue: false },
    backend: { loadPath: '/locales/{{lng}}/translation.json' },
  });

export default i18n;
```

### 1.2 — RTL handling in App.tsx

```typescript
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return <AppRouter />;
}
```

### 1.3 — Routing (src/routes/AppRouter.tsx)

```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import HomePage from '../pages/HomePage';
import ShopPage from '../pages/ShopPage';
import ProductPage from '../pages/ProductPage';
import AboutPage from '../pages/AboutPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import AdminLayout from '../pages/admin/AdminLayout';
import DashboardPage from '../pages/admin/DashboardPage';
import ProductsAdminPage from '../pages/admin/ProductsAdminPage';
import PromosAdminPage from '../pages/admin/PromosAdminPage';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:productId" element={<ProductPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        {/* Admin — PIN protected */}
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsAdminPage />} />
          <Route path="promos" element={<PromosAdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### 1.4 — Admin PIN protection (src/routes/ProtectedRoute.tsx)

Since there is no backend auth in this phase, protect the admin with a simple PIN stored in an environment variable. The PIN is checked once and stored in `sessionStorage`.

```typescript
// If PIN not yet entered → show a PIN entry screen
// If PIN matches import.meta.env.VITE_ADMIN_PIN → grant access and store in sessionStorage
// If already in sessionStorage → grant access directly
```

Create `.env.local`:
```
VITE_ADMIN_PIN=your_chosen_pin
```

Add `.env.local` to `.gitignore`.

**CHECKPOINT 1:** App loads, all routes render without errors, language switcher changes direction for Arabic, admin PIN screen shows at /admin. Only then proceed to Phase 2.

---

## PHASE 2 — LAYOUT COMPONENTS

Build these once. Every page uses them.

### 2.1 — Navbar (src/components/layout/Navbar.tsx)

- Fixed at the top, `z-50`
- Background: `#000000` with a subtle bottom border `1px solid rgba(255,255,255,0.08)`
- Left: store logo or wordmark (bold white, Barlow Condensed)
- Center (desktop): navigation links — Home, Shop, About
- Right: language switcher + cart icon with item count badge (red)
- Mobile: hamburger menu → full-screen slide-down overlay with nav links
- Active link: red underline or red text

### 2.2 — Footer (src/components/layout/Footer.tsx)

- Background: `#0A0A0A`
- Top border: `1px solid rgba(255,255,255,0.08)`
- Three columns: Store info / Quick links / Contact & Social
- Bottom bar: copyright line
- Social icons: Instagram, Facebook, TikTok (Lucide or simple SVG)

### 2.3 — PageWrapper (src/components/layout/PageWrapper.tsx)

Wraps every page with Navbar + Footer + main content area. Handles top padding offset for the fixed navbar.

### 2.4 — LanguageSwitcher (src/components/layout/LanguageSwitcher.tsx)

- Three buttons: AR / FR / EN
- Active language: white text, red underline
- Inactive: gray text
- On click: calls `i18n.changeLanguage()`

**CHECKPOINT 2:** Navbar and Footer render correctly on all pages, language switcher works, hamburger menu works on mobile. Only then proceed to Phase 3.

---

## PHASE 3 — HOMEPAGE

Build sections in this exact order. Each section is a separate file in `src/components/sections/`.

### Design rules for all sections:
- Background: `#000000` or `#0A0A0A` alternating between sections for depth
- All text through `useTranslation()`
- GSAP ScrollTrigger for scroll-based reveals (fade up + slight Y offset)
- Framer Motion for entrance animations

---

### 3.1 — HeroSection

Full-viewport height. This is the most important section — it must be visually striking.

**Layout:**
- Left side: large heading + subheading + two CTAs
- Right side: product image (hero shot of a supplement tub or a strong athlete silhouette)
- Subtle film grain overlay via CSS SVG filter

**Heading:** Barlow Condensed 900, uppercase, very large (clamp 64px to 140px). White with the key word in red — for example: "REACH YOUR **LIMIT**"

**CTAs:**
- Primary: solid red button — "Shop Now"
- Secondary: outline white button — "Explore"

**Animations (Framer Motion):**
- Heading: enters from left, slight X offset, spring
- Subheading: enters from left, delayed
- CTAs: fade in, delayed further
- Product image: enters from right, spring physics

**Bottom:** small animated scroll-down arrow

---

### 3.2 — BrandsBar

Infinite horizontal ticker — brand names or logos of stocked supplements (Optimum Nutrition, MyProtein, Scitec, BioTech, etc.)

Background: `#0D0D0D`. Text: white/40 opacity. CSS `@keyframes` marquee animation, no JS needed.

---

### 3.3 — FeaturedProducts

- Section heading: "Best Sellers" / "Meilleures Ventes" / "الأكثر مبيعًا"
- Red decorative line under heading (thin, 40px wide, left-aligned)
- Load from `src/data/products.json` — filter `is_featured: true`
- Grid: 2 cols mobile, 4 cols desktop
- Each ProductCard (see Phase 4.3 for full spec)
- "View All" link to `/shop`

---

### 3.4 — CategoriesGrid

- Section heading: "Shop by Category"
- Grid of category tiles: 2 cols mobile, 3 cols desktop
- Each tile: dark background image + category name as large white overlay text
- On hover: red overlay tint + slight scale
- Click → `/shop?category=<slug>`

---

### 3.5 — WhyUsSection

4 feature blocks in a row (2×2 on mobile):
- Authentic Products — only genuine brands, no fakes
- Fast Delivery — all 58 wilayas
- Best Prices — competitive pricing guaranteed
- Expert Advice — guidance for your goals

Each block: red icon + white heading + gray description. No animations needed, clean layout.

---

### 3.6 — CTABanner

Full-width section, background: deep red `#8B0000` or `#CC0000`.
Large white headline. "Shop Now" white outline button. Simple, punchy, high contrast.

---

**CHECKPOINT 3:** All homepage sections render and are populated with data, scroll animations work, language switching updates all text, page is responsive on mobile. Only then proceed to Phase 4.

---

## PHASE 4 — SHOP PAGE (Catalog with Advanced Filters)

### 4.1 — Filter sidebar (src/features/products/ProductFilters.tsx)

All filters update URL search params simultaneously:
`/shop?category=whey&brand=optimum&minPrice=2000&maxPrice=8000&sort=price_asc`

Filters:
- **Search bar:** text input, searches product name in active language
- **Category:** checkbox list (from `src/data/categories.json`)
- **Brand:** checkbox list (extracted dynamically from products.json)
- **Price range:** dual-handle range slider (DZD), with min/max inputs
- **Sort:** dropdown — Newest / Price ↑ / Price ↓ / Featured

On mobile: filters panel is hidden behind a "Filters" button that opens a slide-in drawer from the left (or bottom on very small screens).

### 4.2 — ProductGrid (src/features/products/ProductGrid.tsx)

- Reads `src/data/products.json`, applies all active filters in memory
- Shows 12 products per page, pagination at the bottom
- Loading state: skeleton cards (CSS animated pulse, same dimensions as real card)
- Empty state: "No products found" + "Reset filters" link
- Results count: "Showing 12 of 48 products"

### 4.3 — ProductCard (src/features/products/ProductCard.tsx)

```
┌─────────────────────────┐
│  [Product Image]        │
│  [PROMO badge — red]    │  ← only if original_price exists
├─────────────────────────┤
│  Brand name  (gray)     │
│  Product Name (white)   │
│  ~~2,500 DA~~  3,200 DA │  ← strikethrough if original_price set
│  [Add to Cart ▶]        │  ← red button
└─────────────────────────┘
```

Behaviors:
- Entire card (except button) is a link to `/shop/:productId`
- "Add to Cart" adds to Zustand store without navigating away
- If product has flavors → clicking "Add to Cart" shows an inline flavor picker first (small dropdown or pill selector, no full modal needed)
- Hover: slight white border glow, image scales 1.04

**CHECKPOINT 4:** Shop page renders products, all filters work and update the URL, back button restores filter state, cart icon updates in Navbar. Only then proceed to Phase 5.

---

## PHASE 5 — PRODUCT DETAIL PAGE

Route: `/shop/:productId`

### Layout (desktop — two columns):

```
LEFT COLUMN (55%)                RIGHT COLUMN (45%)
──────────────────               ──────────────────
Main product image               Brand (gray, small)
                                 Product name (white, large, Barlow)
Thumbnail strip (scroll)         
                                 ~~Original price~~  Current price (red)
                                 Stock badge: IN STOCK / LOW STOCK / OUT
                                 
                                 Flavor selector (if applicable)
                                 Quantity stepper  [ − ] [ 2 ] [ + ]
                                 
                                 [Add to Cart]        ← full width, red
                                 [Order via WhatsApp] ← full width, white outline
                                 
                                 ─────────────────────
                                 Short description
                                 Key benefits (bullet list, red dot markers)
```

**WhatsApp button behavior:**
Opens `https://wa.me/213XXXXXXXXX?text=Bonjour, je veux commander: [Product Name] x[qty] - [Price] DA`
The phone number comes from `src/lib/constants.ts`.

**Mobile layout:** Image on top, full width. All info stacked below.

**Related products:** Section at bottom of page — 4 products from same category.

**CHECKPOINT 5:** Product page renders, image gallery works, flavor selector shows when applicable, Add to Cart updates cart, WhatsApp link generates correct message. Only then proceed to Phase 6.

---

## PHASE 6 — CART & CHECKOUT

### 6.1 — Cart store (src/store/cartStore.ts)

```typescript
// Zustand store with persist middleware (localStorage)
// 
// State:
//   items: CartItem[]
//   promoCode: string | null
//   discount: number
//
// Actions:
//   addItem(product, quantity, flavor?)
//   removeItem(productId)
//   updateQuantity(productId, qty)
//   clearCart()
//   applyPromo(code) → validates against src/data/promos.json
//   removePromo()
//
// Computed (selectors):
//   subtotal → sum of (item.product.price × item.quantity)
//   discountAmount → based on promo type
//   total → subtotal - discountAmount
//   itemCount → total quantity across all items
```

### 6.2 — CartPage

- List of all cart items with image, name, flavor, quantity stepper, remove button, line total
- Right sidebar: Order summary — subtotal, promo discount (if any), total in DZD
- Promo code input: text field + "Apply" button → reads from `src/data/promos.json`, validates expiry and min order
- "Continue Shopping" link + "Proceed to Checkout" CTA (red button)
- Empty cart state: centered message + "Go to Shop" button

### 6.3 — CheckoutPage

No payment gateway. Simple order form → WhatsApp redirect.

**Form fields (React Hook Form + Zod):**
- Full Name (required)
- Phone number (required, Algerian format — must start with 05, 06, or 07, 10 digits total)
- Wilaya (required — dropdown of all 58 Algerian wilayas)
- Delivery address (required)
- Notes (optional)
- Promo code (optional — if not already applied in cart)

**On submit:**
1. Validate form
2. Build WhatsApp message with all order details (customer name, items list, total, wilaya, address)
3. Open WhatsApp link in new tab
4. Show a success confirmation screen: "Your order has been sent! We will contact you shortly."
5. Clear cart

**CHECKPOINT 6:** Cart persists on page refresh, promo codes validate correctly, checkout form validates all fields, WhatsApp message generates correctly with all order details. Only then proceed to Phase 7.

---

## PHASE 7 — ABOUT / CONTACT PAGE

### 7.1 — About section
- Store story: why it was founded, commitment to authentic products
- Key stats: e.g. "500+ customers served", "30+ brands", "48h delivery"
- Visual: large full-bleed image or strong typographic layout

### 7.2 — Contact section
- Phone number (click to call on mobile)
- WhatsApp button
- Store location / address
- Simple contact form with: Name, Phone, Message → builds a WhatsApp message and opens it (same no-backend approach)
- Social media icons: Instagram, Facebook, TikTok

**CHECKPOINT 7:** Page renders in all 3 languages, contact form builds WhatsApp message correctly. Only then proceed to Phase 8.

---

## PHASE 8 — ADMIN DASHBOARD (PIN Protected)

> The admin dashboard reads and writes to the JSON files in `src/data/`. Since we have no backend, product edits update the local JSON via a download mechanism (the admin exports updated JSON), OR we implement a simple file-write mechanism if running locally via a Vite plugin or Express server.
>
> **Practical approach for Phase 1:** The admin dashboard is a visual UI that generates and downloads updated `products.json` and `promos.json` files. The store owner downloads the file and replaces it in the project, then redeploys. A real backend write capability is added in a future phase.

### 8.1 — AdminLayout

- Left sidebar: Dashboard / Products / Promos / Settings
- Top bar: "Admin Panel" label + logout button (clears PIN from sessionStorage)
- Outlet for nested routes
- Sidebar collapses on mobile

### 8.2 — DashboardPage

Overview stats (calculated from JSON data):
- Total products
- Active products
- Products low in stock (< 5 units) — highlighted in red
- Total active promo codes

Product table preview: top 5 featured products with their stock levels.

### 8.3 — ProductsAdminPage

**Table of all products:** Image thumbnail, Name (in active language), Category, Price, Stock, Status (Active/Inactive), Edit / Delete actions.

**Add / Edit Product modal:**
- Product name: Arabic, French, English (3 separate inputs)
- Description: Arabic, French, English (3 textareas)
- Price (DZD)
- Original price (DZD, optional — for showing strikethrough)
- Stock quantity
- Category (dropdown from categories.json)
- Brand
- Weight in grams (optional)
- Flavors (tag input — type a flavor and press Enter to add, click × to remove)
- Image URLs (text inputs, can add multiple — paste URL or relative path)
- Is Featured (toggle)
- Is Active (toggle)

On save: update the in-memory products array and offer a "Download products.json" button.

**Delete:** confirmation dialog before removing.

### 8.4 — PromosAdminPage

Table of all promos: Code, Type, Value, Min Order, Expiry, Active.

**Create / Edit promo:**
- Code (unique)
- Type: Percentage or Fixed Amount
- Value
- Minimum order (optional)
- Expiry date (optional)
- Active toggle

On save: update in-memory array + "Download promos.json" button.

**CHECKPOINT 8:** Admin dashboard accessible via PIN, all product and promo CRUD operations work, download JSON button exports correctly formatted files. Only then proceed to Phase 9.

---

## PHASE 9 — PERFORMANCE, SECURITY & POLISH

> Do not skip this phase.

### 9.1 — Performance

- [ ] All product images below the fold: `loading="lazy"` on `<img>` tags
- [ ] Use WebP format for all images where possible
- [ ] Code splitting: `React.lazy()` + `Suspense` on admin pages (admin JS must NOT load for regular visitors)
- [ ] Zustand cart uses `persist` middleware — cart survives page refresh
- [ ] `npm run build` must complete with zero TypeScript errors and zero warnings
- [ ] Add `<link rel="preconnect">` for Google Fonts in `index.html`

### 9.2 — Security

- [ ] Admin PIN is in `.env.local`, never hardcoded in source
- [ ] `.env.local` is in `.gitignore` — verify before any git push
- [ ] Admin PIN is stored in `sessionStorage` (not `localStorage`) — clears on tab close
- [ ] All form inputs validated with Zod before any action is taken
- [ ] No console.log statements in production build (`vite.config.ts` → `esbuild: { drop: ['console'] }`)

### 9.3 — SEO

- [ ] Each page has a unique `<title>` and `<meta name="description">`
- [ ] Product pages: title includes product name and price
- [ ] `public/robots.txt`: disallow `/admin`
- [ ] `<html lang="">` attribute updates with active language (handled in App.tsx)

### 9.4 — Accessibility

- [ ] Every button and icon has an `aria-label`
- [ ] All images have descriptive `alt` text (product name in active language)
- [ ] Keyboard navigation works for all modals and forms
- [ ] Color contrast of white text on black background: passes WCAG AA (already high contrast by default)
- [ ] Red accent on black background: verify contrast ratio meets AA for text use

### 9.5 — Mobile responsiveness

Test every page at these breakpoints:
- [ ] 375px — iPhone SE
- [ ] 390px — iPhone 14
- [ ] 768px — iPad portrait
- [ ] 1280px — desktop

Components to verify:
- [ ] Navbar: hamburger menu opens, links work, cart badge visible
- [ ] Shop filters: slide-in drawer, all controls usable on touch
- [ ] Product detail: stacked single-column layout, quantity stepper easy to tap
- [ ] Cart: full-width layout, quantity controls accessible
- [ ] Admin tables: horizontally scrollable on mobile

---

## PHASE 10 — DEPLOYMENT

> Documented here for reference. Execute after Phase 9 is complete.

**Hosting:** Vercel (free tier is sufficient for Phase 1)

Steps:
1. Push project to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variable `VITE_ADMIN_PIN` in Vercel project settings
4. Vercel auto-deploys on every push to `main`
5. Add custom domain in Vercel dashboard

---

## COMPONENT DESIGN SYSTEM

Apply these styles consistently across all components. These are the law — not suggestions.

### Color palette

```css
/* Base */
--color-bg:          #000000;   /* pure black — main page background */
--color-surface:     #0A0A0A;   /* slightly lifted surface */
--color-surface-2:   #111111;   /* cards, inputs, elevated elements */
--color-border:      rgba(255, 255, 255, 0.08); /* subtle dividers */
--color-border-hover: rgba(255, 255, 255, 0.18);

/* Text */
--color-text:        #FFFFFF;   /* primary text */
--color-text-muted:  #888888;   /* secondary text, labels, metadata */
--color-text-subtle: #444444;   /* placeholder text, disabled */

/* Accent — RED ONLY. No other accent colors. */
--color-red:         #E31B23;   /* primary red — CTAs, badges, highlights */
--color-red-dark:    #B01219;   /* hover state for red elements */
--color-red-dim:     rgba(227, 27, 35, 0.12); /* red tint for hover backgrounds */

/* Status */
--color-success:     #22C55E;   /* only for "in stock" / success states */
--color-warning:     #F59E0B;   /* only for "low stock" warnings */
```

**Rule:** The accent color is red and red only. No green, no cyan, no blue — anywhere on the site. The palette is black, white, and red.

### Typography

```css
/* Headings — aggressive, condensed, powerful */
font-family: 'Barlow Condensed', sans-serif;
font-weight: 900;
text-transform: uppercase;
letter-spacing: 0.02em;

/* Body — clean, readable */
font-family: 'Inter', sans-serif;
font-weight: 400;
line-height: 1.6;
```

Add to `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

### Button variants

```
Primary (CTA):   bg-[#E31B23] text-white font-semibold hover:bg-[#B01219] transition-colors
Outline:         border border-white text-white hover:bg-white/10 transition-colors
Ghost:           text-white/60 hover:text-white transition-colors
Danger/Delete:   bg-transparent border border-[#E31B23] text-[#E31B23] hover:bg-[#E31B23]/10
WhatsApp:        bg-[#25D366] text-white hover:bg-[#1da851] transition-colors
```

### Spacing scale

Use Tailwind defaults. Key values:
- Section padding: `py-20` (desktop), `py-12` (mobile)
- Container max-width: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Card padding: `p-4` or `p-6`
- Gap between grid items: `gap-4` (mobile), `gap-6` (desktop)

---

## TRANSLATION FILE STRUCTURE

Each `translation.json` follows this structure exactly. The French file is shown as the reference:

```json
{
  "nav": {
    "home": "Accueil",
    "shop": "Boutique",
    "about": "À propos",
    "cart": "Panier"
  },
  "hero": {
    "headline_line1": "ATTEIGNEZ",
    "headline_line2": "VOS LIMITES",
    "subheadline": "Suppléments authentiques, livrés dans toute l'Algérie",
    "cta_primary": "Commander maintenant",
    "cta_secondary": "Découvrir"
  },
  "shop": {
    "title": "Notre Boutique",
    "filters": "Filtres",
    "sort": "Trier par",
    "sort_newest": "Plus récent",
    "sort_price_asc": "Prix croissant",
    "sort_price_desc": "Prix décroissant",
    "sort_featured": "Vedettes",
    "no_results": "Aucun produit trouvé",
    "reset_filters": "Réinitialiser les filtres",
    "add_to_cart": "Ajouter au panier",
    "in_stock": "En stock",
    "low_stock": "Stock limité",
    "out_of_stock": "Rupture de stock",
    "results_count": "{{count}} produits trouvés"
  },
  "product": {
    "brand": "Marque",
    "quantity": "Quantité",
    "flavor": "Saveur",
    "weight": "Poids",
    "whatsapp_order": "Commander via WhatsApp",
    "related": "Produits similaires"
  },
  "cart": {
    "title": "Mon Panier",
    "empty": "Votre panier est vide",
    "go_shopping": "Voir la boutique",
    "subtotal": "Sous-total",
    "discount": "Réduction",
    "total": "Total",
    "checkout": "Finaliser la commande",
    "continue_shopping": "Continuer mes achats",
    "promo_placeholder": "Code promo",
    "apply_promo": "Appliquer",
    "promo_applied": "Code promo appliqué",
    "promo_invalid": "Code invalide ou expiré"
  },
  "checkout": {
    "title": "Finaliser la commande",
    "full_name": "Nom complet",
    "phone": "Numéro de téléphone",
    "wilaya": "Wilaya",
    "address": "Adresse de livraison",
    "notes": "Remarques (optionnel)",
    "submit": "Confirmer via WhatsApp",
    "success_title": "Commande envoyée !",
    "success_message": "Votre commande a été transmise. Nous vous contacterons bientôt."
  },
  "about": {
    "title": "À Propos de Nous",
    "subtitle": "Votre partenaire en nutrition sportive"
  },
  "admin": {
    "title": "Administration",
    "dashboard": "Tableau de bord",
    "products": "Produits",
    "promos": "Promotions",
    "logout": "Se déconnecter",
    "add_product": "Ajouter un produit",
    "edit": "Modifier",
    "delete": "Supprimer",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "download_json": "Télécharger le fichier JSON",
    "confirm_delete": "Confirmer la suppression ?"
  }
}
```

Replicate this structure in Arabic and English files with correct translations.

---

## RULES FOR THE AI BUILDING THIS PROJECT

1. **One phase at a time.** Fully complete and verify each phase before starting the next.
2. **No monolithic files.** Every component in its own file. No file exceeds 300 lines.
3. **No hardcoded user-facing text.** Everything goes through `useTranslation()`.
4. **No `any` in TypeScript.** Use only the types defined in `src/types/index.ts`.
5. **No direct DOM manipulation.** React state and refs only.
6. **All data reads go through custom hooks** in `src/hooks/` — components never import JSON directly.
7. **Error handling is mandatory.** Every operation that can fail must have an error state visible to the user.
8. **Mobile-first.** Write Tailwind classes mobile-first, `sm:` and `lg:` for larger breakpoints.
9. **Accessibility first.** Every button, input, and image must be keyboard-accessible and screen-reader friendly.
10. **The palette is black, white, and red.** If you are about to use any other accent color (green, blue, purple, orange, yellow), stop and use red instead.

---

*End of Master Build Prompt v2.0*
*Next phase after client approval: replace JSON data layer with Supabase backend, add admin image upload, add SMS/email order notifications.*
