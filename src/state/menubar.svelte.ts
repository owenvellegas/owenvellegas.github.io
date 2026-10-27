import { persisted } from './persisted.svelte.ts';
export const should_show_notch = persisted('macos:setting:should-show-notch', false as boolean);
