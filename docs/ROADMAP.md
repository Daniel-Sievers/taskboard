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
- Public demo access without login
- Task create/edit modal with centered overlay and optional fields
- Automatic date recognition for manual list titles
- PWA and GitHub demo-link polish
- Notification settings preparation

## Next

### 1. GitHub portfolio final check

- Set the GitHub About website link to `/demo` manually
- Replace/anonymize screenshots
- Confirm GitHub Actions is green
- Confirm Vercel demo and login app both work

### 2. Real push notifications

- Add Web Push subscription handling
- Persist push subscriptions per authenticated user
- Define reminder rules for due/overdue tasks
- Add a secure server-side send path
- Keep unsubscribe/privacy behavior visible

### 3. Realtime robustness

- More precise sync status
- Debounced refreshes for bursts of realtime events
- Reconnect indicator
- Last synced timestamp

### 4. Auth improvements

- Evaluate custom SMTP for Magic Links
- Keep Google Login optional, not required
- Improve login copy and mobile auth flow

### 5. Offline sync

- IndexedDB cache
- Offline mutation queue
- Reconnect sync
- Simple conflict strategy

### 6. Security and privacy

- Optional client-side encryption for sensitive tasks
- Stronger backup/restore safety

### Optional demo assets

- Record short demo video/GIF if the README should show a preview without opening the live demo
- Use anonymized demo data only
- Keep the clip short and focused on task creation, editing, drag & drop and settings

## Recurring task polish done

Wiederholende Aufgaben sind jetzt verständlicher sichtbar: Taskkarten zeigen Regel und Status, das Modal kann Wiederholungen stoppen, und doppelte Folgekopien werden vermieden.

Weitere mögliche Wiederholungs-Ausbaustufen bleiben bewusst Roadmap-Themen:

- bestimmte Wochentage
- Enddatum / Anzahl Wiederholungen
- echte Serien-ID für Bulk-Bearbeitung
- Erinnerungen pro Wiederholung
