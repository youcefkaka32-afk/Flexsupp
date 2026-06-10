import React from 'react'
import Hero             from '../components/Hero/Hero'
import SubHeroPromo     from '../components/SubHeroPromo/SubHeroPromo'
import TrustBar         from '../components/WhyUs/TrustBar'
import TabbedCatalog    from '../components/FeaturedProducts/TabbedCatalog'
import Brands           from '../components/Brands/Brands'
import ProductReviews   from '../components/ProductReviews/ProductReviews'
import WorkBanner       from '../components/CTABanner/WorkBanner'
import NewProducts      from '../components/FeaturedProducts/NewProducts'
import ToolsCalculators from '../components/Tools/ToolsCalculators'
import SocialGrid       from '../components/Social/SocialGrid'
import TickerStrip      from '../components/Social/TickerStrip'
import Footer           from '../components/Footer/Footer'

export default function HomePage() {
  return (
    <>
      {/* 1. Untouched WebGL Hero Slider */}
      <Hero />

      {/* 2. Sub-Hero Promo Banner (Next Evolution of Fitness) */}
      <SubHeroPromo />

      {/* 3. Trust Bar */}
      <TrustBar />

      {/* 4. Tabbed Supplement Catalog Grid */}
      <TabbedCatalog />

      {/* 5. Brand Logos Marquee */}
      <Brands />

      {/* 6. Product Reviews Section */}
      <ProductReviews />

      {/* 7. Let's Get to Work Split Banner */}
      <WorkBanner />

      {/* 8. New Products Shelf */}
      <NewProducts />

      {/* 9. Tools & Calculators */}
      <ToolsCalculators />

      {/* 10. Social / Instagram Feed Grid */}
      <SocialGrid />

      {/* 11. Repeating Ticker Strip */}
      <TickerStrip />

      {/* 12. Footer */}
      <Footer />
    </>
  )
}
