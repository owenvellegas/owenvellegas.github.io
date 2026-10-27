import { test } from 'node:test';
import assert from 'node:assert/strict';
import { windowIds } from '../src/configs/apps/app-ids.ts';
import {
	createDesktopState,
	activateWindow,
	closeWindow,
	minimizeWindow,
	maximizeWindow,
	hasMaximizedWindow,
} from '../src/state/window-manager.ts';

test('startup opens only the portfolio', () => {
	const state = createDesktopState();
	assert.equal(state.active, 'owen-profile');
	assert.deepEqual(
		windowIds.filter((id) => state.windows[id].status === 'open'),
		['owen-profile'],
	);
});
test('Finder opens the portfolio after it was closed', () => {
	const state = createDesktopState();
	closeWindow(state, 'owen-profile');
	assert.equal(state.active, 'finder');
	activateWindow(state, 'finder');
	assert.equal(state.active, 'owen-profile');
	assert.equal(state.windows['owen-profile'].status, 'open');
});
test('minimizing selects the next visible window and restoring preserves maximization', () => {
	const state = createDesktopState();
	activateWindow(state, 'calculator');
	activateWindow(state, 'notes');
	maximizeWindow(state, 'notes', true);
	minimizeWindow(state, 'notes');
	assert.equal(state.active, 'calculator');
	assert.equal(state.windows.notes.status, 'minimized');
	assert.equal(hasMaximizedWindow(state), false);
	activateWindow(state, 'notes');
	assert.equal(state.windows.notes.status, 'open');
	assert.equal(state.windows.notes.maximized, true);
	assert.equal(hasMaximizedWindow(state), true);
});
test('closing a window clears its maximized state on reopen', () => {
	const state = createDesktopState();
	activateWindow(state, 'focus');
	maximizeWindow(state, 'focus', true);
	closeWindow(state, 'focus');
	activateWindow(state, 'focus');
	assert.equal(state.windows.focus.maximized, false);
});
test('closing or minimizing a background window does not steal focus', () => {
	const state = createDesktopState();
	activateWindow(state, 'calculator');
	activateWindow(state, 'notes');
	minimizeWindow(state, 'calculator');
	assert.equal(state.active, 'notes');
	closeWindow(state, 'calculator');
	assert.equal(state.active, 'notes');
});
test('closing the foreground skips minimized and closed windows', () => {
	const state = createDesktopState();
	activateWindow(state, 'calendar');
	minimizeWindow(state, 'calendar');
	activateWindow(state, 'calculator');
	activateWindow(state, 'notes');
	closeWindow(state, 'calculator');
	closeWindow(state, 'notes');
	assert.equal(state.active, 'owen-profile');
});
test('minimizing the final visible window leaves the desktop active', () => {
	const state = createDesktopState();
	minimizeWindow(state, 'owen-profile');
	assert.equal(state.active, 'finder');
	assert.equal(state.windows['owen-profile'].status, 'minimized');
});
test('closed windows cannot become minimized or maximized', () => {
	const state = createDesktopState();
	minimizeWindow(state, 'focus');
	maximizeWindow(state, 'focus', true);
	assert.equal(state.windows.focus.status, 'closed');
	assert.equal(state.windows.focus.maximized, false);
});
test('repeated activation remains below the system UI with unique stacking order', () => {
	const state = createDesktopState();
	for (let i = 0; i < 1000; i++) activateWindow(state, windowIds[i % windowIds.length]);
	const positions = Object.values(state.windows).map((w) => w.zIndex);
	assert.equal(new Set(positions).size, windowIds.length);
	assert.ok(Math.max(...positions) < 50);
	assert.equal(state.windows[state.active].zIndex, Math.max(...positions));
});
test('independent desktop sessions do not share window objects', () => {
	const first = createDesktopState(),
		second = createDesktopState();
	activateWindow(first, 'notes');
	assert.equal(second.windows.notes.status, 'closed');
});
