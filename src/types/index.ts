export type Plan = 'free' | 'pro'
export type ReferralStatus = 'pending' | 'validated'
export type Verdict = 'safe' | 'warning' | 'danger'

export interface User {
  id: string
  email: string
  name: string
  avatar: string | null
  plan: Plan
  referral_code: string
  pro_months_remaining: number
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  status: ReferralStatus
  reward_months: number
  created_at: string
  referred_user?: {
    name: string
    email: string
    avatar: string | null
  }
}

export interface Diagnostic {
  id: string
  user_id: string
  url: string
  verdict: Verdict
  red_flags_count: number
  details: Record<string, unknown>
  analyzed_at: string
}

export interface ReferralTier {
  threshold: number
  months: number
  label: string
  badge?: string
}
