'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Diagnostic, Verdict } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'

type Filter = 'all' | Verdict | 'recent'

interface ApiResponse {
  diagnostics: Diagnostic[]
  securityScore: number
  totalCount: number
  dangerCount: number
}

const VERDICT_LABELS: Record<Verdict, string> = {
  safe: 'Sécurisé',
  warning: 'À risque',
  danger: 'Bloqué',
}

const VERDICT_BADGE: Record<Verdict, string> = {
  safe: 'border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.18)] text-[#10b981]',
  warning: 'border-[rgba(209,176,76,0.25)] bg-[rgba(209,176,76,0.2)] text-[#d1b04c]',
  danger: 'border-[rgba(223,62,64,0.25)] bg-[rgba(223,62,64,0.18)] text-[#df3e40]',
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-red-400'
}

/* ---------- icons ---------- */
const UploadIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-8-12v12m0-12-4 4m4-4 4 4" />
  </svg>
)
const GlobeIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
  </svg>
)
const HistoryIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v5h5M3.05 13A9 9 0 1 0 6 5.3L3 8m9-1v5l4 2" />
  </svg>
)

export function HistoriqueDashboard() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>('all')

  const fetchDiagnostics = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/diagnostics/list')
      if (!res.ok) throw new Error(`Erreur ${res.status}`)
      const json: ApiResponse = await res.json()
      setData(json)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchDiagnostics() }, [fetchDiagnostics])

  const diagnostics = data?.diagnostics ?? []

  const filtered = useMemo(() => {
    if (filter === 'all') return diagnostics
    if (filter === 'recent') {
      const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000
      return diagnostics.filter((d) => new Date(d.analyzed_at).getTime() > cutoff)
    }
    return diagnostics.filter((d) => d.verdict === filter)
  }, [diagnostics, filter])

  function exportCSV() {
    const header = 'URL,Date,Verdict,Red Flags\n'
    const rows = diagnostics.map((d) =>
      `"${d.url}","${d.analyzed_at}","${d.verdict}","${d.red_flags_count}"`
    )
    const blob = new Blob([header + rows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `preshot-historique-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Tout' },
    { key: 'safe', label: 'Sécurisé' },
    { key: 'warning', label: 'À risque' },
    { key: 'danger', label: 'Dangereux' },
    { key: 'recent', label: 'Récent (7j)' },
  ]

  return (
    <div className="min-h-screen bg-black px-6 py-10 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-[48px]">
              Historique de <span className="text-[#8e3ef2]">navigation</span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#c2c6d7]">
              Suivez votre empreinte numérique : chaque destination est analysée en temps réel
              pour garantir l&apos;intégrité de vos données, sans faille ni détour, pour votre
              sécurité chaque jour.
            </p>
          </div>

          <button
            onClick={exportCSV}
            disabled={diagnostics.length === 0}
            className="flex shrink-0 items-center gap-2 rounded-2xl border-2 border-[#682db4] bg-[#0e0e0e] px-6 py-3.5 text-sm font-semibold text-white shadow-[2px_2px_18px_rgba(104,45,180,0.45)] transition-colors hover:bg-[#682db4]/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {UploadIcon}
            Exporter l&apos;historique
          </button>
        </div>

        {/* Stats + filters */}
        {data && (
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/50">
            <span>
              Score de sécurité{' '}
              <span className={`font-semibold ${scoreColor(data.securityScore)}`}>{data.securityScore}</span>
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span>
              <span className="font-semibold text-white/80">{data.totalCount}</span> sites analysés
            </span>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span>
              <span className="font-semibold text-red-400">{data.dangerCount}</span> dangereux
            </span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                filter === f.key
                  ? 'border border-violet/30 bg-violet/20 text-violet-light'
                  : 'border border-white/5 bg-white/5 text-white/50 hover:border-white/10 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="mt-8 max-w-3xl">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-[66px] animate-pulse rounded-[10px] border border-[#554f4f]/40 bg-[#0e0e0e]" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[10px] border border-[#554f4f] bg-[#0e0e0e] px-8 py-12 text-center">
              <p className="font-semibold text-red-400">Impossible de charger l&apos;historique</p>
              <p className="mt-1 text-sm text-white/40">{error}</p>
              <button
                onClick={fetchDiagnostics}
                className="mt-5 rounded-xl border border-blue-accent/50 bg-blue-accent/10 px-5 py-2.5 text-sm font-medium text-blue-accent transition-colors hover:bg-blue-accent/20"
              >
                Réessayer
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-[10px] border border-[#554f4f] bg-[#0e0e0e] px-8 py-16 text-center text-white/35">
              <p>Aucun diagnostic trouvé.</p>
              {diagnostics.length === 0 && (
                <p className="mt-1 text-sm">Installez l&apos;extension et naviguez pour voir vos analyses ici.</p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((d) => {
                const flags =
                  d.red_flags_count > 0
                    ? `${d.red_flags_count} signal${d.red_flags_count > 1 ? 'aux' : ''} détecté${d.red_flags_count > 1 ? 's' : ''}`
                    : 'Aucun signal'
                return (
                  <div
                    key={d.id}
                    className="flex items-center gap-6 rounded-[10px] border border-[#554f4f] bg-[#0e0e0e] px-8 py-3 transition-colors hover:border-white/30"
                  >
                    <span className="shrink-0 text-[#b2c5ff]">{GlobeIcon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#e1e2e7]" title={d.url}>{d.url}</p>
                      <div className="mt-1 flex items-center gap-3 text-xs">
                        <span className="text-[#c2c6d7]">
                          {formatDistanceToNow(new Date(d.analyzed_at), { addSuffix: true, locale: fr })}
                        </span>
                        <span className="h-1 w-1 shrink-0 rounded-full bg-[rgba(140,144,160,0.5)]" />
                        <span className="truncate text-[rgba(178,197,255,0.8)]">{flags}</span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-lg border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] ${VERDICT_BADGE[d.verdict]}`}
                    >
                      {VERDICT_LABELS[d.verdict]}
                    </span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Load / refresh */}
          {!loading && !error && (
            <button
              onClick={fetchDiagnostics}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-accent/40 bg-[#0e0e0e] py-5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(62,116,255,0.25)] transition-colors hover:bg-blue-accent/10"
            >
              {HistoryIcon}
              Charger l&apos;historique complet
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-xs text-[#8c90a0] sm:flex-row sm:items-center">
          <p className="opacity-80">© 2026 Preshot. Tous droits réservés.</p>
          <div className="flex items-center gap-7 uppercase tracking-[0.1em]">
            <a href="#" className="transition-colors hover:text-white">Confidentialité</a>
            <a href="#" className="transition-colors hover:text-white">CGU</a>
            <a href="#" className="transition-colors hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </div>
  )
}
