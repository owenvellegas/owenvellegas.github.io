<script lang="ts">
	import type { AppID } from '🍎/state/apps.svelte';
	const {
		app_id,
	}: {
		app_id: AppID;
	} = $props();
</script>

{#if app_id === 'calendar'}
	{#await import('./Calendar/Calendar.svelte') then { default: Calendar }}<Calendar />{/await}
{:else if app_id === 'calculator'}
	{#await import('./Calculator/Calculator.svelte') then { default: Calculator }}<Calculator
		/>{/await}
{:else if app_id === 'wallpapers'}
	{#await import('./WallpaperApp/WallpaperSelectorApp.svelte') then { default: WallpaperSelector }}<WallpaperSelector
		/>{/await}
{:else if app_id === 'owen-profile'}
	{#await import('./Profile/Profile.svelte') then { default: Profile }}<Profile />{/await}
{:else if app_id === 'notes'}
	{#await import('./Notes/Notes.svelte') then { default: Notes }}<Notes />{/await}
{:else if app_id === 'focus'}
	{#await import('./Focus/Focus.svelte') then { default: Focus }}<Focus />{/await}
{:else if app_id === 'game2048'}
	{#await import('./Game2048/Game2048.svelte') then { default: Game }}<Game />{/await}
{/if}
