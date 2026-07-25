import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import './ProductReviews.css'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const ALL_REVIEWS_DATA = {
  en: [
    {
      avatar: 'S', name: 'Sam C.', date: 'August 7, 2025', stars: 5,
      title: 'Great Product',
      text: 'It is a really great product and I noticed results right away!! Strength went up in the first week.',
      productName: 'Scitec Nutrition Creatine Mono',
      img: '/images/creatine-creapure.jpg'
    },
    {
      avatar: 'R', name: 'RAINONE R.', date: 'May 27, 2026', stars: 5,
      title: 'Great Taste',
      text: 'Great taste, mixes instantly and digests very well with no bloating. Best whey I have tried so far.',
      productName: 'Whey Protein Concentrate',
      img: '/images/whey-protein-concentrate.jpg'
    },
    {
      avatar: 'J', name: 'Jenene J.', date: 'July 20, 2025', stars: 5,
      title: 'Great During And After Workouts',
      text: "Love a small scoop of the BCAA in my water during and after workouts. My muscles don't feel fatigued at all.",
      productName: 'BCAA Essential',
      img: '/images/bcaa-essential.jpg'
    },
    {
      avatar: 'J', name: 'Juan L.', date: 'January 30, 2025', stars: 5,
      title: 'No Crash, Pure Energy',
      text: 'Taste great! Extreme energy boost and focus for workouts without any crash afterwards. Highly recommend.',
      productName: 'Eliminate Pre-Workout',
      img: '/images/eliminate-preworkout.jpg'
    },
    {
      avatar: 'A', name: 'Amir K.', date: 'March 12, 2026', stars: 5,
      title: 'Fast Delivery, Authentic Product',
      text: 'Received in 2 days, perfect packaging and 100% authentic product. The creatine noticeably boosted my performance.',
      productName: 'Creatine HCL',
      img: '/images/creatine-hcl.jpg'
    },
    {
      avatar: 'M', name: 'Mohamed B.', date: 'April 5, 2026', stars: 5,
      title: 'Top Quality',
      text: 'Whey Gold is excellent. Perfect chocolate taste, mixes easily and results are there after 3 weeks.',
      productName: 'Chocolate Peanut Butter Protein',
      img: '/images/chocolate-peanut-butter.jpg'
    },
    {
      avatar: 'L', name: 'Lina M.', date: 'February 18, 2026', stars: 5,
      title: 'Best Store in Algeria',
      text: 'Exceptional customer service and authentic products. I have been ordering from Flex Supps for a year and never disappointed.',
      productName: 'BCAA Recovery',
      img: '/images/bcaa-recovery.jpg'
    },
    {
      avatar: 'K', name: 'Karim D.', date: 'May 1, 2026', stars: 5,
      title: 'Insane Pump',
      text: 'The pre-workout formula is absolutely insane. Pump and focus are on another level. Will definitely reorder.',
      productName: 'Ultra Gainer',
      img: '/images/ultra-gainer.jpg'
    },
  ],
  fr: [
    {
      avatar: 'S', name: 'Sam C.', date: '7 août 2025', stars: 5,
      title: 'Excellent Produit',
      text: 'C\'est vraiment un excellent produit et j\'ai remarqué des résultats tout de suite!! La force a augmenté dès la première semaine.',
      productName: 'Scitec Nutrition Créatine Mono',
      img: '/images/creatine-creapure.jpg'
    },
    {
      avatar: 'R', name: 'RAINONE R.', date: '27 mai 2026', stars: 5,
      title: 'Goût Excellent',
      text: 'Excellent goût, se mélange instantanément et se digère très bien sans ballonnements. La meilleure whey que j\'ai essayée.',
      productName: 'Whey Protein Concentrate',
      img: '/images/whey-protein-concentrate.jpg'
    },
    {
      avatar: 'J', name: 'Jenene J.', date: '20 juillet 2025', stars: 5,
      title: 'Parfait Pendant et Après l\'Entraînement',
      text: 'J\'adore une petite dose de BCAA dans mon eau pendant et après l\'entraînement. Mes muscles ne sont pas du tout fatigués.',
      productName: 'BCAA Essential',
      img: '/images/bcaa-essential.jpg'
    },
    {
      avatar: 'J', name: 'Juan L.', date: '30 janvier 2025', stars: 5,
      title: 'Pas de Crash, Énergie Pure',
      text: 'Goût excellent! Boost d\'énergie et concentration extrêmes pour les entraînements sans crash après. Je recommande vivement.',
      productName: 'Eliminate Pre-Workout',
      img: '/images/eliminate-preworkout.jpg'
    },
    {
      avatar: 'A', name: 'Amir K.', date: '12 mars 2026', stars: 5,
      title: 'Livraison Rapide, Produit Authentique',
      text: 'Reçu en 2 jours, emballage parfait et produit 100% authentique. La créatine a boosté mes performances de manière notable.',
      productName: 'Creatine HCL',
      img: '/images/creatine-hcl.jpg'
    },
    {
      avatar: 'M', name: 'Mohamed B.', date: '5 avril 2026', stars: 5,
      title: 'Qualité Top',
      text: 'Whey Gold est excellent. Goût chocolat parfait, se mélange facilement et les résultats sont au rendez-vous après 3 semaines.',
      productName: 'Chocolate Peanut Butter Protein',
      img: '/images/chocolate-peanut-butter.jpg'
    },
    {
      avatar: 'L', name: 'Lina M.', date: '18 février 2026', stars: 5,
      title: 'Meilleure Boutique en Algérie',
      text: 'Service client exceptionnel et produits authentiques. Je commande chez Flex Supps depuis un an et je ne suis jamais déçue.',
      productName: 'BCAA Recovery',
      img: '/images/bcaa-recovery.jpg'
    },
    {
      avatar: 'K', name: 'Karim D.', date: '1er mai 2026', stars: 5,
      title: 'Pump Incroyable',
      text: 'La formule pre-workout est absolument incroyable. Le pump et la concentration sont d\'un autre niveau. Je recommanderai certainement.',
      productName: 'Ultra Gainer',
      img: '/images/ultra-gainer.jpg'
    },
  ],
  ar: [
    {
      avatar: 'س', name: 'سام س.', date: '٧ أغسطس ٢٠٢٥', stars: 5,
      title: 'منتج ممتاز',
      text: 'إنه منتج ممتاز حقاً ولاحظت النتائج فوراً!! القوة زادت في الأسبوع الأول.',
      productName: 'كرياتين مونو من سايتك نيوتريشن',
      img: '/images/creatine-creapure.jpg'
    },
    {
      avatar: 'ر', name: 'راينون ر.', date: '٢٧ مايو ٢٠٢٦', stars: 5,
      title: 'طعم رائع',
      text: 'طعم رائع، يمتزج فوراً ويُهضم بشكل جيد جداً بدون انتفاخ. أفضل واي بروتين جربته حتى الآن.',
      productName: 'واي بروتين كونسنتريت',
      img: '/images/whey-protein-concentrate.jpg'
    },
    {
      avatar: 'ج', name: 'جينين ج.', date: '٢٠ يوليو ٢٠٢٥', stars: 5,
      title: 'رائع أثناء وبعد التمرين',
      text: 'أحب إضافة مغرفة صغيرة من الـ BCAA إلى مائي أثناء وبعد التمرين. عضلاتي لا تشعر بالإرهاق على الإطلاق.',
      productName: 'بي سي إيه إيسينشال',
      img: '/images/bcaa-essential.jpg'
    },
    {
      avatar: 'ج', name: 'خوان ل.', date: '٣٠ يناير ٢٠٢٥', stars: 5,
      title: 'طاقة نقية بدون انهيار',
      text: 'طعم رائع! دفعة طاقة شديدة وتركيز للتمرين بدون أي انهيار بعد ذلك. أنصح به بشدة.',
      productName: 'إليميناتبري ورك آوت',
      img: '/images/eliminate-preworkout.jpg'
    },
    {
      avatar: 'أ', name: 'أمير ك.', date: '١٢ مارس ٢٠٢٦', stars: 5,
      title: 'توصيل سريع، منتج أصيل',
      text: 'استلمته في يومين، تغليف ممتاز ومنتج أصيل 100%. الكرياتين عزز أدائي بشكل ملحوظ.',
      productName: 'كرياتين إتش سي إل',
      img: '/images/creatine-hcl.jpg'
    },
    {
      avatar: 'م', name: 'محمد ب.', date: '٥ أبريل ٢٠٢٦', stars: 5,
      title: 'جودة ممتازة',
      text: 'واي جولد ممتاز. طعم الشوكولاتة مثالي، يمتزج بسهولة والنتائج واضحة بعد 3 أسابيع.',
      productName: 'بروتين شوكولاتة وفول سوداني',
      img: '/images/chocolate-peanut-butter.jpg'
    },
    {
      avatar: 'ل', name: 'لينا م.', date: '١٨ فبراير ٢٠٢٦', stars: 5,
      title: 'أفضل متجر في الجزائر',
      text: 'خدمة عملاء استثنائية ومنتجات أصيلة. أطلب من فليكس سابس منذ سنة ولم أخيب أملي أبداً.',
      productName: 'بي سي إيه ريكفري',
      img: '/images/bcaa-recovery.jpg'
    },
    {
      avatar: 'ك', name: 'كريم د.', date: '١ مايو ٢٠٢٦', stars: 5,
      title: 'ضخ عضلي جنوني',
      text: 'تركيبة ما قبل التمرين جنونية تماماً. الضخ والتركيز على مستوى آخر. سأطلبه بالتأكيد مرة أخرى.',
      productName: 'ألترا جينر',
      img: '/images/ultra-gainer.jpg'
    },
  ]
}

