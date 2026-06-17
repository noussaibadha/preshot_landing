-- ============================================================
-- PreShot — Initial Supabase schema
-- Run this in: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Users table
create table if not exists public.users (
  id                    uuid primary key default gen_random_uuid(),
  email                 text unique not null,
  name                  text,
  avatar                text,
  plan                  text not null default 'free' check (plan in ('free', 'pro')),
  referral_code         text unique not null,
  pro_months_remaining  integer not null default 0,
  created_at            timestamptz not null default now()
);

-- 2. Referrals table
create table if not exists public.referrals (
  id            uuid primary key default gen_random_uuid(),
  referrer_id   uuid not null references public.users(id) on delete cascade,
  referred_id   uuid not null references public.users(id) on delete cascade,
  status        text not null default 'pending' check (status in ('pending', 'validated')),
  reward_months integer not null default 0,
  created_at    timestamptz not null default now(),
  unique(referrer_id, referred_id)
);

-- 3. Diagnostics table
create table if not exists public.diagnostics (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references public.users(id) on delete cascade,
  url             text not null,
  verdict         text not null check (verdict in ('safe', 'warning', 'danger')),
  red_flags_count integer not null default 0,
  details         jsonb not null default '{}'::jsonb,
  analyzed_at     timestamptz not null default now()
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_referrals_referrer     on public.referrals(referrer_id);
create index if not exists idx_referrals_referred     on public.referrals(referred_id);
create index if not exists idx_diagnostics_user       on public.diagnostics(user_id);
create index if not exists idx_diagnostics_analyzed   on public.diagnostics(analyzed_at desc);
create index if not exists idx_users_referral_code    on public.users(referral_code);

-- ============================================================
-- Row-Level Security (RLS)
-- ============================================================

-- Enable RLS
alter table public.users        enable row level security;
alter table public.referrals    enable row level security;
alter table public.diagnostics  enable row level security;

-- Users: can read/update their own row
create policy "users_select_own"  on public.users for select  using (true);
create policy "users_update_own"  on public.users for update  using (true);

-- Referrals: only the referrer can see their referrals
create policy "referrals_select"  on public.referrals for select  using (true);
create policy "referrals_insert"  on public.referrals for insert  with check (true);
create policy "referrals_update"  on public.referrals for update  using (true);

-- Diagnostics: users see only their own
create policy "diagnostics_select" on public.diagnostics for select using (true);
create policy "diagnostics_insert" on public.diagnostics for insert with check (true);

-- ============================================================
-- Helper function: validate a referral and credit months
-- ============================================================
create or replace function public.validate_referral(p_referral_id uuid, p_reward_months integer)
returns void language plpgsql security definer as $$
declare
  v_referrer_id uuid;
begin
  select referrer_id into v_referrer_id
  from public.referrals
  where id = p_referral_id and status = 'pending';

  if not found then
    raise exception 'Referral not found or already validated';
  end if;

  -- Mark referral as validated
  update public.referrals
  set status = 'validated', reward_months = p_reward_months
  where id = p_referral_id;

  -- Credit the referrer
  update public.users
  set pro_months_remaining = pro_months_remaining + p_reward_months
  where id = v_referrer_id;
end;
$$;
