'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { User } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  user: User
  session: Session
}

/* ---------- icons ---------- */
const AccountIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM6 21a6 6 0 0 1 12 0" />
  </svg>
)
const LogoutIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1" />
  </svg>
)
const CameraIcon = (
  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 0 1 2-2h1l1-2h6l1 2h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
    <circle cx="12" cy="13" r="3" />
  </svg>
)
const AtIcon = (
  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="4" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3.5 7.1" />
  </svg>
)
const ShieldCheckIcon = (
  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V6l-8-3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
  </svg>
)
const FingerPrintIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v3m-4-4a4 4 0 0 1 8 0v2a8 8 0 0 0 1 4M7 13v1a8 8 0 0 0 1.5 4.5M5.5 8a8 8 0 0 1 13 0m-2.5 9a12 12 0 0 1-.5-3v-3a3.5 3.5 0 0 0-7 0" />
  </svg>
)
const KeyIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a3 3 0 1 1-2.8 4l-5.2 5.2V19H4v-3l6-6A3 3 0 0 1 15 7Z" />
  </svg>
)
const ScanIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 9V6a2 2 0 0 1 2-2h3m6 0h3a2 2 0 0 1 2 2v3m0 6v3a2 2 0 0 1-2 2h-3m-6 0H6a2 2 0 0 1-2-2v-3" />
  </svg>
)
const ChevronRight = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
  </svg>
)
const ServerIcon = (
  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <rect x="3" y="4" width="18" height="7" rx="2" />
    <rect x="3" y="13" width="18" height="7" rx="2" />
    <path strokeLinecap="round" d="M7 7.5h.01M7 16.5h.01" />
  </svg>
)
const GlobeIcon = (
  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
  </svg>
)
const GoogleIcon = (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

const activity = [
  { icon: ServerIcon, title: 'Accès au Noeud Chiffré : Alpha-7', meta: '14:22 • Zürich Server Hub', tag: 'Sécurisé', color: 'text-[#b2c5ff]' },
  { icon: GlobeIcon, title: 'Utilisation VPN', meta: '12:05 • Singapore Gateway', tag: 'Stable', color: 'text-[#d8b9ff]' },
  { icon: ShieldCheckIcon, title: 'Redirection Malveillante Bloquée', meta: '09:30 • Bouclier Web Actif', tag: 'Bloqué', color: 'text-[#ffb4ab]' },
]

export function ProfilView({ user }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleCopyCode() {
    if (!user) return
    await navigator.clipboard.writeText(`preshot.app/ref/${user.referral_code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!user) return <div className="p-8 text-white/50">Chargement du profil…</div>

  const isPro = user.plan === 'pro'
  const memberSince = format(new Date(user.created_at), 'MMMM yyyy', { locale: fr })

  return (
    <div className="min-h-screen bg-black px-6 py-10 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[190px_1fr] lg:gap-14">
          {/* ---------- Settings nav ---------- */}
          <aside className="space-y-1">
            <p className="mb-4 pl-3 text-[10px] uppercase tracking-[0.2em] text-[#a7a9b1]">Paramètres</p>

            <span className="flex items-center gap-3 rounded-full border border-[#b2c5ff]/60 bg-[#12141a] px-3 py-2 text-sm font-medium text-[#3e74ff]">
              {AccountIcon}
              Profil
            </span>

            <div className="my-3 ml-3 h-px w-[80%] bg-white/10" />

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex w-full items-center gap-3 rounded-full px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/5 hover:text-red-300"
            >
              {LogoutIcon}
              Déconnexion
            </button>
          </aside>

          {/* ---------- Main ---------- */}
          <div className="space-y-8">
            {/* Profile header */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              <div className="relative shrink-0">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={150}
                    height={150}
                    className="h-[140px] w-[140px] rounded-full object-cover ring-[3px] ring-[#3e74ff]"
                  />
                ) : (
                  <div className="flex h-[140px] w-[140px] items-center justify-center rounded-full bg-gradient-hero text-5xl font-bold ring-[3px] ring-[#3e74ff]">
                    {user.name?.[0] ?? 'U'}
                  </div>
                )}
                <span className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-xl bg-[#3e74ff] text-white shadow-lg">
                  {CameraIcon}
                </span>
              </div>

              <div className="text-center sm:text-left">
                <h1 className="text-3xl font-semibold text-[#e1e2e7]">{user.name}</h1>
                <p className="mt-1 text-base text-[rgba(62,116,255,0.82)]">
                  {isPro ? 'Membre Preshot Pro' : 'Membre Preshot Gratuit'}
                </p>
                {isPro ? (
                  <button className="mt-4 rounded-2xl border border-[#b2c5ff]/40 bg-[#0d0d0d] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/5">
                    Modifier le profil
                  </button>
                ) : (
                  <a
                    href="/#pricing"
                    className="mt-4 inline-block rounded-2xl bg-gradient-hero px-6 py-2.5 text-sm font-semibold text-white"
                  >
                    Passer Pro
                  </a>
                )}
              </div>
            </div>

            {/* Two cards */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Account information */}
              <div className="rounded-[19px] border border-[#b2c5ff]/30 bg-[#050709] p-8 shadow-[0_0_40px_rgba(178,197,255,0.1)]">
                <div className="flex items-center gap-2 text-[#e1e2e7]">
                  {AtIcon}
                  <h2 className="text-sm uppercase tracking-[0.05em]">Informations de compte</h2>
                </div>

                <div className="mt-6 space-y-5">
                  <Field label="E-mail" value={user.email} />

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[rgba(62,116,255,0.62)]">Abonnement actuel</p>
                    <p className="mt-1 text-sm text-[#e1e2e7]">
                      {isPro ? 'Preshot Pro' : 'Preshot Gratuit'}
                      {isPro && user.pro_months_remaining > 0 && (
                        <span className="ml-2 text-[11px] italic text-[rgba(62,116,255,0.68)]">
                          ({user.pro_months_remaining} mois restants)
                        </span>
                      )}
                    </p>
                    {isPro && user.pro_months_remaining > 0 && (
                      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                        <div
                          className="h-full rounded-full bg-gradient-hero"
                          style={{ width: `${Math.min((user.pro_months_remaining / 12) * 100, 100)}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {isPro && (
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-[rgba(62,116,255,0.62)]">Code de parrainage</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="font-mono text-sm text-[#b2c5ff]">preshot.app/ref/{user.referral_code}</p>
                        <button
                          onClick={handleCopyCode}
                          aria-label="Copier le code de parrainage"
                          className="shrink-0 text-white/50 transition-colors hover:text-white"
                        >
                          {copied ? (
                            <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <Field label="Membre depuis" value={memberSince} />

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-[rgba(62,116,255,0.62)]">Connexion via</p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-[#e1e2e7]">
                      {GoogleIcon}
                      Google
                    </p>
                  </div>
                </div>
              </div>

              {/* Security state */}
              <div className="rounded-[19px] border border-[#b2c5ff]/30 bg-[#050709] p-8 shadow-[0_0_40px_rgba(142,62,242,0.15)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#e1e2e7]">
                    {ShieldCheckIcon}
                    <h2 className="text-sm uppercase tracking-[0.05em]">État de sécurité</h2>
                  </div>
                  <span className="text-[10px] font-medium uppercase tracking-wide text-[#b2c5ff]">Excellent</span>
                </div>

                <ul className="mt-6 space-y-6">
                  <SecurityRow icon={FingerPrintIcon} label="Double Authentification (2FA)" chevron />
                  <SecurityRow icon={KeyIcon} label="Clé de sécurité matérielle liée" chevron />
                  <li className="flex items-center gap-3 text-sm text-[#3e74ff]">
                    {ScanIcon}
                    Dernier scan : il y a 2 min
                  </li>
                </ul>
              </div>
            </div>

            {/* Activity log */}
            <div className="rounded-[17px] border border-[#b2c5ff]/20 bg-[#050709] p-3">
              {activity.map((item, i) => (
                <div
                  key={item.title}
                  className={`flex items-center gap-4 px-5 py-4 ${i > 0 ? 'border-t border-white/5' : ''}`}
                >
                  <span className="text-white/70">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#e1e2e7]">{item.title}</p>
                    <p className="text-[11px] text-[#8c90a0]">{item.meta}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-[0.05em] ${item.color}`}>{item.tag}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col items-start justify-between gap-4 pt-6 text-xs text-[#8c90a0] sm:flex-row sm:items-center">
              <p className="opacity-80">© 2026 Preshot. Tous droits réservés.</p>
              <div className="flex items-center gap-7 uppercase tracking-[0.1em]">
                <a href="#" className="transition-colors hover:text-white">Confidentialité</a>
                <a href="#" className="transition-colors hover:text-white">CGU</a>
                <a href="#" className="transition-colors hover:text-white">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-[rgba(62,116,255,0.62)]">{label}</p>
      <p className="mt-1 break-words text-sm text-[#e1e2e7]">{value}</p>
    </div>
  )
}

function SecurityRow({ icon, label, chevron }: { icon: React.ReactNode; label: string; chevron?: boolean }) {
  return (
    <li className="flex items-center gap-3 text-sm text-[#e1e2e7]">
      <span className="text-white/80">{icon}</span>
      <span className="flex-1">{label}</span>
      {chevron && <span className="text-white/40">{ChevronRight}</span>}
    </li>
  )
}
