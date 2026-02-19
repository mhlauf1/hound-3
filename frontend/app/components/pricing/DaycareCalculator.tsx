'use client'

import {useState, useMemo} from 'react'
import {NumberStepper, RadioGroup, ContactNotice} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {calculateDaycare} from '@/app/data/pricingData'
import type {DayType, DaycarePackage} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type DaycareCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

export default function DaycareCalculator({ctaText, ctaLink, taxNote}: DaycareCalculatorProps) {
  const [dogs, setDogs] = useState(1)
  const [dayType, setDayType] = useState<DayType>('full')
  const [pkg, setPkg] = useState<DaycarePackage>('single')
  const [days, setDays] = useState(1)

  const result = useMemo(
    () => calculateDaycare({dogs, dayType, pkg, days}),
    [dogs, dayType, pkg, days],
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

        <RadioGroup
          label="Day Type"
          options={[
            {label: 'Full Day', value: 'full'},
            {label: 'Half Day (4 hrs)', value: 'half'},
          ]}
          value={dayType}
          onChange={(v) => setDayType(v as DayType)}
        />

        <RadioGroup
          label="Package"
          options={[
            {label: 'Single Days', value: 'single'},
            {label: '5-Day Package', value: '5-day'},
            {label: '10-Day Package', value: '10-day'},
            {label: '20-Day Package', value: '20-day'},
          ]}
          value={pkg}
          onChange={(v) => setPkg(v as DaycarePackage)}
        />

        {pkg === 'single' && (
          <NumberStepper label="Number of Days" value={days} min={1} max={30} onChange={setDays} />
        )}
      </div>

      {/* Output */}
      <PriceOutputCard
        total={result.total}
        lineItems={result.lineItems}
        ctaText={ctaText}
        ctaLink={ctaLink}
        taxNote={taxNote}
        savings={result.savings}
        savingsLabel="Package savings"
      />
    </div>
  )
}
