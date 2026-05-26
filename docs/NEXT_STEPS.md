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
- GitHub + Vercel deployment
- Realtime sync v1, tested online between desktop and mobile
- Mobile touch drag improved with long-press behavior
- Horizontal view changed to swipeable list columns
- Dependency versions pinned for more reproducible builds

## Recommended next packages

1. **Horizontal/Kanban view polish**
   - Improve horizontal drag and drop behavior further
   - Add clearer drop indicators between horizontal columns
   - Tune mobile snap behavior and column widths
   - Decide whether horizontal view should become the default on mobile

2. **Archive and trash management**
   - Add a dedicated trash view
   - Restore deleted tasks
   - Show archived boards
   - Restore archived boards
   - Make permanent deletion clearer

3. **Recurring tasks**
   - Daily, weekly, monthly recurrence
   - Every X days
   - Weekdays only
   - Generate next occurrence after completion

4. **Realtime sync hardening**
   - More precise sync status
   - Better reconnect/error states
   - Debounce board refreshes after rapid events
   - Later: update affected items without full board reload

5. **Offline sync**
   - IndexedDB cache
   - Offline mutation queue
   - Last-write-wins conflict strategy
   - Reconnect sync

6. **Optional encryption**
   - Client-side encryption for selected sensitive tasks
   - Local password/key flow
   - Clear warning that lost keys cannot be recovered
