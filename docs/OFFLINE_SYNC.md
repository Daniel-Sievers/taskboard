# Offline Sync

## Ziel

Die App soll kurzfristig offline funktionieren.

## Geplanter Ansatz

- Tasks lokal in IndexedDB speichern
- Änderungen offline in eine Sync Queue legen
- bei Wiederverbindung synchronisieren
- Konfliktregel: Last-write-wins

## Status

Noch nicht implementiert.
