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
- Settings and data-management screens
- PWA/demo entry behavior

## Persistence

Demo changes can reset after reload or a new browser session. This keeps the demo safe for public testing.

## Purpose

The demo removes review friction from Magic Link delivery while the authenticated production data model remains private.
