# Local Website Repair Report

Last updated: 2026-11-14. Machine: Windows 11, Node.js 26.13.1, Git 2.56. No secret values
appear in this report.

## Current stack

- **Framework:** Next.js 15.5.29 App Router, React 18, JavaScript, Tailwind CSS 3, framer-motion.
- **Hosting target:** Cloudflare Workers through `@opennextjs/cloudflare` 1.20.17 and Wrangler 4.162.0.
- **Backend:** one catch-all API route, `app/api/[[...path]]/route.js`.
- **Database:** Cloudflare D1 (SQLite), binding `DB`. Tables `resources` and `leads` are created
  automatically on first use. MongoDB is no longer used.
- **Auth:** a single shared admin password (`ADMIN_PASSWORD`). No auth provider.
- **Package manager:** Yarn Classic 1.22.22.
- **Original builder:** Emergent. Its hosted MongoDB and its data were never part of the export.

## Work done, in order

### Stage 1: make the export run on Windows

| Issue (evidence) | Root cause | Fix |
| --- | --- | --- |
| `node_modules/next` missing; `.yarn-integrity` said `linux-arm64` | Export copied the Linux container's `node_modules` | `yarn install --frozen-lockfile` |
| `yarn dev` -> `'NODE_OPTIONS' is not recognized` | POSIX-only env prefix in the script | Removed the prefix |
| No `.env`; settings shipped as `env.txt` | Emergent export format | Local values in `.env.development.local` (git-ignored); names in `.env.example` |

### Stage 2: prepare for Cloudflare (MongoDB kept)

