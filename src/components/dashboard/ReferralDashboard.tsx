'use client'

import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Session } from 'next-auth'
import { Referral } from '@/types'
import { ReferralTier } from '@/lib/referral'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

type ApplyStatus = 'idle' | 'loading' | 'success' | 'error'

const PENDING_CODE_KEY = 'preshot_pending_referral'

interface Props {
  session: Session
  referrals: Referral[]
  validatedCount: number
  tiers: ReferralTier[]
  nextTier: ReferralTier | null
  hasUsedReferral: boolean
}

/* ---------- icons ---------- */
const CopyIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
  </svg>
)
const ShareIcon = (
  <svg className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.7 10.7a3 3 0 1 0 0 2.6m0-2.6 6.6-3.9m-6.6 6.5 6.6 3.9m0 0a3 3 0 1 0 .9-1.5m-.9 1.5.9-1.5m0-9.9a3 3 0 1 0-.9-1.5m.9 1.5-.9-1.5" />
  </svg>
)
const WhatsAppIcon = (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.6.2-.2.3-.7 1-.9 1.1-.2.2-.3.2-.6 0-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5 0-.2 0-.4 0-.5 0-.2-.6-1.5-.9-2.1-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1.1 2.7c.1.2 1.8 2.8 4.5 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z" />
  </svg>
)
const ArrowUp = (
  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0-6 6m6-6 6 6" />
  </svg>
)
const ShieldIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 6v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V6l-8-3Z" />
  </svg>
)
const KeyIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a3 3 0 1 1-2.8 4l-5.2 5.2V19H4v-3l6-6A3 3 0 0 1 15 7Z" />
  </svg>
)
const TrophyIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8v5a4 4 0 0 1-8 0V4Zm0 2H5a3 3 0 0 0 3 3m8-3h3a3 3 0 0 1-3 3m-4 4v3m-3 4h6m-3-4v1" />
  </svg>
)
const CheckCircle = (
  <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.7 7.3-5.4 5.4a1 1 0 0 1-1.4 0l-2.6-2.6a1 1 0 0 1 1.4-1.4l1.9 1.9 4.7-4.7a1 1 0 0 1 1.4 1.4Z" clipRule="evenodd" />
  </svg>
)
const HourglassIcon = (
  <svg className="h-5 w-5 text-white/55" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 3h12M6 21h12M7 3c0 4 3 5.5 5 7 2-1.5 5-3 5-7M7 21c0-4 3-5.5 5-7 2 1.5 5 3 5 7" />
  </svg>
)
const LockIcon = (
  <svg className="h-5 w-5 text-white/45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 10V8a6 6 0 0 1 12 0v2m-13 0h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z" />
  </svg>
)

const tierStyles = [
  { bg: 'bg-[rgba(178,197,255,0.2)]', border: 'border-[rgba(178,197,255,0.3)]', text: 'text-[#b2c5ff]', icon: ShieldIcon },
  { bg: 'bg-[rgba(216,185,255,0.2)]', border: 'border-[rgba(216,185,255,0.3)]', text: 'text-[#d8b9ff]', icon: KeyIcon },
  { bg: 'bg-[rgba(255,182,142,0.2)]', border: 'border-[rgba(255,182,142,0.3)]', text: 'text-[#ffb68e]', icon: TrophyIcon },
]

function initials(name?: string) {
  if (!name) return '??'
  const parts = name.trim().split(/\s+/)
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase() || name.slice(0, 2).toUpperCase()
}

