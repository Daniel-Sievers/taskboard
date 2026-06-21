# Node modules and build output

`node_modules/` and `.next/` are local/generated folders. They are not part of the source repository.

## Repository boundary

The repository stores source code, configuration, migrations, docs and lockfiles. Dependencies are restored with `npm ci`; build output is recreated with `npm run build`.

## Ignored local files

```txt
node_modules/
.next/
.vercel/
.env.local
*.tsbuildinfo
```

## Build reproducibility

`package-lock.json` is committed so clean installs use the same resolved dependency versions locally, in GitHub Actions and on Vercel.
