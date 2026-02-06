import DecorativeCurve from '@/app/components/ui/DecorativeCurve'

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
    <section className="relative bg-lavender overflow-hidden">
      <DecorativeCurve color="white" position="top-left" className="w-[500px] h-[300px]" />
      <DecorativeCurve color="white" position="bottom-right" className="w-[400px] h-[250px]" />

      <div className="container relative z-10 py-[60px] lg:py-[80px]">
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div
                key={stat._key}
                className="bg-white rounded-md p-6 text-center shadow-card border border-border-light"
              >
                <div className="font-sans text-[36px] lg:text-[48px] font-medium leading-[100%] tracking-[-0.01em] text-dark mb-2">
                  {stat.value}
                </div>
                <div className="font-sans text-[14px] lg:text-[16px] text-text-muted">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {showLogo && (
          <div className="text-center">
            <span className="font-serif text-2xl tracking-tight text-dark">Hound Around</span>
            <div className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-dark/70">
              Resort
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
