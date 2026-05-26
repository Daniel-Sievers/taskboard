# Recurring Tasks

Taskboard supports a first version of recurring tasks.

## Behavior

A task can be configured to repeat:

- daily
- weekly
- monthly
- every X days

When a recurring task is completed, Taskboard keeps the completed task and creates the next open copy in the same list.

The next copy receives a future due date based on the selected recurrence rule. Future recurring copies stay visible, but they are shown in a muted style and cannot be checked off before their date is reached. They can still be edited or deleted.

## Due-date colors

- Today: green date chip
- Overdue: orange date chip
- Future recurring task: muted task row and “not due yet” chip

The colors are designed to work in both dark and light mode.

## Database

Recurring task metadata is stored directly on the `tasks` table:

- `recurrence_type`
- `recurrence_interval`
- `recurrence_anchor_date`

Run the migration:

```txt
supabase/migrations/0005_recurring_tasks.sql
```

## Current limits

This is version 1. It intentionally avoids a full calendar system.

Planned possible improvements:

- weekdays only
- selected weekdays
- repeat until date
- repeat a fixed number of times
- better bulk editing of future instances
