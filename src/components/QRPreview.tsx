'use client'

import { useEffect, useRef, useState } from 'react'
import { QRCustomization, FrameStyle } from '@/types/qr.types'
import { QRInstance } from '@/lib/downloadHelper'
import { PlaceholderQR } from './ModuleArt'

interface Props {
  data: string
  customization: QRCustomization
  onQRReady: (qrInstance: QRInstance | null) => void
}

function frameShell(style: FrameStyle, color: string): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  }
  switch (style) {
    case 'simple':
      return { ...base, border: `3px solid ${color}`, padding: '14px', borderRadius: '8px' }
    case 'rounded':
      return { ...base, border: `3px solid ${color}`, padding: '18px', borderRadius: '26px' }
    case 'badge':
      return {
        ...base,
        border: `3px solid ${color}`,
        padding: '18px',
        borderRadius: '18px',
        background: `${color}14`,
      }
    default:
      return base
  }
}

export default function QRPreview({ data, customization: c, onQRReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<QRInstance | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [everRendered, setEverRendered] = useState(false)

  const isEmpty = data.trim().length === 0

  useEffect(() => {
    if (!isEmpty) return
    if (containerRef.current) containerRef.current.innerHTML = ''
    qrRef.current = null
    setEverRendered(false)
    onQRReady(null)
  }, [isEmpty, onQRReady])

  useEffect(() => {
    if (isEmpty || !containerRef.current) return

    let cancelled = false

    const render = async () => {
      setIsLoading(true)
      try {
        const QRCodeStyling = (await import('qr-code-styling')).default
        if (cancelled) return

        const options = {
          data,
          width: c.size,
          height: c.size,
          margin: Math.round(c.size * 0.02),
          dotsOptions: { color: c.foregroundColor, type: c.dotType },
          backgroundOptions: { color: c.backgroundColor },
          cornersSquareOptions: { type: c.cornerSquareType, color: c.foregroundColor },
          cornersDotOptions: { type: c.cornerDotType, color: c.foregroundColor },
          image: c.logoUrl || undefined,
          imageOptions: {
            hideBackgroundDots: true,
            imageSize: c.logoSize,
            margin: c.logoMargin,
            crossOrigin: 'anonymous',
          },
          qrOptions: { errorCorrectionLevel: c.errorCorrectionLevel },
        }

        if (qrRef.current) {
          qrRef.current.update(options)
        } else {
          const instance = new QRCodeStyling(options) as unknown as QRInstance
          if (containerRef.current && !cancelled) {
            containerRef.current.innerHTML = ''
            instance.append(containerRef.current)
            qrRef.current = instance
            onQRReady(instance)
          }
        }

        if (!cancelled) setEverRendered(true)
      } catch {
        if (!cancelled) setEverRendered(false)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    render()
    return () => {
      cancelled = true
    }
  }, [data, isEmpty, c, onQRReady])

  const shell = frameShell(c.frameStyle, c.frameColor)
  const showLabel = c.frameStyle !== 'none' && c.frameLabel.trim().length > 0
  const showShimmer = isLoading && !everRendered

  return (
    <section className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
      <h2 className="text-label font-bold uppercase tracking-[0.14em] text-text-muted">
        3. Preview
      </h2>

      <div className="mt-5 flex min-h-[320px] items-center justify-center">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-4">
            <div style={shell} className="opacity-40">
              <PlaceholderQR foreground={c.foregroundColor} background={c.backgroundColor} />
              {showLabel && (
                <div
                  className="mt-3 font-display text-base font-bold tracking-[0.16em]"
                  style={{ color: c.frameColor }}
                >
                  {c.frameLabel}
                </div>
              )}
            </div>
            <p className="max-w-[16rem] text-center text-[0.9375rem] text-text-secondary">
              Add your content above and the code appears here.
            </p>
          </div>
        ) : (
          <div style={shell}>
            {showShimmer && <div className="shimmer h-[260px] w-[260px] rounded-xl" />}
            <div
              ref={containerRef}
              className="qr-preview-wrapper w-[260px]"
              style={{
                opacity: showShimmer ? 0 : 1,
                position: showShimmer ? 'absolute' : 'relative',
                transition: 'opacity 0.25s ease',
              }}
            />
            {showLabel && (
              <div
                className="mt-3 font-display text-base font-bold tracking-[0.16em]"
                style={{ color: c.frameColor }}
              >
                {c.frameLabel}
              </div>
            )}
          </div>
        )}
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-surface-border bg-surface-border">
        {[
          { term: 'Size', value: `${c.size}px` },
          { term: 'Recovery', value: c.errorCorrectionLevel },
          { term: 'Dots', value: c.dotType.replace('-', ' ') },
        ].map(({ term, value }) => (
          <div key={term} className="bg-surface-gray px-3 py-2.5 text-center">
            <dt className="text-[0.75rem] font-semibold uppercase tracking-wider text-text-muted">
              {term}
            </dt>
            <dd className="mt-0.5 font-mono text-[0.875rem] font-medium capitalize text-text-primary">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
