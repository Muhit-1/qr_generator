// 📁 Path: \Projects_file\qr generator\src\app\page.tsx

'use client'

import { useState, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import QRTypeSelector from '@/components/QRTypeSelector'
import QRInputForm from '@/components/QRInputForm'
import QRCustomizer from '@/components/QRCustomizer'
import QRPreview from '@/components/QRPreview'
import DownloadPanel from '@/components/DownloadPanel'
import { QRTypeId, QRFormData, QRCustomization } from '@/types/qr.types'
import { DEFAULT_CUSTOMIZATION } from '@/constants/qrTypes'
import { buildQRData } from '@/lib/qrBuilder'

export default function Home() {
  const [selectedType, setSelectedType] = useState<QRTypeId>('url')
  const [formData, setFormData] = useState<QRFormData>({ url: '' })
  const [customization, setCustomization] = useState<QRCustomization>(DEFAULT_CUSTOMIZATION)
  const [qrInstance, setQRInstance] = useState<any>(null)

  const handleTypeChange = (type: QRTypeId) => {
    setSelectedType(type)
    setFormData({})
  }

  const qrData = buildQRData(selectedType, formData)

  const hasContent = qrData.trim().length > 3

  const handleQRReady = useCallback((instance: any) => {
    setQRInstance(instance)
  }, [])

  return (
    <div className="min-h-screen bg-surface-gray flex flex-col">
      <Header />

      {/* Hero Banner */}
      <div
        className="py-10 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, #f2fbf7 0%, #e8f8f1 50%, #ffffff 100%)',
          borderBottom: '1px solid #e8edf0',
        }}
      >
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-2 tracking-tight">
          Free QR Code Generator
        </h1>
        <p className="text-text-secondary text-base max-w-xl mx-auto">
          Create fully customizable QR codes for anything — URLs, WiFi, contacts, social media,
          events, payments &amp; more. No sign up. No watermark.
        </p>
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          {['15+ QR Types', 'Custom Colors', 'Logo Support', 'PNG • SVG • JPEG'].map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white border border-surface-border text-text-secondary shadow-sm"
            >
              ✓ {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Main App */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column: Type + Form */}
          <div className="lg:col-span-4 space-y-5">
            <QRTypeSelector selected={selectedType} onChange={handleTypeChange} />
            <QRInputForm type={selectedType} data={formData} onChange={setFormData} />
          </div>

          {/* Middle Column: Customizer */}
          <div className="lg:col-span-4">
            <QRCustomizer customization={customization} onChange={setCustomization} />
          </div>

          {/* Right Column: Preview + Download */}
          <div className="lg:col-span-4 space-y-5">
            <QRPreview
              data={qrData}
              customization={customization}
              onQRReady={handleQRReady}
            />
            <DownloadPanel
              qrInstance={qrInstance}
              size={customization.size}
              disabled={!hasContent}
            />

            {/* Tips Card */}
            <div className="bg-brand-green-subtle border border-brand-green/20 rounded-2xl p-4">
              <h3 className="font-display font-semibold text-sm text-brand-green-dark mb-2">
                💡 Tips for best results
              </h3>
              <ul className="text-xs text-text-secondary space-y-1.5">
                <li>• Use <strong>Error Level H</strong> when adding a logo</li>
                <li>• Keep high contrast between foreground &amp; background</li>
                <li>• Download as <strong>SVG</strong> for print-ready quality</li>
                <li>• Test your QR code before printing</li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}