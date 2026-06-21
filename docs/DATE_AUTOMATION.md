# Automatic date recognition

Taskboard keeps lists manual, but it can now recognize dates in list titles and use those lists for automatic task routing.

## Recognized list titles

The app recognizes date-like titles such as:

```txt
Dienstag, 26.05.2026
26.05.2026
26.05.26
2026-05-26
26.05.
```

If the year is missing, Taskboard uses the current year.

The recognized date is stored on newly created or renamed lists when possible. Existing older lists without a stored `date` value are still recognized from their title in the UI and routing logic.

## Task routing

When an open task has a due/planned date and a matching manual date list exists, Taskboard moves the task into that list automatically.

Examples:

```txt
List title: Dienstag, 26.05.2026
Task due date: 2026-05-26
Result: task is routed into that list
```

```txt
List title: 26.05.2026
Task due date: 2026-05-26
Result: task is routed into that list
```

Taskboard does not create new date lists for every task date. Lists stay manually controlled. If no matching date list exists, the task stays in the list where it was created or edited.

## Overdue open tasks

Open tasks that are more than seven days overdue are moved into a list named:

```txt
Offen
```

If this list does not exist yet, Taskboard creates it automatically. This keeps very old open tasks from staying hidden in outdated daily lists.

Completed tasks are not aggressively reorganized by the overdue rule. The rule is meant to keep the active open workload visible.

## Rename behavior

If a list is renamed to a recognized date, open tasks with that date can move into it.

If a date list is renamed away from its date, tasks are not forcibly moved out unless another fitting date list exists or a later task edit triggers routing. This keeps manual list structure predictable.

## Interaction with drag and drop

Dragging a task into a date list updates the task date to the list date. Date recognition works for both stored list dates and date-like titles.

## Current limits

- The recognition intentionally focuses on simple date formats.
- The app does not automatically create a new date list for every scheduled task.
- The overdue threshold is fixed at seven days for now.
- There is no UI setting yet for disabling date automation or changing the overdue threshold.
