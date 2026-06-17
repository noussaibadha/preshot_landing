import { NextAuthOptions, User } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { createServiceClient } from './supabase'

// ── Helpers ────────────────────────────────────────────────────────────────

function generateReferralCode(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase()
}

/** Génère un code unique — max 5 tentatives puis suffixe timestamp. */
async function generateUniqueCode(
  db: ReturnType<typeof createServiceClient>
): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = generateReferralCode()
    const { data } = await db
      .from('users')
      .select('id')
      .eq('referral_code', code)
      .maybeSingle()
    if (!data) return code
  }
  // Garantit l'unicité avec un suffixe timestamp base-36
  return (generateReferralCode(6) + Date.now().toString(36).toUpperCase()).slice(0, 10)
}

/**
 * Fallback : insère via l'API REST Supabase directement avec fetch.
 * Utilisé si le client JS échoue (env var mal chargée, réseau, etc.).
 * Prefer: resolution=ignore-duplicates → pas d'erreur si l'email existe déjà.
 */
async function upsertUserViaRest(
  supabaseUrl: string,
  serviceKey: string,
  user: User
): Promise<void> {
  const code = generateReferralCode()
  const res = await fetch(`${supabaseUrl}/rest/v1/users`, {
    method: 'POST',
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({
      email: user.email,
      name: user.name,
      avatar: user.image ?? null,
      plan: 'pro',
      referral_code: code,
      pro_months_remaining: 12,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`REST upsert failed ${res.status}: ${text}`)
  }
}

// ── NextAuth config ────────────────────────────────────────────────────────

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
    // ------------------------------------------------------------------
    // signIn — crée ou met à jour le profil dans Supabase
    // ------------------------------------------------------------------
    async signIn({ user }) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      // Diagnostic des variables d'environnement (visible dans les logs Vercel)
      console.log('[PreShot] signIn:', user.email)
      console.log('[PreShot] Supabase URL:', supabaseUrl?.slice(0, 30) ?? 'UNDEFINED')
      console.log('[PreShot] Service key present:', !!serviceKey)

      if (!supabaseUrl || !serviceKey) {
        console.error(
          '[PreShot] ERREUR CRITIQUE : variables Supabase manquantes. ' +
          'Définissez NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans Vercel.'
        )
        // On laisse passer la connexion mais le profil ne sera pas sauvegardé
        return true
      }

      try {
        const db = createServiceClient()

        // maybeSingle() retourne null sans erreur si 0 ligne — évite PGRST116
        const { data: existing, error: selectError } = await db
          .from('users')
          .select('id')
          .eq('email', user.email!)
          .maybeSingle()

        if (selectError) {
          console.error('[PreShot] SELECT error (code, message):', selectError.code, selectError.message)
          // Fallback REST pour les nouveaux utilisateurs
          await upsertUserViaRest(supabaseUrl, serviceKey, user)
          return true
        }

        if (!existing) {
          // Nouvel utilisateur — insérer avec plan Pro et code unique
          const code = await generateUniqueCode(db)

          const { error: insertError } = await db.from('users').insert({
            email: user.email,
            name: user.name,
            avatar: user.image ?? null,
            plan: 'pro',
            referral_code: code,
            pro_months_remaining: 12,
          })

          if (insertError) {
            console.error('[PreShot] INSERT error:', insertError.code, insertError.message, insertError.details)
            // Fallback REST
            await upsertUserViaRest(supabaseUrl, serviceKey, user)
          } else {
            console.log('[PreShot] Nouvel utilisateur créé:', user.email, '| code:', code)
          }
        } else {
          // Utilisateur existant — synchroniser nom et avatar Google
          const { error: updateError } = await db
            .from('users')
            .update({ name: user.name, avatar: user.image ?? null })
            .eq('email', user.email!)

          if (updateError) {
            console.error('[PreShot] UPDATE error:', updateError.code, updateError.message)
          }
        }
      } catch (exception) {
        console.error('[PreShot] signIn callback exception:', exception)
        // Dernière chance : REST API directement
        try {
          await upsertUserViaRest(supabaseUrl, serviceKey, user)
          console.log('[PreShot] Fallback REST réussi pour:', user.email)
        } catch (restError) {
          console.error('[PreShot] Fallback REST échoué:', restError)
        }
      }

      return true
    },

    // ------------------------------------------------------------------
    // jwt — persiste l'email dans le token
    // ------------------------------------------------------------------
    async jwt({ token, user }) {
      if (user) token.email = user.email
      return token
    },

    // ------------------------------------------------------------------
    // session — enrichit la session avec les données Supabase
    // ------------------------------------------------------------------
    async session({ session, token }) {
      if (session.user && token.email) {
        try {
          const db = createServiceClient()
          const { data, error } = await db
            .from('users')
            .select('id, plan, referral_code, pro_months_remaining')
            .eq('email', token.email as string)
            .maybeSingle()

          if (error) {
            console.error('[PreShot] session SELECT error:', error.code, error.message)
          }

          if (data) {
            session.user.id = data.id
            session.user.plan = data.plan
            session.user.referral_code = data.referral_code
            session.user.pro_months_remaining = data.pro_months_remaining
          }
        } catch (e) {
          console.error('[PreShot] session callback exception:', e)
        }
      }
      return session
    },
  },
}
