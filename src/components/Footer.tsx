export default function Footer() {
  return (
    <footer className="border-t border-surface-border bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-display font-bold text-xs"
              style={{ background: 'linear-gradient(135deg, #66cc99, #4db882)' }}
            >
              QR
            </div>
            <span className="font-display font-semibold text-text-primary">QR Studio</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-text-muted">
            <span>100% Free · No Sign Up · No Watermark</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-text-muted">
            <span>All QR codes generated locally in your browser</span>
            <span className="text-brand-green">🔒</span>
          </div>
        </div>
      </div>
    </footer>
  )
}