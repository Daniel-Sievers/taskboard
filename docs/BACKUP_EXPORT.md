# Backup, Export und Datenverwaltung

Dieses Projekt hat jetzt eine erste echte Datenverwaltungsseite unter `/settings`.

## Enthaltene Funktionen

- JSON-Backup aller eigenen Boards, Listen, Aufgaben und Task-Versionen
- CSV-Export der Aufgaben
- JSON-Import als neues Board
- Papierkorb leeren: soft-gelöschte Aufgaben endgültig löschen
- archivierte Boards endgültig löschen
- geschätzte Speicheranzeige anhand der exportierten JSON-Daten

## JSON-Backup

Der JSON-Export ist der wichtigste Sicherheitsanker. Er enthält die Daten in einem strukturierten Format:

```txt
boards
lists
tasks
taskVersions
```

Vor destruktiven Aktionen wie „Papierkorb leeren“ oder „archivierte Boards löschen“ sollte ein JSON-Backup exportiert werden.

## CSV-Export

Der CSV-Export enthält Aufgaben in Tabellenform und ist für Excel, LibreOffice oder schnelle Kontrollen gedacht. Er ist kein vollständiger Restore-Ersatz.

## JSON-Import

Der Import erzeugt aktuell ein neues Board mit dem Namen `Import ...`. Die ursprünglichen IDs werden nicht direkt wiederverwendet, damit es keine Konflikte mit bestehenden Daten gibt.

Die Importlogik ist bewusst konservativ:

- importiert das erste Board aus dem Backup als neues Board
- erstellt dazugehörige Listen neu
- erstellt dazugehörige Aufgaben neu
- gelöschte Aufgaben werden nicht als gelöscht importiert

## Noch offen

- Wiederherstellen einzelner gelöschter Aufgaben
- Detailansicht des Papierkorbs
- Export pro Board
- Export nur eines Zeitraums
- Import-Mapping für mehrere Boards in einem Schritt
