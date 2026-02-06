import './globals.css'

import {SpeedInsights} from '@vercel/speed-insights/next'
import type {Metadata} from 'next'
import {EB_Garamond} from 'next/font/google'
import {GeistSans} from 'geist/font/sans'
import {draftMode} from 'next/headers'
import {toPlainText} from 'next-sanity'
import {VisualEditing} from 'next-sanity/visual-editing'
import {Toaster} from 'sonner'

import DraftModeToast from '@/app/components/DraftModeToast'
import Footer from '@/app/components/Footer'
import Header from '@/app/components/Header'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
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

const ebGaramond = EB_Garamond({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data: settings} = await sanityFetch({query: settingsQuery})

  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${GeistSans.variable} bg-tan text-dark`}
    >
      <body>
        <Toaster />
        {isDraftMode && (
          <>
            <DraftModeToast />
            <VisualEditing />
          </>
        )}
        <SanityLive onError={handleError} />
        <Header
          navItems={settings?.navItems as any}
          ctaButton={settings?.ctaButton as any}
        />
        <main className="pt-[72px]">{children}</main>
        <Footer
          tagline={settings?.footerTagline ?? undefined}
          columns={settings?.footerColumns as any}
          contactInfo={settings?.contactInfo as any}
          footerText={settings?.footerText ?? undefined}
        />
        <SpeedInsights />
      </body>
    </html>
  )
}
