# GitHub Repository Settings

Diese Datei erklärt, welche GitHub-Einstellungen nicht automatisch aus dem Code übernommen werden.

## About-/Website-Link

Der Link im rechten GitHub-About-Bereich wird **nicht** automatisch aus `README.md`, `package.json` oder einer Datei im Projektordner gelesen.

Er ist eine Repository-Metadaten-Einstellung und muss in GitHub manuell gesetzt werden.

Empfohlener Website-Link für Bewerbungen:

```text
https://taskboard-ten-steel.vercel.app/demo
```

Warum der Demo-Link besser ist als die normale App-URL:

- Bewerbungsleser landen direkt in einer testbaren Demo.
- Es ist kein Magic-Link-Login nötig.
- Es werden keine privaten Daten angezeigt.
- Die echte private App bleibt weiter unter der normalen URL erreichbar.

## So setzt du den Link in GitHub

1. GitHub-Repository öffnen.
2. Rechts im Bereich **About** auf das Zahnrad klicken.
3. Bei **Website** eintragen:

   ```text
   https://taskboard-ten-steel.vercel.app/demo
   ```

4. Optional bei **Description** eintragen:

   ```text
   Personal taskboard app built with Next.js, Supabase and Vercel. Public demo available without login.
   ```

5. Speichern.

## Optional: Topics

Sinnvolle GitHub Topics:

```text
nextjs
react
typescript
supabase
vercel
pwa
taskboard
portfolio-project
```

## Wichtig

Der README-Link bleibt trotzdem wichtig. Die README sollte weiterhin beide URLs nennen:

- Public Demo: `/demo`
- Live App: normale App mit Login
