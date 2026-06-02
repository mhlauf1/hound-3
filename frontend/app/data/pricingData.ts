// ─── Daycare ────────────────────────────────────────────────
export type DayType = 'full' | 'half'
export type DaycarePackage = 'single' | '10-day' | '20-day' | '30-day'

// Flat single-day rates, charged per dog (no multi-dog discount on daycare).
const daycareSingleRates: Record<DayType, number> = {
  full: 39,
  half: 29,
}

// Full-day-only package bundles — fixed total price per dog.
const daycarePackagePrices: Record<Exclude<DaycarePackage, 'single'>, number> = {
  '10-day': 350,
  '20-day': 660,
  '30-day': 935,
}

const packageDays: Record<DaycarePackage, number | null> = {
  single: null,
  '10-day': 10,
  '20-day': 20,
  '30-day': 30,
}

export type DaycareDogConfig = {
  id: string
  dayType: DayType
  pkg: DaycarePackage
  days: number
}

export type LineItem = {label: string; amount: number; displayPrice?: string}

export type DaycarePerDogResult = {
  total: number
  lineItems: LineItem[]
  savings: number | null
}

export function calculateDaycarePerDog(input: {dogs: DaycareDogConfig[]}): DaycarePerDogResult {
  const {dogs} = input
  const lineItems: LineItem[] = []
  let total = 0
  let totalSavings = 0
  let hasSavings = false

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'

    if (dog.pkg === 'single') {
      const perDay = daycareSingleRates[dog.dayType]
      const cost = perDay * dog.days
      const dayTypeLabel = dog.dayType === 'full' ? 'Full Day' : 'Half Day'
      lineItems.push({
        label: `${dogLabel} — ${dayTypeLabel} (${dog.days} day${dog.days > 1 ? 's' : ''} @ $${perDay})`,
        amount: cost,
      })
      total += cost
    } else {
      // Packages are full-day only, priced as a fixed bundle total.
      const cost = daycarePackagePrices[dog.pkg]
      const numDays = packageDays[dog.pkg] ?? 0
      const pkgLabel = dog.pkg.replace('-day', '-Day')
      lineItems.push({
        label: `${dogLabel} — Full Day, ${pkgLabel} Pkg (${numDays} days)`,
        amount: cost,
      })
      total += cost

      // Savings vs. paying the full-day single rate for the same number of days.
      totalSavings += daycareSingleRates.full * numDays - cost
      hasSavings = true
    }
  }

  return {total, lineItems, savings: hasSavings ? totalSavings : null}
}

// ─── Boarding ───────────────────────────────────────────────
export type BoardingAddOn = 'medication' | 'puppyPads' | 'dryFood' | 'chickenRice'

const boardingAddOns: Record<BoardingAddOn, {label: string; perDay: number}> = {
  medication: {label: 'Medication Administration', perDay: 3},
  puppyPads: {label: 'Puppy Pads', perDay: 3},
  dryFood: {label: 'Dry Food', perDay: 4},
  chickenRice: {label: 'Chicken & Rice', perDay: 6},
}

export const boardingAddOnOptions = Object.entries(boardingAddOns).map(([key, val]) => ({
  id: key as BoardingAddOn,
  label: val.label,
  perDay: val.perDay,
}))

export type BoardingDogConfig = {
  id: string
  nights: number
  addOns: BoardingAddOn[]
}

// Flat standard nightly rate; each additional dog gets the second-dog discount.
const BOARDING_NIGHTLY_RATE = 59
const SECOND_DOG_DISCOUNT = 0.15

export type BoardingPerDogResult = {
  total: number
  lineItems: LineItem[]
  includes: string[]
}

