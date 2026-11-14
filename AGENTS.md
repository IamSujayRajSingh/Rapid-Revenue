# Project Rules — AI Website Repair and Development

## Mission
Repair and maintain this existing exported website with the smallest safe changes. Preserve current visual design, business logic, URLs, working features, and the chosen framework unless there is a demonstrated reason to change them.

## Inspect first
- Read README files, package.json, lockfiles, framework configuration, frontend and backend source, environment-variable references, and existing tests before suggesting a fix.
- Determine the original builder and whether backend/auth/database/storage/integrations are platform-hosted or present locally.
- Never claim an app works end to end solely because the frontend builds.

## Safe execution
- Prefer a read-only diagnosis before modifications, then fix reproducible local issues incrementally.
- Keep changes limited to the current project directory. Do not remove large directories, reset Git, rewrite the app, or force-upgrade dependencies without explicit approval.
- Never deploy, push, publish, send email, trigger production workflows, alter external services, change DNS, rotate secrets, or run remote database migrations without explicit user approval.
- Treat every connected service as production until confirmed otherwise. Do not test live writes, payments, emails, SMS, or destructive actions.
- Use separate development credentials/data. Never commit or print real secrets, .env files, tokens, or customer data.
- Prefer the package manager and versions selected by the repository. Do not delete lockfiles merely to resolve installation errors.

## Verification and reporting
- Work on a Git branch/checkpoint when available.
- After each focused repair, run applicable local checks (lint, typecheck, tests, build, runtime smoke test) and show evidence.
- Record findings, commands, files modified, remaining blockers, and exact user-only setup steps in FIX_REPORT.md.
- If a feature requires a missing provider, credential, API, auth redirect, or backend, explain the blocker. Never silently replace it with fake functionality. Any demo/mock behavior must be visibly labeled as mock and must not ship without approval.
