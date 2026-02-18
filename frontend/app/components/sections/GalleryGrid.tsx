import Image from '@/app/components/SanityImage'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'

type GalleryGridProps = {
  block: {
    eyebrow?: string
    heading?: string
    images?: Array<{
      _key: string
      alt?: string
      asset?: {_ref: string}
      crop?: any
      hotspot?: any
    }>
    columns?: number
  }
  index: number
  pageId: string
  pageType: string
}

const columnClasses: Record<number, string> = {
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function GalleryGrid({block}: GalleryGridProps) {
  const {eyebrow, heading, images, columns} = block
  const cols = stegaClean(columns) || 3
  const gridClass = columnClasses[cols] || columnClasses[3]

  return (
    <section className="bg-cream">
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="mb-10 lg:mb-14">
            {eyebrow && (
              <p className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] leading-[105%] text-forest">
                {heading}
              </h2>
            )}
          </div>
        </FadeIn>

        {images && images.length > 0 && (
          <div className={`grid ${gridClass} gap-4`}>
            {images.map((image, i) => (
              <FadeIn key={image._key} delay={0.05 * i}>
                {image.asset?._ref && (
                  <Image
                    id={image.asset._ref}
                    alt={image.alt || ''}
                    width={600}
                    crop={image.crop}
                    hotspot={image.hotspot}
                    className="rounded-lg aspect-[4/3] w-full object-cover"
                  />
                )}
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
