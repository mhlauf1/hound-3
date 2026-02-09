type BadgeProps = {
  children: React.ReactNode
  className?: string
}

export default function Badge({children, className = ''}: BadgeProps) {
  return (
    <span
      className={`inline-block font-sans text-[12px] font-medium uppercase tracking-[0.1em] text-dark/70 ${className}`}
    >
      {children}
    </span>
  )
}
