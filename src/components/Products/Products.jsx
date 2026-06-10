import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useTranslation } from 'react-i18next'
import { Meteors } from '../../registry/magicui/meteors'
import './Products.css'
import { useStoreData } from '../../hooks/useStoreData'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/utils'
import LazyImage from '../ui/LazyImage'

gsap.registerPlugin(ScrollTrigger)

export default function Products() {
  const sectionRef = useRef(null)
  const { data, loading } = useStoreData()
  const { dispatch, openDrawer } = useCart()
  const { t } = useTranslation()

  const SORT_OPTIONS = [
    { value: 'featured',    label: t('shop.sort.featured') },
    { value: 'az',          label: t('shop.sort.az') },
    { value: 'za',          label: t('shop.sort.za') },
    { value: 'price-asc',   label: t('shop.sort.priceAsc') },
    { value: 'price-desc',  label: t('shop.sort.priceDesc') },
    { value: 'best-seller', label: t('shop.sort.bestSeller') },
    { value: 'new',         label: t('shop.sort.new') },
  ]

  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedBrands, setSelectedBrands] = useState([])
  const [inStockOnly, setInStockOnly]       = useState(false)
  const [priceRange, setPriceRange]         = useState([0, 15000])
  const [sortBy, setSortBy]                 = useState('featured')
  const [sidebarOpen, setSidebarOpen]       = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const categories  = data?.categories ?? []
  const allProducts = data?.products   ?? []

  const [minPrice, maxPrice] = useMemo(() => {
    if (!allProducts.length) return [0, 15000]
    const prices = allProducts.map(p => p.price)
    return [Math.min(...prices), Math.max(...prices)]
  }, [allProducts])

  useEffect(() => {
    if (allProducts.length) setPriceRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const allBrands = useMemo(() => [...new Set(allProducts.map(p => p.brand))].sort(), [allProducts])

  const filtered = useMemo(() => {
    let list = [...allProducts]
    if (activeCategory !== 'all') list = list.filter(p => p.category === activeCategory)
    if (selectedBrands.length)    list = list.filter(p => selectedBrands.includes(p.brand))
    if (inStockOnly)              list = list.filter(p => p.inStock)
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    switch (sortBy) {
      case 'az':          list.sort((a, b) => a.name.localeCompare(b.name)); break
      case 'za':          list.sort((a, b) => b.name.localeCompare(a.name)); break
      case 'price-asc':   list.sort((a, b) => a.price - b.price); break
      case 'price-desc':  list.sort((a, b) => b.price - a.price); break
      case 'best-seller': list.sort((a, b) => (b.badge === 'BEST-SELLER' ? 1 : 0) - (a.badge === 'BEST-SELLER' ? 1 : 0)); break
      case 'new':         list.sort((a, b) => (b.badge === 'NOUVEAU' ? 1 : 0) - (a.badge === 'NOUVEAU' ? 1 : 0)); break
      default:            list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)); break
    }
    return list
  }, [allProducts, activeCategory, selectedBrands, inStockOnly, priceRange, sortBy])

  const activeFilterCount = [
    activeCategory !== 'all',
    selectedBrands.length > 0,
    inStockOnly,
    priceRange[0] > minPrice || priceRange[1] < maxPrice,
  ].filter(Boolean).length

  const resetFilters = () => {
    setActiveCategory('all')
    setSelectedBrands([])
    setInStockOnly(false)
    setPriceRange([minPrice, maxPrice])
    setSortBy('featured')
  }

  const toggleBrand = (brand) =>
    setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])

  useEffect(() => {
    const sec = sectionRef.current
    if (!sec || loading) return
    gsap.fromTo(
      sec.querySelectorAll('.boutique-header-banner h1'),
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out',
        scrollTrigger: { trigger: sec, start: 'top 85%', once: true } }
    )
  }, [loading])

  return (
    <section className="boutique-section" ref={sectionRef}>
      {/* Header */}
      <div className="boutique-header-banner">
        <div className="banner-bg-grid" />
        <Meteors number={30} color="rgba(227,27,35,0.85)" />
        <motion.h1
          className="banner-title font-display select-none"
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 0.95, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {t('shop.title')}
        </motion.h1>
        <div className="banner-accent-line" />
      </div>

      {/* Toolbar */}
      <div className="boutique-toolbar">
        <div className="boutique-toolbar__left">
          <button className="sidebar-toggle-btn" onClick={() => setSidebarOpen(s => !s)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
            </svg>
            {sidebarOpen ? t('shop.hideFilters') : t('shop.showFilters')}
            {activeFilterCount > 0 && <span className="filter-count-badge">{activeFilterCount}</span>}
          </button>
          <button className="mobile-filter-btn" onClick={() => setMobileFiltersOpen(true)}>
            {t('shop.filters')} {activeFilterCount > 0 && `(${activeFilterCount})`}
          </button>
          <span className="boutique-result-count">
            {loading ? '...' : `${filtered.length} ${filtered.length !== 1 ? t('shop.results_plural') : t('shop.results')}`}
          </span>
        </div>
        <div className="boutique-toolbar__right">
          <label className="sort-label">{t('shop.sortBy')}</label>
          <select className="sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      {/* Layout */}
      <div className={`boutique-layout ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              className="boutique-sidebar"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.28 }}
            >
              <SidebarContent
                categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory}
                allBrands={allBrands} selectedBrands={selectedBrands} toggleBrand={toggleBrand}
                inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                priceRange={priceRange} setPriceRange={setPriceRange}
                minPrice={minPrice} maxPrice={maxPrice}
                activeFilterCount={activeFilterCount} resetFilters={resetFilters}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="boutique-main">
          <motion.div layout className="boutique-product-grid">
            <AnimatePresence mode="popLayout">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                    <div key={`skeleton-${i}`} className="premium-product-card--skeleton" aria-hidden="true" />
                  ))
                : filtered.length === 0
                ? (
                    <motion.div className="boutique-no-results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="no-results">
                      <p>{t('shop.noResults')}</p>
                      <button className="btn primary" onClick={resetFilters}>{t('shop.resetBtn')}</button>
                    </motion.div>
                  )
                : filtered.map(product => (
                    <motion.div layout key={product.id}
                      initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <PremiumProductCard product={product} dispatch={dispatch} openDrawer={openDrawer} />
                    </motion.div>
                  ))
              }
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div className="mobile-filter-backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div className="mobile-filter-drawer"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
            >
              <div className="mobile-filter-header">
                <span className="font-display" style={{ fontSize: '1.4rem', letterSpacing: '0.1em' }}>{t('shop.filters').toUpperCase()}</span>
                <button className="mobile-filter-close" onClick={() => setMobileFiltersOpen(false)}>✕</button>
              </div>
              <div className="mobile-filter-body">
                <SidebarContent
                  categories={categories} activeCategory={activeCategory} setActiveCategory={setActiveCategory}
                  allBrands={allBrands} selectedBrands={selectedBrands} toggleBrand={toggleBrand}
                  inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
                  priceRange={priceRange} setPriceRange={setPriceRange}
                  minPrice={minPrice} maxPrice={maxPrice}
                  activeFilterCount={activeFilterCount} resetFilters={resetFilters}
                />
              </div>
              <div className="mobile-filter-footer">
                <button className="btn primary" style={{ width: '100%' }} onClick={() => setMobileFiltersOpen(false)}>
                  {t('shop.viewProducts')} {filtered.length} {filtered.length !== 1 ? t('shop.results_plural') : t('shop.results')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  )
}

// ── Sidebar ─────────────────────────────────────────────────────────────
function SidebarContent({
  categories, activeCategory, setActiveCategory,
  allBrands, selectedBrands, toggleBrand,
  inStockOnly, setInStockOnly,
  priceRange, setPriceRange, minPrice, maxPrice,
  activeFilterCount, resetFilters,
}) {
  const { t } = useTranslation()
  return (
    <div className="sidebar-inner">
      {activeFilterCount > 0 && (
        <button className="reset-filters-btn" onClick={resetFilters}>✕ {t('shop.reset')}</button>
      )}

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">{t('shop.productType')}</h3>
        <ul className="sidebar-list">
          <li>
            <button className={`sidebar-list-item ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
              <span>{t('shop.allProducts')}</span>
              <span className="sidebar-check">{activeCategory === 'all' && '✓'}</span>
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button className={`sidebar-list-item ${activeCategory === cat.id ? 'active' : ''}`} onClick={() => setActiveCategory(cat.id)}>
                <span>{cat.name}</span>
                <span className="sidebar-check">{activeCategory === cat.id && '✓'}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">{t('shop.availability')}</h3>
        <label className="sidebar-toggle-row">
          <span>{t('shop.inStockOnly')}</span>
          <div className={`toggle-switch ${inStockOnly ? 'on' : ''}`}
            onClick={() => setInStockOnly(v => !v)}
            role="switch" aria-checked={inStockOnly} tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && setInStockOnly(v => !v)}
          >
            <div className="toggle-thumb" />
          </div>
        </label>
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">{t('shop.budget')}</h3>
        <div className="price-range-display">
          <span>{priceRange[0].toLocaleString()} DA</span>
          <span>{priceRange[1].toLocaleString()} DA</span>
        </div>
        <PriceRangeSlider min={minPrice} max={maxPrice} value={priceRange} onChange={setPriceRange} />
      </div>

      <div className="sidebar-section">
        <h3 className="sidebar-section-title">{t('shop.brand')}</h3>
        <ul className="sidebar-list">
          {allBrands.map(brand => (
            <li key={brand}>
              <label className="sidebar-checkbox-row">
                <input type="checkbox" checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)} className="sidebar-checkbox" />
                <span>{brand}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── Price Slider ─────────────────────────────────────────────────────────
function PriceRangeSlider({ min, max, value, onChange }) {
  const trackRef = useRef(null)
  const getPercent = (val) => ((val - min) / (max - min)) * 100

  const handleMouseDown = (handle) => (e) => {
    e.preventDefault()
    const track = trackRef.current
    if (!track) return
    const move = (moveEvent) => {
      const rect   = track.getBoundingClientRect()
      const x      = (moveEvent.clientX ?? moveEvent.touches?.[0]?.clientX) - rect.left
      const ratio  = Math.min(Math.max(x / rect.width, 0), 1)
      const newVal = Math.round(min + ratio * (max - min))
      if (handle === 'min') onChange([Math.min(newVal, value[1] - 500), value[1]])
      else                  onChange([value[0], Math.max(newVal, value[0] + 500)])
    }
    const up = () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
    window.addEventListener('touchmove', move)
    window.addEventListener('touchend', up)
  }

  const leftPct  = getPercent(value[0])
  const rightPct = getPercent(value[1])

  return (
    <div className="price-slider-wrap">
      <div className="price-slider-track" ref={trackRef}>
        <div className="price-slider-fill" style={{ left: `${leftPct}%`, width: `${rightPct - leftPct}%` }} />
        <div className="price-slider-thumb" style={{ left: `${leftPct}%` }}
          onMouseDown={handleMouseDown('min')} onTouchStart={handleMouseDown('min')}
          role="slider" aria-valuemin={min} aria-valuemax={max} aria-valuenow={value[0]} tabIndex={0} />
        <div className="price-slider-thumb" style={{ left: `${rightPct}%` }}
          onMouseDown={handleMouseDown('max')} onTouchStart={handleMouseDown('max')}
          role="slider" aria-valuemin={min} aria-valuemax={max} aria-valuenow={value[1]} tabIndex={0} />
      </div>
    </div>
  )
}

// ── Product Card ─────────────────────────────────────────────────────────
function PremiumProductCard({ product, dispatch, openDrawer }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const price    = formatPrice(product.price, product.currency)
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null
  const [quickAddOpen,   setQuickAddOpen]   = useState(false)
  const [selectedFlavor, setSelectedFlavor] = useState(product.flavors[0])
  const [selectedSize,   setSelectedSize]   = useState(product.sizes[0] ?? '')
  const [quantity,       setQuantity]       = useState(1)

  useEffect(() => {
    setSelectedFlavor(product.flavors[0])
    setSelectedSize(product.sizes[0] ?? '')
    setQuantity(1)
  }, [product])

  const addToCart = (e) => {
    e.preventDefault(); e.stopPropagation()
    const itemId = `${product.id}-${selectedFlavor.name}-${selectedSize}`
    dispatch({ type: 'ADD', product: {
      id: itemId, name: product.name, brand: product.brand,
      price: product.price, currency: product.currency,
      image: product.image, flavor: selectedFlavor.name, size: selectedSize,
      quantity,
    }})
    openDrawer()
    setQuickAddOpen(false)
  }

  return (
    <>
      <article
        className="premium-product-card clickable"
        onClick={() => navigate(`/boutique/${product.id}`)}
        onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/boutique/${product.id}`)}
        tabIndex={0}
        aria-label={product.name}
      >
        <div className="card-image-wrap">
          <LazyImage src={product.image} alt={product.name} className="card-main-image" />
          {product.imageHover && <LazyImage className="card-hover-image" src={product.imageHover} alt="" />}
          {product.badge && <span className="card-badge font-display">{product.badge}</span>}
          {discount && <span className="card-discount font-display">-{discount}%</span>}
          {/* Zoom icon */}
          <div className="card-zoom-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <div className="card-quick-add-overlay">
            {product.inStock
              ? <button className="btn primary quick-add-btn-slide font-display" type="button"
                  onClick={e => { e.stopPropagation(); setQuickAddOpen(true) }}>
                  {t('shop.quickAdd')}
                </button>
              : <span className="btn quick-add-btn-slide btn--disabled font-display">{t('shop.outOfStock')}</span>
            }
          </div>
        </div>
        <div className="card-body">
          <div className="card-meta">
            <span className="card-brand text-red font-display">{product.brand.toUpperCase()}</span>
            {product.tags?.[0] && <span className="card-tag">{product.tags[0].toUpperCase()}</span>}
          </div>
          <h3 className="card-name font-display">{product.name}</h3>
          {product.flavors?.length > 0 && (
            <div className="card-swatches" aria-hidden>
              {product.flavors.slice(0, 4).map((f, i) => (
                <span key={i} className="card-swatch" title={f.name} style={{ background: f.color || '#ddd' }} />
              ))}
            </div>
          )}
          <div className="card-price font-display">
            {product.oldPrice && <span className="price-old-val">{formatPrice(product.oldPrice, product.currency)}</span>}
            <span className="price-current-val text-red">{price}</span>
          </div>
          {!product.inStock && <span className="card-out-of-stock">{t('shop.rupture')}</span>}
        </div>
      </article>

      <AnimatePresence>
        {quickAddOpen && (
          <QuickAddModal
            product={product} selectedFlavor={selectedFlavor} selectedSize={selectedSize} quantity={quantity}
            onClose={() => setQuickAddOpen(false)} onChangeFlavor={setSelectedFlavor}
            onChangeSize={setSelectedSize} onChangeQuantity={setQuantity} onAddToCart={addToCart}
          />
        )}
      </AnimatePresence>
    </>
  )
}

function QuickAddModal({ product, selectedFlavor, selectedSize, quantity, onClose, onChangeFlavor, onChangeSize, onChangeQuantity, onAddToCart }) {
  const { t } = useTranslation()
  return (
    <motion.div className="quick-add-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="quick-add-modal" initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }} transition={{ duration: 0.25 }} onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" type="button" onClick={onClose} aria-label="Close">×</button>
        <div className="quick-add-grid">
          <div className="quick-add-image-wrap">
            <img src={product.image} alt={product.name} />
          </div>
          <div className="quick-add-content">
            <span className="modal-brand-label">{product.brand}</span>
            <h2 className="modal-title font-display">{product.name}</h2>
            <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
              {product.inStock ? t('shop.inStock') : t('shop.rupture')}
            </span>
            <p className="modal-copy">{product.description}</p>
            <div className="modal-price-block">
              {product.oldPrice && <span className="modal-price-old">{formatPrice(product.oldPrice, product.currency)}</span>}
              <span className="modal-price-current text-red">{formatPrice(product.price, product.currency)}</span>
            </div>
            <div className="selector-group modal-selector">
              <span className="selector-label">{t('shop.flavor')}</span>
              <div className="flavor-inline-label">{selectedFlavor.name}</div>
              <div className="flavor-selector">
                {product.flavors.map(f => (
                  <button key={f.name} type="button" className={`flavor-circle ${selectedFlavor.name === f.name ? 'selected' : ''}`}
                    style={{ backgroundColor: f.color }} onClick={() => onChangeFlavor(f)}>
                    <span className="sr-only">{f.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="selector-group modal-selector">
              <span className="selector-label">{t('shop.size')}</span>
              <div className="size-selector">
                {product.sizes.map(s => (
                  <button key={s} type="button" className={`size-pill ${selectedSize === s ? 'active' : ''}`} onClick={() => onChangeSize(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="selector-group">
              <span className="selector-label">{t('shop.quantity')}</span>
              <div className="quantity-stepper">
                <button type="button" className="quantity-btn" onClick={() => onChangeQuantity(Math.max(1, quantity - 1))}>-</button>
                <span className="quantity-value">{quantity}</span>
                <button type="button" className="quantity-btn" onClick={() => onChangeQuantity(quantity + 1)}>+</button>
              </div>
            </div>
            <button className="btn primary modal-add-button" type="button" onClick={onAddToCart}>{t('shop.addToCart')}</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
