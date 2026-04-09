<script>
	import Slide from '$lib/Slide.svelte';
	import Badge from '$lib/Badge.svelte';
</script>

<Slide number={8} total={16}>
	<p class="section-label">Review</p>
	<h1 class="slide-title">You choose the level of oversight</h1>
	<p class="slide-subtitle">Default to automation. Escalate to human when it matters.</p>

	<div class="tiers">
		<div class="tier-card">
			<div class="tier-header">
				<Badge variant="auto">AUTO</Badge>
				<span class="tier-name">Auto-Approve</span>
			</div>
			<div class="tier-flow">running &rarr; review &rarr; done</div>
			<p class="tier-desc">Skip review entirely. Merge immediately on completion.</p>
			<p class="tier-use">Best for: low-risk, well-tested tasks</p>
		</div>

		<div class="tier-card tier-card--primary">
			<div class="tier-header">
				<Badge variant="agent">AGENT</Badge>
				<span class="tier-name">Agent Review</span>
			</div>
			<div class="tier-flow">running &rarr; review &rarr; agent evaluates &rarr; done or retry</div>
			<p class="tier-desc">A separate agent reviews the diff. Approves or rejects with structured feedback. Rejection feeds into retry loop.</p>
			<p class="tier-use">Best for: standard development tasks</p>
		</div>

		<div class="tier-card">
			<div class="tier-header">
				<Badge variant="human">HUMAN</Badge>
				<span class="tier-name">Human Review</span>
			</div>
			<div class="tier-flow">running &rarr; review &rarr; operator inspects &rarr; done or retry</div>
			<p class="tier-desc">Operator inspects the handoff artifact: summary, files changed, test results, cost. Approves or requests changes.</p>
			<p class="tier-use">Best for: critical, high-risk changes</p>
		</div>
	</div>

	<p class="tier-note">Mutually exclusive. Configurable per task.</p>
</Slide>

<style>
	.tiers {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 20px;
		margin-top: 8px;
	}

	.tier-card {
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
		padding: 20px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		transition: border-color 0.2s ease;
	}

	.tier-card:hover {
		border-color: var(--cr-amber-dim);
	}

	.tier-card--primary {
		border-color: var(--cr-amber-dim);
		background: var(--cr-surface-alt);
	}

	.tier-header {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.tier-name {
		font-family: var(--font-display);
		font-size: 1rem;
		font-weight: 600;
		color: var(--cr-text);
	}

	.tier-flow {
		font-family: var(--font-mono);
		font-size: 0.7rem;
		color: var(--cr-text-dim);
		padding: 6px 10px;
		background: var(--cr-bg);
		border-radius: 3px;
	}

	.tier-desc {
		font-size: 0.85rem;
		color: var(--cr-text-mid);
		line-height: 1.5;
	}

	.tier-use {
		font-size: 0.75rem;
		color: var(--cr-text-dim);
		font-style: italic;
		margin-top: auto;
	}

	.tier-note {
		font-size: 0.8rem;
		color: var(--cr-text-dim);
		margin-top: 12px;
	}
</style>
