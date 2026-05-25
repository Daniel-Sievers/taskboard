# Security

## Grundschutz

- App ist öffentlich erreichbar
- Inhalte sind nur nach Login sichtbar
- Supabase Row Level Security schützt Datensätze pro Nutzer

## Public Keys

Der Supabase Anon Key darf im Frontend verwendet werden.  
Sicherheit entsteht durch Row Level Security, nicht dadurch, dass der Key geheim bleibt.

## Optionale Verschlüsselung

Einzelne Tasks können später clientseitig verschlüsselt werden.  
Dann speichert Supabase nur `encrypted_payload`, aber nicht den Klartext.

Wichtig: Wenn das Verschlüsselungspasswort verloren geht, können diese Tasks nicht wiederhergestellt werden.
