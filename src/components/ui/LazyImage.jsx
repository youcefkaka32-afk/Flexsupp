import { useState, useEffect, useRef } from 'react'
import './LazyImage.css'

export default function LazyImage({ src, alt, className = '', ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    // If IntersectionObserver isn't supported, load immediately
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    // Check if already in viewport on mount (handles above-the-fold images)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight + 300 && rect.bottom > -300) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { 
        rootMargin: '400px', // preload aggressively before scrolling in
        threshold: 0 
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={`lazy-image-container ${loaded ? 'is-loaded' : ''}`}
    >
      {/* Brutalist design hairline framework corners */}
      <span className="lazy-image-corner lazy-image-corner--tl" />
      <span className="lazy-image-corner lazy-image-corner--br" />

      {/* Shimmer overlay while image loads */}
      {!loaded && (
        <div className="lazy-image-placeholder">
          <div className="lazy-image-shimmer" />
        </div>
      )}

      {inView && (
        <img
          src={src}
          alt={alt}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className={`lazy-image-el ${loaded ? 'is-visible' : ''} ${className}`}
          {...props}
        />
      )}
    </div>
  )
}


