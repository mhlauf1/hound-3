type SectionWrapperProps = {
  background?: 'tan' | 'lavender' | 'dark'
  curvedTop?: boolean
  className?: string
  children: React.ReactNode
  id?: string
}

const bgColors = {
  tan: 'bg-tan',
  lavender: 'bg-lavender',
  dark: 'bg-dark text-cream',
}

export default function SectionWrapper({
  background = 'tan',
  curvedTop = false,
  className = '',
  children,
  id,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden ${bgColors[background]} ${curvedTop ? 'rounded-t-[48px] -mt-12 relative z-10' : ''} ${className}`}
    >
      <div className="container py-[80px] lg:py-[120px]">{children}</div>
    </section>
  )
}
