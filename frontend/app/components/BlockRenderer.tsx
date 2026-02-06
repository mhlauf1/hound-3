import React from 'react'

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
import {dataAttr} from '@/sanity/lib/utils'
import {PageBuilderSection} from '@/sanity/lib/types'

type BlockProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
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
      <div className="w-full bg-lavender/20 text-center text-text-muted p-20 rounded-md">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}
