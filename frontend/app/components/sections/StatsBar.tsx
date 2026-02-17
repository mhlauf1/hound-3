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
    <section className="relative mb-24 border-y border-dark md:mb-32 bg-lavender overflow-hidden">
      <div className="md:max-w-[80vw] px-8 md:px-20 mx-auto relative z-10 pb-[60px] lg:pb-[80px] pt-[80px] lg:pt-[100px]">
        {stats && stats.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <FadeIn key={stat._key} delay={0.1 * i}>
                <div className="bg-white rounded-md p-12 md:p-8 flex flex-col justify-center text-center shadow-card border border-dark h-full">
                  <div className="font-serif text-5xl  lg:text-6xl font-thin leading-[100%] tracking-[-0.01em] text-dark mb-2">
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
            <div className="text-center">
              <span className="font-serif text-2xl tracking-tight text-dark">Hound Around</span>
              <div className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-dark/70">
                Resort
              </div>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  )
}
