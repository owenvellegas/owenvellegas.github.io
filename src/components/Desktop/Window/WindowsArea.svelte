<script lang="ts">
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { windowIds } from '🍎/configs/apps/app-ids';
	import { apps } from '🍎/state/apps.svelte';
</script>

<section id="windows-area">
	{#each windowIds as app_id}
		{#if apps.windows[app_id].status !== 'closed' && apps_config[app_id].should_open_window}
			{#await import('./Window.svelte') then { default: Window }}
				<Window {app_id} />
			{/await}
		{/if}
	{/each}
</section>

<style>
	section {
		display: block;
		height: 100%;

		width: 100vw;

		justify-self: center;
	}
</style>
