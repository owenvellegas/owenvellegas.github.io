export function readLocal<T>(
	key: string,
	fallback: T,
	validate: (value: unknown) => boolean = () => true,
): T {
	try {
		const value = JSON.parse(localStorage.getItem(key) ?? 'null');
		return value !== null && validate(value) ? (value as T) : fallback;
	} catch {
		return fallback;
	}
}
export function writeLocal(key: string, value: unknown): boolean {
	try {
		localStorage.setItem(key, JSON.stringify(value));
		return true;
	} catch {
		return false;
	}
}
