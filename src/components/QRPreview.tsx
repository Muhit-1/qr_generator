'use client'

import { useEffect, useRef, useState } from 'react'
import { QRCustomization, FrameStyle } from '@/types/qr.types'

interface Props {
  data: string
  customization: QRCustomization
  onQRReady: (qrInstance: any) => void
}

function getFrameStyles(style: FrameStyle, color: string): React.CSSProperties {
  const base: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0',
  }
  switch (style) {
    case 'simple':
      return { ...base, border: `3px solid ${color}`, padding: '12px', borderRadius: '8px' }
    case 'rounded':
      return { ...base, border: `3px solid ${color}`, padding: '16px', borderRadius: '24px' }
    case 'badge':
      return { ...base, border: `3px solid ${color}`, padding: '16px', borderRadius: '16px', background: color + '12' }
    default:
      return base
  }
}

// Always-visible decorative placeholder QR SVG
function PlaceholderQR({ fg, bg }: { fg: string; bg: string }) {
  const size = 280
  const cells = 25
  const cell = size / cells

  // Finder pattern cells (top-left, top-right, bottom-left)
  const finder: [number, number][] = []
  const finderPositions = [[0, 0], [0, 18], [18, 0]] as [number, number][]
  for (const [or, oc] of finderPositions) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        finder.push([or + r, oc + c])
      }
    }
  }

  // White "ring" inside each finder (rows/cols 1-5 relative)
  const finderWhite: [number, number][] = []
  for (const [or, oc] of finderPositions) {
    for (let r = 1; r <= 5; r++) {
      for (let c = 1; c <= 5; c++) {
        finderWhite.push([or + r, oc + c])
      }
    }
  }

  // Dark inner dot (rows/cols 2-4 relative)
  const finderDot: [number, number][] = []
  for (const [or, oc] of finderPositions) {
    for (let r = 2; r <= 4; r++) {
      for (let c = 2; c <= 4; c++) {
        finderDot.push([or + r, oc + c])
      }
    }
  }

  // Some interior data-like cells for visual realism
  const interior: [number, number][] = [
    [8,0],[8,2],[8,4],[8,6],[8,8],[8,10],[8,12],[8,14],[8,16],[8,18],[8,20],[8,22],[8,24],
    [0,8],[2,8],[4,8],[6,8],[10,8],[12,8],[14,8],[16,8],[18,8],[20,8],[22,8],[24,8],
    [9,9],[9,11],[9,13],[9,15],[9,17],[9,19],[9,21],[9,23],
    [10,10],[10,12],[10,14],[10,16],[10,18],[10,20],[10,22],
    [11,9],[11,11],[11,13],[11,17],[11,19],[11,21],[11,23],
    [12,10],[12,14],[12,16],[12,20],[12,22],
    [13,9],[13,11],[13,13],[13,15],[13,19],[13,21],[13,23],
    [14,10],[14,12],[14,16],[14,18],[14,20],[14,22],
    [15,9],[15,13],[15,15],[15,17],[15,19],[15,23],
    [16,10],[16,12],[16,14],[16,18],[16,20],[16,22],
    [17,9],[17,11],[17,13],[17,15],[17,17],[17,21],[17,23],
    [18,10],[18,14],[18,16],[18,20],[18,22],
    [19,9],[19,11],[19,13],[19,17],[19,19],[19,21],[19,23],
    [20,10],[20,12],[20,14],[20,16],[20,18],[20,22],
    [21,9],[21,11],[21,15],[21,19],[21,21],[21,23],
    [22,10],[22,12],[22,14],[22,16],[22,20],[22,22],
    [23,9],[23,11],[23,13],[23,15],[23,17],[23,21],[23,23],
    [24,10],[24,12],[24,14],[24,18],[24,20],[24,22],
  ]

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', opacity: 0.3 }}
    >
      <rect width={size} height={size} fill={bg} />
      {finder.map(([r, c], i) => (
        <rect key={`f${i}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={fg} rx={cell * 0.1} />
      ))}
      {finderWhite.map(([r, c], i) => (
        <rect key={`fw${i}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={bg} />
      ))}
      {finderDot.map(([r, c], i) => (
        <rect key={`fd${i}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={fg} rx={cell * 0.1} />
      ))}
      {interior.map(([r, c], i) => (
        <rect key={`in${i}`} x={c * cell} y={r * cell} width={cell} height={cell} fill={fg} rx={cell * 0.2} />
      ))}
    </svg>
  )
}

export default function QRPreview({ data, customization: c, onQRReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [everRendered, setEverRendered] = useState(false)

  const isEmpty = !data || data.trim().length === 0

  // When data goes empty, wipe the canvas and reset state
  useEffect(() => {
    if (isEmpty) {
      if (containerRef.current) containerRef.current.innerHTML = ''
      qrRef.current = null
      setEverRendered(false)
    }
  }, [isEmpty])

  // Generate / update the real QR
  useEffect(() => {
    if (isEmpty) return
    if (!containerRef.current) return

    let cancelled = false

    const run = async () => {
      setIsLoading(true)
      try {
        const QRCodeStyling = (await import('qr-code-styling')).default
        if (cancelled) return

        const opts = {
          data,
          width: Math.min(c.size, 400),
          height: Math.min(c.size, 400),
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
          qrRef.current.update(opts)
        } else {
          const qr = new QRCodeStyling(opts)
          if (containerRef.current && !cancelled) {
            containerRef.current.innerHTML = ''
            qr.append(containerRef.current)
          }
          qrRef.current = qr
          onQRReady(qr)
        }

        if (!cancelled) setEverRendered(true)
      } catch (err) {
        console.error('QR generation error:', err)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    run()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, c.foregroundColor, c.backgroundColor, c.dotType, c.cornerSquareType, c.cornerDotType, c.logoUrl, c.logoSize, c.logoMargin, c.errorCorrectionLevel, c.size])

  const frameStyle = getFrameStyles(c.frameStyle, c.frameColor)

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex flex-col items-center gap-4">
      <h2 className="font-display font-semibold text-sm text-text-muted uppercase tracking-widest self-start">
        Preview
      </h2>

      <div className="flex items-center justify-center min-h-[300px] w-full">
        {/* PLACEHOLDER — always visible when no real QR data */}
        {isEmpty && (
          <div className="flex flex-col items-center gap-3">
            <div style={getFrameStyles(c.frameStyle, c.frameColor)}>
              <PlaceholderQR fg={c.foregroundColor} bg={c.backgroundColor} />
              {c.frameStyle !== 'none' && c.frameLabel && (
                <div
                  className="mt-2 px-4 py-1 text-sm font-display font-bold tracking-widest"
                  style={{ color: c.frameColor, opacity: 0.4 }}
                >
                  {c.frameLabel}
                </div>
              )}
            </div>
            <p className="text-xs text-text-muted">
              Fill in the form to generate your QR code
            </p>
          </div>
        )}

        {/* REAL QR — shown when data exists */}
        {!isEmpty && (
          <div style={frameStyle}>
            {/* shimmer only on very first render before library loads */}
            {isLoading && !everRendered && (
              <div className="w-[280px] h-[280px] shimmer rounded-xl" />
            )}
            <div
              ref={containerRef}
              className="qr-preview-wrapper"
              style={{
                opacity: isLoading && !everRendered ? 0 : 1,
                position: isLoading && !everRendered ? 'absolute' : 'relative',
                transition: 'opacity 0.25s ease',
              }}
            />
            {c.frameStyle !== 'none' && c.frameLabel && (
              <div
                className="mt-2 px-4 py-1 text-sm font-display font-bold tracking-widest"
                style={{ color: c.frameColor }}
              >
                {c.frameLabel}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Always-visible metadata bar */}
      <div className="w-full flex items-center justify-between text-xs text-text-muted bg-surface-gray rounded-xl px-3 py-2 border border-surface-border">
        <span>Size: <strong className="text-text-secondary">{c.size}×{c.size}px</strong></span>
        <span>Error: <strong className="text-text-secondary">{c.errorCorrectionLevel}</strong></span>
        <span>Dots: <strong className="text-text-secondary capitalize">{c.dotType}</strong></span>
      </div>
    </div>
  )
}