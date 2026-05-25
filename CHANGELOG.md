# Changelog

## Compact row overflow polish

- Lange Task-Titel umbrechen jetzt innerhalb der Karte, auch ohne Leerzeichen.
- Bearbeiten-/Löschen-Buttons stehen direkt hinter Priorität, Datum und Labels statt ganz rechts außerhalb des sichtbaren Bereichs.
- Der Abhak-Sound ist nochmal deutlich lauter eingestellt.

## UI compact task rows

- Listen-Zähler stehen jetzt direkt neben dem Listentitel statt in einer eigenen Zeile.
- Task-Metadaten wie Priorität, Datum und Labels stehen jetzt direkt hinter dem Task-Titel.
- Kurze Aufgaben verbrauchen dadurch deutlich weniger vertikalen Platz; lange Titel und Notizen umbrechen weiterhin sauber.


## Paket 2: Mehrere Boards

- Sidebar lädt echte Boards aus Supabase.
- Neues Board kann über die Sidebar erstellt werden.
- Board-Wechsel läuft über `?board=<id>`.
- Aktives Board wird im BoardView geladen.
- Board kann über das Board-Menü umbenannt werden.
- Board kann archiviert werden.
- Development Log für GitHub/Bewerbungen ergänzt.


## Drag & Drop Autoscroll Fix

- Improved viewport auto-scroll while dragging whole lists.
- Added drag-move based pointer tracking so list dragging continues to scroll even when pointer events are captured by the DnD layer.
- Increased scroll speed near the top/bottom edge for faster movement across long boards.

# Changelog

## 0.3.0 - Supabase Tasks vorbereitet

- Supabase-Datenmodell für Boards, Listen, Tasks und Versionen verbessert
- RLS-Policies idempotent gemacht
- `.env.example` wieder ergänzt
- Board lädt nach Login echte Supabase-Daten
- Default-Board und Tageslisten werden bei Bedarf automatisch erstellt
- Aufgaben hinzufügen speichert online in Supabase
- Aufgaben abhaken speichert online in Supabase
- Listen können per Klick auf den Titel umbenannt werden
- Demo-Modus bleibt verfügbar, wenn Supabase nicht konfiguriert ist

## 0.2.0 - UI Preview

- Dunkles Board-Layout
- Tageslisten-Ansicht
- Kanban-/Horizontal-Preview
- lokale Demo-Aufgaben

## 0.1.0 - Starter

- Next.js/Tailwind Grundstruktur
- Supabase Auth vorbereitet

## Supabase Data Management Preview

