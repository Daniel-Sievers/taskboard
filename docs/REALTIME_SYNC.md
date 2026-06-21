# Realtime sync

Taskboard uses Supabase Realtime to keep open board sessions in sync across browsers and devices.

## Implemented behavior

- The active board subscribes to relevant board, list and task table changes.
- Remote changes trigger a data refresh.
- The board header shows a live-sync status indicator.
- Manual refresh remains available as a fallback.

## Scope

Realtime v1 focuses on reliable visibility of remote changes. It does not yet apply every remote event through a granular local reducer.

## Efficiency

The app subscribes to the active board rather than every possible board. It also writes changes after saves/reorders instead of sending realtime traffic on every keystroke.

## Future improvements

- More detailed reconnect states
- Last-synced timestamp
- Debounced refreshes during bursts of events
- More granular event application
