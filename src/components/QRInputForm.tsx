'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { QRTypeId, QRFormData } from '@/types/qr.types'

interface Props {
  type: QRTypeId
  data: QRFormData
  onChange: (data: QRFormData) => void
}

const inputClass =
  'w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-[1rem] text-text-primary placeholder:text-text-muted focus:border-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green/40'
const labelClass = 'block text-micro font-bold uppercase tracking-[0.1em] text-text-secondary'

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <span className="mt-2 block">{children}</span>
      {hint && <span className="mt-2 block text-[0.875rem] text-text-muted">{hint}</span>}
    </label>
  )
}

function PrefixedField({
  label,
  prefix,
  value,
  placeholder,
  onChange,
}: {
  label: string
  prefix: string
  value: string
  placeholder: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <span className="mt-2 flex">
        <span className="flex items-center rounded-l-xl border border-r-0 border-surface-border bg-surface-gray px-3.5 font-mono text-[0.9375rem] text-text-secondary">
          {prefix}
        </span>
        <input
          className={`${inputClass} rounded-l-none`}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </span>
    </label>
  )
}

export default function QRInputForm({ type, data, onChange }: Props) {
  const [showPassword, setShowPassword] = useState(false)

  const set = <K extends keyof QRFormData>(key: K, value: QRFormData[K]) =>
    onChange({ ...data, [key]: value })

  const forms: Record<QRTypeId, React.ReactNode> = {
    url: (
      <Field label="Website address" hint="Include https:// so every scanner opens it correctly.">
        <input
          className={inputClass}
          type="url"
          inputMode="url"
          placeholder="https://example.com"
          value={data.url || ''}
          onChange={(event) => set('url', event.target.value)}
        />
      </Field>
    ),

    text: (
      <Field label="Message" hint="Shorter text keeps the pattern simple and easy to scan.">
        <textarea
          className={inputClass}
          rows={4}
          placeholder="Type anything here"
          value={data.text || ''}
          onChange={(event) => set('text', event.target.value)}
        />
      </Field>
    ),

    email: (
      <>
        <Field label="Send to">
          <input
            className={inputClass}
            type="email"
            placeholder="hello@example.com"
            value={data.emailTo || ''}
            onChange={(event) => set('emailTo', event.target.value)}
          />
        </Field>
        <Field label="Subject">
          <input
            className={inputClass}
            placeholder="Quick question"
            value={data.emailSubject || ''}
            onChange={(event) => set('emailSubject', event.target.value)}
          />
        </Field>
        <Field label="Message">
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Text that appears in the draft"
            value={data.emailBody || ''}
            onChange={(event) => set('emailBody', event.target.value)}
          />
        </Field>
      </>
    ),

    phone: (
      <Field label="Phone number" hint="Add the country code so the number dials from anywhere.">
        <input
          className={inputClass}
          type="tel"
          inputMode="tel"
          placeholder="+1 234 567 8900"
          value={data.phone || ''}
          onChange={(event) => set('phone', event.target.value)}
        />
      </Field>
    ),

    sms: (
      <>
        <Field label="Phone number">
          <input
            className={inputClass}
            type="tel"
            inputMode="tel"
            placeholder="+1 234 567 8900"
            value={data.smsPhone || ''}
            onChange={(event) => set('smsPhone', event.target.value)}
          />
        </Field>
        <Field label="Message">
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Text that appears in the draft"
            value={data.smsMessage || ''}
            onChange={(event) => set('smsMessage', event.target.value)}
          />
        </Field>
      </>
    ),

    vcard: (
      <>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="First name">
            <input
              className={inputClass}
              placeholder="Jane"
              value={data.vcardFirstName || ''}
              onChange={(event) => set('vcardFirstName', event.target.value)}
            />
          </Field>
          <Field label="Last name">
            <input
              className={inputClass}
              placeholder="Okafor"
              value={data.vcardLastName || ''}
              onChange={(event) => set('vcardLastName', event.target.value)}
            />
          </Field>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Company">
            <input
              className={inputClass}
              placeholder="Northwind Studio"
              value={data.vcardOrg || ''}
              onChange={(event) => set('vcardOrg', event.target.value)}
            />
          </Field>
          <Field label="Job title">
            <input
              className={inputClass}
              placeholder="Product designer"
              value={data.vcardTitle || ''}
              onChange={(event) => set('vcardTitle', event.target.value)}
            />
          </Field>
        </div>
        <Field label="Phone">
          <input
            className={inputClass}
            type="tel"
            inputMode="tel"
            placeholder="+1 234 567 8900"
            value={data.vcardPhone || ''}
            onChange={(event) => set('vcardPhone', event.target.value)}
          />
        </Field>
        <Field label="Email">
          <input
            className={inputClass}
            type="email"
            placeholder="jane@northwind.studio"
            value={data.vcardEmail || ''}
            onChange={(event) => set('vcardEmail', event.target.value)}
          />
        </Field>
        <Field label="Website">
          <input
            className={inputClass}
            type="url"
            placeholder="https://northwind.studio"
            value={data.vcardWebsite || ''}
            onChange={(event) => set('vcardWebsite', event.target.value)}
          />
        </Field>
        <Field label="Address">
          <input
            className={inputClass}
            placeholder="12 Harbour Road, Lisbon"
            value={data.vcardAddress || ''}
            onChange={(event) => set('vcardAddress', event.target.value)}
          />
        </Field>
      </>
    ),

    wifi: (
      <>
        <Field label="Network name">
          <input
            className={inputClass}
            placeholder="Exactly as it appears on the device"
            value={data.wifiSSID || ''}
            onChange={(event) => set('wifiSSID', event.target.value)}
          />
        </Field>
        <Field
          label="Password"
          hint="Anyone who scans this code can read the password. Print it only where you trust the room."
        >
          <span className="relative block">
            <input
              className={`${inputClass} pr-12`}
              type={showPassword ? 'text' : 'password'}
              placeholder="Network password"
              value={data.wifiPassword || ''}
              onChange={(event) => set('wifiPassword', event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-text-muted transition-colors duration-150 hover:bg-surface-gray hover:text-text-primary"
            >
              {showPassword ? (
                <EyeOff size={19} strokeWidth={2.2} aria-hidden="true" />
              ) : (
                <Eye size={19} strokeWidth={2.2} aria-hidden="true" />
              )}
            </button>
          </span>
        </Field>
        <Field label="Security">
          <select
            className={inputClass}
            value={data.wifiSecurity || 'WPA'}
            onChange={(event) =>
              set('wifiSecurity', event.target.value as QRFormData['wifiSecurity'])
            }
          >
            <option value="WPA">WPA or WPA2</option>
            <option value="WEP">WEP</option>
            <option value="nopass">Open network</option>
          </select>
        </Field>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-5 w-5 accent-brand-green-dark"
            checked={Boolean(data.wifiHidden)}
            onChange={(event) => set('wifiHidden', event.target.checked)}
          />
          <span className="text-[1rem] text-text-secondary">This network is hidden</span>
        </label>
      </>
    ),

    location: (
      <>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Latitude">
            <input
              className={inputClass}
              inputMode="decimal"
              placeholder="38.7223"
              value={data.locationLat || ''}
              onChange={(event) => set('locationLat', event.target.value)}
            />
          </Field>
          <Field label="Longitude">
            <input
              className={inputClass}
              inputMode="decimal"
              placeholder="-9.1393"
              value={data.locationLng || ''}
              onChange={(event) => set('locationLng', event.target.value)}
            />
          </Field>
        </div>
        <Field label="Place name" hint="Optional. Shown as the pin label in most map apps.">
          <input
            className={inputClass}
            placeholder="Lisbon"
            value={data.locationLabel || ''}
            onChange={(event) => set('locationLabel', event.target.value)}
          />
        </Field>
      </>
    ),

    facebook: (
      <Field label="Facebook page or profile">
        <input
          className={inputClass}
          type="url"
          placeholder="https://facebook.com/yourpage"
          value={data.facebookUrl || ''}
          onChange={(event) => set('facebookUrl', event.target.value)}
        />
      </Field>
    ),

    twitter: (
      <PrefixedField
        label="Twitter handle"
        prefix="@"
        placeholder="yourhandle"
        value={data.twitterUsername || ''}
        onChange={(value) => set('twitterUsername', value)}
      />
    ),

    instagram: (
      <PrefixedField
        label="Instagram handle"
        prefix="@"
        placeholder="yourhandle"
        value={data.instagramUsername || ''}
        onChange={(value) => set('instagramUsername', value)}
      />
    ),

    youtube: (
      <Field label="Channel or video address">
        <input
          className={inputClass}
          type="url"
          placeholder="https://youtube.com/@yourchannel"
          value={data.youtubeUrl || ''}
          onChange={(event) => set('youtubeUrl', event.target.value)}
        />
      </Field>
    ),

    whatsapp: (
      <>
        <Field label="WhatsApp number" hint="Include the country code, for example +351.">
          <input
            className={inputClass}
            type="tel"
            inputMode="tel"
            placeholder="+1 234 567 8900"
            value={data.whatsappPhone || ''}
            onChange={(event) => set('whatsappPhone', event.target.value)}
          />
        </Field>
        <Field label="Opening message">
          <textarea
            className={inputClass}
            rows={3}
            placeholder="Hi, I scanned your code"
            value={data.whatsappMessage || ''}
            onChange={(event) => set('whatsappMessage', event.target.value)}
          />
        </Field>
      </>
    ),

    event: (
      <>
        <Field label="Event name">
          <input
            className={inputClass}
            placeholder="Studio open house"
            value={data.eventTitle || ''}
            onChange={(event) => set('eventTitle', event.target.value)}
          />
        </Field>
        <Field label="Where">
          <input
            className={inputClass}
            placeholder="12 Harbour Road, Lisbon"
            value={data.eventLocation || ''}
            onChange={(event) => set('eventLocation', event.target.value)}
          />
        </Field>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Starts">
            <input
              className={inputClass}
              type="datetime-local"
              value={data.eventStart || ''}
              onChange={(event) => set('eventStart', event.target.value)}
            />
          </Field>
          <Field label="Ends">
            <input
              className={inputClass}
              type="datetime-local"
              value={data.eventEnd || ''}
              onChange={(event) => set('eventEnd', event.target.value)}
            />
          </Field>
        </div>
        <Field label="Details">
          <textarea
            className={inputClass}
            rows={3}
            placeholder="What guests should know"
            value={data.eventDescription || ''}
            onChange={(event) => set('eventDescription', event.target.value)}
          />
        </Field>
      </>
    ),

    payment: (
      <>
        <Field label="Payment method">
          <select
            className={inputClass}
            value={data.paymentType || 'paypal'}
            onChange={(event) =>
              set('paymentType', event.target.value as QRFormData['paymentType'])
            }
          >
            <option value="paypal">PayPal</option>
            <option value="bitcoin">Bitcoin</option>
            <option value="upi">UPI</option>
          </select>
        </Field>
        <Field
          label={
            data.paymentType === 'bitcoin'
              ? 'Wallet address'
              : data.paymentType === 'upi'
                ? 'UPI ID'
                : 'PayPal username'
          }
        >
          <input
            className={inputClass}
            placeholder={
              data.paymentType === 'bitcoin'
                ? 'bc1q...'
                : data.paymentType === 'upi'
                  ? 'name@bank'
                  : 'yourname'
            }
            value={data.paymentAddress || ''}
            onChange={(event) => set('paymentAddress', event.target.value)}
          />
        </Field>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Amount">
            <input
              className={inputClass}
              type="number"
              inputMode="decimal"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={data.paymentAmount || ''}
              onChange={(event) => set('paymentAmount', event.target.value)}
            />
          </Field>
          <Field label="Currency">
            <input
              className={inputClass}
              placeholder="USD"
              maxLength={5}
              value={data.paymentCurrency || ''}
              onChange={(event) => set('paymentCurrency', event.target.value)}
            />
          </Field>
        </div>
        <Field label="Reference">
          <input
            className={inputClass}
            placeholder="Invoice 204"
            value={data.paymentNote || ''}
            onChange={(event) => set('paymentNote', event.target.value)}
          />
        </Field>
      </>
    ),
  }

  return <div className="space-y-5">{forms[type]}</div>
}
