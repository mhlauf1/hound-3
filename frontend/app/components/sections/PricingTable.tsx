import Button from '@/app/components/ui/Button'
import {FadeIn} from '@/app/components/ui/FadeIn'
import Badge from '../ui/Badge'

type PricingTableProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: string
    categories?: Array<{
      _key: string
      categoryName?: string
      tiers?: Array<{
        _key: string
        name?: string
        price?: string
        description?: string
        features?: string[]
        highlighted?: boolean
        cta?: {buttonText?: string; link?: any}
      }>
    }>
  }
  index: number
  pageId: string
  pageType: string
}

export default function PricingTable({block}: PricingTableProps) {
  const {eyebrow, heading, description, categories} = block

  return (
    <section className="bg-cream">
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
            {eyebrow && <Badge className="mb-3">{eyebrow}</Badge>}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[105%] text-forest mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p className="font-sans text-[16px] md:text-[18px] leading-[150%] text-charcoal/80">
                {description}
              </p>
            )}
          </div>
        </FadeIn>

        {categories &&
          categories.map((category) => (
            <div key={category._key} className="mb-12 last:mb-0">
              {category.categoryName && (
                <FadeIn>
                  <h3 className="text-[24px] md:text-[32px] leading-[120%] text-forest mb-6 lg:mb-8">
                    {category.categoryName}
                  </h3>
                </FadeIn>
              )}

              {category.tiers && category.tiers.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.tiers.map((tier, i) => (
                    <FadeIn key={tier._key} delay={0.1 * i}>
                      <div
                        className={`rounded-lg p-6 md:p-8 h-full flex flex-col ${
                          tier.highlighted
                            ? 'bg-forest text-cream ring-2 ring-terracotta'
                            : 'bg-sand/50 text-forest'
                        }`}
                      >
                        {tier.name && (
                          <h4 className="font-sans text-[20px] md:text-[24px] font-medium mb-2">
                            {tier.name}
                          </h4>
                        )}
                        {tier.price && (
                          <p
                            className={`text-[28px] md:text-[36px] font-medium mb-3 ${tier.highlighted ? 'text-terracotta-light' : 'text-terracotta'}`}
                          >
                            {tier.price}
                          </p>
                        )}
                        {tier.description && (
                          <p
                            className={`font-sans text-[14px] md:text-[16px] leading-[150%] mb-4 ${tier.highlighted ? 'text-cream/80' : 'text-charcoal/70'}`}
                          >
                            {tier.description}
                          </p>
                        )}
                        {tier.features && tier.features.length > 0 && (
                          <ul className="mb-6 flex-1 space-y-2">
                            {tier.features.map((feature, fi) => (
                              <li
                                key={fi}
                                className={`font-sans text-[14px] md:text-[16px] flex items-start gap-2 ${tier.highlighted ? 'text-cream/90' : 'text-charcoal/80'}`}
                              >
                                <svg
                                  className={`h-5 w-5 shrink-0 mt-0.5 ${tier.highlighted ? 'text-terracotta-light' : 'text-terracotta'}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                  />
                                </svg>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        )}
                        {tier.cta?.buttonText && (
                          <div className="mt-auto">
                            <Button
                              variant={tier.highlighted ? 'primary' : 'outline'}
                              link={tier.cta.link}
                              className="w-full"
                            >
                              {tier.cta.buttonText}
                            </Button>
                          </div>
                        )}
                      </div>
                    </FadeIn>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>
    </section>
  )
}
