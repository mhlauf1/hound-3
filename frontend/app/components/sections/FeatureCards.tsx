import {Icon} from '@iconify/react'
import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'

type FeatureCardsProps = {
  block: {
    heading?: string
    stickerLeft?: {asset?: {_ref: string}}
    stickerRight?: {asset?: {_ref: string}}
    features?: Array<{
      _key: string
      icon?: string
      title?: string
      description?: string
    }>
    cta?: {buttonText?: string; link?: any}
    trustLine?: string
    darkMode?: boolean
  }
  index: number
  pageId: string
  pageType: string
}

export default function FeatureCards({block}: FeatureCardsProps) {
  const {heading, stickerLeft, stickerRight, features, cta, trustLine} = block

  return (
    <section className="relative bg-forest text-cream rounded-[48px] -mt-12 z-10 overflow-hidden">
      <div className="px-6 md:px-28 relative z-10 py-[80px] lg:py-[148px]">
        <FadeIn>
          <div className="flex flex-row justify-between items-center mb-12 lg:mb-16">
            {heading && (
              <h2 className="text-[36px] md:text-[56px] lg:text-[84px] leading-[105%] text-sand max-w-4xl">
                {heading}
              </h2>
            )}

            <div className="hidden md:flex items-center gap-2 shrink-0">
              {stickerLeft?.asset?._ref && (
                <Image
                  id={stickerLeft.asset._ref}
                  alt=""
                  width={160}
                  className="w-[100px] lg:w-[160px] h-auto"
                />
              )}
              {stickerRight?.asset?._ref && (
                <Image
                  id={stickerRight.asset._ref}
                  alt=""
                  width={160}
                  className="w-[100px] lg:w-[160px] h-auto"
                />
              )}
            </div>
          </div>
        </FadeIn>

        {features && features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-12 lg:mb-16">
            {features.map((feature, i) => (
              <FadeIn key={feature._key} delay={0.1 * i}>
                <div className="bg-forest-card border border-border-dark rounded-md px-6 py-12 h-full">
                  {feature.icon && (
                    <div className="mb-6 text-sand/80">
                      <Icon icon={feature.icon} width={42} height={42} />
                    </div>
                  )}
                  {feature.title && (
                    <h3 className="text-[24px] md:text-4xl leading-[120%] text-sand mb-4">
                      {feature.title}
                    </h3>
                  )}
                  {feature.description && (
                    <p className="font-sans text-[16px] md:text-lg mb-2 md:mb-8  text-sand leading-[150%]">
                      {feature.description}
                    </p>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        <FadeIn>
          <div>
            {cta?.buttonText && (
              <Button variant="primary" link={cta.link} className="mb-3">
                {cta.buttonText}
              </Button>
            )}
            {trustLine && <p className="font-sans text-[14px] text-text-muted-dark">{trustLine}</p>}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
