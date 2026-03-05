type TextLogoProps = {
  className?: string
  align?: 'center' | 'left'
}

export default function TextLogo({className = '', align = 'center'}: TextLogoProps) {
  return (
    <div className={`flex flex-col ${align === 'left' ? 'items-start' : 'items-center'} ${className}`}>
      <span className="font-heading text-2xl leading-tight font-bold tracking-tight">
        Hound Around
      </span>
      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] leading-tight">
        Resort
      </span>
    </div>
  )
}
