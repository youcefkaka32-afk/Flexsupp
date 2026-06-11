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
    title: '',
    subtitle: 'DECOUVRE LA LIGNE PHARE',
    cta: 'VOIR PLUS',
    ctaHref: '/shop',
    ctaProminent: true,
    goal: 'muscle',
    image: heroMainImage,
    imageMobile: heroMainImageMobile,
    titleStyle: { top: '54%', left: '50%', align: 'center', width: 'auto' },
    titleSplit: { front: [0, 1, 2, 3, 4, 5, 6, 7, 8], back: [], outlines: [] },
    shoe: 'superfly',
    shoeStyle: {
      left: '79%', top: '58%', width: 'clamp(240px, 27vw, 460px)', height: 'clamp(260px, 38vh, 500px)',
      baseRotate: '10deg', scale: '1.0',
    },
  },
  {
    nav: 'accueil',
    title: 'C4 SPORT',
    subtitle: 'BOOSTE TON RYTHME',
    cta: 'VOIR PLUS',
    ctaHref: '/shop',
    ctaProminent: false,
    goal: 'energy',
    image: desktop1,
    imageMobile: mobile1,
    titleStyle: { top: '54%', left: '50%', align: 'center', width: 'auto' },
    titleSplit: { front: [0, 1, 2, 3, 4, 5, 6, 7], back: [], outlines: [] },
    shoe: 'running',
    shoeStyle: {
      left: '78%', top: '57%', width: 'clamp(240px, 28vw, 470px)', height: 'clamp(260px, 39vh, 510px)',
      baseRotate: '12deg', scale: '1.0',
    },
  },
  {
    nav: 'accueil',
    title: 'EVL',
    subtitle: 'ENVERS LE MAXIMUM',
    infoSubHtml: '<span class="sub-mark">EVL</span> <span class="sub-italic">FAVORITES</span>',
    cta: 'VOIR PLUS',
    ctaHref: '/shop',
    ctaProminent: false,
    goal: 'energy',
    image: desktop2,
    imageMobile: mobile2,
    titleStyle: { top: '54%', left: '50%', align: 'center', width: 'auto' },
    titleSplit: { front: [0, 1, 2], back: [], outlines: [] },
    shoe: 'sneakers',
    shoeStyle: {
      left: '79%', top: '57%', width: 'clamp(240px, 28vw, 470px)', height: 'clamp(260px, 39vh, 510px)',
      baseRotate: '8deg', scale: '1.0',
    },
  },
  {
    nav: 'accueil',
    title: 'MASS',
    subtitle: 'LINE DRIVE. PURE DENSITY.',
    cta: 'VOIR PLUS',
    ctaHref: '/shop',
    ctaProminent: false,
    goal: 'muscle',
    image: desktop3,
    imageMobile: mobile3,
    titleStyle: { top: '54%', left: '50%', align: 'center', width: 'auto' },
    titleSplit: { front: [0, 1, 2, 3], back: [], outlines: [] },
    shoe: 'superfly',
    shoeStyle: {
      left: '79%', top: '57%', width: 'clamp(240px, 28vw, 470px)', height: 'clamp(260px, 39vh, 510px)',
      baseRotate: '12deg', scale: '1.0',
    },
  },
  {
    nav: 'accueil',
    title: 'NUTREX',
    subtitle: 'MONTE EN INTENSITE',
    cta: 'VOIR PLUS',
    ctaHref: '/shop',
    ctaProminent: false,
    goal: 'force',
    image: desktop4,
    imageMobile: mobile4,
    titleStyle: { top: '54%', left: '50%', align: 'center', width: 'auto' },
    titleSplit: { front: [0, 1, 2, 3, 4, 5], back: [], outlines: [] },
    shoe: 'running',
    shoeStyle: {
      left: '78%', top: '57%', width: 'clamp(240px, 28vw, 470px)', height: 'clamp(260px, 39vh, 510px)',
      baseRotate: '10deg', scale: '1.0',
    },
  },
]

// SHOE IMAGE MAP
export const shoeMarkup = {
  running:  { src: '/creatine_tub.svg',  alt: 'Creatine Mono',  style: 'transform: translate(0%, 2%) scale(0.8);' },
  superfly: { src: '/whey_tub.png',      alt: 'Whey Gold',      style: 'transform: translate(0%, 0%) scale(0.8);' },
  sneakers: { src: '/bcaa_tub.svg',      alt: 'BCAA Recovery',  style: 'transform: translate(0%, 2%) scale(0.8);' },
}

// BRANDS / CATEGORIES / PRODUCTS
// These are now loaded at runtime from:
//   /public/data/products.json
//
// Use the useProductData() hook in components.
// This file only exports the hero/slide config
// that is needed before the JSON fetch completes.
