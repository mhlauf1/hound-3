import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from 'next-sanity'
import Image from '@/app/components/SanityImage'
import ResolvedLink from '@/app/components/ResolvedLink'
import {stegaClean} from '@sanity/client/stega'
import {FadeIn} from '@/app/components/ui/FadeIn'

type SplitContentProps = {
  block: {
    heading?: string
    body?: PortableTextBlock[]
    link?: {label?: string; link?: any}
    badge?: {asset?: {_ref: string}}
    image?: {asset?: {_ref: string}; crop?: any}
    imagePosition?: 'left' | 'right'
    backgroundColor?: 'tan' | 'lavender' | 'dark'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, string> = {
  tan: 'bg-tan text-dark',
  lavender: 'bg-lavender text-dark',
  dark: 'bg-dark text-cream',
}

export default function SplitContent({block}: SplitContentProps) {
  const {heading, body, link, badge, image, imagePosition, backgroundColor} = block
  const isImageLeft = stegaClean(imagePosition) === 'left'
  const bg = bgColors[stegaClean(backgroundColor) || 'lavender'] || bgColors.lavender

  return (
    <section className={`${bg}`}>
      <div className="px-6 md:px-24 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text side */}
          <div className={isImageLeft ? 'lg:order-2' : 'lg:order-1'}>
            {heading && (
              <FadeIn>
                <h2 className="font-serif text-[48px] lg:text-[88px] leading-[100%] max-w-[8ch] tracking-tighter font-light mb-6">
                  {heading}
                </h2>
              </FadeIn>
            )}

            {body && (
              <FadeIn delay={0.1}>
                <div className="font-sans text-[16px] lg:text-[18px] font-light leading-[150%] opacity-80 mb-6 prose prose-p:mb-3">
                  <PortableText value={body} />
                </div>
              </FadeIn>
            )}

            {link?.label && link?.link && (
              <FadeIn delay={0.2}>
                <div className="mb-6">
                  <ResolvedLink
                    link={link.link}
                    className="font-sans text-[16px] font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
                  >
                    {link.label}
                  </ResolvedLink>
                </div>
              </FadeIn>
            )}

            {badge?.asset?._ref && (
              <FadeIn delay={0.2}>
                <Image id={badge.asset._ref} alt="Badge" width={80} className="h-36 w-auto" />
              </FadeIn>
            )}
          </div>

          {/* Image side */}
          <div className={isImageLeft ? 'lg:order-1' : 'lg:order-2'}>
            {image?.asset?._ref && (
              <FadeIn delay={0.1}>
                <Image
                  id={image.asset._ref}
                  alt={heading || 'Section image'}
                  width={600}
                  crop={image.crop}
                  className="rounded-lg aspect-[4/3] w-full object-cover"
                />
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
