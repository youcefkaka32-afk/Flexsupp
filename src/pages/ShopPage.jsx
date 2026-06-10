import { useEffect } from 'react'
import Categories from '../components/Categories/Categories'
import Products   from '../components/Products/Products'
import Footer     from '../components/Footer/Footer'

export default function ShopPage() {
  useEffect(() => {
    document.body.style.background = '#ffffff'
    document.documentElement.style.background = '#ffffff'
    return () => {
      document.body.style.background = ''
      document.documentElement.style.background = ''
    }
  }, [])

  return (
    <div className="boutique-page-wrapper" style={{ background: '#ffffff' }}>
      <Products />
      <Categories />
      <Footer />
    </div>
  )
}
