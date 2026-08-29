'use client'

import { useRef, useState } from 'react'
import {
  AlertTriangle,
  ChevronDown,
  Frame,
  ImagePlus,
  Palette,
  ShieldCheck,
  SlidersHorizontal,
  Grid2x2,
  Trash2,
  Upload,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  QRCustomization,
  DotType,
  CornerSquareType,
  CornerDotType,
  FrameStyle,
  ErrorCorrectionLevel,
} from '@/types/qr.types'
import { CornerDotSample, CornerSquareSample, DotSample } from './ModuleArt'

interface Props {
  customization: QRCustomization
  onChange: (customization: QRCustomization) => void
}

const labelClass = 'block text-micro font-bold uppercase tracking-[0.1em] text-text-secondary'
const inputClass =
  'w-full rounded-xl border border-surface-border bg-white px-4 py-3 text-[0.9375rem] text-text-primary placeholder:text-text-muted focus:border-brand-green-dark focus:outline-none focus:ring-2 focus:ring-brand-green/40'
const optionBase =
  'rounded-xl border-2 text-micro font-semibold transition-colors duration-150 focus-visible:outline-none'
const optionOn = 'border-brand-green-dark bg-brand-green-muted text-brand-green-dark'
const optionOff =
  'border-surface-border text-text-secondary hover:border-brand-green hover:bg-brand-green-subtle'

const DOT_TYPES: { value: DotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'dots', label: 'Dots' },
  { value: 'classy', label: 'Classy' },
  { value: 'classy-rounded', label: 'Classy soft' },
  { value: 'extra-rounded', label: 'Extra round' },
]

const CORNER_SQUARE_TYPES: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Circle' },
  { value: 'extra-rounded', label: 'Rounded' },
]

const CORNER_DOT_TYPES: { value: CornerDotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Circle' },
]

const FRAME_STYLES: { value: FrameStyle; label: string }[] = [
  { value: 'none', label: 'No frame' },
  { value: 'simple', label: 'Simple' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'badge', label: 'Badge' },
]

const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string; recovery: string }[] = [
  { value: 'L', label: 'Low', recovery: '7%' },
  { value: 'M', label: 'Medium', recovery: '15%' },
  { value: 'Q', label: 'High', recovery: '25%' },
  { value: 'H', label: 'Highest', recovery: '30%' },
]

