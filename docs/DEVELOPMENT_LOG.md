# Development Log

Dieses Projekt wird bewusst in nachvollziehbaren Ausbaustufen entwickelt. Der Log ist als Story für GitHub/Bewerbungen gedacht: Er zeigt nicht nur das Ergebnis, sondern auch die Entscheidungen, Probleme und Verbesserungen auf dem Weg.

## 0. Starter-Projekt

**Archiv:** `taskboard-starter.zip`

- Next.js/TypeScript-Grundstruktur
- erste Ordnerstruktur mit `app/`, `components/`, `lib/`, `hooks/`, `types/`, `docs/`
- Dokumentationsgrundlage

## 1. UI Preview

**Archiv:** `taskboard-ui-preview.zip`

- dunkle TasksBoard-inspirierte Oberfläche
- Demo-Tageslisten und Demo-Aufgaben
- erste lokale Interaktion

## 2. Supabase Auth

**Archiv:** `taskboard-auth-ready.zip`

- Magic-Link-Login vorbereitet
- Google-Login vorbereitet
- Demo-Modus, wenn Supabase nicht verbunden ist

## 3. Supabase-Daten

**Archiv:** `taskboard-supabase-data.zip`

- Datenbanktabellen vorbereitet
- RLS-Policies ergänzt
- echte Tasks werden online gespeichert
- Aufgaben bleiben nach Reload erhalten

## 4. Datenverwaltung

**Archiv:** `taskboard-data-management.zip`

- Listen erstellen, umbenennen, einklappen und löschen
- Tasks bearbeiten, abhaken und soft-deleten
- Notizen, Datum, Priorität, Tags und sensible Markierung vorbereitet

## 5. Drag & Drop Iterationen

**Archive:**

- `taskboard-drag-and-drop.zip`
- `taskboard-dndkit-upgrade.zip`
- `taskboard-dndkit-stability.zip`
- `taskboard-dndkit-scroll-and-sort-fix.zip`
- `taskboard-dndkit-list-autoscroll-fix.zip`
- `taskboard-dndkit-autoscroll-final.zip`
- `taskboard-dnd-polish-delete-lists.zip`
- `taskboard-dnd-autoscroll-direction-fix.zip`

Ergebnis:

- `@dnd-kit` statt nativer Browser-Drag-Events
- Tasks innerhalb und zwischen Listen verschieben
- Listen verschieben
- Auto-Scroll beim Listen-Drag
- Reihenfolge bleibt nach Reload erhalten

Wichtige Lernpunkte:

- State während Drag-Over nicht zu oft mutieren, sonst entstehen React-Render-Loops.
- Auto-Scroll muss die echte Pointer-Position während des Draggings kennen.
- Für gutes UX-Gefühl sind DragOverlay, Sortable-Kontexte und Scroll-Verhalten entscheidend.

## 6. Mehrere Boards

**Archiv:** `taskboard-boards.zip`

- mehrere Boards aus Supabase laden
- Board in der Sidebar wechseln
- neues Board erstellen
- aktives Board in der URL speichern
- Board umbenennen
- Board archivieren

## Nächste geplante Schritte

- Suche, Filter, Labels, Heute-fällig-Ansicht
- Einstellungen: Dark/Light/System, Sprache, Wochenstart
- PWA-Installierbarkeit
- GitHub/Vercel Deployment
- Export/Backup/Datenverwaltung
- Realtime, Offline-Sync und optionale Verschlüsselung

## 7. Responsive Sidebar

**Archiv:** `taskboard-responsive-sidebar.zip`

- Hamburger-Menü für kleinere Fenster ergänzt
- Sidebar öffnet als Drawer über dem Board
- Boards, Ansichten und Projektstatus sind auch bei halber Bildschirmbreite erreichbar
- Drawer schließt automatisch nach Auswahl eines Boards oder einer Ansicht

Lernpunkt:

- Desktop-Sidebar und mobile Navigation sollten dieselben Daten verwenden, aber unterschiedliche Layouts bekommen. Dadurch bleibt die App auf Laptop, halbem Fenster und später Handy bedienbar.

## Search, filters and labels

