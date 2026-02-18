'use client'

import {useState} from 'react'
import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from 'next-sanity'
import {FadeIn} from '@/app/components/ui/FadeIn'

type FaqAccordionProps = {
  block: {
    eyebrow?: string
    heading?: string
    faqs?: Array<{
      _key: string
      question?: string
      answer?: PortableTextBlock[]
    }>
  }
  index: number
  pageId: string
  pageType: string
}

function AccordionItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: {_key: string; question?: string; answer?: PortableTextBlock[]}
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-sand">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="font-sans text-[18px] md:text-[20px] font-medium text-forest pr-4">
          {faq.question}
        </span>
        <svg
          className={`h-5 w-5 shrink-0 text-forest transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        {faq.answer && (
          <div className="font-sans text-[16px] leading-[150%] text-charcoal/80 prose prose-p:mb-3">
            <PortableText value={faq.answer} />
          </div>
        )}
      </div>
    </div>
  )
}

export default function FaqAccordion({block}: FaqAccordionProps) {
  const {eyebrow, heading, faqs} = block
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="bg-cream">
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="max-w-3xl mx-auto">
            {eyebrow && (
              <p className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-3">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] leading-[105%] text-forest mb-10">
                {heading}
              </h2>
            )}
          </div>
        </FadeIn>

        {faqs && faqs.length > 0 && (
          <div className="max-w-3xl mx-auto">
            {faqs.map((faq, i) => (
              <FadeIn key={faq._key} delay={0.05 * i}>
                <AccordionItem
                  faq={faq}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
