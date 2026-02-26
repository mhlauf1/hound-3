import Button from '@/app/components/ui/Button'
import Image from '@/app/components/SanityImage'
import DecorativeCurve from '@/app/components/ui/DecorativeCurve'
import {FadeIn} from '@/app/components/ui/FadeIn'

type CtaBannerProps = {
  block: {
    heading?: string
    icon?: {asset?: {_ref: string}}
    backgroundImage?: {asset?: {_ref: string}; crop?: any}
    sideImage?: {asset?: {_ref: string}; crop?: any}
    cta?: {buttonText?: string; link?: any}
    showRating?: boolean
    ratingText?: string
  }
  index: number
  pageId: string
  pageType: string
}

function RatingBar({ratingText}: {ratingText: string}) {
  return (
    <div className="flex items-center gap-1.5 mt-4">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} width="14" height="14" viewBox="0 0 14 14" fill="white">
            <path d="M7 1l1.9 3.8 4.1.7-3 2.9.7 4.2L7 10.5 3.3 12.6l.7-4.2-3-2.9 4.1-.7L7 1z" />
          </svg>
        ))}
      </div>
      <span className="font-sans text-[13px] text-white/80">{ratingText}</span>
    </div>
  )
}

export default function CtaBanner({block}: CtaBannerProps) {
  const {heading, icon, backgroundImage, sideImage, cta, showRating, ratingText} = block
  const hasSideImage = !!sideImage?.asset?._ref

  if (hasSideImage) {
    return (
      <section className="bg-cream px-4 lg:px-8">
        <div className="relative rounded-lg overflow-hidden">
          {/* Background image if provided, otherwise forest */}
          {backgroundImage?.asset?._ref ? (
            <div className="absolute inset-0">
              <Image
                id={backgroundImage.asset._ref}
                alt=""
                width={1200}
                crop={backgroundImage.crop}
                mode="cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-forest/20" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-forest" />
          )}

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Text side */}
            <div className="px-[8%] lg:px-[10%] py-16 lg:py-24">
              {icon?.asset?._ref && (
                <FadeIn>
                  <div className="mb-8">
                    <Image
                      id={icon.asset._ref}
                      alt=""
                      width={120}
                      className="w-[100px] lg:w-[120px] h-auto"
                    />
                  </div>
                </FadeIn>
              )}

              {heading && (
                <FadeIn delay={0.1}>
                  <h2 className="text-[32px] md:text-[44px] lg:text-[56px] leading-[95%] text-white mb-10 max-w-xl">
                    {heading}
                  </h2>
                </FadeIn>
              )}

              <FadeIn delay={0.2}>
                {cta?.buttonText && (
                  <Button variant="primary" link={cta.link} className="mb-4">
                    {cta.buttonText}
                  </Button>
                )}
              </FadeIn>

              {showRating && ratingText && (
                <FadeIn delay={0.3}>
                  <RatingBar ratingText={ratingText} />
                </FadeIn>
              )}
            </div>

            {/* Side image */}
            <FadeIn delay={0.15} direction="right">
              <div className="hidden lg:block h-full">
                <Image
                  id={sideImage.asset!._ref}
                  alt={heading || ''}
                  width={700}
                  crop={sideImage.crop}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-cream px-4 lg:px-8">
      <div className="relative rounded-lg min-h-[60vh] md:min-h-[80vh] flex px-[6%] md:px-[10%] items-center overflow-hidden">
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
            <div className="absolute inset-0 bg-forest/20" />
          </div>
        )}

        {/* Fallback dark bg if no image */}
        {!backgroundImage?.asset?._ref && <div className="absolute inset-0 bg-forest" />}
        <div className="relative flex flex-col items-start md:items-center z-10 py-16 lg:py-24 text-start md:text-center">
          {icon?.asset?._ref && (
            <FadeIn>
              <div className="mb-8">
                <Image
                  id={icon.asset._ref}
                  alt=""
                  width={120}
                  className="w-[100px] lg:w-[120px] h-auto mx-auto"
                />
              </div>
            </FadeIn>
          )}

          {heading && (
            <FadeIn delay={0.1}>
              <h2 className="text-[32px] md:text-[44px] lg:text-[56px] leading-[95%] text-white mb-10 max-w-xl mx-auto">
                {heading}
              </h2>
            </FadeIn>
          )}
          <FadeIn delay={0.2}>
            {cta?.buttonText && (
              <Button variant="primary" link={cta.link} className="mb-4">
                {cta.buttonText}
              </Button>
            )}
          </FadeIn>

          {showRating && ratingText && (
            <FadeIn delay={0.3}>
              <div className="flex items-center justify-center gap-1.5 mt-4">
                <RatingBar ratingText={ratingText} />
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}
