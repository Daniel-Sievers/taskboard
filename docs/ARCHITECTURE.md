# Architecture

## Überblick

Die App besteht aus:

- Next.js Frontend
- Supabase als Backend
- Vercel als Hosting
- später IndexedDB für Offline-Sync

## Prinzip

UI-Komponenten rufen nicht direkt Supabase auf.  
Datenbankzugriffe werden in `lib/db/` gekapselt.

Beispiel:

```txt
components/board/TaskCard.tsx
  -> hooks/useTasks.ts
    -> lib/db/tasks.ts
      -> lib/supabase/client.ts
```

So bleibt ein späterer Anbieterwechsel einfacher.
