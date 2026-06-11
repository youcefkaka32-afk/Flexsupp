import React, { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import './text-animate.css'

/**
 * TextAnimate
 * Props:
 * - animation: 'blurInUp' | 'fadeInUp' (affects initial style)
 * - by: 'character' | 'word'
 * - once: boolean (only animate once when entering view)
 * - delay: number (seconds)
 * - stagger: number (seconds between children)
 */
export default function TextAnimate({
  children,
  animation = 'blurInUp',
  by = 'character',
  once = true,
  delay = 0,
  stagger = 0.04,
  className = '',
  ...props
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once })
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') {
      setRevealed(true)
      return
    }
    if (window.revealSite) {
      setRevealed(true)
      return
    }
    const interval = setInterval(() => {
      if (window.revealSite) {
        setRevealed(true)
        clearInterval(interval)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : ''
  const units = by === 'word' ? text.split(/(\s+)/) : Array.from(text)

  const container = {
    hidden: {},
    visible: { transition: { when: 'beforeChildren', staggerChildren: stagger, delay } },
  }

  const child = {
    hidden: {
      opacity: 0,
      y: 10,
      filter: animation === 'blurInUp' ? 'blur(6px)' : 'none',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'none',
      transition: { duration: 0.48, ease: [0.2, 0.8, 0.2, 1] },
    },
  }

  return (
    <motion.span
      ref={ref}
      className={`ta-root ${className}`.trim()}
      initial="hidden"
      animate={inView && revealed ? 'visible' : 'hidden'}
      variants={container}
      aria-hidden={false}
      {...props}
    >
      {units.map((u, i) => {
        const isSpace = /^\s+$/.test(u)
        const content = isSpace ? '\u00A0' : u
        return (
          <motion.span
            key={`${i}-${u}`}
            variants={child}
            className={`ta-unit ${by === 'word' ? 'ta-word' : 'ta-char'}`}
            aria-hidden={false}
          >
            {content}
          </motion.span>
        )
      })}
    </motion.span>
  )
}
