# Known Limits

This document lists current limitations intentionally left visible for portfolio transparency. The project is usable, but it is still evolving.

## Authentication

- Magic Link email delivery can hit provider or free-plan rate limits during heavy testing.
- Google Login is not required and is intentionally not the default because the project focuses on privacy and minimal third-party identity dependencies.
- Custom SMTP is planned as a possible improvement for more reliable Magic Link delivery.

## Offline behavior

- Offline sync is not implemented yet.
- The PWA foundation exists, but task mutations currently expect an online Supabase connection.
- Planned approach: IndexedDB cache, offline mutation queue and a simple conflict strategy.

## Realtime sync

- Realtime sync v1 refreshes board data when Supabase sends events.
- The app does not yet apply every remote event locally in a fine-grained way.
- Reconnect status and last-synced timestamps could be improved.

## Recurring tasks

- Recurring tasks v1 supports basic recurrence rules.
- Series management is still limited.
- More advanced options such as specific weekdays, stop dates or "complete anyway" actions can be added later.

## Mobile UX

- Mobile horizontal view and long-press drag behavior have been improved.
- Further polish is still planned for carousel-like list navigation and task creation.
- The task editor should become a stronger modal/fullscreen dialog for mobile use.

## Browser/PWA behavior

- App icon behavior can differ between Chrome, Edge, Firefox and mobile launchers.
- The manifest and icons are configured, but some browser-specific behavior cannot be fully controlled from the app.

## Privacy and screenshots

- The app is built for private task data.
- Any public screenshots, videos or GIFs should use demo/anonymized data only.
- `.env.local`, Supabase secret keys and service-role keys must never be committed.

## Public demo mode

- Demo mode is intentionally local and does not persist changes to Supabase.
- Demo data can reset after reload or a new browser session.
- The demo is for portfolio testing, not a shared production workspace.