export function ReferralDashboard({ session, referrals, validatedCount, tiers, nextTier, hasUsedReferral }: Props) {
  const [copied, setCopied] = useState(false)
  const [origin, setOrigin] = useState('preshot.app')
  const [showAll, setShowAll] = useState(false)
  const [codeInput, setCodeInput] = useState('')
  const [applyStatus, setApplyStatus] = useState<ApplyStatus>('idle')
  const [applyMessage, setApplyMessage] = useState('')

  useEffect(() => {
    setOrigin(window.location.host)
  }, [])

  // Auto-apply a referral code stored before the OAuth redirect (functionality from main)
  useEffect(() => {
    if (hasUsedReferral) return
    const pending = localStorage.getItem(PENDING_CODE_KEY)
    if (!pending) return
    localStorage.removeItem(PENDING_CODE_KEY)

    setApplyStatus('loading')
    fetch('/api/referrals/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: pending, email: session.user.email }),
    })
      .then((res) => res.json().then((data: { error?: string }) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) {
          setApplyStatus('error')
          setApplyMessage(data.error ?? 'Une erreur est survenue')
        } else {
          setApplyStatus('success')
          setApplyMessage('Code de parrainage appliqué ! 1 mois Pro ajouté à votre compte.')
        }
      })
      .catch(() => {
        setApplyStatus('error')
        setApplyMessage('Impossible de contacter le serveur')
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const code = session.user.referral_code
  const refPath = `/ref/${code}`
  const refUrl = `${origin}${refPath}`
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${refPath}` : `https://${refUrl}`

  const totalReward = useMemo(
    () => referrals.filter((r) => r.status === 'validated').reduce((acc, r) => acc + r.reward_months, 0),
    [referrals],
  )
  const weeklyCount = useMemo(() => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
    return referrals.filter((r) => new Date(r.created_at).getTime() > cutoff).length
  }, [referrals])

  const nextThreshold = nextTier?.threshold ?? validatedCount
  const remaining = nextTier ? nextTier.threshold - validatedCount : 0
  const progressPct = nextTier ? Math.min((validatedCount / nextTier.threshold) * 100, 100) : 100

  const visibleReferrals = showAll ? referrals : referrals.slice(0, 4)

  async function handleCopy() {
    await navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Preshot', text: 'Rejoins-moi sur Preshot', url: fullUrl })
        return
      } catch {
        /* fallthrough to copy */
      }
    }
    handleCopy()
  }

  function handleWhatsApp() {
    const text = encodeURIComponent(`Rejoins-moi sur Preshot et navigue en sécurité : ${fullUrl}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  async function handleApplyCode() {
    const trimmed = codeInput.trim()
    if (!trimmed) return
    setApplyStatus('loading')
    setApplyMessage('')
    try {
      const res = await fetch('/api/referrals/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: trimmed, email: session.user.email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setApplyStatus('error')
        setApplyMessage(data.error ?? 'Une erreur est survenue')
      } else {
        setApplyStatus('success')
        setApplyMessage('1 mois Pro ajouté à votre compte !')
        setCodeInput('')
      }
    } catch {
      setApplyStatus('error')
      setApplyMessage('Impossible de contacter le serveur')
    }
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Top: heading + link card */}
        <div className="grid gap-8 lg:grid-cols-[1fr_417px] lg:items-start">
          <div className="pt-2">
            <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-[40px] sm:leading-[1.15]">
              Invitez{' '}
              <span className="bg-gradient-to-r from-[#8e3ef2] to-[#c9a9ff] bg-clip-text text-transparent">
                vos amis
              </span>{' '}
              et, recevez{' '}
              <span className="bg-gradient-to-r from-[#3e74ff] to-[#7aa2ff] bg-clip-text text-transparent">
                vos récompenses.
              </span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[#c2c6d7]">
              Protégez votre réseau grâce à la détection avancée des menaces de Preshot. Obtenez des
              récompenses pour chaque parrainage validé en validant les différents paliers.
            </p>
          </div>

          {/* Link card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-blue-accent/70 via-violet/40 to-[#8e3ef2]/70 p-[1.5px] shadow-[0_0_40px_rgba(62,116,255,0.25)]">
            <div className="rounded-2xl bg-black/90 px-6 py-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">Lien</p>
                  <p className="mt-2 truncate text-2xl font-semibold text-[#b2c5ff]">{refUrl}</p>
                </div>
                <button
                  onClick={handleCopy}
                  aria-label="Copier le lien"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-[#1d2023] text-white/80 transition-colors hover:bg-white/10"
                >
                  {copied ? (
                    <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                    </svg>
                  ) : (
                    CopyIcon
                  )}
                </button>
              </div>

              {/* Share buttons */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <button
                  onClick={handleShare}
                  className="flex h-[46px] items-center justify-center gap-2 rounded-lg border border-[rgba(29,161,242,0.25)] bg-[rgba(29,161,242,0.1)] text-xs font-medium uppercase tracking-wide text-[#e1e2e7] transition-colors hover:bg-[rgba(29,161,242,0.2)]"
                >
                  {ShareIcon}
                  Partager
                </button>
                <button
                  onClick={handleWhatsApp}
                  className="flex h-[46px] items-center justify-center gap-2 rounded-lg border border-[rgba(37,211,102,0.25)] bg-[rgba(37,211,102,0.1)] text-xs font-medium uppercase tracking-wide text-[#e1e2e7] transition-colors hover:bg-[rgba(37,211,102,0.2)]"
                >
                  {WhatsAppIcon}
                  WhatsApp
                </button>
              </div>

              {copied && (
                <p className="mt-3 text-xs text-emerald-400">Lien copié dans le presse-papier</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
          <StatCard label="Total parrainages" value={String(referrals.length)} accent="violet">
            <span className="flex items-center gap-1 text-[#8e3ef2]">
              {ArrowUp}+{weeklyCount} cette semaine
            </span>
          </StatCard>
          <StatCard label="Récompenses gagnées" value={String(totalReward)} accent="blue">
            <span className="text-[#c2c6d7]">Mois Pro</span>
          </StatCard>
          <StatCard label="Étape suivante" value={`${validatedCount}/${nextThreshold}`} accent="violet">
            <span className="uppercase tracking-wide text-[#853ae3]">Bonus</span>
          </StatCard>
          <StatCard label="Statut d'invitation" value="Actif" accent="blue">
            <span className="ml-1 inline-block h-3 w-3 rounded-full bg-blue-accent shadow-[0_0_10px_rgba(62,116,255,0.8)]" />
          </StatCard>
        </div>

        {/* Main: table + rewards */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          {/* Referrals table */}
          <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.1] to-white/0 backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <h2 className="text-2xl font-semibold tracking-tight text-[#e1e2e7]">Parrainages</h2>
              {referrals.length > 4 && (
                <button
                  onClick={() => setShowAll((s) => !s)}
                  className="flex items-center gap-1 text-xs font-medium text-white/50 transition-colors hover:text-white"
                >
                  {showAll ? 'Voir moins' : 'Tout voir'}
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {referrals.length === 0 ? (
              <div className="px-6 py-16 text-center text-white/35">
                <p>Aucun parrainage pour le moment.</p>
                <p className="mt-1 text-sm">Partagez votre lien pour commencer !</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[rgba(25,28,31,0.5)] text-left text-[11px] uppercase tracking-wider text-[#8c90a0]">
                    <th className="px-6 py-4 font-medium">Utilisateur</th>
                    <th className="px-4 py-4 font-medium">Date</th>
                    <th className="px-4 py-4 font-medium">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleReferrals.map((r) => {
                    const validated = r.status === 'validated'
                    return (
                      <tr key={r.id} className="border-t border-white/[0.06]">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-accent/40 to-violet/40 text-[11px] font-semibold text-white">
                              {initials(r.referred_user?.name)}
                            </span>
                            <span className="text-sm font-medium text-white">
                              {r.referred_user?.name ?? 'Utilisateur'}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-white/45">
                          {format(new Date(r.created_at), 'd MMM, yyyy', { locale: fr })}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                              validated
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-[rgba(178,197,255,0.1)] text-[#b2c5ff]'
                            }`}
                          >
                            {validated ? 'Validé' : 'En cours'}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Rewards showcase */}
          <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[rgba(13,17,23,0.7)] p-6 shadow-[0_0_40px_rgba(216,185,255,0.15)] backdrop-blur">
            <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#8e3ef2] blur-3xl opacity-60" />
            <div className="pointer-events-none absolute -top-6 left-1/2 h-40 w-40 rounded-full bg-blue-accent blur-3xl opacity-40" />

            <div className="relative">
              <h3 className="text-2xl tracking-tight text-[#fcfbff]">Récompenses</h3>
              <p className="mt-2 text-sm leading-5 text-[#c2c6d7]">
                Accédez aux niveaux supérieurs pour bénéficier de fonctionnalités de sécurité exclusives.
              </p>

              <ul className="mt-5 space-y-4">
                {tiers.map((tier, i) => {
                  const style = tierStyles[i] ?? tierStyles[tierStyles.length - 1]
                  const reached = validatedCount >= tier.threshold
                  const isNext = nextTier?.threshold === tier.threshold
                  return (
                    <li key={tier.threshold} className="flex items-center gap-4">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded border ${style.bg} ${style.border} ${style.text}`}>
                        {style.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-base text-white">{tier.threshold} parrainage{tier.threshold > 1 ? 's' : ''}</p>
                        <p className="truncate text-xs text-[#8c90a0]">{tier.description}</p>
                      </div>
                      <span className="shrink-0">
                        {reached ? CheckCircle : isNext ? HourglassIcon : LockIcon}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <div className="mt-8">
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#323539]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#b2c5ff] to-[#d8b9ff] shadow-[0_0_10px_rgba(178,197,255,0.4)] transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p className="mt-2 text-right text-[10px] font-bold uppercase tracking-[0.1em] text-white">
                  {nextTier
                    ? `Encore ${remaining} pour l'étape suivante`
                    : 'Tous les paliers atteints'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Apply a friend's code (kept functionality) */}
        <div className="mt-8 rounded-2xl border border-white/8 bg-black/40 px-6 py-6">
          <h2 className="text-base font-semibold">Vous avez un code de parrainage ?</h2>
          <p className="mt-0.5 text-sm text-white/40">
            Entrez le code d&apos;un ami pour obtenir 1 mois Pro gratuit.
          </p>

          {hasUsedReferral || applyStatus === 'success' ? (
            <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              {CheckCircle}
              {applyStatus === 'success' ? applyMessage : 'Vous avez déjà utilisé un code de parrainage'}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={codeInput}
                  onChange={(e) => {
                    setCodeInput(e.target.value.toUpperCase())
                    if (applyStatus !== 'idle') {
                      setApplyStatus('idle')
                      setApplyMessage('')
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyCode()}
                  placeholder="PRESHOT-XXXXXX"
                  className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 transition-all focus:border-blue-accent/50 focus:outline-none focus:ring-1 focus:ring-blue-accent/30"
                />
                <button
                  onClick={handleApplyCode}
                  disabled={applyStatus === 'loading' || !codeInput.trim()}
                  className="shrink-0 rounded-xl border border-blue-accent/60 bg-blue-accent/10 px-5 py-3 text-sm font-medium text-blue-accent transition-colors hover:bg-blue-accent/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {applyStatus === 'loading' ? 'Application…' : 'Appliquer'}
                </button>
              </div>
              {applyStatus === 'error' && <p className="px-1 text-sm text-red-400">{applyMessage}</p>}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-[#8c90a0] sm:flex-row sm:items-center">
          <p className="opacity-80">© 2026 Preshot. Tous droits réservés.</p>
          <div className="flex items-center gap-7 uppercase tracking-[0.1em]">
            <a href="#" className="transition-colors hover:text-white">Confidentialité</a>
            <a href="#" className="transition-colors hover:text-white">CGU</a>
            <a href="#" className="transition-colors hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  accent,
  children,
}: {
  label: string
  value: string
  accent: 'violet' | 'blue'
  children: ReactNode
}) {
  const border = accent === 'violet' ? 'border-l-[#8e3ef2]' : 'border-l-[#3e74ff]'
  return (
    <div className={`rounded-xl border-l-4 ${border} bg-[rgba(13,17,23,0.7)] px-6 py-5 backdrop-blur-sm`}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-[#8c90a0]">{label}</p>
      <div className="mt-3 flex items-end gap-2">
        <span className="text-[38px] font-semibold leading-none text-[#e1e2e7]">{value}</span>
        <span className="pb-1 text-xs">{children}</span>
      </div>
    </div>
  )
}
