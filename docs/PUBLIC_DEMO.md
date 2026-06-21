# Public Demo Access

Taskboard includes a public demo route for GitHub visitors and portfolio reviewers:

```txt
/demo
```

On the live deployment this is:

```txt
https://taskboard-ten-steel.vercel.app/demo
```

The route redirects to `/board?demo=1` and forces the board into demo mode even if Supabase is configured.

## What demo mode does

- Shows an anonymized demo board without Magic Link login
- Uses local in-memory demo data
- Allows basic interaction: create, edit, complete and delete tasks
- Allows drag and drop between day lists
- Shows recurring-task behavior with a sample weekly task
- Keeps private Supabase boards behind authentication

## What demo mode does not do

- It does not save changes to Supabase.
- It does not show private user boards.
- It does not require a shared demo account.
- It is not intended for long-term persistence.

Changes can reset after reload or a new browser session. This is intentional so reviewers can test the app without touching real data.

## Why this is useful for the portfolio

A reviewer can open the GitHub README, click the live demo link and immediately test the app. This avoids friction from Magic Link delivery limits and keeps the private production data model intact.
