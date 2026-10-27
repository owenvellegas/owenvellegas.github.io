<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte';
	import { onMount } from 'svelte';
	import { readLocal, writeLocal } from '🍎/helpers/local-storage';
	import { createTimer, remainingSeconds, startTimer, pauseTimer, validTimer } from './timer';
	import PlayIcon from '~icons/mdi/play';
	import PauseIcon from '~icons/mdi/pause';
	import ResetIcon from '~icons/mdi/restart';
	let timer = $state(readLocal('owen:focus:v1', createTimer(), validTimer));
	let now = $state(Date.now());
	let minutes = $state(25);
	let completed = $state(
		readLocal<number>('owen:focus:completed', 0, (v) => Number.isInteger(v) && Number(v) >= 0),
	);
	let saveOK = $state(true);
	const left = $derived(remainingSeconds(timer, now));
	const running = $derived(timer.deadline !== null);
	const label = $derived(
		`${Math.floor(left / 60)
			.toString()
			.padStart(2, '0')}:${(left % 60).toString().padStart(2, '0')}`,
	);
	const presets = [
		{ name: 'Focus', minutes: 25 },
		{ name: 'Short break', minutes: 5 },
		{ name: 'Long break', minutes: 15 },
	];
	$effect(() => {
		saveOK = writeLocal('owen:focus:v1', timer);
	});
	$effect(() => {
		writeLocal('owen:focus:completed', completed);
	});
	onMount(() => {
		const tick = () => {
			now = Date.now();
			if (timer.deadline !== null && remainingSeconds(timer, now) === 0) {
				timer = { ...timer, deadline: null, remaining: 0 };
				completed += 1;
			}
		};
		tick();
		const id = setInterval(tick, 250);
		return () => clearInterval(id);
	});
	function toggle() {
		now = Date.now();
		timer = running ? pauseTimer(timer, now) : startTimer(timer, now);
	}
	function choose(amount: number, mode: string) {
		if (running) return;
		timer = createTimer(amount * 60, mode);
		minutes = amount;
	}
	function custom() {
		const amount = Math.min(180, Math.max(1, Math.round(Number(minutes) || 25)));
		choose(amount, 'Custom');
	}
</script>

