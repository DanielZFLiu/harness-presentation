<script lang="ts">
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
	import FlowDiagram from '$lib/FlowDiagram.svelte';

	const nodes = [
		{ label: 'backlog', color: '#787064' },
		{ label: 'ready', color: '#e8a230' },
		{ label: 'queued', color: '#8b7e4a' },
		{ label: 'running', color: '#c8713a' },
		{ label: 'review', color: '#c17a3a' },
		{ label: 'done', color: '#5a8a5a' }
	];

	const edges = [
		{ label: '→ human' },
		{ label: '→ automated' },
		{ label: '→ automated' },
		{ label: '→ automated' },
		{ label: '→ configurable' }
	];
</script>

<Slide number={10} total={16}>
	<p class="section-label">Architecture</p>
	<h1 class="slide-title">Clear governance enables safe automation</h1>

	<div style="margin: 28px 0;">
		<FlowDiagram {nodes} {edges} />
	</div>

	<div class="split-3">
		<Card>
			<p class="card-label" style="color: var(--cr-copper);">Automated Transitions</p>
			<p>ready &rarr; queued &rarr; running &rarr; review<br />running &rarr; queued (auto-retry)<br />review &rarr; done (auto-approve or agent review)</p>
		</Card>
		<Card>
			<p class="card-label" style="color: var(--cr-moss);">Human Decision Points</p>
			<p>backlog &rarr; ready (prioritize work)<br />review &rarr; done/ready (when human tier chosen)<br />any &rarr; canceled</p>
		</Card>
		<Card>
			<p class="card-label">Governance</p>
			<p>Single <code>validateTransition()</code> — architectural enforcement. Every transition logged for audit. Predictable behavior enables safe 24/7 operation.</p>
		</Card>
	</div>
</Slide>

<style>
	code {
		font-family: var(--font-mono);
		color: var(--cr-text);
		font-size: 0.85rem;
	}
</style>
