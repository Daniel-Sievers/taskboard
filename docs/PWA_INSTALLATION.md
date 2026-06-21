# PWA / installierbare App

Taskboard ist als Progressive Web App vorbereitet. Die App kann über unterstützte Browser installiert und wie eine eigene App gestartet werden.

## Was eingebaut ist

- `public/manifest.webmanifest` mit App-Name, Start-URL, Shortcuts und Icons
- identische Fallback-Datei `public/manifest.json`
- Start-URL für die private App: `/board`
- zusätzlicher Manifest-Shortcut zur öffentlichen Demo: `/demo`
- Standalone-Modus: Die App kann ohne normale Browser-Leiste geöffnet werden
- App-Icons in `public/icons/`
- Maskable Icons für Android-/Chromium-Installationen
- Apple Touch Icon für iOS / Homescreen
- Favicon-Dateien für Browser-Tabs und GitHub/Vercel-Vorschauen
- Service Worker `public/sw.js` für einen einfachen Offline-Fallback
- Offline-Seite `public/offline.html`
- Einstellungsseite mit Installationshinweis/Button
- App-Metadaten in `app/layout.tsx`

## Öffentliche Demo vs. private App

Für Bewerbungen sollte der sichtbare GitHub-Website-Link auf die Demo zeigen:

```text
https://taskboard-ten-steel.vercel.app/demo
```

Die installierte private App startet bewusst auf:

```text
/board
```

Grund: Die PWA soll für die echte Nutzung direkt in das private Board starten. Die Demo bleibt aber über `/demo` und über den Manifest-Shortcut erreichbar.

## Wichtig

Die PWA ist nicht dasselbe wie echter Offline-Sync. Aktuell bedeutet Offline nur:

- Die App-Shell und Offline-Seite sind vorbereitet.
- Manifest und Icons werden gecacht.
- Wenn keine Verbindung besteht, zeigt die App eine einfache Offline-Seite.
- Aufgaben offline bearbeiten und später synchronisieren kommt später mit IndexedDB und Sync-Queue.

## Browser-Hinweise

Chromium-Browser wie Chrome, Edge und Brave unterstützen installierbare PWAs am zuverlässigsten.

Firefox kann sich anders verhalten:

- Der Installationshinweis erscheint ggf. nicht wie in Chrome/Edge.
- Angepinnte Seiten oder Desktop-Verknüpfungen können weiterhin ein Firefox-Symbol zeigen.
- Das bedeutet nicht zwingend, dass Manifest oder Icons falsch sind.

Safari/iOS nutzt eher **Zum Home-Bildschirm hinzufügen** und wertet besonders `apple-touch-icon` und die Apple-Web-App-Metadaten aus.

## Lokal testen

Chrome/Brave erlaubt PWA-Tests auf `localhost`.

```powershell
npm run dev
```

Dann öffnen:

```text
http://localhost:3000/board
```

Im Browser-Menü sollte nach kurzer Zeit eine Option wie **App installieren** erscheinen. Alternativ kann in den Einstellungen der Installationsbereich geprüft werden.

## Auf Vercel testen

Für echte Nutzung wird die App über HTTPS auf Vercel ausgeliefert. Dann ist PWA-Installation auf Desktop und Handy realistischer als im lokalen Entwicklungsmodus.

Test-Adressen:

```text
https://taskboard-ten-steel.vercel.app/board
https://taskboard-ten-steel.vercel.app/demo
https://taskboard-ten-steel.vercel.app/manifest.webmanifest
```
