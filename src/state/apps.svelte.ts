import {
	createDesktopState,
	activateWindow,
	minimizeWindow,
	closeWindow,
	maximizeWindow,
} from './window-manager.ts';
import type { AppID, WindowID } from '../configs/apps/app-ids.ts';
export type { AppID, WindowID } from '../configs/apps/app-ids.ts';
export const apps = $state(createDesktopState());
export const activateApp = (id: AppID) => activateWindow(apps, id);
export const minimizeApp = (id: WindowID) => minimizeWindow(apps, id);
export const closeApp = (id: WindowID) => closeWindow(apps, id);
export const setMaximized = (id: WindowID, maximized: boolean) =>
	maximizeWindow(apps, id, maximized);
