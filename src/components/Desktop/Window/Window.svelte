<script lang="ts">
	import {
		bounds,
		BoundsFrom,
		Compartment,
		ControlFrom,
		controls,
		disabled,
		draggable,
		events,
		position,
	} from '@neodrag/svelte';
	import { onMount, onDestroy, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { rand_int } from '🍎/helpers/random.ts';
	import {
		apps,
		activateApp,
		minimizeApp,
		setMaximized,
		closeApp as closeWindow,
		type WindowID,
	} from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import AppNexus from '../../apps/AppNexus.svelte';
	import TrafficLights from './TrafficLights.svelte';
	const {
		app_id,
	}: {
		app_id: WindowID;
	} = $props();
	let dragging_enabled = $state(true);
	const is_maximized = $derived(apps.windows[app_id].maximized);
	let transitionTimer: ReturnType<typeof setTimeout>;
	let minimized_transform = $state<string>();
	let windowEl = $state<HTMLElement>();
	const { height, width } = $derived(apps_config[app_id]);
	const remModifier = 16;
	const randX = rand_int(-600, 600);
	const randY = rand_int(-100, 100);
	const defaultPosition = untrack(() => ({
		x: Math.max(
			8,
			Math.min(
				(window.innerWidth - Math.min(+width, window.innerWidth - 16)) / 2 +
					(app_id === 'owen-profile' ? 0 : randX / 8),
				window.innerWidth - Math.min(+width, window.innerWidth - 16) - 8,
			),
		),
		y: Math.max(
			16,
			(window.innerHeight - Math.min(+height, window.innerHeight - 125) - 110) / 2 +
				(app_id === 'owen-profile' ? 0 : randY / 4),
		),
	}));
	const disabledComp = Compartment.of(() => disabled(!dragging_enabled));
	function focusApp() {
		activateApp(app_id);
	}
	function windowCloseTransition(
		el: HTMLElement,
		{ duration = preferences.reduced_motion ? 0 : 300 }: SvelteTransitionConfig = {},
	): SvelteTransitionReturnType {
		const existingTransform = getComputedStyle(el).transform;
		return {
			duration,
			easing: sineInOut,
			css: (t) => `opacity: ${t}; transform: ${existingTransform} scale(${t})`,
		};
	}
	function maximizeApp() {
		focusApp();
		clearTimeout(transitionTimer);
		if (!preferences.reduced_motion) {
			windowEl.style.transition =
				'height var(--motion-window) ease, width var(--motion-window) ease, transform var(--motion-window) ease';
		}
		if (!is_maximized) {
			dragging_enabled = false;
			minimized_transform = windowEl.style.transform;
			windowEl.style.transform = `translate(0px, 0px)`;
			windowEl.style.width = `100%`;
			windowEl.style.height = 'calc(100dvh - var(--menu-bar-height))';
		} else {
			dragging_enabled = true;
			windowEl.style.transform = minimized_transform;
			windowEl.style.width = `${+width / remModifier}rem`;
			windowEl.style.height = `${+height / remModifier}rem`;
		}
		setMaximized(app_id, !is_maximized);
		transitionTimer = setTimeout(() => {
			if (windowEl) windowEl.style.transition = '';
		}, 300);
	}
	function closeApp() {
		closeWindow(app_id);
	}
	function activateOnPointer(node: HTMLElement) {
		const focus = () => {
			if (apps.windows[app_id].status === 'open') focusApp();
		};
		node.addEventListener('pointerdown', focus, true);
		return () => node.removeEventListener('pointerdown', focus, true);
	}
	onDestroy(() => {
		clearTimeout(transitionTimer);
		apps.is_being_dragged = false;
	});
	function onAppDragStart() {
		focusApp();
		apps.is_being_dragged = true;
	}
	function onAppDragEnd() {
		apps.is_being_dragged = false;
	}
	onMount(() => {
		if (apps.active === app_id) windowEl?.focus();
	});
</script>

<section
	data-app-id={app_id}
	class="container"
	class:normal-size={!is_maximized}
	class:minimized={apps.windows[app_id].status === 'minimized'}
	aria-label={apps_config[app_id].title}
	inert={apps.windows[app_id].status !== 'open'}
	class:dark={preferences.theme.scheme === 'dark'}
	class:active={apps.active === app_id}
	style:width="{+width / remModifier}rem"
	style:height="{+height / remModifier}rem"
	style:z-index={apps.windows[app_id].zIndex}
	tabindex="-1"
	bind:this={windowEl}
	{@attach draggable(() => [
		controls({ allow: ControlFrom.selector('.app-window-drag-handle') }),
		bounds(BoundsFrom.viewport({ bottom: 88, top: 28.8, left: 8, right: 8 })),
		disabledComp,
		position({ default: defaultPosition }),
		events({ onDragStart: onAppDragStart, onDragEnd: onAppDragEnd }),
	])}
	{@attach activateOnPointer}
	onfocusin={focusApp}
	out:windowCloseTransition
>
	<div class="tl-container {app_id}" use:elevation={'window-traffic-lights'}>
		<TrafficLights
			{app_id}
			on_maximize_click={maximizeApp}
			on_close_app={closeApp}
			on_minimize={() => minimizeApp(app_id)}
		/>
	</div>

	<AppNexus {app_id} />
</section>

<style>
	.container {
		--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.115), 0px 68px 80px rgba(0, 0, 0, 0.23);

		width: 100%;
		height: 100%;

		display: grid;
		grid-template-rows: 1fr;

		position: absolute;

		will-change: width, height;

		border-radius: var(--window-radius);
		box-shadow: var(--elevated-shadow);

		cursor: var(--system-cursor-default), auto;

		&.active {
			--elevated-shadow: 0px 8.5px 10px rgba(0, 0, 0, 0.28), 0px 68px 80px rgba(0, 0, 0, 0.56);
		}

		&.dark {
			& > :global(section),
			& > :global(div) {
				border-radius: inherit;
				box-shadow:
					inset 0 0 0 0.9px hsla(var(--system-color-dark-hsl), 0.3),
					0 0 0 1px hsla(var(--system-color-light-hsl), 0.5),
					var(--elevated-shadow);
			}
		}
	}

	.normal-size {
		max-width: calc(100vw - 16px);
		max-height: calc(100dvh - 125px);
	}
	.minimized {
		opacity: 0;
		visibility: hidden;
		pointer-events: none;
	}
	.tl-container {
		position: absolute;
		top: 0.65rem;
		left: 0.65rem;
		box-shadow: none !important;
	}
</style>
