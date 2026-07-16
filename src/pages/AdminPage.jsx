import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/admin.css'
import { supabase } from '../lib/supabase'
import AnalyticsTab from './AdminAnalyticsTab'

// Auth constants
const STORAGE_BUCKET = 'product-images'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

// ── Seed Data ────────────────────────────────────────────────
const SEED_CATEGORIES = [
  { id: 'protein', name: 'PROTÉINE', slug: 'protein', description: 'Protéines de haute qualité pour la récupération et la croissance musculaire', image: 'https://airzonedz.com/wp-content/uploads/2025/02/run.svg', href: '#productsSection' },
  { id: 'creatine', name: 'CRÉATINE', slug: 'creatine', description: 'Boostez votre force et vos performances explosives', image: 'https://airzonedz.com/wp-content/uploads/2025/02/2-800x800.png', href: '#productsSection' },
  { id: 'sarms', name: 'SARMS', slug: 'sarms', description: 'Modulateurs sélectifs des récepteurs aux androgènes pour l\'anabolisme ciblé', image: 'https://airzonedz.com/wp-content/uploads/2025/02/1-1-800x800.png', href: '#productsSection' },
  { id: 'peptide', name: 'PEPTIDES', slug: 'peptide', description: 'Peptides de qualité supérieure pour la vitalité, le soin et la réparation', image: 'https://airzonedz.com/wp-content/uploads/2025/02/1-1-800x800.png', href: '#productsSection' },
  { id: 'fat-burner', name: 'BRÛLEUR DE GRAISSE', slug: 'fat-burner', description: 'Brûleurs de graisse thermogéniques puissants pour la sèche', image: 'https://airzonedz.com/wp-content/uploads/2025/02/run.svg', href: '#productsSection' },
  { id: 'preworkout', name: 'PRÉ-WORKOUT', slug: 'preworkout', description: 'Énergie maximale et congestion avant l\'entraînement', image: 'https://airzonedz.com/wp-content/uploads/2025/02/run.svg', href: '#productsSection' },
  { id: 'multivitamins', name: 'MULTIVITAMINES', slug: 'multivitamins', description: 'Vitamines et minéraux essentiels pour la santé globale', image: 'https://airzonedz.com/wp-content/uploads/2025/02/run.svg', href: '#productsSection' },
]

const SEED_BRANDS = [
  { name: 'Nutrex Research', href: '#', logo: '' },
  { name: 'Applied Nutrition', href: '#', logo: '' },
  { name: 'Scitec Nutrition', href: '#', logo: '' },
  { name: 'OstroVit', href: '#', logo: '' },
  { name: 'BioTechUSA', href: '#', logo: '' },
  { name: 'TREC', href: '#', logo: '' },
  { name: 'Optimum Nutrition', href: '#', logo: '' },
  { name: 'Life Pro Nutrition', href: '#', logo: '' },
  { name: 'GOLDENBODY', href: '#', logo: '' },
  { name: 'Exploramus Invenimus', href: '#', logo: '' },
  { name: 'Mutant', href: '#', logo: '' },
  { name: 'Myvitamins', href: '#', logo: '' },
  { name: 'USN', href: '#', logo: '' },
  { name: 'Prozis', href: '#', logo: '' },
  { name: 'MyProtein', href: '#', logo: '' },
]

