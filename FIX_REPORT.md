# Local Website Repair Report

Date: 2026-11-14. Machine: Windows 11, Node.js 26.13.1, Git 2.56. No secret values appear in
this report.

## Identified stack

- **Builder:** Emergent (`.emergent/emergent.yml`, image `nextjs_mongo_shadcn_base_image_cloud_arm`).
- **Framework:** Next.js 15 App Router, React 18, JavaScript (no TypeScript), Tailwind CSS 3,
  shadcn/Radix UI, framer-motion.
- **Package manager:** Yarn Classic 1.22.22 (`packageManager` field and `yarn.lock`).
- **Backend:** one catch-all API route, `app/api/[[...path]]/route.js`, using the MongoDB Node
  driver 6.6.0. Collections: `resources`, `leads`.
- **Auth:** a single shared admin password (`ADMIN_PASSWORD`) checked by the API. No auth provider.
- **Emergent-hosted pieces:** the MongoDB instance (ran inside Emergent's container at
  `localhost:27017`) and the preview URL. The cron scripts in `.emergent/cron/` only talk to
  Emergent's own API and are not used by the site.
- **No** payments, email sending, file storage or third-party API keys were found in the code.

## Three highest-priority blockers found

1. **Dependencies unusable on Windows.** `node_modules` was a partial copy from a Linux ARM64
   container: `next` itself was missing and the native binaries were `linux-arm64`. Yarn was not
   installed on this machine.
2. **No environment file and no database.** Settings were exported as `env.txt` (not read by
   Next.js). No MongoDB is installed locally, and the Emergent database was not exported.
3. **`dev` script cannot run on Windows.** It used POSIX syntax
   (`NODE_OPTIONS='...' next dev`), which `cmd.exe` rejects.

## Issues reproduced, root causes, and fixes

| # | Severity | Issue (evidence) | Root cause | Fix |
| --- | --- | --- | --- | --- |
| 1 | Blocker | `node_modules/next/package.json` missing; `.yarn-integrity` says `linux-arm64-115` | Export copied the container's `node_modules` | Reinstalled with `yarn install --frozen-lockfile` (lockfile untouched at that step) |
| 2 | Blocker | `yarn dev` -> `'NODE_OPTIONS' is not recognized as an internal or external command` | POSIX-only env prefix in the script | Removed the prefix from `dev` (it now matches the existing `dev:webpack` script) |
| 3 | Blocker | No `.env`; API needs `MONGO_URL`, `DB_NAME`, `ADMIN_PASSWORD` | Emergent exported the file as `env.txt` | Copied values to `.env.development.local` (git-ignored); added `.env.example` with names only |
| 4 | High | `GET /api/health` -> `500 connect ECONNREFUSED 127.0.0.1:27017` | No MongoDB on this machine | **Not fixed.** Needs a database (see Remaining issues) |
| 5 | Medium | `/og.png`, `/logo.png`, `/favicon.ico` -> 404 | Referenced in metadata/schema but no `public/` folder in the export | **Not fixed.** Real brand images are needed |
| 6 | Medium (Cloudflare) | `@opennextjs/cloudflare` peer dependency is `next >=15.5.29 <16`; project had 15.5.18 | Adapter drops Next versions with known security fixes | Bumped `next` 15.5.18 -> 15.5.29 (patch only) |
| 7 | High (Cloudflare) | With the original route, every second DB request in workerd failed: `Cannot perform I/O on behalf of a different request` | Route cached one MongoDB client in a module variable; Workers cannot reuse a socket across requests | On Workers only, the client is created per request and closed after it. Node.js behaviour is unchanged |
| 8 | Medium (Cloudflare) | OpenNext copied `.env` values into the Worker bundle as production defaults | Adapter behaviour (`process.env[key] ??= value`) | Local values moved to `.env.development.local`; the bundle's production section is now empty |
| 9 | Low | `.gitignore` did not cover `env.txt`, `.open-next/`, `.dev.vars` | Starter-kit ignore file predates these | Added entries |

## Cloudflare preparation

- Added `@opennextjs/cloudflare` 1.20.17 and `wrangler` 4.162.0.
- Added `wrangler.jsonc` (Worker name `rapid-revenue`, `nodejs_compat`, static assets),
  `open-next.config.ts` (static-assets cache, so no R2/KV/D1 needed), `public/_headers`.
- Added scripts `cf:build`, `preview`, `deploy`.
- **Nothing was deployed and no Cloudflare account was contacted.** `wrangler deploy --dry-run`
  was used only to measure size.

## Validation commands and results

| Check | Command | Result |
| --- | --- | --- |
| Install | `npx yarn@1.22.22 install --frozen-lockfile` | Done in 325 s, Windows binaries present |
| Production build | `npx next build` | Compiled, 65/65 static pages generated |
| Dev server pages | `curl` against `next dev` | 17 routes -> 200; unknown path -> 404 |
| Dev server browser | Home, Library, Calculator, Contact | Rendered; no console errors (one framer-motion layout warning) |
| Cloudflare build | `npx opennextjs-cloudflare build` | `OpenNext build complete` (with the Windows warning) |
| Cloudflare runtime pages | `curl` against `wrangler dev` (workerd) | 29 routes -> 200; unknown path -> 404 |
| Cloudflare static caching | `curl -I` on a `/_next/static` file | `Cache-Control: public,max-age=31536000,immutable` |
| Cloudflare browser | Home, Contact | Rendered and hydrated; no console errors; no failed requests |
| Bundle size | `npx wrangler deploy --dry-run` | 7072 KiB, gzip 1418 KiB (free-plan limit 3 MiB) |
| API auth guard | `DELETE /api/admin/resources/x` with no key, both runtimes | 401 `Unauthorized` |
| API database path | `GET /api/health`, both runtimes, no DB running | 500 `ECONNREFUSED` (expected without a database) |
| Lint / type-check / tests | none | The project has no such scripts. `tests/` holds only an empty `__init__.py` |