- Added real custom list creation.
- Added persistent list collapse state.
- Added task editing for title, notes, date, priority, labels and sensitive marker.
- Added task soft delete.
- Restored `.env.example` with Supabase placeholders.
- Supabase client now accepts both `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

## Drag and drop board interactions

- Added native drag and drop for day lists.
- Added native drag and drop for tasks inside a list and between lists.
- Persisted list positions to Supabase.
- Persisted task positions, target list and scheduled date to Supabase.
- Added visual drag states and drop zones to the board UI.

## Drag & Drop Upgrade

- Native Browser-Drag-Events durch `@dnd-kit` ersetzt.
- Drag Overlay für Aufgaben und Listen ergänzt.
- Sortable-Kontexte für Listen und offene Aufgaben ergänzt.
- Auto-Scroll beim Ziehen aktiviert.
- Aufgaben rutschen während des Ziehens live an die neue Position.
- Reihenfolge wird nach dem Drop in Supabase gespeichert.

## Drag and drop stability pass

- Improved drag behaviour to avoid repeated hover-state loops while sorting tasks.
- Task cards can now be grabbed from the whole row instead of only the small grip icon.
- Increased DnD auto-scroll responsiveness near viewport edges.
- Stopped automatically generating future date lists in Supabase mode; lists are now meant to be created manually.


## DnD Feinschliff

- Auto-Scroll beim Ziehen deutlich beschleunigt.
- Drop-Logik stabilisiert, damit Tasks nach dem Loslassen nicht in die alte Reihenfolge zurückspringen.
- Zusätzlicher Fensterrand-Scroller ergänzt: Wenn du beim Ziehen nah an den oberen/unteren Rand gehst, scrollt die Seite wesentlich aggressiver.


## Drag & Drop Feinschliff

- Listen können jetzt über den gesamten Listenkopf gezogen werden, nicht nur über den Griff.
- Eigener Auto-Scroll ersetzt das dnd-kit-Auto-Scroll für vertikale Listen.
- Scroll-Geschwindigkeit steigt dynamisch, je näher die Maus am oberen oder unteren Fensterrand ist.
- Während des Ziehens wird `scroll-behavior: auto` erzwungen, damit CSS-Smooth-Scrolling das Dragging nicht ausbremst.

## Drag & Drop Feinschliff

- Listen-Drag stabilisiert: keine React-Render-Schleifen durch Hover-State mehr.
- Auto-Scroll beim Ziehen weicher eingestellt: größere Randzone, dynamische Geschwindigkeit, weniger aggressiv als vorher.
- Listen können über den Listenkopf verschoben werden; die sechs Punkte sind nur noch visueller Hinweis.
- Drag-Overlay darf aus dem Fenster herauslaufen, ähnlich wie bei TasksBoard.
- Listen können jetzt über das Listenmenü gelöscht werden. Enthält die Liste Aufgaben, erscheint vorher eine Bestätigung.
- `.env.example` repariert und mit Supabase-Platzhaltern ergänzt.

## DnD autoscroll direction fix

- Custom autoscroll now listens to global pointer movement during a drag.
- Dragging a list to the bottom and then back to the top should work without releasing the mouse.
- Scroll speed is slightly smoother and less jumpy near the edge.

## Responsive Sidebar / Mobile Navigation

- Added a hamburger button in the top bar for tablet and narrow desktop widths.
- Added a slide-out sidebar drawer for mobile/narrow layouts.
- The drawer contains the same views, boards and project-status sections as the desktop sidebar.
- Sidebar closes automatically after choosing a view, board or newly created board.

## Search, filter and labels

- Added active search/filter controls for task titles, notes and labels.
- Added filter drawer for status, priority and labels.
- Wired the sidebar's "Heute fällig" link into the board filter.
- Preserved active board context when switching between sidebar views.
- Added `data-scroll-behavior="smooth"` to the root layout to silence the Next.js scroll-behavior warning.

## Topbar search and settings foundation

- The topbar search is now a real input and writes its search term into the URL as `q`.
- Board search and topbar search stay synchronized.
- Added `/` keyboard shortcut to focus the global search field.
- Added a first settings panel for local app preferences: design, language, week start, default view and task-count display.

## PWA installable app

- Added manifest, icons and app metadata.
- Added a small service worker with offline fallback.
- Added install-card in settings.
- Start URL is now `/board`, so the installed app opens directly in the board.

## Backup, Export und Datenverwaltung

- JSON-Backup aller Boards, Listen, Tasks und Task-Versionen ergänzt.
- CSV-Export für Aufgaben ergänzt.
- JSON-Import als neues Board ergänzt.
- Papierkorb-Leeren für soft-gelöschte Aufgaben ergänzt.
- endgültiges Löschen archivierter Boards ergänzt.
- Datenverwaltungsbereich in den Einstellungen ausgebaut.

## Active settings

- Made theme selection active: dark, light and system now apply immediately.
- Added a topbar theme toggle.
- Stored app preferences in localStorage via a shared preferences helper.
- Default board view now respects the saved preference when no `view` URL parameter is set.
- List task counts can now be hidden via settings.
- Language choice is stored and applied to the root `<html lang>` attribute.
- Added `docs/SETTINGS.md`.


## Vercel/GitHub preparation

- Added `docs/VERCEL_DEPLOYMENT.md` with deployment steps, Supabase redirect URLs and troubleshooting.
- Added `docs/GITHUB_PORTFOLIO.md` for portfolio positioning and commit/story ideas.
- Added a small `/api/health` endpoint.
- Added a GitHub Actions CI workflow for typecheck and build.
- Added `NEXT_PUBLIC_SITE_URL` to `.env.example` and app metadata.
- Updated project status: Backup is now shown as manual instead of planned.
- Clarified that language settings never auto-translate task content.

## UI polish before deployment

- Made the board header more compact so lists appear higher on the page.
- Removed the duplicate board-level search field; global search in the top bar remains the source of truth.
- Added a collapsible Details section for task stats, storage and sync status.
- Fixed completed-task counting in lists when tasks are marked done.
- Added an optional local completion chime for checked-off tasks.
- Added click-outside behavior for board and list menus.
- Wired the top-bar refresh icon to reload taskboard data.
- Added a small notifications popover explaining that push notifications are currently disabled.

## UI Polish: Header, Icon und Ansichts-Sync

- Details- und Filter-Buttons wurden direkt neben die Ansichtsumschaltung verschoben.
- Der doppelte Such-/Hinweisbereich im Board-Header wurde entfernt, damit die Listen schneller sichtbar sind.
- Die Board-Ansichtsbuttons und die Einstellung „Standardansicht“ verwenden jetzt denselben Wert.
- Der Erledigt-Sound wurde lauter gestellt.
- Das neue originale Taskboard-App-Icon wurde als Favicon, PWA-Icon, Windows/Handy-Icon und In-App-Logo eingebunden.



## Internationalisierung und Wochenstart

- UI-Übersetzungsschicht für Deutsch/Englisch ergänzt.
- Task-/Board-/Listen-Inhalte bleiben unverändert und werden nicht automatisch übersetzt.
- Wochentag-Auswahl für „Woche beginnt am“ auf alle sieben Tage erweitert.
- Neue Doku: `docs/I18N.md`.

## Latest polish

- Board header compacted around the active board name and board switcher pills.
- Remaining settings/data-management/PWA text wired into the German/English i18n system.
- Task titles can now be quick-edited by clicking the title text directly.
- Priority chips now have clearer low/normal/important styling.
- Completion sound made louder.

## UI micro polish

- Compact board header now uses board chips as the primary board selector and removes the duplicate large board title.
- Board menu is placed on the right side of the header and no longer gets clipped by the header card.
- Full task editor can now be opened via the pencil icon even while the title quick-edit field is focused.

## UI polish: Light contrast and color modes

- Improved light-mode contrast for account status, destructive cleanup actions and warning chips.
- Added selectable color modes: Cobalt/original, Violet, Emerald and Graphite.
- Accent colors now affect primary buttons, active view chips, focus states and important blue highlights.

### UI drawer/menu and light contrast polish
- Moved the Board menu next to Filter again for a more compact header.
- Raised the mobile drawer layer so underlying board controls cannot appear above it.
- Improved light-mode contrast for board labels and active board chips.
