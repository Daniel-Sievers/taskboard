# Settings

The settings page now contains active local preferences. They are stored in `localStorage` under `taskboard:preferences` and applied immediately in the browser.

## Active preferences

- **Theme:** dark, light or system. The app writes the resolved value to `document.documentElement.dataset.theme`.
- **Language:** German or English. The selected language is stored and applied to the `<html lang>` attribute. Full UI translation is still a later step.
- **Week start:** Monday or Sunday. The preference is stored and exposed on the root element for future calendar logic.
- **Default view:** Tageslisten or Horizontal. When `/board` has no explicit `view` query parameter, the saved default is used.
- **Task counts:** toggles list-level task count display.

## Implementation notes

The current UI still mostly uses Tailwind utility classes. To avoid rewriting every component at once, the light theme is implemented as a global override layer in `app/globals.css` scoped to `html[data-theme="light"]`.

Later, this can be replaced with a cleaner token-based design system using CSS variables and semantic component classes.


## Sprache

Die Spracheinstellung ist nur für die App-Oberfläche gedacht. Task-Titel, Notizen und Labels werden nicht automatisch übersetzt. Deutsch, Englisch, Emojis und eigene Kürzel können jederzeit gemischt werden.
