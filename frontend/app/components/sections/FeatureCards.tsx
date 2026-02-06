import {Icon} from '@iconify/react'
import Button from '@/app/components/ui/Button'
import DecorativeCurve from '@/app/components/ui/DecorativeCurve'

type FeatureCardsProps = {
  block: {
    heading?: string
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
  const {heading, features, cta, trustLine} = block

  return (
    <section className="relative bg-dark text-cream rounded-t-[48px] -mt-12 z-10 overflow-hidden">
      {/* Decorative curves */}
      <DecorativeCurve color="white" position="top-right" className="w-[600px] h-[400px]" />
      <DecorativeCurve color="white" position="bottom-left" className="w-[400px] h-[300px]" />

      {/* Dog face illustrations placeholder */}
      <div className="absolute top-8 right-8 lg:top-12 lg:right-16 w-24 h-24 lg:w-32 lg:h-32 opacity-90" aria-hidden="true">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Golden dog face */}
          <circle cx="35" cy="50" r="22" fill="#D4A96A" />
          <circle cx="28" cy="44" r="3" fill="#201A25" />
          <circle cx="42" cy="44" r="3" fill="#201A25" />
          <ellipse cx="35" cy="52" rx="4" ry="3" fill="#3D2E1A" />
          {/* White dog face */}
          <circle cx="65" cy="50" r="18" fill="#F5F0E8" />
          <circle cx="60" cy="46" r="2.5" fill="#201A25" />
          <circle cx="70" cy="46" r="2.5" fill="#201A25" />
          <ellipse cx="65" cy="52" rx="3" ry="2.5" fill="#E8A0B0" />
        </svg>
      </div>

      <div className="container relative z-10 py-[80px] lg:py-[120px]">
        {heading && (
          <h2 className="font-serif text-[36px] md:text-[56px] lg:text-[84px] leading-[90%] tracking-[-0.01em] text-cream mb-12 lg:mb-16 max-w-2xl">
            {heading}
          </h2>
        )}

        {features && features.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12 lg:mb-16">
            {features.map((feature) => (
              <div
                key={feature._key}
                className="bg-dark-card border border-border-dark rounded-md p-6"
              >
                {feature.icon && (
                  <div className="mb-4 text-cream/80">
                    <Icon icon={feature.icon} width={28} height={28} />
                  </div>
                )}
                {feature.title && (
                  <h3 className="font-serif text-[24px] leading-[120%] text-cream mb-2">
                    {feature.title}
                  </h3>
                )}
                {feature.description && (
                  <p className="font-sans text-[16px] font-light text-text-muted-dark leading-[150%]">
                    {feature.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <div>
          {cta?.buttonText && (
            <Button variant="primary" link={cta.link} className="mb-3">
              {cta.buttonText}
            </Button>
          )}
          {trustLine && (
            <p className="font-sans text-[14px] text-text-muted-dark">{trustLine}</p>
          )}
        </div>
      </div>
    </section>
  )
}
