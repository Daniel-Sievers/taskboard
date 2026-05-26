# Trash and Archive Management

Taskboard uses soft delete and archive states so data can be recovered before it is permanently removed.

## Deleted tasks

Deleted tasks are not immediately removed from Supabase. They receive a `deleted_at` timestamp and appear in the settings under the trash section.

Available actions:

- restore a single deleted task
- permanently delete a single deleted task
- empty the complete trash

Permanent deletion always asks for confirmation.

## Archived boards

Archived boards are hidden from the normal board switcher, but remain stored in Supabase.

Available actions:

- restore an archived board
- permanently delete one archived board
- permanently delete all archived boards

Permanent deletion removes the board record. Depending on the database relationships, related lists and tasks may also be removed by cascade rules.

## Why this matters

Bulk cleanup is useful, but it should not be the only option. A proper trash/archive view makes the app safer for everyday use because accidental deletes can be inspected and recovered.
