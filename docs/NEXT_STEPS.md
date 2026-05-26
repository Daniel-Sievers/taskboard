# Next Steps

## Done recently

- Supabase auth and persistent task storage
- Boards, lists and tasks
- Drag and drop with autoscroll
- Responsive sidebar
- Search, filters and labels
- PWA installation basics
- Backup/export/import and data management
- Active settings for theme, language, default view and task count display
- GitHub + Vercel deployment
- Realtime Sync v1 across devices
- Mobile touch drag improved with long-press behavior
- Dependency versions pinned for more reproducible builds

## Recommended next packages

1. **Horizontal/Kanban view polish**
   - Make the horizontal view visually closer to TasksBoard/Trello
   - Add horizontal drag and drop
   - Add horizontal autoscroll
   - Decide how list creation should work in horizontal mode

2. **Archive and trash views**
   - Show deleted tasks in a real trash view
   - Restore individual deleted tasks
   - Show archived boards
   - Restore archived boards
   - Keep permanent deletion behind clear confirmation

3. **Recurring tasks**
   - Daily, weekly and monthly repeats
   - Every X days
   - Weekdays only
   - Create the next occurrence after completion

4. **Realtime refinements**
   - More detailed sync status
   - Better error/reconnect handling
   - Debounce refreshes if many changes arrive quickly
   - Later: update only affected tasks/lists instead of refreshing the active board

5. **Offline sync**
   - IndexedDB cache
   - Offline mutation queue
   - Last-write-wins conflict strategy
   - Sync after reconnect

6. **Optional encryption**
   - Client-side encryption for selected sensitive tasks
   - Local passphrase/key handling
   - Clear UX around password loss and recovery limits
