'use client'

import { signIn, useSession } from 'next-auth/react'
import Link from 'next/link'

type Cell = 'free' | 'pro' | 'none'

const rows: { label: string; gratuit: Cell; pro: Cell }[] = [
  { label: 'Parrainage', gratuit: 'free', pro: 'pro' },
  { label: 'Newsletter mensuelle', gratuit: 'free', pro: 'pro' },
  { label: 'Historique de vérification', gratuit: 'none', pro: 'pro' },
  { label: 'Détection de dark patterns', gratuit: 'none', pro: 'pro' },
]

function Check({ variant }: { variant: Cell }) {
  const color =
    variant === 'free' ? 'text-violet-light' : variant === 'pro' ? 'text-blue-accent' : 'text-white/15'
  return (
    <svg className={`w-[34px] h-[34px] ${color}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.3-5.4 5.4a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 1 1 1.4-1.4l1.9 1.9 4.7-4.7a1 1 0 0 1 1.4 1.4Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function Pricing() {
  const { data: session } = useSession()

  return (
    <section id="pricing" className="py-24 px-6 lg:px-8">
      <div className="max-w-[991px] mx-auto">
        {/* Title */}
        <h2 className="text-center text-4xl sm:text-5xl font-medium tracking-tight leading-tight mb-16">
          Simple et transparent.
          <br />
          <span className="text-white/70">Commencez gratuitement,</span>
          <br />
          <span className="text-white/70">passez Pro quand vous le souhaitez.</span>
        </h2>

        {/* Comparison table */}
        <div className="w-full">
          {/* Header */}
          <div className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-3 items-end gap-4 border-b border-muted pb-4">
            <p className="text-sm sm:text-xl font-medium tracking-widest">Fonctionnalité</p>
            <div className="text-center min-w-[90px] sm:min-w-0">
              <p className="text-base sm:text-xl font-medium tracking-widest text-violet-light">Gratuit</p>
              <p className="text-2xl sm:text-4xl font-semibold text-violet">0€</p>
            </div>
            <div className="text-center min-w-[90px] sm:min-w-0">
              <p className="text-base sm:text-xl font-medium tracking-widest text-blue-accent">Pro</p>
              <p className="text-blue-accent">
                <span className="text-2xl sm:text-4xl font-semibold">4,99€</span>
                <span className="text-sm sm:text-base">/mois</span>
              </p>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto_auto] sm:grid-cols-3 items-center gap-4 border-b border-muted py-6"
            >
              <p className="text-sm sm:text-xl font-medium tracking-wide">{row.label}</p>
              <div className="flex justify-center min-w-[90px] sm:min-w-0">
                <Check variant={row.gratuit} />
              </div>
              <div className="flex justify-center min-w-[90px] sm:min-w-0">
                <Check variant={row.pro} />
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-5 mt-12">
          <a
            href="https://chrome.google.com/webstore"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta-violet"
          >
            <span className="relative z-10">Installer l&apos;extension</span>
          </a>
          {session ? (
            <Link href="/dashboard/profil" className="btn-cta-blue">
              <span className="relative z-10">Passer Pro</span>
            </Link>
          ) : (
            <button onClick={() => signIn('google')} className="btn-cta-blue">
              <span className="relative z-10">Passer Pro</span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
