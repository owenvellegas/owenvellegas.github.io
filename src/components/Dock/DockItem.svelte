<script module>
	const baseWidth = 57.6;
	const distanceLimit = baseWidth * 6;
	const beyond_the_distance_limit = distanceLimit + 1;
	const distanceInput = [
		-distanceLimit,
		-distanceLimit / 1.25,
		-distanceLimit / 2,
		0,
		distanceLimit / 2,
		distanceLimit / 1.25,
		distanceLimit,
	];
	const widthOutput = [
		baseWidth,
		baseWidth * 1.1,
		baseWidth * 1.414,
		baseWidth * 2,
		baseWidth * 1.414,
		baseWidth * 1.1,
		baseWidth,
	];
</script>

<script lang="ts">
	import { interpolate } from 'popmotion';
	import { onDestroy, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, activateApp, type AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';
	const {
		mouse_x,
		app_id,
	}: {
		mouse_x: number | null;
		app_id: AppID;
	} = $props();
	let image_el = $state<HTMLImageElement>();
	let distance = $state(beyond_the_distance_limit);
	const width_px = spring(baseWidth, {
		damping: 0.47,
		stiffness: 0.12,
	});
	const get_width_from_distance = interpolate(distanceInput, widthOutput);
	$effect(() => {
		distance;
		untrack(() => ($width_px = get_width_from_distance(distance)));
	});
	let raf: number;
	function animate() {
		if (image_el && mouse_x !== null) {
			const rect = image_el.getBoundingClientRect();
			const img_center_x = rect.left + rect.width / 2;
			const distance_delta = mouse_x - img_center_x;
			distance = distance_delta;
			return;
		}
		distance = beyond_the_distance_limit;
	}
	$effect(() => {
		mouse_x;
		if (preferences.reduced_motion || apps.is_being_dragged) {
			distance = beyond_the_distance_limit;
			$width_px = baseWidth;
			return;
		}
		raf = requestAnimationFrame(animate);
	});
	const {
		title,
		should_open_window: shouldOpenWindow,
		external_action: externalAction,
	} = $derived(apps_config[app_id]);
	const appOpenIconBounceTransform = tweened(0, {
		duration: 400,
		easing: sineInOut,
	});
	async function bounceEffect() {
		await appOpenIconBounceTransform.set(-40);
		appOpenIconBounceTransform.set(0);
	}
	async function openApp(e: MouseEvent) {
		if (!shouldOpenWindow) return externalAction?.(e);
		const isAppAlreadyOpen = app_id === 'finder' || apps.windows[app_id].status !== 'closed';
		activateApp(app_id);
		if (isAppAlreadyOpen || preferences.reduced_motion) return;
		bounceEffect();
	}
	onDestroy(() => {
		cancelAnimationFrame(raf);
	});
</script>

<button onclick={openApp} aria-label="Launch {title} app" class="dock-open-app-button {app_id}">
	<p
		class="tooltip"
		class:tooltip-enabled={!apps.is_being_dragged}
		class:dark={preferences.theme.scheme === 'dark'}
		style:top={preferences.reduced_motion ? '-50px' : '-35%'}
		style:transform="translate(0, {$appOpenIconBounceTransform}px)"
		use:elevation={'dock-tooltip'}
	>
		{title}
	</p>

	<span style:transform="translate(0, {$appOpenIconBounceTransform}px)">
		<img
			bind:this={image_el}
			src={app_id === 'owen-profile'
				? '/owen-icon.svg'
				: app_id === 'notes'
					? '/app-icons/notes/256.png'
					: ['focus', 'game2048'].includes(app_id)
						? `/app-icons/${app_id}.svg`
						: `/app-icons/${app_id}/256.webp`}
			alt="{title} app"
			style:width="min({$width_px / 16}rem, calc((100vw - 36px) / {Object.keys(apps_config)
				.length}))"
			draggable="false"
		/>
	</span>

	<div
		class="dot"
		style:--opacity={+(app_id === 'finder' || apps.windows[app_id].status !== 'closed')}
	></div>
</button>

<style>
	img {
		will-change: width;
	}

	button {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: relative;

		border-radius: 0.5rem;

		&:hover,
		&:focus-visible {
			.tooltip.tooltip-enabled {
				display: block;
			}
		}

		& > span {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.tooltip {
		--double-border: 0 0 0 0 white;

		white-space: nowrap;

		position: absolute;

		background-color: hsla(var(--system-color-light-hsl), 0.5);
		backdrop-filter: blur(5px);

		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;

		box-shadow:
			hsla(0deg, 0%, 0%, 30%) 0px 1px 5px 2px,
			var(--double-border);

		color: var(--system-color-light-contrast);
		font-family: var(--system-font-family);
		font-weight: 400;
		font-size: 0.9rem;
		letter-spacing: 0.4px;

		display: none;

		&.dark {
			--double-border:
				inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
				0 0 0 1.2px hsla(var(--system-color-light-hsl), 0.3);
		}
	}

	.dot {
		height: 4px;
		width: 4px;

		margin: 0px;

		border-radius: 50%;

		background-color: var(--system-color-dark);

		opacity: var(--opacity);
	}
</style>
