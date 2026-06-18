'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/#features', label: 'À propos' },
  { href: '/#pricing', label: 'Nos offres' },
]

export function Navbar() {
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-black/80 backdrop-blur-md">
      <nav className="max-w-[1280px] mx-auto px-6 lg:px-10 h-[80px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl sm:text-[30px] font-semibold tracking-tight">
          Preshot
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-9">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-base text-white/90 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/profil"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
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
              <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-pill">
                Déconnexion
              </button>
            </div>
          ) : (
            <button onClick={() => signIn('google', { callbackUrl: '/dashboard/profil' })} className="btn-pill">
              Se connecter
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-white/80 hover:text-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="md:hidden border-t border-white/10 bg-black/95 px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="text-base text-white/80 hover:text-white"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/10">
            {session ? (
              <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-pill w-full">
                Déconnexion
              </button>
            ) : (
              <button onClick={() => signIn('google', { callbackUrl: '/dashboard/profil' })} className="btn-pill w-full">
                Se connecter
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
