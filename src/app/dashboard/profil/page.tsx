import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createServiceClient } from '@/lib/supabase'
import { ProfilView } from '@/components/dashboard/ProfilView'

export default async function ProfilPage() {
  const session = await getServerSession(authOptions)
  const db = createServiceClient()

  const { data: user } = await db
    .from('users')
    .select('*')
    .eq('id', session!.user.id)
    .single()

  return <ProfilView user={user} session={session!} />
}
