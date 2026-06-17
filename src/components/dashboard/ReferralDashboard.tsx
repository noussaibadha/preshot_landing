'use client'

import { useState } from 'react'
import { Session } from 'next-auth'
import { Referral, ReferralTier } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  session: Session
  referrals: Referral[]
  validatedCount: number
  tiers: ReferralTier[]
  nextTier: ReferralTier | null
}

export function ReferralDashboard({ session, referrals, validatedCount, tiers, nextTier }: Props) {
  const [copied, setCopied] = useState(false)
  const referralLink = `https://preshot.app/ref/${session.user.referral_code}`

  const totalReward = referrals
    .filter((r) => r.status === 'validated')
    .reduce((acc, r) => acc + r.reward_months, 0)

  async function handleCopy() {
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Programme de parrainage</h1>
        <p className="text-white/50">Invitez vos proches et gagnez des mois Pro.</p>
      </div>

      {/* Referral link */}
      <div className="card-gradient">
        <p className="text-sm text-white/50 mb-3 font-medium">Votre lien unique</p>
        <div className="flex items-center gap-3">
          <code className="flex-1 px-4 py-3 rounded-xl bg-black/30 text-violet-light text-sm font-mono truncate border border-violet/20">
            {referralLink}
          </code>
          <button
            onClick={handleCopy}
            className={`btn-primary text-sm py-3 shrink-0 ${copied ? 'opacity-80' : ''}`}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Copié !
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copier
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-extrabold gradient-text">{referrals.length}</p>
          <p className="text-sm text-white/50 mt-1">Total parrainages</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-extrabold gradient-text">{validatedCount}</p>
          <p className="text-sm text-white/50 mt-1">Validés</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-extrabold gradient-text">{totalReward}</p>
          <p className="text-sm text-white/50 mt-1">Mois Pro gagnés</p>
        </div>
      </div>

      {/* Progress & tiers */}
      <div className="card space-y-6">
        <h2 className="font-semibold">Paliers de récompense</h2>
        <div className="space-y-4">
          {tiers.map((tier) => {
            const reached = validatedCount >= tier.threshold
            return (
              <div key={tier.threshold} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${reached ? 'border-violet/30 bg-violet/10' : 'border-white/5 bg-white/[0.02]'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm ${reached ? 'bg-gradient-hero text-white' : 'bg-white/5 text-white/30'}`}>
                  {reached ? '✓' : tier.threshold}
                </div>
                <div className="flex-1">
                  <p className={`font-medium text-sm ${reached ? 'text-white' : 'text-white/40'}`}>
                    {tier.threshold} parrainage{tier.threshold > 1 ? 's' : ''} validé{tier.threshold > 1 ? 's' : ''}
                  </p>
                  <p className={`text-xs mt-0.5 ${reached ? 'text-violet-light' : 'text-white/25'}`}>
                    {tier.months} mois Pro offerts au filleul
                    {tier.badge && ` · Badge ${tier.badge}`}
                  </p>
                </div>
                {reached && (
                  <span className="badge badge-validated">Atteint</span>
                )}
              </div>
            )
          })}
        </div>

        {nextTier && (
          <div className="pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/50">Prochain palier</span>
              <span className="text-violet-light font-medium">
                {nextTier.threshold - validatedCount} parrainage{nextTier.threshold - validatedCount > 1 ? 's' : ''} restant{nextTier.threshold - validatedCount > 1 ? 's' : ''}
              </span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-hero rounded-full transition-all duration-700"
                style={{ width: `${Math.min((validatedCount / nextTier.threshold) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* History table */}
      <div className="card">
        <h2 className="font-semibold mb-6">Historique des parrainages</h2>
        {referrals.length === 0 ? (
          <div className="text-center py-12 text-white/30">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p>Aucun parrainage pour le moment.</p>
            <p className="text-sm mt-1">Partagez votre lien pour commencer !</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/5">
                  <th className="pb-3 font-medium text-white/40">Utilisateur</th>
                  <th className="pb-3 font-medium text-white/40">Date</th>
                  <th className="pb-3 font-medium text-white/40">Statut</th>
                  <th className="pb-3 font-medium text-white/40">Récompense</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {referrals.map((r) => (
                  <tr key={r.id}>
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-medium">{r.referred_user?.name ?? 'Utilisateur'}</p>
                        <p className="text-white/40 text-xs">{r.referred_user?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 text-white/50">
                      {format(new Date(r.created_at), 'd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="py-4 pr-4">
                      <span className={r.status === 'validated' ? 'badge-validated' : 'badge-pending'}>
                        {r.status === 'validated' ? 'Validé' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-4 text-violet-light font-medium">
                      {r.reward_months > 0 ? `+${r.reward_months} mois` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
