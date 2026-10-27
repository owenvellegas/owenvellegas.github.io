<script lang="ts">
	import { acceptsAppShortcut } from '🍎/helpers/app-keyboard';
	import { apps } from '🍎/state/apps.svelte';
	import { preferences } from '🍎/state/preferences.svelte';
	import { readLocal, writeLocal } from '🍎/helpers/local-storage';
	import {
		newGame,
		moveBoard,
		spawnTile,
		canMove,
		validGame,
		type GameState,
		type Direction,
	} from './engine';
	let game = $state(readLocal<GameState>('owen:2048:v1', newGame(), validGame));
	let best = $state(
		readLocal<number>('owen:2048:best', 0, (v) => Number.isInteger(v) && Number(v) >= 0),
	);
	let previous = $state<GameState | null>(null);
	let confirmNew = $state(false);
	let spawnedId = $state<number | null>(null);
	let storageOK = $state(true);
	let touch: {
		x: number;
		y: number;
	} | null = null;
	const tiles = $derived(game.board.flatMap((tile, index) => (tile ? [{ ...tile, index }] : [])));
	const won = $derived(game.board.some((t) => t && t.value >= 2048) && !game.keepGoing);
	const lost = $derived(!canMove(game.board));
	const overlay = $derived(confirmNew || won || lost);
	const palette: Record<number, string> = {
		2: '#eee4da',
		4: '#ece0c8',
		8: '#f2b179',
		16: '#f59563',
		32: '#f67c5f',
		64: '#f65e3b',
		128: '#edcf72',
		256: '#edcc61',
		512: '#edc850',
		1024: '#edc53f',
		2048: '#edc22e',
	};
	const directions: {
		dir: Direction;
		label: string;
	}[] = [
		{ dir: 'left', label: '←' },
		{ dir: 'up', label: '↑' },
		{ dir: 'down', label: '↓' },
		{ dir: 'right', label: '→' },
	];
	$effect(() => {
		storageOK = writeLocal('owen:2048:v1', game);
	});
	$effect(() => {
		if (game.score > best) best = game.score;
		writeLocal('owen:2048:best', best);
	});
	function move(direction: Direction) {
		if (overlay) return;
		const result = moveBoard(game.board, direction);
		if (!result.changed) return;
		previous = { ...game, board: game.board.map((t) => (t ? { ...t } : null)) };
		spawnedId = game.nextId;
		game = {
			...game,
			board: spawnTile(result.board, game.nextId),
			nextId: game.nextId + 1,
			score: game.score + result.gained,
		};
	}
	function undo() {
		if (!previous) return;
		game = previous;
		previous = null;
		spawnedId = null;
		confirmNew = false;
	}
	function reset() {
		game = newGame();
		previous = null;
		spawnedId = null;
		confirmNew = false;
	}
	function keydown(event: KeyboardEvent) {
		if (
			apps.active !== 'game2048' ||
			apps.windows.game2048.status !== 'open' ||
			!acceptsAppShortcut(event)
		)
			return;
		if (event.key === 'Escape' && confirmNew) {
			confirmNew = false;
			return;
		}
		const keyMap: Record<string, Direction> = {
			ArrowLeft: 'left',
			ArrowRight: 'right',
			ArrowUp: 'up',
			ArrowDown: 'down',
			a: 'left',
			d: 'right',
			w: 'up',
			s: 'down',
		};
		const direction = keyMap[event.key];
		if (direction) {
			event.preventDefault();
			move(direction);
		}
	}
	function pointerDown(e: PointerEvent) {
		if (e.pointerType === 'mouse' || (e.target as Element).closest('button')) return;
		touch = { x: e.clientX, y: e.clientY };
		e.currentTarget instanceof HTMLElement && e.currentTarget.setPointerCapture(e.pointerId);
	}
	function pointerUp(e: PointerEvent) {
		if (!touch) return;
		const dx = e.clientX - touch.x,
			dy = e.clientY - touch.y;
		touch = null;
		if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
		move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up');
	}
	function swipeControls(node: HTMLElement) {
		const cancel = () => {
			touch = null;
		};
		node.addEventListener('pointerdown', pointerDown);
		node.addEventListener('pointerup', pointerUp);
		node.addEventListener('pointercancel', cancel);
		return () => {
			node.removeEventListener('pointerdown', pointerDown);
			node.removeEventListener('pointerup', pointerUp);
			node.removeEventListener('pointercancel', cancel);
		};
	}
