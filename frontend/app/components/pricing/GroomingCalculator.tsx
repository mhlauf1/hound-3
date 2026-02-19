'use client'

import {useState, useMemo, useCallback} from 'react'
import {NumberStepper, RadioGroup, CheckboxGroup, ContactNotice} from './CalculatorInputs'
import PriceOutputCard from './PriceOutputCard'
import {
  calculateGrooming,
  getAvailableSizes,
  isHairTypeRelevant,
  groomingAddOnOptions,
  sizeLabels,
  serviceLabels,
} from '@/app/data/pricingData'
import type {GroomingService, DogSize, HairType, GroomingAddOn} from '@/app/data/pricingData'
import type {DereferencedLink} from '@/sanity/lib/types'

type GroomingCalculatorProps = {
  ctaText?: string
  ctaLink?: DereferencedLink
  taxNote?: string
}

export default function GroomingCalculator({ctaText, ctaLink, taxNote}: GroomingCalculatorProps) {
  const [dogs, setDogs] = useState(1)
  const [service, setService] = useState<GroomingService>('fullBath')
  const [size, setSize] = useState<DogSize>('m')
  const [hairType, setHairType] = useState<HairType>('short')
  const [addOns, setAddOns] = useState<GroomingAddOn[]>([])

  const availableSizes = useMemo(() => getAvailableSizes(service), [service])
  const showHairType = isHairTypeRelevant(service)

  // Derive effective size — if current size isn't available for the service, use the first available
  const effectiveSize = availableSizes.includes(size) ? size : availableSizes[0]

  const handleServiceChange = useCallback(
    (v: string) => {
      const newService = v as GroomingService
      setService(newService)
      const newSizes = getAvailableSizes(newService)
      if (!newSizes.includes(size)) {
        setSize(newSizes[0])
      }
    },
    [size],
  )

  const result = useMemo(
    () => calculateGrooming({dogs, service, size: effectiveSize, hairType, addOns}),
    [dogs, service, effectiveSize, hairType, addOns],
  )

  if (dogs > 3) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
      {/* Inputs */}
      <div className="space-y-6">
        <NumberStepper label="Number of Dogs" value={dogs} min={1} max={10} onChange={setDogs} />

        <RadioGroup
          label="Service Type"
          options={Object.entries(serviceLabels).map(([value, label]) => ({label, value}))}
          value={service}
          onChange={handleServiceChange}
        />

        <RadioGroup
          label="Dog Size"
          options={availableSizes.map((s) => ({label: sizeLabels[s], value: s}))}
          value={effectiveSize}
          onChange={(v) => setSize(v as DogSize)}
        />

        {showHairType && (
          <RadioGroup
            label="Hair Type"
            options={[
              {label: 'Short Hair', value: 'short'},
              {label: 'Long Hair', value: 'long'},
            ]}
            value={hairType}
            onChange={(v) => setHairType(v as HairType)}
          />
        )}

        <CheckboxGroup
          label="Add-Ons"
          options={groomingAddOnOptions.map((a) => {
            const isLarge = effectiveSize === 'l' || effectiveSize === 'xl'
            const price = isLarge && a.priceL ? a.priceL : a.price
            return {
              id: a.id,
              label: a.label,
              detail: `$${price}`,
            }
          })}
          selected={addOns}
          onChange={(selected) => setAddOns(selected as GroomingAddOn[])}
        />
      </div>

      {/* Output */}
      <PriceOutputCard
        total={result.total}
        lineItems={result.lineItems}
        ctaText={ctaText}
        ctaLink={ctaLink}
        taxNote={taxNote}
        disabled={result.isUnavailable}
        disabledMessage={result.unavailableMessage}
        timeEstimate={result.timeEstimate}
      />
    </div>
  )
}
