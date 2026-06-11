import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

/* ─────────────────────────────────────────────────────────
   PageTransition — animates on navigations BETWEEN pages
   ───────────────────────────────────────────────────────── */

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.52,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.06,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.18,
      ease: [0.55, 0, 1, 0.45],
    },
  },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{ width: '100%', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  )
}

/* ─────────────────────────────────────────────────────────
   PageCurtain — red stripe sweep on navigation
   ───────────────────────────────────────────────────────── */
export function PageCurtain() {
  const location = useLocation()

  return (
    <AnimatePresence>
      <motion.div
        key={`curtain-${location.pathname}`}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #E31B23 0%, #ff6b6b 50%, #E31B23 100%)',
          zIndex: 99999,
          transformOrigin: 'left center',
          pointerEvents: 'none',
          willChange: 'transform',
        }}
        initial={{ scaleX: 0, opacity: 1 }}
        animate={[
          { scaleX: 1, transition: { duration: 0.38, ease: [0.76, 0, 0.24, 1] } },
          { opacity: 0, transition: { duration: 0.22, delay: 0.1 } },
        ]}
        exit={{ opacity: 0, transition: { duration: 0 } }}
      />
    </AnimatePresence>
  )
}
