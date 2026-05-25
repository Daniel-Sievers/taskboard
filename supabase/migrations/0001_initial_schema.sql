-- Taskboard initial schema.
-- Run this in Supabase SQL Editor first.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.boards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Hauptboard',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  board_id uuid not null references public.boards(id) on delete cascade,
  title text not null,
  date date,
  position numeric not null default 0,
  collapsed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  board_id uuid not null references public.boards(id) on delete cascade,
  list_id uuid references public.lists(id) on delete set null,
  title text not null,
  notes text not null default '',
  status text not null default 'open' check (status in ('open', 'done', 'archived')),
  scheduled_date date,
  position numeric not null default 0,
  priority integer not null default 1,
  tags text[] not null default '{}',
  is_encrypted boolean not null default false,
  encrypted_payload text,
  encryption_version integer,
  encryption_hint text,
  completed_at timestamptz,
  deleted_at timestamptz,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.task_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id uuid not null references public.tasks(id) on delete cascade,
  snapshot jsonb not null,
  change_type text not null,
  device_id text,
  created_at timestamptz not null default now()
);

create index if not exists boards_user_id_idx on public.boards(user_id);
create index if not exists lists_board_position_idx on public.lists(board_id, position);
create index if not exists lists_user_date_idx on public.lists(user_id, date);
create index if not exists tasks_board_position_idx on public.tasks(board_id, position);
create index if not exists tasks_list_position_idx on public.tasks(list_id, position);
create index if not exists tasks_user_status_idx on public.tasks(user_id, status);
create index if not exists tasks_scheduled_date_idx on public.tasks(scheduled_date);
