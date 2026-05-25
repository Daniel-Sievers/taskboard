# Search, Filters and Labels

This block adds the first real productivity layer on top of boards, lists and tasks.

## Implemented

- Search over task title, notes and labels.
- Filter by status: open, done, all.
- Filter by priority: high, normal, low, all.
- Filter by label/tag.
- Quick label chips generated from existing task labels.
- Sidebar link for `Heute fällig` using `?filter=today`.
- Active filters show a compact summary and can be reset.

## Notes

Labels are currently stored on each task as the existing `tags` array. This keeps the database simple and avoids a migration. Later this can be normalized into separate `labels` and `task_labels` tables if we need label colors, sorting or cross-board label management.

## Next improvements

- Dedicated filter drawer design closer to TasksBoard.
- Saved filters.
- Cross-board search.
- Overdue view.
- Label colors and icons.
