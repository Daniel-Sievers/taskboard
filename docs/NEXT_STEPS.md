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
- Realtime sync v1
- Mobile touch and horizontal view polish
- Trash and archive management
- Recurring tasks v1
- Collapsible board header and hamburger/sidebar board actions

## Recommended next packages

1. **Portfolio / GitHub presentation polish**
   - Final README pass with clean screenshots
   - Explain why the app was built
   - Add architecture diagram
   - Add roadmap and known limits
   - Add final live demo link and deployment notes

2. **GitHub Actions build check**
   - Run `npm ci`
   - Run `npm run build`
   - Optionally run `npm run typecheck`

3. **Demo video or GIF**
   - Show task creation
   - Show editing and recurring tasks
   - Show drag and drop
   - Show realtime sync across devices
   - Use demo/anonymized data

4. **Task editor modal**
   - Open a centered modal when adding or editing tasks
   - Mobile: full-height app-like dialog
   - Desktop: compact centered dialog
   - Optional field selection for date, notes, priority, recurrence, labels and sensitive marker

5. **Automatic date recognition for day lists**
   - Detect titles such as `Dienstag, 26.05.2026`
   - Route tasks with matching dates into existing manual lists
   - Move very old open tasks into an `Offen` list if needed

6. **Realtime sync robustness**
   - More precise sync status
   - Debounced refreshes for bursts of realtime events
   - Reconnect indicator
   - Last synced timestamp

7. **Auth and offline improvements**
   - Optional custom SMTP for Magic Links
   - Offline sync with IndexedDB
   - Optional client-side encryption
