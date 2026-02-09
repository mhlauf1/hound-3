export default function DotGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(232,120,48,0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '18px 18px',
          WebkitMaskImage:
            'radial-gradient(ellipse 45% 40% at 50% 45%, transparent 0%, black 70%)',
          maskImage:
            'radial-gradient(ellipse 45% 40% at 50% 45%, transparent 0%, black 70%)',
        }}
      />
    </div>
  )
}
