create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  source text not null default 'website',
  project text,
  budget text,
  location text,
  configuration text,
  purpose text,
  timeline text,
  preferred_visit_date date,
  preferred_visit_time text,
  transport text,
  status text not null default 'New' check (
    status in (
      'New', 'Contacted', 'Qualified', 'Site visit scheduled',
      'Site visit completed', 'Negotiation', 'Booked',
      'Follow up later', 'Not interested'
    )
  ),
  follow_up_at timestamptz,
  notes text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_follow_up_idx on public.leads (follow_up_at);

alter table public.leads enable row level security;

comment on table public.leads is
  'Asher Realty enquiries. Accessed only by server-side service-role requests.';

