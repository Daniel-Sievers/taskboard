# PWA / installierbare App

Taskboard ist jetzt als Progressive Web App vorbereitet.

## Was eingebaut ist

- `public/manifest.webmanifest` mit App-Name, Start-URL und Icons
- Start-URL: `/board`
- Standalone-Modus: Die App kann ohne normale Browser-Leiste geöffnet werden
- App-Icons in `public/icons/`
- Service Worker `public/sw.js` für einen einfachen Offline-Fallback
- Einstellungsseite mit Installationshinweis/Button
- App-Metadaten in `app/layout.tsx`

## Wichtig

Die PWA ist nicht dasselbe wie echter Offline-Sync. Aktuell bedeutet Offline nur:

- Die App-Shell kann grundsätzlich installiert/geöffnet werden.
- Falls keine Verbindung besteht, gibt es eine einfache Offline-Seite.
- Aufgaben offline bearbeiten und später synchronisieren kommt später mit IndexedDB und Sync-Queue.

## Lokal testen

Chrome/Brave erlaubt PWA-Tests auf `localhost`.

```powershell
npm run dev
```

Dann öffnen:

```text
http://localhost:3000/board
```

Im Browser-Menü sollte nach kurzer Zeit eine Option wie „App installieren“ erscheinen. Alternativ kann in den Einstellungen der Installationsbereich geprüft werden.

## Später auf Vercel

Für echte Nutzung wird die App über HTTPS auf Vercel ausgeliefert. Dann ist PWA-Installation auf Desktop und Handy realistischer als im lokalen Entwicklungsmodus.
