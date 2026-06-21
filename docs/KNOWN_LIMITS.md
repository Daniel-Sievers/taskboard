# Known limits

Taskboard documents its current boundaries explicitly. The goal is to present a realistic project scope rather than imply that every product edge case is already solved.

## Authentication

Magic Link delivery depends on the configured email provider and can hit free-plan or provider rate limits during heavy testing. A custom SMTP setup would make delivery behavior more predictable.

## Offline sync

The PWA foundation exists, but full offline sync is not implemented yet. A complete version would need local persistence, an offline mutation queue, reconnect sync and conflict handling.

## Notifications

Browser-notification permission and UI status are prepared. Automatic server-side push reminders are not implemented yet. A full version would need Web Push subscriptions, secure subscription storage, VAPID keys, scheduled reminder rules and a server-side send path.

## Realtime sync

Realtime v1 refreshes board data after remote changes. It does not yet apply every remote event through a granular local reducer. Reconnect indicators and last-sync metadata remain future improvements.

## Recurring tasks

Recurring tasks support daily, weekly, monthly and custom interval rules. Advanced series controls such as selected weekdays, end dates, occurrence counts or bulk editing remain future work.

## PWA behavior

Install prompts, icons and shortcut behavior can differ between Chrome, Edge, Firefox, Android and iOS. The manifest and icons are configured, but browsers still control parts of the final install experience.

## Public demo

The public demo uses anonymized local data and does not persist changes to Supabase. This is intentional so the project can be tested without login or private data access. Persistent boards, realtime database sync and full backup/import/restore workflows belong to the authenticated Magic Link mode.
