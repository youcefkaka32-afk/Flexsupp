import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useStoreData } from '../../hooks/useStoreData'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/utils'
import LazyImage from '../ui/LazyImage'
import './NewProducts.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function NewProducts() {
  const { data, loading } = useStoreData()
  const { dispatch, openDrawer } = useCart()
  const { t } = useTranslation()
  const sectionRef = useRef(null)

  useScrollReveal({ selector: '.new-products-section__title', from: 'fadeUp', duration: 0.8 }, sectionRef)
  useScrollReveal({ selector: '.new-card', from: 'fadeUp', stagger: 0.1, duration: 0.8, start: 'top 88%' }, sectionRef)

  // Primary: products explicitly flagged show_in_new=true
  // Fallback: products with badge 'NOUVEAU' (covers Supabase data before show_in_new column was added)
  const allProducts = data?.products ?? []
  const flagged = allProducts.filter(p => p.showInNew === true)
  const newProducts = flagged.length > 0
    ? flagged
    : allProducts.filter(p => p.badge === 'NOUVEAU')

  function addToCart(product) {
    dispatch({ type: 'ADD', product: {
      id: product.id, name: product.name, brand: product.brand,
      price: product.price, currency: product.currency, image: product.image,
    }})
    openDrawer()
  }

  // Don't render the section at all if there are no new products and we're done loading
  if (!loading && newProducts.length === 0) return null

  return (
    <section className="new-products-section" ref={sectionRef}>
      <div className="section-shell">
        <h2 className="new-products-section__title font-display">{t('newProducts.title')}</h2>
        <div className="new-products-grid">
          {loading
            ? Array(4).fill(null).map((_, i) => <div key={i} className="new-card new-card--skeleton" />)
            : newProducts.slice(0, 4).map((product) => {
                const discount = product.oldPrice
                  ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null
                return (
                  <article key={product.id} className="new-card">
                    {discount && <span className="new-card__tag sale">SALE</span>}
                    {product.badge && !discount && <span className="new-card__tag new">{product.badge}</span>}
                    <div className="new-card__img-wrap">
                      <LazyImage src={product.image} alt={product.name} className="new-card__img" />
                    </div>
                    <div className="new-card__body">
                      <span className="new-card__brand">{product.brand}</span>
                      <h3 className="new-card__name">{product.name}</h3>
                      {product.flavors?.length > 0 && (
                        <div className="new-card__flavors">
                          <div className="new-card__swatches" aria-hidden>
                            {product.flavors.slice(0, 4).map((f) => (
                              <span key={f.name} className="new-card__swatch" title={f.name} style={{ background: f.color || '#ddd' }} />
                            ))}
                          </div>
                          <div className="new-card__flavor-labels">{product.flavors.slice(0, 3).map(f => f.name).join(' · ')}</div>
                        </div>
                      )}
                      <div className="new-card__stars"><span className="stars-icons">★★★★★</span></div>
                      <div className="new-card__price-row">
                        <div className="new-card__price">
                          {product.oldPrice && <span className="price-old">{formatPrice(product.oldPrice, product.currency)}</span>}
                          <span className="price-current">{formatPrice(product.price, product.currency)}</span>
                        </div>
                      </div>
                    </div>
                    <button className="new-card__quickadd font-display" onClick={() => addToCart(product)} disabled={!product.inStock}>
                      {product.inStock ? t('newProducts.quickAdd') : t('newProducts.outOfStock')}
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
