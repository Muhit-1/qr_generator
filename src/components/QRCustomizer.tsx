'use client'

import { useRef, useState } from 'react'
import {
  QRCustomization,
  DotType,
  CornerSquareType,
  CornerDotType,
  FrameStyle,
  ErrorCorrectionLevel,
} from '@/types/qr.types'

interface Props {
  customization: QRCustomization
  onChange: (c: QRCustomization) => void
}

const labelClass = 'block text-xs font-semibold text-text-secondary uppercase tracking-wide'
const inputClass =
  'w-full px-3.5 py-2.5 rounded-xl border border-surface-border bg-white text-text-primary text-sm placeholder:text-text-muted focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all'

const DOT_TYPES: { value: DotType; label: string; preview: string }[] = [
  { value: 'square', label: 'Square', preview: '■' },
  { value: 'rounded', label: 'Rounded', preview: '▣' },
  { value: 'dots', label: 'Dots', preview: '●' },
  { value: 'classy', label: 'Classy', preview: '◆' },
  { value: 'classy-rounded', label: 'Classy+', preview: '◈' },
  { value: 'extra-rounded', label: 'Extra Rnd', preview: '⬤' },
]

const CORNER_SQUARE_TYPES: { value: CornerSquareType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
  { value: 'extra-rounded', label: 'Rounded' },
]

const CORNER_DOT_TYPES: { value: CornerDotType; label: string }[] = [
  { value: 'square', label: 'Square' },
  { value: 'dot', label: 'Dot' },
]

const FRAME_STYLES: { value: FrameStyle; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'simple', label: 'Simple' },
  { value: 'rounded', label: 'Rounded' },
  { value: 'badge', label: 'Badge' },
]

const ERROR_LEVELS: { value: ErrorCorrectionLevel; label: string; desc: string }[] = [
  { value: 'L', label: 'L', desc: '7%' },
  { value: 'M', label: 'M', desc: '15%' },
  { value: 'Q', label: 'Q', desc: '25%' },
  { value: 'H', label: 'H', desc: '30%' },
]

// Chevron SVG icon — bigger and cleaner than a text character
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.25s ease',
        flexShrink: 0,
      }}
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

interface CollapsibleSectionProps {
  title: string
  icon: string
  defaultOpen?: boolean
  children: React.ReactNode
  badge?: string
}

function CollapsibleSection({
  title,
  icon,
  defaultOpen = true,
  children,
  badge,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-surface-border rounded-xl overflow-hidden">
      {/* Header button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 bg-surface-gray hover:bg-brand-green-subtle transition-colors duration-150"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-lg leading-none">{icon}</span>
          <span className="font-display font-semibold text-xs text-text-secondary uppercase tracking-widest">
            {title}
          </span>
          {badge && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-green/15 text-brand-green-dark capitalize">
              {badge}
            </span>
          )}
        </div>
        <span className="text-text-muted">
          <ChevronIcon open={open} />
        </span>
      </button>

      {/* Animated body */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.25s ease',
        }}
      >
        <div style={{ overflow: 'hidden' }}>
          <div className="px-4 pb-4 pt-3 space-y-3 bg-white">{children}</div>
        </div>
      </div>
    </div>
  )
}

