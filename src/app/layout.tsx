import "./globals.css"
import type { Metadata } from 'next'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { siteDetails } from '@/data/siteDetails'
import { GoogleAnalytics } from '@next/third-parties/google';
import Providers from '@/app/providers/Providers';

export const metadata: Metadata = {
  metadataBase: new URL(siteDetails.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: siteDetails.metadata.title,
  description: siteDetails.metadata.description,
  openGraph: {
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    url: siteDetails.siteUrl,
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 675,
        alt: siteDetails.siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    images: ['/images/twitter-image.jpg'],
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-background text-foreground min-h-screen"
      >
        <Providers>
          <div className="min-h-screen flex flex-col bg-background">
            {siteDetails.googleAnalyticsId && <GoogleAnalytics gaId={siteDetails.googleAnalyticsId} />}
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
