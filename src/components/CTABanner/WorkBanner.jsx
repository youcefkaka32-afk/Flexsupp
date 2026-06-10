import React, { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import './WorkBanner.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function WorkBanner() {
  const { t } = useTranslation()
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)
  const sectionRef = useRef(null)

  useScrollReveal({ selector: '.work-banner__eyebrow', from: 'fade', duration: 0.6 }, sectionRef)
  useScrollReveal({ selector: '.work-banner__title', from: 'fadeUp', delay: 0.1, duration: 1 }, sectionRef)
  useScrollReveal({ selector: '.work-banner__text', from: 'fadeUp', delay: 0.22, duration: 0.85 }, sectionRef)
  useScrollReveal({ selector: '.work-banner__btn', from: 'scale', delay: 0.34, duration: 0.7 }, sectionRef)

  // Ensure autoplay works on all browsers
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    v.play().catch(() => {})
  }, [])

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  return (
    <section className="work-banner" ref={sectionRef}>

      {/* Red eyebrow strip */}
      <div className="work-banner__eyebrow-strip">
        <span className="work-banner__eyebrow font-display">{t('workbanner.eyebrow')}</span>
      </div>

      {/* Full-width video block */}
      <div className="work-banner__main">

        {/* Background video */}
        <video
          ref={videoRef}
          className="work-banner__video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/fitness.mp4" type="video/mp4" />
        </video>

        {/* Right-side dark gradient overlay */}
        <div className="work-banner__overlay" />

        {/* Text content over overlay */}
        <div className="work-banner__content">
          <div className="work-banner__content-inner">
            <h2 className="work-banner__title font-display">{t('workbanner.title')}</h2>
            <p className="work-banner__text">{t('workbanner.text')}</p>
            <a href="/about" className="work-banner__btn font-display">
              {t('workbanner.cta')}
            </a>
          </div>
        </div>

        {/* Mute toggle */}
        <button
          className="work-banner__mute-btn"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute video' : 'Mute video'}
        >
          {muted
            ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>
          }
        </button>

      </div>
    </section>
  )
}
