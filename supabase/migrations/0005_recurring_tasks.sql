-- Adds recurrence metadata for repeating tasks.
-- Run this after 0004_enable_realtime.sql.

alter table public.tasks
  add column if not exists recurrence_type text not null default 'none',
  add column if not exists recurrence_interval integer not null default 1,
  add column if not exists recurrence_anchor_date date;

alter table public.tasks
  drop constraint if exists tasks_recurrence_type_check;

alter table public.tasks
  add constraint tasks_recurrence_type_check
  check (recurrence_type in ('none', 'daily', 'weekly', 'monthly', 'interval'));

alter table public.tasks
  drop constraint if exists tasks_recurrence_interval_check;

alter table public.tasks
  add constraint tasks_recurrence_interval_check
  check (recurrence_interval >= 1 and recurrence_interval <= 365);

create index if not exists tasks_recurrence_idx
  on public.tasks(board_id, recurrence_type, scheduled_date)
  where deleted_at is null;
