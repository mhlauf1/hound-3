'use client'

import {Icon} from '@iconify/react'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type IconGridProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    items?: Array<{
      _key: string
      icon?: string
      title?: string
      description?: string
    }>
    columns?: number
    backgroundColor?: 'cream' | 'sand' | 'forest'
  }
  index: number
  pageId: string
  pageType: string
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream text-forest',
  sand: 'bg-sand text-forest',
  forest: 'bg-forest text-cream',
}

export default function IconGrid({block}: IconGridProps) {
  const {eyebrow, heading, description, items, columns, backgroundColor} = block
  const cols = stegaClean(columns) || 3
  const gridClass = columnClasses[cols] || columnClasses[3]
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isDark = stegaClean(backgroundColor) === 'forest'

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="mb-10 lg:mb-14">
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] font-semibold tracking-tight md:text-[48px] lg:text-[56px] leading-[105%] mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p
                className={`font-sans text-[16px] lg:text-[18px] font-light leading-[150%] max-w-2xl ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
              >
                {description}
              </p>
            )}
          </div>
        </FadeIn>

        {items && items.length > 0 && (
          <div className={`grid ${gridClass} gap-4`}>
            {items.map((item, i) => (
              <FadeIn key={item._key} delay={0.05 * i}>
                <div
                  className={`rounded-md p-6 h-full ${
                    isDark
                      ? 'bg-forest-card border border-border-dark'
                      : 'bg-white/60 border border-border-light'
                  }`}
                >
                  {item.icon && (
                    <div
                      className={`w-12 h-12 rounded-md flex items-center justify-center mb-4 ${
                        isDark
                          ? 'bg-terracotta/20 text-terracotta'
                          : 'bg-terracotta/10 text-terracotta'
                      }`}
                    >
                      <Icon icon={item.icon} width={28} height={28} />
                    </div>
                  )}
                  {item.title && (
                    <h3
                      className={`text-[18px] md:text-[20px] leading-[120%] mb-2 ${isDark ? 'text-sand' : 'text-forest'}`}
                    >
                      {item.title}
                    </h3>
                  )}
                  {item.description && (
                    <p
                      className={`font-sans text-[14px] font-light leading-[150%] ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
