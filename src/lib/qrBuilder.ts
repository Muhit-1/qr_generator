import { QRTypeId, QRFormData } from '@/types/qr.types'

function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, '\\$1')
}

function escapeIcal(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function icalDate(value: string): string {
  if (!value) return ''
  return `${value.replace(/[-:]/g, '').slice(0, 15)}00`.slice(0, 15)
}

function joinLines(lines: (string | false | undefined)[]): string {
  return lines.filter(Boolean).join('\r\n')
}

export function buildQRData(type: QRTypeId, data: QRFormData): string {
  switch (type) {
    case 'url':
      return data.url?.trim() || ''

    case 'text':
      return data.text || ''

    case 'email': {
      const to = data.emailTo?.trim()
      if (!to) return ''
      const params: string[] = []
      if (data.emailSubject) params.push(`subject=${encodeURIComponent(data.emailSubject)}`)
      if (data.emailBody) params.push(`body=${encodeURIComponent(data.emailBody)}`)
      return `mailto:${to}${params.length ? `?${params.join('&')}` : ''}`
    }

    case 'phone': {
      const phone = data.phone?.trim()
      return phone ? `tel:${phone}` : ''
    }

    case 'sms': {
      const phone = data.smsPhone?.trim()
      if (!phone) return ''
      const body = data.smsMessage ? `?body=${encodeURIComponent(data.smsMessage)}` : ''
      return `sms:${phone}${body}`
    }

    case 'vcard': {
      const first = data.vcardFirstName?.trim() || ''
      const last = data.vcardLastName?.trim() || ''
      if (!first && !last) return ''
      return joinLines([
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escapeIcal(last)};${escapeIcal(first)};;;`,
        `FN:${escapeIcal([first, last].filter(Boolean).join(' '))}`,
        data.vcardOrg && `ORG:${escapeIcal(data.vcardOrg)}`,
        data.vcardTitle && `TITLE:${escapeIcal(data.vcardTitle)}`,
        data.vcardPhone && `TEL;TYPE=CELL:${escapeIcal(data.vcardPhone)}`,
        data.vcardEmail && `EMAIL;TYPE=INTERNET:${escapeIcal(data.vcardEmail)}`,
        data.vcardWebsite && `URL:${escapeIcal(data.vcardWebsite)}`,
        data.vcardAddress && `ADR;TYPE=WORK:;;${escapeIcal(data.vcardAddress)};;;;`,
        'END:VCARD',
      ])
    }

    case 'wifi': {
      const ssid = data.wifiSSID?.trim()
      if (!ssid) return ''
      const security = data.wifiSecurity || 'WPA'
      const password = security === 'nopass' ? '' : data.wifiPassword || ''
      return `WIFI:T:${security};S:${escapeWifi(ssid)};P:${escapeWifi(password)};H:${
        data.wifiHidden ? 'true' : 'false'
      };;`
    }

    case 'location': {
      const lat = data.locationLat?.trim()
      const lng = data.locationLng?.trim()
      if (!lat || !lng) return ''
      const label = data.locationLabel
        ? `?q=${lat},${lng}(${encodeURIComponent(data.locationLabel)})`
        : ''
      return `geo:${lat},${lng}${label}`
    }

    case 'facebook':
      return data.facebookUrl?.trim() || ''

    case 'twitter': {
      const handle = data.twitterUsername?.trim().replace(/^@/, '')
      return handle ? `https://twitter.com/${handle}` : ''
    }

    case 'instagram': {
      const handle = data.instagramUsername?.trim().replace(/^@/, '')
      return handle ? `https://instagram.com/${handle}` : ''
    }

    case 'youtube':
      return data.youtubeUrl?.trim() || ''

    case 'whatsapp': {
      const phone = data.whatsappPhone?.replace(/\D/g, '')
      if (!phone) return ''
      const text = data.whatsappMessage ? `?text=${encodeURIComponent(data.whatsappMessage)}` : ''
      return `https://wa.me/${phone}${text}`
    }

    case 'event': {
      const title = data.eventTitle?.trim()
      if (!title) return ''
      return joinLines([
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        `SUMMARY:${escapeIcal(title)}`,
        data.eventLocation && `LOCATION:${escapeIcal(data.eventLocation)}`,
        data.eventStart && `DTSTART:${icalDate(data.eventStart)}`,
        data.eventEnd && `DTEND:${icalDate(data.eventEnd)}`,
        data.eventDescription && `DESCRIPTION:${escapeIcal(data.eventDescription)}`,
        'END:VEVENT',
        'END:VCALENDAR',
      ])
    }

    case 'payment': {
      const address = data.paymentAddress?.trim()
      if (!address) return ''
      const amount = data.paymentAmount?.trim()
      const currency = data.paymentCurrency?.trim().toUpperCase()

      if (data.paymentType === 'bitcoin') {
        const params: string[] = []
        if (amount) params.push(`amount=${amount}`)
        if (data.paymentNote) params.push(`message=${encodeURIComponent(data.paymentNote)}`)
        return `bitcoin:${address}${params.length ? `?${params.join('&')}` : ''}`
      }

      if (data.paymentType === 'upi') {
        const params = [`pa=${encodeURIComponent(address)}`]
        if (amount) params.push(`am=${amount}`)
        if (currency) params.push(`cu=${currency}`)
        if (data.paymentNote) params.push(`tn=${encodeURIComponent(data.paymentNote)}`)
        return `upi://pay?${params.join('&')}`
      }

      const suffix = amount ? `/${amount}${currency || ''}` : ''
      return `https://paypal.me/${address.replace(/^@/, '')}${suffix}`
    }

    default:
      return ''
  }
}
