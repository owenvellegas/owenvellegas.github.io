export function matchesShape(value: unknown, initial: unknown): boolean {
	if (initial === null) return value === null;
	if (typeof initial === 'number') return typeof value === 'number' && Number.isFinite(value);
	if (typeof initial !== 'object') return typeof value === typeof initial;
	if (Array.isArray(initial)) return Array.isArray(value);
	if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
	return Object.entries(initial).every(
		([key, item]) =>
			Object.hasOwn(value, key) && matchesShape((value as Record<string, unknown>)[key], item),
	);
}
