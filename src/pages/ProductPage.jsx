import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useStoreData } from '../hooks/useStoreData'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../lib/utils'
import '../styles/ProductPage.css'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { data, loading } = useStoreData()
  const { openCheckoutWith } = useCart()
  const product = data?.products?.find((item) => item.id === id)
  const [selectedFlavor, setSelectedFlavor] = useState(product?.flavors?.[0] ?? { name: '', color: '#777' })
  const [selectedSize, setSelectedSize]     = useState(product?.sizes?.[0] ?? '')
  const [quantity, setQuantity]             = useState(1)
  const [readMore, setReadMore]             = useState(false)
  const [mainImage, setMainImage]           = useState(product?.image)

  useEffect(() => {
    if (product) {
      setSelectedFlavor(product.flavors?.[0] ?? { name: '', color: '#777' })
      setSelectedSize(product.sizes?.[0] ?? '')
      setQuantity(1)
      setMainImage(product.image)
      setReadMore(false)
    }
  }, [product])

  const relatedProducts = data?.products
    .filter((item) => item.category === product?.category && item.id !== product?.id)
    .slice(0, 4) ?? []

  const priceLabel    = product ? formatPrice(product.price, product.currency) : ''
  const oldPriceLabel = product?.oldPrice ? formatPrice(product.oldPrice, product.currency) : null
  const savings       = product?.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : null

  const handleBuyNow = () => {
    if (!product) return
    const variantId = `${product.id}-${selectedFlavor.name}-${selectedSize}`
    openCheckoutWith({
      id: variantId, name: product.name, brand: product.brand,
      price: product.price, currency: product.currency,
      image: mainImage || product.image, flavor: selectedFlavor.name, size: selectedSize,
    })
  }

  if (loading) return <div className="product-page-loading"><p>{t('product.loading')}</p></div>

  if (!product) return (
    <div className="product-page-not-found">
      <h2>{t('product.notFound')}</h2>
      <p>{t('product.notFoundDesc')}</p>
      <button className="btn primary" type="button" onClick={() => navigate('/shop')}>{t('product.backToShop')}</button>
    </div>
  )

  const translatedDesc = t(`products.${product.id}.desc`, product.description)
  const descriptionPreview = translatedDesc.length > 140 && !readMore
    ? `${translatedDesc.slice(0, 140)}...`
    : translatedDesc

  const galleryImages = [product.image, product.imageHover].filter(Boolean)

  return (
    <div className="product-page-bg">
      <main className="product-page-shell">
      <div className="product-page-topbar">
        <button className="back-link font-display" type="button" onClick={() => navigate('/shop')}>
          {t('product.back')}
        </button>
      </div>

      <div className="product-page-grid">
        <section className="product-gallery">
          <div className="product-main-image-wrap">
            <img src={mainImage} alt={product.name} className="product-main-image" />
          </div>
          <div className="product-thumbnails">
            {galleryImages.map((src, index) => (
              <button key={index} type="button" className={`thumbnail-button ${mainImage === src ? 'active' : ''}`} onClick={() => setMainImage(src)}>
                <img src={src} alt={`${product.name} ${t('product.thumbnail')} ${index + 1}`} />
              </button>
            ))}
          </div>
        </section>

        <section className="product-info-panel">
          <span className="product-brand-label">{product.brand}</span>
          <h1 className="product-title font-display">{t(`products.${product.id}.name`, product.name)}</h1>
          <span className={`stock-badge ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
            {product.inStock ? t('product.inStock') : t('product.outOfStock')}
          </span>

          <p className="product-short-description">{descriptionPreview}</p>
          {translatedDesc.length > 140 && (
            <button className="read-more-toggle" type="button" onClick={() => setReadMore((c) => !c)}>
              {readMore ? t('product.readLess') : t('product.readMore')}
            </button>
          )}

          <div className="price-block">
            {oldPriceLabel && <span className="price-old">{oldPriceLabel}</span>}
            <span className="price-current">{priceLabel}</span>
            {savings && <span className="price-savings">-{savings}%</span>}
          </div>

          <div className="selector-group">
            <div className="selector-row">
              <span className="selector-label">{t('product.selectedFlavor')}</span>
              <div className="flavor-pill selected-flavor">{selectedFlavor.name}</div>
            </div>
            <div className="flavor-selector">
              {product.flavors.map((flavor) => (
                <button key={flavor.name} type="button"
                  className={`flavor-circle ${selectedFlavor.name === flavor.name ? 'selected' : ''}`}
                  style={{ backgroundColor: flavor.color }} onClick={() => setSelectedFlavor(flavor)}>
                  <span className="sr-only">{flavor.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group">
            <span className="selector-label">{t('product.size')}</span>
            <div className="size-selector">
              {product.sizes.map((size) => (
                <button key={size} type="button" className={`size-pill ${selectedSize === size ? 'active' : ''}`} onClick={() => setSelectedSize(size)}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="selector-group quantity-block">
            <span className="selector-label">{t('product.quantity')}</span>
            <div className="quantity-stepper">
              <button type="button" className="quantity-btn" onClick={() => setQuantity((p) => Math.max(1, p - 1))}>-</button>
              <span className="quantity-value">{quantity}</span>
              <button type="button" className="quantity-btn" onClick={() => setQuantity((p) => p + 1)}>+</button>
            </div>
          </div>

          <button className="btn primary add-cart-button" type="button" onClick={handleBuyNow} disabled={!product.inStock}>
            {product.inStock ? t('product.addToCart') : t('product.outOfStock')}
          </button>
        </section>
      </div>

      <section className="product-detail-section">
        <div className="product-detail-grid">
          <div>
            <h2 className="detail-title">{t('product.fullDescription')}</h2>
            <p>{product.description}</p>
          </div>
          <div>
            <h3>{t('product.ingredients')}</h3>
            <p>{t('product.ingredientsText')}</p>
            <h3>{t('product.nutritionTitle')}</h3>
            <p>{t('product.nutritionText')}</p>
            <h3>{t('product.usageTitle')}</h3>
            <p>{t('product.usageText')}</p>
          </div>
        </div>
      </section>

      <section className="related-products-section">
        <div className="section-head">
          <div>
            <span className="eyebrow">{t('product.relatedEyebrow')}</span>
            <h2 className="section-title">{t('product.relatedTitle')}</h2>
          </div>
        </div>
        <div className="related-products-grid">
          {relatedProducts.map((item) => (
            <button key={item.id} className="related-product-card" type="button" onClick={() => navigate(`/boutique/${item.id}`)}>
              <img src={item.image} alt={item.name} />
              <div className="related-card-copy">
                <span className="related-card-brand">{item.brand}</span>
                <h3>{item.name}</h3>
                <span className="related-card-price">{formatPrice(item.price, item.currency)}</span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
    </div>
  )
}
