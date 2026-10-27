import { auto_destroy_effect_root } from './auto-destroy-effect-root.svelte.ts';
import { readLocal, writeLocal } from '../helpers/local-storage.ts';
import { matchesShape } from '../helpers/storage-validation.ts';
type Primitive = string | null | boolean | number;
export function persisted<T extends object>(
	key: string,
	initial: T,
	validate?: (value: unknown) => boolean,
): T;
export function persisted<T extends Primitive>(
	key: string,
	initial: T,
	validate?: (value: unknown) => boolean,
): {
	value: T;
};
export function persisted<T>(
	key: string,
	initial: T,
	validate = (value: unknown) => matchesShape(value, initial),
) {
	const primitive = initial === null || typeof initial !== 'object';
	const restored = readLocal(key, initial, validate);
	const state = $state(primitive ? { value: restored } : restored);
	auto_destroy_effect_root(() => {
		$effect(() => {
			writeLocal(
				key,
				primitive
					? (
							state as {
								value: T;
							}
						).value
					: state,
			);
		});
	});
	return state;
}
