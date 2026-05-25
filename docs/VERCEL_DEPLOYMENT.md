# Vercel Deployment

Diese Anleitung beschreibt, wie Taskboard online auf Vercel bereitgestellt wird.

## Wichtiges Verständnis

Vercel hostet die App. Supabase speichert die Daten.

Das bedeutet:

- Vercel ist nicht das Datenbank-Backup.
- Deine Boards, Listen und Aufgaben liegen weiterhin in Supabase.
- Der Code liegt später idealerweise auf GitHub.
- Die App läuft online über eine Vercel-URL.
- Backups deiner Task-Daten macht die App über JSON/CSV-Export und später optional über Supabase-Backups.

## Vorbereitung

Vor dem Deployment sollte lokal funktionieren:

- Login per Supabase
- Board öffnen
- Task erstellen
- Reload-Test: Task bleibt erhalten
- PWA-Manifest ist vorhanden

## GitHub vorbereiten

1. Neues GitHub Repository erstellen, zum Beispiel `taskboard`.
2. Im Projektordner prüfen, dass `.env.local`, `.next` und `node_modules` nicht enthalten sind.
3. Erste Version committen.

```bash
git init
git add .
git commit -m "Initial taskboard app"
git branch -M main
git remote add origin <dein-github-repo-url>
git push -u origin main
```

## Vercel-Projekt erstellen

1. Bei Vercel einloggen.
2. `Add New` → `Project`.
3. GitHub Repository `taskboard` importieren.
4. Framework Preset sollte automatisch `Next.js` sein.
5. Environment Variables eintragen.

## Environment Variables auf Vercel

In Vercel unter `Project Settings` → `Environment Variables` eintragen:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-publishable-key
NEXT_PUBLIC_SITE_URL=https://deine-vercel-url.vercel.app
```

Alternativ wird auch unterstützt:

```env
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=dein-publishable-key
```

Nie eintragen:

```env
SUPABASE_SERVICE_ROLE_KEY=...
```

Der Service-Role-Key gehört nicht ins Frontend und nicht in Vercel-Variablen, die mit `NEXT_PUBLIC_` anfangen.

## Supabase Redirect URLs ergänzen

In Supabase:

`Authentication` → `URL Configuration`

Dort ergänzen:

```txt
https://deine-vercel-url.vercel.app/auth/callback
https://deine-vercel-url.vercel.app/board
```

Für lokale Entwicklung bleibt zusätzlich sinnvoll:

```txt
http://localhost:3000/auth/callback
http://localhost:3000/board
```

## Nach dem Deployment testen

1. Vercel-URL öffnen.
2. Login per Magic Link testen.
3. Prüfen, ob der Link zurück zur Vercel-App führt.
4. Task erstellen.
5. Seite neu laden.
6. Auf zweitem Gerät öffnen und mit demselben Account einloggen.
7. Prüfen, ob die Daten erscheinen.

## PWA installieren

Nach erfolgreichem Deployment kann die App im Browser installiert werden.

- Chrome/Edge Desktop: Installationssymbol in der Adressleiste oder Browser-Menü.
- Android: Browser-Menü → Zum Startbildschirm hinzufügen.
- iOS: Teilen → Zum Home-Bildschirm.

## Troubleshooting

### Login landet wieder lokal oder funktioniert nicht

Dann fehlt wahrscheinlich die Vercel-URL in Supabase unter Redirect URLs.

### App startet im Demo-Modus

Dann fehlen auf Vercel die Supabase Environment Variables oder sie heißen falsch.

### Daten werden nicht gespeichert

Prüfen:

- Supabase URL stimmt.
- Publishable/Anon Key stimmt.
- SQL-Migrationen wurden ausgeführt.
- Row Level Security Policies sind aktiv.

### PWA ist nicht installierbar

Prüfen:

- App läuft über HTTPS.
- `manifest.webmanifest` ist erreichbar.
- Icons sind erreichbar.
- Service Worker wird in Production registriert.

## Status

Vercel macht die App online verfügbar. Automatische Datenbank-Backups sind damit nicht automatisch erledigt. Die App hat aktuell manuelle JSON-/CSV-Exports. Eine spätere Verbesserung wäre ein automatisierter Backup-Workflow.
