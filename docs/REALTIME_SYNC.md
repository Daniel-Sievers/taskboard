# Realtime Sync

Taskboard uses Supabase Realtime to refresh the currently open board when data changes on another device or browser window.

## What is synced

Realtime subscriptions are enabled for:

- `boards`
- `lists`
- `tasks`

The app subscribes to the active board and reloads board data in the background when Supabase sends an insert, update or delete event.

## Setup

If Realtime is not active yet, run this migration in the Supabase SQL Editor:

```txt
supabase/migrations/0004_enable_realtime.sql
```

This adds the relevant tables to the `supabase_realtime` publication and sets `replica identity full` for better update/delete payloads.

## Cost note

For a private one-person app, Realtime usage should stay comfortably inside the Supabase free-plan limits. The app subscribes only to the active board and does not send Realtime events while typing; changes are written only after saving.

## Testing

1. Open the same board in two browser windows or on two devices.
2. Add or complete a task in window A.
3. Window B should refresh automatically after a short moment.
4. The small status pill in the board header should show Live-Sync / syncing states.

Manual refresh stays available as a fallback through the refresh button in the top bar.

## Current status

Realtime Sync v1 has been tested online between desktop and mobile. Creating, completing and renaming tasks updates the other open device without a manual reload.

The current implementation favors reliability: when an event arrives, the active board is refreshed in the background. A later optimization could update only the affected task/list instead of reloading the active board data.
