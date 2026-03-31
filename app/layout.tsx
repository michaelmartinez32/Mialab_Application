import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { InternalTestPanel } from '@/components/internal-test-panel'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Open a Mialab Account | Wholesale Optical Laboratory',
  description: 'Complete the application to open your account with Mialab, a wholesale optical laboratory that manufactures prescription lenses for optical practices.',
  generator: 'Mialab',
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/apple-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/apple-icon.png',
  },
  appleWebApp: {
    capable: true,
    title: 'Mialab Account Application',
    statusBarStyle: 'default',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
        <InternalTestPanel />
      </body>
    </html>
  )
}
