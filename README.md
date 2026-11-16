# SecureCert

End-to-end sovereign credential platform: Next.js App Router frontend + Supabase (Auth, Postgres, RLS). UI screens are ported from Google Stitch wireframes and wired to the routing / role map.

## Quick start (demo mode)

```bash
cd securecert
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No Supabase keys required for UI + demo verify/onboarding.

### Demo accounts (password `demo1234`)

| Role | Email |
|------|--------|
| Institution Registrar | `registrar@unilag.edu.ng` |
| Partner | `ops@edusoft.ng` |
| Verifier | `consular@wes.org` |
| Student | `babatunde@student.unilag.edu.ng` |
| Super Admin | `root@securecert.ng` |

Use **/login** or the floating **Demo session** role switcher.

Try public verify with matric `180407044`.

## Supabase (production / shared backend)

1. Create a Supabase project.
2. Copy `.env.example` → `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. In the SQL editor, run `supabase/schema.sql`.
4. Create matching auth users (same emails) and set `raw_user_meta_data.role` / link `profiles.tenant_id`.

## Scripts

- `npm run dev` — local server
- `npm run build` — production build
- `npm run convert:stitch` — re-import Stitch `code.html` screens into `src/content/screens` + App Router pages

## Route map

Public: `/` `/architecture` `/developers` `/verify` `/wholesale` `/partners` `/onboarding`  
Institution: `/institution/*`  
Partner: `/partner/*`  
Admin: `/admin/*`  
Verifier: `/verifier`  
Passport: `/passport/*`  
Auth: `/login`
