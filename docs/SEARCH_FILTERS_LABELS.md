# Search, filters and labels

Search and filters make larger boards easier to scan.

## Search

Tasks can be searched by title, notes and labels.

## Filters

The board supports filtering by status, priority and label. Active filters show a compact summary and can be reset quickly.

## Labels

Labels are stored on each task as the existing `tags` array. This keeps the database simple and avoids an extra label schema for the current version.

## Future label model

A larger version could normalize labels into separate `labels` and `task_labels` tables. That would make label colors, sorting and cross-board label management easier.
