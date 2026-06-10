import React from 'react'
import { ScrollVelocityContainer, ScrollVelocityRow } from '../../registry/magicui/scroll-based-velocity'
import { useStoreData } from '../../hooks/useStoreData'

export default function ScrollBasedVelocityImagesDemo() {
  const { data } = useStoreData()

  const MARQUEE_BRAND_NAMES = [
    'Optimum Nutrition',
    'MyProtein',
    'Scitec Nutrition',
    'BioTechUSA',
    'BSN',
    'MuscleTech',
    'Cellucor',
    'Dymatize',
    'REDCON1',
    'Mutant',
  ]

  const logos = MARQUEE_BRAND_NAMES
    .map((name) => data?.brands?.find((b) => b.name.toLowerCase() === name.toLowerCase())?.logo)
    .filter(Boolean)

  if (!logos || logos.length === 0) return null

  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-8">
      <ScrollVelocityContainer className="w-full">
        <ScrollVelocityRow baseVelocity={6} direction={1} className="py-4">
          {logos.map((src, idx) => (
            <div key={`a-${idx}`} className="brand-logo-item">
              <img
                src={src}
                alt={`brand-${idx}`}
                loading="lazy"
                decoding="async"
                className="brand-logo-img"
              />
            </div>
          ))}
        </ScrollVelocityRow>

        <ScrollVelocityRow baseVelocity={6} direction={-1} className="py-4">
          {logos.map((src, idx) => (
            <div key={`b-${idx}`} className="brand-logo-item">
              <img
                src={src}
                alt={`brand-${idx}`}
                loading="lazy"
                decoding="async"
                className="brand-logo-img"
              />
            </div>
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>

      <div className="from-background pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r" />
      <div className="from-background pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l" />
    </div>
  )
}
