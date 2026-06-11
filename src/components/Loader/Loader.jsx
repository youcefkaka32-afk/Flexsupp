import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import './Loader.css'

const BRAND_PHRASES = [
  'SYSTEM: INITIALIZING...',
  'GEAR: CALIBRATING POWER...',
  'ACTION: SHATTER LIMITS...',
  'ENERGY: RESTLESS FORCE...',
  'DRIVE: RAW INTENSITY...',
  'FUEL: SCIENTIFIC MASS...',
  'FLEX: UNLEASH THE BEAST...',
  'LOAD: COMPLETED.'
]

export default function Loader({ onComplete, onExitStart }) {
  const [exiting, setExiting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const done = useRef(false)
  const isFirstLoad = useRef(
    typeof window !== 'undefined' 
      ? sessionStorage.getItem('loader_shown') !== 'true'
      : true
  ).current
  const finishTriggered = useRef(false)

  // Debug logging
  useEffect(() => {
    console.log('[Loader] isFirstLoad:', isFirstLoad)
    console.log('[Loader] sessionStorage.loader_shown:', typeof window !== 'undefined' ? sessionStorage.getItem('loader_shown') : 'N/A')
  }, [])

  // Mouse Glow Position Tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { damping: 45, stiffness: 250 })
  const springY = useSpring(mouseY, { damping: 45, stiffness: 250 })

  useEffect(() => {
    if (typeof window === 'undefined') return
    mouseX.set(window.innerWidth / 2)
    mouseY.set(window.innerHeight / 2)

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // Smoothly animate `animatedProgress` toward `progress`
  // THIS is the single source of truth for triggering exit —
  // only fires when the *visual* counter has actually reached 100%.
  useEffect(() => {
    if (!isFirstLoad) return

    let rAF
    const animate = () => {
      setAnimatedProgress((prev) => {
        const diff = progress - prev
        const absDiff = Math.abs(diff)
        const factor = 0.22
        if (absDiff < 0.6) {
          // snap to target and trigger exit if finished
          if (progress === 100 && !exiting && !finishTriggered.current) {
            finishTriggered.current = true
            console.log('🎬 Loader reached 100% — calling onExitStart and starting curtain lift')
            setExiting(true)
            onExitStart?.()
            setTimeout(() => {
              console.log('✅ Loader complete — marking loader_shown in sessionStorage')
              try { sessionStorage.setItem('loader_shown', 'true') } catch (e) {}
              onComplete?.()
            }, 1600)
          }
          return progress
        }
        return prev + diff * factor
      })
      rAF = requestAnimationFrame(animate)
    }
    rAF = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(rAF)
      // Reset so StrictMode's double-mount doesn't block the exit trigger
      finishTriggered.current = false
    }
  }, [progress, exiting, onComplete, isFirstLoad, onExitStart])

  // Deterministic progress driver — replace fragile byte-tracking
  useEffect(() => {
    if (done.current) return
    done.current = true

    if (!isFirstLoad) {
      console.log('[Loader] Repeat visit detected — showing flash')
      // fast skip for repeat visits
      // Start flash exit immediately, trigger reveal AFTER flash is gone
      setTimeout(() => {
        console.log('[Loader] Flash complete — calling onComplete')
        try { sessionStorage.setItem('loader_shown', 'true') } catch (e) {}
        onComplete?.()
      }, 380)
      // Trigger content reveal just before flash completes
      setTimeout(() => {
        console.log('[Loader] Triggering onExitStart for content reveal')
        onExitStart?.()
      }, 300)
      return
    }

    let raf
    const DURATION = 1300
    const start = performance.now()

    // This timer ONLY drives setProgress from 0→100.
    // Exit is handled exclusively by the smooth interpolator above.
    const step = (ts) => {
      const elapsed = Math.max(0, ts - start)
      const pct = Math.min(100, Math.floor((elapsed / DURATION) * 100))
      setProgress((prev) => Math.max(prev, pct))

      if (elapsed >= DURATION) {
        // Ensure we land exactly at 100 — the interpolator will
        // detect this and trigger the exit sequence.
        setProgress(100)
        return
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      // Reset so the effect can run again after StrictMode's double-mount
      done.current = false
    }
  }, [isFirstLoad])

  if (!isFirstLoad) {
    return (
      <motion.div
        className="page-loader-flash"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      />
    )
  }

  const phraseIndex = Math.min(
    Math.floor((animatedProgress / 100) * BRAND_PHRASES.length),
    BRAND_PHRASES.length - 1
  )
  const currentPhrase = BRAND_PHRASES[phraseIndex]

  return (
    <div className={`page-loader ${progress === 100 ? 'is-ready' : ''} ${exiting ? 'is-exiting' : ''}`}>
      <div className="page-loader__curtains">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="page-loader__curtain"
            initial={{ y: '0%' }}
            animate={exiting ? { y: '-100%' } : { y: '0%' }}
            transition={{
              duration: 1.1,
              ease: [0.85, 0, 0.15, 1],
              delay: i === 0 ? 0.1 : i === 1 ? 0.26 : i === 2 ? 0.16 : 0.32
            }}
          />
        ))}
      </div>

      <div className="page-loader__grid-line page-loader__grid-line--v1" />
      <div className="page-loader__grid-line page-loader__grid-line--v2" />
      <div className="page-loader__grid-line page-loader__grid-line--h1" />
      <div className="page-loader__grid-line page-loader__grid-line--h2" />

      <motion.div className="loader-radial-glow" style={{ left: springX, top: springY }} />

      <div className="loader-scanlines" />

      <motion.div
        className="page-loader__content"
        animate={exiting ? { opacity: 0, scale: 0.95, y: -30 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="loader-corners" />

        <div className="page-loader__logo-wrapper">
          <img src="/flexlgo.png" className="logo-base" alt="" />
          <div className="logo-fill" style={{ height: `${animatedProgress}%` }}>
            <img src="/flexlgo.png" className="logo-vivid" alt="FLEX SUPPS" />
          </div>
        </div>

        <div className="page-loader__info">
          <span className="loader-percent font-display">
            {Math.round(animatedProgress).toString().padStart(3, '0')}%
          </span>
          <span className="loader-phrase">{currentPhrase}</span>
        </div>
      </motion.div>
    </div>
  )
}
