import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/admin.css'
import { supabase } from '../lib/supabase'

const ADMIN_PIN = '1234'
const SESSION_KEY = 'flexsupps_admin_session'
const STORAGE_BUCKET = 'product-images'
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

// ── Seed Data ────────────────────────────────────────────────
const SEED_CATEGORIES = [
  { id: 'whey', name: 'WHEY', slug: 'whey', description: 'Protéines de haute qualité pour la récupération musculaire', image: '', href: '#productsSection' },
  { id: 'creatine', name: 'CRÉATINE', slug: 'creatine', description: 'Boostez votre force et vos performances explosives', image: '', href: '#productsSection' },
  { id: 'bcaa', name: 'BCAA', slug: 'bcaa', description: "Acides aminés essentiels pour la récupération et l'endurance", image: '', href: '#productsSection' },
  { id: 'preworkout', name: 'PRÉ-WORKOUT', slug: 'preworkout', description: "Énergie maximale avant l'entraînement", image: '', href: '#productsSection' },
]

const SEED_BRANDS = [
  { name: 'Optimum Nutrition', href: '#', logo: '/images/optimum-nutrition.png' },
  { name: 'MyProtein', href: '#', logo: '/images/myprotein.png' },
  { name: 'Scitec Nutrition', href: '#', logo: '/images/scitec-nutrition.png' },
  { name: 'BioTechUSA', href: '#', logo: '/images/biotechusa.png' },
  { name: 'BSN', href: '#', logo: '/images/bsn.png' },
  { name: 'MuscleTech', href: '#', logo: '/images/muscletech.png' },
  { name: 'Cellucor', href: '#', logo: '/images/cellucor.png' },
  { name: 'Dymatize', href: '#', logo: '/images/dymatize.png' },
  { name: 'REDCON1', href: '#', logo: '/images/redcon1.png' },
  { name: 'Mutant', href: '#', logo: '/images/mutant.png' },
]

