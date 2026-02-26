'use client'

type WebcamEmbedProps = {
  cameraId: string
  name: string
}

export default function WebcamEmbed({cameraId, name}: WebcamEmbedProps) {
  return (
    <div className="rounded-lg overflow-hidden bg-white border border-border-light shadow-sm">
      <div className="relative aspect-video bg-[#1a1a1a]">
        <iframe
          src={`https://g1.ipcamlive.com/player/player.php?alias=${cameraId}&autoplay=1&mute=1&disablenavigation=1`}
          title={name}
          allow="autoplay; fullscreen"
          allowFullScreen={true}
          loading="lazy"
          className="absolute inset-0 w-full h-full"
        />
      </div>
      <div className="px-4 py-3">
        <p className="text-charcoal text-[14px] font-medium">{name}</p>
      </div>
    </div>
  )
}
