'use client'

import {FadeIn} from '@/app/components/ui/FadeIn'
import WebcamEmbed from '@/app/components/sections/WebcamEmbed'

type Webcam = {
  _id: string
  name: string
  cameraId: string
  group: string
  sortOrder?: number
}

type WebcamGridProps = {
  block: {
    heading?: string
    subtext?: string
    trustMessage?: string
    showGroupHeaders?: boolean
    webcams?: Webcam[]
  }
  index: number
  pageId: string
  pageType: string
}

export default function WebcamGrid({block}: WebcamGridProps) {
  const {heading, subtext, trustMessage, showGroupHeaders = true, webcams = []} = block

  const indoor = webcams.filter((w) => w.group === 'indoor')
  const outdoor = webcams.filter((w) => w.group === 'outdoor')

  return (
    <section className="bg-cream">
      <div className="max-w-[1580px] mx-auto px-6 lg:px-10 py-[80px] lg:py-[120px]">
        {/* Section header */}
        <FadeIn>
          <div className="text-center mb-10 lg:mb-14">
            {heading && (
              <h2 className="text-forest text-[36px] md:text-[48px] lg:text-[56px] font-semibold tracking-tight leading-[95%] mb-4">
                {heading}
              </h2>
            )}
            {subtext && (
              <p className="text-charcoal/70 text-[16px] md:text-[18px] max-w-[600px] mx-auto">
                {subtext}
              </p>
            )}
          </div>
        </FadeIn>

        {/* Trust message banner */}
        {trustMessage && (
          <FadeIn delay={0.1}>
            <div className="mb-10 lg:mb-14 mx-auto max-w-3xl text-center bg-forest/5 border border-forest/10 rounded-lg px-6 py-4">
              <p className="text-[15px] md:text-[16px] text-forest/80 leading-relaxed">
                {trustMessage}
              </p>
            </div>
          </FadeIn>
        )}

        {/* Indoor cameras */}
        {indoor.length > 0 && (
          <div className="mb-12">
            {showGroupHeaders && (
              <FadeIn>
                <h3 className="text-forest text-[24px] md:text-[28px] font-semibold mb-6">
                  Indoor Play Areas
                </h3>
              </FadeIn>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {indoor.map((cam) => (
                <WebcamEmbed key={cam._id} cameraId={cam.cameraId} name={cam.name} />
              ))}
            </div>
          </div>
        )}

        {/* Outdoor cameras */}
        {outdoor.length > 0 && (
          <div>
            {showGroupHeaders && (
              <FadeIn>
                <h3 className="text-forest text-[24px] md:text-[28px] font-semibold mb-6">
                  Outdoor Play Areas
                </h3>
              </FadeIn>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {outdoor.map((cam) => (
                <WebcamEmbed key={cam._id} cameraId={cam.cameraId} name={cam.name} />
              ))}
            </div>
          </div>
        )}

        {webcams.length === 0 && (
          <p className="text-center text-charcoal/50 text-[16px]">
            No cameras are currently available.
          </p>
        )}
      </div>
    </section>
  )
}
