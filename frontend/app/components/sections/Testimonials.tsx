import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'

type Review = {
  _id: string
  quote?: string
  authorName?: string
  authorLabel?: string
  rating?: number
}

type TestimonialsProps = {
  block: {
    icon?: {asset?: {_ref: string}}
    heading?: string
    reviews?: Review[]
    googleRating?: string
    googleReviewCount?: number
  }
  index: number
  pageId: string
  pageType: string
}

export default function Testimonials({block}: TestimonialsProps) {
  const {icon, heading, reviews, googleRating, googleReviewCount} = block

  return (
    <section className="relative bg-forest text-cream rounded-t-[48px] -mt-12 z-10 overflow-hidden">
      <div className="container relative z-10 py-[80px] lg:py-[120px]">
        {icon?.asset?._ref && (
          <FadeIn>
            <div className="flex justify-center mb-6">
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
            <h2 className="text-[36px] md:text-[48px] lg:text-[56px] leading-[95%] text-cream text-center mb-12 lg:mb-16">
              {heading}
            </h2>
          </FadeIn>
        )}

        {/* Scrolling cards */}
        {reviews && reviews.length > 0 && (
          <FadeIn delay={0.2}>
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4">
              {reviews.map((review) => (
                <div
                  key={review._id}
                  className="flex-shrink-0 w-[260px] lg:w-[280px] bg-cream text-forest rounded-lg p-6 snap-center"
                >
                  {/* Paw icon */}
                  <div className="mb-4">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                      <circle cx="14" cy="14" r="12" stroke="#C4704B" strokeWidth="1.5" />
                      <circle cx="10" cy="11" r="2" fill="#C4704B" />
                      <circle cx="18" cy="11" r="2" fill="#C4704B" />
                      <circle cx="14" cy="16" r="2.5" fill="#C4704B" />
                      <circle cx="8" cy="16" r="1.5" fill="#C4704B" />
                      <circle cx="20" cy="16" r="1.5" fill="#C4704B" />
                    </svg>
                  </div>

                  {review.quote && (
                    <p className="font-sans text-[15px] font-light leading-[150%] text-forest mb-4">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                  )}

                  <div className="font-sans text-[14px]">
                    {review.authorName && <span className="font-medium">{review.authorName}</span>}
                    {review.authorLabel && (
                      <span className="text-text-muted">, {review.authorLabel}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Google rating badge */}
        {googleRating && (
          <FadeIn delay={0.3}>
            <div className="flex justify-center mt-10">
              <div className="inline-flex items-center gap-2 bg-forest-card border border-border-dark rounded-full px-5 py-2.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill={star <= Math.floor(Number(googleRating)) ? '#FAF7F2' : 'none'}
                      stroke="#FAF7F2"
                      strokeWidth="1"
                    >
                      <path d="M8 1l2.2 4.4L15 6.2l-3.5 3.4.8 4.8L8 12.1 3.7 14.4l.8-4.8L1 6.2l4.8-.8L8 1z" />
                    </svg>
                  ))}
                </div>
                <span className="font-sans text-[14px] text-cream">
                  {googleRating} On Google Review{googleReviewCount ? `s` : ''}
                </span>
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
