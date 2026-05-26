# Taskboard

A private, installable taskboard app built with **Next.js**, **TypeScript**, **Tailwind CSS**, **Supabase**, **Vercel** and **@dnd-kit**.

Taskboard is a personal productivity app inspired by TasksBoard / Google Tasks Board. It focuses on fast daily lists, multiple boards, online sync, drag & drop, themes, backup/export and an installable app-like workflow across devices.

**Live app:** https://taskboard-ten-steel.vercel.app

> This is a personal portfolio / learning project. Authentication is enabled, so private board data is only visible after login.

---

## Why I built this

I wanted a taskboard that opens directly into my workflow, syncs across devices, keeps a stable design, and gives me more control than the taskboard extension I was using before.

The goal was not just to build another todo app, but to create a practical, private productivity tool with real-world features:

- online storage and login
- multiple boards
- fast daily task lists
- drag & drop sorting
- dark/light mode
- installable PWA behavior
- search, filters and labels
- backup/export/import
- responsive layout
- clean documentation for portfolio use

---

## Screenshots

### Board overview

![Taskboard dark board view](docs/screenshots/01-board-dark.png)

### Light mode and color themes

![Taskboard light mode](docs/screenshots/02-board-light.png)

### Task editing

![Task editor](docs/screenshots/03-task-editor.png)

### Settings

![Settings](docs/screenshots/04-settings.png)

### Backup and export

![Backup and export](docs/screenshots/05-backup-export.png)

### Responsive drawer / mobile layout

![Mobile drawer](docs/screenshots/06-mobile-drawer.png)

### PWA / installable app

![PWA install](docs/screenshots/07-pwa-install.png)

---

## Current Status

Taskboard is currently usable as a private online taskboard with authentication, Supabase persistence and Vercel deployment.

Implemented so far:

- Supabase Auth with Magic Link works locally and online.
- Boards, lists and tasks are stored online in Supabase.
- Multiple boards can be created, switched, renamed and archived.
- Lists can be created, renamed, deleted and reordered.
- Tasks can be created, edited, completed, deleted and reordered.
- Drag & drop is implemented with `@dnd-kit`.
- Drag & drop supports auto-scroll while moving lists.
- Mobile touch drag uses long-press behavior so normal swipe scrolling stays usable.
- Horizontal view uses swipeable list columns on mobile and wider screens.
- Mobile touch drag now uses long-press behavior so normal touch scrolling stays usable.
- Realtime sync v1 was tested online across devices.
- Search, filters, labels and a “due today” foundation are available.
- Settings for theme, language, accent color, week start, default view, sound effects, delete confirmation and task counts are active.
- PWA basics are implemented: manifest, icons, start URL and installable app mode.
- JSON backup, JSON import, CSV export, trash recovery and archive management are available.
- GitHub and Vercel deployment are set up.
- The app is still under active development.

---

## Features

### Core Taskboard

- Create, edit, complete and delete tasks
- Quick-edit task titles directly in the list
- Full task editor for notes, priority, date, labels and sensitive marking
- Create, rename, delete and reorder lists
- Multiple boards
- Board switching through sidebar and header chips
- Soft-delete behavior for tasks
- Optional delete confirmation
- Completed task counts
- Compact task rows for better space usage
- Emoji-friendly and long-text-friendly task titles

### Drag & Drop

- Drag tasks within a list
- Drag tasks between lists
- Drag entire lists
- Auto-scroll while dragging
- Saved order through Supabase
- Smooth interaction with `@dnd-kit`

### Search, Filters and Labels

- Search by task title
- Search by notes
- Search by labels/tags
- Filter by status
- Filter by priority
- Filter by label
- “Due today” / today-focused view foundation

### Settings

- Dark / light / system theme
- Multiple accent color modes
- German / English UI language
- Week-start setting
- Default view setting
- Sound effects toggle
- Delete confirmation toggle
- Task count visibility toggle

### Data Management

- JSON backup
- JSON import
- CSV export
- Trash view for deleted tasks
- Restore individual deleted tasks
- Permanently delete individual deleted tasks
- Archive view for archived boards
- Restore archived boards
- Permanently delete archived boards
- Approximate storage usage display

### PWA

- Installable app experience
- Custom app icon
- Manifest configured
- Start URL configured for `/board`
- Browser app and PWA usage

---

## Tech Stack

- **Next.js** — app framework
- **TypeScript** — type-safe development
- **Tailwind CSS** — styling
- **Supabase Auth + Database** — authentication, database and API
- **PostgreSQL** — database layer through Supabase
- **Vercel** — hosting and deployment
- **@dnd-kit** — drag & drop
- **Lucide React** — icons
- **PWA manifest / service worker** — installable app foundation

---

## Dependency Management

