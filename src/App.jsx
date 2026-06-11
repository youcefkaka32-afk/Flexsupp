import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect, lazy, Suspense } from 'react'
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
import Loader          from './components/Loader/Loader'

// Lazy-load pages — each becomes its own JS chunk
const HomePage   = lazy(() => import('./pages/HomePage'))
const ShopPage   = lazy(() => import('./pages/ShopPage'))
const ProductPage = lazy(() => import('./pages/ProductPage'))
const AboutPage  = lazy(() => import('./pages/AboutPage'))
const AdminPage  = lazy(() => import('./pages/AdminPage'))


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
  const [loading, setLoading] = useState(true)
  const isAdmin = typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')
  
  useEffect(() => {
    if (isAdmin) {
      document.body.style.overflow = ''
      return
    }
    if (loading) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [loading, isAdmin])

  return (
    <CartProvider>
      <BrowserRouter>
        {!isAdmin && loading && <Loader onComplete={() => setLoading(false)} />}
        <AnimatedRoutes />
      </BrowserRouter>
    </CartProvider>
  )
}
