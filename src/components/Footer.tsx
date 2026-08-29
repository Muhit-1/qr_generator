import { ArrowUpRight } from 'lucide-react'
import { QRMark } from './ModuleArt'

const FACTS = ['No account', 'No watermark', 'No tracking', 'No upload']

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-border bg-white">
      <div className="mx-auto flex max-w-app flex-col items-center gap-5 px-4 py-10 text-center sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-green-dark text-white">
            <QRMark size={24} />
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-text-primary">
            QR Studio
          </span>
        </div>

        <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 rounded-full border border-surface-border bg-surface-gray px-5 py-2.5">
          {FACTS.map((fact, index) => (
            <li key={fact} className="flex items-center gap-3">
              {index > 0 && (
                <span aria-hidden="true" className="h-1 w-1 rounded-full bg-surface-border-dark" />
              )}
              <span className="whitespace-nowrap text-[0.8125rem] font-semibold text-text-secondary">
                {fact}
              </span>
            </li>
          ))}
        </ul>

        <a
          href="https://github.com/Muhit-1/qr_generator"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-brand-green/50 bg-brand-green-muted px-5 py-2.5 font-display text-[0.9375rem] font-bold text-brand-green-ink transition-colors duration-150 hover:border-brand-green-dark hover:bg-brand-green-subtle"
        >
          QR Studio : Built by Muhit
          <ArrowUpRight size={17} strokeWidth={2.4} aria-hidden="true" />
        </a>
      </div>
    </footer>
  )
}
