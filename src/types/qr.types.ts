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
  // Colors
  foregroundColor: string
  backgroundColor: string
  // Dot style
  dotType: DotType
  cornerSquareType: CornerSquareType
  cornerDotType: CornerDotType
  // Logo
  logoUrl: string | null
  logoSize: number // 0.2 - 0.4
  logoMargin: number
  // Frame
  frameStyle: FrameStyle
  frameColor: string
  frameLabel: string
  // Output
  size: number // 100 - 1200
  errorCorrectionLevel: ErrorCorrectionLevel
}

export interface QRFormData {
  // URL
  url?: string
  // Text
  text?: string
  // Email
  emailTo?: string
  emailSubject?: string
  emailBody?: string
  // Phone
  phone?: string
  // SMS
  smsPhone?: string
  smsMessage?: string
  // vCard
  vcardFirstName?: string
  vcardLastName?: string
  vcardOrg?: string
  vcardTitle?: string
  vcardPhone?: string
  vcardEmail?: string
  vcardWebsite?: string
  vcardAddress?: string
  // WiFi
  wifiSSID?: string
  wifiPassword?: string
  wifiSecurity?: 'WPA' | 'WEP' | 'nopass'
  wifiHidden?: boolean
  // Location
  locationLat?: string
  locationLng?: string
  locationLabel?: string
  // Social
  facebookUrl?: string
  twitterUsername?: string
  instagramUsername?: string
  youtubeUrl?: string
  whatsappPhone?: string
  whatsappMessage?: string
  // Event
  eventTitle?: string
  eventLocation?: string
  eventStart?: string
  eventEnd?: string
  eventDescription?: string
  // Payment
  paymentType?: 'paypal' | 'bitcoin' | 'upi'
  paymentAddress?: string
  paymentAmount?: string
  paymentCurrency?: string
  paymentNote?: string
}

export interface QRTypeConfig {
  id: QRTypeId
  label: string
  icon: string
  description: string
  color: string
}