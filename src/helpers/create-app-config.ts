export type AppConfig = {
	title: string;
	resizable?: boolean;
	expandable?: boolean;
	height?: string | number;
	width?: string | number;
	should_open_window?: boolean;
	external_action?: (e: unknown) => void;
	dock_breaks_before?: boolean;
};
export const create_app_config = (et: AppConfig) =>
	({
		should_open_window: true,
		dock_breaks_before: false,
		resizable: true,
		expandable: false,
		width: 600,
		height: 500,
		...et,
	}) satisfies AppConfig;
