<script lang="ts">
	import { acceptsAppShortcut } from '🍎/helpers/app-keyboard';
	import { apps } from '🍎/state/apps.svelte.ts';
	import { initialCalculator, pressCalculator, calculatorKey } from './calculator';
	let calculator = $state(initialCalculator());
	const keys = [
		{ key: 'AC', label: 'AC', name: 'All clear', kind: 'top-row' },
		{ key: '+/-', label: '±', name: 'Change sign', kind: 'top-row' },
		{ key: '%', label: '%', name: 'Percent', kind: 'top-row' },
		{ key: '/', label: '÷', name: 'Divide', kind: 'operation' },
		{ key: '7', label: '7', name: '7', kind: 'number' },
		{ key: '8', label: '8', name: '8', kind: 'number' },
		{ key: '9', label: '9', name: '9', kind: 'number' },
		{ key: '*', label: '×', name: 'Multiply', kind: 'operation' },
		{ key: '4', label: '4', name: '4', kind: 'number' },
		{ key: '5', label: '5', name: '5', kind: 'number' },
		{ key: '6', label: '6', name: '6', kind: 'number' },
		{ key: '-', label: '−', name: 'Subtract', kind: 'operation' },
		{ key: '1', label: '1', name: '1', kind: 'number' },
		{ key: '2', label: '2', name: '2', kind: 'number' },
		{ key: '3', label: '3', name: '3', kind: 'number' },
		{ key: '+', label: '+', name: 'Add', kind: 'operation' },
		{ key: '0', label: '0', name: '0', kind: 'number' },
		{ key: '.', label: '.', name: 'Decimal point', kind: 'number' },
		{ key: '=', label: '=', name: 'Equals', kind: 'operation' },
	];
	function press(key: string) {
		calculator = pressCalculator(calculator, key);
	}
	function handleKey(event: KeyboardEvent) {
		if (
			apps.active !== 'calculator' ||
			apps.windows.calculator.status !== 'open' ||
			!acceptsAppShortcut(event)
		)
			return;
		const key = calculatorKey(event.key);
		if (key !== null) {
			event.preventDefault();
			press(key);
		}
	}
</script>

<svelte:window onkeydown={handleKey} />
<section class="container" aria-label="Calculator">
	<header class="app-window-drag-handle"></header>
	<output
		class="show-area"
		aria-label="Result"
		aria-live="polite"
		style:font-size={calculator.display.length > 9 ? '1.7rem' : '3rem'}>{calculator.display}</output
	>
	<section class="buttons-container" aria-label="Calculator keypad">
		{#each keys as button}
			<button
				class="{button.kind}-button"
				class:chosen={calculator.operator === button.key && calculator.waiting}
				class:curved-bottom-left-button={button.key === '0'}
				class:curved-bottom-right-button={button.key === '='}
				style:grid-column={button.key === '0' ? '1 / span 2' : undefined}
				aria-label={button.name}
				onclick={() => press(button.key)}>{button.label}</button
			>
		{/each}
	</section>
</section>

<style>
	header {
		padding: 1rem;
	}

	.container {
		height: 100%;
		width: 100%;

		background-color: hsla(240, 5%, 12%, 0.7);
		backdrop-filter: blur(15px);

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto auto 1fr;

		font-family: var(--system-font-family) !important;
	}

	.buttons-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 1px;

		margin: 1.5px;

		& > button {
			font-size: 1.414rem;
			font-weight: 400 !important;
			color: white;
			fill: white;
		}
	}

	.buttons-container button:hover {
		filter: brightness(1.15);
	}
	.buttons-container button:active {
		filter: brightness(1.35);
	}
	.buttons-container button.chosen {
		background: white;
		color: #f59a09;
	}
	.top-row-button {
		background-color: hsla(240, 5%, 12%, 0.2);
	}

	.number-button {
		background-color: hsla(240, 5%, 80%, 0.25);
	}

	.operation-button {
		background-color: hsl(37deg 98% 51%);
	}

	.curved-bottom-left-button {
		border-radius: 0 0 0 0.7rem;
	}

	.curved-bottom-right-button {
		border-radius: 0 0 0.7rem 0;
	}

	.show-area {
		font-size: 3rem;
		color: white;
		text-align: end;
		font-weight: 200;

		overflow: auto;

		padding: 0.5rem 1rem;
	}

	:global(.tl-container.calculator) {
		top: 0.7rem;
		left: 0.7rem;
	}
</style>