export function calculateBoardingPerDog(input: {dogs: BoardingDogConfig[]}): BoardingPerDogResult {
  const {dogs} = input
  const lineItems: LineItem[] = []
  let total = 0

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const rate = i === 0 ? BOARDING_NIGHTLY_RATE : BOARDING_NIGHTLY_RATE * (1 - SECOND_DOG_DISCOUNT)
    const cost = rate * dog.nights

    const dogLabel = dogs.length > 1 ? `Dog ${i + 1}` : 'Your dog'
    const discountNote = i === 0 ? '' : ' (15% off)'
    lineItems.push({
      label: `${dogLabel} — ${dog.nights} night${dog.nights > 1 ? 's' : ''} @ $${rate}/night${discountNote}`,
      amount: cost,
    })
    total += cost

    for (const addOn of dog.addOns) {
      const info = boardingAddOns[addOn]
      const addOnCost = info.perDay * dog.nights
      lineItems.push({
        label: `${dogLabel} — ${info.label} ($${info.perDay}/day)`,
        amount: addOnCost,
      })
      total += addOnCost
    }
  }

  return {
    total,
    lineItems,
    includes: ['Indoor/outdoor play', 'Supervised group play', 'Feeding (your food)', 'Bedding provided'],
  }
}

// ─── Grooming ───────────────────────────────────────────────
export type GroomingService = 'fullBath' | 'fullGroom'
export type DogSize = 's' | 'm' | 'l' | 'xl'
export type HairType = 'short' | 'long'
export type GroomingAddOn =
  | 'nailTrim'
  | 'nailTrimGrind'
  | 'teethBrushing'
  | 'earCleaning'
  | 'glandExpression'
  | 'deShed'
  | 'mattingFee'
  | 'handlingFee'
  | 'scissoringFee'
  | 'lateFee'
export type GroomingMode = 'fullService' | 'alaCarte'
export type DogConfig = {id: string; size: DogSize; hairType: HairType}

const groomingRates: Record<GroomingService, Partial<Record<DogSize, Partial<Record<HairType, number | null>>>>> = {
  fullBath: {
    s: {short: 50, long: 55},
    m: {short: 60, long: 70},
    l: {short: 75, long: 80},
    xl: {short: 90, long: 95},
  },
  fullGroom: {
    s: {short: 80, long: 80},
    m: {short: 95, long: 95},
    l: {short: 130, long: 130},
    xl: {short: 145, long: 145},
  },
}

type GroomingAddOnInfo = {
  label: string
  price?: number
  priceRange?: [number, number]
  note?: string
}

const groomingAddOns: Record<GroomingAddOn, GroomingAddOnInfo> = {
  nailTrim: {label: 'Nail Trim', price: 20},
  nailTrimGrind: {label: 'Nail Trim & Grind', price: 25},
  teethBrushing: {label: 'Teeth Brushing', price: 15},
  earCleaning: {label: 'Ear Cleaning', price: 12},
  glandExpression: {label: 'Gland Expression', price: 17, note: 'External'},
  deShed: {label: 'De-Shed Services', priceRange: [20, 30]},
  mattingFee: {label: 'Matting Fee', priceRange: [15, 45]},
  handlingFee: {label: 'Handling Fee', price: 10, note: 'Starting at'},
  scissoringFee: {label: 'Scissoring Fee', priceRange: [10, 30], note: 'Long, breed, or styled trims'},
  lateFee: {label: 'Late Fee', price: 1, note: 'Per minute, after 15-min grace'},
}

export const groomingAddOnOptions = Object.entries(groomingAddOns).map(([key, val]) => ({
  id: key as GroomingAddOn,
  label: val.label,
  price: val.price,
  priceRange: val.priceRange,
  note: val.note,
}))

export const sizeLabels: Record<DogSize, string> = {
  s: 'Small (1–25 lbs)',
  m: 'Medium (26–50 lbs)',
  l: 'Large (51–75 lbs)',
  xl: 'XL (76+ lbs)',
}

export const shortSizeLabels: Record<DogSize, string> = {
  s: 'Small',
  m: 'Medium',
  l: 'Large',
  xl: 'XL',
}

export const serviceLabels: Record<GroomingService, string> = {
  fullBath: 'Full Service Bath',
  fullGroom: 'Full Service Groom',
}

export function getAvailableSizes(service: GroomingService): DogSize[] {
  return Object.keys(groomingRates[service]) as DogSize[]
}

export function isHairTypeRelevant(service: GroomingService): boolean {
  return service !== 'fullGroom'
}

