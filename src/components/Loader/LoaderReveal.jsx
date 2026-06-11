import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
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

/**
 * LoaderReveal - Full loader with progress counter + curtain reveal
 */
export default function LoaderReveal({ isFirstLoad, onComplete }) {
  const [progress, setProgress] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  const [startCurtainLift, setStartCurtainLift] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  
  const done = useRef(false)
  const finishTriggered = useRef(false)

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

  // Smooth progress animation
  useEffect(() => {
    if (!isFirstLoad) return

    let rAF
    const animate = () => {
      setAnimatedProgress((prev) => {
        const diff = progress - prev
        const absDiff = Math.abs(diff)
        const factor = 0.22
        if (absDiff < 0.6) {
          if (progress === 100 && !finishTriggered.current) {
            finishTriggered.current = true
            console.log('[LoaderReveal] 🎬 100% reached - starting curtain lift in 0.4s')
            // Wait a beat at 100%, then lift curtains
            setTimeout(() => {
              console.log('[LoaderReveal] 🎬 Lifting curtains')
              setStartCurtainLift(true)
            }, 400)
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
      finishTriggered.current = false
    }
  }, [progress, isFirstLoad])

  // Progress driver
  useEffect(() => {
    if (done.current) return
    done.current = true

    if (!isFirstLoad) {
      // Repeat visit - quick flash
      console.log('[LoaderReveal] Repeat visit - quick exit')
      setTimeout(() => {
        setIsComplete(true)
        onComplete?.()
      }, 350)
      return
    }

    // First load - drive progress 0→100
    console.log('[LoaderReveal] First load - starting progress')
    let raf
    const DURATION = 1300
    const start = performance.now()

    const step = (ts) => {
      const elapsed = Math.max(0, ts - start)
      const pct = Math.min(100, Math.floor((elapsed / DURATION) * 100))
      setProgress((prev) => Math.max(prev, pct))

      if (elapsed >= DURATION) {
        setProgress(100)
        return
      }
      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => {
      if (raf) cancelAnimationFrame(raf)
      done.current = false
    }
  }, [isFirstLoad, onComplete])

  // Complete after curtains lift
  useEffect(() => {
    if (startCurtainLift) {
      // Trigger content fade immediately when curtains start
      console.log('[LoaderReveal] 🎬 Curtains lifting - triggering content reveal')
      onComplete?.()
      
      const timer = setTimeout(() => {
        console.log('[LoaderReveal] ✅ Curtains fully lifted - marking complete')
        setIsComplete(true)
        try {
          sessionStorage.setItem('loader_shown', 'true')
        } catch (e) {}
      }, 1400) // Curtain animation + buffer

      return () => clearTimeout(timer)
    }
  }, [startCurtainLift, onComplete])

  if (isComplete) return null

  const phraseIndex = Math.min(
    Math.floor((animatedProgress / 100) * BRAND_PHRASES.length),
    BRAND_PHRASES.length - 1
  )
  const currentPhrase = BRAND_PHRASES[phraseIndex]

  return (
    <div className="loader-reveal-wrapper">
      {/* The 4 curtains */}
      <div className="page-loader__curtains">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="page-loader__curtain"
            initial={{ y: '0%' }}
            animate={startCurtainLift ? { y: '-100%' } : { y: '0%' }}
            transition={{
              duration: 1.2,
              ease: [0.85, 0, 0.15, 1],
              delay: i === 0 ? 0.05 : i === 1 ? 0.22 : i === 2 ? 0.12 : 0.28
            }}
            style={{
              position: 'fixed',
              top: 0,
              left: `${i * 25}%`,
              width: '25%',
              height: '100vh',
              background: '#0a0a0a',
              zIndex: 99998,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* Grid lines */}
      {isFirstLoad && (
        <>
          <div className="page-loader__grid-line page-loader__grid-line--v1" style={{ zIndex: 99999 }} />
          <div className="page-loader__grid-line page-loader__grid-line--v2" style={{ zIndex: 99999 }} />
          <div className="page-loader__grid-line page-loader__grid-line--h1" style={{ zIndex: 99999 }} />
          <div className="page-loader__grid-line page-loader__grid-line--h2" style={{ zIndex: 99999 }} />
        </>
      )}

      {/* Mouse glow */}
      {isFirstLoad && <motion.div className="loader-radial-glow" style={{ left: springX, top: springY, zIndex: 99999 }} />}

      {/* Scanlines */}
      {isFirstLoad && <div className="loader-scanlines" style={{ zIndex: 99999 }} />}

      {/* Lightning animation - Lottie behind logo */}
      {isFirstLoad && !startCurtainLift && (
        <>
          {/* White flash overlay synchronized with lightning */}
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'white',
              zIndex: 99999,
              pointerEvents: 'none',
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [
                0, 0, 0, 0.15, 0, 0,  // First flash
                0, 0, 0.12, 0, 0,     // Second flash
                0, 0, 0, 0.18, 0, 0,  // Third flash
                0, 0, 0.1, 0, 0,      // Fourth flash
                0, 0, 0, 0.2, 0.15, 0 // Fifth flash (double)
              ]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: 'easeOut',
              times: [
                0, 0.05, 0.08, 0.09, 0.1, 0.15,
                0.2, 0.25, 0.26, 0.27, 0.32,
                0.4, 0.48, 0.52, 0.53, 0.54, 0.6,
                0.65, 0.7, 0.71, 0.72, 0.78,
                0.85, 0.88, 0.92, 0.93, 0.94, 1
              ]
            }}
          />
          
          {/* Lottie lightning animation */}
          <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99997,
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <DotLottieReact
              src="/lightning.lottie"
              loop
              autoplay
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '1200px',
                maxHeight: '1200px',
              }}
            />
          </div>
        </>
      )}

      {/* Loader content */}
      <AnimatePresence>
        {isFirstLoad && (
          <motion.div
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={startCurtainLift ? { opacity: 0, scale: 0.95, y: -30 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div className="page-loader__content">
              <div className="loader-corners" />

              <div className="page-loader__logo-wrapper">
                <motion.img 
                  src="/flexlgo.png" 
                  className="logo-base" 
                  alt=""
                  animate={{ scale: [0.95, 1.05] }}
                  transition={{ 
                    duration: 1.3, 
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  style={{ 
                    imageRendering: '-webkit-optimize-contrast',
                    backfaceVisibility: 'hidden',
                    transform: 'translateZ(0)'
                  }}
                />
                <div className="logo-fill" style={{ height: `${animatedProgress}%` }}>
                  <motion.img 
                    src="/flexlgo.png" 
                    className="logo-vivid" 
                    alt="FLEX SUPPS"
                    animate={{ scale: [0.95, 1.05] }}
                    transition={{ 
                      duration: 1.3, 
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    style={{ 
                      imageRendering: '-webkit-optimize-contrast',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                  />
                </div>
              </div>

              <div className="page-loader__info">
                <span className="loader-percent font-display">
                  {Math.round(animatedProgress).toString().padStart(3, '0')}%
                </span>
                <span className="loader-phrase">{currentPhrase}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Repeat visit flash */}
      {!isFirstLoad && (
        <motion.div
          className="page-loader-flash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            background: '#0a0a0a',
            zIndex: 99999,
          }}
        />
      )}
    </div>
  )
}
