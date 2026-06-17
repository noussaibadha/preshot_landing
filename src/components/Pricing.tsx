'use client'

import { signIn, useSession } from 'next-auth/react'

const freeFeatures = [
  { label: 'Détection fraudes en temps réel', included: true },
  { label: 'Historique 7 derniers jours', included: true },
  { label: 'Alertes dark patterns basiques', included: true },
  { label: 'Newsletter mensuelle', included: true },
  { label: 'Historique illimité (30 jours)', included: false },
  { label: 'Export CSV des diagnostics', included: false },
  { label: 'Programme de parrainage', included: false },
  { label: 'Support prioritaire', included: false },
]

const proFeatures = [
  { label: 'Détection fraudes en temps réel', included: true },
  { label: 'Historique illimité (30 jours)', included: true },
  { label: 'Alertes dark patterns avancées', included: true },
  { label: 'Newsletter hebdomadaire', included: true },
  { label: 'Export CSV des diagnostics', included: true },
  { label: 'Programme de parrainage', included: true },
  { label: 'Support prioritaire', included: true },
  { label: 'Badge Fondateur (10 parrainages)', included: true },
]

function CheckIcon({ included }: { included: boolean }) {
  if (included) {
    return (
      <svg className="w-5 h-5 text-violet-light shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5 text-white/20 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

export function Pricing() {
  const { data: session } = useSession()

  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-white/60 text-sm font-medium mb-6">
            Tarifs
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple et <span className="gradient-text">transparent</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Commencez gratuitement. Passez Pro quand vous êtes prêt.
          </p>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Free plan */}
          <div className="card">
            <div className="mb-6">
              <p className="text-sm font-medium text-white/50 mb-1">Gratuit</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold">0€</span>
                <span className="text-white/40 text-sm">/mois</span>
              </div>
              <p className="text-white/40 text-sm mt-2">Pour les navigateurs occasionnels</p>
            </div>
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline w-full justify-center mb-8"
            >
              Télécharger gratuitement
            </a>
            <ul className="space-y-3">
              {freeFeatures.map((f, i) => (
                <li key={i} className={`flex items-center gap-3 text-sm ${f.included ? 'text-white/80' : 'text-white/25'}`}>
                  <CheckIcon included={f.included} />
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro plan */}
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-violet to-blue-accent shadow-2xl shadow-violet/20">
            <div className="rounded-2xl bg-surface-2 p-6 h-full">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 rounded-full text-xs font-bold bg-gradient-hero text-white shadow-lg">
                  Recommandé
                </span>
              </div>
              <div className="mb-6 mt-2">
                <p className="text-sm font-medium text-violet-light mb-1">Pro</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">4,99€</span>
                  <span className="text-white/40 text-sm">/mois</span>
                </div>
                <p className="text-white/40 text-sm mt-2">Pour une protection complète</p>
              </div>
              <button
                onClick={() => !session && signIn('google')}
                className="btn-primary w-full justify-center mb-8"
              >
                {session ? 'Passer Pro' : 'Commencer maintenant'}
              </button>
              <ul className="space-y-3">
                {proFeatures.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-white/80">
                    <CheckIcon included={f.included} />
                    {f.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Trust note */}
        <p className="text-center text-white/30 text-sm mt-8">
          Paiement sécurisé · Annulation à tout moment · Sans engagement
        </p>
      </div>
    </section>
  )
}
