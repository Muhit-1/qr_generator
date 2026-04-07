'use client'

import { useState } from 'react'
import { DownloadFormat } from '@/types/qr.types'
import { downloadQRCode } from '@/lib/downloadHelper'

interface Props {
  qrInstance: any
  size: number
  disabled: boolean
}

const FORMATS: { format: DownloadFormat; label: string; desc: string; icon: string }[] = [
  { format: 'png', label: 'PNG', desc: 'Best for web & print', icon: '🖼️' },
  { format: 'svg', label: 'SVG', desc: 'Scalable vector', icon: '✏️' },
  { format: 'jpeg', label: 'JPEG', desc: 'Smaller file size', icon: '📷' },
]

export default function DownloadPanel({ qrInstance, size, disabled }: Props) {
  const [downloading, setDownloading] = useState<DownloadFormat | null>(null)

  const handleDownload = async (format: DownloadFormat) => {
    if (!qrInstance || disabled) return
    setDownloading(format)
    try {
      await downloadQRCode(qrInstance, format, size, 'qr-studio')
    } finally {
      setTimeout(() => setDownloading(null), 800)
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card space-y-4">
      <h2 className="font-display font-semibold text-sm text-text-muted uppercase tracking-widest">
        Download
      </h2>

      {/* Format buttons */}
      <div className="grid grid-cols-3 gap-2">
        {FORMATS.map(({ format, label, desc, icon }) => {
          const isLoading = downloading === format
          return (
            <button
              key={format}
              onClick={() => handleDownload(format)}
              disabled={disabled || !!downloading}
              className={`
                flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200
                ${
                  disabled
                    ? 'border-surface-border text-text-muted opacity-50 cursor-not-allowed'
                    : isLoading
                    ? 'border-brand-green bg-brand-green-muted scale-95'
                    : 'border-surface-border hover:border-brand-green hover:bg-brand-green-subtle cursor-pointer'
                }
              `}
            >
              <span className="text-xl">{isLoading ? '⏳' : icon}</span>
              <span className="text-sm font-bold text-text-primary">{label}</span>
              <span className="text-xs text-text-muted text-center leading-tight">{desc}</span>
            </button>
          )
        })}
      </div>

      {/* Main CTA — download PNG */}
      <button
        onClick={() => handleDownload('png')}
        disabled={disabled || !!downloading}
        className={`
          w-full py-3.5 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-200
          ${
            disabled
              ? 'bg-surface-gray text-text-muted cursor-not-allowed'
              : 'bg-brand-green text-white hover:bg-brand-green-dark shadow-green hover:shadow-green-lg active:scale-95'
          }
        `}
      >
        {downloading ? '⏳ Downloading...' : '⬇ Download QR Code'}
      </button>

      {disabled && (
        <p className="text-xs text-text-muted text-center">
          Fill in the content above to enable download
        </p>
      )}
    </div>
  )
}