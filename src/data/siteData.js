const heroMainImage = '/images/HEROMAINIMAGElol.png'
const heroMainImageMobile = '/HEROIMAGEMOBILE.jpg'
const c4Image = '/images/c4_desktop_70e66224-52c0-46d5-b5a9-86620b340202.jpg'
const evlImage = '/images/evl_desktop_0b65638c-50ae-47d4-9f34-47bf6d136326.jpg'
const massImage = '/images/mass_desktop.jpg'
const nutrexImage = '/images/nutrex_desktop_4cf46f31-4a8d-4ace-a1c8-9abc2010b7ca.jpg'

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
    image: c4Image,
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
    image: evlImage,
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
    image: massImage,
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
    image: nutrexImage,
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
//
// To edit products, categories or brands:
//   -> open public/data/products.json
