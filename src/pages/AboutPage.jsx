import { useEffect, useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import '../styles/about.css'
import Footer from '../components/Footer/Footer'
import Text3DFlip from '../registry/magicui/text-3d-flip'
import { GridPattern } from '../registry/magicui/grid-pattern'
import { StripedPattern } from '../registry/magicui/striped-pattern'
import { CTASection } from '../components/ui/cta-with-rectangle'
import { cn } from '../lib/utils'

// Animated counter
function Counter({ target, suffix, duration = 2 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const end = parseInt(target, 10)
    const totalMs = duration * 1000
    const stepTime = Math.max(Math.floor(totalMs / end), 15)
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMs / stepTime))
      if (start >= end) { clearInterval(timer); setCount(end) }
      else setCount(start)
    }, stepTime)
    return () => clearInterval(timer)
  }, [inView, target, duration])

  return (
    <span ref={ref} className="about-stat-num font-display">
      {count}<sup>{suffix}</sup>
    </span>
  )
}

// Reveal on scroll wrapper
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: { opacity: 1, y: 0, x: 0 }
  }
  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// These will be populated from translation files
const getStripItems = (t) => {
  const items = [
    t('footer.badges.authentic').replace('🛡️ ', ''),
    t('trustbar.shipping.title').toUpperCase(),
    t('announcement.cod').split(' ').slice(0, 4).join(' ').toUpperCase(),
    '100% VERIFIED',
    'ALGIERS — DZ',
    'EST. 2019',
  ]
  // Duplicate for seamless scrolling
  return [...items, ...items]
}

const getFeatures = (t) => [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: t('whyUs.features.authentic.title'),
    desc: t('whyUs.features.authentic.desc')
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: t('whyUs.features.delivery.title'),
    desc: t('whyUs.features.delivery.desc')
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
    ),
    title: t('whyUs.features.certified.title'),
    desc: t('whyUs.features.certified.desc')
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title: t('whyUs.features.support.title'),
    desc: t('whyUs.features.support.desc')
  },
]

const getStats = (t) => [
  { num: 5,    suffix: '+',  label: t('about.stats.years') },
  { num: 5000, suffix: '+',  label: t('about.stats.athletes') },
  { num: 58,   suffix: '',   label: 'WILAYAS DELIVERED' },
  { num: 100,  suffix: '%',  label: t('about.stats.authentic') },
]

const PRODUCTS = [
  { img: '/images/whey-protein-concentrate.jpg',  label: 'WHEY PROTEIN' },
  { img: '/images/creatine-creapure.jpg',          label: 'CREATINE' },
  { img: '/images/eliminate-preworkout.jpg',        label: 'PRE-WORKOUT' },
]

