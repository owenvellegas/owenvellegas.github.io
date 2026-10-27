import { windowIds, type AppID, type WindowID } from '../configs/apps/app-ids.ts';
export type WindowState = {
	status: 'closed' | 'open' | 'minimized';
	maximized: boolean;
	zIndex: number;
};
export type DesktopState = {
	windows: Record<WindowID, WindowState>;
	active: AppID;
	is_being_dragged: boolean;
};
export function createDesktopState(): DesktopState {
	const windows = Object.fromEntries(
		windowIds.map((id) => [id, { status: 'closed', maximized: false, zIndex: 0 }]),
	) as Record<WindowID, WindowState>;
	windows['owen-profile'] = { status: 'open', maximized: false, zIndex: 2 };
	return { windows, active: 'owen-profile', is_being_dragged: false };
}
export function activateWindow(state: DesktopState, app: AppID) {
	const id = app === 'finder' ? 'owen-profile' : app;
	state.windows[id].status = 'open';
	state.active = id;
	const order = windowIds
		.filter((other) => other !== id)
		.sort((a, b) => state.windows[a].zIndex - state.windows[b].zIndex);
	order.push(id);
	order.forEach((app, index) => {
		state.windows[app].zIndex = (index + 1) * 2;
	});
}
function activateNext(state: DesktopState, id: WindowID) {
	if (state.active !== id) return;
	state.active =
		windowIds
			.filter((other) => state.windows[other].status === 'open')
			.sort((a, b) => state.windows[b].zIndex - state.windows[a].zIndex)[0] ?? 'finder';
}
export function minimizeWindow(state: DesktopState, id: WindowID) {
	if (state.windows[id].status !== 'open') return;
	state.windows[id].status = 'minimized';
	activateNext(state, id);
}
export function closeWindow(state: DesktopState, id: WindowID) {
	state.windows[id].status = 'closed';
	state.windows[id].maximized = false;
	activateNext(state, id);
}
export function maximizeWindow(state: DesktopState, id: WindowID, maximized: boolean) {
	if (state.windows[id].status === 'open') state.windows[id].maximized = maximized;
}
export function hasMaximizedWindow(state: DesktopState) {
	return windowIds.some((id) => state.windows[id].status === 'open' && state.windows[id].maximized);
}
