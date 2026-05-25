# Node modules, build output and app size

`node_modules/` is only needed during development and while building the app.
It contains all downloaded npm packages such as Next.js, React, Supabase and dnd-kit.

Important points:

- `node_modules/` is not committed to GitHub.
- `node_modules/` is not uploaded to Vercel as part of the app bundle.
- Vercel installs dependencies on its build server from `package.json` and `package-lock.json`.
- The browser only receives the optimized build output, not the entire `node_modules` folder.
- When packaging a ZIP for sharing, delete `node_modules/`, `.next/` and `.env.local` first.

The final deployed app should be much smaller than the local development folder.
