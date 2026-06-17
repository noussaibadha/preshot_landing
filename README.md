# PreShot — Landing Page & Dashboard

**PreShot** est une extension Chrome qui analyse chaque site visité et détecte en temps réel les fraudes, dark patterns et tentatives de phishing. Ce dépôt contient la **landing page marketing** et le **dashboard utilisateur** associés à l'extension.

---

## Stack technique

| Technologie | Rôle |
|---|---|
| [Next.js 14](https://nextjs.org) (App Router) | Framework React — SSR + API Routes |
| [NextAuth.js](https://next-auth.js.org) | Authentification Google OAuth |
| [Supabase](https://supabase.com) | Base de données PostgreSQL + API REST |
| [Tailwind CSS](https://tailwindcss.com) | Styles utilitaires |
| [Vercel](https://vercel.com) | Hébergement et déploiement |

---

## Fonctionnalités

### Authentification
- Connexion via Google OAuth (NextAuth.js)
- Création automatique du compte utilisateur dans Supabase à la première connexion
- Session persistante via JWT

### Dashboard utilisateur
- **Historique des diagnostics** — liste des sites analysés par l'extension (URL, verdict, red flags, date), score de sécurité sur 30 jours, filtres, export CSV
- **Programme de parrainage** — code unique `PRESHOT-XXXXXXXX`, paliers de récompense (Silver à 3 parrainages, Gold à 6), 1 mois Pro offert par filleul validé
- **Profil** — informations du compte Google, abonnement actuel, mois Pro restants

### Plans
| | Gratuit | Pro |
|---|---|---|
| Détection fraudes | ✓ | ✓ |
| Historique (30 jours) | 7 jours | 30 jours |
| Export CSV | — | ✓ |
| Programme de parrainage | — | ✓ |
| Support prioritaire | — | ✓ |
| Prix | 0 € | 4,99 €/mois |

### Intégration extension Chrome
L'extension envoie ses diagnostics à `POST /api/diagnostics` après chaque analyse. Les données apparaissent immédiatement dans le dashboard de l'utilisateur connecté.

---

## Installation locale

```bash
git clone https://github.com/votre-org/preshot_landing.git
cd preshot_landing
npm install
cp .env.local.example .env.local
# Remplir les variables d'environnement (voir section ci-dessous)
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

---

## Variables d'environnement

Copier `.env.local.example` en `.env.local` et renseigner chaque variable :

| Variable | Description | Où la trouver |
|---|---|---|
| `NEXTAUTH_URL` | URL publique de l'application | `http://localhost:3000` en dev, URL Vercel en prod |
| `NEXTAUTH_SECRET` | Clé secrète pour signer les sessions | `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | ID client OAuth Google | [Google Cloud Console](https://console.cloud.google.com) › APIs & Services › Identifiants |
| `GOOGLE_CLIENT_SECRET` | Secret OAuth Google | Même page que ci-dessus |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Supabase Dashboard › Settings › API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase (anon) | Supabase Dashboard › Settings › API |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service Supabase — **ne jamais exposer côté client** | Supabase Dashboard › Settings › API |

### Configuration Google OAuth

Dans [Google Cloud Console](https://console.cloud.google.com) :

1. Créer un projet (ou en sélectionner un existant)
2. Activer l'API **Google Identity** / **People API**
3. Créer des identifiants OAuth 2.0 (type : Application Web)
4. Ajouter les URI de redirection autorisées :
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://votre-domaine.vercel.app/api/auth/callback/google` (prod)

---

## Configuration Supabase

Dans **Supabase Dashboard › SQL Editor**, exécuter le contenu de :

```
supabase/migrations/001_initial.sql
```

Ce script crée les trois tables, les index, les politiques RLS et la fonction `validate_referral()` :

```sql
-- Tables créées
users        (id, email, name, avatar, plan, referral_code, pro_months_remaining, created_at)
referrals    (id, referrer_id, referred_id, status, reward_months, created_at)
diagnostics  (id, user_id, url, verdict, red_flags_count, details, analyzed_at)
```

---

## Déploiement sur Vercel

1. Pousser le dépôt sur GitHub
2. Importer le projet sur [Vercel](https://vercel.com/new)
3. Dans **Settings › Environment Variables**, ajouter toutes les variables listées ci-dessus
4. Mettre à jour `NEXTAUTH_URL` avec l'URL Vercel attribuée (ex. `https://preshot-landing.vercel.app`)
5. Ajouter l'URL Vercel dans les URI de redirection Google Cloud Console
6. Déployer — Vercel détecte automatiquement Next.js

---

## Architecture du projet

```
src/
├── app/
│   ├── page.tsx                          # Landing page publique (/)
│   ├── layout.tsx                        # Layout racine + SessionProvider
│   ├── globals.css                       # Styles globaux Tailwind
│   │
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts   # Handler NextAuth (GET + POST)
│   │   ├── diagnostics/
│   │   │   ├── route.ts                  # POST — reçoit les diagnostics de l'extension
│   │   │   └── list/route.ts             # GET  — liste les diagnostics de l'utilisateur
│   │   └── referrals/
│   │       ├── apply/route.ts            # POST — applique un code de parrainage
│   │       └── list/route.ts             # GET  — liste les parrainages
│   │
│   ├── dashboard/
│   │   ├── layout.tsx                    # Auth guard — redirige vers / si non connecté
│   │   ├── historique/page.tsx           # Historique des diagnostics
│   │   ├── parrainage/page.tsx           # Programme de parrainage
│   │   └── profil/page.tsx              # Profil utilisateur
│   │
│   └── ref/[code]/
│       ├── page.tsx                      # Page d'invitation publique (/ref/PRESHOT-XXXX)
│       └── RefInviteClient.tsx           # Bouton OAuth + sauvegarde code en localStorage
│
├── components/
│   ├── AuthProvider.tsx                  # SessionProvider (client)
│   ├── Navbar.tsx                        # Navigation principale
│   ├── Hero.tsx                          # Section hero de la landing
│   ├── Features.tsx                      # Section fonctionnalités
│   ├── Pricing.tsx                       # Tableau comparatif des plans
│   ├── Footer.tsx                        # Pied de page
│   └── dashboard/
│       ├── DashboardNav.tsx              # Sidebar de navigation du dashboard
│       ├── HistoriqueDashboard.tsx       # Composant historique (client, fetch API)
│       ├── ReferralDashboard.tsx         # Composant parrainage (client, fetch API)
│       └── ProfilView.tsx               # Composant profil (client)
│
├── lib/
│   ├── auth.ts                           # Configuration NextAuth + création utilisateur Supabase
│   ├── supabase.ts                       # Clients Supabase (public lazy + service role)
│   └── referral.ts                       # Tiers, constantes et helpers parrainage
│
└── types/
    ├── index.ts                          # Types métier (User, Referral, Diagnostic…)
    └── next-auth.d.ts                    # Augmentation du type Session NextAuth

supabase/
└── migrations/
    └── 001_initial.sql                   # Schéma complet (tables, RLS, index, fonctions)
```

---

## Lien avec l'extension Chrome

L'extension appelle `POST /api/diagnostics` après chaque analyse de site. Le endpoint est ouvert aux requêtes cross-origin (headers CORS inclus) pour autoriser les appels depuis `chrome-extension://`.

### Corps de la requête

```json
{
  "email": "utilisateur@gmail.com",
  "url": "https://site-analyse.com",
  "verdict": "safe | warning | danger",
  "red_flags_count": 2,
  "details": { "redFlags": ["no_https", "recent_domain"] }
}
```

### Réponses

| Code | Signification |
|---|---|
| `200` | Diagnostic enregistré |
| `404` | Email inconnu — utilisateur non inscrit sur la landing |
| `422` | Champs manquants ou verdict invalide |
| `500` | Erreur serveur Supabase |

### Intégration dans l'extension

Dans `background/service_worker.js`, après chaque analyse complète, l'extension récupère l'email de l'utilisateur connecté via `chrome.identity` et envoie le diagnostic :

```js
async function preshot_sendDiagnostic(email, url, verdict, redFlagsCount, details) {
  await fetch('https://votre-domaine.vercel.app/api/diagnostics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, url, verdict, red_flags_count: redFlagsCount, details })
  })
}
```

Remplacer `http://localhost:3000` par l'URL Vercel de production avant de publier l'extension.

---

## Système de parrainage

Chaque utilisateur Pro dispose d'un code unique au format `PRESHOT-XXXXXXXX`.

| Parrainages validés | Badge | Récompense cumulée (parrain) |
|---|---|---|
| 1 | — | +1 mois Pro |
| 3 | Silver | +3 mois Pro |
| 6 | Gold | +6 mois Pro (plafond annuel) |

Le filleul reçoit **1 mois Pro** à chaque utilisation d'un code valide. Le parrain est plafonné à **6 parrainages validés par an**.

---

## Design tokens

| Token | Valeur |
|---|---|
| Fond | `#0a0a0a` |
| Surface | `#111111` |
| Violet accent | `#7c3aed` |
| Bleu accent | `#3b82f6` |
| Police | Inter (Google Fonts) |
