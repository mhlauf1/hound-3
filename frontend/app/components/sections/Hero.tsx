import Badge from '@/app/components/ui/Badge'
import Button from '@/app/components/ui/Button'
import DecorativeCurve from '@/app/components/ui/DecorativeCurve'
import Image from '@/app/components/SanityImage'

type HeroProps = {
  block: {
    eyebrow?: string
    heading?: string
    subtext?: string
    primaryCta?: {buttonText?: string; link?: any}
    secondaryCta?: {buttonText?: string; link?: any}
    trustLine?: string
    heroImage?: {asset?: {_ref: string}; crop?: any; hotspot?: any}
    backgroundImage?: {asset?: {_ref: string}}
  }
  index: number
  pageId: string
  pageType: string
}

export default function Hero({block}: HeroProps) {
  const {eyebrow, heading, subtext, primaryCta, secondaryCta, trustLine, heroImage} = block

  return (
    <section className="relative bg-tan overflow-hidden">
      {/* Decorative curves */}
      <DecorativeCurve color="orange" position="top-right" className="w-[500px] h-[400px]" />
      <DecorativeCurve color="white" position="top-left" className="w-[300px] h-[200px] opacity-30" />

      {/* Dog doodle placeholders */}
      <div className="absolute left-8 top-1/3 w-20 h-20 opacity-60" aria-hidden="true">
        {/* Placeholder for dog line-art illustration */}
        <svg viewBox="0 0 80 80" fill="none" className="w-full h-full">
          <circle cx="30" cy="25" r="6" stroke="#201A25" strokeWidth="2" />
          <circle cx="50" cy="25" r="6" stroke="#201A25" strokeWidth="2" />
          <circle cx="40" cy="40" r="4" fill="#201A25" />
          <path d="M30 50 Q40 60 50 50" stroke="#201A25" strokeWidth="2" fill="none" />
          <path d="M20 20 Q15 5 25 15" stroke="#201A25" strokeWidth="2" fill="none" />
          <path d="M60 20 Q65 5 55 15" stroke="#201A25" strokeWidth="2" fill="none" />
        </svg>
      </div>

      <div className="container relative z-10 pt-16 pb-8 lg:pt-24 lg:pb-12">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {eyebrow && (
            <Badge className="mb-6">{eyebrow}</Badge>
          )}

          {heading && (
            <h1 className="font-serif text-[36px] md:text-[56px] lg:text-[84px] leading-[90%] tracking-[-0.01em] mb-6">
              {heading}
            </h1>
          )}

          {subtext && (
            <p className="font-sans text-[16px] md:text-[18px] lg:text-[20px] font-light text-text-muted leading-[150%] max-w-xl mb-8">
              {subtext}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
            {primaryCta?.buttonText && (
              <Button variant="primary" link={primaryCta.link}>
                {primaryCta.buttonText}
              </Button>
            )}
            {secondaryCta?.buttonText && (
              <Button variant="outline" link={secondaryCta.link}>
                {secondaryCta.buttonText}
              </Button>
            )}
          </div>

          {trustLine && (
            <p className="font-sans text-[14px] text-text-muted">{trustLine}</p>
          )}
        </div>

        {heroImage?.asset?._ref && (
          <div className="mt-10 lg:mt-16 max-w-4xl mx-auto">
            <Image
              id={heroImage.asset._ref}
              alt="Hero image"
              width={960}
              crop={heroImage.crop}
              className="rounded-xl w-full object-cover"
            />
          </div>
        )}
      </div>
    </section>
  )
}