const SEED_PRODUCTS = [
  {
    id: 'lipo6-hers',
    name: 'LIPO6 HERS ULTRA CONCENTRATE',
    brand: 'Nutrex Research',
    category: 'fat-burner',
    tags: ['Brûleur', 'Femme', 'Minceur'],
    description: "Lipo6 within an all - there's a flame waiting to be kinders' to pooth of passion and heat that ignites our purpose and sent us on a path towards greatness in life... and beyond.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['60 Liqui-Caps'],
    price: 6500,
    old_price: 7500,
    currency: 'DA',
    in_stock: true,
    badge: 'NOUVEAU',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/lipo6-hers.png',
    image_hover: '/images/products/lipo6-hers.png',
    href: '#'
  },
  {
    id: 'shilajit',
    name: 'SHILAJIT HIMALAYAN HEALTH',
    brand: 'Applied Nutrition',
    category: 'peptide',
    tags: ['Santé', 'Vitalité', 'Minéraux'],
    description: "Shilajit de l'Himalaya pur, dosé à 30 000mg. Source naturelle riche en plus de 85 oligo-éléments et acide fulvique pour une vitalité optimale.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['90 Capsules'],
    price: 7800,
    old_price: 8800,
    currency: 'DA',
    in_stock: true,
    badge: 'PREMIUM',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/shilajit.png',
    image_hover: '/images/products/shilajit.png',
    href: '#'
  },
  {
    id: 'jumbo-hardcore',
    name: 'JUMBO HARDCORE',
    brand: 'Scitec Nutrition',
    category: 'protein',
    tags: ['Gainer', 'Masse', 'Force'],
    description: "Formule gainer de masse hardcore contenant 7 sources de glucides et un complexe protéiné multi-sources, sans lactose ni gluten. Idéal pour les hardgainers.",
    flavors: [{ name: 'Chocolat', color: '#3d1c02' }],
    sizes: ['5.35kg'],
    price: 14500,
    old_price: 16000,
    currency: 'DA',
    in_stock: true,
    badge: 'BEST-SELLER',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/jumbo-hardcore.png',
    image_hover: '/images/products/jumbo-hardcore.png',
    href: '#'
  },
  {
    id: 'tongkat-ali',
    name: 'TONGKAT ALI MALE PERFORMANCE',
    brand: 'Applied Nutrition',
    category: 'sarms',
    tags: ['Performance', 'Force', 'Testo'],
    description: "Tongkat Ali de dosage maximal 1000mg avec AstraGin. Soutient la performance masculine, la libido, la force et le développement musculaire.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['60 Capsules'],
    price: 8200,
    old_price: 9500,
    currency: 'DA',
    in_stock: true,
    badge: 'POPULAIRE',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/tongkat-ali.png',
    image_hover: '/images/products/tongkat-ali.png',
    href: '#'
  },
  {
    id: 'ostrovit-creatine-watermelon',
    name: 'CREATINE MONOHYDRATE (Pastèque)',
    brand: 'OstroVit',
    category: 'creatine',
    tags: ['Créatine', 'Force', 'Pastèque'],
    description: "Créatine monohydrate micronisée pure 200 Mesh au goût raféchissant de pastèque. Sans colorants ni sucres ajoutés.",
    flavors: [{ name: 'Pastèque', color: '#f49da6' }],
    sizes: ['300g'],
    price: 4200,
    old_price: 4900,
    currency: 'DA',
    in_stock: true,
    badge: 'PROMO',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/ostrovit-creatine-watermelon.png',
    image_hover: '/images/products/ostrovit-creatine-watermelon.png',
    href: '#'
  },
  {
    id: 'iso-whey-zero-black-strawberry',
    name: 'ISO WHEY ZERO BLACK (Fraise)',
    brand: 'BioTechUSA',
    category: 'protein',
    tags: ['Whey', 'Isolat', 'Fraise'],
    description: "Isolat de protéines de lactosérum de qualité anabolique avec 3g de créatine par portion, sans sucre ni gluten.",
    flavors: [{ name: 'Fraise', color: '#e8a0a0' }],
    sizes: ['2.27kg'],
    price: 12800,
    old_price: 14500,
    currency: 'DA',
    in_stock: true,
    badge: 'BEST-SELLER',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/iso-whey-zero-black-strawberry.png',
    image_hover: '/images/products/iso-whey-zero-black-strawberry.png',
    href: '#'
  },
  {
    id: 'lipo6-hardcore',
    name: 'LIPO6 HARDCORE MAXIMUM STRENGTH',
    brand: 'Nutrex Research',
    category: 'fat-burner',
    tags: ['Brûleur', 'Thermosect', 'Énergie'],
    description: "The path to greatness is often paved with sacrifice - which is why an many choose not to travel it. Brûleur de graisse thermogénique de force maximale.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['60 Capsules'],
    price: 6800,
    old_price: 7800,
    currency: 'DA',
    in_stock: true,
    badge: 'EXTRÊME',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/lipo6-hardcore.png',
    image_hover: '/images/products/lipo6-hardcore.png',
    href: '#'
  },
  {
    id: 'solid-mass',
    name: 'SOLID MASS PROTEIN DRINK',
    brand: 'TREC',
    category: 'protein',
    tags: ['Gainer', 'Masse', 'Glucides'],
    description: "Solid Mass est un gainer de masse à base de concentré de protéines de lactosérum et de glucides, enrichi en L-Glutamine.",
    flavors: [{ name: 'Chocolat', color: '#3d1c02' }],
    sizes: ['10kg'],
    price: 19500,
    old_price: 22000,
    currency: 'DA',
    in_stock: true,
    badge: 'NOUVEAU',
    featured: false,
    show_in_catalog: true,
    show_in_new: true,
    image: '/images/products/solid-mass.png',
    image_hover: '/images/products/solid-mass.png',
    href: '#'
  },
  {
    id: 'critical-mass-banana',
    name: 'CRITICAL MASS ORIGINAL (Banane)',
    brand: 'Applied Nutrition',
    category: 'protein',
    tags: ['Gainer', 'Banane', 'Calories'],
    description: "Critical Mass Original Formula est un gainer de masse hyper-calorique premium. Fournit 55g de protéines et 916 kcal par portion.",
    flavors: [{ name: 'Banane', color: '#d6c04a' }],
    sizes: ['6kg'],
    price: 15500,
    old_price: 17500,
    currency: 'DA',
    in_stock: true,
    badge: 'GÉANT',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/critical-mass-banana.png',
    image_hover: '/images/products/critical-mass-banana.png',
    href: '#'
  },
  {
    id: 'extreme-fat-burner',
    name: 'EXTREME FAT BURNER',
    brand: 'Exploramus Invenimus',
    category: 'fat-burner',
    tags: ['Brûleur', 'Carnitine', 'Thé Vert'],
    description: "Brûleur de graisse extrême formulé avec 1200mg de L-Tyrosine, 1000mg de L-Carnitine et 300mg d'extrait de Thé Vert. Goût pastèque.",
    flavors: [{ name: 'Pastèque', color: '#f49da6' }],
    sizes: ['300g'],
    price: 5900,
    old_price: 6800,
    currency: 'DA',
    in_stock: true,
    badge: 'INTENSE',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/extreme-fat-burner.png',
    image_hover: '/images/products/extreme-fat-burner.png',
    href: '#'
  },
  {
    id: 'opti-men',
    name: 'OPTI-MEN ACTIVE MULTIVITAMIN',
    brand: 'Optimum Nutrition',
    category: 'multivitamins',
    tags: ['Vitamines', 'Santé', 'Homme'],
    description: "Complément multivitaminé haut de gamme pour hommes actifs. Contient 36 ingrédients actifs pour soutenir le métabolisme et réduire la fatigue.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['90 Tablettes'],
    price: 5500,
    old_price: 6200,
    currency: 'DA',
    in_stock: true,
    badge: 'ESSENTIEL',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/opti-men.png',
    image_hover: '/images/products/opti-men.png',
    href: '#'
  },
  {
    id: 'life-pro-elektro',
    name: 'ELEKTRO INTENSE PRE-WORKOUT',
    brand: 'Life Pro Nutrition',
    category: 'preworkout',
    tags: ['Pre-Workout', 'Énergie', 'Cola'],
    description: "Pré-workout ultra-concentré avec 3g de Bêta-Alanine, 1.5g de Taurine et 200mg de Caféine anhydre. Formule instantanée.",
    flavors: [{ name: 'Bubble Cola', color: '#4a2c11' }],
    sizes: ['400g'],
    price: 7200,
    old_price: 8200,
    currency: 'DA',
    in_stock: true,
    badge: 'BOOST',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/life-pro-elektro.png',
    image_hover: '/images/products/life-pro-elektro.png',
    href: '#'
  },
  {
    id: 'citrulline-malate',
    name: 'CITRULLINE MALATE (Citron Vert)',
    brand: 'BioTechUSA',
    category: 'preworkout',
    tags: ['Citrulline', 'Pump', 'Performance'],
    description: "L-Citrulline Malate pure sans sucre ni gluten. Optimise la congestion musculaire, la circulation et la force.",
    flavors: [{ name: 'Citron Vert', color: '#b8d85a' }],
    sizes: ['300g'],
    price: 5200,
    old_price: 5900,
    currency: 'DA',
    in_stock: true,
    badge: 'PUMP',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/citrulline-malate.png',
    image_hover: '/images/products/citrulline-malate.png',
    href: '#'
  },
  {
    id: 'marine-collagen-mango',
    name: 'MARINE COLLAGEN (Mangue)',
    brand: 'GOLDENBODY',
    category: 'peptide',
    tags: ['Collagène', 'Soin', 'Articulations'],
    description: "Collagène marin hydrolysé de qualité supérieure pour le soin de la peau, des os et des articulations. Goût Mangue.",
    flavors: [{ name: 'Mangue', color: '#f4ab21' }],
    sizes: ['250g'],
    price: 6800,
    old_price: 7800,
    currency: 'DA',
    in_stock: true,
    badge: 'PEPTIDES',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/marine-collagen-mango.png',
    image_hover: '/images/products/marine-collagen-mango.png',
    href: '#'
  },
  {
    id: 'eaa-glutamine-mango',
    name: 'EAA + GLUTAMINE (Mangue)',
    brand: 'Scitec Nutrition',
    category: 'bcaa',
    tags: ['EAA', 'Acides Aminés', 'Récupération'],
    description: "Combinaison d'acides aminés essentiels (EAA) et de L-Glutamine avec 4000mg de BCAA par portion. Sans sucres ajoutés.",
    flavors: [{ name: 'Mangue', color: '#f4ab21' }],
    sizes: ['300g'],
    price: 6400,
    old_price: 7200,
    currency: 'DA',
    in_stock: true,
    badge: 'RECUP',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/eaa-glutamine-mango.png',
    image_hover: '/images/products/eaa-glutamine-mango.png',
    href: '#'
  },
  {
    id: 'muscle-pro',
    name: 'MUSCLE PRO PROTEIN',
    brand: 'Scitec Nutrition',
    category: 'protein',
    tags: ['Whey', 'Créatine', 'Muscle'],
    description: "Préparation protéinée de haute qualité enrichie en créatine et acides aminés pour stimuler le gain de force et de volume.",
    flavors: [{ name: 'Fraise', color: '#e8a0a0' }],
    sizes: ['2.5kg'],
    price: 11500,
    old_price: 13000,
    currency: 'DA',
    in_stock: true,
    badge: 'COMPLET',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/muscle-pro.png',
    image_hover: '/images/products/muscle-pro.png',
    href: '#'
  },
  {
    id: 'pure-whey-chocolate',
    name: 'PURE WHEY (Chocolat)',
    brand: 'GOLDENBODY',
    category: 'protein',
    tags: ['Whey', 'Chocolat', 'WPC'],
    description: "Complexe multi-protéines haut de gamme (WPC, WPI, WPH) enrichi en enzymes digestives pour une assimilation parfaite. Goût chocolat.",
    flavors: [{ name: 'Chocolat', color: '#3d1c02' }],
    sizes: ['1kg'],
    price: 7500,
    old_price: 8500,
    currency: 'DA',
    in_stock: true,
    badge: 'PROMO',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/pure-whey-chocolate.png',
    image_hover: '/images/products/pure-whey-chocolate.png',
    href: '#'
  },
  {
    id: 'body-fuel-preworkout',
    name: 'BODY FUEL PRE-WORKOUT',
    brand: 'Applied Nutrition',
    category: 'preworkout',
    tags: ['Pre-Workout', 'Énergie', 'Performance'],
    description: "Body Fuel Pre-Workout offre une performance optimisée avec un boost d'énergie et de focus intense. Formule explosive.",
    flavors: [{ name: 'Tropical', color: '#f6c866' }],
    sizes: ['300g'],
    price: 6900,
    old_price: 7800,
    currency: 'DA',
    in_stock: true,
    badge: 'NOUVEAU',
    featured: false,
    show_in_catalog: true,
    show_in_new: true,
    image: '/images/products/body-fuel-preworkout.png',
    image_hover: '/images/products/body-fuel-preworkout.png',
    href: '#'
  },
  {
    id: 'iso-whey-zero-black-mango',
    name: 'ISO WHEY ZERO BLACK (Mangue)',
    brand: 'BioTechUSA',
    category: 'protein',
    tags: ['Whey', 'Isolat', 'Mangue'],
    description: "Isolat de lactosérum sans créatine, sans sucre ni gluten. Formulé pour soutenir le maintien et le développement de la masse musculaire sèche.",
    flavors: [{ name: 'Mangue', color: '#f4ab21' }],
    sizes: ['900g'],
    price: 5800,
    old_price: 6500,
    currency: 'DA',
    in_stock: true,
    badge: 'LÉGER',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/iso-whey-zero-black-mango.png',
    image_hover: '/images/products/iso-whey-zero-black-mango.png',
    href: '#'
  },
  {
    id: 'yohimbine-liquid',
    name: 'YOHIMBINE LIQUIDE',
    brand: 'Exploramus Invenimus',
    category: 'sarms',
    tags: ['Sarms', 'Sèche', 'Graisses'],
    description: "Yohimbine liquide stérile de qualité pharmaceutique dosée à 750mg. Idéal pour cibler et éliminer les tissus adipeux les plus tenaces.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['180ml'],
    price: 4800,
    old_price: 5500,
    currency: 'DA',
    in_stock: true,
    badge: 'SÈCHE',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/yohimbine-liquid.png',
    image_hover: '/images/products/yohimbine-liquid.png',
    href: '#'
  },
  {
    id: 'lipo6-stim-free',
    name: 'LIPO6 STIM-FREE FAT LOSS',
    brand: 'Nutrex Research',
    category: 'fat-burner',
    tags: ['Brûleur', 'Sans Caféine', 'Sain'],
    description: "Every step you take on your journey is an opportunity. The road isn't always smooth - but it is through these challenges that we build a lasting legacy. Formule de perte de poids sans stimulants.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['60 Capsules'],
    price: 6200,
    old_price: 7200,
    currency: 'DA',
    in_stock: true,
    badge: 'SANS-STIM',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/lipo6-stim-free.png',
    image_hover: '/images/products/lipo6-stim-free.png',
    href: '#'
  },
  {
    id: 'applied-creatine-500g',
    name: 'CREATINE MONOHYDRATE MICRONIZED',
    brand: 'Applied Nutrition',
    category: 'creatine',
    tags: ['Créatine', 'Micronisée', 'Force'],
    description: "Poudre de créatine monohydrate micronisée pure à 100% avec le logo Informed Sport. Améliore la force et la puissance athlétique.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['500g'],
    price: 6500,
    old_price: 7500,
    currency: 'DA',
    in_stock: true,
    badge: 'QUALITÉ',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/applied-creatine-500g.png',
    image_hover: '/images/products/applied-creatine-500g.png',
    href: '#'
  },
  {
    id: 'trec-casein-protein',
    name: 'CASEIN PROTEIN (Chocolat)',
    brand: 'TREC',
    category: 'protein',
    tags: ['Caséine', 'Nuit', 'Récupération'],
    description: "Protéine de caséine micellaire de qualité supérieure pour une libération prolongée d'acides aminés pendant le sommeil. Goût Chocolat.",
    flavors: [{ name: 'Chocolat', color: '#3d1c02' }],
    sizes: ['1kg'],
    price: 8500,
    old_price: 9800,
    currency: 'DA',
    in_stock: true,
    badge: 'NUIT',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/trec-casein-protein.png',
    image_hover: '/images/products/trec-casein-protein.png',
    href: '#'
  },
  {
    id: 'radical-whey',
    name: 'RADICAL WHEY',
    brand: 'Scitec Nutrition',
    category: 'protein',
    tags: ['Whey', 'Cookies', 'Isolat'],
    description: "Combinaison optimale de concentré et d'isolat de whey protéine de qualité avec acides aminés ajoutés. Sans gluten ni huile de palme.",
    flavors: [{ name: 'Cookies & Cream', color: '#d0c0b2' }],
    sizes: ['2.27kg'],
    price: 11900,
    old_price: 13500,
    currency: 'DA',
    in_stock: true,
    badge: 'NOUVEAU',
    featured: false,
    show_in_catalog: true,
    show_in_new: true,
    image: '/images/products/radical-whey.png',
    image_hover: '/images/products/radical-whey.png',
    href: '#'
  },
  {
    id: 'ostrovit-creatine-white',
    name: 'CREATINE MONOHYDRATE (Blanc)',
    brand: 'OstroVit',
    category: 'creatine',
    tags: ['Créatine', 'Creapure', 'Force'],
    description: "Créatine monohydrate de très haute pureté optimisée avec Creapure pour des gains de force et de volume maximum.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['250g'],
    price: 3800,
    old_price: 4500,
    currency: 'DA',
    in_stock: true,
    badge: 'CREAPURE',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/ostrovit-creatine-white.png',
    image_hover: '/images/products/ostrovit-creatine-white.png',
    href: '#'
  },
  {
    id: 'hydro-whey-zero',
    name: 'HYDRO WHEY ZERO',
    brand: 'BioTechUSA',
    category: 'protein',
    tags: ['Whey', 'Hydrolysat', 'Isolat'],
    description: "Combinaison ultime d'hydrolysat et d'isolat de lactosérum à digestion ultra-rapide. Sans sucre, sans gluten et sans matières grasses.",
    flavors: [{ name: 'Chocolat', color: '#3d1c02' }],
    sizes: ['1.81kg'],
    price: 13500,
    old_price: 15000,
    currency: 'DA',
    in_stock: true,
    badge: 'HYDRO',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/hydro-whey-zero.png',
    image_hover: '/images/products/hydro-whey-zero.png',
    href: '#'
  },
  {
    id: 'iso-whey-platinum',
    name: 'ISO WHEY PLATINUM',
    brand: 'BioTechUSA',
    category: 'protein',
    tags: ['Whey', 'Créatine', 'Platinum'],
    description: "Mélange de whey protéine platinum enrichi en créatine et en L-Glutamine pour maximiser l'anabolisme musculaire.",
    flavors: [{ name: 'Chocolat', color: '#3d1c02' }],
    sizes: ['900g'],
    price: 7200,
    old_price: 8200,
    currency: 'DA',
    in_stock: true,
    badge: 'PLATINUM',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/iso-whey-platinum.png',
    image_hover: '/images/products/iso-whey-platinum.png',
    href: '#'
  },
  {
    id: 'scitec-100-whey-professional',
    name: '100% WHEY PROTEIN PROFESSIONAL',
    brand: 'Scitec Nutrition',
    category: 'protein',
    tags: ['Whey', 'Pistache', 'WPC'],
    description: "Boisson protéinée premium à base de concentré et d'isolat de whey protéine avec acides aminés ajoutés. Sans gluten.",
    flavors: [{ name: 'Pistache Chocolat Blanc', color: '#b2d3a8' }],
    sizes: ['2.35kg'],
    price: 12500,
    old_price: 14000,
    currency: 'DA',
    in_stock: true,
    badge: 'EXCLUSIF',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/scitec-100-whey-professional.png',
    image_hover: '/images/products/scitec-100-whey-professional.png',
    href: '#'
  },
  {
    id: 'mega-creatine',
    name: 'MEGA CREATINE (Creapure)',
    brand: 'BioTechUSA',
    category: 'creatine',
    tags: ['Créatine', 'Mega', 'Creapure'],
    description: "Créatine monohydrate de qualité Creapure dosée à 3400mg par jour pour augmenter la puissance musculaire lors d'efforts courts.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['306g'],
    price: 4900,
    old_price: 5500,
    currency: 'DA',
    in_stock: true,
    badge: 'CREAPURE',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/mega-creatine.png',
    image_hover: '/images/products/mega-creatine.png',
    href: '#'
  },
  {
    id: 'life-pro-creatine',
    name: 'CREATINE MONOHYDRATE Creapure',
    brand: 'Life Pro Nutrition',
    category: 'creatine',
    tags: ['Créatine', 'Creapure', 'Pure'],
    description: "Créatine 100% Creapure sans additifs, offrant une solubilité et une biodisponibilité optimales pour booster vos performances physiques.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['250g'],
    price: 4500,
    old_price: 5200,
    currency: 'DA',
    in_stock: true,
    badge: 'CREAPURE',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/life-pro-creatine.png',
    image_hover: '/images/products/life-pro-creatine.png',
    href: '#'
  },
  {
    id: 'mutant-mass',
    name: 'MUTANT MASS ORIGINAL',
    brand: 'Mutant',
    category: 'protein',
    tags: ['Gainer', 'Masse', 'Calories'],
    description: "Mutant Mass est le gainer de poids numéro 1 pour la construction musculaire. Riche en protéines de qualité et nutriments denses.",
    flavors: [{ name: 'Fraise Banane', color: '#ffd7d0' }],
    sizes: ['6.8kg'],
    price: 14900,
    old_price: 16500,
    currency: 'DA',
    in_stock: true,
    badge: 'POIDS-LOURD',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/mutant-mass.png',
    image_hover: '/images/products/mutant-mass.png',
    href: '#'
  },
  {
    id: 'essential-omega3',
    name: 'ESSENTIAL OMEGA-3',
    brand: 'Myvitamins',
    category: 'multivitamins',
    tags: ['Omega-3', 'Santé', 'Capsules'],
    description: "Acides gras essentiels oméga-3 EPA et DHA de première qualité pour soutenir la santé du cœur et des fonctions cérébrales.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['90 Softgels'],
    price: 3500,
    old_price: 4200,
    currency: 'DA',
    in_stock: true,
    badge: 'SANTÉ',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/essential-omega3.png',
    image_hover: '/images/products/essential-omega3.png',
    href: '#'
  },
  {
    id: 'usn-creapure-creatine',
    name: 'USN CREAPURE CREATINE',
    brand: 'USN',
    category: 'creatine',
    tags: ['Créatine', 'Creapure', 'Force'],
    description: "Créatine monohydrate 100% Creapure de marque USN. Conçue pour optimiser la force musculaire explosive et l'endurance.",
    flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }],
    sizes: ['170g'],
    price: 4200,
    old_price: 4900,
    currency: 'DA',
    in_stock: true,
    badge: 'CONGESTION',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/usn-creapure-creatine.png',
    image_hover: '/images/products/usn-creapure-creatine.png',
    href: '#'
  },
  {
    id: 'iso-whey-zero-salted-caramel',
    name: 'ISO WHEY ZERO (Caramel Salé)',
    brand: 'BioTechUSA',
    category: 'protein',
    tags: ['Whey', 'Isolat', 'Caramel'],
    description: "Isolat de protéines de lactosérum de qualité premium avec BCAA et L-Glutamine, goût exquis de caramel salé.",
    flavors: [{ name: 'Caramel Salé', color: '#d6a45c' }],
    sizes: ['2.27kg'],
    price: 12500,
    old_price: 14000,
    currency: 'DA',
    in_stock: true,
    badge: 'DELICIEUX',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/iso-whey-zero-salted-caramel.png',
    image_hover: '/images/products/iso-whey-zero-salted-caramel.png',
    href: '#'
  },
  {
    id: 'prozis-marine-collagen',
    name: 'PEPTAN MARINE COLLAGEN (Fruit des Bois)',
    brand: 'Prozis',
    category: 'peptide',
    tags: ['Collagène', 'Soin', 'Peau'],
    description: "Peptides de collagène marin hydrolysés de marque Peptan enrichis en magnésium et vitamine C. Goût fruit des bois.",
    flavors: [{ name: 'Fruit des bois', color: '#7d3d7b' }],
    sizes: ['200g'],
    price: 5200,
    old_price: 5900,
    currency: 'DA',
    in_stock: true,
    badge: 'PEPTIDES',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/prozis-marine-collagen.png',
    image_hover: '/images/products/prozis-marine-collagen.png',
    href: '#'
  },
  {
    id: 'myprotein-impact-whey',
    name: 'IMPACT WHEY PROTEIN',
    brand: 'MyProtein',
    category: 'protein',
    tags: ['Whey', 'Protéine', 'Muscle'],
    description: "Impact Whey Protein de Myprotein fournit 22g de protéines et 5g de BCAA par portion pour soutenir un mode de vie actif et le développement musculaire.",
    flavors: [{ name: 'Cookies & Cream', color: '#d0c0b2' }],
    sizes: ['1kg'],
    price: 7900,
    old_price: 8800,
    currency: 'DA',
    in_stock: true,
    badge: 'POPULAIRE',
    featured: false,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/myprotein-impact-whey.png',
    image_hover: '/images/products/myprotein-impact-whey.png',
    href: '#'
  },
  {
    id: 'life-pro-titan',
    name: 'TITAN GAINER',
    brand: 'Life Pro Nutrition',
    category: 'protein',
    tags: ['Gainer', 'Masse', 'Titan'],
    description: "Gainer de masse puissant Titan avec 100% de whey protéine. Sans aspartame, formulé pour un développement musculaire optimal.",
    flavors: [{ name: 'Chocolat', color: '#3d1c02' }],
    sizes: ['3kg'],
    price: 13900,
    old_price: 15500,
    currency: 'DA',
    in_stock: true,
    badge: 'MASSIVE',
    featured: true,
    show_in_catalog: true,
    show_in_new: false,
    image: '/images/products/life-pro-titan.png',
    image_hover: '/images/products/life-pro-titan.png',
    href: '#'
  }
]


