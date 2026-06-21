# Portfolio presentation

Taskboard is positioned as a portfolio project because it solves a real workflow problem and includes production-like concerns: authentication, persistence, realtime sync, PWA behavior, backup/export, deployment, CI and maintainable documentation.

## Core story

I built Taskboard as a private, installable alternative to a taskboard extension I previously used. The project focuses on fast daily planning, a stable board interface, cross-device use and clear data ownership.

## Short description

```txt
Private installable taskboard app with Supabase Auth, realtime sync, drag & drop, multiple boards, recurring tasks, backup/export and Vercel deployment.
```

## What the project demonstrates

- Next.js App Router and TypeScript project structure
- Supabase Auth, PostgreSQL, RLS and Realtime
- Board/list/task data modeling
- Drag & drop with `@dnd-kit`
- Mobile touch UX and responsive navigation
- Recurring-task logic without a full calendar system
- PWA setup and installable-app behavior
- JSON/CSV backup and data-management flows
- Public demo mode without login
- GitHub Actions and Vercel deployment
- Safe handling of environment variables and known limitations

## Public demo

The public entry point is:

```txt
https://taskboard-ten-steel.vercel.app/demo
```

The demo uses anonymized local data and does not require login. Private persisted boards remain behind Supabase authentication.

## Portfolio framing

The project is presented as a practical fullstack productivity app. The README focuses on purpose, demo access, feature scope, architecture, setup, limitations, roadmap and learning outcomes.
