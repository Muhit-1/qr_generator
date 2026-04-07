export default function Header() {
  return (
    <header className="bg-white border-b border-surface-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm shadow-green"
              style={{ background: 'linear-gradient(135deg, #66cc99, #4db882)' }}
            >
              QR
            </div>
            <div>
              <span className="font-display font-bold text-xl text-text-primary tracking-tight">
                QR Studio
              </span>
              <span className="hidden sm:inline text-xs text-text-muted ml-2 font-sans">
                Free QR Code Generator
              </span>
            </div>
          </div>

          {/* Right side badges */}
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-brand-green bg-brand-green-muted px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-brand-green rounded-full animate-pulse" />
              100% Free
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-text-secondary bg-surface-gray px-3 py-1.5 rounded-full border border-surface-border">
              No Sign Up
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}