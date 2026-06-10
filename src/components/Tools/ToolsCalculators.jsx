import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './ToolsCalculators.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function ToolsCalculators() {
  const { t } = useTranslation()
  const tools = t('tools.items', { returnObjects: true })
  const sectionRef = useRef(null)

  useScrollReveal({ selector: '.tools-section__title', from: 'fadeUp', duration: 0.8 }, sectionRef)
  useScrollReveal({ selector: '.tools-card', from: 'fadeUp', stagger: 0.12, duration: 0.85, start: 'top 88%' }, sectionRef)

  return (
    <section className="tools-section" ref={sectionRef}>
      <div className="section-shell">
        <h2 className="tools-section__title font-display">{t('tools.title')}</h2>
        <div className="tools-grid">
          {tools.map((tool, index) => (
            <article key={index} className="tools-card">
              <div className="tools-card__img-wrap">
                <img
                  src={[
                    'https://images.unsplash.com/photo-1544033527-b192daee1f5b?q=80&w=1470&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1470&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1453&auto=format&fit=crop',
                    'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1470&auto=format&fit=crop',
                  ][index]}
                  alt={tool.title}
                  className="tools-card__img"
                  loading="lazy"
                />
                <span className="tools-card__badge font-display">{tool.category}</span>
              </div>
              <div className="tools-card__body">
                <h3 className="tools-card__name font-display">{tool.title}</h3>
                <p className="tools-card__desc">{tool.desc}</p>
                <a href="/about" className="tools-card__link font-display">{t('tools.readMore')}</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
