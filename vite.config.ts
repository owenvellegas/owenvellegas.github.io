import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnpluginIcons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';
import { VitePWA } from 'vite-plugin-pwa';
import { prefetch } from './prefetch-plugin';
export default defineConfig({
	plugins: [
		svelte(),
		prefetch(),
		UnpluginIcons({ autoInstall: true, compiler: 'svelte' }),
		VitePWA({
			strategies: 'injectManifest',
			srcDir: 'src',
			filename: 'sw.ts',
			includeAssets: [
				'robots.txt',
				'app-icons/finder/32.png',
				'cursors/(normal|link|text|help)-select.svg',
				'**/*.mp3',
			],
			manifest: {
				name: 'Owen Vellegas — macOS Portfolio',
				short_name: 'Owen’s Desktop',
				theme_color: '#ffffff',
				description: 'Owen Vellegas’s software engineering and machine learning portfolio',
				icons: [
					{
						src: 'app-icons/finder/128.webp',
						sizes: '128x128',
						type: 'image/webp',
					},
					{
						src: 'app-icons/finder/256.png',
						sizes: '256x256',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'app-icons/finder/512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
		}),
		imagetools(),
	],
	resolve: {
		alias: {
			'🍎': new URL('./src/', import.meta.url).pathname,
		},
	},
});
