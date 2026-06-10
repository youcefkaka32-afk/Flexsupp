import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './CustomCursor.css'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const [isHidden, setIsHidden] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Detect touch device
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (touch) {
      setIsTouchDevice(true)
      return
    }

    // Enable custom cursor styling on html tag
    document.documentElement.classList.add('custom-cursor-active')

    const cursor = cursorRef.current

    // QuickTo setters for smooth lag
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power2.out' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power2.out' })

    const handleMouseMove = (e) => {
      // Position cursor
      xTo(e.clientX)
      yTo(e.clientY)

      // Check if hovering hero section
      const overHero = e.target.closest('#hero')
      if (overHero) {
        setIsHidden(true)
      } else {
        setIsHidden(false)
      }
    }

    const handleMouseEnterWindow = () => {
      setIsHidden(false)
    }

    const handleMouseLeaveWindow = () => {
      setIsHidden(true)
    }

    // Listen for hovers on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target
      const isInteractive = 
        target.closest('a') || 
        target.closest('button') || 
        target.closest('select') || 
        target.closest('input') || 
        target.closest('[role="button"]') ||
        target.closest('.interactive-hover')

      if (isInteractive) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseleave', handleMouseLeaveWindow)
    document.addEventListener('mouseenter', handleMouseEnterWindow)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseleave', handleMouseLeaveWindow)
      document.removeEventListener('mouseenter', handleMouseEnterWindow)
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }, [])

  if (isTouchDevice) return null

  return (
    <div
      ref={cursorRef}
      className={`global-custom-cursor${isHidden ? ' is-hidden' : ''}${isHovered ? ' is-hovered' : ''}`}
    />
  )
}
