export type Note = {
	id: string;
	title: string;
	body: string;
	updated: number;
};
export function validNotes(value: unknown): value is Note[] {
	if (!Array.isArray(value)) return false;
	return (
		value.every(
			(note) =>
				note &&
				typeof note.id === 'string' &&
				note.id.length > 0 &&
				typeof note.title === 'string' &&
				typeof note.body === 'string' &&
				Number.isFinite(note.updated) &&
				note.updated >= 0,
		) && new Set(value.map((note) => note.id)).size === value.length
	);
}
