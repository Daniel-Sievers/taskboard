-- Row Level Security policies.
-- Run this after 0001_initial_schema.sql.

alter table public.profiles enable row level security;
alter table public.boards enable row level security;
alter table public.lists enable row level security;
alter table public.tasks enable row level security;
alter table public.task_versions enable row level security;

drop policy if exists profiles_select_own on public.profiles;
drop policy if exists profiles_insert_own on public.profiles;
drop policy if exists profiles_update_own on public.profiles;
drop policy if exists boards_all_own on public.boards;
drop policy if exists lists_all_own on public.lists;
drop policy if exists tasks_all_own on public.tasks;
drop policy if exists task_versions_all_own on public.task_versions;

create policy profiles_select_own
on public.profiles for select
using (auth.uid() = id);

create policy profiles_insert_own
on public.profiles for insert
with check (auth.uid() = id);

create policy profiles_update_own
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy boards_all_own
on public.boards for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy lists_all_own
on public.lists for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy tasks_all_own
on public.tasks for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy task_versions_all_own
on public.task_versions for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
