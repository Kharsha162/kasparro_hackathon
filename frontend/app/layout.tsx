import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { SiteFooter } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'AI Store Reality Engine',
    template: '%s | AI Store Reality Engine'
  },
  description: 'Analyze how AI agents interpret your Shopify store with advanced AI-powered insights, trust scoring, and automated content optimization.',
  keywords: ['AI', 'Shopify', 'e-commerce', 'analytics', 'trust score', 'automation'],
  authors: [{ name: 'AI Store Reality Engine' }],
  creator: 'AI Store Reality Engine',
  publisher: 'AI Store Reality Engine',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://aistore-reality.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aistore-reality.com',
    title: 'AI Store Reality Engine',
    description: 'Analyze how AI agents interpret your Shopify store with advanced AI-powered insights.',
    siteName: 'AI Store Reality Engine',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Store Reality Engine',
    description: 'Analyze how AI agents interpret your Shopify store with advanced AI-powered insights.',
    creator: '@aistore-reality',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#020617" />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`} suppressHydrationWarning>
        <div className="relative min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
            <div className="relative z-10">
              {children}
            </div>
          </main>
          <SiteFooter />
        </div>
        <Toaster />
      </body>
    </html>
  )
}
