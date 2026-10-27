<script lang="ts">
	import { fade } from 'svelte/transition';
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import SchoolIcon from '~icons/mdi/school-outline';
	import PersonIcon from '~icons/mdi/account-circle-outline';
	import WorkIcon from '~icons/mdi/briefcase-outline';
	import SkillsIcon from '~icons/mdi/tools';
	import FileIcon from '~icons/mdi/file-document-outline';
	import MailIcon from '~icons/mdi/email-outline';
	import LinkedInIcon from '~icons/mdi/linkedin';
	import DownloadIcon from '~icons/mdi/download';
	import ArrowIcon from '~icons/mdi/arrow-top-right';
	import { experience, skills, coursework } from './resume';
	const tabs = [
		{ id: 'about', label: 'About Me', icon: PersonIcon },
		{ id: 'experience', label: 'Experience', icon: WorkIcon },
		{ id: 'education', label: 'Education', icon: SchoolIcon },
		{ id: 'skills', label: 'Skills', icon: SkillsIcon },
		{ id: 'resume', label: 'Resume', icon: FileIcon },
	];
	let selected = $state('about');
	let contentEl: HTMLElement;
	function selectTab(id: string) {
		selected = id;
		contentEl?.scrollTo(0, 0);
	}
</script>

<section class="container" aria-label="Owen Vellegas portfolio">
	<header class="titlebar app-window-drag-handle"><span>Owen Vellegas</span></header>
	<aside>
		<nav aria-label="Portfolio sections">
			<p class="sidebar-label">Favorites</p>
			{#each tabs as tab}
				<button
					class:selected={selected === tab.id}
					onclick={() => selectTab(tab.id)}
					aria-current={selected === tab.id ? 'page' : undefined}
				>
					<tab.icon /> <span>{tab.label}</span>
				</button>
			{/each}
			<p class="sidebar-label connect-label">Connect</p>
			<a href="mailto:ovellegas@gmail.com"><MailIcon /> <span>Email</span></a>
			<a href="https://www.linkedin.com/in/owen-vellegas/" target="_blank" rel="noopener noreferrer"
				><LinkedInIcon /> <span>LinkedIn</span><ArrowIcon /></a
			>
		</nav>
		<div class="sidebar-bottom">
			<span class="small-avatar">OV</span>
			<div><strong>Owen Vellegas</strong><span>University of Washington</span></div>
		</div>
	</aside>
	<section
		class="content"
		bind:this={contentEl}
		aria-label={tabs.find((t) => t.id === selected)?.label}
	>
		{#key selected}
			<div class="page" in:fade={{ duration: preferences.reduced_motion ? 0 : 150 }}>
				{#if selected === 'about'}
					<div class="about">
						<div class="avatar" aria-label="Owen Vellegas initials">OV</div>
						<h1>Hi, I'm Owen.</h1>
						<p class="intro">
							I'm a Computer Science student at the University of Washington, building software and
							exploring how AI can solve meaningful problems.
						</p>
						<div class="about-buttons">
							<button class="primary" onclick={() => selectTab('experience')}
								>Explore my experience <span>→</span></button
							>
							<a class="secondary" href="/Owen_Vellegas_Resume.pdf" download
								><DownloadIcon /> Resume</a
							>
						</div>
						<div class="experience-preview">
							<p class="eyebrow">WHERE I'VE WORKED & RESEARCHED</p>
							<div class="companies">
								<span>amazon</span><span>Fred Hutch</span><span>UW NLP</span><span>Scale AI</span>
							</div>
						</div>
						<p class="quiet about-note">
							Seattle, WA <span>·</span> B.S. Computer Science, Class of 2028
						</p>
					</div>
				{:else if selected === 'experience'}
					<div class="page-heading">
						<p class="eyebrow">BUILDING & RESEARCHING</p>
						<h1>Experience</h1>
						<p>From live order tracking to clinical machine learning.</p>
					</div>
					{#each experience as job}
						<article class="job">
							<div class="job-heading">
								<span class="company-logo" class:dark-logo={job.logoDark}
									><img src={job.logo} alt="{job.company} logo" /></span
								>
								<div>
									<h3>{job.company}</h3>
									<p class="role">{job.role}</p>
								</div>
							</div>
							<div class="job-meta"><span>{job.date}</span><span>{job.location}</span></div>
							<ul>
								{#each job.bullets as bullet}<li>{bullet}</li>{/each}
							</ul>
						</article>
					{/each}
				{:else if selected === 'education'}
					<div class="page-heading">
						<p class="eyebrow">LEARNING & EXPLORING</p>
						<h1>Education</h1>
					</div>
					<div class="education-card">
						<h3>University of Washington</h3>
						<p>Bachelor of Science in Computer Science</p>
						<div class="job-meta"><span>Sep 2024 – June 2028</span><span>Seattle, WA</span></div>
					</div>
					<h4>Relevant coursework</h4>
					<div class="coursework">
						{#each coursework as course}<div><span>{course}</span></div>{/each}
					</div>
				{:else if selected === 'skills'}
					<div class="page-heading">
						<p class="eyebrow">MY TOOLKIT</p>
						<h1>Skills</h1>
						<p>Tools for software, systems, and machine learning.</p>
					</div>
					{#each skills as group}<section class="skill-group">
							<h3>{group.name}</h3>
							<div class="skill-tags">
								{#each group.values as skill}<span>{skill}</span>{/each}
							</div>
						</section>{/each}
				{:else if selected === 'resume'}
					<div class="resume-heading">
						<div>
							<h1>Resume</h1>
							<p class="quiet">Owen_Vellegas_Resume.pdf</p>
						</div>
						<a class="primary" href="/Owen_Vellegas_Resume.pdf" download
							><DownloadIcon /> Download</a
						>
					</div>
					<a
						class="resume-document"
						href="/Owen_Vellegas_Resume.pdf"
						target="_blank"
						rel="noopener noreferrer"
						aria-label="Open full resume PDF"
						><img
							src="/resume-preview.png"
							alt="Owen Vellegas resume: education, experience at Amazon, Fred Hutch, UW NLP Lab and Scale AI, projects, and skills"
						/></a
					>
					<p class="quiet resume-help">Click the document to open the full PDF.</p>
				{/if}
			</div>
		{/key}
	</section>
</section>

<style>
	.container {
		--sidebar: 12rem;
		display: grid;
		grid-template-columns: var(--sidebar) minmax(0, 1fr);
		grid-template-rows: 3rem minmax(0, 1fr);
		border-radius: inherit;
		overflow: hidden;
		color: var(--system-color-dark);
		background: linear-gradient(
			to right,
			hsla(var(--system-color-light-hsl), 0.72) var(--sidebar),
			var(--system-color-light) var(--sidebar)
		);
	}
	.company-logo {
		display: flex;
		align-items: center;
		justify-content: center;
		flex: 0 0 44px;
		width: 44px;
		min-width: 44px;
		height: 44px;
		overflow: hidden;
		border-radius: 9px;
		background: white;
		border: 1px solid #00000015;
	}
	.company-logo.dark-logo {
		background: #232f3e;
	}
	.company-logo img {
		display: block;
		flex: none;
		width: 32px;
		height: 28px;
		max-width: 32px;
		max-height: 28px;
		min-width: 0;
		object-fit: contain;
	}
	.titlebar {
		grid-area: 1/2;
		display: flex;
		align-items: center;
		justify-content: center;
		user-select: none;
		background: hsla(var(--system-color-dark-hsl), 0.035);
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.08);
		font-size: 0.85rem;
		font-weight: 600;
	}
	aside {
		grid-area: 1/1/3/2;
		backdrop-filter: blur(22px);
		border-right: 1px solid hsla(var(--system-color-dark-hsl), 0.09);
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
	nav {
		padding: 3.8rem 0.65rem 1rem;
	}
	.sidebar-label {
		font-size: 0.68rem;
		font-weight: 600;
		opacity: 0.48;
		padding: 0 0.5rem 0.5rem;
	}
	.connect-label {
		padding-top: 1.3rem;
	}
	nav button,
	nav a {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 0.55rem;
		text-decoration: none;
		color: inherit;
		font-size: 0.82rem;
		padding: 0.55rem 0.5rem;
		border-radius: 0.35rem;
		margin-bottom: 0.15rem;
		text-align: left;
	}
	nav :global(svg) {
		width: 1.1rem;
		height: 1.1rem;
		color: var(--system-color-primary);
		flex: 0 0 auto;
	}
	nav a :global(svg:last-child:not(:first-child)) {
		width: 0.7rem;
		opacity: 0.5;
		margin-left: auto;
		color: inherit;
	}
	nav button:hover,
	nav a:hover {
		background: hsla(var(--system-color-dark-hsl), 0.07);
	}
	nav button.selected {
		background: hsla(var(--system-color-dark-hsl), 0.12);
		font-weight: 500;
	}
	.sidebar-bottom {
		margin-top: auto;
		padding: 0.8rem 0.8rem 1rem;
		display: flex;
		align-items: center;
		gap: 0.55rem;
	}
	.sidebar-bottom div {
		display: flex;
		flex-direction: column;
		gap: 0.22rem;
	}
	.sidebar-bottom strong {
		font-size: 0.68rem;
		font-weight: 600;
	}
	.sidebar-bottom div span {
		font-size: 0.53rem;
		opacity: 0.6;
	}
	.small-avatar {
		width: 1.9rem;
		height: 1.9rem;
		display: grid;
		place-items: center;
		flex-shrink: 0;
		border-radius: 50%;
		background: linear-gradient(145deg, #a9bdf9, #6854b9);
		color: white;
		font-size: 0.68rem;
		font-weight: 600;
	}
	.content {
		grid-area: 2/2;
		overflow: auto;
		min-height: 0;
		overscroll-behavior: contain;
	}
	.page {
		padding: 1.7rem 2rem;
	}

	h1 {
		font-size: 1.85rem;
		line-height: 1.2;
		letter-spacing: -0.055rem;
		font-weight: 600;
	}
	h3 {
		font-size: 0.94rem;
		font-weight: 600;
		line-height: 1.35;
	}
	h4 {
		font-weight: 600;
		font-size: 0.84rem;
		margin: 1.7rem 0 0.8rem;
	}
	p {
		line-height: 1.6;
		font-size: 0.81rem;
	}
	.quiet {
		opacity: 0.5;
		font-size: 0.66rem;
	}
	.about {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		padding-top: 0.2rem;
	}
	.avatar {
		width: 6rem;
		height: 6rem;
		border-radius: 50%;
		display: grid;
		place-items: center;
		margin-bottom: 1rem;
		background: radial-gradient(circle at 30% 20%, #b6cef9, #8290d3 45%, #6754a3 100%);
		box-shadow:
			inset 0 1px 2px #ffffff90,
			0 7px 20px #55558b20;
		font-size: 2.35rem;
		font-weight: 300;
		letter-spacing: -0.1rem;
		color: white;
	}
	.about h1 {
		font-size: 2.45rem;
		margin-bottom: 0.65rem;
	}
	.intro {
		max-width: 27rem;
		opacity: 0.64;
		font-size: 0.83rem;
	}
	.about-buttons {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		margin: 1.2rem 0 1.4rem;
	}
	.primary,
	.secondary {
		padding: 0.55rem 0.8rem;
		border-radius: var(--control-radius);
		font-size: 0.73rem;
		font-weight: 500;
		display: inline-flex;
		align-items: center;
		gap: 0.45rem;
		text-decoration: none;
		white-space: nowrap;
	}
	.primary {
		background: #087ef4;
		color: white;
		box-shadow: 0 1px 2px #0002;
	}
	.primary:hover {
		background: #0069d6;
	}
	.secondary {
		background: hsla(var(--system-color-dark-hsl), 0.07);
		color: inherit;
	}
	.secondary:hover {
		background: hsla(var(--system-color-dark-hsl), 0.12);
	}
	.primary :global(svg),
	.secondary :global(svg) {
		font-size: 1rem;
	}
	.experience-preview {
		width: 100%;
		border-top: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		padding-top: 1rem;
	}
	.eyebrow {
		font-size: 0.57rem;
		font-weight: 600;
		letter-spacing: 0.075rem;
		opacity: 0.5;
		margin-bottom: 0.5rem;
	}
	.companies {
		display: flex;
		gap: 1rem;
		align-items: center;
		justify-content: center;
		font-size: 0.87rem;
		font-weight: 600;
		opacity: 0.72;
		padding: 0.25rem 0;
	}
	.companies span:first-child {
		font-size: 1.12rem;
		letter-spacing: -0.04rem;
	}
	.about-note {
		margin-top: 1rem;
	}
	.about-note span {
		margin: 0 0.4rem;
	}
	.page-heading {
		margin-bottom: 1.6rem;
	}
	.page-heading p:last-child:not(.eyebrow) {
		opacity: 0.55;
		margin-top: 0.5rem;
	}
	.job {
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		padding-bottom: 1.5rem;
		margin-bottom: 1.5rem;
	}
	.job:last-child {
		border: 0;
		margin-bottom: 0;
	}
	.job-heading > div {
		min-width: 0;
	}
	.job-heading {
		display: flex;
		align-items: center;
		gap: 0.7rem;
	}
	.role {
		margin-top: 0.15rem;
		opacity: 0.65;
		font-size: 0.75rem;
	}
	.job-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1rem;
		justify-content: space-between;
		font-size: 0.64rem;
		opacity: 0.5;
		margin: 0.7rem 0 0.75rem;
	}
	ul {
		padding-left: 1rem;
		list-style: disc;
		margin: 0.5rem 0 0;
	}
	li {
		font-size: 0.76rem;
		line-height: 1.65;
		margin-bottom: 0.5rem;
		opacity: 0.8;
		padding-left: 0.15rem;
	}

	.education-card {
		padding: 1.5rem;
		border-radius: 0.65rem;
		text-align: center;
		background: hsla(var(--system-color-dark-hsl), 0.035);
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.07);
	}
	.education-card p {
		margin-top: 0.3rem;
		opacity: 0.6;
	}
	.education-card .job-meta {
		justify-content: center;
		margin-bottom: 0;
	}
	.coursework {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.6rem;
	}
	.coursework div {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.6rem;
		font-size: 0.7rem;
		line-height: 1.4;
		border-bottom: 1px solid hsla(var(--system-color-dark-hsl), 0.07);
	}
	.skill-group {
		margin: 1.5rem 0 2rem;
	}
	.skill-group h3 {
		margin-bottom: 0.8rem;
	}
	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.skill-tags span {
		padding: 0.6rem 0.8rem;
		border: 1px solid hsla(var(--system-color-dark-hsl), 0.1);
		background: hsla(var(--system-color-dark-hsl), 0.035);
		border-radius: var(--control-radius);
		font-size: 0.78rem;
	}
	.resume-heading {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		margin-bottom: 1.2rem;
	}
	.resume-heading p {
		margin-top: 0.3rem;
	}
	.resume-document {
		display: block;
		background: white;
		box-shadow: 0 2px 14px #0002;
	}
	.resume-document img {
		display: block;
		width: 100%;
		height: auto;
	}
	.resume-help {
		text-align: center;
		margin-top: 0.8rem;
	}
	@media (max-width: 600px) {
		.container {
			--sidebar: 8.5rem;
		}
		.page {
			padding: 1.2rem;
		}
		nav button,
		nav a {
			font-size: 0.73rem;
			padding: 0.55rem 0.3rem;
			gap: 0.4rem;
		}
		.sidebar-bottom {
			display: none;
		}
		.about h1 {
			font-size: 1.9rem;
		}
		.avatar {
			width: 4.5rem;
			height: 4.5rem;
			font-size: 1.8rem;
		}
		.about-buttons {
			flex-wrap: wrap;
			justify-content: center;
		}
		.companies {
			flex-wrap: wrap;
			font-size: 0.7rem;
			gap: 0.5rem 1rem;
		}
		.coursework {
			grid-template-columns: 1fr;
		}
		.resume-heading {
			flex-wrap: wrap;
		}
	}
</style>
