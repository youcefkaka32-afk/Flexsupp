import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import './ToolsCalculators.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'
import { toolsData } from '../../data/toolsData'

export default function ToolsCalculators() {
  const { i18n } = useTranslation()
  const lang = i18n.language
  const data = toolsData[lang] || toolsData.en
  const sectionRef = useRef(null)

  useScrollReveal({ selector: '.tools-section__title', from: 'fadeUp', duration: 0.8 }, sectionRef)
  useScrollReveal({ selector: '.tools-card', from: 'fadeUp', stagger: 0.12, duration: 0.85, start: 'top 88%' }, sectionRef)

  return (
    <section className="tools-section" ref={sectionRef}>
      <div className="section-shell">
        <h2 className="tools-section__title font-display">{data.title}</h2>
        <div className="tools-grid">
          {data.items.map((tool) => (
            <Link 
              key={tool.id} 
              to={`/tools/${tool.id}`}
              className="tools-card"
            >
              <div className="tools-card__img-wrap">
                <img
                  src={tool.image}
                  alt={tool.title}
                  className="tools-card__img"
                  loading="lazy"
                />
                <span className="tools-card__badge font-display">{tool.category}</span>
              </div>
              <div className="tools-card__body">
                <h3 className="tools-card__name font-display">{tool.title}</h3>
                <p className="tools-card__desc">{tool.desc}</p>
                <span className="tools-card__link font-display">{data.readMore}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
