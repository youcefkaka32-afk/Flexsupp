import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import './Loader.css'

/**
 * LoaderRevealVideo - Video-based loader with curtain reveal
 */
export default function LoaderRevealVideo({ isFirstLoad, onComplete }) {
  const [startCurtainLift, setStartCurtainLift] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (!isFirstLoad) {
      // Repeat visit - quick flash
      console.log('[LoaderRevealVideo] Repeat visit - quick exit')
      setTimeout(() => {
        setIsComplete(true)
        onComplete?.()
      }, 350)
      return
    }

    // First load - play video then lift curtains
    console.log('[LoaderRevealVideo] First load - playing video')

    const video = videoRef.current
    if (video) {
      video.play().catch(e => console.error('Video play failed:', e))

      // When video ends, start curtain lift
      const handleVideoEnd = () => {
        console.log('[LoaderRevealVideo] 🎬 Video ended - starting curtain lift in 0.3s')
        setTimeout(() => {
          setStartCurtainLift(true)
        }, 300)
      }

      video.addEventListener('ended', handleVideoEnd)
      return () => video.removeEventListener('ended', handleVideoEnd)
    }
  }, [isFirstLoad, onComplete])

  // Complete after curtains lift
  useEffect(() => {
    if (startCurtainLift) {
      // Trigger content fade immediately when curtains start
      console.log('[LoaderRevealVideo] 🎬 Curtains lifting - triggering content reveal')
      onComplete?.()
      
      const timer = setTimeout(() => {
        console.log('[LoaderRevealVideo] ✅ Curtains fully lifted - marking complete')
        setIsComplete(true)
        try {
          sessionStorage.setItem('loader_shown', 'true')
        } catch (e) {}
      }, 1400)

      return () => clearTimeout(timer)
    }
  }, [startCurtainLift, onComplete])

  if (isComplete) return null

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

      {/* Video loader content */}
      {isFirstLoad && !startCurtainLift && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: startCurtainLift ? 0 : 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
            background: '#0a0a0a',
          }}
        >
          <video
            ref={videoRef}
            src="/images/Logo_asset_functioning_as_loader_202606111727.mp4"
            muted
            playsInline
            style={{
              maxWidth: '90%',
              maxHeight: '90%',
              width: 'auto',
              height: 'auto',
              objectFit: 'contain',
            }}
          />
        </motion.div>
      )}

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
