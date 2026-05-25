# Database

## Erste Tabellen

```txt
profiles
boards
lists
tasks
task_versions
```

## Tasks

Wichtige Felder:

```txt
id
user_id
board_id
list_id
title
notes
status
scheduled_date
position
is_encrypted
encrypted_payload
completed_at
deleted_at
created_at
updated_at
version
```

## Sicherheit

Alle Tabellen sollen Row Level Security verwenden, sodass Nutzer nur ihre eigenen Daten lesen und ändern können.
