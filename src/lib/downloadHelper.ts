import { DownloadFormat, FrameSpec } from '@/types/qr.types'

interface FrameMetrics {
  border: number
  padding: number
  radius: number
  labelSize: number
  labelGap: number
  labelBlock: number
  total: number
  height: number
  offset: number
}

function measureFrame(size: number, frame: FrameSpec): FrameMetrics {
  if (frame.style === 'none') {
    return {
      border: 0,
      padding: 0,
      radius: 0,
      labelSize: 0,
      labelGap: 0,
      labelBlock: 0,
      total: size,
      height: size,
      offset: 0,
    }
  }

  const border = Math.max(4, Math.round(size * 0.028))
  const padding = Math.round(size * (frame.style === 'simple' ? 0.05 : 0.062))
  const radius =
    frame.style === 'simple' ? size * 0.02 : frame.style === 'rounded' ? size * 0.09 : size * 0.06

  const hasLabel = frame.label.trim().length > 0
  const labelSize = hasLabel ? Math.max(12, Math.round(size * 0.062)) : 0
  const labelGap = hasLabel ? Math.round(size * 0.035) : 0
  const labelBlock = hasLabel ? Math.round(labelSize * 1.35 + labelGap) : 0

  const offset = padding + border
  const total = size + offset * 2

  return {
    border,
    padding,
    radius,
    labelSize,
    labelGap,
    labelBlock,
    total,
    height: total + labelBlock,
    offset,
  }
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.min(radius, width / 2, height / 2)
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + width, y, x + width, y + height, r)
  ctx.arcTo(x + width, y + height, x, y + height, r)
  ctx.arcTo(x, y + height, x, y, r)
  ctx.arcTo(x, y, x + width, y, r)
  ctx.closePath()
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Could not read the generated QR image'))
    image.src = src
  })
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

async function ensureDisplayFont(pixelSize: number) {
  if (!document.fonts?.load) return
  try {
    await document.fonts.load(`700 ${pixelSize}px "Bricolage Grotesque"`)
  } catch {
    return
  }
}

async function rasterise(
  qrInstance: QRInstance,
  format: 'png' | 'jpeg',
  size: number,
  frame: FrameSpec,
  background: string
): Promise<Blob | null> {
  const metrics = measureFrame(size, frame)
  const source = await qrInstance.getRawData('png')
  if (!source) return null

  const sourceUrl = URL.createObjectURL(source as Blob)
  try {
    const image = await loadImage(sourceUrl)
    const canvas = document.createElement('canvas')
    canvas.width = metrics.total
    canvas.height = metrics.height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.fillStyle = format === 'jpeg' ? '#ffffff' : background
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    if (frame.style !== 'none') {
      if (frame.style === 'badge') {
        ctx.save()
        ctx.globalAlpha = 0.08
        ctx.fillStyle = frame.color
        roundedRect(ctx, 0, 0, metrics.total, metrics.total, metrics.radius)
        ctx.fill()
        ctx.restore()
      }

      ctx.strokeStyle = frame.color
      ctx.lineWidth = metrics.border
      roundedRect(
        ctx,
        metrics.border / 2,
        metrics.border / 2,
        metrics.total - metrics.border,
        metrics.total - metrics.border,
        metrics.radius
      )
      ctx.stroke()
    }

    ctx.drawImage(image, metrics.offset, metrics.offset, size, size)

    if (metrics.labelBlock > 0) {
      await ensureDisplayFont(metrics.labelSize)
      ctx.fillStyle = frame.color
      ctx.font = `700 ${metrics.labelSize}px "Bricolage Grotesque", "DM Sans", system-ui, sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      const letterSpacing = ctx as CanvasRenderingContext2D & { letterSpacing?: string }
      letterSpacing.letterSpacing = `${Math.round(metrics.labelSize * 0.1)}px`
      ctx.fillText(
        frame.label.trim(),
        metrics.total / 2,
        metrics.total + metrics.labelGap + metrics.labelSize * 0.68
      )
    }

    return await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, format === 'jpeg' ? 'image/jpeg' : 'image/png', 0.95)
    )
  } finally {
    URL.revokeObjectURL(sourceUrl)
  }
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

async function composeSvg(
  qrInstance: QRInstance,
  size: number,
  frame: FrameSpec,
  background: string
): Promise<Blob | null> {
  const raw = await qrInstance.getRawData('svg')
  if (!raw) return null

  const inner = await (raw as Blob).text()
  if (frame.style === 'none') return new Blob([inner], { type: 'image/svg+xml' })

  const metrics = measureFrame(size, frame)
  const nested = inner
    .replace(/^[\s\S]*?<svg/i, '<svg')
    .replace(/<svg/i, `<svg x="${metrics.offset}" y="${metrics.offset}"`)

  const badge =
    frame.style === 'badge'
      ? `<rect x="0" y="0" width="${metrics.total}" height="${metrics.total}" rx="${metrics.radius}" fill="${frame.color}" fill-opacity="0.08"/>`
      : ''

  const label =
    metrics.labelBlock > 0
      ? `<text x="${metrics.total / 2}" y="${
          metrics.total + metrics.labelGap + metrics.labelSize
        }" text-anchor="middle" font-family="Bricolage Grotesque, DM Sans, system-ui, sans-serif" font-weight="700" font-size="${
          metrics.labelSize
        }" letter-spacing="${Math.round(metrics.labelSize * 0.1)}" fill="${frame.color}">${escapeXml(
          frame.label.trim()
        )}</text>`
      : ''

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${metrics.total}" height="${
    metrics.height
  }" viewBox="0 0 ${metrics.total} ${metrics.height}">
<rect width="${metrics.total}" height="${metrics.height}" fill="${background}"/>
${badge}
<rect x="${metrics.border / 2}" y="${metrics.border / 2}" width="${
    metrics.total - metrics.border
  }" height="${metrics.total - metrics.border}" rx="${metrics.radius}" fill="none" stroke="${
    frame.color
  }" stroke-width="${metrics.border}"/>
${nested}
${label}
</svg>`

  return new Blob([svg], { type: 'image/svg+xml' })
}

export interface QRInstance {
  update: (options: Record<string, unknown>) => void
  append: (container: HTMLElement) => void
  getRawData: (extension: 'png' | 'svg' | 'jpeg') => Promise<Blob | null>
}

export async function downloadQRCode(
  qrInstance: QRInstance | null,
  format: DownloadFormat,
  size: number,
  frame: FrameSpec,
  background: string,
  filename = 'qr-code'
): Promise<void> {
  if (!qrInstance) return

  const blob =
    format === 'svg'
      ? await composeSvg(qrInstance, size, frame, background)
      : await rasterise(qrInstance, format, size, frame, background)

  if (!blob) return
  saveBlob(blob, `${filename}.${format === 'jpeg' ? 'jpg' : format}`)
}
