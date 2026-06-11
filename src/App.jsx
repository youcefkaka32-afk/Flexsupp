import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import './styles/global.css'
import './styles/mobile-enhancements.css'
import './styles/mobile-scale-fix.css'
import { CartProvider } from './context/CartContext'
import CartDrawer      from './components/Cart/CartDrawer'
import CheckoutModal   from './components/Checkout/CheckoutModal'
import Navbar          from './components/Navbar/Navbar'
import PageTransition, { PageCurtain } from './components/PageTransition/PageTransition'
import CustomCursor    from './components/CustomCursor/CustomCursor'
import AnnouncementBar from './components/AnnouncementBar/AnnouncementBar'
import ScrollToTop     from './components/ui/ScrollToTop'
import LoaderReveal    from './components/Loader/LoaderReveal'

// Video loader available but not used
// import LoaderRevealVideo from './components/Loader/LoaderRevealVideo'

// Lazy-load pages — each becomes its own JS chunk
const HomePage   = lazy(() => import('./pages/HomePage'))
const ShopPage   = lazy(() => import('./pages/ShopPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const AboutPage  = lazy(() => import('./pages/AboutPage'))
const AdminPage  = lazy(() => import('./pages/AdminPage'))

// Tool pages
const BMICalculator = lazy(() => import('./pages/Tools/BMICalculator'))
const CalorieCalculator = lazy(() => import('./pages/Tools/CalorieCalculator'))
const BodyTypes = lazy(() => import('./pages/Tools/BodyTypes'))
const WorkoutPlanning = lazy(() => import('./pages/Tools/WorkoutPlanning'))


function AnimatedRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  return (
    <>
      {!isAdmin && <AnnouncementBar />}
      {!isAdmin && <Navbar />}
      {!isAdmin && <CustomCursor />}
      {!isAdmin && <PageCurtain />}
      <AnimatePresence mode="wait">
        <Suspense fallback={null}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
            <Route path="/boutique/:id" element={<PageTransition><ProductPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/tools/bmi-calculator" element={<PageTransition><BMICalculator /></PageTransition>} />
            <Route path="/tools/calorie-calculator" element={<PageTransition><CalorieCalculator /></PageTransition>} />
            <Route path="/tools/body-types" element={<PageTransition><BodyTypes /></PageTransition>} />
            <Route path="/tools/workout-planning" element={<PageTransition><WorkoutPlanning /></PageTransition>} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      {!isAdmin && <CartDrawer />}
      {!isAdmin && <CheckoutModal />}
      {!isAdmin && <ScrollToTop />}
    </>
  )
}

export default function App() {
  const [revealComplete, setRevealComplete] = useState(false)
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
  
  // Check if first load
  const forceFirstLoad = typeof window !== 'undefined' && window.location.search.includes('firstload')
  const isFirstLoad = forceFirstLoad || (typeof window !== 'undefined' && sessionStorage.getItem('loader_shown') !== 'true')

  console.log('[App] 🎬 Starting with:', { isFirstLoad, forceFirstLoad, revealComplete })

  useEffect(() => {
    if (isAdmin) {
      document.body.style.overflow = ''
      setRevealComplete(true)
      return
    }
    // Lock scroll during reveal
    if (!revealComplete) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [revealComplete, isAdmin])

  return (
    <CartProvider>
      <BrowserRouter>
        {/* Content - hide completely until reveal on first load */}
        <motion.div
          initial={{ opacity: isFirstLoad ? 0 : 1 }}
          animate={{ opacity: revealComplete || !isFirstLoad ? 1 : 0 }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: 0,
          }}
          style={{ 
            width: '100%', 
            minHeight: '100vh',
          }}
        >
          <AnimatedRoutes />
        </motion.div>

        {/* Curtain reveal overlay - lifts away to reveal content */}
        {!isAdmin && (
          <LoaderReveal 
            isFirstLoad={isFirstLoad}
            onComplete={() => {
              console.log('[App] ✅ Reveal complete')
              setRevealComplete(true)
            }}
          />
        )}
      </BrowserRouter>
    </CartProvider>
  )
}
