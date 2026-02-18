import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'

type HeroMinimalProps = {
  block: {
    eyebrow?: string
    heading?: string
    headingAccent?: string
    subtext?: string
    backgroundColor?: 'cream' | 'sand' | 'forest'
  }
  index: number
  pageId: string
  pageType: string
}

const bgColors: Record<string, string> = {
  cream: 'bg-cream text-forest',
  sand: 'bg-sand text-forest',
  forest: 'bg-forest text-cream',
}

export default function HeroMinimal({block}: HeroMinimalProps) {
  const {eyebrow, heading, headingAccent, subtext, backgroundColor} = block
  const bg = bgColors[stegaClean(backgroundColor) || 'cream'] || bgColors.cream
  const isDark = stegaClean(backgroundColor) === 'forest'

  return (
    <section className={`${bg} min-h-[55vh] flex items-end justify-center`}>
      <div className="px-6 md:px-24 pb-12 lg:pb-16 pt-24 text-center w-full">
        <div className="max-w-4xl mx-auto">
          {eyebrow && (
            <FadeIn>
              <p
                className={`font-sans text-[14px] font-medium uppercase tracking-[0.08em] mb-4 ${isDark ? 'text-terracotta-light' : 'text-terracotta'}`}
              >
                {eyebrow}
              </p>
            </FadeIn>
          )}
          {heading && (
            <FadeIn delay={0.05}>
              <h1 className="text-[48px] md:text-[56px] lg:text-[72px] xl:text-[84px] tracking-tighter leading-[110%]">
                {heading}
              </h1>
            </FadeIn>
          )}
          {headingAccent && (
            <FadeIn delay={0.1}>
              <span
                className={`text-[48px] font-medium md:text-[56px] lg:text-[72px] xl:text-[84px] tracking-tighter  leading-[110%]  ${isDark ? 'text-terracotta-light' : 'text-terracotta'}`}
              >
                {headingAccent}
              </span>
            </FadeIn>
          )}
          {subtext && (
            <FadeIn delay={0.15}>
              <p
                className={`font-sans text-[16px] lg:text-[18px] font-light leading-[150%] mt-6 max-w-2xl mx-auto ${isDark ? 'text-text-muted-dark' : 'text-text-muted'}`}
              >
                {subtext}
              </p>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}
