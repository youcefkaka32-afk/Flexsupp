import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useStoreData } from '../../hooks/useStoreData'
import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../lib/utils'
import './FeaturedProducts.css'

export default function FeaturedProducts() {
  const { data, loading } = useStoreData()
  const { dispatch, openDrawer } = useCart()

  const featured = data ? data.products.filter((p) => p.featured) : []

  function addToCart(product) {
    dispatch({
      type: 'ADD',
      product: {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        currency: product.currency,
        image: product.image,
      },
    })
    openDrawer()
  }

  return (
    <section className="featured-grid-section">
      <div className="section-shell">

        {/* Section Header — BB.com style: title left, CTA right */}
        <div className="section-head">
          <div>
            <span className="eyebrow">TOP VENTES</span>
            <h2 className="section-title font-display">NOS BEST-SELLERS</h2>
          </div>
          <Link to="/shop" className="btn featured-see-all font-display">
            VOIR TOUT →
          </Link>
        </div>

        {/* 4-Column Card Grid */}
        <div className="featured-product-grid">
          {(loading ? Array(4).fill(null) : featured.slice(0, 4)).map((product, index) => {
            if (!product) {
              return <div key={index} className="best-seller-card best-seller-card--skeleton" />
            }

            const price = formatPrice(product.price, product.currency)
            const discount = product.oldPrice
              ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
              : null

            return (
              <motion.article
                key={product.id}
                className="best-seller-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Image Wrapper */}
                <div className="best-seller-card__img-wrap">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="best-seller-card__img"
                    loading="lazy"
                  />
                  {product.badge && (
                    <span className="best-seller-card__badge font-display">{product.badge}</span>
                  )}
                  {discount && (
                    <span className="best-seller-card__discount">-{discount}%</span>
                  )}

                  {/* Quick-add overlay — slides up on hover */}
                  <div className="best-seller-card__overlay">
                    <button
                      className="best-seller-card__quick-add font-display"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? '+ AJOUTER AU PANIER' : 'ÉPUISÉ'}
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div className="best-seller-card__body">
                  <span className="best-seller-card__brand text-red font-display">
                    {product.brand.toUpperCase()}
                  </span>
                  <h3 className="best-seller-card__name">{product.name}</h3>

                  {/* Stars */}
                  <div className="best-seller-card__stars">
                    {'★★★★★'.split('').map((s, i) => (
                      <span key={i} className="star-icon">{s}</span>
                    ))}
                    <span className="rating-lbl">(5.0)</span>
                  </div>

                  {/* Price row */}
                  <div className="best-seller-card__price-row">
                    <div className="best-seller-card__price font-display">
                      {product.oldPrice && (
                        <span className="price-old">{formatPrice(product.oldPrice, product.currency)}</span>
                      )}
                      <span className="price-current text-red">{price}</span>
                    </div>
                    <button
                      className="btn primary best-seller-card__btn font-display"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? 'AJOUTER' : 'ÉPUISÉ'}
                    </button>
                  </div>
                </div>
              </motion.article>
            )
          })}
        </div>

      </div>
    </section>
  )
}
