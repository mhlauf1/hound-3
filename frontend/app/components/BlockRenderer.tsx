import React, {Suspense} from 'react'

import Cta from '@/app/components/Cta'
import Info from '@/app/components/InfoSection'
import Hero from '@/app/components/sections/Hero'
import ImageRow from '@/app/components/sections/ImageRow'
import FeatureCards from '@/app/components/sections/FeatureCards'
import ServiceTabs from '@/app/components/sections/ServiceTabs'
import StatsBar from '@/app/components/sections/StatsBar'
import WebcamPreview from '@/app/components/sections/WebcamPreview'
import Testimonials from '@/app/components/sections/Testimonials'
import CtaBanner from '@/app/components/sections/CtaBanner'
import SplitContent from '@/app/components/sections/SplitContent'
import FaqAccordion from '@/app/components/sections/FaqAccordion'
import PricingTable from '@/app/components/sections/PricingTable'
import TeamGrid from '@/app/components/sections/TeamGrid'
import GalleryGrid from '@/app/components/sections/GalleryGrid'
import ContactFormComponent from '@/app/components/sections/ContactForm'
import HeroSplit from '@/app/components/sections/HeroSplit'
import HeroBanner from '@/app/components/sections/HeroBanner'
import HeroMinimal from '@/app/components/sections/HeroMinimal'
import ServiceCards from '@/app/components/sections/ServiceCards'
import FeatureList from '@/app/components/sections/FeatureList'
import ProcessSteps from '@/app/components/sections/ProcessSteps'
import ContentColumns from '@/app/components/sections/ContentColumns'
import IconGrid from '@/app/components/sections/IconGrid'
import VideoSection from '@/app/components/sections/VideoSection'
import FullWidthMedia from '@/app/components/sections/FullWidthMedia'
import CtaStrip from '@/app/components/sections/CtaStrip'
import LogoBar from '@/app/components/sections/LogoBar'
import PricingMatrix from '@/app/components/sections/PricingMatrix'
import PricingList from '@/app/components/sections/PricingList'
import PolicyNotes from '@/app/components/sections/PolicyNotes'
import FeatureGrid from '@/app/components/sections/FeatureGrid'
import PricingCalculator from '@/app/components/sections/PricingCalculator'
import WhatsIncluded from '@/app/components/sections/WhatsIncluded'
import RequirementsList from '@/app/components/sections/RequirementsList'
import WebcamGrid from '@/app/components/sections/WebcamGrid'
import {dataAttr} from '@/sanity/lib/utils'
import {PageBuilderSection} from '@/sanity/lib/types'

type BlockProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
}

function ContactForm(props: BlockProps) {
  return (
    <Suspense>
      <ContactFormComponent {...(props as React.ComponentProps<typeof ContactFormComponent>)} />
    </Suspense>
  )
}

type BlocksType = {
  [key: string]: React.FC<BlockProps>
}

const Blocks = {
  callToAction: Cta,
  infoSection: Info,
  hero: Hero,
  imageRow: ImageRow,
  featureCards: FeatureCards,
  serviceTabs: ServiceTabs,
  statsBar: StatsBar,
  webcamPreview: WebcamPreview,
  testimonials: Testimonials,
  ctaBanner: CtaBanner,
  splitContent: SplitContent,
  faqAccordion: FaqAccordion,
  pricingTable: PricingTable,
  teamGrid: TeamGrid,
  galleryGrid: GalleryGrid,
  contactForm: ContactForm,
  heroSplit: HeroSplit,
  heroBanner: HeroBanner,
  heroMinimal: HeroMinimal,
  serviceCards: ServiceCards,
  featureList: FeatureList,
  processSteps: ProcessSteps,
  contentColumns: ContentColumns,
  iconGrid: IconGrid,
  videoSection: VideoSection,
  fullWidthMedia: FullWidthMedia,
  ctaStrip: CtaStrip,
  logoBar: LogoBar,
  pricingMatrix: PricingMatrix,
  pricingList: PricingList,
  policyNotes: PolicyNotes,
  featureGrid: FeatureGrid,
  pricingCalculator: PricingCalculator,
  whatsIncluded: WhatsIncluded,
  requirementsList: RequirementsList,
  webcamGrid: WebcamGrid,
} as BlocksType

export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
          pageId: pageId,
          pageType: pageType,
        })}
      </div>
    )
  }
  return React.createElement(
    () => (
      <div className="w-full bg-sand/20 text-center text-text-muted p-20 rounded-md">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}
