import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './SubHeroPromo.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function SubHeroPromo() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)

  // Badge + title stagger from left
  useScrollReveal({ selector: '.subhero-promo__badge', from: 'fadeLeft', duration: 0.7 }, sectionRef)
  useScrollReveal({ selector: '.subhero-promo__title', from: 'fadeUp', delay: 0.1, duration: 0.9 }, sectionRef)
  useScrollReveal({ selector: '.subhero-promo__subtitle', from: 'fadeUp', delay: 0.2, duration: 0.8 }, sectionRef)
  useScrollReveal({ selector: '.subhero-promo__btn', from: 'scale', delay: 0.32, duration: 0.7 }, sectionRef)
  // Image from right
  useScrollReveal({ selector: '.subhero-promo__right', from: 'fadeRight', duration: 1, delay: 0.1 }, sectionRef)

  return (
    <section className="subhero-promo" ref={sectionRef}>
      <div className="section-shell">
        <div className="subhero-promo__container">
          <div className="subhero-promo__left">
            <div className="subhero-promo__badge">{t('subhero.badge')}</div>
            <h2 className="subhero-promo__title font-display">{t('subhero.title')}</h2>
            <p className="subhero-promo__subtitle">{t('subhero.subtitle')}</p>
            <a href="/shop" className="btn primary subhero-promo__btn font-display">
              {t('subhero.cta')}
            </a>
          </div>
          <div className="subhero-promo__right">
            <div className="subhero-promo__image-container">
              <img src="/flexlgo.png" alt="Flex Supps" className="subhero-promo__img subhero-promo__img--logo" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
