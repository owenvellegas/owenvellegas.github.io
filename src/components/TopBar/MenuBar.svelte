<script lang="ts">
	import AppleIcon from '~icons/mdi/apple';
	import { click_outside, focus_outside, elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps, activateApp, type AppID } from '🍎/state/apps.svelte';
	let expanded = $state(false);
	const appList = Object.entries(apps_config).filter(([id]) => id !== 'finder');
	function launch(id: AppID) {
		activateApp(id);
		expanded = false;
	}
</script>

<svelte:window
	onkeydown={(e) => {
		if (e.key === 'Escape') expanded = false;
	}}
/>
<div
	class="menu-bar"
	data-menu-surface
	use:click_outside={() => (expanded = false)}
	use:focus_outside={() => (expanded = false)}
>
	<button class="apple" aria-label="Open About Owen" onclick={() => launch('owen-profile')}
		><AppleIcon /></button
	>
	<span class="active-title">{apps_config[apps.active].title}</span>
	<button
		class:expanded
		aria-expanded={expanded}
		aria-controls="apps-menu"
		onclick={() => (expanded = !expanded)}>Apps</button
	>
	{#if expanded}
		<nav id="apps-menu" aria-label="Open an app" use:elevation={'menubar-menu-parent'}>
			{#each appList as [id, config]}
				<button onclick={() => launch(id as AppID)}
					>{config.title}<span>{apps.windows[id].status !== 'closed' ? '●' : ''}</span></button
				>
			{/each}
		</nav>
	{/if}
</div>

<style>
	.menu-bar {
		height: 100%;
		display: flex;
		align-items: center;
		position: relative;
		z-index: 170;
		gap: 4px;
	}
	button {
		padding: 0 11px;
		height: 100%;
		font-size: 13px;
		border-radius: 4px;
	}
	button:hover,
	button.expanded {
		background: hsla(var(--system-color-dark-hsl), 0.14);
	}
	.apple {
		margin-left: 7px;
		padding: 0 9px;
	}
	.apple :global(svg) {
		width: 18px;
		height: 18px;
	}
	.active-title {
		font-size: 13px;
		font-weight: 600;
		padding: 0 11px;
		white-space: nowrap;
	}
	nav {
		position: absolute;
		top: calc(100% + 4px);
		left: 120px;
		min-width: 200px;
		border-radius: 9px;
		padding: 6px;
		background: hsla(var(--system-color-light-hsl), 0.88);
		color: var(--system-color-dark);
		backdrop-filter: blur(25px);
		box-shadow:
			0 8px 30px #0004,
			inset 0 0 0 1px #ffffff25;
	}
	nav button {
		width: 100%;
		padding: 8px 10px;
		display: flex;
		justify-content: space-between;
	}
	nav button:hover {
		background: var(--system-color-primary);
		color: white;
	}
	nav button span {
		font-size: 8px;
	}
	@media (max-width: 600px) {
		.active-title {
			display: none;
		}
		nav {
			left: 6px;
		}
	}
</style>