- Added the OpenNext adapter, Wrangler, `wrangler.jsonc`, `open-next.config.ts`, `public/_headers`.
- `next` 15.5.18 -> 15.5.29 (required by the adapter's peer range).
- Proved with a temporary local MongoDB that the original route failed in Workers on every
  second request (`Cannot perform I/O on behalf of a different request`).

### Stage 3: Cloudflare-native backend, cleanup, branding (this update)

**Database and backend**

- Rewrote `app/api/[[...path]]/route.js` to use Cloudflare D1 instead of MongoDB. Every
  endpoint, URL, request body and response shape is the same as before.
- Search uses a case-insensitive "contains" on title, description and tags (as before). Tags
  are stored as a JSON list and filtered with SQLite's `json_each`.
- The library still seeds itself from `lib/data/resource-seed.js` when empty. Seed rows now use
  fixed ids with `INSERT OR IGNORE`, so simultaneous first visits cannot create duplicates.
- IDs come from the built-in `crypto.randomUUID()` instead of the `uuid` package.
- `wrangler.jsonc` declares the `DB` binding. `next.config.js` calls
  `initOpenNextCloudflareForDev()` so `yarn dev` gets the same local D1 database.
- Secrets needed on Cloudflare dropped from three to one (`ADMIN_PASSWORD`).

**Removed as unused** (all recoverable from Git commit `f41ed6f` or earlier)

- `components/ui/` (48 shadcn components), `hooks/`, `lib/utils.js`, `lib/constants/`,
  `app/providers.js`, `components.json`: nothing in the site imported them.
- Emergent leftovers: `.emergent/`, `test_result.md`, `tests/`, `test_reports/`, `memory/`,
  `gitignore.txt`.
- 52 npm packages that no remaining file imports, including `mongodb`, `uuid`, `axios`, `zod`,
  `lodash`, `swr`, all `@radix-ui/*`, `@tanstack/*`, `react-hook-form`, `date-fns`, `dayjs`.
  Dependencies went from 58 to 8, dev dependencies from 6 to 4.
- `next.config.js`: `output: 'standalone'`, the MongoDB external-package entry, the 2-second
  file-polling tweak, `onDemandEntries`, and an unused image host pattern. These were
  Emergent-container settings.
- `package.json`: duplicate scripts `dev:no-reload` and `dev:webpack`, and `start` (plain
  `next start` cannot reach D1; use `yarn preview`). Package renamed to `rapid-revenue`.
- Worker bundle: 1418 KiB -> 1179 KiB compressed.

**Kept on purpose**

- The `headers()` block in `next.config.js` (frame and CORS headers). It changes behaviour, so
  it is not dead code. See Remaining issues.
- `package.json` `resolutions` (security pins for indirect dependencies).
- `env.txt` (untracked, git-ignored). It still holds the old exported values; delete it yourself
  once you no longer need it.

**Logo and favicon**

- `logo.png` -> `public/logo.png`, `favicon.png` -> `public/favicon.png` (moved from the project root).
- New `components/site/logo.js`. The header and footer show the wordmark logo instead of the
  "R" tile and text. Because the artwork is black on transparent and the site is black, it is
  displayed inverted (white) with CSS, and cropped to the artwork band.
- The admin login and admin library show the target mark inside the existing light tile.
- `app/layout.js` declares `/favicon.png` as the icon. `/logo.png` now resolves for the
  structured-data (SEO) references that already pointed at it.

## Validation (final state)

| Check | Command | Result |
| --- | --- | --- |
| Cloudflare build | `npx opennextjs-cloudflare build` | Compiled, 65/65 static pages, `OpenNext build complete` |
| Bundle size | `npx wrangler deploy --dry-run` | 5815 KiB, gzip 1179 KiB; bindings `DB` (D1) and `ASSETS` |
| Workers runtime pages | `curl` against `wrangler dev` | 32 routes incl. `/logo.png`, `/favicon.png` -> 200; unknown path -> 404 |
| Prerendered page cache | `curl -I /about` | `x-opennext-cache: HIT` |
| API on Workers runtime (local D1) | 26-step script | 26/26 pass |
| API on `next dev` (local D1) | same script | 26/26 pass |
| Seeding race | 6 simultaneous first requests on an empty database | all report 15 resources, no duplicates |
| Sequential and concurrent load | 8 sequential + 12 concurrent DB requests | all 200, both runtimes |
| Long / special search strings | `q=%`, 90-character `q` | 200 with empty result, no error |
| Browser, Workers build | home page | Renders, wordmark logo visible, no console errors |
| Browser, dev | header logo 144x44 px, header height unchanged (84 px); admin login mark loads | OK |
| Leftover references | grep for `mongodb`, `MONGO_URL`, `uuid`, `components/ui`, `emergent` | none |

The 26-step script covers: health, list and auto-seed, pagination, search, featured filter,
tags, by-slug, 404s, lead save, gated download and counter, admin login right/wrong, admin
list/leads, admin create/update/delete, and drafts hidden from the public list.

**Not tested:** anything on a real Cloudflare account, including the automatic creation of the
D1 database on first deploy (documented by Cloudflare; a manual fallback is in the README).
After the D1 rewrite the contact form and admin screens were verified through the API, not
re-clicked in the browser.

## Remaining issues

1. **No data migration.** The D1 database starts empty apart from the 15 seed resources.
   Leads collected on Emergent were never in the export.
2. **`public/og.png` is missing** (1200x630 social-preview image); link previews will have no image.
3. **Favicon is black on transparent.** It will be hard to see on dark browser tabs. A version
   with a light background would fix that.
4. **Placeholder content from the builder:** phone `+91 00000 00000`, WhatsApp number
   `919999999999` (`lib/site-config.js`), and seed resource links pointing at `example.com`.
5. **Admin security (unchanged):** the admin "token" is the password itself, sent in an
   `x-admin-key` header. The password in `env.txt` came out of the builder export; choose a new one.
6. **Permissive headers (unchanged):** `X-Frame-Options: ALLOWALL`, `frame-ancestors *`,
   `Access-Control-Allow-Origin: *`. These suited Emergent's preview iframe.
7. **Font (unchanged):** `<body>` carries Tailwind's `font-sans`, which overrides Inter, so text
   renders in the system font. This is how the export behaves.
8. **Windows + OpenNext:** officially "not fully compatible". It built and ran here.
9. **Local secrets inside local builds:** values from `.env.development.local` are written into
   the bundle's unused `development` section when you build on this machine. Building through
   Cloudflare's Git integration avoids that.

## Requires your input or approval

- Install Yarn globally: `npm install -g yarn@1.22.22` (a temporary `npx` shim was used here).
- Cloudflare: `npx wrangler login`, `npx wrangler secret put ADMIN_PASSWORD`, `yarn deploy`.
- Decide on items 2 to 6 above.
- Optional cleanup: the temporary MongoDB download (about 780 MB) from the earlier test is in
  the session temp folder `%LOCALAPPDATA%\Temp\claude\...\scratchpad\mongo` and can be deleted.

## Production deployment (2026-11-14)

- **Problem reported:** `therapidrevenue.in` showed an error page after the domain was attached.
- **Cause:** the Worker `rapid-revenue` only held the placeholder that `wrangler secret put`
  creates (it returned Cloudflare error 1101). The GitHub-connected build had not produced a
  deployment (no new version 30+ minutes after the trigger commit `c24c415`); its log was not read.
- **Fix:** built locally with `.env.development.local` moved aside (the bundle's env sections
  are empty: no local passwords inside), then deployed. `yarn deploy` failed at its last step
  (`yarn exec wrangler`: `Couldn't find the binary wrangler`), so that step was run directly as
  `OPEN_NEXT_DEPLOY=true npx wrangler deploy`. Version `4e42702d-c826-4d88-b939-5920c062de1c`.
- **Verified (GET requests only, no data written):** on `https://therapidrevenue.in` and
  `https://rapid-revenue.sujayraj4.workers.dev`, 20 pages and assets return 200, unknown pages 404,
  `/api/health` ok, library returns 15 resources from D1, prerendered pages `x-opennext-cache: HIT`.
- **Not working:** `www.therapidrevenue.in` has no DNS record (non-existent domain).
- **Open:** why the GitHub build did not deploy. Until fixed, deploy from this PC as above.

## Git

A local repository was created (none existed). `main` holds the original export (`ddf104c`);
all work is on branch `local-repair`. Nothing was pushed anywhere.
