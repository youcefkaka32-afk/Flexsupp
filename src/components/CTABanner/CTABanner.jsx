import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './CTABanner.css'

export default function CTABanner() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const { t } = useTranslation()

  const stats = [
    { value: '200MG', label: t('ctabanner.stats.caffeine') },
    { value: '3.2G',  label: t('ctabanner.stats.betaAlanine') },
    { value: '2G',    label: t('ctabanner.stats.citrulline') },
    { value: '0',     label: t('ctabanner.stats.noSugar') },
  ]

  return (
    <section className="cta-banner-section" ref={ref}>
      <div className="section-shell">
        <motion.div
          className="cta-banner-card"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="cta-banner-card__grid-bg" aria-hidden="true" />
          <div className="cta-banner-card__image-col">
            <motion.img
              src="/preworkout_tub.png"
              alt="Pre-Workout IGNITE"
              className="cta-banner-card__img"
              draggable="false"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="cta-banner-card__img-glow" />
          </div>
          <div className="cta-banner-card__copy-col">
            <span className="cta-banner-card__eyebrow">{t('ctabanner.eyebrow')}</span>
            <h2 className="cta-banner-card__title font-display">
              {t('ctabanner.title')}<br />
              <span className="cta-banner-card__title-accent">{t('ctabanner.accent')}</span>
            </h2>
            <p className="cta-banner-card__desc">{t('ctabanner.desc')}</p>
            <div className="cta-banner-card__actions">
              <Link to="/shop" className="btn primary cta-banner-card__btn font-display">{t('ctabanner.buy')}</Link>
              <Link to="/shop" className="btn outline cta-banner-card__btn-sec font-display">{t('ctabanner.details')}</Link>
            </div>
          </div>
          <div className="cta-banner-card__stats-col">
            <span className="cta-banner-card__stats-title">{t('ctabanner.composition')}</span>
            <div className="cta-banner-card__stats-grid">
              {stats.map((s, i) => (
                <motion.div
                  key={i}
                  className="cta-stat-item"
                  initial={{ opacity: 0, x: 20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                >
                  <span className="cta-stat-item__val font-display">{s.value}</span>
                  <span className="cta-stat-item__lbl">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