<section class="focus-app" class:reduced={preferences.reduced_motion} aria-label="Focus timer">
	<header class="app-window-drag-handle">Focus</header>
	<main>
		<div class="segmented" aria-label="Timer presets">
			{#each presets as preset}<button
					class:selected={timer.mode === preset.name}
					disabled={running}
					onclick={() => choose(preset.minutes, preset.name)}>{preset.name}</button
				>{/each}
		</div>
		<div class="timer-ring" role="timer" aria-label="{label} remaining">
			<svg viewBox="0 0 240 240" aria-hidden="true"
				><circle class="track" cx="120" cy="120" r="106" /><circle
					class="progress"
					cx="120"
					cy="120"
					r="106"
					stroke-dasharray="666.018"
					stroke-dashoffset={666.018 * (1 - left / timer.duration)}
				/></svg
			>
			<div class="timer-text">
				<span class="mode">{timer.mode.toUpperCase()}</span><strong>{label}</strong><span
					class="state"
					>{left === 0
						? 'Session complete. Nicely done.'
						: running
							? 'One thing at a time.'
							: left < timer.duration
								? 'Paused. Take your time.'
								: 'Make a little room to focus.'}</span
				>
			</div>
		</div>
		<div class="controls">
			<button
				class="reset"
				aria-label="Reset timer"
				onclick={() => (timer = createTimer(timer.duration, timer.mode))}><ResetIcon /></button
			><button class="start" onclick={toggle}
				>{#if running}<PauseIcon />Pause{:else}<PlayIcon />{left === 0
						? 'Start again'
						: left < timer.duration
							? 'Resume'
							: 'Start'}{/if}</button
			>
		</div>
		<form
			class="custom"
			onsubmit={(e) => {
				e.preventDefault();
				custom();
			}}
		>
			<label for="focus-minutes">Custom timer</label>
			<div>
				<input
					id="focus-minutes"
					aria-label="Minutes"
					type="number"
					min="1"
					max="180"
					step="1"
					bind:value={minutes}
					disabled={running}
				/><span>min</span><button disabled={running}>Set</button>
			</div>
		</form>
		<div class="summary">
			<span class="spark">✦</span><span
				>{completed} {completed === 1 ? 'session' : 'sessions'} completed</span
			>
		</div>
		<p class="footnote">
			{saveOK ? 'Keeps time when this window is closed.' : 'Timer cannot be saved in this browser.'}
		</p>
	</main>
</section>

<style>
	.focus-app {
		height: 100%;
		min-height: 0;
		display: grid;
		grid-template-rows: 44px minmax(0, 1fr);
		background: var(--system-color-light);
		color: var(--system-color-dark);
		border-radius: inherit;
		overflow: hidden;
	}
	header {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: 600;
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.08);
		background: hsla(var(--system-color-dark-hsl), 0.025);
	}
	main {
		padding: 24px 28px 18px;
		overflow: auto;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	.segmented {
		width: 100%;
		display: flex;
		padding: 3px;
		border-radius: 9px;
		background: hsla(var(--system-color-dark-hsl), 0.055);
		gap: 3px;
	}
	.segmented button {
		flex: 1;
		padding: 8px 3px;
		border-radius: 7px;
		font-size: 11px;
		white-space: nowrap;
		color: hsla(var(--system-color-dark-hsl), 0.6);
	}
	.segmented button.selected {
		background: var(--system-color-light);
		color: var(--system-color-dark);
		box-shadow: 0 1px 4px #0002;
	}
	.segmented button:disabled:not(.selected) {
		opacity: 0.4;
	}
	.timer-ring {
		position: relative;
		width: 250px;
		max-width: 100%;
		aspect-ratio: 1;
		margin: 21px auto 17px;
		flex-shrink: 0;
	}
	.timer-ring svg {
		width: 100%;
		height: 100%;
		transform: rotate(-90deg);
	}
	circle {
		fill: none;
		stroke-width: 6;
		stroke-linecap: round;
	}
	.track {
		stroke: hsla(var(--system-color-dark-hsl), 0.075);
	}
	.progress {
		stroke: #e9a149;
		transition: stroke-dashoffset 0.3s linear;
	}
	.timer-text {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.mode {
		font-size: 10px;
		letter-spacing: 2px;
		color: #c98d3d;
		font-weight: 600;
	}
	.timer-text strong {
		font-size: 57px;
		font-weight: 300;
		letter-spacing: -2px;
		font-variant-numeric: tabular-nums;
		margin: 13px 0 9px;
	}
	.state {
		font-size: 11px;
		opacity: 0.5;
	}
	.controls {
		display: flex;
		align-items: center;
		gap: 13px;
	}
	.start {
		background: #e8a249;
		color: #21190e;
		border-radius: 100px;
		padding: 12px 28px;
		min-width: 135px;
		font-size: 13px;
		font-weight: 600;
		gap: 6px;
	}
	.start:hover {
		background: #f0b25f;
	}
	.start :global(svg) {
		font-size: 21px;
	}
	.reset {
		width: 42px;
		height: 42px;
		border-radius: 50%;
		background: hsla(var(--system-color-dark-hsl), 0.06);
	}
	.reset:hover {
		background: hsla(var(--system-color-dark-hsl), 0.12);
	}
	.reset :global(svg) {
		font-size: 23px;
		opacity: 0.65;
	}
	.custom {
		margin-top: 24px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		border-top: 1px solid hsla(var(--system-color-dark-hsl), 0.08);
		padding-top: 17px;
		gap: 15px;
	}
	.custom label {
		font-size: 12px;
		opacity: 0.6;
	}
	.custom > div {
		display: flex;
		align-items: center;
		gap: 7px;
	}
	.custom input {
		width: 49px;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.12);
		background: hsla(var(--system-color-dark-hsl), 0.035);
		color: inherit;
		border-radius: 5px;
		padding: 5px;
		font: inherit;
		font-size: 12px;
	}
	.custom span {
		font-size: 11px;
		opacity: 0.5;
	}
	.custom button {
		padding: 6px 10px;
		border-radius: 5px;
		background: hsla(var(--system-color-dark-hsl), 0.08);
		font-size: 11px;
	}
	button:disabled,
	input:disabled {
		opacity: 0.4;
	}
	.summary {
		display: flex;
		align-items: center;
		gap: 7px;
		margin-top: 20px;
		font-size: 11px;
		opacity: 0.6;
	}
	.spark {
		color: #e8a249;
	}
	.footnote {
		font-size: 9px;
		line-height: 1.5;
		opacity: 0.35;
		margin-top: 12px;
		text-align: center;
	}
	.reduced .progress {
		transition: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.progress {
			transition: none;
		}
	}
	@media (max-height: 720px) {
		main {
			padding-top: 16px;
		}
		.timer-ring {
			width: 200px;
			margin: 14px auto;
		}
		.timer-text strong {
			font-size: 46px;
		}
		.custom {
			margin-top: 16px;
		}
	}
</style>
