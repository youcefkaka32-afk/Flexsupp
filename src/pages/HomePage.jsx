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
      <Hero />
      <SubHeroPromo />
      <TrustBar />
      <TabbedCatalog />
      <Brands />
      <ProductReviews />
      <WorkBanner />
      <NewProducts />
      <ToolsCalculators />
      <SocialGrid />
      <TickerStrip />
      <Footer />
    </>
  )
}
