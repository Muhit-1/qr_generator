import { ShieldCheck } from 'lucide-react'
import { QRMark } from './ModuleArt'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-surface-border bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-[4.5rem] max-w-app items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-green-dark text-white shadow-green">
            <QRMark size={26} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl font-bold tracking-tight text-text-primary">
              QR Studio
            </span>
            <span className="mt-1 text-micro font-medium text-text-muted">
              Codes made in your browser
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden items-center gap-2 rounded-full border border-brand-green/40 bg-brand-green-muted px-4 py-2 text-micro font-semibold text-brand-green-dark sm:flex">
            <ShieldCheck size={16} strokeWidth={2.2} aria-hidden="true" />
            Nothing leaves this device
          </span>
          <span className="rounded-full border border-surface-border bg-surface-gray px-4 py-2 text-micro font-semibold text-text-secondary">
            Free
          </span>
        </div>
      </div>
    </header>
  )
}
