# Drag & Drop

Die Tageslisten-Ansicht nutzt `@dnd-kit` für Drag & Drop.

## Aktueller Stand

- Aufgaben können innerhalb einer Liste sortiert werden.
- Aufgaben können zwischen Listen verschoben werden.
- Listen können über den Listenkopf vertikal verschoben werden.
- Die Reihenfolge wird nach dem Loslassen in Supabase gespeichert.
- Beim Ziehen an den oberen oder unteren Fensterrand wird automatisch gescrollt.

## UX-Regeln

- Aufgaben werden über die ganze Aufgabenzeile gezogen.
- Checkbox, Bearbeiten und Löschen starten kein Dragging.
- Listen werden über den Listenkopf gezogen, nicht über den Aufgabenbereich.
- Das Drag-Overlay ist bewusst hervorgehoben und darf visuell über den Fensterrand hinauslaufen.

## Stabilität

Die App verändert die React-State-Reihenfolge nicht mehr bei jedem Hover-Event. Dadurch wird vermieden, dass bei längeren Boards Render-Schleifen entstehen. Die finale Reihenfolge wird beim Drop berechnet und gespeichert.

## Noch offen

- Drop-Linien zwischen Listen könnten die Zielposition später noch eindeutiger machen.
- Touch-Optimierung für Handy/Tablet kommt später.


### Autoscroll direction fix

The board uses a custom autoscroll loop while dragging lists. Pointer position is tracked globally during drag operations so the direction can switch repeatedly without dropping the list first.
