# Notifications

Taskboard now has a small notification preparation layer. This is intentionally not a full server-side push notification system yet.

## Current behavior

- Notifications are off by default.
- The settings page contains a notification switch under **App behavior**.
- When the switch is enabled, Taskboard asks the browser for notification permission.
- The permission state is stored and shown locally in the browser.
- The bell icon in the top bar reflects whether notifications are disabled, prepared, blocked or unavailable.

## What is not implemented yet

Taskboard does not yet send automatic push reminders in the background.

A complete push notification system still needs:

1. Web Push subscription handling.
2. Storage of push subscriptions per authenticated user.
3. A server-side send path, for example a protected API route or scheduled backend job.
4. Reminder rules, such as due today, overdue, recurring next instance or custom reminder time.
5. Clear unsubscribe and privacy behavior.

## Why this is separated

The preparation step is useful because it makes the UI honest and avoids a misleading bell icon. Users can see that notifications are planned and can grant/revoke browser permission, but the app does not pretend to send reminders before the backend path exists.

## Privacy note

Notification permission is a browser-level permission. Taskboard stores the local app preference in `localStorage`. No push subscription is sent to Supabase yet.
