export interface ReferralTier {
  threshold: number
  badge: 'Silver' | 'Gold' | null
  label: string
  description: string
}

// Récompense fixe : 1 mois Pro par parrainage validé, plafonné à 6/an
export const REWARD_MONTHS_PER_REFERRAL = 1
export const ANNUAL_CAP = 6

export const REFERRAL_TIERS: ReferralTier[] = [
  {
    threshold: 1,
    badge: null,
    label: '1 parrainage',
    description: '1 mois Pro offert au filleul · +1 mois pour toi',
  },
  {
    threshold: 3,
    badge: 'Silver',
    label: '3 parrainages',
    description: 'Badge Silver débloqué · 3 mois cumulés',
  },
  {
    threshold: 6,
    badge: 'Gold',
    label: '6 parrainages',
    description: 'Badge Gold · Plafond annuel atteint (6 mois max)',
  },
]

export function getNextTier(validatedCount: number): ReferralTier | null {
  return REFERRAL_TIERS.find((t) => t.threshold > validatedCount) ?? null
}

export function getCurrentBadge(validatedCount: number): ReferralTier['badge'] {
  const reached = [...REFERRAL_TIERS].reverse().find((t) => validatedCount >= t.threshold)
  return reached?.badge ?? null
}

// Normalise un code saisi : "PRESHOT-ABC12345" → "ABC12345"
export function normalizeCode(raw: string): string {
  return raw.trim().toUpperCase().replace(/^PRESHOT-/, '')
}
