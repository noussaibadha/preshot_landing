import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { Diagnostic } from '@/types'
import { HistoriqueDashboard } from '@/components/dashboard/HistoriqueDashboard'
import { subDays } from 'date-fns'

export default async function HistoriquePage() {
  const session = await getServerSession(authOptions)
  const db = createServiceClient()

  const thirtyDaysAgo = subDays(new Date(), 30).toISOString()

  const { data: diagnostics } = await db
    .from('diagnostics')
    .select('*')
    .eq('user_id', session!.user.id)
    .order('analyzed_at', { ascending: false })

  const { data: recentDiagnostics } = await db
    .from('diagnostics')
    .select('verdict')
    .eq('user_id', session!.user.id)
    .gte('analyzed_at', thirtyDaysAgo)

  // Global security score over last 30 days (0-100)
  const safeCount = (recentDiagnostics ?? []).filter((d) => d.verdict === 'safe').length
  const total = (recentDiagnostics ?? []).length
  const securityScore = total > 0 ? Math.round((safeCount / total) * 100) : 100

  return (
    <HistoriqueDashboard
      diagnostics={(diagnostics ?? []) as Diagnostic[]}
      securityScore={securityScore}
      recentTotal={total}
    />
  )
}
