import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
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
      <path d="M20 8l-3 6 3 6 3-6z" fill="currentColor"/>
      <path d="M20 20l-3 6 3 6 3-6z" fill="currentColor"/>
      <circle cx="12" cy="14" r="2" fill="currentColor"/>
      <circle cx="28" cy="14" r="2" fill="currentColor"/>
      <circle cx="12" cy="26" r="2" fill="currentColor"/>
      <circle cx="28" cy="26" r="2" fill="currentColor"/>
    </svg>
  ),
  bcaa: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="28" cy="12" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      <circle cx="20" cy="28" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      <line x1="14" y1="15" x2="18" y2="25" stroke="currentColor" strokeWidth="2"/>
      <line x1="26" y1="15" x2="22" y2="25" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  preworkout: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 6l4 8h8l-6 6 2 8-8-4-8 4 2-8-6-6h8z" fill="currentColor"/>
    </svg>
  ),
}

const categoryMeta = {
  whey:       { icon: icons.whey, count: '12+ Produits', color: '#E31B23' },
  creatine:   { icon: icons.creatine, count: '8+ Produits',  color: '#E31B23' },
  bcaa:       { icon: icons.bcaa, count: '10+ Produits', color: '#E31B23' },
  preworkout: { icon: icons.preworkout, count: '6+ Produits',  color: '#E31B23' },
}

export default function Categories() {
  const { data, loading } = useStoreData()
  const categories = data ? data.categories : []

  return (
    <section className="categories-section" id="categoriesSection">
      <div className="section-shell">

        {/* Section Header */}
        <div className="section-head">
          <div>
            <span className="eyebrow">CATÉGORIES</span>
            <h2 className="section-title font-display">EXPLORER PAR TYPE</h2>
          </div>
          <Link to="/shop" className="btn categories-view-all font-display">
            VOIR TOUT →
          </Link>
        </div>

        {/* Category Grid */}
        <div className="categories-grid">
          {(loading ? Array(4).fill(null) : categories).map((cat, i) => (
            <motion.a
              key={cat ? cat.id : i}
              href="/shop"
              className={`category-tile ${!cat ? 'category-tile--skeleton' : ''}`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
            >
              {cat && (
                <>
                  {/* Top accent bar */}
                  <div className="category-tile__accent" />

                  {/* Icon */}
                  <span className="category-tile__icon">{categoryMeta[cat.id]?.icon || icons.whey}</span>

                  {/* Name */}
                  <h3 className="category-tile__name font-display">{cat.name}</h3>

                  {/* Description */}
                  <p className="category-tile__desc">{cat.description}</p>

                  {/* Count + Arrow */}
                  <div className="category-tile__footer">
                    <span className="category-tile__count font-display">
                      {categoryMeta[cat.id]?.count || '+ Produits'}
                    </span>
                    <span className="category-tile__arrow">→</span>
                  </div>
                </>
              )}
            </motion.a>
          ))}
        </div>

      </div>
    </section>
  )
}
