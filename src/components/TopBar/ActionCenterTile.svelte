<script lang="ts">
	import type { Snippet } from 'svelte';
	const {
		grid,
		role,
		onclick,
		onkeyup,
		children,
	}: {
		role?: 'button' | 'link' | 'region';
		grid: [rowStart: number, rowSpan: number];
		children?: Snippet;
		onclick?: (e: MouseEvent) => void;
		onkeyup?: (e: KeyboardEvent) => void;
	} = $props();
	const [rowStart, rowSpan] = $derived(grid);
</script>

<svelte:element
	this={onclick ? 'button' : 'div'}
	class="container"
	style:grid-row="{rowStart} / span {rowSpan}"
	tabindex={onclick ? 0 : undefined}
	{onclick}
	{onkeyup}
	{role}
>
	{@render children?.()}
</svelte:element>

<style>
	.container {
		display: flex;
		gap: 0.4rem;
		align-items: center;

		border-radius: inherit;

		font-size: 0.85rem;
		font-weight: 600;
		color: var(--system-color-dark);
		text-align: start;
	}
</style>