function relativeLuminance(hex: string): number {
  const value = hex.replace('#', '')
  const full =
    value.length === 3
      ? value
          .split('')
          .map((char) => char + char)
          .join('')
      : value
  const channels = [0, 2, 4].map((offset) => {
    const channel = parseInt(full.slice(offset, offset + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrastRatio(a: string, b: string): number {
  const first = relativeLuminance(a)
  const second = relativeLuminance(b)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      <span className="mt-2 flex items-center gap-3 rounded-xl border border-surface-border bg-surface-gray p-2.5">
        <input
          type="color"
          className="h-10 w-10 shrink-0 rounded-lg"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="font-mono text-[0.875rem] font-medium text-text-secondary">
          {value.toUpperCase()}
        </span>
      </span>
    </label>
  )
}

function Section({
  title,
  icon: Icon,
  badge,
  defaultOpen = false,
  children,
}: {
  title: string
  icon: LucideIcon
  badge?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden rounded-xl border border-surface-border">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 bg-surface-gray px-4 py-4 text-left transition-colors duration-150 hover:bg-brand-green-subtle"
      >
        <span className="flex items-center gap-3">
          <Icon size={19} strokeWidth={2.2} className="text-brand-green-dark" aria-hidden="true" />
          <span className="font-display text-[0.9375rem] font-bold text-text-primary">{title}</span>
          {badge && (
            <span className="rounded-full bg-brand-green-dark px-2.5 py-0.5 text-[0.75rem] font-bold capitalize text-white">
              {badge}
            </span>
          )}
        </span>
        <ChevronDown
          size={20}
          strokeWidth={2.4}
          aria-hidden="true"
          className="shrink-0 text-text-muted transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          visibility: open ? 'visible' : 'hidden',
          transition: 'grid-template-rows 0.25s ease, visibility 0.25s ease',
        }}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 bg-white px-4 pb-5 pt-4">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function QRCustomizer({ customization: c, onChange }: Props) {
  const logoInputRef = useRef<HTMLInputElement>(null)

  const set = <K extends keyof QRCustomization>(key: K, value: QRCustomization[K]) =>
    onChange({ ...c, [key]: value })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (loaded) => set('logoUrl', loaded.target?.result as string)
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  const ratio = contrastRatio(c.foregroundColor, c.backgroundColor)
  const contrastIsSafe = ratio >= 4

  return (
    <section className="space-y-4 rounded-2xl border border-surface-border bg-white p-5 shadow-card">
      <h2 className="font-display text-label font-bold uppercase tracking-[0.14em] text-text-muted">
        2. Make it yours
      </h2>

      <Section title="Colours" icon={Palette} defaultOpen>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <ColorField
            label="Code"
            value={c.foregroundColor}
            onChange={(value) => set('foregroundColor', value)}
          />
          <ColorField
            label="Background"
            value={c.backgroundColor}
            onChange={(value) => set('backgroundColor', value)}
          />
        </div>

        <p
          className={`flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-[0.875rem] leading-snug ${
            contrastIsSafe
              ? 'border-brand-green/40 bg-brand-green-muted text-brand-green-ink'
              : 'border-amber-300 bg-amber-50 text-amber-900'
          }`}
        >
          {contrastIsSafe ? (
            <ShieldCheck size={18} strokeWidth={2.2} className="mt-px shrink-0" aria-hidden="true" />
          ) : (
            <AlertTriangle
              size={18}
              strokeWidth={2.2}
              className="mt-px shrink-0"
              aria-hidden="true"
            />
          )}
          {contrastIsSafe
            ? `Contrast is ${ratio.toFixed(1)} to 1. Scanners will read this reliably.`
            : `Contrast is only ${ratio.toFixed(1)} to 1. Darken the code or lighten the background so cameras can read it.`}
        </p>
      </Section>

      <Section title="Module shape" icon={Grid2x2}>
        <div>
          <span className={labelClass}>Dots</span>
          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            {DOT_TYPES.map((dot) => {
              const isActive = c.dotType === dot.value
              return (
                <button
                  key={dot.value}
                  type="button"
                  onClick={() => set('dotType', dot.value)}
                  aria-pressed={isActive}
                  className={`flex flex-col items-center gap-2 p-3 ${optionBase} ${
                    isActive ? optionOn : optionOff
                  }`}
                >
                  <DotSample type={dot.value} />
                  <span className="leading-tight">{dot.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className={labelClass}>Corner ring</span>
          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            {CORNER_SQUARE_TYPES.map((corner) => {
              const isActive = c.cornerSquareType === corner.value
              return (
                <button
                  key={corner.value}
                  type="button"
                  onClick={() => set('cornerSquareType', corner.value)}
                  aria-pressed={isActive}
                  className={`flex flex-col items-center gap-2 p-3 ${optionBase} ${
                    isActive ? optionOn : optionOff
                  }`}
                >
                  <CornerSquareSample type={corner.value} />
                  <span className="leading-tight">{corner.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <span className={labelClass}>Corner centre</span>
          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            {CORNER_DOT_TYPES.map((corner) => {
              const isActive = c.cornerDotType === corner.value
              return (
                <button
                  key={corner.value}
                  type="button"
                  onClick={() => set('cornerDotType', corner.value)}
                  aria-pressed={isActive}
                  className={`flex flex-col items-center gap-2 p-3 ${optionBase} ${
                    isActive ? optionOn : optionOff
                  }`}
                >
                  <CornerDotSample type={corner.value} />
                  <span className="leading-tight">{corner.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      </Section>

      <Section
        title="Centre logo"
        icon={ImagePlus}
        badge={c.logoUrl ? 'Added' : undefined}
      >
        <button
          type="button"
          onClick={() => logoInputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-surface-border-dark px-4 py-4 text-[0.9375rem] font-semibold text-text-secondary transition-colors duration-150 hover:border-brand-green-dark hover:bg-brand-green-subtle hover:text-brand-green-dark"
        >
          <Upload size={19} strokeWidth={2.2} aria-hidden="true" />
          {c.logoUrl ? 'Replace image' : 'Upload an image'}
        </button>
        <input
          ref={logoInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />

        {c.logoUrl && (
          <>
            <div className="flex items-center justify-between gap-3 rounded-xl border border-brand-green/40 bg-brand-green-muted p-2.5">
              <span className="flex items-center gap-3">
                <img
                  src={c.logoUrl}
                  alt="Selected centre logo"
                  className="h-10 w-10 rounded-lg bg-white object-contain"
                />
                <span className="text-[0.9375rem] font-semibold text-brand-green-ink">
                  Image added
                </span>
              </span>
              <button
                type="button"
                onClick={() => set('logoUrl', null)}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-micro font-semibold text-text-secondary transition-colors duration-150 hover:bg-white hover:text-red-600"
              >
                <Trash2 size={16} strokeWidth={2.2} aria-hidden="true" />
                Remove
              </button>
            </div>

            <label className="block">
              <span className="flex items-baseline justify-between">
                <span className={labelClass}>Image size</span>
                <span className="font-mono text-[0.875rem] text-text-muted">
                  {Math.round(c.logoSize * 100)}%
                </span>
              </span>
              <input
                type="range"
                min="0.15"
                max="0.45"
                step="0.01"
                className="mt-3"
                value={c.logoSize}
                onChange={(event) => set('logoSize', parseFloat(event.target.value))}
              />
            </label>

            <label className="block">
              <span className="flex items-baseline justify-between">
                <span className={labelClass}>Clear space</span>
                <span className="font-mono text-[0.875rem] text-text-muted">{c.logoMargin}px</span>
              </span>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                className="mt-3"
                value={c.logoMargin}
                onChange={(event) => set('logoMargin', parseInt(event.target.value, 10))}
              />
            </label>

            <p className="text-[0.875rem] leading-snug text-text-muted">
              A large image covers more modules. Raise the recovery level in Output if the code
              stops scanning.
            </p>
          </>
        )}
      </Section>

      <Section
        title="Frame and label"
        icon={Frame}
        badge={c.frameStyle !== 'none' ? c.frameStyle : undefined}
      >
        <div className="grid grid-cols-2 gap-2.5">
          {FRAME_STYLES.map((frame) => {
            const isActive = c.frameStyle === frame.value
            return (
              <button
                key={frame.value}
                type="button"
                onClick={() => set('frameStyle', frame.value)}
                aria-pressed={isActive}
                className={`px-3 py-3 ${optionBase} ${isActive ? optionOn : optionOff}`}
              >
                {frame.label}
              </button>
            )
          })}
        </div>

        {c.frameStyle !== 'none' && (
          <>
            <label className="block">
              <span className={labelClass}>Label text</span>
              <input
                className={`${inputClass} mt-2`}
                placeholder="SCAN ME"
                maxLength={20}
                value={c.frameLabel}
                onChange={(event) => set('frameLabel', event.target.value)}
              />
            </label>
            <ColorField
              label="Frame colour"
              value={c.frameColor}
              onChange={(value) => set('frameColor', value)}
            />
          </>
        )}
      </Section>

      <Section title="Output" icon={SlidersHorizontal}>
        <label className="block">
          <span className="flex items-baseline justify-between">
            <span className={labelClass}>Download size</span>
            <span className="font-mono text-[0.875rem] text-text-muted">
              {c.size} × {c.size}px
            </span>
          </span>
          <input
            type="range"
            min="200"
            max="1200"
            step="50"
            className="mt-3"
            value={c.size}
            onChange={(event) => set('size', parseInt(event.target.value, 10))}
          />
          <span className="mt-2 flex justify-between font-mono text-[0.8125rem] text-text-muted">
            <span>200px</span>
            <span>1200px</span>
          </span>
        </label>

        <div>
          <span className={labelClass}>Error recovery</span>
          <div className="mt-2.5 grid grid-cols-4 gap-2">
            {ERROR_LEVELS.map((level) => {
              const isActive = c.errorCorrectionLevel === level.value
              return (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => set('errorCorrectionLevel', level.value)}
                  aria-pressed={isActive}
                  className={`px-2 py-2.5 ${optionBase} ${isActive ? optionOn : optionOff}`}
                >
                  <span className="block">{level.label}</span>
                  <span className="mt-0.5 block font-mono text-[0.8125rem] font-normal opacity-70">
                    {level.recovery}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-3 text-[0.875rem] leading-snug text-text-muted">
            Higher recovery survives smudges and logos, but packs the modules tighter.
          </p>
        </div>
      </Section>
    </section>
  )
}
