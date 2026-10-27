export function acceptsAppShortcut(event: KeyboardEvent): boolean {
	if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || event.isComposing)
		return false;
	const target = event.target;
	return !(
		target instanceof Element &&
		target.closest('input, textarea, select, [contenteditable="true"], dialog, [data-menu-surface]')
	);
}
