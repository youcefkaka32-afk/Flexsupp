import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './TrustBar.css'
import dzMapSvg from '../../../dz-04.svg?raw'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const mainPathMatch = dzMapSvg.match(/<path d="([\s\S]*?)" fill="#828282" transform="([^"]+)"/)
const algeriaPathData = mainPathMatch?.[1] ?? ''
const algeriaPathTransform = mainPathMatch?.[2] ?? ''

function AlgeriaIcon() {
  return (
    <svg viewBox="0 0 624 468" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      {algeriaPathData ? <path d={algeriaPathData} transform={algeriaPathTransform} fill="currentColor" /> : null}
    </svg>
  )
}

function AlgeriaFlagIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="5" y="4" width="14" height="16" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 4v16" stroke="currentColor" strokeWidth="1.25" opacity="0.45" />
      <path d="M12.2 9.2a3.3 3.3 0 1 0 0 5.6 4 4 0 1 1 0-5.6z" fill="currentColor" />
      <path d="M14.6 10.8l.4 1.2h1.2l-1 .7.4 1.2-1-.7-1 .7.4-1.2-1-.7h1.2z" fill="currentColor" />
    </svg>
  )
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6 8.2L12 5l6 3.2v7.6L12 19l-6-3.2V8.2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M6 8.2l6 3.2 6-3.2M12 11.4V19" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 3.5l6 2.2v4.3c0 3.7-2.1 6.7-6 8.9-3.9-2.2-6-5.2-6-8.9V5.7l6-2.2z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9.3 12.1l1.8 1.9 3.8-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function TrustBar() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)

  // Stagger each trust item
  useScrollReveal({ selector: '.trustbar-item', from: 'fadeUp', stagger: 0.12, duration: 0.8 }, sectionRef)

  const items = [
    { icon: <AlgeriaIcon />,      title: t('trustbar.shipping.title'),     desc: t('trustbar.shipping.desc') },
    { icon: <AlgeriaFlagIcon />,  title: t('trustbar.algerian.title'),     desc: t('trustbar.algerian.desc') },
    { icon: <BoxIcon />,          title: t('trustbar.freeShipping.title'), desc: t('trustbar.freeShipping.desc') },
    { icon: <ShieldCheckIcon />,  title: t('trustbar.secure.title'),       desc: t('trustbar.secure.desc') },
  ]

  return (
    <section className="trustbar-section" aria-label="Benefits" ref={sectionRef}>
      <div className="section-shell">
        <div className="trustbar-grid">
          {items.map((item, index) => (
            <div key={index} className="trustbar-item">
              <div className="trustbar-item__icon-wrap">
                <span className="trustbar-item__icon">{item.icon}</span>
              </div>
              <div className="trustbar-item__content">
                <h4 className="trustbar-item__title">{item.title}</h4>
                <p className="trustbar-item__desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
