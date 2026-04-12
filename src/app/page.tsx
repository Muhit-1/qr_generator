'use client'

import { useState, useCallback } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import QRInputForm from '@/components/QRInputForm'
import QRCustomizer from '@/components/QRCustomizer'
import QRPreview from '@/components/QRPreview'
import DownloadPanel from '@/components/DownloadPanel'
import { QR_TYPES, DEFAULT_CUSTOMIZATION } from '@/constants/qrTypes'
import { QRTypeId, QRFormData, QRCustomization } from '@/types/qr.types'
import { buildQRData } from '@/lib/qrBuilder'

export default function Home() {
  const [selectedType, setSelectedType] = useState<QRTypeId>('url')
  const [formData, setFormData] = useState<QRFormData>({ url: 'https://github.com/muhit-1' })
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

  const selectedTypeConfig = QR_TYPES.find((t) => t.id === selectedType)

  return (
    <div className="min-h-screen bg-surface-gray flex flex-col">
      <Header />

      {/* Hero */}
      <div
        className="py-8 px-4 text-center"
        style={{
          background: 'linear-gradient(135deg, #f2fbf7 0%, #e8f8f1 50%, #ffffff 100%)',
          borderBottom: '1px solid #e8edf0',
        }}
      >
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-2 tracking-tight">
          Free QR Code Generator
        </h1>
        <p className="text-text-secondary text-sm max-w-xl mx-auto">
          Create fully customizable QR codes — URLs, WiFi, contacts, social media, events & more.
        </p>
        <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
          {['15+ QR Types', 'Custom Colors', 'Logo Support', 'PNG • SVG • JPEG'].map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-3 py-1 rounded-full bg-white border border-surface-border text-text-secondary shadow-sm"
            >
              ✓ {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN APP ── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

          {/* ── LEFT COLUMN: Form + Customizer ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* QR Type + Input Form */}
            <div className="bg-white rounded-2xl border border-surface-border shadow-card">

              {/* Type tag strip */}
              <div className="border-b border-surface-border px-4 pt-4 pb-3">
                <p className="text-xs font-semibold text-text-muted uppercase tracking-widest mb-3">
                  QR Code Type
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {QR_TYPES.map((type) => {
                    const isSelected = selectedType === type.id
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleTypeChange(type.id)}
                        className={`
                          px-3.5 py-1.5 rounded-full text-sm font-semibold transition-all duration-150 whitespace-nowrap
                          ${isSelected
                            ? 'bg-brand-green text-white shadow-green'
                            : 'bg-surface-gray border border-surface-border text-text-secondary hover:border-brand-green hover:text-brand-green-dark hover:bg-brand-green-subtle'
                          }
                        `}
                      >
                        {type.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Content form */}
              <div className="p-5">
                {selectedTypeConfig && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg">{selectedTypeConfig.icon}</span>
                    <div>
                      <h2 className="font-display font-semibold text-sm text-text-primary">
                        {selectedTypeConfig.label}
                      </h2>
                      <p className="text-xs text-text-muted">{selectedTypeConfig.description}</p>
                    </div>
                  </div>
                )}
                <QRInputForm type={selectedType} data={formData} onChange={setFormData} />
              </div>
            </div>

            {/* Customizer — flows directly under the form */}
            <QRCustomizer customization={customization} onChange={setCustomization} />
          </div>

          {/* ── RIGHT COLUMN: Preview + Tips + Download ── */}
          <div className="lg:col-span-2 flex flex-col gap-5 sticky top-20">

            {/* Preview */}
            <QRPreview
              data={qrData}
              customization={customization}
              onQRReady={handleQRReady}
            />



            {/* Download */}
            <DownloadPanel
              qrInstance={qrInstance}
              size={customization.size}
              disabled={!hasContent}
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}