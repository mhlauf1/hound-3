import DecorativeCurve from '@/app/components/ui/DecorativeCurve'
import {FadeIn} from '@/app/components/ui/FadeIn'

type StatsBarProps = {
  block: {
    stats?: Array<{
      _key: string
      value?: string
      label?: string
    }>
    showLogo?: boolean
  }
  index: number
  pageId: string
  pageType: string
}

export default function StatsBar({block}: StatsBarProps) {
  const {stats, showLogo} = block

  return (
    <section className="relative  border-y border-forest  bg-sand overflow-hidden">
      <div className="md:max-w-[80vw] px-8 md:px-20 mx-auto relative z-10 py-25 md:py-30">
        {stats && stats.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <FadeIn key={stat._key} delay={0.1 * i}>
                <div className="bg-white rounded-md p-12 md:p-8 flex flex-col justify-center text-center shadow-card border border-forest h-full">
                  <div className="text-5xl font-heading lg:text-6xl leading-[100%] tracking-tighter font-light text-forest mb-2">
                    {stat.value}
                  </div>
                  <div className="font-sans text-[14px] ">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {showLogo && (
          <FadeIn>
            <div className="flex flex-col items-center">
              <span className="font-heading text-2xl leading-tight  tracking-tight">
                Hound Around
              </span>
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] leading-tight">
                Resort
              </span>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
