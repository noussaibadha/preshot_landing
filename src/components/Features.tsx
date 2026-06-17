const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Programme de parrainage',
    description:
      'Invitez vos proches et gagnez des mois Pro à chaque parrainage validé. Plus vous parrainez, plus vous êtes récompensé — jusqu\'au badge Fondateur.',
    gradient: 'from-violet/20 to-violet/5',
    border: 'border-violet/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Newsletter & alertes',
    description:
      'Restez informé des nouvelles menaces, arnaques virales et dark patterns détectés. Une veille hebdomadaire pour vous garder en sécurité.',
    gradient: 'from-blue-accent/20 to-blue-accent/5',
    border: 'border-blue-accent/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Historique des diagnostics',
    description:
      'Retrouvez l\'intégralité de vos analyses passées. Score de sécurité global, filtres par verdict et export CSV pour un suivi complet.',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/20',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: 'Détection dark patterns',
    description:
      'Identifiez les interfaces trompeuses : faux compteurs d\'urgence, abonnements cachés, boutons piège, checkboxes pré-cochées et bien plus.',
    gradient: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/20',
  },
]

export function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm font-medium mb-6">
            Fonctionnalités
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Tout ce qu&apos;il vous faut pour{' '}
            <span className="gradient-text">naviguer serein</span>
          </h2>
          <p className="text-white/50 text-lg max-w-2xl mx-auto">
            Une suite complète d&apos;outils pensée pour vous protéger à chaque étape de votre navigation.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`rounded-2xl border ${f.border} bg-gradient-to-br ${f.gradient} p-8 group hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:bg-white/15 transition-colors">
                {f.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-white/55 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
