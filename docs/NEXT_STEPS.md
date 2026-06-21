# Next Steps

## Done recently

- Supabase auth and persistent task storage
- Boards, lists and tasks
- Drag and drop with autoscroll
- Responsive sidebar
- Search, filters and labels
- PWA installation basics
- Backup/export/import and data management
- Active settings for theme, language, default view, sound effects and task count display
- Realtime sync v1
- Mobile touch and horizontal view polish
- Trash and archive management
- Recurring tasks v1
- Collapsible board header and hamburger/sidebar board actions
- Portfolio README and documentation polish
- GitHub Actions build check

## Recommended next packages

1. **Demo video or GIF**
   - Show task creation
   - Show editing and recurring tasks
   - Show drag and drop
   - Show realtime sync across devices
   - Use demo/anonymized data

2. **Task editor modal**
   - Open a centered modal when adding or editing tasks
   - Mobile: full-height app-like dialog
   - Desktop: compact centered dialog
   - Optional field selection for date, notes, priority, recurrence, labels and sensitive marker

3. **Automatic date recognition for day lists**
   - Detect titles such as `Dienstag, 26.05.2026`
   - Route tasks with matching dates into existing manual lists
   - Move very old open tasks into an `Offen` list if needed
   - Add a settings hint for supported date formats

4. **Realtime sync robustness**
   - More precise sync status
   - Debounced refreshes for bursts of realtime events
   - Reconnect indicator
   - Last synced timestamp

5. **Auth and offline improvements**
   - Optional custom SMTP for Magic Links
   - Offline sync with IndexedDB
   - Optional client-side encryption

## Portfolio checklist

- [ ] Confirm the live app link works.
- [ ] Confirm screenshots are anonymized.
- [ ] Add or record a short demo video/GIF.
- [ ] Confirm GitHub Actions build check passes after the latest push.
- [ ] Confirm `.env.local`, `.next`, `node_modules` and `.vercel` are not committed.
- [ ] Review README before making the repository public.
