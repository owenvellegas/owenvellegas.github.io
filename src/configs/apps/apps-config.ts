import { activateApp } from '🍎/state/apps.svelte.ts';
import { create_app_config } from '🍎/helpers/create-app-config.ts';
export const apps_config = {
	finder: create_app_config({
		title: 'Finder',
		should_open_window: false,
		external_action: () => activateApp('owen-profile'),
	}),
	wallpapers: create_app_config({
		title: 'Wallpapers',
		width: 800,
		height: 600,
		dock_breaks_before: true,
	}),
	calculator: create_app_config({
		title: 'Calculator',
		width: 250,
		height: 354,
		expandable: true,
		resizable: false,
	}),
	calendar: create_app_config({ title: 'Calendar', width: 600, height: 500 }),
	notes: create_app_config({ title: 'Notes', width: 760, height: 550 }),
	focus: create_app_config({ title: 'Focus', width: 440, height: 590 }),
	game2048: create_app_config({ title: '2048', width: 460, height: 650 }),
	'owen-profile': create_app_config({
		title: 'About Owen',
		width: 800,
		height: 600,
		dock_breaks_before: true,
	}),
};
