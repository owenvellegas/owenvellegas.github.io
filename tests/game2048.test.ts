import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	moveBoard,
	spawnTile,
	canMove,
	newGame,
	validGame,
	type Board,
	type Direction,
} from '../src/components/apps/Game2048/engine.ts';
const board = (values: number[]): Board =>
	Array.from({ length: 16 }, (_, i) => (values[i] ? { id: i + 1, value: values[i] } : null));
const values = (b: Board) => b.map((t) => t?.value ?? 0);
const sum = (b: Board) => b.reduce((total, t) => total + (t?.value ?? 0), 0);
test('left merge skips gaps, scores, and does not mutate input', () => {
	const before = board([2, 0, 2, 4]);
	const result = moveBoard(before, 'left');
	assert.deepEqual(values(result.board).slice(0, 4), [4, 4, 0, 0]);
	assert.equal(result.gained, 4);
	assert.equal(result.changed, true);
	assert.deepEqual(values(before).slice(0, 4), [2, 0, 2, 4]);
});
test('four identical tiles merge in pairs only', () => {
	const result = moveBoard(board([2, 2, 2, 2]), 'left');
	assert.deepEqual(values(result.board).slice(0, 4), [4, 4, 0, 0]);
	assert.equal(result.gained, 8);
});
test('newly merged tiles never merge twice in a move', () => {
	assert.deepEqual(values(moveBoard(board([2, 2, 4, 0]), 'left').board).slice(0, 4), [4, 4, 0, 0]);
});
test('right merges start from the rightmost edge', () => {
	assert.deepEqual(values(moveBoard(board([2, 2, 2, 0]), 'right').board).slice(0, 4), [0, 0, 2, 4]);
});
test('up combines a column without crossing columns', () => {
	const result = moveBoard(board([2, 4, 0, 0, 0, 0, 0, 0, 2, 8, 0, 0]), 'up');
	assert.deepEqual(values(result.board), [4, 4, 0, 0, 0, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
});
test('down combines from the bottommost edge', () => {
	const result = moveBoard(board([2, 0, 0, 0, 2, 0, 0, 0, 2]), 'down');
	assert.deepEqual(values(result.board), [0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 4, 0, 0, 0]);
});
test('unchanged moves are reported so they do not spawn tiles', () => {
	const result = moveBoard(board([2, 4, 8, 16]), 'left');
	assert.equal(result.changed, false);
	assert.equal(result.gained, 0);
});
test('1024 pair reaches 2048 and awards 2048 points', () => {
	const result = moveBoard(board([1024, 1024]), 'left');
	assert.equal(result.board[0]?.value, 2048);
	assert.equal(result.gained, 2048);
});
test('spawning chooses an empty cell and preserves existing tiles', () => {
	const before = board([4]);
	const result = spawnTile(before, 17, () => 0);
	assert.deepEqual(result[0], before[0]);
	assert.deepEqual(result[1], { id: 17, value: 2 });
	assert.equal(before[1], null);
});
test('spawning supports a four and the final empty cell', () => {
	const result = spawnTile(board([2]), 17, () => 0.99);
	assert.deepEqual(result[15], { id: 17, value: 4 });
});
test('full board spawns no tile', () => {
	const before = board(Array(16).fill(2));
	assert.equal(spawnTile(before, 17), before);
});
test('game over requires a full board with no adjacent matches', () => {
	const blocked = board([2, 4, 2, 4, 4, 2, 4, 2, 2, 4, 2, 4, 4, 2, 4, 2]);
	assert.equal(canMove(blocked), false);
	const empty = blocked.slice();
	empty[0] = null;
	assert.equal(canMove(empty), true);
	const horizontal = blocked.slice();
	horizontal[1] = { id: 2, value: 2 };
	assert.equal(canMove(horizontal), true);
	const vertical = blocked.slice();
	vertical[4] = { id: 5, value: 2 };
	assert.equal(canMove(vertical), true);
});
test('new game has two valid independent tiles and zero score', () => {
	const game = newGame();
	assert.equal(game.board.filter(Boolean).length, 2);
	assert.equal(game.score, 0);
	assert.equal(validGame(game), true);
});
test('invalid saved games cannot enter the engine', () => {
	const good = { board: board([2, 4]), score: 0, nextId: 17, keepGoing: false };
	assert.equal(validGame(good), true);
	for (const bad of [
		null,
		{},
		{ ...good, board: [] },
		{ ...good, score: -1 },
		{ ...good, nextId: 1 },
		{ ...good, keepGoing: 'false' },
		{ ...good, board: [false, ...good.board.slice(1)] },
		{ ...good, board: [0, ...good.board.slice(1)] },
		{ ...good, board: [{ id: 1, value: 3 }, ...good.board.slice(1)] },
		{ ...good, board: [{ id: 2, value: 2 }, ...good.board.slice(1)] },
	]) {
		assert.equal(validGame(bad), false);
	}
});
test('hundreds of seeded boards conserve totals and tile identity in every direction', () => {
	let seed = 104729;
	const random = () => {
		seed = (seed * 1664525 + 1013904223) >>> 0;
		return seed / 4294967296;
	};
	for (let sample = 0; sample < 300; sample++) {
		const input = board(
			Array.from({ length: 16 }, () => (random() < 0.3 ? 0 : 2 ** (1 + Math.floor(random() * 5)))),
		);
		for (const direction of ['left', 'right', 'up', 'down'] as Direction[]) {
			const result = moveBoard(input, direction);
			assert.equal(sum(result.board), sum(input));
			const tiles = result.board.filter(Boolean);
			assert.equal(new Set(tiles.map((t) => t!.id)).size, tiles.length);
			assert.ok(result.gained >= 0);
			assert.equal(
				validGame({ board: result.board, score: result.gained, nextId: 17, keepGoing: false }),
				true,
			);
		}
	}
});
