export default function GrainGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Film grain via SVG noise filter */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="hero-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={3}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" opacity="0.18" />
      </svg>

      {/* Soft color glows pooling behind hero image area */}
      <div
        className="absolute inset-0"
        style={{
          background: [
            'radial-gradient(ellipse 65% 55% at 50% 75%, rgba(240,215,255,0.45) 0%, transparent 70%)',
            'radial-gradient(ellipse 55% 50% at 40% 65%, rgba(232,120,48,0.20) 0%, transparent 55%)',
          ].join(', '),
        }}
      />
    </div>
  )
}
