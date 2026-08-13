-- Owner-controlled publication after staff approval.
-- Draft/review decisions remain staff-controlled; owners can only publish an
-- approved listing, pause their own live listing, or resume a still-valid one.

create or replace function public.sync_listing_compatibility_status()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status in ('submitted', 'in_review', 'approved', 'published', 'paused') then
    new.workflow_status := 'submitted';
    new.submitted_at := coalesce(new.submitted_at, now());
  elsif new.status in ('draft', 'changes_requested') then
    new.workflow_status := 'draft';
  else
    new.workflow_status := 'withdrawn';
  end if;

  if new.status = 'published' then
    new.published_at := coalesce(new.published_at, now());
  elsif new.status <> 'paused' then
    new.published_at := null;
  end if;
  return new;
end;
$$;

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
      when new.status in ('approved', 'published', 'paused') then 'approved'
      when new.status = 'changes_requested' then 'changes_requested'
      when new.status = 'rejected' then 'rejected'
      else 'pending'
    end,
    coalesce(new.review_note, ''),
    case when new.status in ('approved', 'published', 'paused', 'changes_requested', 'rejected') then now() else null end
  )
  on conflict (listing_id) do update set
    review_status = excluded.review_status,
    public_feedback = excluded.public_feedback,
    reviewed_at = case
      when new.status in ('published', 'paused')
        and public.listing_reviews.review_status = 'approved'
        then public.listing_reviews.reviewed_at
      else excluded.reviewed_at
    end,
    updated_at = now();
  return new;
end;
$$;

create or replace function public.set_owner_listing_publication(
  p_listing_id uuid,
  p_owner_id uuid,
  p_action text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  caller_owner uuid;
  caller_role text;
  current_status text;
  listing_review_status text;
  approved_photo_count integer;
  has_approved_cover boolean;
begin
  caller_owner := (select auth.uid());
  caller_role := current_setting('request.jwt.claim.role', true);
  if caller_owner is not null and caller_owner <> p_owner_id then
    raise exception 'Owner identity did not match';
  end if;
  if caller_owner is null and caller_role <> 'service_role' then
    raise exception 'Owner authentication is required';
  end if;

  if p_action not in ('publish', 'pause') then
    raise exception 'Unsupported publication action';
  end if;

  select l.status, r.review_status
  into current_status, listing_review_status
  from public.owner_listings l
  left join public.listing_reviews r on r.listing_id = l.id
  where l.id = p_listing_id
    and l.owner_id = p_owner_id
  for update of l;

  if current_status is null then
    raise exception 'Listing not found';
  end if;

  if p_action = 'pause' then
    if current_status <> 'published' then
      raise exception 'Only a live property can be paused';
    end if;

    update public.owner_listings
    set status = 'paused', updated_at = now()
    where id = p_listing_id
      and owner_id = p_owner_id;
    return;
  end if;

  if current_status not in ('approved', 'paused') then
    raise exception 'This property is not ready to publish';
  end if;

  if listing_review_status <> 'approved' then
    raise exception 'Staff approval is required before publication';
  end if;

  select
    count(*) filter (
      where p.status = 'approved' and pr.review_status = 'approved'
    ),
    coalesce(bool_or(
      p.status = 'approved'
      and pr.review_status = 'approved'
      and p.is_cover
    ), false)
  into approved_photo_count, has_approved_cover
  from public.listing_photos p
  join public.listing_photo_reviews pr on pr.photo_id = p.id
  where p.listing_id = p_listing_id;

  if approved_photo_count < 3 then
    raise exception 'At least three approved photos are required';
  end if;

  if not has_approved_cover then
    raise exception 'An approved cover photo is required';
  end if;

  update public.owner_listings
  set status = 'published', updated_at = now()
  where id = p_listing_id
    and owner_id = p_owner_id
    and status in ('approved', 'paused');

  if not found then
    raise exception 'Property publication state changed; refresh and try again';
  end if;
end;
$$;

revoke all on function public.set_owner_listing_publication(uuid, uuid, text) from public;
revoke all on function public.set_owner_listing_publication(uuid, uuid, text) from anon;
grant execute on function public.set_owner_listing_publication(uuid, uuid, text) to authenticated, service_role;

comment on function public.set_owner_listing_publication(uuid, uuid, text) is
  'Lets an authenticated owner publish only after staff and media approval, or pause/resume their own live listing.';
