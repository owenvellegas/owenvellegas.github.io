export const windowIds = [
	'wallpapers',
	'calculator',
	'calendar',
	'notes',
	'focus',
	'game2048',
	'owen-profile',
] as const;
export type WindowID = (typeof windowIds)[number];
export type AppID = WindowID | 'finder';
