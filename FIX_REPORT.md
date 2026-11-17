# Local Website Repair Report

Last updated: 2026-11-15. Machine: Windows 11, Node.js 26.13.1, Git 2.56. No secret values
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
- **Open (resolved 2026-11-15, see next section):** why the GitHub build did not deploy.

## GitHub -> Cloudflare build fix (2026-11-15)

**Reported failure (Cloudflare build of 2026-11-14):** `yarn run build` succeeded, then
`npx wrangler deploy` stopped with `Could not find compiled Open Next config, did you run the
build command?`.

**Root cause (verified in the adapter source and reproduced by reading the config):**

- `package.json` had `"build": "next build"`. Cloudflare's build command `yarn run build`
  therefore produced only `.next/`.
- `npx wrangler deploy` detects an OpenNext project and hands over to
  `opennextjs-cloudflare deploy`, which requires `.open-next/.build/open-next.config.edge.mjs`
  (`node_modules/@opennextjs/cloudflare/dist/cli/commands/utils/utils.js`,
  `retrieveCompiledConfig`). Only `opennextjs-cloudflare build` creates it.
- Running `next build` first and the adapter afterwards is not enough: the adapter sets
  standalone build mode before it calls the Next.js build, so the adapter has to drive it.
- This also answers the open question from 2026-11-14 ("why the GitHub build did not deploy").

Nothing else was wrong: adapter 1.20.17 accepts Next.js 15.5.29 and Wrangler 4.162.0 (its peer
ranges are `next >=15.5.29 <16`, `wrangler ^4.148.0`), `wrangler.jsonc` and
`open-next.config.ts` were valid, and only `yarn.lock` exists (no second lockfile).

**Changes**

| File | Change | Why |
| --- | --- | --- |
| `package.json` | `build` is now `opennextjs-cloudflare build`; new `build:next` is `next build` | Cloudflare's existing `yarn run build` now produces `.open-next/`, with no dashboard change |
| `open-next.config.ts` | Added `buildCommand: "yarn build:next"` | Without it the adapter would call `yarn build`, which is now itself (endless loop) |
| `package.json` | `preview` is now `opennextjs-cloudflare build && opennextjs-cloudflare populateCache local && wrangler dev` | Same steps as before, but the old form ended in `yarn exec wrangler`, which Yarn Classic cannot run on Windows (`Couldn't find the binary wrangler`) |
| `package.json`, `yarn.lock` | `resolutions.yaml` 2.8.3 -> 2.9.1 | `@opennextjs/aws` 4.1.16 asks for `yaml ^2.9.1`; removes the install warning |
| `yarn.lock` | `caniuse-lite` 1.0.30001727 / 1.0.30001793 -> 1.0.30001826 (one entry) | Removes the "Browserslist: caniuse-lite is outdated" build warning. Data package only |
| `app/layout.js` | `alternates.canonical` changed from `SITE.url` to `'./'` (approved by the owner on 2026-11-15) | Every page except blog posts declared the home page as its canonical URL. See below |
| `README_LOCAL_SETUP.md`, `FIX_REPORT.md` | Commands, dashboard settings, troubleshooting row | Documentation |

Not changed on purpose:

- `resolutions.postcss` 8.5.10. Next.js pins `postcss` 8.4.31 exactly, so the warning
  `Resolution field "postcss@8.5.10" is incompatible with requested version "postcss@8.4.31"`
  stays. Removing the pin would move Next.js back to the older PostCSS. Harmless.
- No TypeScript or ESLint was added. The site is plain JavaScript without `tsconfig.json` or an
  ESLint config, so there is nothing for a type-check or lint script to run.
- `deploy` script. It still ends in `yarn exec wrangler` on Windows (workaround in the README).
  Deploys are meant to come from GitHub, where the build runs on Linux.
- Routes, design, API code, `wrangler.jsonc`, `next.config.js`.

**Validation (2026-11-15, Windows 11, Node 26.13.1, Yarn 1.22.22; local only)**

| Check | Command | Result |
| --- | --- | --- |
| Install as Cloudflare does | `yarn --frozen-lockfile` | PASSED. Only the postcss warning remains |
| Type check / lint | none exist | NOT APPLICABLE (JavaScript project). Next.js's own build-time check passed |
| Next.js build | runs inside `yarn run build` as `yarn build:next` | PASSED. Compiled, 65/65 static pages, no Browserslist warning |
| OpenNext build, from a clean tree (`.next` and `.open-next` deleted first) | `yarn run build` | PASSED. `.open-next/worker.js`, `.open-next/assets/`, `.open-next/.build/open-next.config.edge.mjs` created |
| Deploy packaging, nothing uploaded | `OPEN_NEXT_DEPLOY=true npx wrangler deploy --dry-run` | PASSED. 246 asset files, 5817 KiB / gzip 1179 KiB, bindings `DB` and `ASSETS` |
| Local Workers preview | `yarn preview` and `npx wrangler dev` | PASSED. Ready on port 8787 |
| Routes | script, `curl` | PASSED. All 58 sitemap URLs 200; `/admin/login`, `/admin/library`, `/library/<slug>`, `/robots.txt`, `/sitemap.xml`, `/logo.png`, `/favicon.png` 200; unknown page and unknown service slug 404; 11 JS/CSS/font files of the home page 200 |
| API, local D1 only | same script | PASSED. health, list (15 seeded), by slug, tags, 404s, contact lead, gated download, admin login, admin list/leads, create/update/delete, draft hidden from public list |
| Auth fails closed | same script | PASSED. No key, wrong key, empty key and wrong/empty password all 401 on every admin endpoint and method |
| Browser | home, library, calculator, contact (mobile width), admin | PASSED with a limit. No console errors, images load, no horizontal overflow at 375 px, `/admin/library` redirects to `/admin/login` when not signed in. Fade-in animations could not be watched because the test browser pane was hidden |
| Cloudflare's own build and deploy | not run | NOT VERIFIED. Needs a push. The last step there (`yarn exec wrangler deploy`) runs on Linux and could not be run on this PC |

