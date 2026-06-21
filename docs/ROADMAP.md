# Roadmap

The current project phase is final portfolio polish. The main product foundation is implemented; future work is grouped by product depth.

## Completed foundation

- Next.js / TypeScript / Tailwind setup
- Supabase Auth with Magic Link
- Supabase data persistence and RLS
- Boards, lists and tasks
- Drag & drop with `@dnd-kit`
- Responsive sidebar and mobile drawer
- Search, filters and labels
- PWA foundation
- Backup/export/import
- Settings and preferences
- Realtime sync v1
- Mobile touch and horizontal view polish
- Trash and archive management
- Recurring tasks v1
- Public demo access without login
- Automatic date recognition for manual list titles
- Notification settings preparation
- GitHub Actions and Vercel deployment

## Final portfolio polish

- Replace screenshots with anonymized demo screenshots
- Confirm the public demo and login deployment
- Confirm GitHub Actions build status
- Keep README, docs and deployment URL aligned

## Future product improvements

### Push reminders

- Web Push subscriptions
- Secure subscription storage
- Reminder rules for due/overdue tasks
- Server-side send path and scheduler
- Unsubscribe/cleanup behavior

### Realtime robustness

- More detailed sync status
- Reconnect indicator
- Last synced timestamp
- Debounced refreshes during event bursts

### Auth polish

- Optional custom SMTP for Magic Links
- More resilient login copy and error handling
- Optional Google Login, while keeping Supabase as the data backend

### Offline sync

- IndexedDB cache
- Offline mutation queue
- Reconnect sync
- Conflict handling

### Privacy and advanced task behavior

- Optional client-side encryption for sensitive tasks
- Advanced recurring-series controls
- Stronger backup/restore safety checks
