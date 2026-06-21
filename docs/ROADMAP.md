# Roadmap

This roadmap is grouped into practical product packages.

## Done

- Next.js / TypeScript / Tailwind setup
- Supabase Auth with Magic Link
- Supabase data persistence
- Boards, lists and tasks
- Drag & drop with `@dnd-kit`
- Responsive sidebar and mobile drawer
- Search, filters and labels
- PWA basics
- Backup/export/import
- Active settings
- Realtime sync v1
- Mobile touch and horizontal view polish
- Trash and archive management
- Recurring tasks v1
- Collapsible board controls and sidebar actions
- GitHub/Vercel deployment
- Portfolio README polish

## Next

### 1. Demo assets

- Record short demo video/GIF
- Use anonymized demo data
- Show task creation, editing, drag & drop, recurring tasks and realtime sync

### 2. Task editor modal

- Open add/edit flow in a centered modal
- Mobile: full-height app-like dialog
- Desktop: compact centered modal
- Keep the flow fast for quick task creation
- Optional field selection for date, notes, priority, recurrence, labels and sensitive marker

### 3. Automatic date recognition

- Detect manual list titles such as `Dienstag, 26.05.2026`
- Route tasks with matching dates into existing manual lists
- Move very old open tasks into an `Offen` list if needed
- Add format hints in settings/documentation

### 4. Realtime robustness

- More precise sync status
- Debounced refreshes for bursts of realtime events
- Reconnect indicator
- Last synced timestamp

### 5. Auth improvements

- Evaluate custom SMTP for Magic Links
- Keep Google Login optional, not required
- Improve login copy and mobile auth flow

### 6. Offline sync

- IndexedDB cache
- Offline mutation queue
- Reconnect sync
- Simple conflict strategy

### 7. Security and privacy

- Optional client-side encryption for sensitive tasks
- Stronger backup/restore safety
- Better public-demo mode
