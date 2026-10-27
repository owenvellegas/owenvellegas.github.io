import { onDestroy } from 'svelte';
export function auto_destroy_effect_root(fn: () => void | VoidFunction) {
	let cleanup: VoidFunction | null = $effect.root(fn);
	function destroy() {
		if (cleanup === null) {
			return;
		}
		cleanup();
		cleanup = null;
	}
	try {
		onDestroy(destroy);
	} catch {}
	return destroy;
}