const FLAVOR_COLORS = {
  'Chocolat': '#3d1c02', 'Vanille': '#f5e6c8', 'Fraise': '#e8a0a0',
  'Cookies & Cream': '#d0c0b2', 'Chocolat Noir': '#2b1308', 'Caramel Salé': '#d6a45c',
  'Citron': '#f4e34e', 'Pastèque': '#f49da6', 'Mangue': '#f4ab21',
  'Fruit de la Passion': '#f3be4e', 'Orange': '#f17b0f', 'Cerise': '#8c1d25',
  'Cerise Explosive': '#a12a2d', 'Tropical': '#f6c866', 'Fraise Kiwi': '#ffd7d0',
  'Non aromatisé': '#8f8f8f', 'Ananas': '#fbe38a', 'Citron Vert': '#b8d85a',
  'Raisin': '#7d3d7b', 'Banane': '#d6c04a',
}

// ── Image Upload Helper ──────────────────────────────────────
async function uploadImage(file, folder = 'products') {
  const ext = file.name.split('.').pop()
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(filename, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type,
  })
  if (error) throw error
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`
}

// ── ImageUploadField ─────────────────────────────────────────
function ImageUploadField({ label, value, onChange, folder = 'products' }) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(value || '')
  const inputRef = useRef(null)

  useEffect(() => { setPreview(value || '') }, [value])

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    // Local preview immediately
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)
    setUploading(true)
    try {
      const url = await uploadImage(file, folder)
      onChange(url)
      setPreview(url)
    } catch (err) {
      alert('Erreur upload: ' + err.message)
      setPreview(value || '')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="admin-img-field">
      <label className="admin-img-field__label">{label}</label>
      <div className="admin-img-field__row">
        {preview && (
          <div className="admin-img-field__preview">
            <img src={preview} alt="preview" onError={() => setPreview('')} />
            {uploading && <div className="admin-img-field__uploading"><span className="admin-spinner" /> Upload...</div>}
          </div>
        )}
        <div className="admin-img-field__controls">
          <button
            type="button"
            className="admin-btn admin-btn--upload"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? <><span className="admin-spinner" /> Envoi...</> : '📷 Choisir une photo'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
          <span className="admin-img-field__or">ou coller un lien</span>
          <input
            className="admin-input admin-img-field__url"
            type="text"
            value={value || ''}
            onChange={(e) => { onChange(e.target.value); setPreview(e.target.value) }}
            placeholder="https://... ou /images/..."
            disabled={uploading}
          />
        </div>
      </div>
    </div>
  )
}

// ── Toast ────────────────────────────────────────────────────
function Toast({ toasts }) {
  return (
    <div className="admin-toasts">
      {toasts.map((t) => (
        <div key={t.id} className={`admin-toast admin-toast--${t.type}`}>
          {t.type === 'success' ? '✓' : '✕'} {t.message}
        </div>
      ))}
    </div>
  )
}

function Spinner() { return <span className="admin-spinner" /> }

// ── Product Modal ────────────────────────────────────────────
function ProductModal({ product, brands, categories, onSave, onClose, saving }) {
  const isNew = !product
  const [form, setForm] = useState(() => {
    if (!product) return {
      id: '', name: '', brand: brands[0]?.name || '', category: categories[0]?.id || '',
      tags: '', description: '', flavors: '', sizes: '',
      price: '', old_price: '', currency: 'DA', in_stock: true,
      badge: '', featured: false, show_in_catalog: true, show_in_new: false,
      image: '', image_hover: '', href: '#',
    }
    return {
      id: product.id || '',
      name: product.name || '',
      brand: product.brand || brands[0]?.name || '',
      category: product.category || categories[0]?.id || '',
      tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
      description: product.description || '',
      flavors: Array.isArray(product.flavors) ? product.flavors.map(f => typeof f === 'object' ? f.name : f).join(', ') : '',
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
      price: product.price !== undefined ? String(product.price) : '',
      old_price: product.old_price != null ? String(product.old_price) : '',
      currency: product.currency || 'DA',
      in_stock: product.in_stock !== undefined ? product.in_stock : true,
      badge: product.badge || '',
      featured: product.featured || false,
      show_in_catalog: product.show_in_catalog !== false, // default true
      show_in_new: product.show_in_new || false,
      image: product.image || '',
      image_hover: product.image_hover || '',
      href: product.href || '#',
    }
  })

  function set(field, value) { setForm(p => ({ ...p, [field]: value })) }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal admin-modal--large" onClick={e => e.stopPropagation()}>
        <div className="admin-modal__header">
          <h3>{isNew ? '+ Nouveau produit' : '✎ Modifier le produit'}</h3>
          <button className="admin-modal__close" onClick={onClose} type="button">✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onSave(form, isNew) }} className="admin-form">
          <div className="admin-form__scroll">
            <div className="admin-form__grid">

              <div className="admin-form__field admin-form__field--full">
                <label>ID unique *</label>
                <input className="admin-input" value={form.id} onChange={e => set('id', e.target.value)} required placeholder="whey-gold-choc" />
              </div>

              <div className="admin-form__field">
                <label>Nom du produit *</label>
                <input className="admin-input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="WHEY PROTEIN" />
              </div>

              <div className="admin-form__field">
                <label>Marque *</label>
                {brands.length === 0 ? (
                  <div className="admin-input-warn">⚠ Aucune marque — allez dans l'onglet <strong>Marques</strong> pour en ajouter d'abord</div>
                ) : (
                  <select className="admin-input" value={form.brand} onChange={e => set('brand', e.target.value)} required>
                    {brands.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                  </select>
                )}
              </div>

              <div className="admin-form__field">
                <label>Catégorie *</label>
                {categories.length === 0 ? (
                  <div className="admin-input-warn">⚠ Aucune catégorie — allez dans l'onglet <strong>Catégories</strong> pour en ajouter d'abord</div>
                ) : (
                  <select className="admin-input" value={form.category} onChange={e => set('category', e.target.value)} required>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                )}
              </div>

              <div className="admin-form__field">
                <label>Prix (DA) *</label>
                <input className="admin-input" type="number" value={form.price} onChange={e => set('price', e.target.value)} required min="0" step="100" placeholder="8500" />
              </div>

              <div className="admin-form__field">
                <label>Ancien prix (promo)</label>
                <input className="admin-input" type="number" value={form.old_price} onChange={e => set('old_price', e.target.value)} min="0" step="100" placeholder="Vide = pas de promo" />
              </div>

              <div className="admin-form__field">
                <label>Badge</label>
                <input className="admin-input" value={form.badge} onChange={e => set('badge', e.target.value)} placeholder="PROMO / NOUVEAU / BEST-SELLER" />
              </div>

              <div className="admin-form__field">
                <label>Devise</label>
                <input className="admin-input" value={form.currency} onChange={e => set('currency', e.target.value)} placeholder="DA" />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label>Visibilité</label>
                <div className="admin-form__toggle-row">
                  <button type="button" className={`admin-toggle${form.in_stock ? ' active' : ''}`} onClick={() => set('in_stock', !form.in_stock)}>
                    {form.in_stock ? '✓ En stock' : '✕ Épuisé'}
                  </button>
                  <button type="button" className={`admin-toggle${form.show_in_catalog === true ? ' active admin-toggle--blue' : ''}`} onClick={() => set('show_in_catalog', !form.show_in_catalog)}>
                    {form.show_in_catalog === true ? '🏠 Accueil (Catalogue)' : '— Hors catalogue accueil'}
                  </button>
                  <button type="button" className={`admin-toggle${form.show_in_new ? ' active admin-toggle--green' : ''}`} onClick={() => set('show_in_new', !form.show_in_new)}>
                    {form.show_in_new ? '✨ Nouveaux produits' : '— Hors nouveaux produits'}
                  </button>
                </div>
                <div className="admin-visibility-hint">
                  <span className="admin-hint admin-hint--shop">🛒 Boutique</span> Tous les produits apparaissent sur la page boutique.
                  <br />
                  <span className="admin-hint admin-hint--home">🏠 Catalogue accueil</span> Apparaît dans <strong>"NOS COMPLÉMENTS SPORTIFS"</strong> sur la page d'accueil.
                  <br />
                  <span className="admin-hint admin-hint--new">✨ Nouveaux produits</span> Apparaît dans la section <strong>"NOUVEAUX PRODUITS"</strong> sur la page d'accueil.
                </div>
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label>Tags (séparés par virgules)</label>
                <input className="admin-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="Whey, Protéine, Muscle" />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label>Tailles (séparées par virgules)</label>
                <input className="admin-input" value={form.sizes} onChange={e => set('sizes', e.target.value)} placeholder="1kg, 2.27kg, 4.54kg" />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label>Saveurs (séparées par virgules)</label>
                <input className="admin-input" value={form.flavors} onChange={e => set('flavors', e.target.value)} placeholder="Chocolat, Vanille, Fraise" />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <label>Description</label>
                <textarea className="admin-input admin-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Description du produit..." rows={3} />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <ImageUploadField label="Image principale" value={form.image} onChange={v => set('image', v)} />
              </div>

              <div className="admin-form__field admin-form__field--full">
                <ImageUploadField label="Image au survol (hover)" value={form.image_hover} onChange={v => set('image_hover', v)} />
              </div>

            </div>
          </div>
          <div className="admin-modal__footer">
            <button type="button" className="admin-btn" onClick={onClose} disabled={saving}>Annuler</button>
            <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
              {saving ? <><Spinner /> Enregistrement...</> : isNew ? 'Créer le produit' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Main AdminPage ───────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate()
  const [authenticated, setAuthenticated] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('analytics')
  const [toasts, setToasts] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [orderCount, setOrderCount] = useState(0)
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setAuthenticated(true)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchAll = useCallback(async () => {
    setDataLoading(true)
    setDataError(null)
    try {
      const [{ data: p, error: pE }, { data: c, error: cE }, { data: b, error: bE }, { count: oC }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: true }),
        supabase.from('categories').select('*'),
        supabase.from('brands').select('*').order('name'),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
      ])
      if (pE) throw pE; if (cE) throw cE; if (bE) throw bE
      setProducts(p || []); setCategories(c || []); setBrands(b || [])
      setOrderCount(oC || 0)
    } catch (err) {
      setDataError(err.message || 'Erreur Supabase')
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => { if (authenticated) fetchAll() }, [authenticated, fetchAll])

  async function handleLoginSubmit(e) {
    e.preventDefault()
    setAuthLoading(true)
    setAuthError('')
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      setAuthenticated(true)
    } catch (err) {
      setAuthError(err.message || 'Identifiants incorrects')
    } finally {
      setAuthLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setAuthenticated(false)
    setEmail('')
    setPassword('')
  }

  function switchTab(tab) {
    setActiveTab(tab)
    setMenuOpen(false)
  }

  if (!authenticated) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <div className="admin-login__card">
            <div className="admin-login__logo">
              <span className="admin-login__logo-flex">FLEX</span>
              <span className="admin-login__logo-tag">ADMIN</span>
            </div>
            <p className="admin-login__sub">Connexion Administrateur</p>
            <form onSubmit={handleLoginSubmit}>
              <input
                type="email"
                className="admin-login__input-field"
                placeholder="Email admin"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
              />
              <input
                type="password"
                className="admin-login__input-field"
                placeholder="Mot de passe"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {authError && <p className="admin-login__error">{authError}</p>}
              <button type="submit" className="admin-login__btn" disabled={authLoading}>
                {authLoading ? 'Connexion en cours...' : 'Connexion'}
              </button>
            </form>
            <button className="admin-login__back" onClick={() => navigate('/')} disabled={authLoading}>← Retour au site</button>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'analytics', label: '📊 Analytiques' },
    { key: 'products',   label: `Produits (${products.length})` },
    { key: 'categories', label: `Catégories (${categories.length})` },
    { key: 'brands',     label: `Marques (${brands.length})` },
    { key: 'seed',       label: '🌱 Seed' },
  ]

  return (
    <div className="admin-page">
      <Toast toasts={toasts} />

      {/* Header */}
      <header className="admin-header">
        <div className="admin-header__left">
          <span className="admin-header__flex">FLEX</span>
          <span className="admin-header__tag">ADMIN</span>
        </div>
        <div className="admin-header__right">
          <button className="admin-btn admin-btn--icon" onClick={fetchAll} title="Actualiser">↻</button>
          <button className="admin-btn admin-btn--logout" onClick={handleLogout}>Déconnexion</button>
        </div>
      </header>

      {/* Stats */}
      <div className="admin-stats">
        <div className="admin-stat"><span className="admin-stat__val admin-stat__val--red">{orderCount}</span><span className="admin-stat__lbl">Commandes</span></div>
        <div className="admin-stat"><span className="admin-stat__val">{products.length}</span><span className="admin-stat__lbl">Produits</span></div>
        <div className="admin-stat"><span className="admin-stat__val admin-stat__val--green">{products.filter(p => p.in_stock).length}</span><span className="admin-stat__lbl">En stock</span></div>
        <div className="admin-stat"><span className="admin-stat__val admin-stat__val--red">{products.filter(p => !p.in_stock).length}</span><span className="admin-stat__lbl">Épuisés</span></div>
        <div className="admin-stat"><span className="admin-stat__val admin-stat__val--blue">{products.filter(p => p.show_in_catalog === true).length}</span><span className="admin-stat__lbl">Catalogue</span></div>
        <div className="admin-stat"><span className="admin-stat__val admin-stat__val--green">{products.filter(p => p.show_in_new === true).length}</span><span className="admin-stat__lbl">Nouveaux</span></div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {tabs.map(t => (
          <button key={t.key} className={`admin-tab${activeTab === t.key ? ' active' : ''}`} onClick={() => switchTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="admin-content">
        {dataLoading && <div className="admin-loading"><Spinner /> Chargement...</div>}
        {dataError && (
          <div className="admin-error">⚠ {dataError} <button className="admin-btn admin-btn--sm" onClick={fetchAll}>Réessayer</button></div>
        )}
        {!dataLoading && activeTab === 'analytics' && (
          <AnalyticsTab products={products} categories={categories} brands={brands} />
        )}
        {!dataLoading && activeTab === 'products' && (
          <ProductsTab products={products} categories={categories} brands={brands} onRefresh={fetchAll} addToast={addToast} />
        )}
        {!dataLoading && activeTab === 'categories' && (
          <CategoriesTab categories={categories} onRefresh={fetchAll} addToast={addToast} />
        )}
        {!dataLoading && activeTab === 'brands' && (
          <BrandsTab brands={brands} onRefresh={fetchAll} addToast={addToast} />
        )}
        {!dataLoading && activeTab === 'seed' && (
          <SeedTab addToast={addToast} onRefresh={fetchAll} />
        )}
      </div>
    </div>
  )
}

// ── Products Tab ─────────────────────────────────────────────
const CATALOG_MAX = 8
const NEW_MAX = 4

function ProductsTab({ products, categories, brands, onRefresh, addToast }) {
  const [modal, setModal] = useState(null) // null | 'add' | product object
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')

  // Live slot counts
  const catalogCount = products.filter(p => p.show_in_catalog === true).length
  const newCount     = products.filter(p => p.show_in_new === true).length

  const filtered = products.filter(p => {
    const q = search.toLowerCase()
    const matchSearch = !search || p.name?.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)
    const matchCat = filterCat === 'all' || p.category === filterCat
    return matchSearch && matchCat
  })

  async function handleSave(form, isNew) {
    // Guard: cap catalog slots
    const willBeInCatalog = form.show_in_catalog !== false
    const currentlyInCatalog = !isNew && products.find(p => p.id === form.id)?.show_in_catalog !== false
    if (willBeInCatalog && !currentlyInCatalog && catalogCount >= CATALOG_MAX) {
      addToast(`Maximum ${CATALOG_MAX} produits dans le catalogue. Retirez-en un d'abord.`, 'error')
      return
    }
    // Guard: cap new slots
    const willBeNew = form.show_in_new || false
    const currentlyNew = !isNew && (products.find(p => p.id === form.id)?.show_in_new || false)
    if (willBeNew && !currentlyNew && newCount >= NEW_MAX) {
      addToast(`Maximum ${NEW_MAX} produits dans "Nouveaux produits". Retirez-en un d'abord.`, 'error')
      return
    }

    setSaving(true)
    try {
      const flavorsArr = (form.flavors || '').split(',').map(s => s.trim()).filter(Boolean)
        .map(name => ({ name, color: FLAVOR_COLORS[name] ?? '#777777' }))
      const payload = {
        id: form.id.trim(),
        name: form.name,
        brand: form.brand,
        category: form.category,
        tags: (form.tags || '').split(',').map(s => s.trim()).filter(Boolean),
        description: form.description,
        flavors: flavorsArr,
        sizes: (form.sizes || '').split(',').map(s => s.trim()).filter(Boolean),
        price: parseFloat(form.price) || 0,
        old_price: form.old_price ? parseFloat(form.old_price) : null,
        currency: form.currency || 'DA',
        in_stock: form.in_stock,
        badge: form.badge || null,
        featured: form.featured,
        show_in_catalog: form.show_in_catalog !== false,
        show_in_new: form.show_in_new || false,
        image: form.image,
        image_hover: form.image_hover,
        href: form.href || '#',
        updated_at: new Date().toISOString(),
      }
      if (isNew) {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        addToast(`"${form.name}" créé !`)
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', form.id)
        if (error) throw error
        addToast(`"${form.name}" mis à jour`)
      }
      setModal(null)
      onRefresh()
    } catch (err) {
      addToast(err.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(p) {
    const warnings = []
    if (p.show_in_catalog !== false) warnings.push(`retiré du catalogue accueil (${catalogCount - 1}/${CATALOG_MAX} restants)`)
    if (p.show_in_new) warnings.push(`retiré des nouveaux produits (${newCount - 1}/${NEW_MAX} restants)`)
    const warningText = warnings.length > 0 ? `\n\n⚠ Ce produit sera ${warnings.join(' et ')}.` : ''
    if (!window.confirm(`Supprimer "${p.name}" ?${warningText}`)) return
    const { error } = await supabase.from('products').delete().eq('id', p.id)
    if (error) { addToast(error.message, 'error'); return }
    addToast(`"${p.name}" supprimé`)
    onRefresh()
  }

  async function quickToggle(p, field) {
    const newValue = !p[field]
    // Cap checks on quick-toggle
    if (field === 'show_in_catalog' && newValue && catalogCount >= CATALOG_MAX) {
      addToast(`Maximum ${CATALOG_MAX} produits dans le catalogue. Retirez-en un d'abord.`, 'error')
      return
    }
    if (field === 'show_in_new' && newValue && newCount >= NEW_MAX) {
      addToast(`Maximum ${NEW_MAX} produits dans "Nouveaux produits". Retirez-en un d'abord.`, 'error')
      return
    }
    // Warn on removal if dropping too low
    if (field === 'show_in_catalog' && !newValue && catalogCount <= 4) {
      if (!window.confirm(`Il ne restera que ${catalogCount - 1} produit(s) dans le catalogue. Continuer ?`)) return
    }
    if (field === 'show_in_new' && !newValue && newCount <= 2) {
      if (!window.confirm(`Il ne restera que ${newCount - 1} produit(s) dans "Nouveaux produits". Continuer ?`)) return
    }
    const { error } = await supabase.from('products').update({ [field]: newValue, updated_at: new Date().toISOString() }).eq('id', p.id)
    if (error) { addToast(error.message, 'error'); return }
    onRefresh()
  }

  return (
    <div className="admin-section">
      {modal && (
        <ProductModal
          product={modal === 'add' ? null : modal}
          brands={brands}
          categories={categories}
          onSave={handleSave}
          onClose={() => setModal(null)}
          saving={saving}
        />
      )}

      <div className="admin-section__header">
        <h2>Produits</h2>
        <button className="admin-btn admin-btn--primary" onClick={() => setModal('add')}>+ Ajouter</button>
      </div>

      {/* Slot counters */}
      <div className="admin-slot-counters">
        <div className={`admin-slot${catalogCount >= CATALOG_MAX ? ' admin-slot--full' : catalogCount <= 3 ? ' admin-slot--low' : ''}`}>
          <span className="admin-slot__icon">🏠</span>
          <span className="admin-slot__label">Catalogue accueil</span>
          <span className="admin-slot__count">{catalogCount} / {CATALOG_MAX}</span>
          <div className="admin-slot__bar">
            <div className="admin-slot__fill" style={{ width: `${Math.min(catalogCount / CATALOG_MAX * 100, 100)}%` }} />
          </div>
          {catalogCount >= CATALOG_MAX && <span className="admin-slot__tag full">PLEIN</span>}
          {catalogCount <= 3 && catalogCount > 0 && <span className="admin-slot__tag low">BAS</span>}
        </div>
        <div className={`admin-slot${newCount >= NEW_MAX ? ' admin-slot--full' : newCount <= 1 ? ' admin-slot--low' : ''}`}>
          <span className="admin-slot__icon">✨</span>
          <span className="admin-slot__label">Nouveaux produits</span>
          <span className="admin-slot__count">{newCount} / {NEW_MAX}</span>
          <div className="admin-slot__bar">
            <div className="admin-slot__fill" style={{ width: `${Math.min(newCount / NEW_MAX * 100, 100)}%` }} />
          </div>
          {newCount >= NEW_MAX && <span className="admin-slot__tag full">PLEIN</span>}
          {newCount <= 1 && newCount > 0 && <span className="admin-slot__tag low">BAS</span>}
        </div>
      </div>

      <div className="admin-visibility-banner">
        <div><span className="admin-hint admin-hint--shop">🛒 Boutique</span> Tous les produits apparaissent sur la page boutique.</div>
        <div><span className="admin-hint admin-hint--home">🏠 Catalogue</span> Max <strong>{CATALOG_MAX}</strong> produits dans "NOS COMPLÉMENTS SPORTIFS".</div>
        <div><span className="admin-hint admin-hint--new">✨ Nouveaux</span> Max <strong>{NEW_MAX}</strong> produits dans "NOUVEAUX PRODUITS".</div>
      </div>

      <div className="admin-filters">
        <input className="admin-input admin-filters__search" type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="admin-input admin-filters__cat" value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">Toutes catégories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">
          {products.length === 0
            ? <>Aucun produit. <button className="admin-btn admin-btn--primary admin-btn--sm" onClick={() => setModal('add')}>Ajouter le premier</button></>
            : 'Aucun résultat'}
        </div>
      ) : (
        <div className="admin-grid">
          {filtered.map(p => {
            const catName = categories.find(c => c.id === p.category)?.name || p.category
            const catalogFull = catalogCount >= CATALOG_MAX && p.show_in_catalog !== true
            const newFull = newCount >= NEW_MAX && !p.show_in_new
            return (
              <div key={p.id} className={`admin-card${!p.in_stock ? ' admin-card--out' : ''}`}>
                <div className="admin-card__img">
                  {p.image
                    ? <img src={p.image} alt={p.name} onError={e => e.target.style.display = 'none'} />
                    : <span className="admin-card__noimg">📦</span>}
                  {p.badge && <span className="admin-card__badge">{p.badge}</span>}
                </div>
                <div className="admin-card__body">
                  <p className="admin-card__brand">{p.brand}</p>
                  <h4 className="admin-card__name">{p.name}</h4>
                  <p className="admin-card__cat">{catName}</p>
                  <div className="admin-card__price">
                    <span>{Number(p.price).toLocaleString('fr-DZ')} {p.currency}</span>
                    {p.old_price && <span className="admin-card__price-old">{Number(p.old_price).toLocaleString('fr-DZ')}</span>}
                  </div>
                  <div className="admin-card__toggles">
                    <button className={`admin-toggle${p.in_stock ? ' active' : ''}`} onClick={() => quickToggle(p, 'in_stock')}>
                      {p.in_stock ? '✓ Stock' : '✕ Épuisé'}
                    </button>
                    <button
                      className={`admin-toggle${p.show_in_catalog === true ? ' active admin-toggle--blue' : ''}${catalogFull ? ' admin-toggle--disabled' : ''}`}
                      onClick={() => quickToggle(p, 'show_in_catalog')}
                      title={catalogFull ? `Maximum ${CATALOG_MAX} atteint` : ''}
                    >
                      {p.show_in_catalog === true ? '🏠 Catalogue' : `— Catalogue`}
                    </button>
                    <button
                      className={`admin-toggle${p.show_in_new ? ' active admin-toggle--green' : ''}${newFull ? ' admin-toggle--disabled' : ''}`}
                      onClick={() => quickToggle(p, 'show_in_new')}
                      title={newFull ? `Maximum ${NEW_MAX} atteint` : ''}
                    >
                      {p.show_in_new ? '✨ Nouveau' : '— Nouveau'}
                    </button>
                  </div>
                  <div className="admin-card__actions">
                    <button className="admin-btn admin-btn--sm" onClick={() => setModal(p)}>✎ Modifier</button>
                    <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(p)}>✕</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Categories Tab ───────────────────────────────────────────
function CategoriesTab({ categories, onRefresh, addToast }) {
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ id: '', name: '', slug: '', description: '', image: '', href: '#' })
  const [saving, setSaving] = useState(false)

  function openAdd() { setForm({ id: '', name: '', slug: '', description: '', image: '', href: '#' }); setModal('add') }
  function openEdit(c) { setForm({ ...c }); setModal('edit') }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'add') {
        const { error } = await supabase.from('categories').insert({ ...form })
        if (error) throw error
        addToast(`Catégorie "${form.name}" créée`)
      } else {
        const { error } = await supabase.from('categories').update({ name: form.name, slug: form.slug, description: form.description, image: form.image, href: form.href }).eq('id', form.id)
        if (error) throw error
        addToast(`Catégorie "${form.name}" mise à jour`)
      }
      setModal(null)
      onRefresh()
    } catch (err) { addToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete(c) {
    if (!window.confirm(`Supprimer "${c.name}" ?`)) return
    const { error } = await supabase.from('categories').delete().eq('id', c.id)
    if (error) { addToast(error.message, 'error'); return }
    addToast(`"${c.name}" supprimée`)
    onRefresh()
  }

  return (
    <div className="admin-section">
      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{modal === 'add' ? '+ Nouvelle catégorie' : '✎ Modifier'}</h3>
              <button className="admin-modal__close" onClick={() => setModal(null)} type="button">✕</button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form__scroll">
                <div className="admin-form__grid">
                  <div className="admin-form__field admin-form__field--full">
                    <label>ID *</label>
                    <input className="admin-input" value={form.id} onChange={e => setForm(p => ({ ...p, id: e.target.value }))} required disabled={modal === 'edit'} placeholder="whey" />
                  </div>
                  <div className="admin-form__field">
                    <label>Nom *</label>
                    <input className="admin-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="WHEY" />
                  </div>
                  <div className="admin-form__field">
                    <label>Slug</label>
                    <input className="admin-input" value={form.slug || ''} onChange={e => setForm(p => ({ ...p, slug: e.target.value }))} placeholder="whey" />
                  </div>
                  <div className="admin-form__field admin-form__field--full">
                    <label>Description</label>
                    <input className="admin-input" value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
                  </div>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn" onClick={() => setModal(null)}>Annuler</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? <><Spinner /> ...</> : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-section__header">
        <h2>Catégories</h2>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Ajouter</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>ID</th><th>Nom</th><th>Slug</th><th>Actions</th></tr></thead>
          <tbody>
            {categories.length === 0 && <tr><td colSpan={4} className="admin-table__empty">Aucune catégorie</td></tr>}
            {categories.map(c => (
              <tr key={c.id}>
                <td><code className="admin-code">{c.id}</code></td>
                <td><strong>{c.name}</strong></td>
                <td className="admin-muted">{c.slug}</td>
                <td className="admin-table__actions">
                  <button className="admin-btn admin-btn--sm" onClick={() => openEdit(c)}>✎</button>
                  <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(c)}>✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Brands Tab ───────────────────────────────────────────────
function BrandsTab({ brands, onRefresh, addToast }) {
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ name: '', logo: '', href: '#' })
  const [saving, setSaving] = useState(false)

  function openAdd() { setForm({ name: '', logo: '', href: '#' }); setModal('add') }
  function openEdit(b) { setForm({ ...b }); setModal('edit') }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (modal === 'add') {
        const { error } = await supabase.from('brands').insert({ name: form.name, logo: form.logo, href: form.href })
        if (error) throw error
        addToast(`Marque "${form.name}" créée`)
      } else {
        const { error } = await supabase.from('brands').update({ name: form.name, logo: form.logo, href: form.href }).eq('id', form.id)
        if (error) throw error
        addToast(`Marque "${form.name}" mise à jour`)
      }
      setModal(null)
      onRefresh()
    } catch (err) { addToast(err.message, 'error') }
    finally { setSaving(false) }
  }

  async function handleDelete(b) {
    if (!window.confirm(`Supprimer "${b.name}" ?`)) return
    const { error } = await supabase.from('brands').delete().eq('id', b.id)
    if (error) { addToast(error.message, 'error'); return }
    addToast(`"${b.name}" supprimée`)
    onRefresh()
  }

  return (
    <div className="admin-section">
      {modal && (
        <div className="admin-modal-overlay" onClick={() => setModal(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{modal === 'add' ? '+ Nouvelle marque' : '✎ Modifier'}</h3>
              <button className="admin-modal__close" onClick={() => setModal(null)} type="button">✕</button>
            </div>
            <form onSubmit={handleSave} className="admin-form">
              <div className="admin-form__scroll">
                <div className="admin-form__grid">
                  <div className="admin-form__field admin-form__field--full">
                    <label>Nom *</label>
                    <input className="admin-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="Optimum Nutrition" />
                  </div>
                  <div className="admin-form__field admin-form__field--full">
                    <ImageUploadField label="Logo de la marque" value={form.logo} onChange={v => setForm(p => ({ ...p, logo: v }))} folder="brands" />
                  </div>
                </div>
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="admin-btn" onClick={() => setModal(null)}>Annuler</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? <><Spinner /> ...</> : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-section__header">
        <h2>Marques</h2>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Ajouter</button>
      </div>

      <div className="admin-brands-grid">
        {brands.length === 0 && <div className="admin-empty">Aucune marque</div>}
        {brands.map(b => (
          <div key={b.id} className="admin-brand-card">
            <div className="admin-brand-card__logo">
              {b.logo
                ? <img src={b.logo} alt={b.name} onError={e => e.target.style.display = 'none'} />
                : <span>🏷</span>}
            </div>
            <p className="admin-brand-card__name">{b.name}</p>
            <div className="admin-brand-card__actions">
              <button className="admin-btn admin-btn--sm" onClick={() => openEdit(b)}>✎</button>
              <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(b)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Seed Tab ─────────────────────────────────────────────────
function SeedTab({ addToast, onRefresh }) {
  const [seeding, setSeeding] = useState(false)
  const [log, setLog] = useState([])
  const [done, setDone] = useState(false)

  function appendLog(msg) { setLog(p => [...p, msg]) }

  async function handleSeed() {
    if (!window.confirm('Insérer les données de démo ? Les données existantes avec les mêmes IDs seront écrasées.')) return
    setSeeding(true); setDone(false); setLog([])
    try {
      appendLog('Insertion des catégories...')
      const { error: cE } = await supabase.from('categories').upsert(SEED_CATEGORIES, { onConflict: 'id' })
      if (cE) throw new Error('Catégories: ' + cE.message)
      appendLog(`✓ ${SEED_CATEGORIES.length} catégories insérées`)

      appendLog('Insertion des marques...')
      const { error: bE } = await supabase.from('brands').upsert(
        SEED_BRANDS.map(b => ({ name: b.name, logo: b.logo, href: b.href })), { onConflict: 'name' }
      )
      if (bE) throw new Error('Marques: ' + bE.message)
      appendLog(`✓ ${SEED_BRANDS.length} marques insérées`)

      appendLog('Insertion des produits...')
      const { error: pE } = await supabase.from('products').upsert(SEED_PRODUCTS, { onConflict: 'id' })
      if (pE) throw new Error('Produits: ' + pE.message)
      appendLog(`✓ ${SEED_PRODUCTS.length} produits insérés`)

      appendLog('✓ Terminé !')
      addToast('Base de données initialisée avec les données de démo')
      setDone(true)
      onRefresh()
    } catch (err) {
      appendLog('✕ Erreur : ' + err.message)
      addToast(err.message, 'error')
    } finally { setSeeding(false) }
  }

  return (
    <div className="admin-section">
      <div className="admin-section__header"><h2>Initialisation des données</h2></div>
      <div className="admin-seed">
        <div className="admin-seed__warning">
          <strong>⚠ Avant de continuer</strong>
          <p>Exécutez d'abord le fichier <code>supabase/schema.sql</code> dans l'éditeur SQL de Supabase pour créer les tables. Ensuite, cliquez sur le bouton ci-dessous pour insérer les données de démo.</p>
        </div>
        <div className="admin-seed__counts">
          <div><span>{SEED_CATEGORIES.length}</span>Catégories</div>
          <div><span>{SEED_BRANDS.length}</span>Marques</div>
          <div><span>{SEED_PRODUCTS.length}</span>Produits</div>
        </div>
        <button className="admin-btn admin-btn--primary admin-btn--lg" onClick={handleSeed} disabled={seeding}>
          {seeding ? <><Spinner /> Insertion...</> : done ? '✓ Relancer le seed' : '🌱 Initialiser la base de données'}
        </button>
        {log.length > 0 && (
          <div className="admin-seed__log">
            {log.map((line, i) => (
              <div key={i} className={line.startsWith('✓') ? 'ok' : line.startsWith('✕') ? 'err' : ''}>{line}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
