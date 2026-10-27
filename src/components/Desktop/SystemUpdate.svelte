<script lang="ts">
	import { useRegisterSW } from 'virtual:pwa-register/svelte';
	import SystemDialog from '../SystemUI/SystemDialog.svelte';
	let system_update_dialog = $state<SystemDialog>();
	let updating = $state(false);
	let error = $state('');
	const { needRefresh, updateServiceWorker } = useRegisterSW();
	$effect(() => {
		if ($needRefresh) system_update_dialog?.open();
	});
	async function handle_update_app() {
		if (updating) return;
		updating = true;
		error = '';
		try {
			await updateServiceWorker();
		} catch {
			error = 'Update could not finish. Reload the page to try again.';
		} finally {
			updating = false;
		}
	}
</script>

<SystemDialog
	label="Website update"
	bind:this={system_update_dialog}
	on_close={() => needRefresh.set(false)}
>
	<section class="system-update-section">
		<img
			width="128"
			height="128"
			src="/app-icons/system-preferences/256.webp"
			alt="System settings"
			draggable="false"
		/>

		<h3>Updates Available</h3>
		<p>Do you want to restart to install these updates now?</p>

		{#if error}<p role="alert">{error}</p>{/if}
		<div class="buttons">
			<button onclick={() => system_update_dialog.close()}>Later</button>
			<button class="confirm" disabled={updating} onclick={handle_update_app}
				>{updating ? 'Updating…' : 'Update'}</button
			>
		</div>
	</section>
</SystemDialog>

<style>
	.system-update-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;

		padding: 1rem 0 0;

		width: 20rem;

		color: var(--system-color-dark);

		h3,
		p {
			text-align: center;
		}

		h3 {
			font-size: 1.2rem;
			font-weight: 500;
		}

		p {
			font-size: 0.9rem;
		}

		.buttons {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.5rem;

			width: 100%;

			button {
				width: 100%;
				height: 2rem;

				font-weight: 500;

				border-radius: 0.5rem;

				background-color: hsla(var(--system-color-dark-hsl), 0.2);

				&:hover {
					background-color: hsla(var(--system-color-dark-hsl), 0.3);
				}

				&.confirm {
					background-color: var(--system-color-primary);

					color: var(--system-color-primary-contrast);

					&:hover {
						background-color: hsla(var(--system-color-primary-hsl), 0.8);
					}
				}
			}
		}
	}
</style>