const CARDS_PER_VIEW_DESKTOP = 3

function StarRating({ count }) {
  return (
    <div className="rev-stars" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? 'star filled' : 'star'}>★</span>
      ))}
    </div>
  )
}

export default function ProductReviews() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language || 'en'
  const [index, setIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)

  const timerRef = useRef(null)
  const trackRef = useRef(null)
  const sectionRef = useRef(null)
  const isProgrammaticScroll = useRef(false)

  const ALL_REVIEWS = ALL_REVIEWS_DATA[lang] || ALL_REVIEWS_DATA.en
  const total = ALL_REVIEWS.length

  useScrollReveal({ selector: '.reviews-header', from: 'fadeUp', duration: 0.8 }, sectionRef)
  useScrollReveal({ selector: '.reviews-carousel-wrap', from: 'fadeUp', delay: 0.15, duration: 0.9 }, sectionRef)

  // ── Mobile detection ──────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Reset when language changes ───────────────────────────────
  useEffect(() => {
    setIndex(0)
  }, [lang])

  // ── Derived values ────────────────────────────────────────────
  const cardsPerView = isMobile ? 1 : CARDS_PER_VIEW_DESKTOP
  const maxIndex = Math.max(0, total - cardsPerView)

  // Keep index in bounds when cardsPerView changes (resize)
  useEffect(() => {
    if (index > maxIndex) setIndex(0)
  }, [maxIndex]) // eslint-disable-line

  // ── Auto-advance ──────────────────────────────────────────────
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex(i => (i >= maxIndex ? 0 : i + 1))
    }, 4000)
  }, [maxIndex])

  useEffect(() => {
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [startTimer])

  // ── Mobile: programmatic scroll whenever index changes ────────
  useEffect(() => {
    if (!isMobile) return
    const track = trackRef.current
    if (!track) return

    // Card width = 90vw
    const cardWidth = window.innerWidth * 0.9
    const targetScroll = index * cardWidth

    isProgrammaticScroll.current = true
    track.scrollTo({ left: targetScroll, behavior: 'smooth' })

    const t = setTimeout(() => { isProgrammaticScroll.current = false }, 450)
    return () => clearTimeout(t)
  }, [index, isMobile])

  // ── Mobile: sync dot from user's native swipe ─────────────────
  useEffect(() => {
    if (!isMobile) return
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      if (isProgrammaticScroll.current) return
      const cardWidth = window.innerWidth * 0.9
      const nearest = Math.round(track.scrollLeft / cardWidth)
      const clamped = Math.max(0, Math.min(nearest, total - 1))
      setIndex(clamped)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [isMobile, total])

  // ── Navigation helpers ────────────────────────────────────────
  const go = useCallback((next) => {
    const clamped = Math.max(0, Math.min(next, maxIndex))
    setIndex(clamped)
    startTimer()
  }, [maxIndex, startTimer])

  const handlePrev = () => go(index - 1)
  const handleNext = () => go(index + 1)
  const handleDot  = (i) => go(i)

  // ── Desktop drag / swipe ──────────────────────────────────────
  const onDragStart = (e) => {
    setDragging(true)
    setDragStart(e.clientX ?? e.touches?.[0]?.clientX)
  }
  const onDragEnd = (e) => {
    if (!dragging) return
    setDragging(false)
    const endX = e.clientX ?? e.changedTouches?.[0]?.clientX
    const diff = dragStart - endX
    if (Math.abs(diff) > 50) { diff > 0 ? handleNext() : handlePrev() }
  }

  // ── Desktop transform offset ──────────────────────────────────
  const isRtl = i18n.language === 'ar'
  const cardWidthPct = 100 / cardsPerView
  const rawOffset = -(index * cardWidthPct)
  const offset = isMobile ? 0 : (isRtl ? -rawOffset : rawOffset)

  return (
    <section className="reviews-section" ref={sectionRef}>
      
      {/* Header (contained inside normal padded shell) */}
      <div className="section-shell">
        <div className="reviews-header">
          <div>
            <span className="eyebrow">{t('reviews.count')}</span>
            <h2 className="reviews-section__title font-display">{t('reviews.title')}</h2>
          </div>
          <div className="reviews-overall">
            <div className="reviews-overall__stars">★★★★★</div>
            <div className="reviews-overall__score">5.0</div>
          </div>
        </div>
      </div>

      {/* Carousel Wrapper (placed OUTSIDE shell, so it naturally spans full viewport width) */}
      <div className="reviews-carousel-wrap">
        <button
          type="button"
          className="reviews-nav-btn prev"
          onClick={handlePrev}
          disabled={index === 0}
          aria-label="Previous"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        <div
          className="reviews-viewport"
          onMouseDown={onDragStart}
          onMouseUp={onDragEnd}
          onMouseLeave={onDragEnd}
          onTouchStart={onDragStart}
          onTouchEnd={onDragEnd}
        >
          <div
            className="reviews-track"
            ref={trackRef}
            style={isMobile
              ? undefined
              : { transform: `translateX(${offset}%)`, transition: dragging ? 'none' : 'transform 0.45s cubic-bezier(0.22,1,0.36,1)' }
            }
          >
            {ALL_REVIEWS.map((rev, i) => (
              <div key={i} className="review-card">
                <div className="review-card__inner">
                  <div className="review-card__header">
                    <div className="review-card__avatar">{rev.avatar}</div>
                    <div className="review-card__meta">
                      <span className="review-card__username">{rev.name}</span>
                      <span className="review-card__date">{rev.date}</span>
                    </div>
                    <StarRating count={rev.stars} />
                  </div>

                  <h4 className="review-card__heading">{rev.title}</h4>
                  <p className="review-card__text">"{rev.text}"</p>

                  <div className="review-card__product">
                    <img src={rev.img} alt={rev.productName} className="review-card__prod-img" />
                    <span className="review-card__prod-name">{rev.productName}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="reviews-nav-btn next"
          onClick={handleNext}
          disabled={index === maxIndex}
          aria-label="Next"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      {/* Dots (contained inside normal padded shell) */}
      <div className="section-shell">
        <div className="reviews-dots">
          {(isMobile ? ALL_REVIEWS : Array.from({ length: maxIndex + 1 })).map((_, i) => (
            <button
              type="button"
              key={i}
              className={`reviews-dot ${i === index ? 'active' : ''}`}
              onClick={() => handleDot(i)}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>

    </section>
  )
}
