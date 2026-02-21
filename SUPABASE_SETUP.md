# Supabase Setup

## 1. Configure client keys (runtime config)
This repository does not commit Supabase URL/key values.

Create runtime config from environment variables:

```bash
cd /Users/atsushi/Develop/npo-sakura
SUPABASE_URL="https://<your-project-ref>.supabase.co" \
SUPABASE_ANON_KEY="<your-anon-key>" \
./scripts/generate-runtime-config.sh
```

This generates:
- `/assets/js/runtime-config.js` (gitignored)

Do not put `service_role` in frontend files.

## 2. Create tables and RLS
This public repository does not include DB schema SQL.

Apply your schema/RLS SQL from your private infrastructure repository (or run it manually in Supabase SQL Editor).

## 3. Create admin auth user
In Supabase dashboard:

1. `Authentication` -> `Users`
2. `Add user`
3. Create the same email as registered in `admin_users`

## 4. Verify pages

- Contact page: `/contact.html`
- Admin page: `/admin.html`

Expected behavior:

- Anyone can submit contact form.
- Only logged-in admin users (email listed in `admin_users`) can read contact history.

## 5. GitHub Pages deployment secrets
Set these repository secrets:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

`/Users/atsushi/Develop/npo-sakura/.github/workflows/deploy-pages.yml` generates `assets/js/runtime-config.js` during deployment using these secrets.

## 6. Edge Function deployment (email dispatcher)
The contact form only writes to `contacts`.
Email sending is handled by a separate Edge Function that reads unsent rows and sends via Resend.

Deploy from private infra repository:

1. `cd /Users/atsushi/Develop/supabase-infra/projects/npo-sakura`
2. Configure:
   - `.env.refs`
   - `.env.functions.test` and `.env.functions.prod`
3. Deploy:
   - `./scripts/deploy-function-test.sh`
   - `./scripts/deploy-function-prod.sh`
