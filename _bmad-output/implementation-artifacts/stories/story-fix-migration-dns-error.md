# Bug: Fix Deployment Migration DNS Error

## Description
The deployment is failing during the build phase with `getaddrinfo ENOTFOUND` for the database host.
This is because `npm run migrate:all` is executing in the `buildCommand`, which runs in an isolated build environment without access to the private network services (like the managed Postgres database).

## Error Log
```
[Migration] ✗ Failed: 001_initial_schema.sql Error: getaddrinfo ENOTFOUND dpg-d4h0qaruibrs73dafu70-a
```

## Proposed Fix
Move the migration command from `buildCommand` to `startCommand` in `render.yaml`. The start command runs in the runtime environment where the database is accessible.

## Tasks
- [ ] Modify `render.yaml`: Remove `npm run migrate:all` from `buildCommand`.
- [ ] Modify `render.yaml`: Add `npm run migrate:all` to the beginning of `startCommand`.
- [ ] Commit and push changes.
