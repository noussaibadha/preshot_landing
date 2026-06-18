import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { normalizeCode, REWARD_MONTHS_PER_REFERRAL, ANNUAL_CAP } from '@/lib/referral'

export async function POST(req: NextRequest) {
  // ── Authentification ───────────────────────────────────────────
  const session = await getServerSession(authOptions)

  let body: { code?: string; email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Corps invalide' }, { status: 400 })
  }

  const { code, email: bodyEmail } = body
  if (!code) {
    return NextResponse.json({ error: 'code requis' }, { status: 422 })
  }

  // Résolution du filleul : session en priorité, sinon email du body
  const filleulEmail = session?.user?.email ?? bodyEmail
  if (!filleulEmail) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const db = createServiceClient()

  // ── Trouver le filleul ─────────────────────────────────────────
  const { data: filleul } = await db
    .from('users')
    .select('id, plan, pro_months_remaining')
    .eq('email', filleulEmail)
    .single()

  if (!filleul) {
    return NextResponse.json({ error: 'Compte filleul introuvable' }, { status: 404 })
  }

  // ── Normaliser et trouver le parrain ───────────────────────────
  const cleanCode = normalizeCode(code)
  if (!cleanCode) {
    return NextResponse.json({ error: 'Code invalide' }, { status: 422 })
  }

  const { data: referrer } = await db
    .from('users')
    .select('id, pro_months_remaining, plan')
    .eq('referral_code', cleanCode)
    .single()

  if (!referrer) {
    return NextResponse.json({ error: 'Code de parrainage invalide' }, { status: 404 })
  }

  // ── Règles métier ──────────────────────────────────────────────

  if (referrer.id === filleul.id) {
    return NextResponse.json({ error: 'Vous ne pouvez pas utiliser votre propre code' }, { status: 422 })
  }

  if (referrer.plan !== 'pro') {
    return NextResponse.json({ error: 'Ce code de parrainage n\'est plus actif' }, { status: 422 })
  }

  // Vérifier que le filleul n'a pas déjà utilisé un code
  const { count: usedCount } = await db
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referred_id', filleul.id)
    .eq('status', 'validated')

  if ((usedCount ?? 0) > 0) {
    return NextResponse.json({ error: 'Vous avez déjà utilisé un code de parrainage' }, { status: 409 })
  }

  // Vérifier le plafond annuel du parrain (6 parrainages validés par an)
  const yearStart = new Date(new Date().getFullYear(), 0, 1).toISOString()
  const { count: annualCount } = await db
    .from('referrals')
    .select('*', { count: 'exact', head: true })
    .eq('referrer_id', referrer.id)
    .eq('status', 'validated')
    .gte('created_at', yearStart)

  if ((annualCount ?? 0) >= ANNUAL_CAP) {
    return NextResponse.json(
      { error: 'Ce parrain a atteint le plafond annuel de 6 parrainages' },
      { status: 429 }
    )
  }

  // ── Appliquer le parrainage (3 opérations séquentielles) ───────

  const { error: insertError } = await db.from('referrals').insert({
    referrer_id: referrer.id,
    referred_id: filleul.id,
    status: 'validated',
    reward_months: REWARD_MONTHS_PER_REFERRAL,
  })

  if (insertError) {
    // Unique constraint (referrer_id, referred_id) → doublon
    if (insertError.code === '23505') {
      return NextResponse.json({ error: 'Parrainage déjà enregistré' }, { status: 409 })
    }
    console.error('[referrals/apply] insert error:', insertError)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  // Créditer le filleul (+1 mois Pro)
  const { error: filleulUpdateError } = await db
    .from('users')
    .update({
      plan: 'pro',
      pro_months_remaining: filleul.pro_months_remaining + REWARD_MONTHS_PER_REFERRAL,
    })
    .eq('id', filleul.id)

  if (filleulUpdateError) {
    console.error('[referrals/apply] filleul update error:', filleulUpdateError)
    return NextResponse.json({ error: 'Erreur lors du crédit filleul' }, { status: 500 })
  }

  // Créditer le parrain (+1 mois Pro)
  const { error: referrerUpdateError } = await db
    .from('users')
    .update({ pro_months_remaining: referrer.pro_months_remaining + REWARD_MONTHS_PER_REFERRAL })
    .eq('id', referrer.id)

  if (referrerUpdateError) {
    console.error('[referrals/apply] referrer update error:', referrerUpdateError)
    // Le filleul a déjà été crédité — on log mais on ne fait pas échouer la réponse
  }

  console.log('[PreShot] referral applied:', {
    referrer: { id: referrer.id, months_before: referrer.pro_months_remaining, months_after: referrer.pro_months_remaining + REWARD_MONTHS_PER_REFERRAL },
    referred: { id: filleul.id, months_before: filleul.pro_months_remaining, months_after: filleul.pro_months_remaining + REWARD_MONTHS_PER_REFERRAL },
    reward: REWARD_MONTHS_PER_REFERRAL,
  })

  return NextResponse.json({ success: true, months_offered: REWARD_MONTHS_PER_REFERRAL })
}