The project intentionally pins core framework dependencies instead of relying on `latest`. During deployment, a `latest` upgrade pulled in a newer Next.js/Turbopack build that behaved differently from the local setup. The project now keeps framework versions explicit and commits `package-lock.json` so local and Vercel builds are more reproducible.

Recommended workflow for dependency changes:

```txt
npm install
npm run build
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

---

## Architecture

The project is structured around a clear separation of UI, data access, app settings and documentation.

```txt
app/
  board/
  login/
  settings/

components/
  app-shell/
  board/
  settings/
  pwa/
  ui/

hooks/
  useAuth.ts
  useBoard.ts
  usePreferences.ts
  useI18n.ts

lib/
  supabase/
  preferences.ts
  i18n.ts
  sound.ts

supabase/
  migrations/

docs/
  screenshots/
  ARCHITECTURE.md
  DATABASE.md
  DEVELOPMENT_LOG.md
  DRAG_AND_DROP.md
  GITHUB_PORTFOLIO.md
  NEXT_STEPS.md
  PWA_INSTALLATION.md
  SECURITY.md
  SUPABASE_SETUP.md
  VERCEL_DEPLOYMENT.md
```

---

## Local Development

Clone the repository:

```bash
git clone https://github.com/Daniel-Sievers/taskboard.git
cd taskboard
```

Install dependencies:

```bash
npm install
```

Create an environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
copy .env.example .env.local
```

Add your Supabase environment variables to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The app also supports the older variable name:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000/board
```

Important:

```txt
Do not commit .env.local.
Do not commit node_modules.
Do not commit .next.
Only .env.example belongs in the repository.
```

---

## Environment Variables

Required locally and in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SITE_URL=https://taskboard-ten-steel.vercel.app
```

Alternative supported key name:

```env
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Never expose or commit Supabase secret keys or service role keys.

---

## Deployment

The app is deployed with Vercel.

Main deployment URL:

```txt
https://taskboard-ten-steel.vercel.app
```

Vercel hosts the app. The data is stored in Supabase.

For production deployment, the following environment variables are needed in Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SITE_URL=https://taskboard-ten-steel.vercel.app
```

Supabase Auth redirect URLs should include:

```txt
https://taskboard-ten-steel.vercel.app/**
http://localhost:3000/**
```

More deployment notes are available in:

```txt
docs/VERCEL_DEPLOYMENT.md
```

---

## Database

The database is managed through Supabase migrations.

Main entities:

- `profiles`
- `boards`
- `lists`
- `tasks`
- `task_versions`

The app uses Row Level Security so users can only access their own boards, lists and tasks.

More database notes are available in:

```txt
docs/DATABASE.md
```

---

## Documentation

Additional planning and implementation notes are stored in the `docs/` folder:

- `docs/SUPABASE_SETUP.md`
- `docs/DRAG_AND_DROP.md`
- `docs/DEVELOPMENT_LOG.md`
- `docs/NEXT_STEPS.md`
- `docs/ARCHITECTURE.md`
- `docs/DATABASE.md`
- `docs/SECURITY.md`
- `docs/PWA_INSTALLATION.md`
- `docs/VERCEL_DEPLOYMENT.md`
- `docs/GITHUB_PORTFOLIO.md`

---

## Development Story

This project was built iteratively in focused development packages:

1. Initial Next.js / TypeScript / Tailwind project setup
2. Supabase authentication and database connection
3. Online task storage
4. Boards, lists and tasks
5. Drag & drop with saved ordering
6. Responsive sidebar and mobile drawer
7. Search, filters and labels
8. PWA setup and custom app icon
9. Backup, export and import tools
10. Theme, color and language settings
11. GitHub and Vercel deployment
12. UI polish and portfolio documentation

A more detailed development log is available in:

```txt
docs/DEVELOPMENT_LOG.md
```

---

## Data Ownership

The app includes JSON backup, CSV export, JSON import, empty trash and permanent deletion of archived boards.

This reduces vendor lock-in and makes private data easier to move or back up manually.

---

## Roadmap

Planned improvements:

- Realtime sync refinements and more detailed sync status
- Improved horizontal / Kanban view
- Offline sync with IndexedDB
- Recurring tasks
- Optional Google login
- Optional custom SMTP for auth emails
- Client-side encryption for sensitive tasks

---

## What I learned

This project helped me practice:

- building a real-world app with Next.js and TypeScript
- working with Supabase Auth and Row Level Security
- structuring a frontend project for maintainability
- implementing drag & drop interactions
- deploying through GitHub and Vercel
- handling environment variables safely
- designing around sync, backups, privacy and UX details
- improving mobile touch interactions with delayed drag activation
- pinning framework dependencies instead of using `latest` for reproducible local and Vercel builds
- documenting an iterative development process
- pinning framework dependencies instead of relying on `latest` for reproducible local and Vercel builds

---

## License

This is currently a personal portfolio / learning project.