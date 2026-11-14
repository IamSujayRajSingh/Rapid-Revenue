// OpenNext (Cloudflare) build config.
// Every page in this site is static or SSG with no revalidation, so prerendered
// pages are served from Workers Static Assets. No R2 / KV / D1 / Queue needed.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
	incrementalCache: staticAssetsIncrementalCache,
	enableCacheInterception: true,
});
