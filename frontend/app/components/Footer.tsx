import Link from 'next/link'

type FooterLink = {
  _key: string
  label?: string
  link?: any
}

type FooterColumn = {
  _key: string
  title?: string
  links?: FooterLink[]
}

type FooterBottomLink = {
  _key: string
  label?: string
  link?: any
}

type FooterProps = {
  tagline?: string
  columns?: FooterColumn[]
  contactInfo?: {address?: string; phone?: string; email?: string}
  footerText?: string
  footerTextLink?: {label?: string; href?: string}
  bottomLinks?: FooterBottomLink[]
}

export default function Footer({
  tagline,
  columns,
  contactInfo,
  footerText,
  footerTextLink,
  bottomLinks,
}: FooterProps) {
  return (
    <footer className="bg-tan relative">
      {/* Lavender accent line */}
      <div className="h-1.5 bg-lavender" />

      <div className="px-6 md:px-20 py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div>
            <div className="mb-4">
              <span className="font-serif text-2xl tracking-tight">Hound Around</span>
              <div className="font-sans text-[11px] font-medium uppercase tracking-[0.2em]">
                Resort
              </div>
            </div>
            {tagline && (
              <p className="font-sans text-[15px] max-w-[34ch] text-text-muted leading-relaxed">
                {tagline}
              </p>
            )}
          </div>

          {/* Dynamic columns */}
          {columns?.map((col) => (
            <div key={col._key}>
              <h4 className="font-sans text-[16px] font-medium mb-4">{col.title}</h4>
              <ul className="space-y-3">
                {col.links?.map((item) => (
                  <li key={item._key}>
                    <Link
                      href={resolveFooterLink(item.link) || '#'}
                      className="font-sans text-[15px] text-text-muted hover:text-dark transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact column */}
          {contactInfo && (
            <div>
              <h4 className="font-sans text-[16px] font-medium mb-4">Contact</h4>
              <div className="space-y-3 font-sans text-[15px] text-text-muted">
                {contactInfo.address && (
                  <p className="whitespace-pre-line">{contactInfo.address}</p>
                )}
                {contactInfo.phone && <p>{contactInfo.phone}</p>}
                {contactInfo.email && (
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="block hover:text-dark transition-colors"
                  >
                    {contactInfo.email}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border-light">
        <div className="px-6 md:px-20 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-sans text-[14px] text-text-muted">
            {footerText
              ? footerTextLink?.label && footerTextLink?.href
                ? renderFooterTextWithLink(footerText, footerTextLink.label, footerTextLink.href)
                : footerText
              : `\u00A9 ${new Date().getFullYear()} Hound Around Resort. All rights reserved.`}
          </p>
          {bottomLinks && bottomLinks.length > 0 && (
            <div className="flex items-center gap-6">
              {bottomLinks.map((item) => (
                <Link
                  key={item._key}
                  href={resolveFooterLink(item.link) || '#'}
                  className="font-sans text-[14px] text-text-muted hover:text-dark transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

function resolveFooterLink(link: any): string | null {
  if (!link) return null
  if (link.linkType === 'href' && link.href) return link.href
  if (link.linkType === 'page' && link.page) return `/${link.page}`
  if (link.href) return link.href
  return null
}

function renderFooterTextWithLink(text: string, linkLabel: string, href: string) {
  const idx = text.indexOf(linkLabel)
  if (idx === -1) return text
  return (
    <>
      {text.slice(0, idx)}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-dark transition-colors"
      >
        {linkLabel}
      </a>
      {text.slice(idx + linkLabel.length)}
    </>
  )
}
