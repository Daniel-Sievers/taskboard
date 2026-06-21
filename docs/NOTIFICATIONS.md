# Notifications

Taskboard currently implements notification preparation, not full push reminders.

## Implemented

- Notification switch in settings
- Browser notification permission request
- Local preference storage
- Top-bar bell status for disabled, prepared and blocked states
- Documentation that distinguishes prepared permission handling from real push reminders

## Not implemented yet

Automatic reminders for due or overdue tasks are not sent yet.

A complete push notification system would require:

- Web Push subscription handling in the browser
- Secure subscription storage per authenticated user
- VAPID keys
- Service worker `push` event handling
- Server-side reminder rules
- A scheduled job or background function
- Unsubscribe and cleanup behavior

## Design reason

The current implementation makes the notification state honest. The UI can request browser permission and show a clear status, but it does not pretend to send reminders before the backend delivery path exists.
