import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: {
    default: 'House of Marie-Angela Exquisite | Luxury Fashion',
    template: '%s | House of Marie-Angela Exquisite',
  },
  description: 'Luxury fashion house offering premium clothing, jewelry, and fashion education. Shop Women, Men, Children collections and discover our fashion academy.',
  keywords: ['luxury fashion', 'Nigerian fashion', 'fashion academy', 'jewelry', 'clothing', 'Marie-Angela'],
  openGraph: {
    title: 'House of Marie-Angela Exquisite',
    description: 'Luxury fashion house offering premium clothing, jewelry, and fashion education.',
    type: 'website',
    locale: 'en_NG',
    siteName: 'House of Marie-Angela Exquisite',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'House of Marie-Angela Exquisite',
    description: 'Luxury fashion house offering premium clothing, jewelry, and fashion education.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: { fontFamily: 'var(--font-jost)', fontSize: '14px' },
            success: { iconTheme: { primary: '#C026D3', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  )
}
