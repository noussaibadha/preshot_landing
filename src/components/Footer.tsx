export function Footer() {
  return (
    <footer className="w-full">
      <div className="h-px w-full bg-muted/60" />
      <div className="flex items-center justify-center gap-5 py-8 text-muted">
        <span className="text-base font-medium tracking-tight">Preshot</span>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 9.5a3 3 0 1 0 0 5" />
        </svg>
        <span className="text-base font-medium tracking-tight">2026</span>
      </div>
    </footer>
  )
}
