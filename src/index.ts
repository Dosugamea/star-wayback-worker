import { getCachedResponse, setCachedResponse } from './cache';
import { TARGET_DOMAINS } from './config';
import type { Env } from './types';
import { fetchWaybackData, findLatestArchive } from './wayback';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		const cache = caches.default;

		// robots.txtのハンドラ
		if (request.url.endsWith('robots.txt')) {
			return new Response('User-agent: *\nDisallow: /', { headers: { 'Content-Type': 'text/plain' } });
		}

		// キャッシュがあればそれを返す
		const cachedData = await getCachedResponse(cache, url.href);
		if (cachedData) {
			// ページがあった場合のキャッシュ
			if (cachedData?.archived_snapshots?.closest) {
				return Response.redirect(cachedData.archived_snapshots.closest.url, 302);
			}
			// ページがなかった場合のキャッシュ
			return new Response('Not found, but it still exists in our hearts', { status: 404 });
		}

		// WaybackMachineに問い合わせる
		const waybackData = await Promise.all(
			TARGET_DOMAINS.map(async (domain) => {
				const combinedUrl = `https://${domain}${url.pathname}${url.search}`;
				return fetchWaybackData(combinedUrl);
			})
		);

		// WaybackMachineにあったらそれを返す
		const latestArchive = findLatestArchive(waybackData);
		if (latestArchive?.archived_snapshots?.closest) {
			setCachedResponse(cache, url.href, latestArchive, ctx);
			return Response.redirect(latestArchive.archived_snapshots.closest.url, 302);
		}
		// そこになければ無いですね
		setCachedResponse(cache, url.href, { url: url.href, archived_snapshots: {} }, ctx);
		return new Response('Not found, but it still exists in our hearts', { status: 404 });
	},
} satisfies ExportedHandler<Env>;
