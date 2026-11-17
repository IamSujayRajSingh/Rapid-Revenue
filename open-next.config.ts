// OpenNext (Cloudflare) build config.
// Every page in this site is static or SSG with no revalidation, so prerendered
// pages are served from Workers Static Assets. No R2 / KV / Queue needed.
// (The API route uses the D1 binding `DB` from wrangler.jsonc.)
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default {
	...defineCloudflareConfig({
		incrementalCache: staticAssetsIncrementalCache,
		enableCacheInterception: true,
	}),
	// `yarn build` is the OpenNext build (so Cloudflare's default build command
	// `yarn run build` produces `.open-next/`). OpenNext must therefore call the
	// plain Next.js build by its own script name, otherwise it would call itself.
	buildCommand: "yarn build:next",
};
