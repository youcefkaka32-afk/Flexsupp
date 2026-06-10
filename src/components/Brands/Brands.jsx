import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import './Brands.css'
import ScrollBasedVelocityImagesDemo from '../ui/ScrollBasedVelocityImagesDemo'

export default function Brands() {
  const sectionRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-100px' })
  const { t } = useTranslation()

  return (
    <section className="brands-wall-section" ref={sectionRef}>
      <div className="section-shell">
        <motion.div
          className="brands-wall-header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
            <span className="eyebrow">{t('brands.eyebrow')}</span>
            <h2 className="section-title font-display">{t('brands.title')}</h2>
          </div>
          <p className="brands-wall-copy section-copy">{t('brands.copy')}</p>
        </motion.div>
      </div>
      <div className="brands-wall-content">
        <ScrollBasedVelocityImagesDemo />
      </div>
    </section>
  )
}