export default function QRCustomizer({ customization: c, onChange }: Props) {
  const set = (key: keyof QRCustomization, value: any) =>
    onChange({ ...c, [key]: value })
  const logoInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => set('logoUrl', ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="bg-white rounded-2xl border border-surface-border p-5 shadow-card space-y-3">
      <h2 className="font-display font-semibold text-sm text-text-muted uppercase tracking-widest">
        Customize
      </h2>

      {/* ── Colors ── */}
      <CollapsibleSection title="Colors" icon="" defaultOpen={true}>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Foreground</label>
            <div className="flex items-center gap-2 mt-1.5 p-2 rounded-xl border border-surface-border bg-surface-gray">
              <input
                type="color"
                className="w-8 h-8 rounded-lg cursor-pointer"
                value={c.foregroundColor}
                onChange={(e) => set('foregroundColor', e.target.value)}
              />
              <span className="font-mono text-xs text-text-secondary">
                {c.foregroundColor.toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <label className={labelClass}>Background</label>
            <div className="flex items-center gap-2 mt-1.5 p-2 rounded-xl border border-surface-border bg-surface-gray">
              <input
                type="color"
                className="w-8 h-8 rounded-lg cursor-pointer"
                value={c.backgroundColor}
                onChange={(e) => set('backgroundColor', e.target.value)}
              />
              <span className="font-mono text-xs text-text-secondary">
                {c.backgroundColor.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Dot Style ── */}
      <CollapsibleSection title="Dot Style" icon="" defaultOpen={false}>
        <div className="grid grid-cols-3 gap-2">
          {DOT_TYPES.map((d) => (
            <button
              key={d.value}
              onClick={() => set('dotType', d.value)}
              className={`dot-preview flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 text-center transition-all ${c.dotType === d.value
                  ? 'selected border-brand-green bg-brand-green-muted'
                  : 'border-surface-border hover:border-brand-green-light'
                }`}
            >
              <span className="text-lg">{d.preview}</span>
              <span className="text-xs text-text-secondary leading-tight">{d.label}</span>
            </button>
          ))}
        </div>

        <div>
          <label className={`${labelClass} mt-1`}>Corner Square</label>
          <div className="flex gap-2 mt-1.5">
            {CORNER_SQUARE_TYPES.map((cs) => (
              <button
                key={cs.value}
                onClick={() => set('cornerSquareType', cs.value)}
                className={`flex-1 py-2 rounded-xl border-2 text-xs font-medium transition-all ${c.cornerSquareType === cs.value
                    ? 'border-brand-green bg-brand-green-muted text-brand-green-dark'
                    : 'border-surface-border text-text-secondary hover:border-brand-green-light'
                  }`}
              >
                {cs.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className={`${labelClass} mt-1`}>Corner Dot</label>
          <div className="flex gap-2 mt-1.5">
            {CORNER_DOT_TYPES.map((cd) => (
              <button
                key={cd.value}
                onClick={() => set('cornerDotType', cd.value)}
                className={`flex-1 py-2 rounded-xl border-2 text-xs font-medium transition-all ${c.cornerDotType === cd.value
                    ? 'border-brand-green bg-brand-green-muted text-brand-green-dark'
                    : 'border-surface-border text-text-secondary hover:border-brand-green-light'
                  }`}
              >
                {cd.label}
              </button>
            ))}
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Logo ── */}
      <CollapsibleSection
        title="Center Logo"
        icon=""
        defaultOpen={false}
        badge={c.logoUrl ? 'Active' : undefined}
      >
        <button
          onClick={() => logoInputRef.current?.click()}
          className="w-full py-3 rounded-xl border-2 border-dashed border-surface-border text-text-muted text-sm hover:border-brand-green hover:text-brand-green hover:bg-brand-green-subtle transition-all flex items-center justify-center gap-2"
        >
          <span>📎</span>
          {c.logoUrl ? 'Change Logo' : 'Upload Logo / Image'}
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
            <div className="flex items-center justify-between p-2 bg-brand-green-muted rounded-xl border border-brand-green/30">
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
                <span className="text-xs text-brand-green-dark font-medium">Logo uploaded</span>
              </div>
              <button
                onClick={() => set('logoUrl', null)}
                className="text-text-muted hover:text-red-500 text-xs transition-colors"
              >
                ✕ Remove
              </button>
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className={labelClass}>Logo Size</label>
                <span className="text-xs font-mono text-text-muted">
                  {Math.round(c.logoSize * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.15"
                max="0.45"
                step="0.01"
                value={c.logoSize}
                onChange={(e) => set('logoSize', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className={labelClass}>Logo Margin</label>
                <span className="text-xs font-mono text-text-muted">{c.logoMargin}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={c.logoMargin}
                onChange={(e) => set('logoMargin', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}
      </CollapsibleSection>

      {/* ── Frame ── */}
      <CollapsibleSection
        title="Frame & Label"
        icon=""
        defaultOpen={false}
        badge={c.frameStyle !== 'none' ? c.frameStyle : undefined}
      >
        <div className="grid grid-cols-2 gap-2">
          {FRAME_STYLES.map((f) => (
            <button
              key={f.value}
              onClick={() => set('frameStyle', f.value)}
              className={`frame-preview py-2 rounded-xl border-2 text-xs font-medium transition-all ${c.frameStyle === f.value
                  ? 'selected border-brand-green bg-brand-green-muted text-brand-green-dark'
                  : 'border-surface-border text-text-secondary hover:border-brand-green-light'
                }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {c.frameStyle !== 'none' && (
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Frame Label Text</label>
              <input
                className={`${inputClass} mt-1.5`}
                placeholder="SCAN ME"
                value={c.frameLabel}
                onChange={(e) => set('frameLabel', e.target.value)}
                maxLength={20}
              />
            </div>
            <div>
              <label className={labelClass}>Frame Color</label>
              <div className="flex items-center gap-2 mt-1.5 p-2 rounded-xl border border-surface-border bg-surface-gray">
                <input
                  type="color"
                  className="w-8 h-8 rounded-lg cursor-pointer"
                  value={c.frameColor}
                  onChange={(e) => set('frameColor', e.target.value)}
                />
                <span className="font-mono text-xs text-text-secondary">
                  {c.frameColor.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}
      </CollapsibleSection>

      {/* ── Output Settings ── */}
      <CollapsibleSection title="Output Settings" icon="" defaultOpen={false}>
        <div>
          <div className="flex justify-between mb-1.5">
            <label className={labelClass}>QR Size</label>
            <span className="text-xs font-mono text-text-muted">{c.size}px</span>
          </div>
          <input
            type="range"
            min="100"
            max="1200"
            step="50"
            value={c.size}
            onChange={(e) => set('size', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>100px</span>
            <span>1200px</span>
          </div>
        </div>

        <div>
          <label className={labelClass}>Error Correction Level</label>
          <div className="flex gap-2 mt-1.5">
            {ERROR_LEVELS.map((el) => (
              <button
                key={el.value}
                onClick={() => set('errorCorrectionLevel', el.value)}
                title={`${el.desc} recovery`}
                className={`flex-1 py-2 rounded-xl border-2 text-xs font-bold transition-all ${c.errorCorrectionLevel === el.value
                    ? 'border-brand-green bg-brand-green-muted text-brand-green-dark'
                    : 'border-surface-border text-text-secondary hover:border-brand-green-light'
                  }`}
              >
                {el.label}
                <span className="block text-[10px] font-normal opacity-60">{el.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  )
}