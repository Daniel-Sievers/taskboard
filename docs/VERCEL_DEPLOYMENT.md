# Vercel deployment

Taskboard is deployed with Vercel. Supabase remains responsible for authentication, database storage and realtime updates.

## Deployment model

```txt
GitHub repository -> Vercel build/deploy -> Next.js app
Supabase project  -> Auth, Postgres, Realtime
```

Vercel does not store task data. Authenticated board data stays in Supabase.

## Build settings

Framework preset:

```txt
Next.js
```

Common commands:

```bash
npm ci
npm run build
```

## Environment variables

Production variables in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
NEXT_PUBLIC_SITE_URL=https://taskboard-ten-steel.vercel.app
```

Older Supabase key naming is also supported:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Service-role keys are not used in the frontend and do not belong in `NEXT_PUBLIC_` variables.

## Supabase Auth redirects

Supabase Auth is configured with the deployed Vercel URL and local development URL:

```txt
https://taskboard-ten-steel.vercel.app/**
http://localhost:3000/**
```

## Validation after deploy

The deployment is considered healthy when:

- `/demo` opens without login
- `/login` detects Supabase configuration
- Magic Link redirects back to the deployed app
- authenticated board data persists after reload
- GitHub Actions and Vercel builds are green

## PWA behavior

The app runs over HTTPS on Vercel, which is required for installable PWA behavior. Browser-specific install prompts and icon behavior can vary by platform.
