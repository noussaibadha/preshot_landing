'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Diagnostic, Verdict } from '@/types'
import { format } from 'date-fns'
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
  danger: 'Dangereux',
}

const VERDICT_BADGE: Record<Verdict, string> = {
  safe: 'badge-safe',
  warning: 'badge-warning',
  danger: 'badge-danger',
}

function scoreColor(score: number) {
  if (score >= 80) return 'text-emerald-400'
  if (score >= 50) return 'text-amber-400'
  return 'text-red-400'
}

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

  // ── États de chargement / erreur ──────────────────────────────
  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold mb-1">Historique des diagnostics</h1>
          <p className="text-white/50">Tous les sites analysés par PreShot.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-10 bg-white/5 rounded-lg mb-2" />
              <div className="h-4 bg-white/5 rounded w-2/3 mx-auto" />
            </div>
          ))}
        </div>
        <div className="card animate-pulse h-64" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="card-gradient text-center py-16">
          <p className="text-red-400 font-semibold mb-2">Impossible de charger l&apos;historique</p>
          <p className="text-white/40 text-sm mb-6">{error}</p>
          <button onClick={fetchDiagnostics} className="btn-primary text-sm py-2 px-4">
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  // ── Vue principale ────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Historique des diagnostics</h1>
          <p className="text-white/50">
            20 analyses les plus récentes · score calculé sur 30 jours
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchDiagnostics}
            className="btn-outline text-sm py-2 px-3"
            title="Actualiser"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={exportCSV}
            className="btn-outline text-sm py-2 px-4"
            disabled={diagnostics.length === 0}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Exporter CSV
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className={`text-5xl font-extrabold mb-1 ${scoreColor(data!.securityScore)}`}>
            {data!.securityScore}
          </p>
          <p className="text-sm text-white/50">Score de sécurité</p>
          <p className="text-xs text-white/30 mt-1">30 derniers jours</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-extrabold gradient-text">{data!.totalCount}</p>
          <p className="text-sm text-white/50 mt-1">Sites analysés</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-extrabold text-red-400">{data!.dangerCount}</p>
          <p className="text-sm text-white/50 mt-1">Sites dangereux détectés</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-violet/20 text-violet-light border border-violet/30'
                : 'bg-white/5 text-white/50 border border-white/5 hover:border-white/10 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-white/30">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>Aucun diagnostic trouvé.</p>
            {diagnostics.length === 0 && (
              <p className="text-sm mt-1">Installez l&apos;extension et naviguez pour voir vos analyses ici.</p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/5">
                  <th className="pb-3 font-medium text-white/40">Site</th>
                  <th className="pb-3 font-medium text-white/40">Date</th>
                  <th className="pb-3 font-medium text-white/40">Verdict</th>
                  <th className="pb-3 font-medium text-white/40">Red flags</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((d) => (
                  <tr key={d.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pr-4 max-w-xs">
                      <p className="font-medium truncate" title={d.url}>{d.url}</p>
                    </td>
                    <td className="py-4 pr-4 text-white/50 whitespace-nowrap">
                      {format(new Date(d.analyzed_at), 'd MMM yyyy, HH:mm', { locale: fr })}
                    </td>
                    <td className="py-4 pr-4">
                      <span className={VERDICT_BADGE[d.verdict]}>
                        {VERDICT_LABELS[d.verdict]}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className={`font-semibold ${d.red_flags_count > 0 ? 'text-amber-400' : 'text-white/30'}`}>
                        {d.red_flags_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
