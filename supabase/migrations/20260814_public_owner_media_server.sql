-- Private media-path projection for server-side public listing rendering only.
-- The browser-facing safe photo view deliberately omits storage_path.

create or replace view public.public_approved_listing_media_server
with (security_barrier = true)
as
select
  p.id,
  p.listing_id,
  p.storage_path,
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
  and l.status = 'published'
  and lr.review_status = 'approved'
  and pr.review_status = 'approved'
  and p.status = 'approved';

revoke all on public.public_approved_listing_media_server from public;
revoke all on public.public_approved_listing_media_server from anon;
revoke all on public.public_approved_listing_media_server from authenticated;
grant select on public.public_approved_listing_media_server to service_role;

comment on view public.public_approved_listing_media_server is
  'Service-role-only approved media paths. Never grant this view to anon or authenticated roles.';