export default function AboutPage() {
  const { t } = useTranslation()

  // Get dynamic data from translations
  const STRIP_ITEMS = getStripItems(t)
  const FEATURES = getFeatures(t)
  const STATS = getStats(t)

  // Force white body background for this page
  useEffect(() => {
    document.body.style.background = '#ffffff'
    document.documentElement.style.background = '#ffffff'
    return () => {
      document.body.style.background = ''
      document.documentElement.style.background = ''
    }
  }, [])

  // Also set it immediately on mount via a style tag
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'about-page-override'
    style.textContent = 'html, body { background: #ffffff !important; }'
    document.head.appendChild(style)
    return () => {
      const el = document.getElementById('about-page-override')
      if (el) el.remove()
    }
  }, [])

  return (
    <div className="about-page">

      {/* ── HERO ── */}
      <section className="about-hero">
        <div className="about-hero__photo-overlay" />
        <div className="about-hero__noise" />
        <div className="about-hero__grid" />
        <div className="about-hero__glow" />

        <div className="about-hero__content">
          <motion.div
            className="about-hero__eyebrow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="about-hero__eyebrow-line" />
            {t('whyUs.est')} — ALGER, DZ
            <span className="about-hero__eyebrow-line" />
          </motion.div>

          <motion.h1
            className="about-hero__title font-display"
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            FLEX
            <span>SUPPS</span>
          </motion.h1>

          <div className="about-hero__flip-tagline">
            <Text3DFlip
              className="about-hero__flip-text"
              textClassName="about-hero__flip-char"
              flipTextClassName="about-hero__flip-char"
              rotateDirection="top"
              staggerDuration={0.035}
              staggerFrom="first"
              transition={{ type: 'spring', damping: 22, stiffness: 150 }}
            >
              {t('about.tagline')}
            </Text3DFlip>
          </div>

          <motion.p
            className="about-hero__sub"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {t('about.story1Sub')}
          </motion.p>

          <motion.div
            className="about-hero__cta font-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1, delay: 1.4 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            {t('about.scrollDown')}
          </motion.div>
        </div>
      </section>

      {/* ── RED SCROLLING STRIP ── */}
      <div className="about-red-strip">
        <div className="about-red-strip__track">
          {STRIP_ITEMS.concat(STRIP_ITEMS).map((item, i) => (
            <span key={i} className="about-red-strip__item">
              {item}
              <span className="about-red-strip__dot" />
            </span>
          ))}
        </div>
      </div>

      {/* ── WHAT MAKES US DIFFERENT ── */}
      <section className="about-diff">
        <GridPattern
          squares={[[4,4],[5,1],[8,2],[5,3],[5,5],[10,10],[12,15],[15,10],[10,15],[15,10],[10,15],[15,10]]}
          className={cn(
            'text-red-500/10',
            '[mask-image:radial-gradient(500px_circle_at_center,white,transparent)]',
            'inset-x-0 inset-y-[-30%] h-[200%] skew-y-12'
          )}
        />
        <div className="about-diff__shell">
          <Reveal>
            <h2 className="about-diff__title font-display">{t('whyUs.title')}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="about-diff__body">
              {t('about.story1Sub')}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="about-diff__body">
              {t('about.story3Sub')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── FOUNDERS STORY STRIP ── */}
      <div className="about-story-strip" style={{ position: 'relative', overflow: 'hidden' }}>
        <StripedPattern 
          className="text-white opacity-[0.15]"
        />
        <div style={{ width: 'min(1100px, calc(100vw - 60px))', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 className="font-display">{t('whyUs.manifestoEyebrow')}</h2>
        </div>
      </div>

      {/* ── STORY BODY ── */}
      <section className="about-story">
        <div className="about-story__shell">
          <Reveal>
            <p className="about-story__p">
              {t('whyUs.highlight')}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="about-story__p">
              {t('about.story2Sub')}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="about-story__p">
              {t('whyUs.body')}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="about-stats">
        <div className="about-stats__shell">
          <Reveal>
            <span className="about-stats__label">{t('about.statsTitle').split(' ').slice(0, 2).join(' ')}</span>
            <h2 className="about-stats__title font-display">{t('about.statsTitle')}</h2>
          </Reveal>
          <div className="about-stats__grid">
            {STATS.map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="about-stat-card">
                  <Counter target={s.num} suffix={s.suffix} />
                  <span className="about-stat-lbl font-display">{s.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT SHOWCASE ── */}
      <section className="about-products">
        <div className="about-products__shell">
          <Reveal>
            <h2 className="about-products__title font-display">{t('catalog.title')}</h2>
          </Reveal>
          <div className="about-products__grid">
            {PRODUCTS.map((p, i) => (
              <Reveal key={i} delay={i * 0.1} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <a href="/shop" className="about-product-card" style={{ display: 'block', textDecoration: 'none' }}>
                  <img src={p.img} alt={p.label} />
                  <div className="about-product-card__label font-display">{p.label}</div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="about-features">
        <div className="about-features__shell">
          <Reveal>
            <h2 className="about-features__title font-display">{t('whyUs.eyebrow')}</h2>
          </Reveal>
          <div className="about-features__grid">
            {FEATURES.map((f, i) => (
              <Reveal key={i} delay={i * 0.08} direction={i % 2 === 0 ? 'left' : 'right'}>
                <div className="about-feature-item">
                  <div className="about-feature-icon">{f.icon}</div>
                  <div className="about-feature-text">
                    <h3 className="font-display">{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT CTA with Rectangle Pattern ── */}
      <CTASection
        badge={{
          text: t('about.contactEyebrow')
        }}
        title={t('about.contactTitle')}
        description={t('contact.desc')}
        action={{
          text: t('about.whatsappBtn'),
          href: "https://wa.me/213553628299"
        }}
        contactInfo={[
          {
            label: t('contact.address').replace(':', '').replace(' ', ''),
            value: "Daly Ibrahim, Algiers",
            href: "https://maps.app.goo.gl/XB5kVT4Wv1t8pqKA9"
          },
          {
            label: t('about.phone'),
            value: "+213 553 62 82 99",
            href: "tel:+213553628299"
          },
          {
            label: t('about.instagram'),
            value: "@flex_supps_",
            href: "https://www.instagram.com/flex_supps_/"
          },
          {
            label: "FACEBOOK",
            value: "Flex Supps",
            href: "https://www.facebook.com/61573073240674"
          }
        ]}
        withGlow={true}
      />

      {/* Remove the old contact meta section */}

      {/* ── BOTTOM TICKER ── */}
      <div className="about-ticker">
        <div className="about-ticker__track">
          {Array(6).fill(null).map((_, i) => (
            <span key={i}>
              <span className="about-ticker__item about-ticker__item--white font-display">{t('ticker').split('.')[0]}.</span>
              <span className="about-ticker__item about-ticker__item--red font-display">{t('ticker').split('.')[1]}.</span>
            </span>
          ))}
          {Array(6).fill(null).map((_, i) => (
            <span key={`b${i}`}>
              <span className="about-ticker__item about-ticker__item--white font-display">{t('ticker').split('.')[0]}.</span>
              <span className="about-ticker__item about-ticker__item--red font-display">{t('ticker').split('.')[1]}.</span>
            </span>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  )
}
