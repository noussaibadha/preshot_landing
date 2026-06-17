import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-hero flex items-center justify-center font-bold text-xs">P</div>
              <span className="font-bold">Pre<span className="gradient-text">Shot</span></span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              Savoir douter, mieux naviguer. Protection intelligente contre les sites frauduleux.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Produit</p>
            <ul className="space-y-2">
              <li><Link href="/#features" className="text-sm text-white/50 hover:text-white transition-colors">Fonctionnalités</Link></li>
              <li><Link href="/#pricing" className="text-sm text-white/50 hover:text-white transition-colors">Tarifs</Link></li>
              <li><a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">Télécharger</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-white/30 uppercase tracking-wider mb-4">Légal</p>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm text-white/50 hover:text-white transition-colors">Politique de confidentialité</Link></li>
              <li><Link href="/terms" className="text-sm text-white/50 hover:text-white transition-colors">Conditions d&apos;utilisation</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© {new Date().getFullYear()} PreShot. Tous droits réservés.</p>
          <p className="text-white/20 text-xs">Fait avec soin pour des navigateurs éclairés</p>
        </div>
      </div>
    </footer>
  )
}
