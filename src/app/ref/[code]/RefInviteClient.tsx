'use client'

import { signIn } from 'next-auth/react'
import Link from 'next/link'

interface Props {
  code: string
  referrerName: string
}

const STORAGE_KEY = 'preshot_pending_referral'

export function RefInviteClient({ code, referrerName }: Props) {
  function handleSignUp() {
    // Persister le code avant la redirection OAuth pour le récupérer après
    localStorage.setItem(STORAGE_KEY, code)
    signIn('google', { callbackUrl: '/dashboard/parrainage' })
  }

  return (
    <div className="max-w-lg w-full space-y-6">
      {/* Card invitation */}
      <div className="rounded-2xl border border-violet/20 bg-gradient-card p-8 text-center">
        {/* Avatar placeholder */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg shadow-violet/30">
          {referrerName[0].toUpperCase()}
        </div>

        <p className="text-white/50 text-sm mb-2">Vous avez été invité par</p>
        <h2 className="text-xl font-bold mb-1">{referrerName}</h2>
        <p className="text-violet-light text-sm font-mono mb-6">PRESHOT-{code}</p>

        <div className="rounded-xl bg-black/20 border border-violet/10 p-4 mb-8 text-left space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-violet/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-violet-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-white/70">
              <span className="text-white font-semibold">1 mois Pro offert</span> sur votre compte PreShot
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-violet/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-violet-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-white/70">
              Protection <span className="text-white font-semibold">immédiate</span> contre les sites frauduleux
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-violet/20 flex items-center justify-center shrink-0 mt-0.5">
              <svg className="w-3.5 h-3.5 text-violet-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm text-white/70">
              Extension Chrome <span className="text-white font-semibold">gratuite</span> à télécharger
            </p>
          </div>
        </div>

        <button
          onClick={handleSignUp}
          className="btn-primary w-full justify-center text-base py-4 shadow-xl shadow-violet/30"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          S&apos;inscrire avec Google
        </button>
      </div>

      <p className="text-center text-white/30 text-xs">
        En vous inscrivant, le code de parrainage sera appliqué automatiquement.{' '}
        <br />
        <Link href="/" className="hover:text-white/60 underline underline-offset-2 transition-colors">
          En savoir plus sur PreShot
        </Link>
      </p>
    </div>
  )
}
