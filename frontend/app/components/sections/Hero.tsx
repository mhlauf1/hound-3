import Badge from '@/app/components/ui/Badge'
import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
// Hero background variant — swap import to try different styles:
// GrainGlow | DotGrid | MeshGradient | TopoLines
// import {TopoLines as HeroBackground} from './hero-backgrounds'

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
    <section className="relative pt-18 bg-cream overflow-hidden">
      {/* <HeroBackground /> */}

      {/* Left dog illustration */}
      <img
        src="/illustrations/hero-left-dog.png"
        alt=""
        aria-hidden="true"
        className="absolute left-1/12 top-1/3 w-[80px] lg:w-section-lg pointer-events-none hidden lg:block"
      />

      {/* Right dog illustration */}
      <img
        src="/illustrations/hero-right-image.png"
        alt=""
        aria-hidden="true"
        className="absolute right-1/8 bottom-1/4 w-15 lg:w-[80px] pointer-events-none hidden lg:block"
      />

      <div className="container relative z-10 pt-20 pb-8 lg:pt-[12vh] lg:pb-12">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {eyebrow && (
            <FadeIn>
              <Badge className="mb-3 md:mb-6">{eyebrow}</Badge>
            </FadeIn>
          )}

          {heading && (
            <FadeIn delay={0.1}>
              <h1 className="text-[48px] md:text-[56px] lg:text-[84px] leading-[110%] mb-6">
                {heading}
              </h1>
            </FadeIn>
          )}

          {subtext && (
            <FadeIn delay={0.2}>
              <p className="font-sans  md:text-base lg:text-lg font-light text-text-muted leading-[150%] max-w-2xl mb-8">
                {subtext}
              </p>
            </FadeIn>
          )}

          <FadeIn delay={0.3}>
            <div className="flex flex-row items-center gap-2 md:gap-3 mb-4">
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
          </FadeIn>

          {trustLine && (
            <FadeIn delay={0.35}>
              <p className="font-sans text-[14px] text-text-muted">{trustLine}</p>
            </FadeIn>
          )}
        </div>

        {heroImage?.asset?._ref && (
          <FadeIn delay={0.4}>
            <div className="mt-10 lg:mt-16 max-w-4xl mx-auto">
              <Image
                id={heroImage.asset._ref}
                alt="Hero image"
                width={960}
                crop={heroImage.crop}
                className="rounded-xl w-full object-cover"
              />
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
