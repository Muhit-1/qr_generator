import { QRMark } from './ModuleArt'

const FACTS = ['No account', 'No watermark', 'No tracking', 'No upload']

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-border bg-white">
      <div className="mx-auto flex max-w-app flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-green-dark text-white">
            <QRMark size={22} />
          </span>
          <span className="font-display text-lg font-bold text-text-primary">QR Studio</span>
        </div>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FACTS.map((fact) => (
            <li key={fact} className="text-micro font-medium text-text-secondary">
              {fact}
            </li>
          ))}
        </ul>

        <p className="text-micro text-text-muted">
          Every code is built locally and never sent to a server.
        </p>
      </div>
    </footer>
  )
}
