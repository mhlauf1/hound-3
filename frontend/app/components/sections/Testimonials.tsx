type Review = {
  _id: string
  quote?: string
  authorName?: string
  authorLabel?: string
  rating?: number
}

type TestimonialsProps = {
  block: {
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
  const {heading, reviews, googleRating, googleReviewCount} = block

  return (
    <section className="relative bg-dark text-cream rounded-t-[48px] -mt-12 z-10 overflow-hidden">
      <div className="container relative z-10 py-[80px] lg:py-[120px]">
        {/* Dog icon placeholder */}
        <div className="flex justify-center mb-4">
          <svg width="40" height="32" viewBox="0 0 40 32" fill="none" className="text-cream">
            <path
              d="M20 8C20 8 16 2 12 4C8 6 10 12 12 14C14 16 18 18 20 18C22 18 26 16 28 14C30 12 32 6 28 4C24 2 20 8 20 8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <path d="M14 22C14 22 16 28 20 28C24 28 26 22 26 22" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>

        {heading && (
          <h2 className="font-serif text-[36px] md:text-[48px] lg:text-[56px] leading-[95%] tracking-[-0.005em] text-cream text-center mb-12 lg:mb-16">
            {heading}
          </h2>
        )}

        {/* Scrolling cards */}
        {reviews && reviews.length > 0 && (
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-4 px-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="flex-shrink-0 w-[260px] lg:w-[280px] bg-cream text-dark rounded-lg p-6 snap-center"
              >
                {/* Paw icon */}
                <div className="mb-4">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="14" r="12" stroke="#E87830" strokeWidth="1.5" />
                    <circle cx="10" cy="11" r="2" fill="#E87830" />
                    <circle cx="18" cy="11" r="2" fill="#E87830" />
                    <circle cx="14" cy="16" r="2.5" fill="#E87830" />
                    <circle cx="8" cy="16" r="1.5" fill="#E87830" />
                    <circle cx="20" cy="16" r="1.5" fill="#E87830" />
                  </svg>
                </div>

                {review.quote && (
                  <p className="font-sans text-[15px] font-light leading-[150%] text-dark mb-4">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                )}

                <div className="font-sans text-[14px]">
                  {review.authorName && (
                    <span className="font-medium">{review.authorName}</span>
                  )}
                  {review.authorLabel && (
                    <span className="text-text-muted">, {review.authorLabel}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Google rating badge */}
        {googleRating && (
          <div className="flex justify-center mt-10">
            <div className="inline-flex items-center gap-2 bg-dark-card border border-border-dark rounded-full px-5 py-2.5">
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} width="16" height="16" viewBox="0 0 16 16" fill={star <= Math.floor(Number(googleRating)) ? '#FEFFEA' : 'none'} stroke="#FEFFEA" strokeWidth="1">
                    <path d="M8 1l2.2 4.4L15 6.2l-3.5 3.4.8 4.8L8 12.1 3.7 14.4l.8-4.8L1 6.2l4.8-.8L8 1z" />
                  </svg>
                ))}
              </div>
              <span className="font-sans text-[14px] text-cream">
                {googleRating} On Google Review{googleReviewCount ? `s` : ''}
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
