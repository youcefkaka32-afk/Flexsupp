import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import './SocialGrid.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function SocialGrid() {
  const { t } = useTranslation()
  const sectionRef = useRef(null)

  useScrollReveal({ selector: '.social-header', from: 'fadeUp', duration: 0.85 }, sectionRef)
  useScrollReveal({ selector: '.social-embed-wrapper', from: 'fadeUp', delay: 0.15, duration: 0.9 }, sectionRef)

  useEffect(() => {
    const src = 'https://widgets.sociablekit.com/instagram-feed/widget.js'
    if (!document.querySelector(`script[src="${src}"]`)) {
      const s = document.createElement('script')
      s.src = src
      s.defer = true
      document.body.appendChild(s)
    }
  }, [])

  return (
    <section id="social" className="social-section" ref={sectionRef}>
      <div className="section-shell">

        {/* Profile header — full width 3-column layout */}
        <div className="social-header">

          {/* Left: avatar */}
          <div className="social-header__avatar">
            <img src="/flexlgo.png" alt="Flex Supps" className="social-header__avatar-img" />
          </div>

          {/* Centre: handle, stats, bio */}
          <div className="social-header__info">
            <div className="social-header__top-row">
              <span className="social-header__handle">@flex_supps_</span>
              <a
                href="https://www.instagram.com/flex_supps_/"
                target="_blank"
                rel="noreferrer"
                className="btn primary social-follow-btn font-display"
              >
                {t('social.follow')}
              </a>
            </div>

            <div className="social-stats font-display">
              <div className="stat"><strong>500+</strong><span>{t('social.posts')}</span></div>
              <div className="stat"><strong>5K+</strong><span>{t('social.followers')}</span></div>
              <div className="stat"><strong>200</strong><span>{t('social.following')}</span></div>
            </div>

            <p className="social-header__bio">{t('social.bio')}</p>
          </div>

          {/* Right: community CTA */}
          <div className="social-header__cta">
            <span className="social-header__cta-label">Our Community</span>
            <div className="social-header__cta-score">
              <strong>5K+</strong>
              <span>Followers</span>
            </div>
            <a
              href="https://www.instagram.com/flex_supps_/"
              target="_blank"
              rel="noreferrer"
              className="btn primary social-follow-btn font-display"
            >
              {t('social.follow')}
            </a>
            <span className="social-header__cta-label">on Instagram</span>
          </div>

        </div>

        {/* Instagram embed */}
        <div className="social-embed-wrapper">

          {/* Left hand-drawn strokes */}
          <svg className="social-sketch social-sketch--left" viewBox="0 0 100 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="none">
            <path d="M72 8 C65 22 58 18 62 35 C66 52 74 48 70 65 C66 82 55 78 58 96 C61 114 72 110 68 128 C64 146 52 142 55 160 C58 178 70 174 66 192 C62 210 50 206 53 224 C56 242 68 238 65 256 C62 274 50 270 52 288 C54 306 66 303 63 321 C60 339 48 335 50 353 C52 371 64 368 62 386 C60 404 48 400 49 418 C50 436 62 433 61 451 C60 469 48 465 49 483 C50 501 61 499 60 516 C59 533 48 530 49 547 C50 564 60 563 59 580 C58 592 52 596 55 600" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M55 12 C50 28 44 24 47 42 C50 60 58 56 55 74 C52 92 42 88 44 107 C46 126 55 122 52 141 C49 160 39 156 41 175 C43 194 52 190 50 209 C48 228 38 224 39 243 C40 262 50 259 48 278 C46 297 36 293 37 312 C38 331 48 328 47 347 C46 366 36 362 37 381 C38 400 47 397 46 416 C45 435 35 432 36 451 C37 470 46 467 46 486 C46 505 36 503 36 521 C36 539 46 538 46 556 C46 572 37 576 39 590 C41 600 48 598 50 600" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M88 20 C82 40 90 55 84 75 C78 95 68 88 70 110 C72 132 84 128 80 150 C76 172 64 165 65 188 C66 211 78 207 75 230 C72 253 60 246 60 269 C60 292 72 289 70 312 C68 335 56 328 56 351 C56 374 68 371 67 394 C66 417 54 410 54 433 C54 456 65 454 65 477 C65 500 54 497 54 520 C54 543 65 542 65 564 C65 580 56 585 58 600" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

          <div className="sk-instagram-feed" data-embed-id="25688282"></div>

          {/* Right hand-drawn strokes */}
          <svg className="social-sketch social-sketch--right" viewBox="0 0 100 600" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" preserveAspectRatio="none">
            <path d="M28 8 C35 22 42 18 38 35 C34 52 26 48 30 65 C34 82 45 78 42 96 C39 114 28 110 32 128 C36 146 48 142 45 160 C42 178 30 174 34 192 C38 210 50 206 47 224 C44 242 32 238 35 256 C38 274 50 270 48 288 C46 306 34 303 37 321 C40 339 52 335 50 353 C48 371 36 368 38 386 C40 404 52 400 51 418 C50 436 38 433 39 451 C40 469 52 465 51 483 C50 501 39 499 40 516 C41 533 52 530 51 547 C50 564 40 563 41 580 C42 592 48 596 45 600" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M45 12 C50 28 56 24 53 42 C50 60 42 56 45 74 C48 92 58 88 56 107 C54 126 45 122 48 141 C51 160 61 156 59 175 C57 194 48 190 50 209 C52 228 62 224 61 243 C60 262 50 259 52 278 C54 297 64 293 63 312 C62 331 52 328 53 347 C54 366 64 362 63 381 C62 400 53 397 54 416 C55 435 65 432 64 451 C63 470 54 467 54 486 C54 505 64 503 64 521 C64 539 54 538 54 556 C54 572 63 576 61 590 C59 600 52 598 50 600" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20 C18 40 10 55 16 75 C22 95 32 88 30 110 C28 132 16 128 20 150 C24 172 36 165 35 188 C34 211 22 207 25 230 C28 253 40 246 40 269 C40 292 28 289 30 312 C32 335 44 328 44 351 C44 374 32 371 33 394 C34 417 46 410 46 433 C46 456 35 454 35 477 C35 500 46 497 46 520 C46 543 35 542 35 564 C35 580 44 585 42 600" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

        </div>

      </div>
    </section>
  )
}
