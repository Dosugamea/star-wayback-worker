import type { WaybackResponse } from './types';

export const fetchWaybackData = async (url: string): Promise<WaybackResponse | null> => {
	const waybackUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
	try {
		const response = await fetch(waybackUrl);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error('Error fetching Wayback data:', error);
		return null;
	}
};

export const findLatestArchive = (waybackData: (WaybackResponse | null)[]): WaybackResponse | null => {
	for (const data of waybackData) {
		if (!data) continue;
		// NOTE: 一致するデータがなくてもエラーでなければとりあえずJSONが返ってくる
		if (!data?.archived_snapshots.closest) continue;
		return data;
	}
	return null;
};
