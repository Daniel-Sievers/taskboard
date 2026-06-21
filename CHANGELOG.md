# Changelog

This changelog summarizes the main development milestones for Taskboard.

## Public demo and portfolio polish

- Added `/demo` as an anonymized no-login entry point.
- Updated README and docs for public GitHub presentation.
- Added GitHub Actions build check.
- Documented known limits, roadmap and deployment setup.

## Notification preparation

- Added notification settings and browser-permission handling.
- Added top-bar notification status for disabled, prepared and blocked states.
- Documented that full Web Push reminders remain future work.

## Date automation

- Added recognition for manual date-list titles.
- Routed dated open tasks into matching date lists when available.
- Added handling for older open tasks through an `Offen` list.

## Recurring tasks

- Added daily, weekly, monthly and every-X-days recurrence rules.
- Created the next open instance when a recurring task is completed.
- Avoided duplicate next instances.
- Added future-task visual states and recurrence editing/stopping from the task modal.

## Trash and archive management

- Added deleted-task recovery and permanent delete actions.
- Added archived-board recovery and permanent delete actions.
- Added bulk cleanup options while keeping individual recovery available.

## Realtime sync

- Added Supabase Realtime subscriptions for boards, lists and tasks.
- Added live-sync status in the board header.
- Kept manual refresh as a fallback.

## PWA and app shell

- Added manifest, app icons and service-worker foundation.
- Added install-card in settings.
- Configured installed app start URL and demo shortcut.

## UI and mobile polish

- Added compact task rows and improved long-title wrapping.
- Added collapsible board controls and a cleaner header layout.
- Added mobile drawer navigation.
- Added horizontal list view and touch-friendly long-press drag behavior.
- Added optional generated sound feedback for completion and delete actions.

## Search, filters and labels

- Added search for titles, notes and labels.
- Added filters for status, priority and labels.
- Synced global search and board search through URL state.

## Backup, export and data management

- Added JSON backup and import.
- Added CSV export.
- Added data-management area in settings.

## Drag and drop

- Replaced native browser drag events with `@dnd-kit`.
- Added task and list dragging with saved ordering.
- Added custom autoscroll and drag overlays.
- Improved stability for long boards and mobile/touch behavior.

## Multiple boards and Supabase persistence

- Added Supabase-backed boards, lists and tasks.
- Added board switching, board renaming and board archive behavior.
- Added persistent list collapse state and task editing fields.

## Initial project foundation

- Set up Next.js, TypeScript and Tailwind.
- Added Supabase Auth foundation.
- Added initial dark board layout and local demo data.
