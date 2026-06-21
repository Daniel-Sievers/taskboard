# Security

Taskboard is designed around authenticated private data and public frontend deployment.

## Frontend keys

The frontend uses public Supabase client keys only. Supabase service-role keys are not used in the app bundle and are not part of the repository.

## Row Level Security

Private task data is protected through Supabase Row Level Security. Policies restrict access to records owned by the authenticated user.

## Local secrets

Local environment values belong in `.env.local`, which is ignored by Git. The repository contains `.env.example` as a template only.

## Public demo

The public demo uses anonymized local data and does not write to Supabase. This keeps portfolio testing separate from private authenticated data.

## Known security boundaries

Optional client-side encryption for sensitive tasks is future work. Current protection relies on Supabase Auth, RLS and safe environment-variable handling.
