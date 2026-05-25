# Supabase Setup

Diese App nutzt Supabase für Login, Datenbank und später Synchronisierung zwischen Geräten.

## 1. Environment-Datei anlegen

Kopiere `.env.example` zu `.env.local` und trage deine Projektwerte ein:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

Der `NEXT_PUBLIC_SUPABASE_ANON_KEY` darf der neue `sb_publishable_...` Key von Supabase sein.

Nicht verwenden:

```env
SUPABASE_SERVICE_ROLE_KEY=...
```

Der Service-Role/Secret-Key gehört niemals ins Frontend und niemals auf GitHub.

## 2. Migrationen ausführen

Im Supabase Dashboard:

```txt
SQL Editor → New query
```

Dann diese Dateien nacheinander kopieren und ausführen:

```txt
supabase/migrations/0001_initial_schema.sql
supabase/migrations/0002_rls_policies.sql
supabase/migrations/0003_auth_helpers.sql
```

Danach existieren:

```txt
profiles
boards
lists
tasks
task_versions
```

RLS ist aktiv, sodass eingeloggte Nutzer nur ihre eigenen Daten sehen und ändern können.

## 3. Lokal neu starten

Nach Änderungen an `.env.local`:

```bash
npm run dev
```

Falls der Server schon läuft: mit `Strg + C` stoppen und neu starten.

## 4. Login testen

Öffne:

```txt
http://localhost:3000/login
```

Magic Link per E-Mail senden, Link öffnen und dann `/board` testen.

## 5. Was die App jetzt macht

Nach Login erstellt die App bei Bedarf automatisch:

- dein `Hauptboard`
- Tageslisten für die nächsten Tage
- echte Tasks in Supabase, wenn du Aufgaben hinzufügst

Wenn keine Supabase-Werte gesetzt sind oder du nicht eingeloggt bist, läuft die App im Demo-Modus.
