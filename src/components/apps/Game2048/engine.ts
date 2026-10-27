export type Tile = {
	id: number;
	value: number;
};
export type Board = (Tile | null)[];
export type Direction = 'left' | 'right' | 'up' | 'down';
export type GameState = {
	board: Board;
	score: number;
	nextId: number;
	keepGoing: boolean;
};
export function moveBoard(board: Board, direction: Direction) {
	const next: Board = Array(16).fill(null);
	let gained = 0;
	for (let line = 0; line < 4; line++) {
		const indices = Array.from({ length: 4 }, (_, p) =>
			direction === 'left'
				? line * 4 + p
				: direction === 'right'
					? line * 4 + 3 - p
					: direction === 'up'
						? p * 4 + line
						: (3 - p) * 4 + line,
		);
		const tiles = indices.map((i) => board[i]).filter((tile): tile is Tile => tile !== null);
		let target = 0;
		for (let i = 0; i < tiles.length; i++) {
			let tile = { ...tiles[i] };
			if (i + 1 < tiles.length && tiles[i + 1].value === tile.value) {
				tile.value *= 2;
				gained += tile.value;
				i++;
			}
			next[indices[target++]] = tile;
		}
	}
	return {
		board: next,
		gained,
		changed: next.some((tile, i) => tile?.id !== board[i]?.id || tile?.value !== board[i]?.value),
	};
}
export function spawnTile(board: Board, id: number, random = Math.random): Board {
	const empty = board.flatMap((t, i) => (t ? [] : [i]));
	if (!empty.length) return board;
	const result = board.slice();
	result[empty[Math.min(empty.length - 1, Math.floor(random() * empty.length))]] = {
		id,
		value: random() < 0.9 ? 2 : 4,
	};
	return result;
}
export const newGame = (): GameState => ({
	board: spawnTile(spawnTile(Array(16).fill(null), 1), 2),
	score: 0,
	nextId: 3,
	keepGoing: false,
});
export function canMove(board: Board): boolean {
	if (board.some((t) => t === null)) return true;
	return board.some(
		(t, i) =>
			(i % 4 < 3 && t.value === board[i + 1]?.value) || (i < 12 && t.value === board[i + 4]?.value),
	);
}
export function validGame(v: any): boolean {
	if (
		!v ||
		!Array.isArray(v.board) ||
		v.board.length !== 16 ||
		!Number.isInteger(v.score) ||
		v.score < 0 ||
		!Number.isInteger(v.nextId) ||
		v.nextId < 1 ||
		typeof v.keepGoing !== 'boolean'
	)
		return false;
	const tiles = v.board.filter((t) => t !== null);
	return (
		tiles.every(
			(t) =>
				t &&
				Number.isInteger(t.id) &&
				t.id > 0 &&
				t.id < v.nextId &&
				Number.isInteger(t.value) &&
				t.value >= 2 &&
				Number.isInteger(Math.log2(t.value)),
		) && new Set(tiles.map((t) => t.id)).size === tiles.length
	);
}
