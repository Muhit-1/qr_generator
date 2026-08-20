import type { Metadata, Viewport } from 'next'
import React from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'QR Studio — Free QR Code Generator',
  description:
    'Build customisable QR codes for links, Wi-Fi, contacts, events and payments. Everything is generated in your browser, with no account and no watermark.',
  keywords: ['qr code generator', 'free qr code', 'custom qr code', 'wifi qr code', 'vcard qr code'],
  applicationName: 'QR Studio',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
  openGraph: {
    title: 'QR Studio — Free QR Code Generator',
    description: 'Build customisable QR codes in your browser. No account, no watermark.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#66cc99',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
