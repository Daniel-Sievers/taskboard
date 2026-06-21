# Public demo

Taskboard includes a public demo route so the project can be evaluated without Magic Link login.

## Route

```txt
/demo
```

The route redirects to:

```txt
/board?demo=1
```

## Data model

Demo mode uses local anonymized sample data. It does not write to Supabase and does not expose private boards.

## What the demo shows

- Board layout
- Task creation and editing
- Drag and drop
- Recurring tasks
- Filters and labels
- Settings and preference screens
- PWA/demo entry behavior

## What requires authenticated mode

Persistent boards, Supabase sync and full backup/import/restore workflows are designed for Magic Link users. The demo can show the interface and interaction model, but it intentionally does not treat local sample data as a durable backup source.

## Persistence

Demo changes can reset after reload or a new browser session. This keeps the demo safe for public testing and avoids storing reviewer changes in the production database.

## Purpose

The demo removes review friction from Magic Link delivery while the authenticated production data model remains private.
