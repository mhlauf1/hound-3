'use client'

import {FadeIn} from '@/app/components/ui/FadeIn'
import Badge from '@/app/components/ui/Badge'
import DaycareCalculator from '@/app/components/pricing/DaycareCalculator'
import BoardingCalculator from '@/app/components/pricing/BoardingCalculator'
import GroomingCalculator from '@/app/components/pricing/GroomingCalculator'
import type {DereferencedLink} from '@/sanity/lib/types'

type PricingCalculatorProps = {
  block: {
    eyebrow?: string
    heading?: string
    subheading?: string
    calculatorType?: 'daycare' | 'boarding' | 'grooming'
    ctaText?: string
    ctaLink?: DereferencedLink
    taxNote?: string
  }
  index: number
  pageId: string
  pageType: string
}

const calculators = {
  daycare: DaycareCalculator,
  boarding: BoardingCalculator,
  grooming: GroomingCalculator,
} as const

export default function PricingCalculator({block}: PricingCalculatorProps) {
  const {eyebrow, heading, subheading, calculatorType, ctaText, ctaLink, taxNote} = block

  const Calculator = calculatorType ? calculators[calculatorType] : null

  return (
    <section className="bg-forest text-cream rounded-[48px] mx-3 md:mx-6">
      <div className="px-6 md:px-16 lg:px-24 py-16 lg:py-24">
        {/* Header */}
        <FadeIn>
          <div className="max-w-2xl mb-10 lg:mb-14">
            {eyebrow && (
              <Badge className="mb-3 !bg-forest-card !text-cream/80 !border-border-dark">
                {eyebrow}
              </Badge>
            )}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] leading-[105%] text-cream mb-4">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="font-sans text-[16px] md:text-[18px] leading-[150%] text-cream/70">
                {subheading}
              </p>
            )}
          </div>
        </FadeIn>

        {/* Calculator */}
        <FadeIn delay={0.1}>
          {Calculator ? (
            <Calculator ctaText={ctaText} ctaLink={ctaLink} taxNote={taxNote} />
          ) : (
            <p className="font-sans text-cream/50">No calculator type selected.</p>
          )}
        </FadeIn>
      </div>
    </section>
  )
}
