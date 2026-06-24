# Backup and export

Taskboard includes manual data-management tools so authenticated task data is not locked into the UI. These tools are intended for signed-in Supabase boards; the public demo uses local sample data and does not expose the full durable backup/import/restore workflow.

## Availability

Backup, import, restore and cleanup workflows are intended for signed-in Supabase boards. The public demo uses local sample data and does not persist changes to Supabase, so it is not the primary place to test durable backup/restore behavior.

## JSON backup

A JSON backup exports the current authenticated board data in a structured format that can later be imported again. This is the safest manual backup format because it preserves boards, lists, tasks and metadata.

## JSON import

JSON import restores data from a previous export. The import flow is intentionally separate from normal task editing so recovery remains explicit and reviewable.

## CSV export

CSV export creates a flat task list that can be opened in spreadsheet tools. It is useful for review, reporting or migration, but it is not intended as a full-fidelity restore format.

## Trash and archives

Deleted tasks first move into trash. Archived boards remain recoverable until permanently deleted. This design makes accidental deletion less risky while still allowing cleanup.

## Data ownership goal

The feature set reflects the main data-ownership goal of the project: authenticated data lives in Supabase, while the user-facing app still provides manual export and recovery paths.
