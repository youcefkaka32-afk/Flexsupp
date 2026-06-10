import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
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
import HomePage        from './pages/HomePage'
import ShopPage        from './pages/ShopPage'
import ProductPage     from './pages/ProductPage'
import AboutPage       from './pages/AboutPage'
import AdminPage       from './pages/AdminPage'


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
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/shop" element={<PageTransition><ShopPage /></PageTransition>} />
          <Route path="/boutique/:id" element={<PageTransition><ProductPage /></PageTransition>} />
          <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // prevent scroll while loading
    if (loading) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  }, [loading])

  return (
    <CartProvider>
      <BrowserRouter>
        {loading && <Loader onComplete={() => setLoading(false)} />}
        <AnimatedRoutes />
        <CartDrawer />
        <CheckoutModal />
        <ScrollToTop />
      </BrowserRouter>
    </CartProvider>
  )
}
