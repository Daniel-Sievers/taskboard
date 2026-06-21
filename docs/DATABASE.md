# Database

Taskboard stores authenticated data in Supabase PostgreSQL. The schema is managed through SQL migrations in `supabase/migrations/`.

## Main entities

- `profiles`
- `boards`
- `lists`
- `tasks`
- `task_versions`

## Data model

A user owns boards. Boards contain lists. Lists contain tasks. Tasks store completion state, order, dates, labels, recurrence metadata and soft-delete fields.

## Row Level Security

Row Level Security is part of the project design. Policies restrict board, list and task access to the authenticated owner. The frontend only uses public Supabase client keys, so database isolation depends on RLS rather than hidden frontend credentials.

## Realtime

Realtime is enabled for the core board tables. The frontend subscribes to changes for the active board and refreshes data when remote updates arrive.

## Migrations

The migration set covers:

- initial schema
- RLS policies
- auth/profile helpers
- realtime publication setup
- recurring-task fields
