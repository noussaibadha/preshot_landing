import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { REFERRAL_TIERS, getNextTier } from '@/lib/referral'
import { Referral } from '@/types'
import { ReferralDashboard } from '@/components/dashboard/ReferralDashboard'

export default async function ParrainagePage() {
  const session = await getServerSession(authOptions)!
  const db = createServiceClient()

  if (session!.user.plan !== 'pro') {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="card-gradient text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-violet/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-violet-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Fonctionnalité Pro</h2>
          <p className="text-white/55 max-w-md mx-auto mb-8">
            Le programme de parrainage est réservé aux membres Pro. Passez à l&apos;abonnement Pro
            pour générer votre lien unique et gagner des mois offerts.
          </p>
          <a href="/#pricing" className="btn-primary">
            Découvrir l&apos;offre Pro — 4,99€/mois
          </a>
        </div>
      </div>
    )
  }

  // Fetch referrals for this user
  const { data: referrals } = await db
    .from('referrals')
    .select(`
      *,
      referred_user:users!referrals_referred_id_fkey(name, email, avatar)
    `)
    .eq('referrer_id', session!.user.id)
    .order('created_at', { ascending: false })

  const validatedCount = (referrals ?? []).filter((r: Referral) => r.status === 'validated').length
  const nextTier = getNextTier(validatedCount)

  // Vérifie si cet utilisateur a déjà utilisé un code en tant que filleul
  const { count: usedCount } = await db
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referred_id', session!.user.id)
    .eq('status', 'validated')

  return (
    <ReferralDashboard
      session={session!}
      referrals={(referrals ?? []) as Referral[]}
      validatedCount={validatedCount}
      tiers={REFERRAL_TIERS}
      nextTier={nextTier}
      hasUsedReferral={(usedCount ?? 0) > 0}
    />
  )
}
