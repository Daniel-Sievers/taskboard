# UI polish

Taskboard includes several smaller interface decisions that make the app feel calmer and more practical for daily use.

## Collapsible board controls

Board statistics, sync status, filters and actions are useful, but they do not need to dominate the first screen on every visit. The header groups these controls behind compact actions.

## Modal task editing

Task creation and editing use a modal instead of inline expansion. Desktop receives a compact centered dialog; mobile uses a near-fullscreen app-like layout.

## Sound feedback

Completion and delete actions can play short generated sounds using the Web Audio API. The app does not bundle proprietary sound files, and sounds can be disabled in settings.

## Mobile drawer

Navigation and board actions are mirrored in the mobile drawer so the narrow layout keeps the main board focused.

## Visual hierarchy

Future scheduled tasks are muted until due. Today and overdue states receive stronger visual treatment so the board remains scannable.
