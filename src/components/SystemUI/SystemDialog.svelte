<script lang="ts">
	import { tick, type Snippet } from 'svelte';
	import { preferences } from '🍎/state/preferences.svelte';
	const {
		label,
		backdrop_dismiss = true,
		on_open,
		on_close,
		children,
	}: {
		label: string;
		backdrop_dismiss?: boolean;
		on_open?: () => void;
		on_close?: (message?: string) => void;
		children: Snippet;
	} = $props();
	let dialog = $state<HTMLDialogElement>();
	export async function open() {
		await tick();
		if (!dialog || dialog.open) return;
		dialog.showModal();
		on_open?.();
	}
	export function close(message = '') {
		dialog?.close(message);
		return message;
	}
	function dismissBackdrop(event: MouseEvent) {
		if (!backdrop_dismiss || event.target !== dialog) return;
		const bounds = dialog.getBoundingClientRect();
		if (
			event.clientX < bounds.left ||
			event.clientX > bounds.right ||
			event.clientY < bounds.top ||
			event.clientY > bounds.bottom
		)
			close();
	}
</script>

<dialog
	bind:this={dialog}
	aria-label={label}
	class:dark={preferences.theme.scheme === 'dark'}
	class:reduced={preferences.reduced_motion}
	onclick={dismissBackdrop}
	oncancel={(event) => {
		event.preventDefault();
		close();
	}}
	onclose={() => on_close?.(dialog.returnValue)}
>
	{@render children()}
</dialog>

<style>
	dialog {
		border: 0;
		margin: auto;
		padding: 1rem;
		max-width: calc(100vw - 32px);
		max-height: calc(100dvh - 32px);
		overflow: auto;
		border-radius: var(--window-radius);
		color: var(--system-color-dark);
		background: hsla(var(--system-color-light-hsl), 0.9);
		backdrop-filter: blur(20px);
		box-shadow: 0 22px 80px #0005;
	}
	dialog[open] {
		animation: appear 250ms ease;
	}
	dialog.dark {
		box-shadow:
			0 22px 80px #0008,
			inset 0 0 0 1px #ffffff20;
	}
	dialog::backdrop {
		background: #0003;
	}
	dialog.reduced {
		animation: none;
	}
	dialog :global(section) {
		max-width: 100%;
	}
	@keyframes appear {
		from {
			opacity: 0;
			transform: scale(0.92);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>
