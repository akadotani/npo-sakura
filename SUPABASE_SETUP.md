# Supabase Setup

## 1. Configure client keys
Edit `/assets/js/supabase-config.js` and set:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

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
