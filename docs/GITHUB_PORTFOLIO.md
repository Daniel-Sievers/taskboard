# GitHub Portfolio Notes

Taskboard is intended as a portfolio project because it solves a real personal workflow problem and includes realistic product concerns: authentication, persistence, realtime sync, PWA behavior, backup/export, deployment, documentation and long-term maintainability.

## Core story

The project started from the wish for a private alternative to TasksBoard / Google Tasks Board:

- open directly into a board
- keep a stable dark interface
- work across devices
- keep control over private data
- avoid unnecessary startup friction
- install like an app
- document the development process clearly

## Portfolio positioning

A good short description:

```txt
Private installable taskboard app with Supabase Auth, realtime sync, drag & drop, multiple boards, recurring tasks, backup/export and Vercel deployment.
```

## What the project demonstrates

- Next.js App Router
- TypeScript application structure
- Supabase Auth
- Supabase Row Level Security
- Postgres data modeling for boards, lists and tasks
- Supabase Realtime
- Drag & drop with `@dnd-kit`
- Modal-based task creation/editing UX
- Automatic date recognition from manual list titles
- Mobile touch UX
- PWA setup
- Notification-preparation UX with honest limitation handling
- JSON/CSV backup and import/export
- GitHub + Vercel deployment workflow
- GitHub Actions build check
- Dependency pinning and build reproducibility
- Iterative product development and documentation

## Suggested README sections

- Live demo without login
- Recommended GitHub About website link
- Why I built this
- Screenshots
- Current status
- Feature overview
- Tech stack
- Architecture diagram
- Local setup
- Environment variables
- Deployment notes
- Build checks
- Known limits
- Roadmap
- What I learned

## Public demo

The recommended portfolio entry point and GitHub About website link is:

```txt
https://taskboard-ten-steel.vercel.app/demo
```

This opens an anonymized local demo board without requiring Magic Link login. Demo changes are not persisted to Supabase. Private user boards still require authentication.

## Optional demo video/GIF idea

Use demo/anonymized data only.

Suggested flow:

1. Open the board.
2. Collapse/expand board controls.
3. Add a task in the modal.
4. Edit date, priority, recurrence and labels in the same modal.
5. Drag a task between lists.
6. Complete a recurring task.
7. Show realtime sync in a second device/window.
8. Open backup/export settings.

Keep the GIF short, ideally 30-60 seconds.

## Public repository checklist

Before making the repository public:

- [ ] `.env.local` is not committed.
- [ ] `.next`, `node_modules` and `.vercel` are not committed.
- [ ] Screenshots do not show private tasks, e-mail addresses or real private data.
- [ ] Supabase service role keys are not present anywhere in the repository.
- [x] README contains the live demo link.
- [ ] GitHub About website field points to `https://taskboard-ten-steel.vercel.app/demo`.
- [x] README explains that the public demo works without login and private data requires login.
- [ ] README contains setup instructions.
- [x] Known limits are documented.
- [x] Notification state is shown honestly as prepared, not as full push reminders.
- [x] Roadmap is clear and realistic.
- [ ] GitHub Actions build check passes after the latest push.

## GitHub About settings

GitHub does not automatically read the right-side About website link from `README.md` or from a file in the repository. Set it manually in the repository About settings. Detailed steps are documented in:

```txt
docs/GITHUB_REPOSITORY_SETTINGS.md
```
