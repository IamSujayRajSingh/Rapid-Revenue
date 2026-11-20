import { Inter } from 'next/font/google'
import './globals.css'
import Nav from '@/components/site/nav'
import Footer from '@/components/site/footer'
import StickyCTA from '@/components/site/sticky-cta'
import { SITE } from '@/lib/site-config'
import { orgSchema, websiteSchema, professionalServiceSchema, JsonLd } from '@/components/seo/schemas'

const inter = Inter({ subsets: ['latin'], weight: ['400','500','600','700','800','900'], variable: '--font-inter', display: 'swap' })

export const metadata = {
  metadataBase: new URL(SITE.url),
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s — ${SITE.name}` },
  description: SITE.description,
  keywords: 'Profit Engineering, D2C growth agency India, Performance Marketing, Shopify agency, CAC optimization, MER, RTO reduction, Meta Ads India, Google Ads, Amazon growth, Flipkart growth, Rapid Revenue, Sujay Raj Singh, ecommerce consulting India',
  authors: [{ name: SITE.founder, url: `${SITE.url}/founder` }],
  creator: SITE.founder,
  publisher: SITE.name,
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: {
    title: `${SITE.name} — Scale Smarter. Grow Profitably.`,
    description: SITE.description,
    type: 'website',
    url: SITE.url,
    siteName: SITE.name,
    locale: 'en_IN',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Rapid Revenue — India\'s Leading Profit Engineering Company' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — Scale Smarter. Grow Profitably.`,
    description: SITE.description,
    creator: '@SujayRajSingh',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
  },
  // './' is resolved against metadataBase + the current route, so every page gets its own
  // canonical URL (a fixed SITE.url here made every page point at the home page).
  alternates: { canonical: './' },
  category: 'business',
  applicationName: SITE.name,
  referrer: 'origin-when-cross-origin',
}

export const viewport = {
  themeColor: '#F5F7FA',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//calendly.com" />
        <JsonLd data={orgSchema} />
        <JsonLd data={websiteSchema} />
        <JsonLd data={professionalServiceSchema()} />
      </head>
      <body className="font-sans antialiased bg-background text-heading selection:bg-highlight selection:text-heading">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded">Skip to content</a>
        <Nav />
        <div id="main">{children}</div>
        <Footer />
        <StickyCTA />
      </body>
    </html>
  )
}
