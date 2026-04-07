'use client'

import { QR_TYPES } from '@/constants/qrTypes'
import { QRTypeId } from '@/types/qr.types'

interface Props {
  selected: QRTypeId
  onChange: (type: QRTypeId) => void
}

export default function QRTypeSelector({ selected, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-surface-border p-4 shadow-card">
      <h2 className="font-display font-semibold text-sm text-text-muted uppercase tracking-widest mb-3 px-1">
        QR Code Type
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5 gap-2">
        {QR_TYPES.map((type) => {
          const isSelected = selected === type.id
          return (
            <button
              key={type.id}
              onClick={() => onChange(type.id)}
              className={`
                relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer group
                ${
                  isSelected
                    ? 'border-brand-green bg-brand-green-muted shadow-green'
                    : 'border-surface-border bg-white hover:border-brand-green-light hover:bg-brand-green-subtle'
                }
              `}
            >
              <span className="text-xl leading-none">{type.icon}</span>
              <span
                className={`text-xs font-medium leading-tight text-center transition-colors ${
                  isSelected ? 'text-brand-green-dark' : 'text-text-secondary group-hover:text-text-primary'
                }`}
              >
                {type.label}
              </span>
              {isSelected && (
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-green border-2 border-white"
                />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}