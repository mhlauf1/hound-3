import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {Bricolage_Grotesque, Poppins} from 'next/font/google'

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const bricolage = Bricolage_Grotesque({
  variable: '--font-heading',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery, servicesNavQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {handleError} from '@/app/client-utils'

export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })
  const title = settings?.title || 'Hound Around Resort'
  const description = settings?.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: description ? toPlainText(description) : '',
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  const [{data: settings}, {data: services}] = await Promise.all([
    sanityFetch({query: settingsQuery}),
    sanityFetch({query: servicesNavQuery}),
  ])

  // Inject services as dropdown children into the "Services" nav item
  const navItems = settings?.navItems?.map((item: any) => {
    if (item.label === 'Services' && services && services.length > 0) {
      return {
        ...item,
        children: services.map((service: any) => ({
          _key: service._id,
          label: service.title,
          link: {linkType: 'href', href: `/services/${service.slug}`},
        })),
      }
    }
    return item
  })

  return (
    <html lang="en" className={`${poppins.variable} ${bricolage.variable} bg-cream text-forest`}>
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" />
      </head>
      <body>
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <SanityLive onError={handleError} />
        <Header navItems={navItems as any} ctaButton={settings?.ctaButton as any} logo={settings?.logo as any} />
        <main>{children}</main>
        <Footer
          tagline={settings?.footerTagline ?? undefined}
          columns={settings?.footerColumns as any}
          contactInfo={settings?.contactInfo as any}
          footerText={settings?.footerText ?? undefined}
          footerTextLink={settings?.footerTextLink as any}
          bottomLinks={settings?.footerBottomLinks as any}
          logo={settings?.logo as any}
          socialLinks={settings?.socialLinks as any}
          footerSticker={settings?.footerSticker as any}
        />
        <SpeedInsights />
      </body>
    </html>
  )
}