</script>

<svelte:window onkeydown={keydown} />
<section class="game-app" aria-label="2048 game">
	<header class="app-window-drag-handle">2048</header>
	<main>
		<div class="game-heading">
			<div><h1>2048<span>Little moves.<br />Big possibilities.</span></h1></div>
			<div class="scores">
				<div><span>SCORE</span><strong aria-live="polite">{game.score}</strong></div>
				<div><span>BEST</span><strong>{best}</strong></div>
			</div>
		</div>
		<div class="game-tools">
			<p>Join the numbers. Reach <strong>2048.</strong></p>
			<div>
				<button disabled={!previous} onclick={undo}>Undo</button><button
					class="new"
					onclick={() => (confirmNew = true)}>New game</button
				>
			</div>
		</div>

		<div
			class="board"
			role="group"
			tabindex="-1"
			aria-label="2048 board. Use arrow keys, WASD, swipe, or the direction buttons."
			class:reduced={preferences.reduced_motion}
			{@attach swipeControls}
		>
			<div class="cells" aria-hidden="true">
				{#each Array(16) as _}<div></div>{/each}
			</div>
			<div class="tile-layer">
				{#each tiles as tile (tile.id)}<div
						class="tile"
						class:spawned={tile.id === spawnedId}
						style:left="{(tile.index % 4) * 25}%"
						style:top="{Math.floor(tile.index / 4) * 25}%"
						aria-label="Row {Math.floor(tile.index / 4) + 1}, column {(tile.index % 4) +
							1}: {tile.value}"
					>
						{#key tile.value}<div
								class="face"
								style:background={palette[tile.value] || '#3c3a32'}
								style:color={tile.value <= 4 ? '#776e65' : '#fff9ef'}
								style:font-size={tile.value < 128
									? 'clamp(24px, 4vw, 35px)'
									: tile.value < 1024
										? '29px'
										: '23px'}
							>
								{tile.value}
							</div>{/key}
					</div>{/each}
			</div>
			{#if overlay}<div
					class="overlay"
					role="dialog"
					aria-label={confirmNew ? 'Start a new game?' : won ? 'You reached 2048' : 'No more moves'}
				>
					<h2>{confirmNew ? 'A fresh start?' : won ? 'You made 2048!' : 'No more moves.'}</h2>
					<p>
						{confirmNew
							? 'Your best score stays. This board will reset.'
							: won
								? 'Keep going and see how far you can take it.'
								: 'Every game starts with a little possibility.'}
					</p>
					<div>
						{#if confirmNew}<button onclick={() => (confirmNew = false)}>Cancel</button><button
								class="new"
								onclick={reset}>Start over</button
							>{:else if won}<button
								class="new"
								onclick={() => (game = { ...game, keepGoing: true })}>Keep playing</button
							><button onclick={reset}>New game</button>{:else}{#if previous}<button onclick={undo}
									>Undo move</button
								>{/if}<button class="new" onclick={reset}>Try again</button>{/if}
					</div>
				</div>{/if}
		</div>
		<div class="directions" aria-label="Move tiles">
			{#each directions as direction}<button
					aria-label="Move {direction.dir}"
					onclick={() => move(direction.dir)}
					disabled={overlay}>{direction.label}</button
				>{/each}
		</div>
		<p class="instructions">Arrow keys or WASD · Swipe on touchscreens</p>
		<p class="saved">
			{storageOK
				? 'Your game is saved in this browser.'
				: 'Progress could not be saved in this browser.'}
		</p>
	</main>
</section>

<style>
	.game-app {
		display: grid;
		grid-template-rows: 44px minmax(0, 1fr);
		height: 100%;
		min-height: 0;
		overflow: hidden;
		border-radius: inherit;
		background: #faf8f2;
		color: #776e65;
	}
	header {
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: 600;
		background: #f1eee7;
		border-bottom: 1px solid #776e6518;
	}
	main {
		padding: 23px 24px 17px;
		overflow: auto;
	}
	.game-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	h1 {
		font-size: 49px;
		font-weight: 700;
		letter-spacing: -2px;
		display: flex;
		align-items: center;
		gap: 12px;
	}
	h1 span {
		font-size: 10px;
		line-height: 1.5;
		font-weight: 400;
		letter-spacing: 0;
		opacity: 0.65;
	}
	.scores {
		display: flex;
		gap: 6px;
	}
	.scores > div {
		background: #e7e1d7;
		min-width: 52px;
		padding: 9px 9px 7px;
		border-radius: 7px;
		display: flex;
		align-items: center;
		flex-direction: column;
		gap: 5px;
	}
	.scores span {
		font-size: 8px;
		font-weight: 700;
		letter-spacing: 1px;
		opacity: 0.65;
	}
	.scores strong {
		font-size: 18px;
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}
	.game-tools {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		margin: 16px 0;
	}
	.game-tools p {
		font-size: 10px;
		line-height: 1.5;
	}
	.game-tools p strong {
		font-weight: 600;
	}
	.game-tools > div {
		display: flex;
		gap: 5px;
	}
	.game-tools button,
	.overlay button {
		background: #e9e3d9;
		border-radius: 5px;
		padding: 8px 10px;
		font-size: 10px;
		font-weight: 600;
	}
	.game-tools button.new,
	.overlay button.new {
		background: #8f7a66;
		color: #f9f6f2;
	}
	.game-tools button:disabled {
		opacity: 0.35;
	}
	.board {
		width: 100%;
		aspect-ratio: 1;
		position: relative;
		background: #bbada0;
		border-radius: 10px;
		touch-action: none;
		overflow: hidden;
		user-select: none;
		box-shadow: inset 0 1px 3px #0001;
	}
	.cells {
		position: absolute;
		inset: 8px;
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(4, 1fr);
		gap: 8px;
	}
	.cells > div {
		background: #cdc1b4;
		border-radius: 6px;
	}
	.tile-layer {
		position: absolute;
		inset: 4px;
	}
	.tile {
		position: absolute;
		width: 25%;
		height: 25%;
		padding: 4px;
		transition:
			left 130ms ease,
			top 130ms ease;
	}
	.face {
		width: 100%;
		height: 100%;
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		box-shadow: 0 1px 1px #00000008;
		animation: pop 0.17s ease;
	}
	.spawned {
		animation: appear 0.16s ease;
	}
	.overlay {
		position: absolute;
		inset: 0;
		background: #faf8f2e8;
		backdrop-filter: blur(5px);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
		padding: 30px;
		z-index: 3;
	}
	.overlay h2 {
		font-size: 28px;
		line-height: 1.2;
		font-weight: 600;
		letter-spacing: -0.7px;
	}
	.overlay p {
		font-size: 12px;
		line-height: 1.6;
		max-width: 240px;
		margin: 14px 0 20px;
		opacity: 0.7;
	}
	.overlay > div {
		display: flex;
		gap: 8px;
	}
	.overlay button {
		font-size: 12px;
		padding: 10px 15px;
	}
	.directions {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7px;
		margin-top: 14px;
	}
	.directions button {
		width: 34px;
		height: 29px;
		border: 1px solid #c8bbae50;
		border-radius: 6px;
		background: #eee7dd70;
		font-size: 18px;
		color: #8f7a66;
	}
	.directions button:hover {
		background: #ddd2c6;
	}
	.directions button:disabled {
		opacity: 0.3;
	}
	.instructions {
		font-size: 10px;
		opacity: 0.65;
		text-align: center;
		margin-top: 10px;
	}
	.saved {
		font-size: 9px;
		opacity: 0.4;
		text-align: center;
		margin-top: 8px;
	}
	.reduced .tile {
		transition: none;
	}
	.reduced .face,
	.reduced .spawned {
		animation: none;
	}
	@keyframes appear {
		from {
			opacity: 0;
			scale: 0.5;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}
	@keyframes pop {
		0% {
			scale: 0.88;
		}
		70% {
			scale: 1.06;
		}
		100% {
			scale: 1;
		}
	}
	@media (max-width: 500px) {
		main {
			padding: 18px;
		}
		.game-heading h1 {
			font-size: 40px;
		}
		.game-heading h1 span {
			display: none;
		}
		.game-tools p {
			max-width: 130px;
		}
	}
</style>
