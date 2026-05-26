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
- GitHub and Vercel deployment
- Supabase Realtime sync v1
- Mobile touch drag improvements
- Horizontal/swipe view polish
- Trash and archive management

## Recommended next packages

1. **Wiederholende Aufgaben**
   - täglich / wöchentlich / monatlich
   - alle X Tage
   - Werktage
   - nach Erledigung automatisch neu erzeugen
   - UI im Task-Editor ergänzen

2. **Realtime sync robustness**
   - Sync status more precise
   - Better reconnect and error states
   - Debounce refreshes after multiple events
   - Avoid unnecessary reloads where possible

3. **Offline sync**
   - IndexedDB cache
   - Offline mutation queue
   - Last-write-wins conflict strategy
   - Reconnect sync

4. **Optional auth improvements**
   - Google login
   - Custom SMTP for Magic Links
   - Better login rate-limit handling

5. **Optional encryption**
   - Client-side encryption for selected sensitive tasks
   - Local passphrase/key flow
   - Clear UX for encrypted content

## Current focus

The next practical feature package is likely **recurring tasks**, because it adds everyday value after the core board, sync, mobile and data-management features are in place.
