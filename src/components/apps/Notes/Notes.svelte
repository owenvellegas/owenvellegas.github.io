<script lang="ts">
	import { readLocal, writeLocal } from '🍎/helpers/local-storage';
	import NewIcon from '~icons/mdi/square-edit-outline';
	import TrashIcon from '~icons/mdi/trash-can-outline';
	import DownloadIcon from '~icons/mdi/download';
	import { validNotes, type Note } from './notes';
	const initial: Note[] = [
		{
			id: 'welcome',
			title: 'A little space for your ideas',
			body: 'Jot down a thought, make a plan, or leave yourself a reminder.\n\nCreate a note with the compose button. Your notes stay in this browser.',
			updated: Date.now(),
		},
	];
	const savedNotes = readLocal<Note[]>('owen:notes:v1', initial, validNotes);
	let notes = $state(savedNotes);
	let selected = $state(savedNotes[0]?.id ?? '');
	let search = $state('');
	let removed = $state<Note | null>(null);
	let saved = $state(true);
	let titleInput = $state<HTMLInputElement>();
	const current = $derived(notes.find((n) => n.id === selected));
	const visible = $derived(
		notes
			.filter((n) => `${n.title} ${n.body}`.toLowerCase().includes(search.toLowerCase()))
			.sort((a, b) => b.updated - a.updated),
	);
	const words = $derived(current?.body.trim() ? current.body.trim().split(/\s+/).length : 0);
	$effect(() => {
		saved = writeLocal('owen:notes:v1', notes);
	});
	async function create() {
		const note: Note = { id: crypto.randomUUID(), title: '', body: '', updated: Date.now() };
		notes = [note, ...notes];
		selected = note.id;
		search = '';
		const { tick } = await import('svelte');
		await tick();
		titleInput?.focus();
	}
	function edit(field: 'title' | 'body', value: string) {
		notes = notes.map((n) =>
			n.id === selected ? { ...n, [field]: value, updated: Date.now() } : n,
		);
	}
	function remove() {
		if (!current) return;
		removed = { ...current };
		notes = notes.filter((n) => n.id !== selected);
		selected = notes[0]?.id ?? '';
	}
	function undo() {
		if (!removed) return;
		notes = [removed, ...notes];
		selected = removed.id;
		removed = null;
		search = '';
	}
	function download() {
		if (!current) return;
		const url = URL.createObjectURL(
			new Blob([`${current.title}\n\n${current.body}`], { type: 'text/plain;charset=utf-8' }),
		);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${(current.title || 'Untitled').replace(/[^a-z0-9 -]/gi, '').slice(0, 60) || 'Note'}.txt`;
		a.click();
		setTimeout(() => URL.revokeObjectURL(url), 1000);
	}
</script>

<section class="notes-app" aria-label="Notes">
	<header class="app-window-drag-handle"><span>Notes</span></header>
	<div class="toolbar">
		<span>On this browser</span>
		<div>
			<button onclick={create} title="New note" aria-label="New note"><NewIcon /></button><button
				onclick={download}
				disabled={!current}
				title="Download note"
				aria-label="Download note"><DownloadIcon /></button
			><button onclick={remove} disabled={!current} title="Delete note" aria-label="Delete note"
				><TrashIcon /></button
			>
		</div>
	</div>
	<aside>
		<div class="search">
			<input
				aria-label="Search notes"
				type="search"
				placeholder="Search notes"
				bind:value={search}
			/>
		</div>
		<div class="note-list">
			{#each visible as note (note.id)}
				<button
					class:chosen={selected === note.id}
					onclick={() => (selected = note.id)}
					aria-pressed={selected === note.id}
					><strong>{note.title || 'Untitled'}</strong><span
						>{note.body.replace(/\n/g, ' ').slice(0, 80) || 'No additional text'}</span
					><small
						>{new Date(note.updated).toLocaleDateString(undefined, {
							month: 'short',
							day: 'numeric',
						})}</small
					></button
				>
			{:else}<p class="empty-list">
					{search ? 'No matching notes' : 'Your notebook is empty'}
				</p>{/each}
		</div>
		<div class="note-count">{notes.length} {notes.length === 1 ? 'note' : 'notes'}</div>
	</aside>
	<main>
		{#if current}
			<div class="date">
				{new Date(current.updated).toLocaleDateString(undefined, {
					month: 'long',
					day: 'numeric',
					year: 'numeric',
				})}
			</div>
			<input
				bind:this={titleInput}
				class="note-title"
				aria-label="Note title"
				placeholder="Untitled"
				value={current.title}
				oninput={(e) => edit('title', e.currentTarget.value)}
			/>
			<textarea
				aria-label="Note text"
				placeholder="Start writing…"
				value={current.body}
				oninput={(e) => edit('body', e.currentTarget.value)}></textarea>
			<div class="status">
				<span>{saved ? 'Saved in this browser' : 'Unable to save — download a copy'}</span><span
					>{words} {words === 1 ? 'word' : 'words'}</span
				>
			</div>
		{:else}<div class="empty">
				<NewIcon />
				<h2>A fresh page awaits.</h2>
				<button onclick={create}>Create a note</button>
			</div>{/if}
	</main>
	{#if removed}<div class="toast" role="status">
			<span>Note deleted</span><button onclick={undo}>Undo</button><button
				aria-label="Dismiss undo"
				onclick={() => (removed = null)}>×</button
			>
		</div>{/if}
</section>

<style>
	.notes-app {
		display: grid;
		grid-template-columns: 215px minmax(0, 1fr);
		grid-template-rows: 42px 42px minmax(0, 1fr);
		height: 100%;
		min-height: 0;
		overflow: hidden;
		border-radius: inherit;
		background: var(--system-color-light);
		color: var(--system-color-dark);
		position: relative;
	}
	header {
		grid-area: 1/1/2/3;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 13px;
		font-weight: 600;
		background: hsla(var(--system-color-dark-hsl), 0.035);
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.08);
	}
	.toolbar {
		grid-area: 2/1/3/3;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 14px;
		background: hsla(var(--system-color-dark-hsl), 0.025);
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.08);
	}
	.toolbar > span {
		font-size: 11px;
		opacity: 0.5;
	}
	.toolbar > div {
		display: flex;
		gap: 9px;
	}
	.toolbar button {
		width: 30px;
		height: 28px;
		border-radius: 5px;
		color: #c99b12;
	}
	.toolbar :global(svg) {
		width: 20px;
		height: 20px;
	}
	.toolbar button:hover {
		background: hsla(var(--system-color-dark-hsl), 0.08);
	}
	button:disabled {
		opacity: 0.3;
	}
	aside {
		grid-area: 3/1;
		display: flex;
		flex-direction: column;
		min-height: 0;
		background: hsla(var(--system-color-dark-hsl), 0.035);
		border-right: 1px solid hsla(var(--system-color-dark-hsl), 0.08);
	}
	.search {
		padding: 12px 10px;
	}
	.search input {
		width: 100%;
		box-sizing: border-box;
		padding: 7px 9px;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		border-radius: 7px;
		background: hsla(var(--system-color-dark-hsl), 0.04);
		color: inherit;
		font: inherit;
		font-size: 12px;
		cursor: text;
	}
	.note-list {
		flex: 1;
		min-height: 0;
		overflow: auto;
		padding: 0 7px;
	}
	.note-list button {
		display: flex;
		align-items: flex-start;
		flex-direction: column;
		text-align: left;
		width: 100%;
		padding: 12px 11px;
		gap: 6px;
		border-radius: 7px;
		margin-bottom: 3px;
	}
	.note-list button:hover {
		background: hsla(var(--system-color-dark-hsl), 0.06);
	}
	.note-list button.chosen {
		background: #e8ba3b35;
	}
	.note-list strong {
		font-size: 12px;
		font-weight: 600;
		max-width: 100%;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.note-list span {
		font-size: 11px;
		opacity: 0.5;
		line-height: 1.4;
		height: 30px;
		overflow: hidden;
	}
	.note-list small {
		font-size: 10px;
		opacity: 0.45;
	}
	.note-count {
		padding: 12px;
		text-align: center;
		font-size: 10px;
		opacity: 0.45;
	}
	.empty-list {
		font-size: 12px;
		line-height: 1.5;
		opacity: 0.5;
		padding: 15px;
	}
	main {
		grid-area: 3/2;
		min-height: 0;
		min-width: 0;
		display: flex;
		flex-direction: column;
		padding: 18px 26px 12px;
	}
	.date {
		text-align: center;
		font-size: 10px;
		opacity: 0.4;
		margin-bottom: 22px;
	}
	.note-title {
		width: 100%;
		background: none;
		color: inherit;
		border: 0;
		font: inherit;
		font-size: 24px;
		font-weight: 600;
		line-height: 1.3;
		margin-bottom: 14px;
		padding: 0;
		cursor: text;
	}
	textarea {
		flex: 1;
		min-height: 60px;
		width: 100%;
		resize: none;
		background: none;
		border: 0;
		color: inherit;
		font: inherit;
		font-size: 14px;
		line-height: 1.8;
		padding: 0;
		cursor: text;
	}
	.status {
		display: flex;
		justify-content: space-between;
		gap: 10px;
		font-size: 9px;
		opacity: 0.4;
		padding-top: 12px;
	}
	.empty {
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 16px;
	}
	.empty :global(svg) {
		font-size: 42px;
		color: #d8ad38;
	}
	.empty h2 {
		font-size: 19px;
	}
	.empty button {
		background: #d9ab2f;
		color: #fff;
		padding: 9px 15px;
		border-radius: 6px;
		font-size: 12px;
	}
	.toast {
		position: absolute;
		bottom: 42px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 15px;
		align-items: center;
		background: var(--system-color-dark);
		color: var(--system-color-light);
		padding: 10px 14px;
		border-radius: 8px;
		box-shadow: 0 4px 18px #0003;
		font-size: 12px;
		white-space: nowrap;
	}
	.toast button {
		color: #d8b638;
		font-weight: 600;
	}
	@media (max-width: 600px) {
		.notes-app {
			grid-template-columns: 135px minmax(0, 1fr);
		}
		main {
			padding: 14px;
		}
		.note-title {
			font-size: 19px;
		}
		.status {
			flex-wrap: wrap;
		}
		.toolbar > span {
			font-size: 10px;
		}
	}
</style>
