import { DownloadFormat } from '@/types/qr.types'

export async function downloadQRCode(
  qrInstance: any,
  format: DownloadFormat,
  size: number,
  filename = 'qrcode'
): Promise<void> {
  if (!qrInstance) return

  if (format === 'svg') {
    await qrInstance.download({ name: filename, extension: 'svg' })
    return
  }

  if (format === 'png') {
    await qrInstance.download({ name: filename, extension: 'png' })
    return
  }

  if (format === 'jpeg') {
    // qr-code-styling doesn't natively support jpeg, so we convert via canvas
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Get PNG blob from qr instance
    qrInstance.getRawData('png').then((blob: Blob) => {
      const url = URL.createObjectURL(blob)
      const img = new Image()
      img.onload = () => {
        // Fill white background (JPEG doesn't support transparency)
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(url)
        canvas.toBlob(
          (jpegBlob) => {
            if (!jpegBlob) return
            const a = document.createElement('a')
            a.href = URL.createObjectURL(jpegBlob)
            a.download = `${filename}.jpg`
            a.click()
            URL.revokeObjectURL(a.href)
          },
          'image/jpeg',
          0.95
        )
      }
      img.src = url
    })
  }
}