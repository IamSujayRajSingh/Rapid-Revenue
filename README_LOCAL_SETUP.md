# Rapid Revenue Website — Local Setup (Windows 11) and Cloudflare Deployment

This is a Next.js 15 (App Router, JavaScript) site exported from Emergent. It has one backend
piece: a Next.js API route (`app/api/[[...path]]/route.js`) that stores leads and the resource
library in MongoDB.

## 1. Required software

| Software | Version | Notes |
| --- | --- | --- |
| Node.js | 22.12 or newer (tested on 26.13.1) | Wrangler requires >= 22.12 |
| Yarn Classic | 1.22.22 | The repo's package manager (`yarn.lock`). The Cloudflare build also calls `yarn build`. |
| Git | any recent | Local checkpoints only |
| MongoDB | 6.x / 7.x / 8.x server, or a MongoDB Atlas cluster | Only needed for the lead forms, resource library and admin area |

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

Open **http://localhost:3000**.

Other commands:

```powershell
yarn build      # production build (Node.js)
yarn start      # serve the production build (not tested in this repair; does not read .env.development.local)
yarn preview    # build for Cloudflare and run it in the local Workers runtime (http://localhost:8787)
```

There is no lint, type-check or test script in this project (`next build` runs Next's own
validity check).

## 3. Environment variables

Names only. Descriptions are in `.env.example`. Real values go in `.env.development.local`
(local dev), `.dev.vars` (local Cloudflare preview) and Cloudflare secrets (production). None of
those files are committed.

| Name | Used by | Required |
| --- | --- | --- |
| `MONGO_URL` | API route | Yes, for any database feature |
| `DB_NAME` | API route | Yes, for any database feature |
| `ADMIN_PASSWORD` | `/admin/login`, `/api/admin/*` | Yes, for the admin area |
| `CORS_ORIGINS` | `next.config.js` (read at **build** time) | No, defaults to `*` |
| `NEXT_PUBLIC_BASE_URL` | nothing (left over from Emergent) | No |
| `NEXTJS_ENV` | `.dev.vars` only, for `yarn preview` | No |

Why `.env.development.local` and not `.env`: the Cloudflare build copies `.env` values into the
Worker bundle as production defaults. Keeping local values in a development-only file stops a
local password or `localhost` database URL from silently becoming the production setting.

## 4. Backend requirements

- **Without MongoDB** every page still renders. These features return an error instead:
  contact/lead form, resource library list and download, admin login, admin library.
- **With a local MongoDB** on `mongodb://localhost:27017` those features use it. The first visit
  to the library seeds the `resources` collection from `lib/data/resource-seed.js`.
- Emergent hosted the original MongoDB inside its container. That data is **not** in this export.

## 5. Deploying to Cloudflare (Workers, via OpenNext)

The project is prepared but **nothing has been deployed**. Files involved: `wrangler.jsonc`,
`open-next.config.ts`, `public/_headers`, and the `cf:build` / `preview` / `deploy` scripts.

You need:

1. A Cloudflare account.
2. A MongoDB reachable from the internet, for example a MongoDB Atlas cluster with a database
   user and network access that allows Cloudflare (Atlas: allow `0.0.0.0/0`, since Workers have
   no fixed IPs).

Steps (PowerShell, from the project folder):

```powershell
npx wrangler login
npx wrangler secret put MONGO_URL
npx wrangler secret put DB_NAME
npx wrangler secret put ADMIN_PASSWORD
yarn deploy
```

- `wrangler secret put` asks for each value in the terminal. Use a **new** admin password, not
  the one from the Emergent export.
- If the Worker (named `rapid-revenue`) does not exist yet, `wrangler secret put` offers to
  create it. Answer yes.
- After the first deploy, add your domain under Workers & Pages -> rapid-revenue -> Settings ->
  Domains & Routes.
- Free plan limit is 3 MiB compressed; this build is about 1.4 MiB.

Alternative that avoids building on Windows: push the repo to GitHub and connect it in
Cloudflare (Workers & Pages -> Create -> Import a repository) with build command
`npx opennextjs-cloudflare build` and deploy command `npx opennextjs-cloudflare deploy`. Cloudflare
builds on Linux, which OpenNext officially supports.

## 6. Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `'yarn' is not recognized` | Install Yarn: `npm install -g yarn@1.22.22` |
| `'NODE_OPTIONS' is not recognized` | You are on the original `package.json`; the `dev` script was fixed in this repo |
| `Cannot find module 'next'` or errors mentioning `linux-arm64` | `node_modules` came from Emergent's Linux container. Run `yarn install --frozen-lockfile` |
| API returns `connect ECONNREFUSED ...:27017` | MongoDB is not running or `MONGO_URL` is wrong |
| API takes about 30 seconds to fail locally | Same cause; that is the MongoDB driver's connection timeout |
| `/og.png`, `/logo.png`, `/favicon.ico` return 404 | These files were never in the export. Add them to `public/` |
| `WARN OpenNext is not fully compatible with Windows` | Expected. The build and preview worked here; use the GitHub route in section 5 if it fails |
| Port 3000 or 8787 in use | Stop the other process, or run `npx next dev --port 3001` |
| Page looks blank for a moment | Sections fade in with animations; wait a second or scroll |
