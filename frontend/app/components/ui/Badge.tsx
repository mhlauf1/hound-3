type BadgeProps = {
  children: React.ReactNode
  className?: string
}

export default function Badge({children, className = ''}: BadgeProps) {
  return (
    <span className={`inline-block font-sans text-[12px] font-medium  text-dark/70 ${className}`}>
      {children}
    </span>
  )
}
