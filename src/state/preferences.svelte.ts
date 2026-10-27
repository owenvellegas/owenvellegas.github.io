import { colors } from '🍎/configs/theme/colors.config.ts';
import { wallpapers_config, type WallpaperID } from '🍎/configs/wallpapers/wallpaper.config.ts';
import { matchesShape } from '../helpers/storage-validation.ts';
import { persisted } from './persisted.svelte.ts';
export type WallpaperSettings = {
	id: WallpaperID;
	image: string;
	canControlTheme: boolean;
};
export type Theme = {
	scheme: 'light' | 'dark';
	primaryColor: keyof typeof colors;
};
const defaults = {
	reduced_motion: matchMedia('(prefers-reduced-motion)').matches,
	theme: {
		scheme: matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
		primaryColor: 'blue',
	} as Theme,
	wallpaper: {
		image: 'ventura-2',
		id: 'ventura',
		canControlTheme: true,
	} as WallpaperSettings,
};
export const preferences = persisted(
	'macos:preferences',
	defaults,
	(value: any) =>
		matchesShape(value, defaults) &&
		['light', 'dark'].includes(value.theme.scheme) &&
		Object.hasOwn(colors, value.theme.primaryColor) &&
		Object.hasOwn(wallpapers_config, value.wallpaper.id),
);
$effect.root(() => {
	$effect(() => {
		const { classList } = document.body;
		classList.remove('light', 'dark');
		classList.add(preferences.theme.scheme);
		const colorObj = colors[preferences.theme.primaryColor][preferences.theme.scheme];
		document.body.style.setProperty('--system-color-primary', `hsl(${colorObj.hsl})`);
		document.body.style.setProperty('--system-color-primary-hsl', `${colorObj.hsl}`);
		document.body.style.setProperty(
			'--system-color-primary-contrast',
			`hsl(${colorObj.contrastHsl})`,
		);
		document.body.style.setProperty(
			'--system-color-primary-contrast-hsl',
			`${colorObj.contrastHsl}`,
		);
	});
});
