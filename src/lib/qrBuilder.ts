import { QRTypeId, QRFormData } from '@/types/qr.types'

export function buildQRData(type: QRTypeId, data: QRFormData): string {
  switch (type) {
    case 'url':
      return data.url || 'https://example.com'

    case 'text':
      return data.text || ''

    case 'email': {
      const parts: string[] = []
      if (data.emailSubject) parts.push(`subject=${encodeURIComponent(data.emailSubject)}`)
      if (data.emailBody) parts.push(`body=${encodeURIComponent(data.emailBody)}`)
      return `mailto:${data.emailTo || ''}${parts.length ? '?' + parts.join('&') : ''}`
    }

    case 'phone':
      return `tel:${data.phone || ''}`

    case 'sms':
      return `sms:${data.smsPhone || ''}${data.smsMessage ? `?body=${encodeURIComponent(data.smsMessage)}` : ''}`

    case 'vcard':
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${data.vcardLastName || ''};${data.vcardFirstName || ''};;;`,
        `FN:${data.vcardFirstName || ''} ${data.vcardLastName || ''}`,
        data.vcardOrg ? `ORG:${data.vcardOrg}` : '',
        data.vcardTitle ? `TITLE:${data.vcardTitle}` : '',
        data.vcardPhone ? `TEL;TYPE=CELL:${data.vcardPhone}` : '',
        data.vcardEmail ? `EMAIL:${data.vcardEmail}` : '',
        data.vcardWebsite ? `URL:${data.vcardWebsite}` : '',
        data.vcardAddress ? `ADR;TYPE=WORK:;;${data.vcardAddress};;;;` : '',
        'END:VCARD',
      ]
        .filter(Boolean)
        .join('\n')

    case 'wifi':
      return `WIFI:T:${data.wifiSecurity || 'WPA'};S:${data.wifiSSID || ''};P:${data.wifiPassword || ''};H:${data.wifiHidden ? 'true' : 'false'};;`

    case 'location':
      return `geo:${data.locationLat || '0'},${data.locationLng || '0'}${data.locationLabel ? `?q=${encodeURIComponent(data.locationLabel)}` : ''}`

    case 'facebook':
      return data.facebookUrl || 'https://facebook.com/'

    case 'twitter':
      return `https://twitter.com/${data.twitterUsername || ''}`

    case 'instagram':
      return `https://instagram.com/${data.instagramUsername || ''}`

    case 'youtube':
      return data.youtubeUrl || 'https://youtube.com/'

    case 'whatsapp': {
      const phone = (data.whatsappPhone || '').replace(/\D/g, '')
      const msg = data.whatsappMessage ? `?text=${encodeURIComponent(data.whatsappMessage)}` : ''
      return `https://wa.me/${phone}${msg}`
    }

    case 'event': {
      const formatDate = (d: string) => d?.replace(/[-:]/g, '').replace('T', 'T') || ''
      return [
        'BEGIN:VEVENT',
        `SUMMARY:${data.eventTitle || ''}`,
        data.eventLocation ? `LOCATION:${data.eventLocation}` : '',
        data.eventStart ? `DTSTART:${formatDate(data.eventStart)}` : '',
        data.eventEnd ? `DTEND:${formatDate(data.eventEnd)}` : '',
        data.eventDescription ? `DESCRIPTION:${data.eventDescription}` : '',
        'END:VEVENT',
      ]
        .filter(Boolean)
        .join('\n')
    }

    case 'payment': {
      if (data.paymentType === 'bitcoin') {
        return `bitcoin:${data.paymentAddress || ''}${data.paymentAmount ? `?amount=${data.paymentAmount}` : ''}`
      }
      if (data.paymentType === 'upi') {
        const parts = [`pa=${data.paymentAddress || ''}`, `am=${data.paymentAmount || '0'}`]
        if (data.paymentNote) parts.push(`tn=${encodeURIComponent(data.paymentNote)}`)
        return `upi://pay?${parts.join('&')}`
      }
      // PayPal
      return `https://paypal.me/${data.paymentAddress || ''}${data.paymentAmount ? `/${data.paymentAmount}` : ''}`
    }

    default:
      return ''
  }
}