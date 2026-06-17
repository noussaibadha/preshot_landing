import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { ANNUAL_CAP } from '@/lib/referral'

function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.length > 2 ? local.slice(0, 2) : local[0]
  return `${visible}***@${domain}`
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const db = createServiceClient()

  const { data: me } = await db
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (!me) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  }

  const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString()

  // Parrainages émis par cet utilisateur + parrainages reçus (pour hasUsedReferral)
  const [
    { data: referrals },
    { count: validatedThisYear },
    { count: usedCount },
  ] = await Promise.all([
    // Liste des filleuls parrainés
    db
      .from('referrals')
      .select(`
        id,
        status,
        reward_months,
        created_at,
        referred:users!referrals_referred_id_fkey(email, name)
      `)
      .eq('referrer_id', me.id)
      .order('created_at', { ascending: false }),

    // Parrainages validés cette année (pour savoir si le plafond est atteint)
    db
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', me.id)
      .eq('status', 'validated')
      .gte('created_at', yearStart),

    // A-t-il utilisé un code comme filleul ?
    db
      .from('referrals')
      .select('*', { count: 'exact', head: true })
      .eq('referred_id', me.id)
      .eq('status', 'validated'),
  ])

  type ReferredUser = { email: string; name: string }

  const sanitized = (referrals ?? []).map((r) => {
    // Supabase retourne un objet ou un tableau selon la cardinalité du join
    const referred = Array.isArray(r.referred)
      ? (r.referred[0] as ReferredUser | undefined)
      : (r.referred as ReferredUser | null)

    return {
      id: r.id,
      status: r.status,
      reward_months: r.reward_months,
      created_at: r.created_at,
      referred_email: referred ? maskEmail(referred.email) : null,
      referred_name: referred?.name ?? null,
    }
  })

  return NextResponse.json({
    referrals: sanitized,
    validatedThisYear: validatedThisYear ?? 0,
    annualCap: ANNUAL_CAP,
    hasUsedReferral: (usedCount ?? 0) > 0,
  })
}
