import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createServiceClient } from './supabase'

function generateReferralCode(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase()
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user }) {
      console.log('[PreShot] signIn called:', user.email)
      const db = createServiceClient()
      
      const { data: existing, error: selectError } = await db
        .from('users')
        .select('id')
        .eq('email', user.email!)
        .single()

      console.log('[PreShot] select result:', { existing, selectError })

      if (!existing) {
        let code = generateReferralCode()
        let collision = true
        while (collision) {
          const { data } = await db.from('users').select('id').eq('referral_code', code).single()
          if (!data) collision = false
          else code = generateReferralCode()
        }

        const { error: insertError } = await db.from('users').insert({
          email: user.email,
          name: user.name,
          avatar: user.image,
          plan: 'pro',
          referral_code: code,
          pro_months_remaining: 12,
        })
        
        console.log('[PreShot] insert result:', { insertError })
      }

      return true
    },

    async jwt({ token, user }) {
      if (user) token.email = user.email
      return token
    },

    async session({ session, token }) {
      if (session.user && token.email) {
        const db = createServiceClient()
        const { data } = await db
          .from('users')
          .select('id, plan, referral_code, pro_months_remaining')
          .eq('email', token.email as string)
          .single()

        if (data) {
          session.user.id = data.id
          session.user.plan = data.plan
          session.user.referral_code = data.referral_code
          session.user.pro_months_remaining = data.pro_months_remaining
        }
      }
      return session
    },
  },
}
