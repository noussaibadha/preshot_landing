import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { DashboardNav } from '@/components/dashboard/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DashboardNav />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