### Database tests (added after approval)

A temporary MongoDB 8.2.6 server was downloaded to a temp folder outside the project and run on
`127.0.0.1:27017` with a throwaway database. It has been stopped. Only test data was written.

| Check | Node dev server (`:3000`) | Workers runtime (`:8787`) |
| --- | --- | --- |
| 26-step API script: health, list + auto-seed (15 resources), pagination, search, featured filter, tags, by-slug, 404s, lead save, gated download + counter, admin login right/wrong, admin list/leads, admin create/update/delete, draft hidden from public | 26/26 pass | 26/26 pass |
| 8 sequential + 12 concurrent database requests | all 200 | all 200 |
| Browser: `/library` lists resources from the database | not run | 12 cards shown |
| Browser: contact form submit | not run | `POST /api/lead` 200, "Message received" shown |
| Browser: admin login -> admin library | not run | Redirected to `/admin/library`, "15 resources · 5 featured" |
| Prerendered pages served from cache (after `populateCache local`) | n/a | `x-opennext-cache: HIT` on `/`, `/about`, service and blog pages |

**Evidence for fix #7.** The Worker was rebuilt once with the *original* route code. Every
second database request failed with `Cannot perform I/O on behalf of a different request`.
With the per-request client, all requests succeed. The original file was then restored to the
fixed version and the Worker rebuilt.

**Still not tested:** a TLS / `mongodb+srv://` connection to MongoDB Atlas from Cloudflare (the
local test used plain TCP), and anything on a real Cloudflare account.

## Remaining issues

1. **Database.** A MongoDB is required locally and in production. Emergent's data was not
   exported, so leads/resources start empty (resources re-seed automatically).
2. **MongoDB driver version.** The project pins `mongodb` 6.6.0. The published Cloudflare
   examples use 6.15 or newer. 6.6.0 passed every test in workerd against a local MongoDB over
   plain TCP, so it was not upgraded. Atlas uses TLS and `mongodb+srv://`, which could not be
   tested locally. If the first connection on Cloudflare fails, upgrading to the latest 6.x is
   the first thing to try.
3. **Missing images:** `public/og.png` (1200x630), `public/logo.png`, `favicon.ico`.
4. **Placeholder content shipped by the builder:** phone `+91 00000 00000`, WhatsApp number
   `919999999999` (`lib/site-config.js`), and seed resource links pointing at `example.com`
   (`lib/data/resource-seed.js`).
5. **Admin security (unchanged, by design of the export):** the admin "token" is the password
   itself, sent in an `x-admin-key` header. The password in `env.txt` came out of the builder
   export and should be treated as exposed: choose a new one for production.
6. **Permissive headers (unchanged):** `next.config.js` sends `X-Frame-Options: ALLOWALL`,
   `frame-ancestors *` and `Access-Control-Allow-Origin: *`. These suited Emergent's preview
   iframe; they allow any site to embed yours. Tightening them is a behaviour change, so it was
   left for your decision.
7. **Font observation (unchanged):** `<body>` carries Tailwind's `font-sans`, which overrides
   the Inter font set in `globals.css`, so text renders in the system font. This is how the
   export behaves; not altered.
8. **Windows + OpenNext:** officially "not fully compatible". It built and ran here. The
   GitHub -> Cloudflare build route avoids the issue.
9. **Local secrets inside local Cloudflare builds:** values from `.env.development.local` are
   still written into the bundle's unused `development` section when you build on this machine.
   They are inactive in production, but building through Cloudflare's Git integration avoids
   including them at all.

## Requires your input or approval

- Install Yarn globally: `npm install -g yarn@1.22.22` (I used a temporary `npx` shim instead).
- Choose a database: local MongoDB for testing and/or a MongoDB Atlas cluster for Cloudflare.
- Optional cleanup: the temporary MongoDB download (about 780 MB) is in the session temp folder
  `%LOCALAPPDATA%\Temp\claude\...\scratchpad\mongo` and can be deleted.
- Cloudflare: `wrangler login`, three `wrangler secret put` commands, then `yarn deploy`.
- Decide on items 3 to 6 above (images, placeholder contact details, new admin password, headers).

## Files changed

Modified:
- `package.json` (dev script; added `cf:build`, `preview`, `deploy`; `next` 15.5.29; added
  `@opennextjs/cloudflare`, `wrangler`)
- `yarn.lock` (from the three package changes above)
- `app/api/[[...path]]/route.js` (per-request MongoDB client on Workers)
- `.gitignore`
- `FIX_REPORT.md`, `REPAIR_CHECKLIST.md` (ticked the items that were verified)

Added:
- `.env.example`, `.dev.vars.example`
- `wrangler.jsonc`, `open-next.config.ts`, `public/_headers`
- `README_LOCAL_SETUP.md`
- `.claude/launch.json` (preview-server definitions for Claude Code)
- Local only, git-ignored: `.env.development.local`, `.dev.vars`

Untouched: all pages, components, styles, content, routes, `next.config.js`, `env.txt`,
`gitignore.txt`, `.emergent/`.

Git: a local repository was created (none existed). Commit `ddf104c` on `main` is the original
export; repairs are on branch `local-repair`. Nothing was pushed anywhere.