After boards and the responsive sidebar were working, the next feature block focused on finding tasks quickly. The board now supports text search over titles, notes and labels, plus structured filters for status, priority and labels. The "Heute fällig" sidebar item now opens a real filtered view for today's open tasks. A small Next.js warning about global smooth scrolling was also fixed by marking the root HTML element with `data-scroll-behavior="smooth"`.

## 9. Topbar-Suche und Settings-Basis

**Archiv:** `taskboard.zip`

- Die Suche in der Topbar ist jetzt aktiv und nutzt denselben Suchfilter wie die Board-Suche.
- Der Suchbegriff wird in der URL als `q` gespeichert, damit Links und Reloads nachvollziehbar bleiben.
- `/` fokussiert das globale Suchfeld.
- Die Einstellungen haben nun eine erste App-Verhalten-Sektion für Design, Sprache, Wochenstart, Standardansicht und Aufgabenanzahl.

Lernpunkt:

- Globale UI-Elemente wie die Topbar sollten ihren Zustand über URL-Parameter oder zentralen State mit der eigentlichen Board-Ansicht teilen. Sonst entstehen zwei getrennte Suchfelder, die sich widersprechen können.

## PWA-Basis

Die App wurde als installierbare PWA vorbereitet: Manifest, Icons, Service Worker-Fallback, Start-URL `/board` und Installationshinweis in den Einstellungen. Echter Offline-Sync bleibt ein separater späterer Schritt.

## Schritt: Backup und Datenverwaltung

Die Einstellungen wurden um eine echte Datenverwaltungssektion erweitert. Nutzer können JSON-Backups herunterladen, Aufgaben als CSV exportieren, ein JSON-Backup als neues Board importieren und alte gelöschte Daten endgültig entfernen. Damit wird Vendor-Lock-in reduziert und die App wird sicherer für die tägliche Nutzung.

## Schritt: aktive Einstellungen

Die bisher nur vorbereiteten App-Einstellungen wurden verdrahtet. Dark/Light/System wirkt nun direkt, die Topbar hat einen Schnellumschalter und die gewählte Standardansicht wird beim Öffnen des Boards berücksichtigt. Außerdem kann die Aufgabenanzahl in Listen ein- und ausgeblendet werden.

Lernpunkt:

- Für eine spätere GitHub-Präsentation ist sichtbar, dass Einstellungen nicht nur UI-Dekoration sind, sondern wirklich App-Zustand beeinflussen. Der aktuelle Light Mode nutzt noch globale CSS-Overrides; ein saubereres Design-Token-System wäre ein möglicher späterer Refactor.


## Paket: Vercel/GitHub-Vorbereitung

Nach PWA, Backup/Export und aktiven Einstellungen wurde das Projekt für den nächsten Veröffentlichungsschritt vorbereitet. Vercel wird als Hosting-Ziel dokumentiert, GitHub als Portfolio-Basis beschrieben und die Projektstatus-Anzeige wurde angepasst: Backup ist aktuell manuell über JSON/CSV möglich, während Vercel der nächste Deployment-Schritt ist.

## UI polish before deployment

Before deploying, the board UI was tightened to behave more like the reference TasksBoard workflow. The duplicate search field inside the large hero area was removed in favor of the global search field in the top bar. Statistics were moved behind a collapsible Details button so that day lists are visible sooner after opening the app. Dropdown menus now close when clicking outside of them, and the top-bar icons gained clearer behavior: refresh reloads board data, notifications open a small explanatory popover, and settings links to the settings page. A generated local completion chime was added for checking off tasks; no external/proprietary sound asset is bundled.

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

### UI polish: board switcher and compact editing

- Moved the active board name and board switcher into the compact header.
- Removed the large static marketing title from the board view.
- Added quick title editing by clicking a task title.
- Added remaining backup/PWA texts to i18n.

### UI micro polish: board header and quick editor

After testing the board switcher and inline title editing, the header was tightened further: the duplicate large board title was removed, the board action menu was moved to the right side of the header, and menu overflow was fixed so archive/rename actions remain fully visible. The task quick-edit flow was also adjusted so the full editor can be opened directly from the pencil icon while a title field is active.

