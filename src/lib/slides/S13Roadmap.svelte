<script lang="ts">
	import Slide from '$lib/Slide.svelte';
	import Timeline from '$lib/Timeline.svelte';
	import Card from '$lib/Card.svelte';

	const items = [
		{
			version: 'v3.0',
			status: 'shipped' as const,
			title: 'Gen/Eval Pipeline',
			description: 'Agents self-review before humans see results. Removes one human review cycle per task.'
		},
		{
			version: 'v3.1',
			status: 'next' as const,
			title: 'MCP Server + Task Memory',
			description: 'Agents understand their own state and recover from failures. No human needs to monitor.'
		},
		{
			version: 'v3.2–3.3',
			status: 'planned' as const,
			title: 'Teams + Autonomous Ops',
			description: 'Agents coordinate as teams. Scheduled work runs unattended. Background memory consolidation.'
		},
		{
			version: 'v3.4',
			status: 'planned' as const,
			title: 'Guardrails for Autonomy',
			description: 'Safe parallel dispatch without human coordination. Sprint contracts. Docker isolation.'
		},
		{
			version: 'v4',
			status: 'vision' as const,
			title: 'Agent-as-Operator',
			description: 'Agent manages the queue. Humans set goals, agents steer and execute. Jira/Linear integration.'
		}
	];
</script>

<Slide number={13} total={16}>
	<p class="section-label">Roadmap</p>
	<h1 class="slide-title">Infrastructure is built. Here's what's next.</h1>

	<div style="margin-top: 24px;">
		<Timeline {items}>
			{#snippet footer()}
				<p class="enterprise-label">Enterprise Extensions</p>
				<p class="enterprise-items">Jira/Linear connectors &middot; Docker agent isolation &middot; Per-repo targeting &middot; Streaming input for human-in-the-loop &middot; Analytics dashboard</p>
			{/snippet}
		</Timeline>
	</div>
</Slide>

<style>
	.enterprise-label {
		font-family: var(--font-display);
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--cr-amber);
		margin-bottom: 4px;
	}

	.enterprise-items {
		font-size: 0.7rem;
		color: var(--cr-text-mid);
	}
</style>
