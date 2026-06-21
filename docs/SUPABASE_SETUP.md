# Supabase setup

Taskboard uses Supabase for authentication, PostgreSQL persistence and realtime updates.

## Environment variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Older Supabase projects can also use:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Service-role keys are not used in the frontend.

## Database setup

The schema is stored as migrations in `supabase/migrations/`.

Migration scope:

- initial schema
- RLS policies
- auth/profile helpers
- realtime setup
- recurring-task fields

## Auth configuration

For local development and deployment, Supabase Auth redirect URLs include the local app and the Vercel deployment:

```txt
http://localhost:3000/**
https://taskboard-ten-steel.vercel.app/**
```

## Demo mode

The public `/demo` route does not require Supabase persistence. It uses local anonymized data while the authenticated app uses Supabase.
