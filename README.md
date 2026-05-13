# Simmer

Milestone 1 implementation for the core cooking loop:

- Clerk authentication
- Supabase-backed recipe posts
- Image upload to Supabase Storage
- Public newest-first feed
- Following feed and saved recipes
- Profile search and recipe search
- Post detail pages with ingredients and steps
- Logo, favicon, and PWA manifest metadata

## Environment variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Local development

```bash
npm install
npm run dev
```

Useful checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## Supabase setup

Run the SQL in `supabase/schema.sql`, then make sure the `recipe-photos` bucket exists and is public. Re-run the schema after pulling changes so the `saved_posts` table and database constraints exist before using saved recipes.
