'use client'

import {useState} from 'react'
import Badge from '@/app/components/ui/Badge'
import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'

type ServiceTab = {
  _id: string
  title?: string
  slug?: {current?: string}
  shortDescription?: string
  tabImage?: {asset?: {_ref: string}; crop?: any}
  tabCta?: {buttonText?: string; link?: any}
}

type ServiceTabsProps = {
  block: {
    eyebrow?: string
    heading?: string
    tabs?: ServiceTab[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function ServiceTabs({block}: ServiceTabsProps) {
  const {eyebrow, heading, tabs} = block
  const [activeTab, setActiveTab] = useState(0)

  if (!tabs || tabs.length === 0) return null

  const activeService = tabs[activeTab]

  return (
    <section className="bg-tan">
      <div className="container py-[80px] lg:py-[120px]">
        <div className="text-center mb-10">
          {eyebrow && <Badge className="mb-4">{eyebrow}</Badge>}
          {heading && (
            <h2 className="font-serif text-[36px] md:text-[48px] lg:text-[56px] leading-[95%] tracking-[-0.005em]">
              {heading}
            </h2>
          )}
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-border-light mb-10 lg:mb-14 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab._id}
              onClick={() => setActiveTab(i)}
              className={`flex-1 min-w-[120px] pb-3 font-sans text-[16px] lg:text-[18px] transition-colors border-b-2 ${
                i === activeTab
                  ? 'border-dark text-dark font-medium'
                  : 'border-transparent text-text-muted hover:text-dark'
              }`}
            >
              {tab.title}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeService && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              {activeService.title && (
                <h3 className="font-serif text-[28px] md:text-[36px] lg:text-[48px] leading-[95%] mb-4">
                  {activeService.title}
                </h3>
              )}
              {activeService.shortDescription && (
                <p className="font-sans text-[16px] lg:text-[18px] font-light text-text-muted leading-[150%] mb-6">
                  {activeService.shortDescription}
                </p>
              )}
              {activeService.tabCta?.buttonText && (
                <Button variant="primary" link={activeService.tabCta.link}>
                  {activeService.tabCta.buttonText}
                </Button>
              )}
            </div>

            {activeService.tabImage?.asset?._ref && (
              <div>
                <Image
                  id={activeService.tabImage.asset._ref}
                  alt={activeService.title || 'Service image'}
                  width={600}
                  crop={activeService.tabImage.crop}
                  className="rounded-lg w-full object-cover aspect-[4/3]"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
