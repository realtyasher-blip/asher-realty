create extension if not exists pgcrypto;

create table if not exists public.owner_profiles (
  id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  slug text not null unique default ('owner-' || left(replace(gen_random_uuid()::text, '-', ''), 16))
    check (slug ~ '^[a-z0-9][a-z0-9-]{2,62}$'),
  display_name text not null check (char_length(display_name) between 2 and 80),
  contact_email text check (
    contact_email is null or
    (char_length(contact_email) <= 160 and contact_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$')
  ),
  contact_phone text check (
    contact_phone is null or contact_phone ~ '^\+?[0-9][0-9 -]{7,18}$'
  ),
  role text not null default 'Owner' check (
    role in ('Owner', 'Power of attorney holder', 'Authorised representative')
  ),
  bio text not null default '' check (char_length(bio) <= 600),
  preferred_contact text not null default 'Phone or WhatsApp' check (
    preferred_contact in ('Phone or WhatsApp', 'Phone call', 'WhatsApp', 'Email')
  ),
  is_public boolean not null default false,
  show_name boolean not null default false,
  show_email boolean not null default false,
  show_phone boolean not null default false,
  contact_mode text not null default 'asher_managed' check (
    contact_mode in ('asher_managed', 'name_only', 'name_email', 'name_phone')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.owner_listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  intent text not null check (intent in ('Sell', 'Rent out')),
  owner_role text not null default 'Owner' check (
    owner_role in ('Owner', 'Power of attorney holder', 'Authorised representative')
  ),
  property_type text not null check (
    property_type in ('Apartment', 'Villa', 'Independent house', 'Residential plot', 'Commercial property')
  ),
  project_name text not null default '' check (char_length(project_name) <= 140),
  locality text not null check (char_length(locality) between 2 and 120),
  pincode text not null default '' check (pincode = '' or pincode ~ '^[1-9][0-9]{5}$'),
  configuration text not null check (
    configuration in ('Studio', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK', 'Plot / open space', 'Commercial unit')
  ),
  bathrooms text not null default '' check (bathrooms in ('', '1', '2', '3', '4+')),
  area_value text not null check (
    area_value ~ '^[0-9]{1,7}(\.[0-9]{1,2})?$' and
    area_value::numeric between 20 and 10000000
  ),
  area_basis text not null check (
    area_basis in ('Carpet area', 'Built-up area', 'Super built-up area', 'Plot area')
  ),
  furnishing text not null default '' check (
    furnishing in ('', 'Unfurnished', 'Semi-furnished', 'Fully furnished')
  ),
  floor text not null default '' check (floor = '' or floor ~ '^[0-9]{1,3}$'),
  total_floors text not null default '' check (total_floors = '' or total_floors ~ '^[0-9]{1,3}$'),
  parking text not null default '' check (
    parking in ('', 'No dedicated parking', '1 car', '2 cars', '3+ cars')
  ),
  property_age text not null default '' check (
    property_age in ('', 'Under construction', 'Less than 1 year', '1-5 years', '5-10 years', 'More than 10 years')
  ),
  expected_price text not null default '' check (char_length(expected_price) <= 80),
  monthly_rent text not null default '' check (char_length(monthly_rent) <= 80),
  maintenance text not null default '' check (char_length(maintenance) <= 80),
  deposit text not null default '' check (char_length(deposit) <= 80),
  available_from text not null default '' check (
    available_from = '' or available_from ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'
  ),
  occupancy text not null default '' check (
    occupancy in ('', 'Vacant', 'Owner occupied', 'Tenant occupied', 'Under construction')
  ),
  description text not null default '' check (char_length(description) <= 2000),
  contact_visibility text not null default 'agent_only' check (
    contact_visibility in ('agent_only', 'name_only', 'name_email', 'name_phone', 'name_email_phone')
  ),
  workflow_status text not null default 'draft' check (
    workflow_status in ('draft', 'submitted', 'withdrawn')
  ),
  submitted_at timestamptz,
  status text not null default 'draft' check (
    status in ('draft', 'submitted', 'in_review', 'changes_requested', 'approved', 'published', 'paused', 'rejected', 'archived')
  ),
  review_note text check (review_note is null or char_length(review_note) <= 1200),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (floor = '' or total_floors = '' or floor::integer <= total_floors::integer),
  check (
    (intent = 'Sell' and monthly_rent = '') or
    (intent = 'Rent out' and expected_price = '')
  )
);

create table if not exists public.listing_reviews (
  listing_id uuid primary key references public.owner_listings(id) on delete cascade,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'approved', 'changes_requested', 'rejected')
  ),
  public_feedback text not null default '' check (char_length(public_feedback) <= 1200),
  reviewed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.owner_listings(id) on delete cascade,
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  storage_path text not null unique check (char_length(storage_path) <= 300),
  label text not null default '' check (char_length(label) <= 80),
  alt_text text not null default '' check (char_length(alt_text) <= 180),
  sort_order smallint not null default 0 check (sort_order between 0 and 11),
  is_cover boolean not null default false,
  byte_size bigint check (byte_size between 1 and 8388608),
  mime_type text check (mime_type in ('image/jpeg', 'image/png', 'image/webp')),
  width integer check (width between 1 and 12000),
  height integer check (height between 1 and 12000),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text check (rejection_reason is null or char_length(rejection_reason) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.listing_photo_reviews (
  photo_id uuid primary key references public.listing_photos(id) on delete cascade,
  review_status text not null default 'pending' check (
    review_status in ('pending', 'approved', 'changes_requested', 'rejected')
  ),
  reviewed_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists owner_listings_owner_idx
  on public.owner_listings(owner_id, updated_at desc);
create index if not exists owner_listings_public_idx
  on public.owner_listings(workflow_status, submitted_at desc);
create index if not exists listing_photos_listing_idx
  on public.listing_photos(listing_id, sort_order, created_at);

create or replace function public.set_row_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists owner_profiles_set_updated_at on public.owner_profiles;
create trigger owner_profiles_set_updated_at
before update on public.owner_profiles
for each row execute function public.set_row_updated_at();

drop trigger if exists owner_listings_set_updated_at on public.owner_listings;
create trigger owner_listings_set_updated_at
before update on public.owner_listings
for each row execute function public.set_row_updated_at();

drop trigger if exists listing_reviews_set_updated_at on public.listing_reviews;
create trigger listing_reviews_set_updated_at
before update on public.listing_reviews
for each row execute function public.set_row_updated_at();

drop trigger if exists listing_photos_set_updated_at on public.listing_photos;
create trigger listing_photos_set_updated_at
before update on public.listing_photos
for each row execute function public.set_row_updated_at();

drop trigger if exists listing_photo_reviews_set_updated_at on public.listing_photo_reviews;
create trigger listing_photo_reviews_set_updated_at
before update on public.listing_photo_reviews
for each row execute function public.set_row_updated_at();

create or replace function public.sync_listing_compatibility_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status in ('submitted', 'in_review', 'approved', 'published') then
    new.workflow_status := 'submitted';
    new.submitted_at := coalesce(new.submitted_at, now());
  elsif new.status in ('draft', 'changes_requested') then
    new.workflow_status := 'draft';
  else
    new.workflow_status := 'withdrawn';
  end if;

  if new.status = 'published' then
    new.published_at := coalesce(new.published_at, now());
  elsif new.status <> 'published' then
    new.published_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists sync_listing_compatibility_before_write on public.owner_listings;
create trigger sync_listing_compatibility_before_write
before insert or update of status on public.owner_listings
for each row execute function public.sync_listing_compatibility_status();

create or replace function public.sync_listing_review_after_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.listing_reviews(listing_id, review_status, public_feedback, reviewed_at)
  values (
    new.id,
    case
      when new.status in ('approved', 'published') then 'approved'
      when new.status = 'changes_requested' then 'changes_requested'
      when new.status = 'rejected' then 'rejected'
      else 'pending'
    end,
    coalesce(new.review_note, ''),
    case when new.status in ('approved', 'published', 'changes_requested', 'rejected') then now() else null end
  )
  on conflict (listing_id) do update set
    review_status = excluded.review_status,
    public_feedback = excluded.public_feedback,
    reviewed_at = excluded.reviewed_at,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists sync_listing_review_after_write on public.owner_listings;
create trigger sync_listing_review_after_write
after insert or update of status, review_note on public.owner_listings
for each row execute function public.sync_listing_review_after_write();

create or replace function public.create_owner_profile_for_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  suggested_name text;
begin
  suggested_name := nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), '');
  insert into public.owner_profiles (
    id,
    slug,
    display_name,
    contact_email
  ) values (
    new.id,
    'owner-' || left(replace(new.id::text, '-', ''), 16),
    left(coalesce(suggested_name, 'Property owner'), 80),
    new.email
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists create_owner_profile_after_signup on auth.users;
create trigger create_owner_profile_after_signup
after insert on auth.users
for each row execute function public.create_owner_profile_for_auth_user();

-- The Auth project predates this feature, so also provision profiles for
-- verified or pending users who already existed before this trigger.
insert into public.owner_profiles (id, slug, display_name, contact_email)
select
  u.id,
  'owner-' || left(replace(u.id::text, '-', ''), 16),
  left(
    coalesce(
      nullif(trim(coalesce(u.raw_user_meta_data ->> 'full_name', '')), ''),
      'Property owner'
    ),
    80
  ),
  u.email
from auth.users u
on conflict (id) do nothing;

create or replace function public.validate_listing_photo()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  listing_owner uuid;
  existing_count integer;
  expected_prefix text;
begin
  select l.owner_id into listing_owner
  from public.owner_listings l
  where l.id = new.listing_id
  for update;

  if listing_owner is null or listing_owner <> new.owner_id then
    raise exception 'Photo owner does not own this listing';
  end if;

  expected_prefix := new.owner_id::text || '/' || new.listing_id::text || '/';
  if left(new.storage_path, char_length(expected_prefix)) <> expected_prefix then
    raise exception 'Invalid property media path';
  end if;

  select count(*) into existing_count
  from public.listing_photos p
  where p.listing_id = new.listing_id
    and p.id <> new.id;

  if existing_count >= 12 then
    raise exception 'A listing may have at most 12 photos';
  end if;

  return new;
end;
$$;

drop trigger if exists validate_listing_photo_before_write on public.listing_photos;
create trigger validate_listing_photo_before_write
before insert or update of listing_id, owner_id, storage_path on public.listing_photos
for each row execute function public.validate_listing_photo();

create or replace function public.create_photo_review()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.listing_photo_reviews(photo_id, review_status, reviewed_at)
  values (
    new.id,
    case when new.status = 'approved' then 'approved' when new.status = 'rejected' then 'rejected' else 'pending' end,
    case when new.status in ('approved', 'rejected') then now() else null end
  )
  on conflict (photo_id) do update set
    review_status = excluded.review_status,
    reviewed_at = excluded.reviewed_at,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists create_photo_review_after_insert on public.listing_photos;
create trigger create_photo_review_after_insert
after insert or update of status on public.listing_photos
for each row execute function public.create_photo_review();

create or replace function public.submit_owner_listing(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.owner_listings
  set workflow_status = 'submitted',
      status = 'submitted',
      submitted_at = now(),
      updated_at = now()
  where id = p_listing_id
    and owner_id = (select auth.uid())
    and workflow_status = 'draft';

  if not found then
    raise exception 'Listing not found or cannot be submitted';
  end if;

  insert into public.listing_reviews(listing_id, review_status, public_feedback, reviewed_at)
  values (p_listing_id, 'pending', '', null)
  on conflict (listing_id) do update
    set review_status = 'pending',
        public_feedback = '',
        reviewed_at = null,
        updated_at = now();
end;
$$;

create or replace function public.reopen_owner_listing(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.owner_listings l
  set workflow_status = 'draft', status = 'draft', updated_at = now()
  from public.listing_reviews r
  where l.id = p_listing_id
    and l.owner_id = (select auth.uid())
    and r.listing_id = l.id
    and r.review_status = 'changes_requested';

  if not found then
    raise exception 'Listing is not available for changes';
  end if;
end;
$$;

create or replace function public.withdraw_owner_listing(p_listing_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.owner_listings
  set workflow_status = 'withdrawn', status = 'archived', updated_at = now()
  where id = p_listing_id
    and owner_id = (select auth.uid())
    and workflow_status <> 'withdrawn';

  if not found then
    raise exception 'Listing not found or already withdrawn';
  end if;
end;
$$;

alter table public.owner_profiles enable row level security;
alter table public.owner_listings enable row level security;
alter table public.listing_reviews enable row level security;
alter table public.listing_photos enable row level security;
alter table public.listing_photo_reviews enable row level security;

drop policy if exists "Owners read own profile" on public.owner_profiles;
create policy "Owners read own profile" on public.owner_profiles
for select to authenticated
using (id = (select auth.uid()));

drop policy if exists "Owners insert own profile" on public.owner_profiles;
create policy "Owners insert own profile" on public.owner_profiles
for insert to authenticated
with check (id = (select auth.uid()));

drop policy if exists "Owners update own profile" on public.owner_profiles;
create policy "Owners update own profile" on public.owner_profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "Owners read own listings" on public.owner_listings;
create policy "Owners read own listings" on public.owner_listings
for select to authenticated
using (owner_id = (select auth.uid()));

drop policy if exists "Owners create draft listings" on public.owner_listings;
create policy "Owners create draft listings" on public.owner_listings
for insert to authenticated
with check (
  owner_id = (select auth.uid()) and
  workflow_status = 'draft' and
  submitted_at is null
);

drop policy if exists "Owners update own drafts" on public.owner_listings;
create policy "Owners update own drafts" on public.owner_listings
for update to authenticated
using (owner_id = (select auth.uid()) and workflow_status = 'draft')
with check (owner_id = (select auth.uid()) and workflow_status = 'draft');

drop policy if exists "Owners delete own drafts" on public.owner_listings;
create policy "Owners delete own drafts" on public.owner_listings
for delete to authenticated
using (owner_id = (select auth.uid()) and workflow_status in ('draft', 'withdrawn'));

drop policy if exists "Owners read own review result" on public.listing_reviews;
create policy "Owners read own review result" on public.listing_reviews
for select to authenticated
using (
  exists (
    select 1 from public.owner_listings l
    where l.id = listing_id and l.owner_id = (select auth.uid())
  )
);

drop policy if exists "Owners read own photo metadata" on public.listing_photos;
create policy "Owners read own photo metadata" on public.listing_photos
for select to authenticated
using (owner_id = (select auth.uid()));

drop policy if exists "Owners reserve own listing photos" on public.listing_photos;
create policy "Owners reserve own listing photos" on public.listing_photos
for insert to authenticated
with check (
  owner_id = (select auth.uid()) and
  exists (
    select 1 from public.owner_listings l
    where l.id = listing_id
      and l.owner_id = (select auth.uid())
      and l.workflow_status = 'draft'
  )
);

drop policy if exists "Owners update own photo captions" on public.listing_photos;
create policy "Owners update own photo captions" on public.listing_photos
for update to authenticated
using (
  owner_id = (select auth.uid()) and
  exists (
    select 1 from public.owner_listings l
    where l.id = listing_id
      and l.owner_id = (select auth.uid())
      and l.workflow_status = 'draft'
  )
)
with check (
  owner_id = (select auth.uid()) and
  exists (
    select 1 from public.owner_listings l
    where l.id = listing_id
      and l.owner_id = (select auth.uid())
      and l.workflow_status = 'draft'
  )
);

drop policy if exists "Owners delete own draft photos" on public.listing_photos;
create policy "Owners delete own draft photos" on public.listing_photos
for delete to authenticated
using (
  owner_id = (select auth.uid()) and
  exists (
    select 1 from public.owner_listings l
    where l.id = listing_id
      and l.owner_id = (select auth.uid())
      and l.workflow_status in ('draft', 'withdrawn')
  )
);

drop policy if exists "Owners read own photo review result" on public.listing_photo_reviews;
create policy "Owners read own photo review result" on public.listing_photo_reviews
for select to authenticated
using (
  exists (
    select 1 from public.listing_photos p
    where p.id = photo_id and p.owner_id = (select auth.uid())
  )
);

revoke all on public.owner_profiles from anon, authenticated;
revoke all on public.owner_listings from anon, authenticated;
revoke all on public.listing_reviews from anon, authenticated;
revoke all on public.listing_photos from anon, authenticated;
revoke all on public.listing_photo_reviews from anon, authenticated;

grant select on public.owner_profiles to authenticated;
grant insert (slug, display_name, contact_phone, role, bio, preferred_contact, is_public, show_name, show_email, show_phone, contact_mode)
  on public.owner_profiles to authenticated;
grant update (slug, display_name, contact_phone, role, bio, preferred_contact, is_public, show_name, show_email, show_phone, contact_mode)
  on public.owner_profiles to authenticated;

grant select on public.owner_listings to authenticated;
grant insert (
  intent, owner_role, property_type, project_name, locality, pincode,
  configuration, bathrooms, area_value, area_basis, furnishing, floor,
  total_floors, parking, property_age, expected_price, monthly_rent,
  maintenance, deposit, available_from, occupancy, description, contact_visibility
) on public.owner_listings to authenticated;
grant update (
  intent, owner_role, property_type, project_name, locality, pincode,
  configuration, bathrooms, area_value, area_basis, furnishing, floor,
  total_floors, parking, property_age, expected_price, monthly_rent,
  maintenance, deposit, available_from, occupancy, description, contact_visibility
) on public.owner_listings to authenticated;
grant delete on public.owner_listings to authenticated;

grant select on public.listing_reviews to authenticated;
grant select on public.listing_photos to authenticated;
grant insert (
  listing_id, storage_path, label, alt_text, sort_order, is_cover,
  byte_size, mime_type, width, height
) on public.listing_photos to authenticated;
grant update (label, alt_text, sort_order, is_cover) on public.listing_photos to authenticated;
grant delete on public.listing_photos to authenticated;
grant select on public.listing_photo_reviews to authenticated;

revoke all on function public.submit_owner_listing(uuid) from public;
revoke all on function public.reopen_owner_listing(uuid) from public;
revoke all on function public.withdraw_owner_listing(uuid) from public;
grant execute on function public.submit_owner_listing(uuid) to authenticated;
grant execute on function public.reopen_owner_listing(uuid) to authenticated;
grant execute on function public.withdraw_owner_listing(uuid) to authenticated;

create or replace function public.public_owner_display_name(full_name text)
returns text
language sql
immutable
strict
set search_path = ''
as $$
  select case
    when cleaned_name !~ '[[:space:]]' then cleaned_name
    else regexp_replace(
      cleaned_name,
      '^([^[:space:]]+).*[[:space:]]([^[:space:]])[^[:space:]]*$',
      E'\\1 \\2.'
    )
  end
  from (
    select regexp_replace(btrim(full_name), '[[:space:]]+', ' ', 'g') as cleaned_name
  ) normalized;
$$;

create or replace view public.public_owner_profiles
with (security_barrier = true)
as
select
  p.slug,
  case
    when p.show_name and p.contact_mode <> 'asher_managed'
      then public.public_owner_display_name(p.display_name)
    else 'Property contact via Asher'
  end as display_name,
  case
    when p.show_email and p.contact_mode = 'name_email'
      then p.contact_email
    else null
  end as contact_email,
  case
    when p.show_phone and p.contact_mode = 'name_phone'
      then p.contact_phone
    else null
  end as contact_phone,
  p.bio,
  p.created_at
from public.owner_profiles p
where p.is_public = true
  and exists (
    select 1
    from public.owner_listings l
    join public.listing_reviews r on r.listing_id = l.id
    where l.owner_id = p.id
      and l.status = 'published'
      and r.review_status = 'approved'
  );

create or replace view public.public_approved_owner_listings
with (security_barrier = true)
as
select
  l.id,
  l.intent,
  l.property_type,
  l.project_name,
  l.locality,
  l.pincode,
  l.configuration,
  l.bathrooms,
  l.area_value,
  l.area_basis,
  l.furnishing,
  l.floor,
  l.total_floors,
  l.parking,
  l.property_age,
  l.expected_price,
  l.monthly_rent,
  l.maintenance,
  l.deposit,
  l.available_from,
  l.occupancy,
  l.description,
  case when p.is_public then p.slug else null end as owner_slug,
  case
    when p.is_public and p.show_name and p.contact_mode <> 'asher_managed'
      then public.public_owner_display_name(p.display_name)
    else 'Property contact via Asher'
  end as contact_name,
  case
    when p.is_public and p.show_email and p.contact_mode = 'name_email'
      then p.contact_email
    else null
  end as contact_email,
  case
    when p.is_public and p.show_phone and p.contact_mode = 'name_phone'
      then p.contact_phone
    else null
  end as contact_phone,
  r.reviewed_at as approved_at,
  l.submitted_at
from public.owner_listings l
join public.owner_profiles p on p.id = l.owner_id
join public.listing_reviews r on r.listing_id = l.id
where l.status = 'published'
  and r.review_status = 'approved';

create or replace view public.public_approved_listing_photos
with (security_barrier = true)
as
select
  p.id,
  p.listing_id,
  p.alt_text,
  p.sort_order,
  p.is_cover,
  p.width,
  p.height,
  p.mime_type
from public.listing_photos p
join public.listing_photo_reviews pr on pr.photo_id = p.id
join public.owner_listings l on l.id = p.listing_id
join public.listing_reviews lr on lr.listing_id = l.id
where l.workflow_status = 'submitted'
  and lr.review_status = 'approved'
  and pr.review_status = 'approved'
  and p.status = 'approved'
  and l.status = 'published';

revoke all on public.public_owner_profiles from public;
revoke all on public.public_approved_owner_listings from public;
revoke all on public.public_approved_listing_photos from public;
grant select on public.public_owner_profiles to anon, authenticated;
grant select on public.public_approved_owner_listings to anon, authenticated;
grant select on public.public_approved_listing_photos to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'property-media',
  'property-media',
  false,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Owners upload reserved property media" on storage.objects;
create policy "Owners upload reserved property media" on storage.objects
for insert to authenticated
with check (
  bucket_id = 'property-media' and
  (storage.foldername(name))[1] = (select auth.uid())::text and
  exists (
    select 1
    from public.listing_photos p
    join public.owner_listings l on l.id = p.listing_id
    where p.storage_path = name
      and p.owner_id = (select auth.uid())
      and l.owner_id = (select auth.uid())
      and l.workflow_status = 'draft'
  )
);

drop policy if exists "Owners read own property media" on storage.objects;
create policy "Owners read own property media" on storage.objects
for select to authenticated
using (
  bucket_id = 'property-media' and
  owner_id = (select auth.uid())::text and
  exists (
    select 1 from public.listing_photos p
    where p.storage_path = name and p.owner_id = (select auth.uid())
  )
);

drop policy if exists "Owners delete own property media" on storage.objects;
create policy "Owners delete own property media" on storage.objects
for delete to authenticated
using (
  bucket_id = 'property-media' and
  owner_id = (select auth.uid())::text and
  exists (
    select 1
    from public.listing_photos p
    join public.owner_listings l on l.id = p.listing_id
    where p.storage_path = name
      and p.owner_id = (select auth.uid())
      and l.owner_id = (select auth.uid())
      and l.workflow_status in ('draft', 'withdrawn')
  )
);

comment on table public.owner_profiles is
  'Authenticated owner profiles. Public contact fields are opt-in and exposed only through safe views.';
comment on table public.owner_listings is
  'Owner-controlled listing drafts and submissions. Approval is stored separately so owners cannot self-approve.';
comment on table public.listing_photos is
  'Metadata reservations for private property-media objects. Identity/title documents and exact addresses are not accepted.';
