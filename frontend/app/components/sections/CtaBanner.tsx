import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import DecorativeCurve from '@/app/components/ui/DecorativeCurve'

type CtaBannerProps = {
  block: {
    heading?: string
    backgroundImage?: {asset?: {_ref: string}; crop?: any}
    cta?: {buttonText?: string; link?: any}
    showRating?: boolean
    ratingText?: string
  }
  index: number
  pageId: string
  pageType: string
}

export default function CtaBanner({block}: CtaBannerProps) {
  const {heading, backgroundImage, cta, showRating, ratingText} = block

  return (
    <section className="bg-tan px-4 lg:px-8">
      <div className="relative rounded-lg overflow-hidden max-w-6xl mx-auto">
        {/* Background image */}
        {backgroundImage?.asset?._ref && (
          <div className="absolute inset-0">
            <Image
              id={backgroundImage.asset._ref}
              alt=""
              width={1200}
              crop={backgroundImage.crop}
              mode="cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark/50" />
          </div>
        )}

        {/* Fallback dark bg if no image */}
        {!backgroundImage?.asset?._ref && (
          <div className="absolute inset-0 bg-dark" />
        )}

        {/* Decorative curves */}
        <DecorativeCurve color="white" position="top-left" className="w-[300px] h-[200px]" />
        <DecorativeCurve color="white" position="bottom-right" className="w-[300px] h-[200px]" />

        <div className="relative z-10 py-16 lg:py-24 text-center">
          {/* Dog icon */}
          <div className="flex justify-center mb-4">
            <svg width="32" height="28" viewBox="0 0 32 28" fill="none">
              <path
                d="M16 6C16 6 13 1 10 3C7 5 8 10 10 12C12 14 14 15 16 15C18 15 20 14 22 12C24 10 25 5 22 3C19 1 16 6 16 6Z"
                stroke="white"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>

          {heading && (
            <h2 className="font-serif text-[32px] md:text-[44px] lg:text-[56px] leading-[95%] tracking-[-0.005em] text-white mb-8 max-w-lg mx-auto">
              {heading}
            </h2>
          )}

          {cta?.buttonText && (
            <Button variant="primary" link={cta.link} className="mb-4">
              {cta.buttonText}
            </Button>
          )}

          {showRating && ratingText && (
            <div className="flex items-center justify-center gap-1.5 mt-4">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="14" height="14" viewBox="0 0 14 14" fill="white">
                    <path d="M7 1l1.9 3.8 4.1.7-3 2.9.7 4.2L7 10.5 3.3 12.6l.7-4.2-3-2.9 4.1-.7L7 1z" />
                  </svg>
                ))}
              </div>
              <span className="font-sans text-[13px] text-white/80">{ratingText}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
