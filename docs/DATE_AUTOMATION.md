# Date automation

Taskboard keeps lists manual, but it can recognize dates in list titles and use those lists for automatic task routing.

## Supported title patterns

Examples:

```txt
Dienstag, 26.05.2026
26.05.2026
2026-05-26
```

## Routing behavior

When an open task has a matching date, Taskboard can move it into the manual list for that date. This keeps the board list-based instead of turning it into a full calendar.

Older open tasks can be moved into an `Offen` list so old dated lists do not keep collecting unfinished items.

## Recurring tasks

When a recurring task creates its next instance, the new task can be routed into a matching date list if that list already exists.

## Implementation

```txt
lib/dates/list-dates.ts
hooks/useTaskboard.ts
lib/db/tasks.ts
lib/db/lists.ts
```

## Design trade-off

The feature favors predictable manual lists over automatic calendar generation. The app recognizes dates where they are useful, but it does not create months of future lists automatically.
