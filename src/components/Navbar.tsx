'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center font-bold text-sm shadow-lg shadow-violet/40">
            P
          </div>
          <span className="font-bold text-lg tracking-tight">
            Pre<span className="gradient-text">Shot</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
            Accueil
          </Link>
          <Link href="/#features" className="text-sm text-white/70 hover:text-white transition-colors">
            À propos
          </Link>
          <Link href="/#pricing" className="text-sm text-white/70 hover:text-white transition-colors">
            Nos offres
          </Link>
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard/profil" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ''}
                    width={32}
                    height={32}
                    className="rounded-full ring-2 ring-violet/40"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-sm font-semibold">
                    {session.user.name?.[0] ?? 'U'}
                  </div>
                )}
                <span className="text-sm text-white/80">{session.user.name?.split(' ')[0]}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-outline text-sm py-2 px-4"
              >
                Déconnexion
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => signIn('google')}
                className="btn-outline text-sm py-2 px-4"
              >
                Connexion
              </button>
              <a
                href="https://chrome.google.com/webstore"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-sm py-2 px-4"
              >
                Télécharger
              </a>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white/70 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/5 bg-background/95 px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-sm text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link href="/#features" className="text-sm text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>À propos</Link>
          <Link href="/#pricing" className="text-sm text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>Nos offres</Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
            {session ? (
              <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-outline text-sm">Déconnexion</button>
            ) : (
              <>
                <button onClick={() => signIn('google')} className="btn-outline text-sm">Connexion</button>
                <a href="https://chrome.google.com/webstore" target="_blank" rel="noopener noreferrer" className="btn-primary text-sm text-center">Télécharger</a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
