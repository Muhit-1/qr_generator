import type { LucideIcon } from 'lucide-react'

export type QRTypeId =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'vcard'
  | 'wifi'
  | 'location'
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'youtube'
  | 'whatsapp'
  | 'event'
  | 'payment'

export type DotType =
  | 'square'
  | 'rounded'
  | 'dots'
  | 'classy'
  | 'classy-rounded'
  | 'extra-rounded'

export type CornerSquareType = 'square' | 'dot' | 'extra-rounded'
export type CornerDotType = 'square' | 'dot'
export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'
export type DownloadFormat = 'png' | 'svg' | 'jpeg'
export type FrameStyle = 'none' | 'simple' | 'rounded' | 'badge'

export interface QRCustomization {
  foregroundColor: string
  backgroundColor: string
  dotType: DotType
  cornerSquareType: CornerSquareType
  cornerDotType: CornerDotType
  logoUrl: string | null
  logoSize: number
  logoMargin: number
  frameStyle: FrameStyle
  frameColor: string
  frameLabel: string
  size: number
  errorCorrectionLevel: ErrorCorrectionLevel
}

export interface QRFormData {
  url?: string
  text?: string
  emailTo?: string
  emailSubject?: string
  emailBody?: string
  phone?: string
  smsPhone?: string
  smsMessage?: string
  vcardFirstName?: string
  vcardLastName?: string
  vcardOrg?: string
  vcardTitle?: string
  vcardPhone?: string
  vcardEmail?: string
  vcardWebsite?: string
  vcardAddress?: string
  wifiSSID?: string
  wifiPassword?: string
  wifiSecurity?: 'WPA' | 'WEP' | 'nopass'
  wifiHidden?: boolean
  locationLat?: string
  locationLng?: string
  locationLabel?: string
  facebookUrl?: string
  twitterUsername?: string
  instagramUsername?: string
  youtubeUrl?: string
  whatsappPhone?: string
  whatsappMessage?: string
  eventTitle?: string
  eventLocation?: string
  eventStart?: string
  eventEnd?: string
  eventDescription?: string
  paymentType?: 'paypal' | 'bitcoin' | 'upi'
  paymentAddress?: string
  paymentAmount?: string
  paymentCurrency?: string
  paymentNote?: string
}

export interface QRTypeConfig {
  id: QRTypeId
  label: string
  icon: LucideIcon
  description: string
}

export interface FrameSpec {
  style: FrameStyle
  color: string
  label: string
}