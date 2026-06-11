import { useState, useEffect, useRef } from 'react'
import './LazyImage.css'

export default function LazyImage({ src, alt, className = '', ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { 
        rootMargin: '120px', // start loading slightly before they scroll in
        threshold: 0.01 
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

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
