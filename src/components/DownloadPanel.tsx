'use client'

import { useState } from 'react'
import { Download, FileCode2, FileImage, Image as ImageIcon, Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DownloadFormat, QRCustomization } from '@/types/qr.types'
import { downloadQRCode, QRInstance } from '@/lib/downloadHelper'

interface Props {
  qrInstance: QRInstance | null
  customization: QRCustomization
  disabled: boolean
}

const FORMATS: { format: DownloadFormat; label: string; note: string; icon: LucideIcon }[] = [
  { format: 'png', label: 'PNG', note: 'Web and print', icon: ImageIcon },
  { format: 'svg', label: 'SVG', note: 'Scales forever', icon: FileCode2 },
  { format: 'jpeg', label: 'JPG', note: 'Smallest file', icon: FileImage },
]

export default function DownloadPanel({ qrInstance, customization: c, disabled }: Props) {
  const [busyFormat, setBusyFormat] = useState<DownloadFormat | null>(null)

  const handleDownload = async (format: DownloadFormat) => {
    if (!qrInstance || disabled || busyFormat) return
    setBusyFormat(format)
    try {
      await downloadQRCode(
        qrInstance,
        format,
        c.size,
        { style: c.frameStyle, color: c.frameColor, label: c.frameLabel },
        c.backgroundColor,
        'qr-code'
      )
    } finally {
      setBusyFormat(null)
    }
  }

  const isBusy = busyFormat !== null

  return (
    <section className="space-y-4 rounded-2xl border border-surface-border bg-white p-5 shadow-card">
      <h2 className="font-display text-label font-bold uppercase tracking-[0.14em] text-text-muted">
        4. Download
      </h2>

      <div className="grid grid-cols-3 gap-2.5">
        {FORMATS.map(({ format, label, note, icon: Icon }) => {
          const isLoading = busyFormat === format
          return (
            <button
              key={format}
              type="button"
              onClick={() => handleDownload(format)}
              disabled={disabled || isBusy}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3.5 transition-colors duration-150 ${
                disabled
                  ? 'cursor-not-allowed border-surface-border text-text-muted opacity-60'
                  : isLoading
                    ? 'border-brand-green-dark bg-brand-green-muted text-brand-green-dark'
                    : 'border-surface-border text-text-primary hover:border-brand-green-dark hover:bg-brand-green-subtle'
              }`}
            >
              {isLoading ? (
                <Loader2 size={22} strokeWidth={2.2} className="animate-spin" aria-hidden="true" />
              ) : (
                <Icon size={22} strokeWidth={2.2} aria-hidden="true" />
              )}
              <span className="text-[0.9375rem] font-bold leading-none">{label}</span>
              <span className="text-center text-[0.8125rem] leading-tight text-text-muted">
                {note}
              </span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => handleDownload('png')}
        disabled={disabled || isBusy}
        className={`flex w-full items-center justify-center gap-2.5 rounded-xl py-4 font-display text-[1.0625rem] font-bold transition-colors duration-150 ${
          disabled
            ? 'cursor-not-allowed bg-surface-gray text-text-muted'
            : 'bg-brand-green-dark text-white shadow-green hover:bg-brand-green-ink'
        }`}
      >
        {isBusy ? (
          <>
            <Loader2 size={20} strokeWidth={2.4} className="animate-spin" aria-hidden="true" />
            Preparing file
          </>
        ) : (
          <>
            <Download size={20} strokeWidth={2.4} aria-hidden="true" />
            Download PNG
          </>
        )}
      </button>

      <p className="text-center text-[0.875rem] text-text-muted">
        {disabled
          ? 'Add your content to enable downloads.'
          : `Saved at ${c.size} × ${c.size}px, frame included.`}
      </p>
    </section>
  )
}
