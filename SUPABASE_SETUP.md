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

## 3. Verify pages

- Contact page: `/contact.html`

Expected behavior:

- Anyone can submit contact form.
- Public clients cannot read contact history. Inquiries arrive by notification email, and stored rows can be viewed in the Supabase dashboard.

## 4. GitHub Pages deployment secrets
Set these repository secrets:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

`/Users/atsushi/Develop/npo-sakura/.github/workflows/deploy-pages.yml` generates `assets/js/runtime-config.js` during deployment using these secrets.

## 5. Edge Function deployment (email dispatcher)
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

## 6. Scheduled email dispatch (GitHub Actions)
`/Users/atsushi/Develop/npo-sakura/.github/workflows/dispatch-contact-email.yml` runs every 10 minutes and triggers the production dispatcher function.

Set these repository or environment secrets:
- `SUPABASE_PROD_PROJECT_REF`
- `CONTACT_PROCESSOR_TOKEN`

You can also run it manually from GitHub Actions (`workflow_dispatch`).

GitHub disables scheduled workflows after 60 days without repository activity. If that happens, the production Supabase project stops receiving requests and is eventually paused (free plan), which breaks the contact form. `.github/workflows/keepalive-workflows.yml` runs monthly and re-enables the scheduled workflows to prevent this.
