# Next Steps

## Done recently

- Supabase auth and persistent task storage
- Boards, lists and tasks
- Drag and drop with autoscroll
- Responsive sidebar
- Search, filters and labels
- PWA installation basics
- Backup/export/import and data management
- Active settings for theme, default view and task count display

## Recommended next packages

1. **GitHub + Vercel deployment**
   - Create/clean GitHub repo
   - Improve README for portfolio use
   - Add screenshots
   - Connect Vercel
   - Add environment variables
   - Configure Supabase redirect URLs
   - Test on phone and second laptop

2. **Horizontal/Kanban view polish**
   - Make the horizontal view visually closer to TasksBoard/Trello
   - Decide which view should support drag and drop first
   - Store preferred view more consistently per user/device

3. **Realtime sync**
   - Subscribe to Supabase changes
   - Update open devices live
   - Add visible sync status

4. **Offline sync**
   - IndexedDB cache
   - Offline mutation queue
   - Last-write-wins conflict strategy

5. **Optional encryption**
   - Client-side encryption for selected sensitive tasks


## Nächster Fokus

1. GitHub-Repository erstellen und ersten Commit pushen.
2. Vercel-Projekt mit GitHub verbinden.
3. Supabase Environment Variables in Vercel setzen.
4. Supabase Redirect URLs für die Vercel-Domain ergänzen.
5. Online-Test auf Laptop und Handy.
6. Danach Horizontal-/Kanban-Ansicht ausbauen.


## Internationalisierung und Wochenstart

- UI-Übersetzungsschicht für Deutsch/Englisch ergänzt.
- Task-/Board-/Listen-Inhalte bleiben unverändert und werden nicht automatisch übersetzt.
- Wochentag-Auswahl für „Woche beginnt am“ auf alle sieben Tage erweitert.
- Neue Doku: `docs/I18N.md`.


## Realtime Sync

- Added Supabase Realtime subscription for boards, lists and tasks.
- Added a Live-Sync status pill to the board header.
- Added `supabase/migrations/0004_enable_realtime.sql`.
- Added `docs/REALTIME_SYNC.md`.
