// ─── Daycare ────────────────────────────────────────────────
export type DayType = 'full' | 'half'
export type DaycarePackage = 'single' | '5-day' | '10-day' | '20-day'

const daycareRates: Record<DaycarePackage, Record<DayType, {first: number; additional: number}>> = {
  single: {
    full: {first: 35, additional: 30},
    half: {first: 27, additional: 25},
  },
  '5-day': {
    full: {first: 33, additional: 28},
    half: {first: 33, additional: 28},
  },
  '10-day': {
    full: {first: 32, additional: 27},
    half: {first: 32, additional: 27},
  },
  '20-day': {
    full: {first: 31, additional: 26},
    half: {first: 31, additional: 26},
  },
}

const packageDays: Record<DaycarePackage, number | null> = {
  single: null,
  '5-day': 5,
  '10-day': 10,
  '20-day': 20,
}

export type DaycareInput = {
  dogs: number
  dayType: DayType
  pkg: DaycarePackage
  days: number // only used when pkg === 'single'
}

export type LineItem = {label: string; amount: number}

export type DaycareResult = {
  total: number
  lineItems: LineItem[]
  savings: number | null
  perDayRate: number
}

export function calculateDaycare(input: DaycareInput): DaycareResult {
  const {dogs, dayType, pkg, days} = input
  const rate = daycareRates[pkg][dayType]
  const numDays = packageDays[pkg] ?? days
  const perDay = rate.first + Math.max(0, dogs - 1) * rate.additional
  const total = perDay * numDays

  const lineItems: LineItem[] = [
    {label: `1st dog × ${numDays} day${numDays > 1 ? 's' : ''}`, amount: rate.first * numDays},
  ]
  if (dogs > 1) {
    lineItems.push({
      label: `${dogs - 1} additional dog${dogs > 2 ? 's' : ''} × ${numDays} day${numDays > 1 ? 's' : ''}`,
      amount: rate.additional * (dogs - 1) * numDays,
    })
  }

  let savings: number | null = null
  if (pkg !== 'single') {
    const singleRate = daycareRates.single[dayType]
    const singleTotal = (singleRate.first + Math.max(0, dogs - 1) * singleRate.additional) * numDays
    savings = singleTotal - total
  }

  return {total, lineItems, savings, perDayRate: rate.first}
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

export type BoardingInput = {
  dogs: number
  nights: number
  addOns: BoardingAddOn[]
}

export type BoardingResult = {
  total: number
  lineItems: LineItem[]
  isExtendedStay: boolean
  nightlyRate: number
  includes: string[]
}

export function calculateBoarding(input: BoardingInput): BoardingResult {
  const {dogs, nights, addOns} = input
  const isExtendedStay = nights >= 10
  const firstDogRate = isExtendedStay ? 50 : 55
  const additionalDogRate = isExtendedStay ? 45 : 50

  const firstDogTotal = firstDogRate * nights
  const additionalTotal = Math.max(0, dogs - 1) * additionalDogRate * nights

  const lineItems: LineItem[] = [
    {label: `1st dog × ${nights} night${nights > 1 ? 's' : ''} @ $${firstDogRate}/night`, amount: firstDogTotal},
  ]
  if (dogs > 1) {
    lineItems.push({
      label: `${dogs - 1} additional dog${dogs > 2 ? 's' : ''} × ${nights} night${nights > 1 ? 's' : ''} @ $${additionalDogRate}/night`,
      amount: additionalTotal,
    })
  }

  let addOnTotal = 0
  for (const addOn of addOns) {
    const info = boardingAddOns[addOn]
    const cost = info.perDay * nights * dogs
    addOnTotal += cost
    lineItems.push({
      label: `${info.label} ($${info.perDay}/day × ${dogs} dog${dogs > 1 ? 's' : ''})`,
      amount: cost,
    })
  }

  return {
    total: firstDogTotal + additionalTotal + addOnTotal,
    lineItems,
    isExtendedStay,
    nightlyRate: firstDogRate,
    includes: ['Indoor/outdoor play', 'Supervised group play', 'Feeding (your food)', 'Bedding provided'],
  }
}

// ─── Grooming ───────────────────────────────────────────────
export type GroomingService = 'quickBath' | 'fullBath' | 'fullGroom'
export type DogSize = 'xs' | 's' | 'm' | 'l' | 'xl'
export type HairType = 'short' | 'long'
export type GroomingAddOn = 'nailTrim' | 'teethBrushing' | 'deShed' | 'earCleaning' | 'faceTrim'

const groomingRates: Record<GroomingService, Partial<Record<DogSize, Partial<Record<HairType, number | null>>>>> = {
  quickBath: {
    s: {short: 25, long: 35},
    m: {short: 30, long: 45},
    l: {short: 35, long: 55},
    xl: {short: 50, long: null},
  },
  fullBath: {
    xs: {short: 40, long: 45},
    s: {short: 50, long: 55},
    m: {short: 60, long: 65},
    l: {short: 75, long: 80},
    xl: {short: 90, long: 95},
  },
  fullGroom: {
    xs: {short: 70, long: 70},
    s: {short: 75, long: 75},
    m: {short: 85, long: 85},
    l: {short: 110, long: 110},
    xl: {short: 130, long: 130},
  },
}

const groomingAddOns: Record<GroomingAddOn, {label: string; price: number; priceL?: number}> = {
  nailTrim: {label: 'Nail Trim', price: 17},
  teethBrushing: {label: 'Teeth Brushing', price: 15},
  deShed: {label: 'De-Shed Treatment', price: 24, priceL: 28},
  earCleaning: {label: 'Ear Cleaning', price: 12},
  faceTrim: {label: 'Face Trim', price: 15},
}

export const groomingAddOnOptions = Object.entries(groomingAddOns).map(([key, val]) => ({
  id: key as GroomingAddOn,
  label: val.label,
  price: val.price,
  priceL: val.priceL,
}))

export const sizeLabels: Record<DogSize, string> = {
  xs: 'XS (Under 10 lbs)',
  s: 'Small (10–25 lbs)',
  m: 'Medium (25–50 lbs)',
  l: 'Large (50–80 lbs)',
  xl: 'XL (80+ lbs)',
}

export const serviceLabels: Record<GroomingService, string> = {
  quickBath: 'Quick Bath',
  fullBath: 'Full Service Bath',
  fullGroom: 'Full Service Groom',
}

export function getAvailableSizes(service: GroomingService): DogSize[] {
  return (Object.keys(groomingRates[service]) as DogSize[])
}

export function isHairTypeRelevant(service: GroomingService): boolean {
  return service !== 'fullGroom'
}

export type GroomingInput = {
  dogs: number
  service: GroomingService
  size: DogSize
  hairType: HairType
  addOns: GroomingAddOn[]
}

export type GroomingResult = {
  total: number
  lineItems: LineItem[]
  isUnavailable: boolean
  unavailableMessage: string | null
  timeEstimate: string
}

const timeEstimates: Record<GroomingService, string> = {
  quickBath: '30–45 min',
  fullBath: '1–1.5 hrs',
  fullGroom: '2–3 hrs',
}

export function calculateGrooming(input: GroomingInput): GroomingResult {
  const {dogs, service, size, hairType, addOns} = input
  const sizeRates = groomingRates[service][size]
  if (!sizeRates) {
    return {
      total: 0,
      lineItems: [],
      isUnavailable: true,
      unavailableMessage: `${serviceLabels[service]} is not available for ${sizeLabels[size]} dogs.`,
      timeEstimate: '',
    }
  }

  const effectiveHairType = isHairTypeRelevant(service) ? hairType : 'short'
  const basePrice = sizeRates[effectiveHairType]
  if (basePrice === null || basePrice === undefined) {
    return {
      total: 0,
      lineItems: [],
      isUnavailable: true,
      unavailableMessage: `${serviceLabels[service]} is not available for ${sizeLabels[size]} dogs with ${effectiveHairType} hair.`,
      timeEstimate: '',
    }
  }

  const lineItems: LineItem[] = [
    {label: `${serviceLabels[service]} × ${dogs} dog${dogs > 1 ? 's' : ''}`, amount: basePrice * dogs},
  ]

  let addOnTotal = 0
  for (const addOn of addOns) {
    const info = groomingAddOns[addOn]
    const isLargeSize = size === 'l' || size === 'xl'
    const price = isLargeSize && info.priceL ? info.priceL : info.price
    const cost = price * dogs
    addOnTotal += cost
    lineItems.push({
      label: `${info.label} × ${dogs}`,
      amount: cost,
    })
  }

  return {
    total: basePrice * dogs + addOnTotal,
    lineItems,
    isUnavailable: false,
    unavailableMessage: null,
    timeEstimate: timeEstimates[service],
  }
}