const SEED_PRODUCTS = [
  // ── WHEY ──
  { id: 'whey-gold-chocolate', name: 'WHEY PROTEIN CONCENTRATE', brand: 'Optimum Nutrition', category: 'whey', tags: ['Whey', 'Protéine', 'Muscle'], description: 'La whey protéine de référence mondiale. Formule ultra-filtrée avec 24g de protéines par portion.', flavors: [{ name: 'Chocolat', color: '#3d1c02' }, { name: 'Vanille', color: '#f5e6c8' }, { name: 'Fraise', color: '#e8a0a0' }, { name: 'Cookies & Cream', color: '#d0c0b2' }], sizes: ['1kg', '2.27kg', '4.54kg'], price: 8500, old_price: 9800, currency: 'DA', in_stock: true, badge: 'PROMO', featured: true, show_in_catalog: true, show_in_new: false, image: '/images/whey-protein-concentrate.jpg', image_hover: '/images/chocolate-peanut-butter.jpg', href: '#' },
  { id: 'whey-iso-vanilla', name: 'WHEY ISOLAT', brand: 'MyProtein', category: 'whey', tags: ['Whey', 'Isolat', 'Lean'], description: 'Isolat de whey ultra-pur, faible en glucides et en lipides. Idéal pour la définition musculaire.', flavors: [{ name: 'Vanille', color: '#f5e6c8' }, { name: 'Chocolat Noir', color: '#2b1308' }, { name: 'Caramel Salé', color: '#d6a45c' }], sizes: ['1kg', '2.5kg'], price: 9200, old_price: null, currency: 'DA', in_stock: true, badge: 'NOUVEAU', featured: false, show_in_catalog: true, show_in_new: true, image: '/images/cinnamon-bun-protein.jpg', image_hover: '/images/chocolate-peanut-butter.jpg', href: '#' },
  { id: 'marine-collagen', name: 'MARINE COLLAGEN', brand: 'MyProtein', category: 'whey', tags: ['Collagène', 'Récupération', 'Articulations'], description: 'Collagène marin hydrolysé de haute qualité. Soutient la récupération articulaire et la santé de la peau.', flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }, { name: 'Citron', color: '#f4e34e' }], sizes: ['450g'], price: 7800, old_price: null, currency: 'DA', in_stock: true, badge: 'NOUVEAU', featured: true, show_in_catalog: true, show_in_new: true, image: '/images/marine-collagen.jpg', image_hover: '/images/marine-collagen.jpg', href: '#' },
  { id: 'ultra-gainer', name: 'ULTRA GAINER', brand: 'Scitec Nutrition', category: 'whey', tags: ['Gainer', 'Masse', 'Muscle'], description: 'Mass gainer premium pour une prise de masse rapide. Riche en glucides et protéines.', flavors: [{ name: 'Fraise', color: '#e8a0a0' }, { name: 'Chocolat', color: '#3d1c02' }, { name: 'Vanille', color: '#f5e6c8' }], sizes: ['2.5kg', '5kg'], price: 11200, old_price: 13500, currency: 'DA', in_stock: true, badge: 'PROMO', featured: false, show_in_catalog: true, show_in_new: false, image: '/images/ultra-gainer.jpg', image_hover: '/images/ultra-gainer.jpg', href: '#' },
  // ── CREATINE ──
  { id: 'creatine-mono-unflavored', name: 'CRÉATINE MONO', brand: 'Scitec Nutrition', category: 'creatine', tags: ['Créatine', 'Force', 'Volume'], description: 'Créatine monohydrate micronisée pure. Augmente la force, la puissance et la masse musculaire.', flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }], sizes: ['300g', '500g', '1kg'], price: 6200, old_price: null, currency: 'DA', in_stock: true, badge: null, featured: false, show_in_catalog: true, show_in_new: false, image: '/images/creatine-creapure.jpg', image_hover: '/images/creatine-creapure.jpg', href: '#' },
  { id: 'creatine-hcl-cherry', name: 'CRÉATINE HCL', brand: 'MuscleTech', category: 'creatine', tags: ['Créatine', 'HCL', 'Force'], description: "Créatine HCL à absorption rapide. Pas de phase de charge nécessaire, sans rétention d'eau.", flavors: [{ name: 'Cerise', color: '#8c1d25' }, { name: 'Citron', color: '#f4e34e' }, { name: 'Pastèque', color: '#f49da6' }], sizes: ['200g', '400g'], price: 7400, old_price: 8200, currency: 'DA', in_stock: true, badge: 'PROMO', featured: true, show_in_catalog: true, show_in_new: false, image: '/images/creatine-hcl.jpg', image_hover: '/images/creatine-creapure.jpg', href: '#' },
  { id: 'creatine-creapure', name: 'CREATINE CREAPURE', brand: 'BioTechUSA', category: 'creatine', tags: ['Créatine', 'Creapure', 'Force'], description: 'Créatine Creapure certifiée, la plus pure du marché. Performance et force maximales.', flavors: [{ name: 'Non aromatisé', color: '#8f8f8f' }], sizes: ['300g'], price: 6800, old_price: null, currency: 'DA', in_stock: true, badge: 'NOUVEAU', featured: false, show_in_catalog: true, show_in_new: true, image: '/images/CREATINE [Creapure] (300G).jpg', image_hover: '/images/CREATINE [Creapure] (300G).jpg', href: '#' },
  // ── BCAA ──
  { id: 'bcaa-recovery-watermelon', name: 'BCAA RECOVERY', brand: 'Scitec Nutrition', category: 'bcaa', tags: ['BCAA', 'Récupération', 'Endurance'], description: 'Complexe BCAA 2:1:1 avec L-Glutamine et électrolytes. Récupération accélérée et réduction des courbatures.', flavors: [{ name: 'Pastèque', color: '#f49da6' }, { name: 'Mangue', color: '#f4ab21' }, { name: 'Fruit de la Passion', color: '#f3be4e' }, { name: 'Orange', color: '#f17b0f' }], sizes: ['300g', '600g', '1.2kg'], price: 7200, old_price: 8400, currency: 'DA', in_stock: true, badge: 'PROMO', featured: true, show_in_catalog: true, show_in_new: false, image: '/images/bcaa-recovery.jpg', image_hover: '/images/bcaa-essential.jpg', href: '#' },
  { id: 'bcaa-essential-mango', name: 'BCAA ESSENTIAL', brand: 'BioTechUSA', category: 'bcaa', tags: ['BCAA', 'Acides Aminés', 'Performance'], description: "Formule BCAA enrichie en vitamine B6 pour une meilleure assimilation des acides aminés.", flavors: [{ name: 'Mangue', color: '#f4ab21' }, { name: 'Ananas', color: '#fbe38a' }, { name: 'Framboise', color: '#e8a0a0' }], sizes: ['250g', '500g'], price: 5800, old_price: null, currency: 'DA', in_stock: false, badge: 'ÉPUISÉ', featured: false, show_in_catalog: false, show_in_new: false, image: '/images/bcaa-essential.jpg', image_hover: '/images/bcaa-recovery.jpg', href: '#' },
  { id: 'bcaa-xtend', name: 'BCAA XTEND', brand: 'Cellucor', category: 'bcaa', tags: ['BCAA', 'Récupération', 'Hydratation'], description: 'BCAA avec électrolytes et L-Glutamine pour une récupération et une hydratation optimales.', flavors: [{ name: 'Pastèque', color: '#f49da6' }, { name: 'Citron Vert', color: '#b8d85a' }], sizes: ['375g', '750g'], price: 6900, old_price: 7800, currency: 'DA', in_stock: true, badge: 'PROMO', featured: false, show_in_catalog: true, show_in_new: false, image: '/images/bcaa-recovery.jpg', image_hover: '/images/bcaa-essential.jpg', href: '#' },
  // ── PRE-WORKOUT ──
  { id: 'preworkout-extreme-cherry', name: 'PRE-WORKOUT X', brand: 'Cellucor', category: 'preworkout', tags: ['Pré-Workout', 'Énergie', 'Focus'], description: 'Formule explosive pré-entraînement avec caféine, beta-alanine et L-citrulline. Énergie maximale garantie.', flavors: [{ name: 'Cerise Explosive', color: '#a12a2d' }, { name: 'Citron Vert', color: '#b8d85a' }, { name: 'Raisin', color: '#7d3d7b' }], sizes: ['300g', '600g'], price: 8900, old_price: 10500, currency: 'DA', in_stock: true, badge: 'BEST-SELLER', featured: true, show_in_catalog: true, show_in_new: false, image: '/images/eliminate-preworkout.jpg', image_hover: '/images/eliminate-preworkout.jpg', href: '#' },
  { id: 'preworkout-pump-tropical', name: 'PUMP FORMULA', brand: 'Optimum Nutrition', category: 'preworkout', tags: ['Pré-Workout', 'Pump', 'Sans Caféine'], description: "Formule pump sans stimulants à base de L-citrulline et d'agmatine. Pour des veines apparentes.", flavors: [{ name: 'Tropical', color: '#f6c866' }, { name: 'Fraise Kiwi', color: '#ffd7d0' }], sizes: ['400g'], price: 9600, old_price: null, currency: 'DA', in_stock: true, badge: 'NOUVEAU', featured: false, show_in_catalog: true, show_in_new: true, image: '/images/ultra-gainer.jpg', image_hover: '/images/ultra-gainer.jpg', href: '#' },
  { id: 'eliminate-thermogenic', name: 'ELIMINATE THERMOGENIC', brand: 'Dymatize', category: 'preworkout', tags: ['Pré-Workout', 'Fat Burner', 'Énergie'], description: 'Brûleur de graisse thermogénique avec caféine et extraits naturels. Énergie et définition musculaire.', flavors: [{ name: 'Cerise Explosive', color: '#a12a2d' }, { name: 'Citron Vert', color: '#b8d85a' }], sizes: ['300g'], price: 7600, old_price: 9000, currency: 'DA', in_stock: true, badge: 'PROMO', featured: true, show_in_catalog: true, show_in_new: false, image: '/images/EliminateThermogenicFatBurner.jpg', image_hover: '/images/EliminateThermogenicFatBurner.jpg', href: '#' },
  { id: 'c4-sport-preworkout', name: 'C4 SPORT PRE-WORKOUT', brand: 'Cellucor', category: 'preworkout', tags: ['Pré-Workout', 'Énergie', 'Endurance'], description: 'Le pré-workout C4 Sport, testé et certifié pour les athlètes. Énergie explosive et endurance décuplée.', flavors: [{ name: 'Pastèque', color: '#f49da6' }, { name: 'Orange', color: '#f17b0f' }, { name: 'Citron Vert', color: '#b8d85a' }], sizes: ['195g', '390g'], price: 8200, old_price: null, currency: 'DA', in_stock: true, badge: 'NOUVEAU', featured: false, show_in_catalog: true, show_in_new: false, image: '/images/eliminate-preworkout.jpg', image_hover: '/images/eliminate-preworkout.jpg', href: '#' },
  { id: 'chocolate-pb-shake', name: 'CHOCOLATE PEANUT BUTTER SHAKE', brand: 'Optimum Nutrition', category: 'whey', tags: ['Whey', 'Protéine', 'Goût'], description: 'Le shake protéiné au goût irrésistible de chocolat beurre de cacahuète. 25g de protéines par portion.', flavors: [{ name: 'Chocolat', color: '#3d1c02' }, { name: 'Beurre de Cacahuète', color: '#d6a45c' }], sizes: ['1kg', '2kg'], price: 9400, old_price: 10800, currency: 'DA', in_stock: true, badge: 'PROMO', featured: true, show_in_catalog: true, show_in_new: false, image: '/images/ChocolatePeanutButterProteinShake.jpg', image_hover: '/images/ChocolatePeanutButterProteinShake.jpg', href: '#' },
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
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [activeTab, setActiveTab] = useState('products')
  const [toasts, setToasts] = useState([])
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [dataError, setDataError] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'authenticated') setAuthenticated(true)
  }, [])

  const fetchAll = useCallback(async () => {
    setDataLoading(true)
    setDataError(null)
    try {
      const [{ data: p, error: pE }, { data: c, error: cE }, { data: b, error: bE }] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: true }),
        supabase.from('categories').select('*'),
        supabase.from('brands').select('*').order('name'),
      ])
      if (pE) throw pE; if (cE) throw cE; if (bE) throw bE
      setProducts(p || []); setCategories(c || []); setBrands(b || [])
    } catch (err) {
      setDataError(err.message || 'Erreur Supabase')
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => { if (authenticated) fetchAll() }, [authenticated, fetchAll])

  function handlePinSubmit(e) {
    e.preventDefault()
    if (pin === ADMIN_PIN) {
      setAuthenticated(true)
      sessionStorage.setItem(SESSION_KEY, 'authenticated')
      setPinError('')
    } else {
      setPinError('Code PIN incorrect')
      setPin('')
    }
  }

  function handleLogout() {
    setAuthenticated(false)
    sessionStorage.removeItem(SESSION_KEY)
    setPin('')
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
            <p className="admin-login__sub">Entrez votre code PIN</p>
            <form onSubmit={handlePinSubmit}>
              <input type="password" className="admin-login__input" placeholder="••••" value={pin}
                onChange={e => setPin(e.target.value)} autoFocus maxLength={6} />
              {pinError && <p className="admin-login__error">{pinError}</p>}
              <button type="submit" className="admin-login__btn">Connexion</button>
            </form>
            <button className="admin-login__back" onClick={() => navigate('/')}>← Retour au site</button>
          </div>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: 'products', label: `Produits (${products.length})` },
    { key: 'categories', label: `Catégories (${categories.length})` },
    { key: 'brands', label: `Marques (${brands.length})` },
    { key: 'seed', label: '🌱 Seed' },
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
