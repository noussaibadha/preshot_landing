import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Preflight — extensions Chrome envoient une requête OPTIONS avant POST
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Corps de requête invalide' },
      { status: 400, headers: CORS_HEADERS }
    )
  }

  const { email, url, verdict, red_flags_count, details } = body as {
    email?: string
    url?: string
    verdict?: string
    red_flags_count?: number
    details?: Record<string, unknown>
  }

  // Validation basique
  if (!email || !url || !verdict) {
    return NextResponse.json(
      { error: 'Champs requis manquants : email, url, verdict' },
      { status: 422, headers: CORS_HEADERS }
    )
  }

  if (!['safe', 'warning', 'danger'].includes(verdict)) {
    return NextResponse.json(
      { error: 'verdict doit être safe, warning ou danger' },
      { status: 422, headers: CORS_HEADERS }
    )
  }

  const db = createServiceClient()

  // Chercher l'utilisateur par email
  const { data: user, error: userError } = await db
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (userError || !user) {
    return NextResponse.json(
      { error: 'Utilisateur introuvable' },
      { status: 404, headers: CORS_HEADERS }
    )
  }

  // Insérer le diagnostic
  const { error: insertError } = await db.from('diagnostics').insert({
    user_id: user.id,
    url,
    verdict,
    red_flags_count: red_flags_count ?? 0,
    details: details ?? {},
  })

  if (insertError) {
    console.error('[diagnostics] insert error:', insertError)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500, headers: CORS_HEADERS }
    )
  }

  return NextResponse.json({ success: true }, { status: 200, headers: CORS_HEADERS })
}
