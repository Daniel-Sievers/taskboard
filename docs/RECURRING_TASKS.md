# Recurring tasks

Taskboard implements recurring tasks as a list-based productivity feature rather than a full calendar system.

## Supported rules

- No recurrence
- Daily
- Weekly
- Monthly
- Every X days

## Completion behavior

When a recurring task is completed, Taskboard creates the next open instance. Duplicate next instances are avoided so repeated clicks or sync refreshes do not create extra copies.

## Future tasks

Future dated open tasks stay visible in the board, but they are visually quieter and cannot be checked off before their due date. This keeps upcoming work visible without making it look immediately actionable.

## Editing recurrence

The task modal shows recurrence details and can change or stop the repeat rule. Stopping recurrence turns the current task into a normal task; existing copies remain independent tasks.

## Date-list routing

If a future copy has a due date and a matching manual date list already exists, the task can be routed into that list.

## Known boundaries

The current version does not include selected weekdays, end dates, occurrence counts or bulk editing of an entire recurring series. Those features are planned as optional future improvements.
