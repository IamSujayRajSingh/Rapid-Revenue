# Rapid Revenue Website — Local Setup (Windows 11) and Cloudflare Deployment

This is a Next.js 15 (App Router, JavaScript) site, originally exported from Emergent and now
built for Cloudflare Workers. It has one backend piece: a Next.js API route
(`app/api/[[...path]]/route.js`) that stores leads and the resource library in **Cloudflare D1**
(Cloudflare's built-in SQLite database).

## 1. Required software

| Software | Version | Notes |
| --- | --- | --- |
| Node.js | 22.12 or newer (tested on 26.13.1) | Wrangler requires >= 22.12 |
| Yarn Classic | 1.22.22 | The repo's package manager (`yarn.lock`). The Cloudflare build also calls `yarn build`. |
| Git | any recent | Local checkpoints only |

No database software is needed. Locally, Wrangler keeps a private D1 database file under
`.wrangler/` in the project folder.

Install Yarn once (PowerShell):

```powershell
npm install -g yarn@1.22.22
```

## 2. Install and run locally

Run these from the project folder in PowerShell:

```powershell
yarn install --frozen-lockfile
Copy-Item .env.example .env.development.local   # skip if the file already exists
yarn dev
```

Open **http://localhost:3000**. The contact form, resource library and admin area work
immediately, against the local D1 database. Tables are created and the library is seeded
automatically on first use.

Other commands:

```powershell
yarn build      # plain Next.js production build (used by the Cloudflare build)
yarn preview    # build for Cloudflare and run it in the local Workers runtime (http://localhost:8787)
yarn deploy     # build and deploy to your Cloudflare account
```

`yarn preview` needs a `.dev.vars` file (copy `.dev.vars.example`).

To wipe the local database, stop the servers and delete the `.wrangler` folder.

There is no lint, type-check or test script in this project.

## 3. Environment variables

Names only. Descriptions are in `.env.example`.

| Name | Used by | Where it is set |
| --- | --- | --- |
| `ADMIN_PASSWORD` | `/admin/login`, `/api/admin/*` | `.env.development.local` (dev), `.dev.vars` (preview), Cloudflare secret (production) |
| `CORS_ORIGINS` | `next.config.js`, read at **build** time | Optional, defaults to `*` |
| `NEXTJS_ENV` | `yarn preview` only | `.dev.vars` |

The database has no variable. It is the binding `DB` in `wrangler.jsonc`.

## 4. Deploying to Cloudflare

**Nothing has been deployed.** You need a Cloudflare account (the free plan is enough).

Steps (PowerShell, from the project folder):

```powershell
npx wrangler login
npx wrangler secret put ADMIN_PASSWORD
yarn deploy
```

- `wrangler secret put` asks for the value in the terminal. Use a **new** admin password, not
  the one from the Emergent export. If it offers to create the Worker `rapid-revenue`, answer yes.
- The production D1 database `rapid-revenue-db` already exists (created 2026-11-14, region
  APAC) and its id is in `wrangler.jsonc`. Do not create another one.

- After deploying, add your domain under Workers & Pages -> rapid-revenue -> Settings ->
  Domains & Routes.
- To look at saved leads: Cloudflare dashboard -> Storage & Databases -> D1 -> your database ->
  `leads` table, or the site's own `/admin/library` page (Leads tab).
- Free plan limit is 3 MiB compressed; this build is about 1.2 MiB.

**Recommended: automatic deploys from GitHub.** The code is at
https://github.com/IamSujayRajSingh/Rapid-Revenue. When connected to Cloudflare (Workers &
Pages -> Create application -> GitHub), every `git push` to `main` builds and deploys the site on
Cloudflare's Linux builders. Settings: project name `rapid-revenue` (must match `name` in
`wrangler.jsonc`), build command `npx opennextjs-cloudflare build`, deploy command
`npx opennextjs-cloudflare deploy`. Set `ADMIN_PASSWORD` under the Worker's Settings ->
Variables and Secrets.

## 5. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `'yarn' is not recognized` | Install Yarn: `npm install -g yarn@1.22.22` |
| `Cannot find module 'next'` | Run `yarn install --frozen-lockfile` |
| API returns `Database binding "DB" is not configured` | The `d1_databases` entry is missing from `wrangler.jsonc`, or the site is running outside `yarn dev` / `yarn preview` / Cloudflare |
| Admin login says `Invalid password` | `ADMIN_PASSWORD` is not set for that environment (see section 3) |
| `/og.png` returns 404 | The social-preview image was never in the export. Add `public/og.png` (1200x630) |
| `WARN OpenNext is not fully compatible with Windows` | Expected. The build and preview worked here; use the GitHub route in section 4 if it fails |
| Port 3000 or 8787 in use | Stop the other process, or run `npx next dev --port 3001` |
| Page looks blank for a moment | Sections fade in with animations; wait a second or scroll |
