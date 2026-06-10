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

export default function Loader({ onComplete }) {
  const [exiting, setExiting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [animatedProgress, setAnimatedProgress] = useState(0)
  
  const done = useRef(false)
  const isFirstLoad = useRef(sessionStorage.getItem('loader_shown') !== 'true').current

  // Mouse Glow Position Tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { damping: 45, stiffness: 250 })
  const springY = useSpring(mouseY, { damping: 45, stiffness: 250 })

  useEffect(() => {
    // Initial mouse center coordinates
    mouseX.set(window.innerWidth / 2)
    mouseY.set(window.innerHeight / 2)

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  // LERP progress smooth animation
  useEffect(() => {
    if (!isFirstLoad) return

    let rAF
    const updateAnimatedProgress = () => {
      setAnimatedProgress((prev) => {
        const diff = progress - prev
        if (Math.abs(diff) < 0.05) {
          if (progress === 100 && !exiting) {
            // Initiate exit sequence
            setExiting(true)
            setTimeout(() => {
              onComplete?.()
            }, 1200) // Staggered delay + wipe finish
          }
          return progress
        }
        return prev + diff * 0.08 // smooth interpolation factor
      })
      rAF = requestAnimationFrame(updateAnimatedProgress)
    }
    rAF = requestAnimationFrame(updateAnimatedProgress)
    return () => cancelAnimationFrame(rAF)
  }, [progress, exiting, onComplete, isFirstLoad])

  // Real Byte-level loading
  useEffect(() => {
    if (done.current) return
    done.current = true

    if (!isFirstLoad) {
      // Skip loader and trigger quick red flash
      setTimeout(() => onComplete?.(), 350)
      return
    }

    sessionStorage.setItem('loader_shown', 'true')

    const assets = [
      { url: '/flexlgo.svg', size: 2263162 },
      { url: '/flexlgo.png', size: 1012724 },
      { url: '/images/HEROMAINIMAGElol.png', size: 1632328 },
      { url: '/images/c4_desktop_70e66224-52c0-46d5-b5a9-86620b340202.jpg', size: 411191 },
      { url: '/images/evl_desktop_0b65638c-50ae-47d4-9f34-47bf6d136326.jpg', size: 457766 },
      { url: '/images/mass_desktop.jpg', size: 653047 },
      { url: '/images/nutrex_desktop_4cf46f31-4a8d-4ace-a1c8-9abc2010b7ca.jpg', size: 413475 },
      { url: '/fitness.mp4', size: 6096441 }
    ]

    const totalBytes = assets.reduce((acc, curr) => acc + curr.size, 0)
    const loadedBytesMap = {}

    // Initialize map with 0s
    assets.forEach(a => { loadedBytesMap[a.url] = 0 })

    // Safeguard timeout (6 seconds max)
    const safeguardTimer = setTimeout(() => {
      setProgress(100)
    }, 6000)

    const updateProgress = () => {
      const currentLoaded = Object.values(loadedBytesMap).reduce((acc, curr) => acc + curr, 0)
      const pct = Math.min(Math.floor((currentLoaded / totalBytes) * 100), 100)
      setProgress((prev) => Math.max(prev, pct))
    }

    const loadAsset = async (asset) => {
      try {
        const response = await fetch(asset.url)
        if (!response.body) {
          loadedBytesMap[asset.url] = asset.size
          updateProgress()
          return
        }

        const reader = response.body.getReader()
        let receivedBytes = 0

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          receivedBytes += value.length
          loadedBytesMap[asset.url] = receivedBytes
          updateProgress()
        }
      } catch (err) {
        console.warn(`Asset preloading failed for ${asset.url}:`, err)
        loadedBytesMap[asset.url] = asset.size
        updateProgress()
      }
    }

    assets.forEach(loadAsset)

    return () => {
      clearTimeout(safeguardTimer)
    }
  }, [isFirstLoad, onComplete])

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

  // Calculate current phrase
  const phraseIndex = Math.min(
    Math.floor((animatedProgress / 100) * BRAND_PHRASES.length),
    BRAND_PHRASES.length - 1
  )
  const currentPhrase = BRAND_PHRASES[phraseIndex]

  return (
    <div className={`page-loader ${progress === 100 ? 'is-ready' : ''}`}>
      {/* Stochastic Curtain Grid Rise */}
      <div className="page-loader__curtains">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="page-loader__curtain"
            initial={{ y: '0%' }}
            animate={exiting ? { y: '-100%' } : { y: '0%' }}
            transition={{
              duration: 0.9,
              ease: [0.85, 0, 0.15, 1],
              delay: i === 0 ? 0.05 : i === 1 ? 0.22 : i === 2 ? 0.12 : 0.28 // Stochastic stagger
            }}
          />
        ))}
      </div>

      {/* Grid line framework */}
      <div className="page-loader__grid-line page-loader__grid-line--v1" />
      <div className="page-loader__grid-line page-loader__grid-line--v2" />
      <div className="page-loader__grid-line page-loader__grid-line--h1" />
      <div className="page-loader__grid-line page-loader__grid-line--h2" />

      {/* Interactive glowing halo */}
      <motion.div
        className="loader-radial-glow"
        style={{ left: springX, top: springY }}
      />

      {/* Fine technical scanlines */}
      <div className="loader-scanlines" />

      {/* Loader Interface content */}
      <motion.div
        className="page-loader__content"
        animate={exiting ? { opacity: 0, scale: 0.95, y: -30 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="loader-corners" />

        {/* Liquid filled logo */}
        <div className="page-loader__logo-wrapper">
          <img src="/flexlgo.png" className="logo-base" alt="" />
          <div className="logo-fill" style={{ height: `${animatedProgress}%` }}>
            <img src="/flexlgo.png" className="logo-vivid" alt="FLEX SUPPS" />
          </div>
        </div>

        {/* Typography block */}
        <div className="page-loader__info">
          <span className="loader-percent font-display">
            {Math.round(animatedProgress).toString().padStart(3, '0')}%
          </span>
          <span className="loader-phrase">
            {currentPhrase}
          </span>
        </div>
      </motion.div>
    </div>
  )
}
