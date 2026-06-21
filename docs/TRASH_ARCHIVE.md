# Trash and archive

Taskboard uses soft delete and archive states so data can be recovered before it is permanently removed.

## Deleted tasks

Deleted tasks move to trash first. The trash view supports restore, individual permanent delete and empty-trash cleanup.

## Archived boards

Archived boards are hidden from the normal board switcher but remain recoverable. Archived boards can be restored or permanently deleted.

## Design goal

The feature makes destructive actions safer for everyday use. Bulk cleanup exists, but recovery and inspection are available before permanent deletion.
