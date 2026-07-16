import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import './Categories.css'
import { useStoreData } from '../../hooks/useStoreData'

// SVG Icons
const icons = {
  whey: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 10h4v20h-4z" fill="currentColor"/>
      <path d="M23 10h4v20h-4z" fill="currentColor"/>
      <ellipse cx="15" cy="10" rx="3" ry="2" fill="currentColor"/>
      <ellipse cx="25" cy="10" rx="3" ry="2" fill="currentColor"/>
      <ellipse cx="15" cy="30" rx="3" ry="2" fill="currentColor"/>
      <ellipse cx="25" cy="30" rx="3" ry="2" fill="currentColor"/>
      <rect x="11" y="18" width="18" height="4" fill="currentColor"/>
    </svg>
  ),
  creatine: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 25V29H31V25H9Z" fill="currentColor"/>
      <path d="M11 25V17C11 13.7 13.7 11 17 11H23C26.3 11 29 13.7 29 17V25H11ZM16 7H24V9H16V7Z" fill="currentColor"/>
    </svg>
  ),
  bcaa: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 7L10 12V28L20 33L30 28V12L20 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 7V33" stroke="currentColor" strokeWidth="2"/>
      <path d="M10 12L30 28" stroke="currentColor" strokeWidth="2"/>
      <path d="M30 12L10 28" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  preworkout: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 7L11 20H19V33L29 20H21V7Z" fill="currentColor"/>
    </svg>
  ),
}

const categoryMeta = {
  protein:    { icon: icons.whey, count: '12+ Produits', color: '#E31B23' },
  creatine:   { icon: icons.creatine, count: '8+ Produits',  color: '#E31B23' },
  bcaa:       { icon: icons.bcaa, count: '10+ Produits', color: '#E31B23' },
  preworkout: { icon: icons.preworkout, count: '6+ Produits',  color: '#E31B23' },
  sarms:      { icon: icons.creatine, count: '2+ Produits',  color: '#E31B23' },
  peptide:    { icon: icons.bcaa, count: '3+ Produits',  color: '#E31B23' },
  'fat-burner': { icon: icons.preworkout, count: '4+ Produits',  color: '#E31B23' },
}

export default function Categories() {
  const { data, loading } = useStoreData()
  const { t } = useTranslation()
  const categories = data ? data.categories : []

  return (
    <section className="categories-section" id="categoriesSection">
      <div className="section-shell">

        {/* Section Header */}
        <div className="section-head">
          <div>
            <span className="eyebrow">{t('catalog.byCategory')}</span>
            <h2 className="section-title font-display">{t('shop.productType')}</h2>
          </div>
          <Link to="/shop" className="btn categories-view-all font-display">
            {t('shop.viewProducts')} →
          </Link>
        </div>

        {/* Category Grid */}
        <div className="categories-grid">
          {(loading ? Array(4).fill(null) : categories).map((cat, i) => (
            <motion.div
              key={cat ? cat.id : i}
              className={`category-tile ${!cat ? 'category-tile--skeleton' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              {cat && (
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.id)}`}
                  className="category-tile__link"
                >
                  {/* Top accent bar */}
                  <div className="category-tile__accent" />

                  {/* Icon */}
                  <span className="category-tile__icon">{categoryMeta[cat.id]?.icon || icons.whey}</span>

                  {/* Name */}
                  <h3 className="category-tile__name font-display">{t(`categories.${cat.id}`, cat.name)}</h3>

                  {/* Description */}
                  <p className="category-tile__desc">{t(`categories.${cat.id}_desc`, cat.description)}</p>

                  {/* Count + Arrow */}
                  <div className="category-tile__footer">
                    <span className="category-tile__count font-display">
                      {categoryMeta[cat.id]?.count || '+ Produits'}
                    </span>
                    <span className="category-tile__arrow">→</span>
                  </div>
                </Link>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