### Light mode contrast and color modes

The light theme received another contrast pass, especially around the signed-in account pill and disabled cleanup actions. A new accent-theme setting was added so the interface can be styled in several palettes while keeping the same layout and task data.

### UI drawer/menu and light contrast polish
- Moved the Board menu next to Filter again for a more compact header.
- Raised the mobile drawer layer so underlying board controls cannot appear above it.
- Improved light-mode contrast for board labels and active board chips.


## Realtime Sync

- Added Supabase Realtime subscription for boards, lists and tasks.
- Added a Live-Sync status pill to the board header.
- Added `supabase/migrations/0004_enable_realtime.sql`.
- Added `docs/REALTIME_SYNC.md`.


## Realtime Sync v1: online getestet

Realtime wurde lokal und online getestet: Änderungen auf dem Handy erscheinen unmittelbar auf dem Laptop und umgekehrt. Die erste Version lädt bei relevanten Supabase-Realtime-Events das aktive Board neu. Das ist bewusst robust und einfach gehalten; spätere Optimierungen können gezieltere Updates einzelner Tasks oder Listen ergänzen.

## Mobile Touch UX

Auf Touch-Geräten war Drag & Drop zunächst zu aggressiv: Beim normalen Wischen über einem Task wurde der Task sofort gezogen. Die DnD-Sensoren wurden deshalb getrennt:

- `MouseSensor` für Desktop mit kurzer Bewegungsdistanz
- `TouchSensor` für Handy/Tablet mit Long-Press-Delay und Toleranz
- `KeyboardSensor` bleibt für Tastaturbedienung erhalten

Dadurch bedeutet kurzes Wischen auf dem Handy wieder Scrollen, während längeres Halten Drag & Drop startet.

## Dependency-Versionierung

Ein wichtiges Deployment-Learning war, dass `latest` bei Framework-Abhängigkeiten unvorhersehbare Builds verursachen kann. Ein Next.js-Upgrade auf eine neuere Major-Version erzeugte lokal/Vercel unterschiedliche Build-Probleme. Das Projekt pinnt deshalb zentrale Versionen und committet `package-lock.json`, damit lokale Builds und Vercel-Deployments reproduzierbarer bleiben.


## Mobile Touch UX und horizontale Ansicht

Nach dem erfolgreichen Realtime-Test auf Handy und Desktop wurde die mobile Bedienung verbessert. Auf Touch-Geräten startet Drag & Drop nun erst nach kurzem Halten, während normales Wischen über Tasks zum Scrollen genutzt werden kann. Dafür wurde der DnD-Sensor-Aufbau von einem allgemeinen PointerSensor auf getrennte Mouse- und Touch-Sensoren umgestellt.

Die horizontale Ansicht wurde ebenfalls näher an das TasksBoard-Gefühl gebracht: Listen werden als seitlich swipebare Spalten dargestellt, die auf dem Handy per horizontalem Scroll-Snap durchgeblättert werden können. Außerdem wurde die PWA-Manifest-Ausrichtung auf Portrait gesetzt, damit die installierte App nicht ungewollt ins Querformat kippt.

Lernpunkte:

- Desktop-Mausverhalten und Mobile-Touchverhalten sollten getrennt gedacht werden.
- `touch-action: none` kann auf Touch-Geräten normales Scrollen blockieren.
- Ein Long-Press-Delay verhindert, dass jeder Scrollversuch sofort als Drag erkannt wird.
- Für reproduzierbare Deployments sind gepinnte Dependency-Versionen besser als `"latest"`.



## Trash and Archive Management

The data management area was expanded from simple bulk cleanup actions into a real recovery interface.

Added:

- deleted tasks are now visible in a dedicated trash section
- individual deleted tasks can be restored
- individual deleted tasks can be permanently deleted
- the full trash can still be emptied in one action
- archived boards are listed in the settings
- archived boards can be restored
- archived boards can be permanently deleted
- dangerous permanent deletion actions always ask for confirmation

Learning point:

- Soft delete and archive states are more useful when the user can inspect and recover items before permanently deleting them. Bulk cleanup is still useful, but it should not be the only management option.
