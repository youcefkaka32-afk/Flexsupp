import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStoreData } from '../../hooks/useStoreData'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/utils'
import LazyImage from '../ui/LazyImage'
import './TabbedCatalog.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function TabbedCatalog() {
  const { data, loading } = useStoreData()
  const { dispatch, openDrawer } = useCart()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const goalQuery = searchParams.get('goal')
  const validGoals = ['muscle', 'force', 'recovery', 'energy']
  const initialGoal = validGoals.includes(goalQuery) ? goalQuery : 'all'

  const [topTab, setTopTab]         = useState(validGoals.includes(goalQuery) ? 'goal' : 'category')
  const [activeSubTab, setActiveSubTab] = useState(initialGoal)

  const sectionRef = useRef(null)
  useScrollReveal({ selector: '.catalog-section__title', from: 'fadeUp', duration: 0.8 }, sectionRef)
  useScrollReveal({ selector: '.catalog-top-tabs', from: 'fade', delay: 0.15, duration: 0.7 }, sectionRef)
  useScrollReveal({ selector: '.catalog-card', from: 'fadeUp', stagger: 0.07, duration: 0.75, start: 'top 90%' }, sectionRef)

  useEffect(() => {
    if (validGoals.includes(goalQuery)) { setTopTab('goal'); setActiveSubTab(goalQuery) }
    else if (!goalQuery)                { setTopTab('category'); setActiveSubTab('all') }
  }, [goalQuery])

  // Only show products flagged for the catalog (showInCatalog = true by default)
  const products   = (data?.products   ?? []).filter(p => p.showInCatalog !== false)
  const categories = data?.categories ?? []

  const goals = [
    { id: 'all',      name: t('catalog.allGoals') },
    { id: 'muscle',   name: t('catalog.buildMuscle') },
    { id: 'force',    name: t('catalog.increaseStrength') },
    { id: 'recovery', name: t('catalog.speedRecovery') },
    { id: 'energy',   name: t('catalog.maxPerformance') },
  ]

  function addToCart(product) {
    dispatch({ type: 'ADD', product: {
      id: product.id, name: product.name, brand: product.brand,
      price: product.price, currency: product.currency, image: product.image,
    }})
    openDrawer()
  }

  const filteredProducts = products.filter((p) => {
    if (topTab === 'category') {
      return activeSubTab === 'all' || p.category === activeSubTab
    }
    if (activeSubTab === 'all')      return true
    if (activeSubTab === 'muscle')   return p.tags.some(t => t.toLowerCase().includes('muscle') || t.toLowerCase().includes('protéine'))
    if (activeSubTab === 'force')    return p.tags.some(t => t.toLowerCase().includes('force') || t.toLowerCase().includes('créatine'))
    if (activeSubTab === 'recovery') return p.tags.some(t => t.toLowerCase().includes('bcaa') || t.toLowerCase().includes('récupération'))
    if (activeSubTab === 'energy')   return p.tags.some(t => t.toLowerCase().includes('pre-workout') || t.toLowerCase().includes('énergie') || t.toLowerCase().includes('performance'))
    return true
  })

  // Don't render if loading is done and nothing is flagged for the catalog
  if (!loading && products.length === 0) return null

  return (
    <section className="catalog-section" id="productsSection" ref={sectionRef}>
      <div className="section-shell">
        <h2 className="catalog-section__title font-display">{t('catalog.title')}</h2>

        <div className="catalog-top-tabs">
          <button className={`catalog-top-btn font-display ${topTab === 'category' ? 'active' : ''}`}
            onClick={() => { setTopTab('category'); setActiveSubTab('all') }}>
            {t('catalog.byCategory')}
          </button>
          <button className={`catalog-top-btn font-display ${topTab === 'goal' ? 'active' : ''}`}
            onClick={() => { setTopTab('goal'); setActiveSubTab('all') }}>
            {t('catalog.byGoal')}
          </button>
        </div>

        <div className="catalog-sub-tabs">
          <button className={`catalog-sub-btn ${activeSubTab === 'all' ? 'active' : ''}`} onClick={() => setActiveSubTab('all')}>
            {t('catalog.allProducts')}
          </button>
          {topTab === 'category'
            ? categories.map(cat => (
                <button key={cat.id} className={`catalog-sub-btn ${activeSubTab === cat.id ? 'active' : ''}`} onClick={() => setActiveSubTab(cat.id)}>
                  {cat.name}
                </button>
              ))
            : goals.filter(g => g.id !== 'all').map(goal => (
                <button key={goal.id} className={`catalog-sub-btn ${activeSubTab === goal.id ? 'active' : ''}`} onClick={() => setActiveSubTab(goal.id)}>
                  {goal.name}
                </button>
              ))
          }
        </div>

        <div className="catalog-grid">
          {loading
            ? Array(4).fill(null).map((_, i) => <div key={i} className="catalog-card catalog-card--skeleton" />)
            : filteredProducts.slice(0, 8).map((product) => {
                const discount = product.oldPrice
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null
                return (
                  <article key={product.id} className="catalog-card">
                    {discount && <span className="catalog-card__tag sale">{t('catalog.sale')}</span>}
                    {product.badge && !discount && <span className="catalog-card__tag new">{product.badge}</span>}
                    <div className="catalog-card__img-wrap">
                      <LazyImage src={product.image} alt={product.name} className="catalog-card__img" />
                    </div>
                    <div className="catalog-card__body">
                      <span className="catalog-card__brand">{product.brand}</span>
                      <h3 className="catalog-card__name">{product.name}</h3>
                      {product.flavors?.length > 0 && (
                        <div className="catalog-card__flavors">
                          <div className="catalog-card__swatches" aria-hidden>
                            {product.flavors.slice(0, 4).map((f) => (
                              <span key={f.name} className="catalog-card__swatch" title={f.name} style={{ background: f.color || '#ddd' }} />
                            ))}
                          </div>
                          <div className="catalog-card__flavor-labels">{product.flavors.slice(0, 3).map(f => f.name).join(' · ')}</div>
                        </div>
                      )}
                      <div className="catalog-card__stars">
                        <span className="stars-icons">★★★★★</span>
                        <span className="stars-count">({product.id.length + 12} Reviews)</span>
                      </div>
                      <div className="catalog-card__price-row">
                        <span className="price-label">{t('catalog.from')}</span>
                        <div className="price-container">
                          {product.oldPrice && <span className="price-old">{formatPrice(product.oldPrice, product.currency)}</span>}
                          <span className="price-current">{formatPrice(product.price, product.currency)}</span>
                        </div>
                      </div>
                    </div>
                    <button className="catalog-card__quickadd font-display" onClick={() => addToCart(product)} disabled={!product.inStock}>
                      {product.inStock ? t('catalog.quickAdd') : t('catalog.outOfStock')}
                    </button>
                  </article>
                )
              })
          }
        </div>
      </div>
    </section>
  )
}
