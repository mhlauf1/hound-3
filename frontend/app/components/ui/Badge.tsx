type BadgeProps = {
  children: React.ReactNode
  className?: string
}

export default function Badge({children, className = ''}: BadgeProps) {
  return (
    <span
      className={`inline-block font-sans text-[14px] font-normal uppercase tracking-[0.1em] text-dark ${className}`}
    >
      {children}
    </span>
  )
}
