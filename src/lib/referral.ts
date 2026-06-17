import { ReferralTier } from '@/types'

export const REFERRAL_TIERS: ReferralTier[] = [
  { threshold: 1, months: 3, label: '1 parrainage', badge: undefined },
  { threshold: 5, months: 6, label: '5 parrainages', badge: undefined },
  { threshold: 10, months: 12, label: '10 parrainages', badge: 'Fondateur' },
]

export function getRewardForCount(validatedCount: number): number {
  let months = 0
  for (const tier of [...REFERRAL_TIERS].reverse()) {
    if (validatedCount >= tier.threshold) {
      months = tier.months
      break
    }
  }
  return months
}

export function getNextTier(validatedCount: number): ReferralTier | null {
  return REFERRAL_TIERS.find((t) => t.threshold > validatedCount) ?? null
}
