/** 環境変数 **/
export interface Env {}

interface WaybackSnapshot {
	available: boolean;
	url: string;
	timestamp: string;
	status: string;
}
export interface WaybackResponse {
	url: string;
	archived_snapshots: {
		closest?: WaybackSnapshot;
	};
}
