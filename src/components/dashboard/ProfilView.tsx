'use client'

import Image from 'next/image'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { User } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface Props {
  user: User
  session: Session
}

export function ProfilView({ user }: Props) {
   if (!user) return <div className="p-8 text-white/50">Chargement du profil...</div>
  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold mb-1">Mon profil</h1>
        <p className="text-white/50">Gérez vos informations et votre abonnement.</p>
      </div>

      {/* Profile card */}
      <div className="card flex items-center gap-6">
        <div className="relative">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name}
              width={80}
              height={80}
              className="rounded-2xl ring-2 ring-violet/30"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center text-2xl font-bold">
              {user.name?.[0] ?? 'U'}
            </div>
          )}
          <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 border-background ${user.plan === 'pro' ? 'bg-violet' : 'bg-zinc-600'}`}>
            {user.plan === 'pro' ? 'P' : 'F'}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold truncate">{user.name}</h2>
          <p className="text-white/50 text-sm">{user.email}</p>
          <p className="text-xs text-white/30 mt-1">
            Membre depuis {format(new Date(user.created_at), 'MMMM yyyy', { locale: fr })}
          </p>
        </div>
      </div>

      {/* Subscription */}
      <div className={`card ${user.plan === 'pro' ? 'border-violet/20 bg-gradient-card' : ''}`}>
        <h3 className="font-semibold mb-4">Abonnement actuel</h3>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-lg font-bold ${user.plan === 'pro' ? 'gradient-text' : 'text-white/60'}`}>
                {user.plan === 'pro' ? 'PreShot Pro' : 'PreShot Gratuit'}
              </span>
              {user.plan === 'pro' && (
                <span className="badge badge-validated">Actif</span>
              )}
            </div>
            {user.plan === 'pro' ? (
              <p className="text-sm text-white/50">
                {user.pro_months_remaining > 0
                  ? `${user.pro_months_remaining} mois restants`
                  : 'Abonnement actif'}
              </p>
            ) : (
              <p className="text-sm text-white/50">Passez Pro pour débloquer toutes les fonctionnalités</p>
            )}
          </div>
          {user.plan === 'free' && (
            <a href="/#pricing" className="btn-primary text-sm py-2 px-4">
              Passer Pro
            </a>
          )}
        </div>

        {user.plan === 'pro' && user.pro_months_remaining > 0 && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/40">Mois Pro restants</span>
              <span className="text-violet-light font-semibold">{user.pro_months_remaining}</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-hero rounded-full"
                style={{ width: `${Math.min((user.pro_months_remaining / 12) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Referral code */}
      {user.plan === 'pro' && (
        <div className="card">
          <h3 className="font-semibold mb-3">Code de parrainage</h3>
          <div className="flex items-center gap-3">
            <code className="flex-1 px-4 py-3 rounded-xl bg-black/30 text-violet-light font-mono text-sm border border-violet/20">
              preshot.app/ref/{user.referral_code}
            </code>
          </div>
        </div>
      )}

      {/* Account info */}
      <div className="card space-y-4">
        <h3 className="font-semibold">Informations du compte</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-white/30 mb-1">Nom</p>
            <p className="text-sm">{user.name}</p>
          </div>
          <div>
            <p className="text-xs text-white/30 mb-1">Email</p>
            <p className="text-sm">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-white/30 mb-1">Connexion via</p>
            <p className="text-sm flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </p>
          </div>
          <div>
            <p className="text-xs text-white/30 mb-1">Plan</p>
            <p className={`text-sm font-semibold ${user.plan === 'pro' ? 'text-violet-light' : 'text-white/60'}`}>
              {user.plan === 'pro' ? 'Pro' : 'Gratuit'}
            </p>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      <div className="card border-red-500/10">
        <h3 className="font-semibold text-red-400/80 mb-4">Zone danger</h3>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </div>
  )
}
