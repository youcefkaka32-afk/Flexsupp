/**
 * Text3DFlip — MagicUI Registry Component
 * Each character flips in 3D from the specified direction on mount/trigger.
 * Supports stagger, spring transitions, and direction variants.
 */
import { motion } from 'framer-motion'

const DIRECTIONS = {
  top:    { rotateX:  90, rotateY:   0 },
  bottom: { rotateX: -90, rotateY:   0 },
  left:   { rotateX:   0, rotateY:  90 },
  right:  { rotateX:   0, rotateY: -90 },
}

export default function Text3DFlip({
  children,
  className = '',
  textClassName = '',
  flipTextClassName = '',   // accepted for API compat — applied to each char
  rotateDirection = 'top',
  staggerDuration = 0.04,
  staggerFrom = 'first',   // 'first' | 'last' | 'center' | 'random'
  transition = { type: 'spring', damping: 25, stiffness: 160 },
}) {
  const text = typeof children === 'string' ? children : ''
  const chars = text.split('')
  const total = chars.length

  const initialRotate = DIRECTIONS[rotateDirection] ?? DIRECTIONS.top

  const getDelay = (index) => {
    switch (staggerFrom) {
      case 'last':
        return (total - 1 - index) * staggerDuration
      case 'center': {
        const center = Math.floor(total / 2)
        return Math.abs(index - center) * staggerDuration
      }
      case 'random':
        return Math.random() * staggerDuration * total
      default: // 'first'
        return index * staggerDuration
    }
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        perspective: '600px',
        perspectiveOrigin: 'center',
      }}
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className={flipTextClassName || textClassName}
          style={{
            display: 'inline-block',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
          initial={{ ...initialRotate, opacity: 0 }}
          animate={{ rotateX: 0, rotateY: 0, opacity: 1 }}
          transition={{
            ...transition,
            delay: getDelay(i),
            opacity: { duration: 0.01, delay: getDelay(i) }, // snap opacity
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}
