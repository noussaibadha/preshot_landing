# PreShot — Landing Page

> Savoir douter, Mieux naviguer.

Extension Chrome de détection de sites frauduleux. Ce dépôt contient la landing page marketing et le dashboard utilisateur.

**Stack :** Next.js 14 (App Router) · TypeScript · Tailwind CSS · NextAuth.js · Supabase

---

## Structure du projet

```
src/
├── app/
│   ├── page.tsx                        # Landing page (/)
│   ├── layout.tsx                      # Root layout + SessionProvider
│   ├── globals.css                     # Tailwind + variables globales
│   ├── api/auth/[...nextauth]/route.ts # NextAuth handler
│   └── dashboard/
│       ├── layout.tsx                  # Auth guard → redirect si non connecté
│       ├── parrainage/page.tsx         # Programme de parrainage
│       ├── historique/page.tsx         # Historique diagnostics
│       └── profil/page.tsx             # Profil utilisateur
├── components/
│   ├── AuthProvider.tsx
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── Features.tsx
│   ├── Pricing.tsx
│   ├── Footer.tsx
│   └── dashboard/
│       ├── DashboardNav.tsx
│       ├── ReferralDashboard.tsx
│       ├── HistoriqueDashboard.tsx
│       └── ProfilView.tsx
├── lib/
│   ├── auth.ts         # NextAuth config + création utilisateur Supabase
│   ├── supabase.ts     # Clients Supabase (public + service role)
│   └── referral.ts     # Logique paliers de parrainage
└── types/
    ├── index.ts        # Types métier
    └── next-auth.d.ts  # Augmentation Session NextAuth
supabase/
└── migrations/001_initial.sql  # Schéma complet + RLS + fonction validate_referral
```

---

## Installation

### 1. Prérequis

- Node.js 18+
- Un compte [Supabase](https://supabase.com)
- Un projet Google Cloud avec OAuth 2.0 configuré

### 2. Cloner et installer

```bash
git clone <ce-repo>
cd preshot_landing
npm install
```

### 3. Variables d'environnement

```bash
cp .env.local.example .env.local
```

Remplissez `.env.local` :

| Variable | Où la trouver |
|---|---|
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` en dev |
| `GOOGLE_CLIENT_ID` | [Google Cloud Console](https://console.cloud.google.com/) > APIs & Services > Identifiants |
| `GOOGLE_CLIENT_SECRET` | Idem |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API (service_role) |

### 4. Configurer Google OAuth

Dans [Google Cloud Console](https://console.cloud.google.com/) :
1. Créer un projet ou utiliser un existant
2. Activer l'API **Google+ API** ou **Google Identity**
3. Créer des identifiants OAuth 2.0 (Application Web)
4. Ajouter les URIs de redirection autorisées :
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://votre-domaine.com/api/auth/callback/google` (prod)

### 5. Créer le schéma Supabase

Dans **Supabase Dashboard > SQL Editor**, exécutez le contenu de :

```
supabase/migrations/001_initial.sql
```

Ce script crée :
- Table `users` (id, email, name, avatar, plan, referral_code, pro_months_remaining)
- Table `referrals` (id, referrer_id, referred_id, status, reward_months)
- Table `diagnostics` (id, user_id, url, verdict, red_flags_count, details, analyzed_at)
- Indexes de performance
- Politiques RLS (Row-Level Security)
- Fonction `validate_referral()` pour créditer les mois Pro

### 6. Lancer en développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

---

## Pages

| Route | Description | Auth requise |
|---|---|---|
| `/` | Landing page (Hero, Features, Pricing) | Non |
| `/dashboard/historique` | Historique des sites analysés + score sécurité | Oui |
| `/dashboard/parrainage` | Programme parrainage (Pro uniquement) | Oui (Pro) |
| `/dashboard/profil` | Profil Google + gestion abonnement | Oui |

---

## Logique de parrainage

| Parrainages validés | Récompense filleul |
|---|---|
| 1 | 3 mois Pro |
| 5 | 6 mois Pro |
| 10 | 12 mois Pro + badge Fondateur |

Le statut `pending` → `validated` se fait via la fonction SQL `validate_referral()` (à appeler depuis un webhook Stripe ou votre logique métier quand le filleul souscrit Pro).

---

## Déploiement (Vercel)

```bash
npm run build   # Vérifier la compilation
```

1. Pousser sur GitHub
2. Importer sur [Vercel](https://vercel.com)
3. Ajouter toutes les variables d'environnement
4. Mettre à jour `NEXTAUTH_URL` avec votre domaine Vercel
5. Ajouter l'URL de production dans Google Cloud Console

---

## Design tokens

| Token | Valeur |
|---|---|
| Fond | `#0a0a0a` |
| Surface | `#111111` |
| Surface-2 | `#1a1a1a` |
| Violet accent | `#7c3aed` |
| Bleu accent | `#3b82f6` |
| Dégradé hero | `violet → bleu` |
| Police | Inter (Google Fonts) |
# preshot_landing
