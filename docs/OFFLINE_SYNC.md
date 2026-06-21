# Offline sync

Offline sync is planned as later product work. The current PWA foundation supports installability, but authenticated task data still depends on Supabase connectivity.

## Future architecture

A complete offline version would need:

- IndexedDB storage for boards, lists and tasks
- An offline mutation queue
- Reconnect detection
- Sync replay after reconnect
- Conflict handling for edits made on multiple devices
- UI states for offline, syncing and conflict resolution

## Scope decision

Offline sync is intentionally separate from the current portfolio release because it changes the data model and sync strategy significantly.
