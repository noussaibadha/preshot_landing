'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import Image from 'next/image'

const navItems = [
  { href: '/dashboard/profil', label: 'Profil' },
  { href: '/dashboard/historique', label: 'Historique' },
  { href: '/dashboard/parrainage', label: 'Parrainage' },
]

export function DashboardNav() {
  const pathname = usePathname()
  const { data: session } = useSession()

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-white/5 bg-[#0f1215] px-6 lg:px-16">
      {/* Logo + nav */}
      <div className="flex items-center gap-10">
        <Link href="/" className="text-2xl font-semibold tracking-tight text-white">
          Preshot
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative py-2 text-base font-semibold tracking-tight transition-colors"
              >
                <span className={active ? 'text-[#8e3ef2]' : 'text-white hover:text-white/80'}>
                  {item.label}
                </span>
                {active && (
                  <span className="absolute -bottom-px left-0 h-0.5 w-full rounded-full bg-[#8e3ef2]" />
                )}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Right: bell + user + logout */}
      <div className="flex items-center gap-5">
        <button
          aria-label="Notifications"
          className="text-white/70 transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 0 0-4-5.7V5a2 2 0 1 0-4 0v.3A6 6 0 0 0 6 11v3.2a2 2 0 0 1-.6 1.4L4 17h5m6 0v1a3 3 0 1 1-6 0v-1m6 0H9" />
          </svg>
        </button>

        <div className="hidden h-6 w-px bg-white/10 sm:block" />

        {session && (
          <Link
            href="/dashboard/profil"
            className="flex items-center gap-3 transition-opacity hover:opacity-80"
          >
            <span className="hidden text-sm font-medium text-[#e1e2e7] sm:block">
              {session.user.name}
            </span>
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt=""
                width={38}
                height={38}
                className="rounded-full ring-2 ring-violet/40"
              />
            ) : (
              <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full bg-gradient-hero text-sm font-bold">
                {session.user.name?.[0] ?? 'U'}
              </div>
            )}
          </Link>
        )}

        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          aria-label="Déconnexion"
          title="Déconnexion"
          className="text-white/40 transition-colors hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
          </svg>
        </button>
      </div>
    </header>
  )
}
