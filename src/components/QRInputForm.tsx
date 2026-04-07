'use client'

import { QRTypeId, QRFormData } from '@/types/qr.types'

interface Props {
  type: QRTypeId
  data: QRFormData
  onChange: (data: QRFormData) => void
}

const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-text-primary text-sm placeholder:text-text-muted focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all'
const labelClass = 'block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wide'
const fieldClass = 'space-y-1'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={fieldClass}>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  )
}

export default function QRInputForm({ type, data, onChange }: Props) {
  const set = (key: keyof QRFormData, value: string | boolean) =>
    onChange({ ...data, [key]: value })

  const forms: Record<QRTypeId, React.ReactNode> = {
    url: (
      <Field label="Website URL">
        <input
          className={inputClass}
          type="url"
          placeholder="https://example.com"
          value={data.url || ''}
          onChange={(e) => set('url', e.target.value)}
        />
      </Field>
    ),

    text: (
      <Field label="Text Content">
        <textarea
          className={inputClass}
          rows={4}
          placeholder="Enter any text..."
          value={data.text || ''}
          onChange={(e) => set('text', e.target.value)}
        />
      </Field>
    ),

    email: (
      <>
        <Field label="Email Address">
          <input className={inputClass} type="email" placeholder="hello@example.com" value={data.emailTo || ''} onChange={(e) => set('emailTo', e.target.value)} />
        </Field>
        <Field label="Subject">
          <input className={inputClass} placeholder="Email subject" value={data.emailSubject || ''} onChange={(e) => set('emailSubject', e.target.value)} />
        </Field>
        <Field label="Body">
          <textarea className={inputClass} rows={3} placeholder="Email body..." value={data.emailBody || ''} onChange={(e) => set('emailBody', e.target.value)} />
        </Field>
      </>
    ),

    phone: (
      <Field label="Phone Number">
        <input className={inputClass} type="tel" placeholder="+1 234 567 8900" value={data.phone || ''} onChange={(e) => set('phone', e.target.value)} />
      </Field>
    ),

    sms: (
      <>
        <Field label="Phone Number">
          <input className={inputClass} type="tel" placeholder="+1 234 567 8900" value={data.smsPhone || ''} onChange={(e) => set('smsPhone', e.target.value)} />
        </Field>
        <Field label="Message">
          <textarea className={inputClass} rows={3} placeholder="Your message..." value={data.smsMessage || ''} onChange={(e) => set('smsMessage', e.target.value)} />
        </Field>
      </>
    ),

    vcard: (
      <>
        <div className="grid grid-cols-2 gap-3">
          <Field label="First Name"><input className={inputClass} placeholder="John" value={data.vcardFirstName || ''} onChange={(e) => set('vcardFirstName', e.target.value)} /></Field>
          <Field label="Last Name"><input className={inputClass} placeholder="Doe" value={data.vcardLastName || ''} onChange={(e) => set('vcardLastName', e.target.value)} /></Field>
        </div>
        <Field label="Organization"><input className={inputClass} placeholder="Company Inc." value={data.vcardOrg || ''} onChange={(e) => set('vcardOrg', e.target.value)} /></Field>
        <Field label="Job Title"><input className={inputClass} placeholder="CEO" value={data.vcardTitle || ''} onChange={(e) => set('vcardTitle', e.target.value)} /></Field>
        <Field label="Phone"><input className={inputClass} type="tel" placeholder="+1 234 567 8900" value={data.vcardPhone || ''} onChange={(e) => set('vcardPhone', e.target.value)} /></Field>
        <Field label="Email"><input className={inputClass} type="email" placeholder="john@company.com" value={data.vcardEmail || ''} onChange={(e) => set('vcardEmail', e.target.value)} /></Field>
        <Field label="Website"><input className={inputClass} type="url" placeholder="https://company.com" value={data.vcardWebsite || ''} onChange={(e) => set('vcardWebsite', e.target.value)} /></Field>
        <Field label="Address"><input className={inputClass} placeholder="123 Main St, City, Country" value={data.vcardAddress || ''} onChange={(e) => set('vcardAddress', e.target.value)} /></Field>
      </>
    ),

    wifi: (
      <>
        <Field label="Network Name (SSID)">
          <input className={inputClass} placeholder="MyWiFiNetwork" value={data.wifiSSID || ''} onChange={(e) => set('wifiSSID', e.target.value)} />
        </Field>
        <Field label="Password">
          <input className={inputClass} type="password" placeholder="WiFi password" value={data.wifiPassword || ''} onChange={(e) => set('wifiPassword', e.target.value)} />
        </Field>
        <Field label="Security Type">
          <select className={inputClass} value={data.wifiSecurity || 'WPA'} onChange={(e) => set('wifiSecurity', e.target.value)}>
            <option value="WPA">WPA/WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">No Password</option>
          </select>
        </Field>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 accent-brand-green rounded" checked={!!data.wifiHidden} onChange={(e) => set('wifiHidden', e.target.checked)} />
          <span className="text-sm text-text-secondary">Hidden network</span>
        </label>
      </>
    ),

    location: (
      <>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Latitude"><input className={inputClass} placeholder="40.7128" value={data.locationLat || ''} onChange={(e) => set('locationLat', e.target.value)} /></Field>
          <Field label="Longitude"><input className={inputClass} placeholder="-74.0060" value={data.locationLng || ''} onChange={(e) => set('locationLng', e.target.value)} /></Field>
        </div>
        <Field label="Label (optional)"><input className={inputClass} placeholder="New York City" value={data.locationLabel || ''} onChange={(e) => set('locationLabel', e.target.value)} /></Field>
      </>
    ),

    facebook: (
      <Field label="Facebook Profile or Page URL">
        <input className={inputClass} type="url" placeholder="https://facebook.com/yourpage" value={data.facebookUrl || ''} onChange={(e) => set('facebookUrl', e.target.value)} />
      </Field>
    ),

    twitter: (
      <Field label="Twitter / X Username">
        <div className="flex">
          <span className="flex items-center px-3 bg-surface-gray border border-r-0 border-surface-border rounded-l-xl text-text-muted text-sm">@</span>
          <input className={`${inputClass} rounded-l-none`} placeholder="username" value={data.twitterUsername || ''} onChange={(e) => set('twitterUsername', e.target.value)} />
        </div>
      </Field>
    ),

    instagram: (
      <Field label="Instagram Username">
        <div className="flex">
          <span className="flex items-center px-3 bg-surface-gray border border-r-0 border-surface-border rounded-l-xl text-text-muted text-sm">@</span>
          <input className={`${inputClass} rounded-l-none`} placeholder="username" value={data.instagramUsername || ''} onChange={(e) => set('instagramUsername', e.target.value)} />
        </div>
      </Field>
    ),

    youtube: (
      <Field label="YouTube Channel or Video URL">
        <input className={inputClass} type="url" placeholder="https://youtube.com/@channel" value={data.youtubeUrl || ''} onChange={(e) => set('youtubeUrl', e.target.value)} />
      </Field>
    ),

    whatsapp: (
      <>
        <Field label="WhatsApp Number (with country code)">
          <input className={inputClass} type="tel" placeholder="+1 234 567 8900" value={data.whatsappPhone || ''} onChange={(e) => set('whatsappPhone', e.target.value)} />
        </Field>
        <Field label="Pre-filled Message (optional)">
          <textarea className={inputClass} rows={3} placeholder="Hello! I saw your QR code..." value={data.whatsappMessage || ''} onChange={(e) => set('whatsappMessage', e.target.value)} />
        </Field>
      </>
    ),

    event: (
      <>
        <Field label="Event Title"><input className={inputClass} placeholder="Team Meeting" value={data.eventTitle || ''} onChange={(e) => set('eventTitle', e.target.value)} /></Field>
        <Field label="Location"><input className={inputClass} placeholder="Conference Room A" value={data.eventLocation || ''} onChange={(e) => set('eventLocation', e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date & Time"><input className={inputClass} type="datetime-local" value={data.eventStart || ''} onChange={(e) => set('eventStart', e.target.value)} /></Field>
          <Field label="End Date & Time"><input className={inputClass} type="datetime-local" value={data.eventEnd || ''} onChange={(e) => set('eventEnd', e.target.value)} /></Field>
        </div>
        <Field label="Description">
          <textarea className={inputClass} rows={3} placeholder="Event description..." value={data.eventDescription || ''} onChange={(e) => set('eventDescription', e.target.value)} />
        </Field>
      </>
    ),

    payment: (
      <>
        <Field label="Payment Type">
          <select className={inputClass} value={data.paymentType || 'paypal'} onChange={(e) => set('paymentType', e.target.value)}>
            <option value="paypal">PayPal</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="upi">UPI (India)</option>
          </select>
        </Field>
        <Field label={data.paymentType === 'paypal' ? 'PayPal Username' : data.paymentType === 'bitcoin' ? 'Bitcoin Address' : 'UPI ID'}>
          <input className={inputClass} placeholder={data.paymentType === 'upi' ? 'name@upi' : 'Address or username'} value={data.paymentAddress || ''} onChange={(e) => set('paymentAddress', e.target.value)} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Amount (optional)"><input className={inputClass} type="number" placeholder="0.00" value={data.paymentAmount || ''} onChange={(e) => set('paymentAmount', e.target.value)} /></Field>
          <Field label="Currency"><input className={inputClass} placeholder="USD" value={data.paymentCurrency || ''} onChange={(e) => set('paymentCurrency', e.target.value)} /></Field>
        </div>
        <Field label="Note (optional)"><input className={inputClass} placeholder="Payment for services" value={data.paymentNote || ''} onChange={(e) => set('paymentNote', e.target.value)} /></Field>
      </>
    ),
  }

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card space-y-4">
      <h2 className="font-display font-semibold text-sm text-text-muted uppercase tracking-widest">
        Content
      </h2>
      {forms[type]}
    </div>
  )
}