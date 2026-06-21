# CI and build checks

Taskboard includes a small GitHub Actions workflow that verifies the repository can be installed, typechecked and built from a clean checkout.

## Workflow

```txt
.github/workflows/ci.yml
```

The workflow runs on pushes and pull requests to `main`.

```yaml
npm ci
npm run typecheck
npm run build
```

## Purpose

The CI check documents that the project is reproducible outside the local development machine. It also keeps the lockfile and dependency versions visible as part of the build process.

## Environment variables

The CI build does not require private Supabase secrets. The app can build even when production Supabase environment variables are not present, because the public demo and build path do not depend on authenticated runtime data.

## Local equivalent

```bash
npm ci
npm run typecheck
npm run build
```
