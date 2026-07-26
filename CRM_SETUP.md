# Asher Realty CRM activation

The website already contains the lead API, site-visit flow and protected CRM.
Activation requires one Supabase project and four server-only Vercel variables.

## 1. Create the database

1. Create a Supabase project.
2. Open its SQL Editor.
3. Run `supabase/schema.sql` from this repository.

Row Level Security is enabled without public policies. The browser never receives
the service-role key.

## 2. Add Vercel environment variables

Add these to Production, Preview and Development:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRM_ADMIN_PASSWORD`
- `CRM_SESSION_SECRET`

Use a unique admin password and a random session secret of at least 32 characters.
Redeploy after saving the variables.

## 3. Verify

1. Submit a test enquiry or site-visit request.
2. Open `/crm`.
3. Sign in with `CRM_ADMIN_PASSWORD`.
4. Confirm the test lead appears.
5. Update its stage, follow-up time and notes.

The CRM route is excluded from search indexing. Authentication uses a signed,
HTTP-only, same-site cookie with a 12-hour session.

