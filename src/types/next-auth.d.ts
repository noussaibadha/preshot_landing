import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      plan: 'free' | 'pro'
      referral_code: string
      pro_months_remaining: number
    }
  }
}
