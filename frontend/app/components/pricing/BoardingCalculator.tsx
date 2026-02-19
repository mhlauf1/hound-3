'use client'

import {useState, useMemo} from 'react'
import {NumberStepper, CheckboxGroup, ContactNotice} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {calculateBoarding, boardingAddOnOptions} from '@/app/data/pricingData'
import type {BoardingAddOn} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type BoardingCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

export default function BoardingCalculator({ctaText, ctaLink, taxNote}: BoardingCalculatorProps) {
  const [dogs, setDogs] = useState(1)
  const [nights, setNights] = useState(1)
  const [addOns, setAddOns] = useState<BoardingAddOn[]>([])

  const result = useMemo(
    () => calculateBoarding({dogs, nights, addOns}),
    [dogs, nights, addOns],
  )

  if (dogs > 3) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
        <div className="space-y-6">
          <NumberStepper label="Number of Dogs" value={dogs} min={1} max={10} onChange={setDogs} />
          <ContactNotice />
        </div>
        <PriceOutputCard
          total={0}
          lineItems={[]}
          ctaText="Call Us"
          ctaLink={{_type: 'link', linkType: 'href', href: 'tel:6517889797'}}
          taxNote={taxNote}
          disabled
          disabledMessage="Please call for custom pricing for 4+ dogs."
        />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
      {/* Inputs */}
      <div className="space-y-6">
        <NumberStepper label="Number of Dogs" value={dogs} min={1} max={10} onChange={setDogs} />

        <NumberStepper
          label="Number of Nights"
          value={nights}
          min={1}
          max={30}
          onChange={setNights}
          badge={result.isExtendedStay ? 'Extended stay rate!' : null}
        />

        <CheckboxGroup
          label="Add-Ons"
          options={boardingAddOnOptions.map((a) => ({
            id: a.id,
            label: a.label,
            detail: `$${a.perDay}/day`,
          }))}
          selected={addOns}
          onChange={(selected) => setAddOns(selected as BoardingAddOn[])}
        />
      </div>

      {/* Output */}
      <PriceOutputCard
        total={result.total}
        lineItems={result.lineItems}
        ctaText={ctaText}
        ctaLink={ctaLink}
        taxNote={taxNote}
        includes={result.includes}
        badge={result.isExtendedStay ? 'Extended Stay' : null}
      />
    </div>
  )
}
