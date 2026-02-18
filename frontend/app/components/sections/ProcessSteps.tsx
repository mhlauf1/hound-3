'use client'

import {Icon} from '@iconify/react'
import Button from '@/app/components/ui/Button'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'

type ProcessStepsProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    steps?: Array<{
      _key: string
      title?: string
      description?: string
      icon?: string
    }>
    cta?: {buttonText?: string; link?: any}
    backgroundColor?: 'cream' | 'sand' | 'forest'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream text-forest',
  sand: 'bg-sand text-forest',
  forest: 'bg-forest text-cream',
}

export default function ProcessSteps({block}: ProcessStepsProps) {
  const {eyebrow, heading, description, steps, cta, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isDark = stegaClean(backgroundColor) === 'forest'

  return (
    <section className={bg}>
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="text-center mb-10 lg:mb-14 max-w-2xl mx-auto">
            {eyebrow && (
              <p className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] leading-[105%] mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p
                className={`font-sans text-[16px] lg:text-[18px] font-light leading-[150%] ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
              >
                {description}
              </p>
            )}
          </div>
        </FadeIn>

        {steps && steps.length > 0 && (
          <div className="flex flex-col lg:flex-row items-start lg:items-start justify-center gap-4 lg:gap-0 mb-10 lg:mb-14">
            {steps.map((step, i) => (
              <div key={step._key} className="flex flex-col lg:flex-row items-center flex-1">
                <FadeIn delay={0.1 * i}>
                  <div className="flex flex-col items-center text-center max-w-[200px]">
                    {/* Circle with number or icon */}
                    <div className="w-12 h-12 rounded-full bg-terracotta text-white flex items-center justify-center mb-4 shrink-0">
                      {step.icon ? (
                        <Icon icon={step.icon} width={24} height={24} />
                      ) : (
                        <span className="font-sans text-[16px] font-medium">{i + 1}</span>
                      )}
                    </div>
                    {step.title && (
                      <h3 className="text-[18px] md:text-[20px] leading-[120%] mb-2">
                        {step.title}
                      </h3>
                    )}
                    {step.description && (
                      <p
                        className={`font-sans text-[14px] font-light leading-[150%] ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                </FadeIn>

                {/* Connecting line (not after last step) */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block flex-1 h-[2px] bg-terracotta/30 mx-4 mt-6 self-start" />
                )}
              </div>
            ))}
          </div>
        )}

        {cta?.buttonText && (
          <FadeIn delay={0.2}>
            <div className="text-center">
              <Button variant="primary" link={cta.link}>
                {cta.buttonText}
              </Button>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
