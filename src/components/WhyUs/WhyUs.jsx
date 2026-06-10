import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import './WhyUs.css'

export default function WhyUs() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)
  const manifestoRef = useRef(null)
  const inView = useInView(sectionRef, { once: true, margin: '-60px' })
  const manifestoInView = useInView(manifestoRef, { once: true, margin: '-100px' })

  const features = [
    { icon: '🛡️', title: t('whyUs.features.authentic.title'), desc: t('whyUs.features.authentic.desc') },
    { icon: '🚚', title: t('whyUs.features.delivery.title'),  desc: t('whyUs.features.delivery.desc') },
    { icon: '🔬', title: t('whyUs.features.certified.title'), desc: t('whyUs.features.certified.desc') },
    { icon: '💬', title: t('whyUs.features.support.title'),   desc: t('whyUs.features.support.desc') },
  ]

  return (
    <>
      <section className="features-trust-section" ref={sectionRef}>
        <div className="section-shell">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t('whyUs.eyebrow')}</span>
              <h2 className="section-title font-display">{t('whyUs.title')}</h2>
            </div>
          </div>
          <div className="features-trust-grid">
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="feature-card"
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="feature-card__icon">{f.icon}</span>
                <h3 className="feature-card__title font-display">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="why-us-manifesto-section" ref={manifestoRef}>
        <div className="manifesto-shell">
          <div className="manifesto-grid">
            <div className="manifesto-left-watermark">
              <img src="/flexlgo.png" alt="Watermark" className="manifesto-bg-logo" draggable="false" />
            </div>
            <div className="manifesto-right-content">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={manifestoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <span className="eyebrow">{t('whyUs.manifestoEyebrow')}</span>
                <h2 className="manifesto-est font-display">{t('whyUs.est')}</h2>
                <div className="manifesto-body-text">
                  <p className="manifesto-p-highlight">{t('whyUs.highlight')}</p>
                  <p className="manifesto-p">{t('whyUs.body')}</p>
                </div>
                <div className="manifesto-decor-divider" />
                <div className="manifesto-author font-display">
                  <span className="author-name">{t('whyUs.author')}</span>
                  <span className="author-title">{t('whyUs.authorTitle')}</span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
