import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { subDays } from 'date-fns'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
  }

  const db = createServiceClient()

  // Résoudre le user_id depuis l'email (la session stocke déjà l'id,
  // mais on re-vérifie en DB pour garantir la cohérence)
  const { data: user, error: userError } = await db
    .from('users')
    .select('id')
    .eq('email', session.user.email)
    .single()

  if (userError || !user) {
    return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  }

  const userId = user.id
  const thirtyDaysAgo = subDays(new Date(), 30).toISOString()

  // Les trois requêtes sont indépendantes : on les lance en parallèle
  const [
    { data: diagnostics, error: diagError },
    { count: totalCount, error: totalError },
    { count: dangerCount, error: dangerError },
    { data: recentRows, error: recentError },
  ] = await Promise.all([
    // 1. Les 20 diagnostics les plus récents (pour le tableau)
    db
      .from('diagnostics')
      .select('*')
      .eq('user_id', userId)
      .order('analyzed_at', { ascending: false })
      .limit(20),

    // 2. Nombre total de diagnostics (pour la stat "Sites analysés")
    db
      .from('diagnostics')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId),

    // 3. Nombre de diagnostics "danger" (pour la stat "Sites dangereux")
    db
      .from('diagnostics')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('verdict', 'danger'),

    // 4. Verdicts des 30 derniers jours (pour le score de sécurité)
    db
      .from('diagnostics')
      .select('verdict')
      .eq('user_id', userId)
      .gte('analyzed_at', thirtyDaysAgo),
  ])

  if (diagError || totalError || dangerError || recentError) {
    console.error('[diagnostics/list]', { diagError, totalError, dangerError, recentError })
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }

  const recentTotal = recentRows?.length ?? 0
  const safeCount = (recentRows ?? []).filter((d) => d.verdict === 'safe').length
  const securityScore = recentTotal > 0 ? Math.round((safeCount / recentTotal) * 100) : 100

  return NextResponse.json({
    diagnostics: diagnostics ?? [],
    securityScore,
    totalCount: totalCount ?? 0,
    dangerCount: dangerCount ?? 0,
  })
}
