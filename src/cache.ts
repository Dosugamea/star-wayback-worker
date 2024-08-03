import { CACHE_TTL } from './config';
import type { WaybackResponse } from './types.ts';

export const getCachedResponse = async (cache: Cache, url: string): Promise<WaybackResponse | null> => {
	const cacheKey = new Request(`https://wayback-cache/${url}`, { method: 'GET' });
	const cachedResponse = await cache.match(cacheKey);
	if (!cachedResponse) return null;
	return cachedResponse.json();
};

export const setCachedResponse = (cache: Cache, url: string, data: WaybackResponse, ctx: ExecutionContext): void => {
	const cacheKey = new Request(`https://wayback-cache/${url}`, { method: 'GET' });
	const newResponse = new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json', 'Cache-Control': `max-age=${CACHE_TTL}` },
	});
	ctx.waitUntil(cache.put(cacheKey, newResponse));
};
