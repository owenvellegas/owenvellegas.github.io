import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readLocal, writeLocal } from '../src/helpers/local-storage.ts';
import { matchesShape } from '../src/helpers/storage-validation.ts';
import { validNotes } from '../src/components/apps/Notes/notes.ts';

function withStorage(storage: unknown, run: () => void) {
	const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
	Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage });
	try {
		run();
	} finally {
		if (original) Object.defineProperty(globalThis, 'localStorage', original);
		else delete (globalThis as any).localStorage;
	}
}
test('valid data saves and restores without mutation', () => {
	const values = new Map();
	withStorage(
		{ getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) },
		() => {
			const data = { theme: { scheme: 'dark' }, enabled: true };
			assert.equal(writeLocal('settings', data), true);
			assert.deepEqual(
				readLocal('settings', {}, (value) => matchesShape(value, data)),
				data,
			);
		},
	);
});
test('missing, malformed, null, and mismatched saved data fall back safely', () => {
	const initial = { theme: { scheme: 'light' }, enabled: true };
	for (const raw of [
		null,
		'{broken',
		'null',
		'[]',
		'false',
		'{"theme":null,"enabled":true}',
		'{"theme":{"scheme":"dark"},"enabled":"yes"}',
	]) {
		withStorage({ getItem: () => raw }, () =>
			assert.deepEqual(
				readLocal('settings', initial, (value) => matchesShape(value, initial)),
				initial,
			),
		);
	}
});
test('blocked reads do not prevent startup', () => {
	withStorage(
		{
			getItem: () => {
				throw new Error('blocked');
			},
		},
		() => assert.equal(readLocal('key', 'fallback'), 'fallback'),
	);
});
test('failed writes return failure without throwing', () => {
	withStorage(
		{
			setItem: () => {
				throw new Error('quota');
			},
		},
		() => assert.equal(writeLocal('key', 'value'), false),
	);
});
test('shape validation rejects incomplete and invalid nested preferences', () => {
	const initial = {
		reduced_motion: false,
		theme: { scheme: 'light', primaryColor: 'blue' },
		wallpaper: { id: 'ventura', image: 'image', canControlTheme: true },
	};
	assert.equal(matchesShape(structuredClone(initial), initial), true);
	assert.equal(matchesShape({ ...initial, theme: {} }, initial), false);
	assert.equal(matchesShape({ ...initial, wallpaper: null }, initial), false);
	assert.equal(matchesShape({ ...initial, reduced_motion: 1 }, initial), false);
	assert.equal(matchesShape(NaN, 0), false);
	assert.equal(matchesShape(Infinity, 0), false);
});
test('valid saved notes include empty notebooks and blank new notes', () => {
	assert.equal(validNotes([]), true);
	assert.equal(validNotes([{ id: 'a', title: '', body: '', updated: 1 }]), true);
});
test('duplicate note IDs and malformed notes are rejected before rendering', () => {
	const note = { id: 'a', title: 'One', body: 'Text', updated: 100 };
	for (const value of [
		null,
		{},
		[null],
		[{ ...note, id: '' }],
		[{ ...note, updated: -1 }],
		[{ ...note, body: 3 }],
		[note, note],
	])
		assert.equal(validNotes(value), false);
});
