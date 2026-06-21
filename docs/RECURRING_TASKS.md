# Recurring Tasks

Taskboard supports a practical first version of recurring tasks. The goal is to keep daily planning lightweight without building a full calendar system.

## Supported repeat rules

A task can repeat:

- daily
- weekly
- monthly
- every X days

The rule is edited in the task modal under **Wiederholung / Repeat**.

## What happens when a recurring task is completed?

When a recurring task is checked off, Taskboard keeps the completed instance and creates the next open copy.

The next copy receives a future due date based on the selected rule. The calculation starts from the day the task is completed. For example, completing a daily task today creates the next copy for tomorrow.

Taskboard now also avoids duplicate next copies. If a recurring task is reopened and completed again, an already existing next copy with the same rule, list and due date is reused instead of creating a second duplicate.

## Visibility and locking

Future dated open tasks stay visible in the board, but they are visually muted and cannot be checked off before their due date.

The task card shows clearer recurrence status text, for example:

- `noch nicht fällig bis 27.05.2026`
- `Wiederholung heute fällig`
- `Überfällige Wiederholung seit 25.05.2026`
- `Erledigte Wiederholungsinstanz`

This keeps planned future repetitions visible without letting them accidentally be completed too early.

## Editing and stopping a repeat

Opening a recurring task in the task modal now shows a recurrence summary panel. From there the repeat rule can be changed or stopped.

Stopping a repeat turns the current task into a normal task when it is saved. Existing copies remain independent tasks and can be edited or deleted individually.

This is intentional for now: Taskboard does not yet have a hidden `series_id` object that would allow bulk-editing every future instance as one calendar series.

## Due-date colors

- Today: green date chip
- Overdue: orange date chip
- Future task: muted task row and `noch nicht fällig` chip
- Recurring task: cyan repeat chip plus a short status line

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

This is still intentionally smaller than a full calendar system.

Not implemented yet:

- weekdays only
- selected weekdays
- repeat until date
- repeat a fixed number of times
- real series-wide bulk editing of all future instances
- server-side reminder delivery for recurring tasks
