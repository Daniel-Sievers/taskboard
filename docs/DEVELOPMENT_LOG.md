# Development log

This document records the main implementation packages behind Taskboard. It is written as a project history rather than a setup guide.

## 1. Project foundation

The project started as a Next.js, TypeScript and Tailwind app with a simple board layout. The early focus was a clean private productivity interface instead of a generic todo tutorial.

## 2. Supabase authentication and persistence

Supabase Auth added Magic Link login. Supabase PostgreSQL became the persistence layer for boards, lists and tasks. Row Level Security was added so authenticated users only access their own data.

## 3. Boards, lists and tasks

The core data model grew from a single board into multiple boards with manual lists and tasks. Tasks gained notes, dates, priorities, completion state, ordering and soft-delete behavior.

## 4. Drag and drop

Drag and drop was implemented with `@dnd-kit`. Tasks can be reordered inside lists, moved between lists and saved back to Supabase. List drag support was added later with custom autoscroll handling.

## 5. Responsive navigation

The layout was refined for desktop and mobile. Desktop uses a sidebar and compact controls. Mobile uses a drawer/hamburger pattern so the board stays usable in narrow viewports.

## 6. Search, filters and labels

Search and filters were added to make larger boards manageable. Labels are stored as task tags for now, keeping the database simple while still supporting practical filtering.

## 7. PWA support

The app received a web manifest, icons, service-worker foundation and installable-app behavior. The private board remains the primary start URL, while `/demo` is available as a public demo entry point.

## 8. Backup, export and import

Manual JSON backup/import and CSV export were added to support data ownership. Trash and archive views later improved recovery before permanent deletion.

## 9. Settings

Settings grew to include theme, accent color, language foundation, week start, default view, sound effects, delete confirmation, task counts and notification preparation.

## 10. Realtime sync

Supabase Realtime subscriptions were added for boards, lists and tasks. The first version refreshes board data after remote changes rather than applying every event locally in a granular reducer.

## 11. Mobile touch and horizontal view

Mobile drag behavior was adjusted to use long-press activation so scrolling remains natural. A horizontal list view was added for a more app-like mobile board experience.

## 12. Trash and archive management

Soft-deleted tasks can be restored or permanently deleted. Archived boards can be restored or permanently deleted. Bulk cleanup remains available but is no longer the only recovery path.

## 13. Recurring tasks

Recurring tasks were added as a pragmatic list-based feature. Completing a recurring task creates the next open copy, avoids duplicate next copies and keeps future copies visually quieter until due.

## 14. Board UI polish

Board controls were collapsed into a cleaner header. Advanced actions remain available through details, filters and sidebar controls without taking over the first screen on every visit.

## 15. Public demo

The `/demo` route was added so the project can be evaluated without Magic Link login. Demo mode uses anonymized local data and does not write to Supabase.

## 16. Date automation

Manual date lists became smarter. The app recognizes common date formats in list titles and routes open dated tasks into matching lists when possible.

## 17. Notification preparation

Browser-notification permission handling and UI status were added. The implementation clearly separates prepared notification settings from a future full Web Push reminder system.

## 18. Portfolio documentation

The README and docs were refined to present the project as a finished portfolio piece: purpose, architecture, demo, stack, limitations, roadmap and learning outcomes are all documented.
