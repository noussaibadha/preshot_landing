import { createServiceClient } from '@/lib/supabase'
import { RefInviteClient } from './RefInviteClient'
import Link from 'next/link'

interface Props {
  params: { code: string }
}

export default async function RefPage({ params }: Props) {
  const db = createServiceClient()

  const { data: referrer } = await db
    .from('users')
    .select('name, avatar, plan')
    .eq('referral_code', params.code)
    .single()

  // Code inexistant ou parrain plus Pro
  if (!referrer || referrer.plan !== 'pro') {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="card max-w-md w-full text-center py-16">
          <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold mb-2">Code invalide</h1>
          <p className="text-white/50 text-sm mb-6">
            Ce lien de parrainage n&apos;existe pas ou n&apos;est plus actif.
          </p>
          <Link href="/" className="btn-outline text-sm py-2 px-4">
            Retour à l&apos;accueil
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <RefInviteClient
        code={params.code}
        referrerName={referrer.name ?? 'Un membre PreShot'}
      />
    </main>
  )
}
