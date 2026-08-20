'use client'

import { useCallback, useMemo, useState } from 'react'
import { Palette, ScanLine, Shapes, Download } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import QRInputForm from '@/components/QRInputForm'
import QRCustomizer from '@/components/QRCustomizer'
import QRPreview from '@/components/QRPreview'
import DownloadPanel from '@/components/DownloadPanel'
import { QR_TYPES, DEFAULT_CUSTOMIZATION } from '@/constants/qrTypes'
import { QRTypeId, QRFormData, QRCustomization } from '@/types/qr.types'
import { QRInstance } from '@/lib/downloadHelper'
import { buildQRData } from '@/lib/qrBuilder'

const HIGHLIGHTS = [
  { icon: ScanLine, label: '15 code types' },
  { icon: Palette, label: 'Your colours' },
  { icon: Shapes, label: 'Logo and frame' },
  { icon: Download, label: 'PNG, SVG, JPG' },
]

export default function Home() {
  const [selectedType, setSelectedType] = useState<QRTypeId>('url')
  const [formData, setFormData] = useState<QRFormData>({})
  const [customization, setCustomization] = useState<QRCustomization>(DEFAULT_CUSTOMIZATION)
  const [qrInstance, setQRInstance] = useState<QRInstance | null>(null)

  const qrData = useMemo(() => buildQRData(selectedType, formData), [selectedType, formData])
  const hasContent = qrData.trim().length > 0

  const handleTypeChange = (type: QRTypeId) => {
    setSelectedType(type)
    setFormData({})
  }

  const handleQRReady = useCallback((instance: QRInstance | null) => {
    setQRInstance(instance)
  }, [])

  const activeType = QR_TYPES.find((type) => type.id === selectedType)

  return (
    <div className="flex min-h-screen flex-col bg-surface-gray">
      <Header />

      <section className="border-b border-surface-border bg-gradient-to-b from-brand-green-subtle via-brand-green-subtle to-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-label font-semibold uppercase tracking-[0.18em] text-brand-green-dark">
            Free QR code generator
          </p>
          <h1 className="mt-4 font-display text-[clamp(2.15rem,5vw,3.25rem)] font-extrabold leading-[1.08] tracking-tight text-text-primary">
            Make a QR code people can actually scan
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            Pick what the code should do, style it to match your brand, and download it at full
            resolution. Nothing is uploaded and nothing is watermarked.
          </p>

          <ul className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-surface-border bg-white px-4 py-2 text-micro font-semibold text-text-secondary shadow-sm"
              >
                <Icon size={16} strokeWidth={2.2} className="text-brand-green-dark" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <main className="mx-auto w-full max-w-app flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-5">
          <div className="flex flex-col gap-6 lg:col-span-3">
            <section className="overflow-hidden rounded-2xl border border-surface-border bg-white shadow-card">
              <div className="border-b border-surface-border px-5 pb-4 pt-5">
                <h2 className="text-label font-bold uppercase tracking-[0.14em] text-text-muted">
                  1. Choose a type
                </h2>
                <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="QR code type">
                  {QR_TYPES.map((type) => {
                    const Icon = type.icon
                    const isSelected = selectedType === type.id
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => handleTypeChange(type.id)}
                        aria-pressed={isSelected}
                        className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[0.9375rem] font-semibold transition-colors duration-150 ${
                          isSelected
                            ? 'bg-brand-green-dark text-white shadow-green'
                            : 'border border-surface-border bg-surface-gray text-text-secondary hover:border-brand-green hover:bg-brand-green-subtle hover:text-brand-green-dark'
                        }`}
                      >
                        <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
                        {type.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="p-5">
                {activeType && (
                  <div className="mb-5 flex items-start gap-3">
                    <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green-muted text-brand-green-dark">
                      <activeType.icon size={20} strokeWidth={2.2} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold leading-tight text-text-primary">
                        {activeType.label}
                      </h3>
                      <p className="text-[0.9375rem] text-text-secondary">
                        {activeType.description}
                      </p>
                    </div>
                  </div>
                )}
                <QRInputForm type={selectedType} data={formData} onChange={setFormData} />
              </div>
            </section>

            <QRCustomizer customization={customization} onChange={setCustomization} />
          </div>

          <div className="flex flex-col gap-6 lg:sticky lg:top-[5.5rem] lg:col-span-2">
            <QRPreview
              data={qrData}
              customization={customization}
              onQRReady={handleQRReady}
            />
            <DownloadPanel
              qrInstance={qrInstance}
              customization={customization}
              disabled={!hasContent}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
