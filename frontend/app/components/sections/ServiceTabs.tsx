'use client'

import {useState, useEffect} from 'react'
import Badge from '@/app/components/ui/Badge'
import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'

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
  const tabCount = tabs?.length ?? 0

  useEffect(() => {
    if (tabCount < 2) return
    const timer = setTimeout(() => {
      setActiveTab((t) => (t + 1) % tabCount)
    }, 7000)
    return () => clearTimeout(timer)
  }, [activeTab, tabCount])

  if (!tabs || tabs.length === 0) return null

  const activeService = tabs[activeTab]

  return (
    <section className="bg-tan">
      <div className="px-6 md:px-24 flex flex-col items-center py-[80px] lg:py-[120px]">
        <FadeIn>
          <div className="text-center mb-10">
            {eyebrow && <Badge className="mb-4">{eyebrow}</Badge>}
            {heading && (
              <h2 className="font-serif font-light text-[36px] md:max-w-[18ch] md:text-[48px] lg:text-[56px] leading-[95%] tracking-tighter">
                {heading}
              </h2>
            )}
          </div>
        </FadeIn>

        {/* Tab bar */}
        <FadeIn delay={0.15} className="w-full">
        <div className="flex border-b w-full border-border-light mb-10 mt-4 lg:mb-14 overflow-x-auto">
          {tabs.map((tab, i) => (
            <button
              key={tab._id}
              onClick={() => setActiveTab(i)}
              className={`relative flex-1 min-w-[120px] p-2 md:p-4 font-serif text-start text-[16px] md:text-2xl tracking-tight lg:text-3xl transition-colors ${
                i === activeTab ? 'text-dark' : 'text-text-muted hover:text-dark'
              }`}
            >
              {tab.title}
              {i === activeTab && (
                <span
                  key={activeTab}
                  className="absolute bottom-0 left-0 h-[2px] bg-dark animate-progress"
                />
              )}
            </button>
          ))}
        </div>
        </FadeIn>

        {/* Tab content */}
        {activeService && (
          <div
            key={activeTab}
            className="grid grid-cols-1 bg-dark/10 rounded-lg  lg:grid-cols-2 gap-8 lg:gap-12 items-center animate-fade-in"
          >
            <div className="pb-4 pt-16 px-8 md:pl-24">
              {activeService.title && (
                <h3 className="font-serif text-[28px] md:text-[36px] lg:text-[48px]  font-light leading-[95%] mb-4">
                  {activeService.title}
                </h3>
              )}
              {activeService.shortDescription && (
                <p className="font-sans text-[16px] lg:text-[18px] text-text-muted max-w-[46ch] leading-[150%] mb-6">
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