Total for the script: 39 checks, 39 passed. Test rows went into the local D1 copy under
`.wrangler/` only. Nothing was committed, pushed or deployed, and no production resource was
touched.

**Canonical URL fix (found during verification, approved, done)**

- Before: `app/layout.js` set `alternates: { canonical: SITE.url }` and every page except blog
  posts inherited it, so `/about`, `/services` and every service, industry and case-study page
  told search engines that their canonical address was the home page. This came with the export.
- Now: `canonical: './'`. Next.js resolves it against `metadataBase` and the current route.
- Verified on the local Workers preview after a full rebuild: all 58 sitemap URLs serve exactly
  one canonical tag equal to their own sitemap URL (0 mismatches); the home page is still
  `https://therapidrevenue.in`; blog posts keep their own value; `/library/<slug>` gets its own;
  query strings are dropped (`/about?utm_source=x` -> `/about`). The 39-check script was rerun:
  39 passed.
- The 404 page now shows `/_not-found` as canonical instead of the home page. It is served with
  status 404 and `noindex`, so search engines ignore it.

**Found during verification, not changed (your decision)**

- **`og:url`.** The social-sharing URL has the same inheritance problem: every page except blog
  posts reports the home page as `og:url` (`openGraph.url: SITE.url` in `app/layout.js`). Not
  changed because only the canonical fix was approved.
- Items 2 to 7 under "Remaining issues" above are unchanged (`og.png` missing, permissive frame
  and CORS headers, admin token is the password itself, placeholder seed links).
- `www.therapidrevenue.in` still has no DNS record.

**Cloudflare dashboard values** (Workers & Pages -> `rapid-revenue` -> Settings -> Build)

| Setting | Value |
| --- | --- |
| Build command | `yarn run build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Production branch | whichever is set there now; `main` and `local-repair` are the same commit |
| Output directory | none (Workers reads `main` and `assets` from `wrangler.jsonc`) |
| Build variables | none required. Optional `CORS_ORIGINS` (read at build time) |
| Runtime secret | `ADMIN_PASSWORD` under Settings -> Variables and Secrets |
| Compatibility | from `wrangler.jsonc`: date `2026-10-01`, flags `nodejs_compat`, `global_fetch_strictly_public` |

## Push and first Cloudflare builds (2026-11-15)

- Commit `4ebf67b` (the build fix and the canonical fix) was pushed to `main` at 14:36 IST with
  the owner's approval. `local-repair` was not pushed and is still at `432d1ab`.
- GitHub shows two Cloudflare "Workers Builds: rapid-revenue" checks, both failed:
  - on `4ebf67b` (`main`), finished 09:08:36 UTC, build id `d8e4af9e-2d24-45c6-b4d1-8f6b3b78fa96`.
    **Its log has not been seen. Cause unknown.**
  - on `432d1ab`, finished 09:16:37 UTC, build id `94892cff-173e-4701-acb7-bf8bcd6ad831`. This is
    the log the owner supplied. It is the old commit: it runs `next build`, and still shows the
    `yaml@2.8.3` and Browserslist warnings that `4ebf67b` removed. It fails with the original
    error, as expected for that commit. It does not test the fix.
- Reproduction of the fix commit the way Cloudflare builds it, on this PC: fresh clone of
  `4ebf67b`, clean `yarn --frozen-lockfile`, `yarn run build` with `CI=true`, no terminal attached
  and no local env files: PASSED (65/65 pages, `.open-next/worker.js` and the compiled config
  created). So the commit is complete; whatever failed in build `d8e4af9e` is specific to
  Cloudflare's Linux builder or its settings. This PC has no Linux environment (WSL, Docker) to
  test further.
- The live site still serves the previous deployment (old canonical tags).

**Domain problem found while checking the live site (not caused by the push)**

- `therapidrevenue.in` (no www) has no A or AAAA record at its Cloudflare nameservers, so it
  does not load. It already failed 24 seconds after the push, before any build could have run.
- `www.therapidrevenue.in` now resolves and returns 200, as does the `workers.dev` address. On
  2026-11-14 it was the other way round (apex worked, www had no record), so the custom domain
  was changed in the Cloudflare dashboard since then.
- Every canonical tag, `robots.txt` and `sitemap.xml` point at the address without www.
- Owner action: Worker `rapid-revenue` -> Settings -> Domains & Routes -> add
  `therapidrevenue.in` as a Custom Domain again (keep www as well).

## Git

`main` is at `4ebf67b` locally and on GitHub. `local-repair` is at `432d1ab` locally and on
GitHub. GitHub's default branch is `main` (changed by the owner on 2026-11-17; checked with
`git ls-remote --symref origin HEAD`, local `origin/HEAD` refreshed with `git remote set-head origin -a`).
The Cloudflare production branch is also `main` (owner's dashboard screenshot, 2026-11-17), build
command `yarn run build`, deploy command `npx wrangler deploy`, root `/`, builds enabled. So every
push to `main` starts a production build. The latest build still shows as failed.
On 2026-11-17 the owner pasted a build log again (09:14–09:16 UTC on 2026-11-15). It is the
`432d1ab` log once more: it runs `$ next build` (432d1ab's script; `main` runs
`opennextjs-cloudflare build`) and ends with "Could not find compiled Open Next config". So no build
of `main` has been seen to fail with a known cause. Next step: start a fresh build of `main`
(Retry build on the `main` deployment, or a new push) and read that log if it fails.
