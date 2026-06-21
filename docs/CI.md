# CI / Build Check

Taskboard uses a small GitHub Actions workflow to verify that the project can be installed, typechecked and built from a clean checkout.

Workflow file:

```txt
.github/workflows/ci.yml
```

## What the workflow checks

On every push to `main`, every pull request into `main`, and manual runs, GitHub Actions performs:

```bash
npm ci
npm run typecheck
npm run build
```

This checks that:

- dependencies can be installed from `package-lock.json`
- TypeScript types are valid
- the Next.js production build succeeds

## Why this matters

The app is deployed through Vercel, but a separate GitHub build check is still useful for a portfolio project because it shows that the repository is reproducible outside the local machine.

It also documents one of the main learnings from the project: pinned dependency versions and a committed `package-lock.json` make builds more predictable than relying on `latest` framework versions.

## Environment variables

The build check does not require private Supabase secrets. If Supabase environment variables are missing, the app can still build in demo mode.

Never add `.env.local`, Supabase service role keys or production secrets to the repository or directly into the workflow file.

## Local equivalent

Before pushing, the same checks can be run locally:

```powershell
npm run typecheck
npm run build
```

If both commands pass locally, the GitHub Actions workflow should usually pass as well.
