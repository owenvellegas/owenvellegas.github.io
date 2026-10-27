<script lang="ts">
	import CloseIcon from '🍎/components/SVG/traffic-lights/CloseSVG.svelte';
	import GreenLight from '🍎/components/SVG/traffic-lights/GreenLight.svelte';
	import MinimizeSvg from '🍎/components/SVG/traffic-lights/MinimizeSVG.svelte';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';
	const {
		app_id,
		on_close_app,
		on_maximize_click,
		on_minimize,
	}: {
		app_id: AppID;
		on_close_app: () => void;
		on_maximize_click: () => void;
		on_minimize: () => void;
	} = $props();
</script>

<div class="container" class:unfocused={apps.active !== app_id}>
	<button
		aria-label="Close window"
		class="close-light"
		onclick={(e) => {
			e.stopPropagation();
			on_close_app();
		}}
	>
		<CloseIcon />
	</button>
	<button
		aria-label="Minimize window"
		class="minimize-light"
		onclick={(e) => {
			e.stopPropagation();
			on_minimize();
		}}
	>
		<MinimizeSvg />
	</button>
	<button
		aria-label="Toggle full screen"
		class="stretch-light"
		onclick={(e) => {
			e.stopPropagation();
			on_maximize_click();
		}}
	>
		<GreenLight expandable={apps_config[app_id].expandable} />
	</button>
</div>

<style>
	.container {
		--button-size: 0.8rem;

		display: grid;
		grid-template-columns: repeat(3, 24px);
		align-items: center;
		gap: 0;

		height: 24px;

		&.unfocused button {
			--bgcolor: #b6b6b7;
			--border-color: hsla(var(--system-color-dark-hsl), 0.5);
		}

		:global(svg) {
			opacity: 0;
		}

		&:hover {
			button {
				transform: scale(1.2);
			}

			:global(svg) {
				opacity: 1;
			}
		}
	}

	button {
		height: 24px;
		width: 24px;

		border-radius: 50%;
		flex-shrink: 0;

		background: radial-gradient(
			circle at center,
			var(--bgcolor) 0 6px,
			var(--border-color) 6px 6.5px,
			transparent 6.5px
		);
		box-shadow: none;

		transition: transform 100ms ease-in;
	}

	.close-light {
		--bgcolor: #ff5f56;
		--border-color: #e0443e;
	}

	.stretch-light {
		--bgcolor: #27c93f;
		--border-color: #1aab29;

		:global(svg) {
			transform: rotate(90deg);
		}
	}

	.minimize-light {
		--bgcolor: #ffbd2e;
		--border-color: #dea123;
	}
</style>
