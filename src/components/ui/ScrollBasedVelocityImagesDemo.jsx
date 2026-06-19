import React, { useRef, useEffect, useState } from 'react'
import { useStoreData } from '../../hooks/useStoreData'
import './BrandsMarquee.css'

const MARQUEE_BRAND_NAMES = [
  'Optimum Nutrition',
  'MyProtein',
  'Scitec Nutrition',
  'BioTechUSA',
  'BSN',
  'MuscleTech',
  'Cellucor',
  'Dymatize',
  'REDCON1',
  'Mutant',
]

// Brands that need a larger logo display
const LARGE_LOGOS = ['myprotein']

function MarqueeRow({ logos, reverse = false, speed = 30 }) {
  const trackRef = useRef(null)
  const animRef = useRef(null)
  const posRef = useRef(0)          // current X offset in px
  const draggingRef = useRef(false)
  const startXRef = useRef(0)
  const startPosRef = useRef(0)
  const pausedRef = useRef(false)
  const singleWidthRef = useRef(0)

  // Duplicate logos 4× so we always have enough content for seamless loop
  const items = [...logos, ...logos, ...logos, ...logos]

  const isLarge = (src) => LARGE_LOGOS.some(name => src?.toLowerCase().includes(name))
  const direction = reverse ? 1 : -1  // -1 = scroll left, 1 = scroll right

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    // Measure single copy width (total / 4 copies)
    const measure = () => {
      singleWidthRef.current = track.scrollWidth / 4
      // Start position: if reverse, start from -singleWidth so it scrolls right back to 0
      if (reverse) {
        posRef.current = -singleWidthRef.current
      } else {
        posRef.current = 0
      }
    }

    // Wait a tick for images to load before measuring
    requestAnimationFrame(() => {
      measure()
      startLoop()
    })

    let lastTime = null
    const SPEED_PX_PER_S = singleWidthRef.current / speed || 200

    function step(ts) {
      if (!pausedRef.current && !draggingRef.current) {
        const delta = lastTime ? (ts - lastTime) / 1000 : 0
        lastTime = ts

        const pixelsPerSecond = (singleWidthRef.current || 1500) / speed
        posRef.current += direction * pixelsPerSecond * delta

        // Clamp to loop seamlessly
        if (!reverse && posRef.current <= -singleWidthRef.current) {
          posRef.current += singleWidthRef.current
        } else if (reverse && posRef.current >= 0) {
          posRef.current -= singleWidthRef.current
        }
      } else {
        lastTime = ts  // reset so we don't jump on resume
      }

      if (track) {
        track.style.transform = `translateX(${posRef.current}px)`
      }

      animRef.current = requestAnimationFrame(step)
    }

    function startLoop() {
      animRef.current = requestAnimationFrame(step)
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [logos.length, reverse, speed])

  // ── Touch / Mouse drag handlers ──────────────────────────
  function onPointerDown(e) {
    draggingRef.current = true
    startXRef.current = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    startPosRef.current = posRef.current
  }

  function onPointerMove(e) {
    if (!draggingRef.current) return
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    const delta = clientX - startXRef.current
    posRef.current = startPosRef.current + delta

    // Clamp loop while dragging
    const sw = singleWidthRef.current || 1500
    if (posRef.current < -sw * 2) posRef.current += sw
    if (posRef.current > sw) posRef.current -= sw
  }

  function onPointerUp() {
    draggingRef.current = false
  }

  const shouldNoInvert = (src) => {
    const s = src?.toLowerCase() || ''
    return s.includes('redcon1') || s.includes('mutant') || s.includes('muscletech')
  }

  return (
    <div
      className="bm-row-wrapper"
      onMouseDown={onPointerDown}
      onMouseMove={onPointerMove}
      onMouseUp={onPointerUp}
      onMouseLeave={onPointerUp}
      onTouchStart={onPointerDown}
      onTouchMove={onPointerMove}
      onTouchEnd={onPointerUp}
    >
      <div ref={trackRef} className="bm-track" style={{ cursor: 'grab' }}>
        {items.map((src, i) => (
          <div key={i} className={`bm-logo-tile${isLarge(src) ? ' bm-logo-tile--large' : ''}`}>
            <img
              src={src}
              alt=""
              className={shouldNoInvert(src) ? 'no-invert' : ''}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ScrollBasedVelocityImagesDemo() {
  const { data } = useStoreData()

  const logos = MARQUEE_BRAND_NAMES
    .map((name) => data?.brands?.find((b) => b.name.toLowerCase() === name.toLowerCase())?.logo)
    .filter(Boolean)

  if (!logos || logos.length === 0) return null

  return (
    <div className="bm-desktop-wrapper">
      <MarqueeRow logos={logos} reverse={false} speed={100} />
      <MarqueeRow logos={logos} reverse={true}  speed={120} />
    </div>
  )
}
