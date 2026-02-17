'use client'

import Link from 'next/link'
import {useState, useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import Button from '@/app/components/ui/Button'

type NavChild = {
  _key: string
  label?: string
  link?: any
}

type NavItem = {
  _key: string
  label?: string
  link?: any
  children?: NavChild[]
}

type HeaderProps = {
  navItems?: NavItem[]
  ctaButton?: {buttonText?: string; link?: any}
}

export default function Header({navItems, ctaButton}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, {passive: true})
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300">
      <div className="px-2 md:px-20">
        <div className="flex border  bg-tan/95 backdrop-blur-sm border-dark/20 rounded-md mt-4 pl-4 md:pl-12 pr-2 md:pr-6 items-center justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex flex-col items-center">
            <span className="font-serif text-xl leading-tight font-semibold tracking-tight">
              Hound Around
            </span>
            <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.2em] leading-tight">
              Resort
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems?.map((item) => (
              <div key={item._key} className="relative">
                {item.children && item.children.length > 0 ? (
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === item._key ? null : item._key)}
                    onBlur={() => setTimeout(() => setDropdownOpen(null), 200)}
                    className="flex items-center gap-1 font-sans text-[16px] text-dark hover:text-dark/70 transition-colors"
                  >
                    {item.label}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="mt-0.5">
                      <path
                        d="M3 5L6 8L9 5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={resolveNavLink(item.link) || '#'}
                    className="font-sans text-[16px] text-dark hover:text-dark/70 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown */}
                {item.children && item.children.length > 0 && dropdownOpen === item._key && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-md shadow-card-hover py-2 min-w-[160px] border border-border-light">
                    {item.children.map((child) => (
                      <Link
                        key={child._key}
                        href={resolveNavLink(child.link) || '#'}
                        className="block px-4 py-2 text-[15px] font-sans text-dark hover:bg-lavender/30 transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            {ctaButton?.buttonText && (
              <Button variant="primary" link={ctaButton.link}>
                {ctaButton.buttonText}
              </Button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-[2px] bg-dark transition-transform ${mobileOpen ? 'rotate-45 translate-y-[5px]' : ''}`}
            />
            <span
              className={`block w-6 h-[2px] bg-dark transition-opacity ${mobileOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`block w-6 h-[2px] bg-dark transition-transform ${mobileOpen ? '-rotate-45 -translate-y-[5px]' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu slide-in */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
              className="fixed inset-0 bg-dark/40 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{x: '100%'}}
              animate={{x: 0}}
              exit={{x: '100%'}}
              transition={{type: 'spring', damping: 30, stiffness: 300}}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-[360px] bg-tan z-50 md:hidden flex flex-col shadow-xl"
            >
              {/* Close button */}
              <div className="flex justify-end p-5">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2"
                  aria-label="Close menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-8 overflow-y-auto">
                {navItems?.map((item, i) => (
                  <motion.div
                    key={item._key}
                    initial={{opacity: 0, x: 20}}
                    animate={{opacity: 1, x: 0}}
                    transition={{delay: 0.1 + i * 0.05, duration: 0.3}}
                  >
                    <Link
                      href={resolveNavLink(item.link) || '#'}
                      className="block font-serif text-[28px] tracking-tight text-dark py-3 border-b border-border-light"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                    {item.children?.map((child) => (
                      <Link
                        key={child._key}
                        href={resolveNavLink(child.link) || '#'}
                        className="block font-sans text-[16px] text-text-muted pl-4 py-2"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </motion.div>
                ))}
              </nav>

              {/* CTA at bottom */}
              {ctaButton?.buttonText && (
                <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{delay: 0.3, duration: 0.3}}
                  className="p-8 pt-4"
                  onClick={() => setMobileOpen(false)}
                >
                  <Button variant="primary" link={ctaButton.link} className="w-full">
                    {ctaButton.buttonText}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}

function resolveNavLink(link: any): string | null {
  if (!link) return null
  if (link.linkType === 'href' && link.href) return link.href
  if (link.linkType === 'page' && link.page) return `/${link.page}`
  if (link.href) return link.href
  return null
}
