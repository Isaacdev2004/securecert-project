-- SecureCert Supabase schema (run in Supabase SQL editor)

create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'INSTITUTION',
  'PARTNER',
  'VERIFIER',
  'STUDENT',
  'SUPER_ADMIN'
);

create type public.credential_status as enum (
  'DRAFT',
  'PENDING_SIGNATURE',
  'ISSUED',
  'REVOKED',
  'SUSPENDED'
);

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role public.app_role not null default 'STUDENT',
  tenant_id uuid,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tenants (institutions & partners)
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  kind text not null check (kind in ('INSTITUTION', 'PARTNER', 'PLATFORM')),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'SUSPENDED', 'PENDING')),
  branding jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.profiles
  drop constraint if exists profiles_tenant_id_fkey;

alter table public.profiles
  add constraint profiles_tenant_id_fkey
  foreign key (tenant_id) references public.tenants (id) on delete set null;

-- Recipients / students
create table if not exists public.recipients (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  user_id uuid references public.profiles (id) on delete set null,
  matric_number text,
  full_name text not null,
  email text,
  program text,
  graduation_year int,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists recipients_tenant_idx on public.recipients (tenant_id);
create index if not exists recipients_matric_idx on public.recipients (matric_number);

-- Credentials (W3C VC payload + Merkle binding)
create table if not exists public.credentials (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  recipient_id uuid references public.recipients (id) on delete set null,
  did text unique,
  status public.credential_status not null default 'DRAFT',
  credential_type text not null default 'UniversityDegreeCredential',
  title text not null,
  payload jsonb not null default '{}'::jsonb,
  merkle_root text,
  merkle_proof jsonb,
  signature text,
  issued_at timestamptz,
  revoked_at timestamptz,
  revoke_reason text,
  created_at timestamptz not null default now()
);

create index if not exists credentials_tenant_idx on public.credentials (tenant_id);
create index if not exists credentials_did_idx on public.credentials (did);
create index if not exists credentials_status_idx on public.credentials (status);

-- Verification events (public + embassy desk)
create table if not exists public.verification_events (
  id uuid primary key default gen_random_uuid(),
  credential_id uuid references public.credentials (id) on delete set null,
  did_or_nonce text,
  verifier_label text,
  result text not null check (result in ('VALID', 'INVALID', 'REVOKED', 'NOT_FOUND')),
  ip_hash text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Share links (selective disclosure / passport QR)
create table if not exists public.share_links (
  id uuid primary key default gen_random_uuid(),
  credential_id uuid not null references public.credentials (id) on delete cascade,
  token text unique not null default encode(gen_random_bytes(24), 'hex'),
  revealed_fields text[] not null default '{}',
  expires_at timestamptz,
  revoked_at timestamptz,
  max_views int default 1,
  view_count int not null default 0,
  created_at timestamptz not null default now()
);

-- Partner API keys
create table if not exists public.api_keys (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null,
  scopes text[] not null default '{}',
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

-- Webhooks
create table if not exists public.webhooks (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants (id) on delete cascade,
  url text not null,
  events text[] not null default '{}',
  secret text not null default encode(gen_random_bytes(16), 'hex'),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Onboarding inquiries
create table if not exists public.onboarding_requests (
  id uuid primary key default gen_random_uuid(),
  organization_name text not null,
  contact_name text,
  contact_email text not null,
  persona text,
  notes text,
  preferred_tier text,
  status text not null default 'NEW',
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::public.app_role, 'STUDENT')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.tenants enable row level security;
alter table public.recipients enable row level security;
alter table public.credentials enable row level security;
alter table public.verification_events enable row level security;
alter table public.share_links enable row level security;
alter table public.api_keys enable row level security;
alter table public.webhooks enable row level security;
alter table public.onboarding_requests enable row level security;

create or replace function public.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Profiles: users read/update self; super admin read all
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (
    id = auth.uid() or public.current_role() = 'SUPER_ADMIN'
  );

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.current_role() = 'SUPER_ADMIN');

-- Public verify: anyone can insert verification events; issued credentials readable by anon for verify
create policy "credentials_public_issued_read" on public.credentials
  for select using (
    status = 'ISSUED'
    or tenant_id in (select tenant_id from public.profiles where id = auth.uid())
    or public.current_role() in ('SUPER_ADMIN', 'VERIFIER')
  );

create policy "verification_events_insert_anyone" on public.verification_events
  for insert with check (true);

create policy "verification_events_read_staff" on public.verification_events
  for select using (
    public.current_role() in ('INSTITUTION', 'VERIFIER', 'SUPER_ADMIN', 'PARTNER')
    or auth.uid() is not null
  );

create policy "onboarding_insert_anyone" on public.onboarding_requests
  for insert with check (true);

create policy "onboarding_read_admin" on public.onboarding_requests
  for select using (public.current_role() = 'SUPER_ADMIN');

-- Tenant-scoped read for staff
create policy "tenants_read" on public.tenants
  for select using (
    public.current_role() = 'SUPER_ADMIN'
    or id in (select tenant_id from public.profiles where id = auth.uid())
  );

create policy "recipients_tenant_rw" on public.recipients
  for all using (
    public.current_role() = 'SUPER_ADMIN'
    or tenant_id in (select tenant_id from public.profiles where id = auth.uid())
  );

create policy "credentials_tenant_write" on public.credentials
  for insert with check (
    public.current_role() in ('INSTITUTION', 'SUPER_ADMIN', 'PARTNER')
    and (
      public.current_role() = 'SUPER_ADMIN'
      or tenant_id in (select tenant_id from public.profiles where id = auth.uid())
    )
  );

create policy "credentials_tenant_update" on public.credentials
  for update using (
    public.current_role() = 'SUPER_ADMIN'
    or tenant_id in (select tenant_id from public.profiles where id = auth.uid())
  );

create policy "api_keys_tenant" on public.api_keys
  for all using (
    public.current_role() = 'SUPER_ADMIN'
    or tenant_id in (select tenant_id from public.profiles where id = auth.uid())
  );

create policy "webhooks_tenant" on public.webhooks
  for all using (
    public.current_role() = 'SUPER_ADMIN'
    or tenant_id in (select tenant_id from public.profiles where id = auth.uid())
  );

create policy "share_links_owner" on public.share_links
  for all using (
    public.current_role() = 'SUPER_ADMIN'
    or credential_id in (
      select c.id from public.credentials c
      join public.recipients r on r.id = c.recipient_id
      where r.user_id = auth.uid()
         or c.tenant_id in (select tenant_id from public.profiles where id = auth.uid())
    )
  );

-- Demo seed tenants (run after creating auth users separately)
insert into public.tenants (id, name, slug, kind, status)
values
  ('11111111-1111-1111-1111-111111111111', 'University of Lagos', 'unilag', 'INSTITUTION', 'ACTIVE'),
  ('22222222-2222-2222-2222-222222222222', 'EduSoft SIS Partner', 'edusoft', 'PARTNER', 'ACTIVE'),
  ('33333333-3333-3333-3333-333333333333', 'SecureCert Platform', 'securecert', 'PLATFORM', 'ACTIVE')
on conflict (slug) do nothing;
