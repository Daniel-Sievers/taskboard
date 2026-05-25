# UI polish notes

This iteration focuses on making the app feel closer to the target TasksBoard workflow before deployment.

## Compact board header

The board page now prioritizes the actual task lists. The duplicate search field inside the board header was removed because the top bar already contains the global search. Filters and stats remain available, but are tucked behind compact buttons.

## Details panel

Task stats, estimated storage size and sync status are useful, but they do not need to occupy the first screen on every visit. They are now shown through a collapsible Details control.

## Menus

Board and list dropdown menus close when the user clicks elsewhere on the page. This matches common desktop-app behavior and avoids requiring a second click on the same trigger.

## Sound effects

Checking off an open task can play a short generated chime using the Web Audio API. The app does not bundle or copy proprietary sounds from other products. Sound effects can be disabled in settings.

## Top-bar controls

- Refresh reloads the current board data.
- Theme toggles between light and dark.
- Notifications currently show a placeholder popover because push notifications are intentionally out of scope for the current version.
- Settings opens the settings page.


## Kompakter Board-Header

Der Board-Header zeigt nun die Ansichtsbuttons, Details und Filter in einer gemeinsamen Aktionszeile. Dadurch entfällt der zusätzliche Hinweis-/Suchbereich unterhalb des Headers und die ersten Listen sind schneller sichtbar.

## Icon-System

Das Projekt verwendet ein eigenes Icon-Set in `public/icons/` sowie `public/favicon.ico`. Diese Assets werden vom Webmanifest, der Browser-Tab-Anzeige und der installierbaren PWA verwendet.

## Ansichts-Synchronisierung

Die Buttons „Tageslisten“ und „Horizontal“ aktualisieren nun dieselbe Einstellung wie die Standardansicht in den Settings. Dadurch ist die gewählte Ansicht konsistenter zwischen Board und Einstellungen.
