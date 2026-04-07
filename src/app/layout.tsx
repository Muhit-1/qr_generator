import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QR Studio — Free QR Code Generator',
  description:
    'Create fully customizable QR codes for URLs, text, email, phone, WiFi, vCard, social media, events, payments and more. Free, no signup required.',
  keywords: 'qr code generator, free qr code, custom qr code, qr maker',
  authors: [{ name: 'QR Studio' }],
  openGraph: {
    title: 'QR Studio — Free QR Code Generator',
    description: 'Create beautiful, fully customizable QR codes in seconds.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}