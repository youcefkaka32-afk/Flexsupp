// Hero slide images — desktop + mobile pairs (numbered 1-5)
const desktop1 = '/images/desktopheroimagesnotmain (1).jpg'
const desktop2 = '/images/desktopheroimagesnotmain (2).jpg'
const desktop3 = '/images/desktopheroimagesnotmain (3).jpg'
const desktop4 = '/images/desktopheroimagesnotmain (4).jpg'
const desktop5 = '/images/desktopheroimagesnotmain (5).jpg'

const mobile1 = '/images/mobileheroimagesnotmain (1).png'
const mobile2 = '/images/mobileheroimagesnotmain (2).png'
const mobile3 = '/images/mobileheroimagesnotmain (3).png'
const mobile4 = '/images/mobileheroimagesnotmain (4).png'
const mobile5 = '/images/mobileheroimagesnotmain (5).png'

// Slide 0 keeps its own main hero image
const heroMainImage = '/images/HEROMAINIMAGElol.png'
const heroMainImageMobile = '/HEROIMAGEMOBILE.jpg'

// HERO SLIDES
export const slides = [
  {
    nav: 'accueil',
    title: 'PROTEIN',
    kicker: 'BUILD YOUR BODY',
    subtitle: 'Premium Whey Formula',
    cta: 'SHOP NOW',
    ctaHref: '/shop?category=protein',
    ctaProminent: true,
    goal: 'muscle',
    // Protein → very dominant red, white center, tiny orange
    background: 'radial-gradient(circle at 52% 42%, #ffffff 0%, #f97316 8%, #ef4444 38%, #b91c1c 72%, #7f1d1d 100%)',
    backgroundOverlay: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, transparent 38%)',
    backdrop: '',
    titleStyle: { top: '53%', left: '50%', align: 'center', width: 'auto' },
    titleSplit: { front: [0, 1, 2, 5, 6], back: [3, 4], outlines: [3, 4] },
    shoe: 'superfly',
    shoeStyle: {
      left: '50%', top: '50%', width: 'clamp(300px, 38vw, 620px)', height: 'clamp(320px, 52vh, 660px)',
      baseRotate: '0deg', scale: '1.9',
    },
  },
  {
    nav: 'accueil',
    title: 'VITAMINS',
    kicker: 'ELEVATE YOUR HEALTH',
    subtitle: 'Complete Multivitamin Complex',
    cta: 'SHOP NOW',
    ctaHref: '/shop?category=bcaa',
    ctaProminent: false,
    goal: 'energy',
    // Vitamins → cyan/light blue dominant left, orange right, white
    background: 'radial-gradient(circle at 35% 38%, #e0f7fa 0%, #22d3ee 22%, #67e8f9 42%, #f97316 68%, #270c02 100%)',
    backgroundOverlay: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, transparent 38%)',
    backdrop: '',
    titleStyle: { top: '53%', left: '50%', align: 'center', width: 'auto' },
    titleSplit: { front: [0, 1, 2, 5, 6, 7], back: [3, 4], outlines: [3, 4] },
    shoe: 'running',
    shoeStyle: {
      left: '50%', top: '50%', width: 'clamp(300px, 39vw, 630px)', height: 'clamp(320px, 53vh, 670px)',
      baseRotate: '0deg', scale: '1.4',
    },
  },
  {
    nav: 'accueil',
    title: 'MASSGAINER',
    kicker: 'BULK UP FASTER',
    subtitle: 'High-Calorie Mass Formula',
    cta: 'SHOP NOW',
    ctaHref: '/shop?category=protein',
    ctaProminent: false,
    goal: 'bulk',
    // Mass Gainer → very large purple bloom on left, then blue, white
    background: 'radial-gradient(circle at 36% 40%, #e9d5ff 0%, #c084fc 18%, #a855f7 38%, #6366f1 62%, #1d4ed8 82%, #090d22 100%)',
    backgroundOverlay: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, transparent 38%)',
    backdrop: '',
    titleStyle: { top: '53%', left: '50%', align: 'center', width: 'auto' },
    titleSplit: { front: [0, 1, 2, 3, 7, 8, 9], back: [4, 5, 6], outlines: [4, 5, 6] },
    shoe: 'sneakers',
    shoeStyle: {
      left: '50%', top: '50%', width: 'clamp(300px, 39vw, 630px)', height: 'clamp(320px, 53vh, 670px)',
      baseRotate: '0deg', scale: '1.4',
    },
  },
  {
    nav: 'accueil',
    title: 'CREATINE',
    kicker: 'UNLEASH YOUR POWER',
    subtitle: 'Pre-Workout & Creatine Stack',
    cta: 'SHOP NOW',
    ctaHref: '/shop?category=creatine',
    ctaProminent: false,
    goal: 'force',
    // Creatine → very large red bloom on right, green left, white
    background: 'radial-gradient(circle at 64% 40%, #ff6b6b 0%, #ef4444 22%, #dc2626 45%, #22c55e 70%, #052e16 100%)',
    backgroundOverlay: 'linear-gradient(to top, rgba(255, 255, 255, 1) 0%, transparent 38%)',
    backdrop: '',
    titleStyle: { top: '53%', left: '50%', align: 'center', width: 'auto' },
    titleSplit: { front: [0, 1, 2, 5, 6, 7], back: [3, 4], outlines: [3, 4] },
    shoe: 'extra',
    shoeStyle: {
      left: '50%', top: '50%', width: 'clamp(300px, 39vw, 630px)', height: 'clamp(320px, 53vh, 670px)',
      baseRotate: '0deg', scale: '2.2',
    },
  },
]

// SHOE IMAGE MAP
export const shoeMarkup = {
  superfly: { src: '/images/hero4.png', alt: 'Premium Whey Protein',          style: 'transform: translate(0%, 0%) scale(1.0);' },
  running:  { src: '/images/hero3.png', alt: 'Complete Multivitamin Complex',  style: 'transform: translate(0%, 0%) scale(1.0);' },
  sneakers: { src: '/images/hero1.png', alt: 'High-Calorie Mass Gainer',       style: 'transform: translate(0%, 0%) scale(1.0);' },
  extra:    { src: '/images/hero2.png', alt: 'Creatine & Pre-Workout Stack',   style: 'transform: translate(0%, 0%) scale(1.0);' },
}

// PRODUCT COLOR GRADIENTS (for hero-with-products)
export const productColorThemes = {
  protein: 'linear-gradient(135deg, #d4a574 0%, #f4e4c1 50%, #e8d4b0 100%)',  // Gold/tan
  creatine: 'linear-gradient(135deg, #8b4513 0%, #d2691e 50%, #cd853f 100%)',  // Brown
  bcaa: 'linear-gradient(135deg, #1e90ff 0%, #4169e1 50%, #6495ed 100%)',  // Blue
  preworkout: 'linear-gradient(135deg, #dc143c 0%, #ff1744 50%, #ff5252 100%)',  // Red
  sarms: 'linear-gradient(135deg, #374151 0%, #4b5563 50%, #1f2937 100%)',  // Dark grey/slate
  peptide: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #115e59 100%)',  // Teal
  'fat-burner': 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #c2410c 100%)',  // Orange
  multivitamins: 'linear-gradient(135deg, #84cc16 0%, #a3e635 50%, #65a30d 100%)',  // Lime green
}

// BRANDS / CATEGORIES / PRODUCTS
// These are now loaded at runtime from:
//   /public/data/products.json
//
// Use the useProductData() hook in components.
// This file only exports the hero/slide config
// that is needed before the JSON fetch completes.
