# Taskboard

Private Taskboard-App mit Tageslisten, mehreren Boards, Supabase-Sync, Dark Mode und später Offline-Sync.

## Ziel

Dieses Projekt ist eine persönliche Alternative zu TasksBoard / Google Tasks Board. Der Fokus liegt auf einem schnellen, dunklen, synchronisierten Taskboard für mehrere Geräte, das sich wie eine installierbare App nutzen lässt.

## Aktueller Stand

- Supabase Auth per Magic Link funktioniert.
- Aufgaben, Listen und Boards werden online gespeichert.
- Mehrere Boards können erstellt, gewechselt, umbenannt und archiviert werden.
- Tageslisten können erstellt, umbenannt, gelöscht und per Drag & Drop sortiert werden.
- Tasks können erstellt, bearbeitet, abgehakt, gelöscht und per Drag & Drop sortiert werden.
- Drag & Drop basiert auf `@dnd-kit` und unterstützt Auto-Scroll beim Verschieben ganzer Listen.
- Speicheranzeige und sensible Markierung sind vorbereitet.
- Suche, Filter, Labels und Heute-fällig-Ansicht sind eingebaut.
- PWA-Basis ist vorbereitet: Manifest, Icons, Start direkt auf `/board`, installierbarer App-Modus.
- Backup/Export/Import und manuelle Datenverwaltung sind eingebaut.
- App-Einstellungen für Design, Sprache, Wochenstart, Standardansicht und Aufgabenanzahl sind aktiv.

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase Auth + Database
- @dnd-kit für Drag & Drop
- Vercel Hosting, vorbereitet

## Lokales Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Unter Windows PowerShell:

```powershell
npm install
copy .env.example .env.local
npm run dev
```

Danach öffnen:

```txt
http://localhost:3000/board
```

## Environment Variables

In `.env.local` müssen deine Supabase-Werte stehen:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-publishable-key
```

Alternativ wird auch unterstützt:

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=dein-publishable-key
```

`.env.local` niemals auf GitHub committen.

## Dokumentation

Weitere Planung liegt im Ordner `docs/`:

- `docs/SUPABASE_SETUP.md`
- `docs/DRAG_AND_DROP.md`
- `docs/DEVELOPMENT_LOG.md`
- `docs/NEXT_STEPS.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/SECURITY.md`
- `docs/PWA_INSTALLATION.md`
- `docs/VERCEL_DEPLOYMENT.md`
- `docs/GITHUB_PORTFOLIO.md`

## Entwicklungsgeschichte

Die Entwicklung wird bewusst in Paketen dokumentiert. Siehe `docs/DEVELOPMENT_LOG.md` für die Story von Starter-Projekt über Supabase-Sync und Drag-&-Drop-Iterationen bis zu mehreren Boards.

## Nächste Pakete

1. GitHub + Vercel Deployment
2. Horizontal-/Kanban-Ansicht ausbauen
3. Realtime-Sync zwischen Geräten
4. Offline-Sync
5. optionale clientseitige Verschlüsselung

### Datenhoheit

Die App enthält inzwischen JSON-Backup, CSV-Export, JSON-Import, Papierkorb-Leeren und endgültiges Löschen archivierter Boards. Das reduziert Abhängigkeit vom Anbieter und macht die privaten Daten leichter portierbar.


## Deployment

Die App ist für Vercel vorbereitet. Vercel hostet nur die App; die Daten liegen weiterhin in Supabase. Siehe `docs/VERCEL_DEPLOYMENT.md`.

Für GitHub ist wichtig: `.env.local`, `.next` und `node_modules` nicht committen. Nur `.env.example` gehört ins Repository.
