'use client'

import {useState} from 'react'
import {PortableText} from '@portabletext/react'
import type {PortableTextBlock} from 'next-sanity'
import Button from '@/app/components/ui/Button'
import {FadeIn} from '@/app/components/ui/FadeIn'
import {stegaClean} from '@sanity/client/stega'
import Badge from '../ui/Badge'

type FormField = {
  _key: string
  fieldName?: string
  label?: string
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select'
  required?: boolean
  options?: string[]
}

type ContactFormProps = {
  block: {
    eyebrow?: string
    heading?: string
    description?: PortableTextBlock[]
    formFields?: FormField[]
    submitButtonText?: string
    successMessage?: string
    showMap?: boolean
    mapEmbedUrl?: string
    address?: string
    phone?: string
    email?: string
  }
  index: number
  pageId: string
  pageType: string
}

export default function ContactForm({block}: ContactFormProps) {
  const {
    eyebrow,
    heading,
    description,
    formFields,
    submitButtonText,
    successMessage,
    showMap,
    mapEmbedUrl,
    address,
    phone,
    email,
  } = block

  const [formData, setFormData] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({...prev, [fieldName]: value}))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setFormData({})
    } catch (err) {
      setStatus('error')
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  const hasContactInfo = address || phone || email || (stegaClean(showMap) && mapEmbedUrl)

  return (
    <section className="bg-cream">
      <div className="px-6 md:px-24 py-16 lg:py-24">
        <FadeIn>
          <div className="mb-10 lg:mb-14">
            {eyebrow && (
              <FadeIn>
                <Badge className="mb-3">{eyebrow}</Badge>
              </FadeIn>
            )}
            {heading && (
              <h2 className="text-[36px] md:text-[48px] lg:text-[56px] leading-[105%] text-forest mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <div className="font-sans text-[16px] md:text-[18px] leading-[150%] text-charcoal/80 max-w-2xl prose prose-p:mb-3">
                <PortableText value={description} />
              </div>
            )}
          </div>
        </FadeIn>

        <div
          className={`grid grid-cols-1 ${hasContactInfo ? 'lg:grid-cols-2' : ''} gap-10 lg:gap-16`}
        >
          {/* Form */}
          <FadeIn>
            {status === 'success' ? (
              <div className="bg-forest/5 rounded-lg p-8 text-center">
                <svg
                  className="h-12 w-12 text-forest mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="font-sans text-[18px] md:text-[20px] text-forest font-medium">
                  {successMessage || "Thank you! We'll be in touch soon."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {formFields &&
                  formFields.map((field) => {
                    const fieldName = stegaClean(field.fieldName) || ''
                    const fieldType = stegaClean(field.type) || 'text'

                    return (
                      <div key={field._key}>
                        {field.label && (
                          <label className="block font-sans text-[14px] font-medium text-forest mb-1.5">
                            {field.label}
                            {field.required && <span className="text-terracotta ml-1">*</span>}
                          </label>
                        )}
                        {fieldType === 'textarea' ? (
                          <textarea
                            name={fieldName}
                            required={field.required || false}
                            rows={4}
                            value={formData[fieldName] || ''}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            className="w-full rounded-md border border-sand bg-white px-4 py-3 font-sans text-[16px] text-forest placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
                          />
                        ) : fieldType === 'select' ? (
                          <select
                            name={fieldName}
                            required={field.required || false}
                            value={formData[fieldName] || ''}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            className="w-full rounded-md border border-sand bg-white px-4 py-3 font-sans text-[16px] text-forest focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
                          >
                            <option value="">Select an option...</option>
                            {field.options?.map((opt, oi) => (
                              <option key={oi} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={fieldType}
                            name={fieldName}
                            required={field.required || false}
                            value={formData[fieldName] || ''}
                            onChange={(e) => handleChange(fieldName, e.target.value)}
                            className="w-full rounded-md border border-sand bg-white px-4 py-3 font-sans text-[16px] text-forest placeholder:text-charcoal/40 focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-colors"
                          />
                        )}
                      </div>
                    )
                  })}

                {status === 'error' && (
                  <p className="font-sans text-[14px] text-red-600">{errorMessage}</p>
                )}

                <Button type="submit" variant="primary">
                  {status === 'submitting' ? 'Sending...' : submitButtonText || 'Send Message'}
                </Button>
              </form>
            )}
          </FadeIn>

          {/* Contact info + map */}
          {hasContactInfo && (
            <FadeIn delay={0.1}>
              <div className="space-y-6">
                {stegaClean(showMap) && mapEmbedUrl && (
                  <div className="rounded-lg overflow-hidden aspect-video">
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{border: 0}}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Map"
                    />
                  </div>
                )}

                <div className="space-y-4">
                  {address && (
                    <div>
                      <h4 className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-1">
                        Address
                      </h4>
                      <p className="font-sans text-[16px] text-charcoal/80 whitespace-pre-line">
                        {address}
                      </p>
                    </div>
                  )}
                  {phone && (
                    <div>
                      <h4 className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-1">
                        Phone
                      </h4>
                      <a
                        href={`tel:${phone.replace(/\D/g, '')}`}
                        className="font-sans text-[16px] text-forest hover:text-terracotta transition-colors"
                      >
                        {phone}
                      </a>
                    </div>
                  )}
                  {email && (
                    <div>
                      <h4 className="font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-terracotta mb-1">
                        Email
                      </h4>
                      <a
                        href={`mailto:${email}`}
                        className="font-sans text-[16px] text-forest hover:text-terracotta transition-colors"
                      >
                        {email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  )
}
