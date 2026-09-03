---
name: dev-verify
description: Run and smoke-test this project — start backend/admin, get a JWT, hit an endpoint, and read the failure. Use after changing an API or an admin screen, when asked to "chạy thử"/"kiểm tra"/"test", or when a request returns 400/401/403/404/CORS and the cause is not obvious. There is no test suite, so this is the verification step.
---

# Run & verify

There are **no automated tests** in this repo (the Jest block in
`backend/package.json` has no `test` script and no `.spec.ts` files). Lint +
build + a real HTTP round-trip is the whole safety net. Do all three.

## Static gate — always run before claiming done

```bash
cd backend && npm run lint && npm run build
cd admin   && npm run lint && npm run build
```

`admin` throws at config load if `NEXT_PUBLIC_API_URL` is unset — that is a
missing env var, not a code bug.

## Start the apps

Run these in the **background** (they never exit) and read the logged port
rather than assuming it:

```bash
cd backend && npm run dev     # NODE_ENV=development → .env.development → port 8010
cd admin   && npm run dev     # next dev --port 3001
```

Ports are inconsistent across files — verify before debugging a connection
error:

| | dev | prod / PM2 |
|---|---|---|
| backend | **8010** (`.env.development`) | 8011 (`ecosystem.config.js`, `.env.example`) |
| admin | 3001 (`package.json`) | 5011 (`ecosystem.config.js`) |

`admin/.env.development` points at `http://localhost:8010/v1`. If the backend
comes up on 8011, the admin panel gets connection-refused on every call.

MongoDB must be reachable at `MONGO_URI` (default `mongodb://localhost:27017`,
db `xgym`). `synchronize` is on in development, so schema changes land on
restart — restart the backend after touching an entity.

## Smoke-test an endpoint

All routes are versioned: `http://localhost:8010/v1/<route>`. There is **no**
`/api` prefix (it is commented out in `main.ts`) and no Swagger UI.

Public endpoint:
```bash
curl -s http://localhost:8010/v1/service-categories/public
```

Authenticated — log in, keep the token, call:
```bash
TOKEN=$(curl -s -X POST http://localhost:8010/v1/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"<admin-email>","password":"<password>"}' \
  | node -pe 'JSON.parse(require("fs").readFileSync(0)).data.token')

curl -s http://localhost:8010/v1/products -H "Authorization: Bearer $TOKEN"
```

Every response is enveloped:
`{ success, statusCode, message, timestamp, path, data }` — the payload is under
`data`. A response shaped `{ data: { data: ... } }` means a service wrapped it a
second time by hand.

## Reading failures

| Symptom | Cause |
|---|---|
| **404** on a route that exists | missing `/v1`, or the `Routes` enum value ≠ the path being called |
| **400** `property X should not exist` | `forbidNonWhitelisted`: field sent but not declared in the DTO |
| **400** with a Vietnamese message | a service-level business rule — read the service, it is intentional |
| **401** on a request that has a token | `JwtAuthGuard` reads cookie `token` first, then `Authorization`; an expired/stale cookie beats a good header |
| **401** loop in the admin panel | refresh failed → `src/config/api.ts` clears `localStorage`; check `/v1/auth/refresh` and that `refreshToken` exists |
| **403** | `PermissionsGuard`: resource missing from `PermissionResource`, or the role lacks it in `generateGlobalPermissions()`. Cached per user — restart or change role to invalidate |
| endpoint reachable by curl, blocked in browser | origin missing from `ALLOWED_ORIGINS` in `.env.development` |
| new endpoint returns 401 with no token | expected — guards are global; anonymous routes need **both** `@Public()` and `@SkipPermissions()` |
| uploaded image 404s | files serve from `uploads/` at the backend origin; admin proxies `/uploads/:path*` via `next.config.ts` rewrites |

Backend logs go to stdout and `backend/logs/` (winston). `LoggingInterceptor`
prints every request — read it before guessing.

## Verify in the browser

For an admin screen, drive it rather than assuming: log in at
`http://localhost:3001/login`, reach the screen **from the sidebar** (a screen
with no `AppSidebar.tsx` entry is unreachable in practice), do one
create/edit/delete round-trip, and reload to confirm it persisted. Use the
`claude-in-chrome` tools when a visual check is wanted.

## Reporting

State what was actually run and what came back. If the build passed but the
endpoint was never called, say so — do not report a feature verified on the
strength of a clean `npm run build`.
