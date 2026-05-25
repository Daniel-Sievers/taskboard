# GitHub und Portfolio-Story

Dieses Projekt eignet sich gut als Bewerbungsprojekt, weil es kein künstliches Tutorial-Projekt ist, sondern ein reales persönliches Problem löst.

## Kernstory

Ausgangspunkt war der Wunsch nach einer privaten Alternative zu TasksBoard / Google Tasks Board:

- direktes Öffnen im Board
- stabiles dunkles Design
- mehrere Geräte
- eigene Kontrolle über Daten
- keine nervige Startseite
- installierbar wie eine App

## Technische Lernpunkte

- Next.js App Router
- TypeScript-Komponentenstruktur
- Supabase Auth
- Supabase Row Level Security
- Postgres-Datenmodell für Boards, Listen und Tasks
- Drag & Drop mit `@dnd-kit`
- PWA-Grundlagen
- JSON/CSV Export
- responsive Sidebar
- schrittweise Produktentwicklung

## Entwicklungspakete

Die Entwicklung wurde bewusst in Paketen dokumentiert:

1. Starter-Projekt und UI-Grundgerüst
2. Supabase Auth
3. Supabase-Datenmodell und echte Task-Speicherung
4. Listen- und Task-Verwaltung
5. Drag & Drop Iterationen
6. mehrere Boards und Sidebar
7. Suche, Filter und Labels
8. PWA-Basis
9. Backup, Export und Import
10. aktive Einstellungen
11. Vercel/GitHub-Vorbereitung

## Was im README sichtbar sein sollte

- kurze Motivation
- Screenshot oder GIF
- Demo-Link
- Tech Stack
- Feature-Liste
- lokales Setup
- Datenschutz-Hinweis
- Roadmap
- Entwicklungsgeschichte als kurzer Abschnitt

## Gute Commit-Ideen

```txt
feat: add supabase auth
feat: persist boards lists and tasks
feat: add drag and drop sorting
feat: add multiple boards
feat: add search filters and labels
feat: add pwa manifest and install card
feat: add backup export and import
feat: add active app preferences
chore: add vercel deployment docs
```

## Hinweis zu privaten Daten

Vor einem öffentlichen GitHub-Repo prüfen:

- `.env.local` ist nicht enthalten.
- keine echten Supabase Secret Keys im Repo.
- keine privaten Screenshots mit echten Aufgaben.
- keine persönlichen Daten in Demo-Dateien.