const fullServiceIncludes: Record<GroomingService, string[]> = {
  fullBath: ['Shampoo & conditioner', 'Blow dry', 'Brush out', 'Nail trim', 'Ear cleaning'],
  fullGroom: [
    'Shampoo & conditioner',
    'Blow dry',
    'Brush out',
    'Full body haircut',
    'Nail trim',
    'Ear cleaning',
  ],
}

const timeEstimates: Record<GroomingService, string> = {
  fullBath: '1–1.5 hrs',
  fullGroom: '2–3 hrs',
}

export const FACE_FEET_SANI_TRIM_LABEL = 'Face, Feet & Sani trim'
export const FACE_FEET_SANI_TRIM_RANGE: [number, number] = [20, 25]

export type GroomingFullServiceResult = {
  total: number
  lineItems: LineItem[]
  includes: string[]
  timeEstimate: string
  isUnavailable: boolean
  unavailableMessage: string | null
}

export function calculateGroomingFullService(input: {
  service: GroomingService
  dogs: DogConfig[]
  addFaceFeetSaniTrim?: boolean
}): GroomingFullServiceResult {
  const {service, dogs, addFaceFeetSaniTrim} = input
  const lineItems: LineItem[] = []
  let total = 0

  for (let i = 0; i < dogs.length; i++) {
    const dog = dogs[i]
    const sizeRates = groomingRates[service][dog.size]
    if (!sizeRates) {
      return {
        total: 0,
        lineItems: [],
        includes: [],
        timeEstimate: '',
        isUnavailable: true,
        unavailableMessage: `${serviceLabels[service]} is not available for ${sizeLabels[dog.size]} dogs.`,
      }
    }
    const effectiveHairType = isHairTypeRelevant(service) ? dog.hairType : 'short'
    const price = sizeRates[effectiveHairType]
    if (price === null || price === undefined) {
      return {
        total: 0,
        lineItems: [],
        includes: [],
        timeEstimate: '',
        isUnavailable: true,
        unavailableMessage: `${serviceLabels[service]} is not available for ${sizeLabels[dog.size]} dogs with ${effectiveHairType} hair.`,
      }
    }
    total += price
    const dogLabel = dogs.length > 1 ? `Dog ${i + 1} (${shortSizeLabels[dog.size]})` : shortSizeLabels[dog.size]
    lineItems.push({
      label: `${dogLabel} — ${serviceLabels[service]}`,
      amount: price,
    })
  }

  if (addFaceFeetSaniTrim && service === 'fullBath') {
    const [low, high] = FACE_FEET_SANI_TRIM_RANGE
    lineItems.push({
      label: dogs.length > 1 ? `${FACE_FEET_SANI_TRIM_LABEL} × ${dogs.length}` : FACE_FEET_SANI_TRIM_LABEL,
      amount: 0,
      displayPrice: `$${low}–$${high} (varies)`,
    })
  }

  return {
    total,
    lineItems,
    includes: fullServiceIncludes[service],
    timeEstimate: timeEstimates[service],
    isUnavailable: false,
    unavailableMessage: null,
  }
}

export type GroomingAlaCarteResult = {
  total: number
  lineItems: LineItem[]
}

export function calculateGroomingAlaCarte(input: {
  dogs: DogConfig[]
  selectedItems: GroomingAddOn[]
}): GroomingAlaCarteResult {
  const {dogs, selectedItems} = input
  if (selectedItems.length === 0) {
    return {total: 0, lineItems: []}
  }

  const lineItems: LineItem[] = []
  let total = 0

  for (const addOn of selectedItems) {
    const info = groomingAddOns[addOn]

    if (info.priceRange) {
      const [low, high] = info.priceRange
      lineItems.push({
        label: dogs.length > 1 ? `${info.label} × ${dogs.length}` : info.label,
        amount: 0,
        displayPrice: `$${low}–$${high} (varies)`,
      })
      continue
    }

    const price = info.price ?? 0
    const cost = price * dogs.length
    total += cost
    lineItems.push({
      label: dogs.length > 1 ? `${info.label} × ${dogs.length}` : info.label,
      amount: cost,
    })
  }

  return {total, lineItems}
}
