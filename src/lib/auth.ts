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
      const db = createServiceClient()

      const { data: existing } = await db
        .from('users')
        .select('id')
        .eq('email', user.email!)
        .single()

      if (!existing) {
        let code = generateReferralCode()
        // Ensure uniqueness
        let collision = true
        while (collision) {
          const { data } = await db.from('users').select('id').eq('referral_code', code).single()
          if (!data) collision = false
          else code = generateReferralCode()
        }

        await db.from('users').insert({
          email: user.email,
          name: user.name,
          avatar: user.image,
          plan: 'pro',
          referral_code: code,
          pro_months_remaining: 12,
        })
      } else {
        // Sync latest name/avatar from Google
        await db
          .from('users')
          .update({ name: user.name, avatar: user.image })
          .eq('email', user.email!)
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
