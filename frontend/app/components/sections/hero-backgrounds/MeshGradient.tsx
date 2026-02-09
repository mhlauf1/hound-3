export default function MeshGradient() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes mesh-drift-1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -45px) scale(1.05); }
          66% { transform: translate(-40px, 55px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes mesh-drift-2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-55px, 35px) scale(0.96); }
          66% { transform: translate(45px, -50px) scale(1.04); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes mesh-drift-3 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(35px, 65px) scale(1.06); }
          66% { transform: translate(-50px, -25px) scale(0.94); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes mesh-drift-4 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-45px, -55px) scale(0.97); }
          66% { transform: translate(55px, 35px) scale(1.03); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes mesh-drift-5 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, 40px) scale(1.04); }
          66% { transform: translate(-35px, -60px) scale(0.96); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mesh-blob { animation: none !important; }
        }
      `}</style>

      {/* Orange blob — top-left */}
      <div
        className="mesh-blob absolute rounded-full"
        style={{
          width: 600,
          height: 600,
          top: '-15%',
          left: '-10%',
          backgroundColor: 'rgba(232,120,48,0.22)',
          filter: 'blur(130px)',
          animation: 'mesh-drift-1 24s ease-in-out infinite',
        }}
      />

      {/* Lavender blob — top-right */}
      <div
        className="mesh-blob absolute rounded-full"
        style={{
          width: 700,
          height: 700,
          top: '5%',
          right: '-12%',
          backgroundColor: 'rgba(240,215,255,0.35)',
          filter: 'blur(140px)',
          animation: 'mesh-drift-2 30s ease-in-out infinite',
        }}
      />

      {/* Deep orange blob — bottom-left */}
      <div
        className="mesh-blob absolute rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: '-5%',
          left: '5%',
          backgroundColor: 'rgba(232,120,48,0.15)',
          filter: 'blur(120px)',
          animation: 'mesh-drift-3 21s ease-in-out infinite',
        }}
      />

      {/* Warm cream blob — center */}
      <div
        className="mesh-blob absolute rounded-full"
        style={{
          width: 550,
          height: 550,
          top: '25%',
          left: '25%',
          backgroundColor: 'rgba(255,248,230,0.30)',
          filter: 'blur(130px)',
          animation: 'mesh-drift-4 27s ease-in-out infinite',
        }}
      />

      {/* Lavender accent blob — bottom-right */}
      <div
        className="mesh-blob absolute rounded-full"
        style={{
          width: 450,
          height: 450,
          bottom: '0%',
          right: '5%',
          backgroundColor: 'rgba(240,215,255,0.20)',
          filter: 'blur(110px)',
          animation: 'mesh-drift-5 26s ease-in-out infinite',
        }}
      />
    </div>
  )
}
