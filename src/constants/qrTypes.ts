import {
  AtSign,
  Banknote,
  CalendarDays,
  Contact,
  Facebook,
  Globe,
  Instagram,
  Link2,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Phone,
  Twitter,
  Type,
  Wifi,
  Youtube,
} from 'lucide-react'
import { QRCustomization, QRTypeConfig } from '@/types/qr.types'

export const QR_TYPES: QRTypeConfig[] = [
  {
    id: 'url',
    label: 'URL',
    icon: Globe,
    description: 'Open a website when scanned',
  },
  {
    id: 'text',
    label: 'Text',
    icon: Type,
    description: 'Show a plain text message',
  },
  {
    id: 'email',
    label: 'Email',
    icon: AtSign,
    description: 'Start a new email',
  },
  {
    id: 'phone',
    label: 'Phone',
    icon: Phone,
    description: 'Dial a phone number',
  },
  {
    id: 'sms',
    label: 'SMS',
    icon: MessageSquareText,
    description: 'Start a text message',
  },
  {
    id: 'vcard',
    label: 'Contact',
    icon: Contact,
    description: 'Save a contact card',
  },
  {
    id: 'wifi',
    label: 'Wi-Fi',
    icon: Wifi,
    description: 'Join a wireless network',
  },
  {
    id: 'location',
    label: 'Location',
    icon: MapPin,
    description: 'Open a point on the map',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: Facebook,
    description: 'Open a Facebook page',
  },
  {
    id: 'twitter',
    label: 'Twitter',
    icon: Twitter,
    description: 'Open a Twitter profile',
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: Instagram,
    description: 'Open an Instagram profile',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    icon: Youtube,
    description: 'Open a channel or video',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MessageCircle,
    description: 'Start a WhatsApp chat',
  },
  {
    id: 'event',
    label: 'Event',
    icon: CalendarDays,
    description: 'Add an event to a calendar',
  },
  {
    id: 'payment',
    label: 'Payment',
    icon: Banknote,
    description: 'Request a payment',
  },
]

export const FALLBACK_TYPE_ICON = Link2

export const DEFAULT_CUSTOMIZATION: QRCustomization = {
  foregroundColor: '#0a1712',
  backgroundColor: '#ffffff',
  dotType: 'rounded',
  cornerSquareType: 'extra-rounded',
  cornerDotType: 'dot',
  logoUrl: null,
  logoSize: 0.3,
  logoMargin: 5,
  frameStyle: 'none',
  frameColor: '#0b7a52',
  frameLabel: 'SCAN ME',
  size: 400,
  errorCorrectionLevel: 'M',
}
