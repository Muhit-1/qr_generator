'use client'

import { useEffect, useRef, useState } from 'react'
import { QRCustomization, FrameStyle } from '@/types/qr.types'

interface Props {
  data: string
  customization: QRCustomization
  onQRReady: (qrInstance: any) => void
}

function getFrameStyles(style: FrameStyle, color: string) {
  const base = {
    display: 'flex',
    flexDirection: 'column' as const,
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

export default function QRPreview({ data, customization: c, onQRReady }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const qrRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  useEffect(() => {
    if (!data || data.trim() === '') {
      setIsEmpty(true)
      return
    }
    setIsEmpty(false)
  }, [data])

  useEffect(() => {
    if (!containerRef.current || !data || data.trim() === '') return

    const initQR = async () => {
      setIsLoading(true)
      try {
        const QRCodeStyling = (await import('qr-code-styling')).default

        if (qrRef.current) {
          qrRef.current.update({
            data,
            width: Math.min(c.size, 400),
            height: Math.min(c.size, 400),
            dotsOptions: {
              color: c.foregroundColor,
              type: c.dotType,
            },
            backgroundOptions: {
              color: c.backgroundColor,
            },
            cornersSquareOptions: {
              type: c.cornerSquareType,
              color: c.foregroundColor,
            },
            cornersDotOptions: {
              type: c.cornerDotType,
              color: c.foregroundColor,
            },
            image: c.logoUrl || undefined,
            imageOptions: {
              hideBackgroundDots: true,
              imageSize: c.logoSize,
              margin: c.logoMargin,
              crossOrigin: 'anonymous',
            },
            qrOptions: {
              errorCorrectionLevel: c.errorCorrectionLevel,
            },
          })
        } else {
          const qr = new QRCodeStyling({
            width: Math.min(c.size, 400),
            height: Math.min(c.size, 400),
            data,
            dotsOptions: {
              color: c.foregroundColor,
              type: c.dotType,
            },
            backgroundOptions: {
              color: c.backgroundColor,
            },
            cornersSquareOptions: {
              type: c.cornerSquareType,
              color: c.foregroundColor,
            },
            cornersDotOptions: {
              type: c.cornerDotType,
              color: c.foregroundColor,
            },
            image: c.logoUrl || undefined,
            imageOptions: {
              hideBackgroundDots: true,
              imageSize: c.logoSize,
              margin: c.logoMargin,
              crossOrigin: 'anonymous',
            },
            qrOptions: {
              errorCorrectionLevel: c.errorCorrectionLevel,
            },
          })

          if (containerRef.current) {
            containerRef.current.innerHTML = ''
            qr.append(containerRef.current)
          }

          qrRef.current = qr
          onQRReady(qr)
        }
      } catch (err) {
        console.error('QR generation error:', err)
      } finally {
        setIsLoading(false)
      }
    }

    initQR()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, c.foregroundColor, c.backgroundColor, c.dotType, c.cornerSquareType, c.cornerDotType, c.logoUrl, c.logoSize, c.logoMargin, c.errorCorrectionLevel, c.size])

  const frameStyle = getFrameStyles(c.frameStyle, c.frameColor)

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-card flex flex-col items-center gap-4">
      <h2 className="font-display font-semibold text-sm text-text-muted uppercase tracking-widest self-start">
        Preview
      </h2>

      {/* QR Display Area */}
      <div className="flex items-center justify-center min-h-[280px] w-full">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-3 text-center p-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: '#e8f8f1' }}
            >
              🔲
            </div>
            <p className="text-sm text-text-muted max-w-[180px]">
              Fill in the form to generate your QR code
            </p>
          </div>
        ) : (
          <div style={frameStyle} className="animate-scale-in">
            {isLoading && (
              <div className="w-[300px] h-[300px] shimmer rounded-xl" />
            )}
            <div
              ref={containerRef}
              className={`qr-preview-wrapper transition-opacity duration-300 ${isLoading ? 'opacity-0 absolute' : 'opacity-100'}`}
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

      {/* Metadata */}
      {!isEmpty && !isLoading && (
        <div className="w-full flex items-center justify-between text-xs text-text-muted bg-surface-gray rounded-xl px-3 py-2 border border-surface-border">
          <span>Size: <strong className="text-text-secondary">{c.size}×{c.size}px</strong></span>
          <span>Error: <strong className="text-text-secondary">{c.errorCorrectionLevel}</strong></span>
          <span>Dots: <strong className="text-text-secondary capitalize">{c.dotType}</strong></span>
        </div>
      )}
    </div>
  )
}