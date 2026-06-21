# PWA installation

Taskboard includes a PWA foundation for an installable app experience.

## Implemented

- Web manifest
- App icons
- Maskable icons
- Apple Touch Icon
- Service worker foundation
- Private-board start URL
- Demo shortcut
- Offline fallback page foundation

## Manifest behavior

The main app start URL points to the authenticated board. The public demo remains available through `/demo` and through the manifest shortcut.

## Browser behavior

Install prompts and icon behavior are partly controlled by each browser and platform. Chrome, Edge, Firefox, Android and iOS can display PWA installation differently even with the same manifest.

## Design goal

The PWA setup supports the core idea of Taskboard as a private productivity app that can feel closer to a native app while still being a web project.
