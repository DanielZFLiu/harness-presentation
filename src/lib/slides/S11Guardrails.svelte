<script>
	import Slide from '$lib/Slide.svelte';
	import Card from '$lib/Card.svelte';
</script>

<Slide number={11} total={16}>
	<p class="section-label">Guardrails</p>
	<h1 class="slide-title">Built for 24/7 operation</h1>

	<div class="grid-2x3">
		<Card>
			<p class="card-label">Cost Controls</p>
			<p>Daily budget cap with mid-run enforcement. Agent cancelled if it exceeds the limit mid-session.</p>
		</Card>
		<Card>
			<p class="card-label">Stall + Timeout Detection</p>
			<p>No events for 5 min &rarr; cancelled. Running over 1 hour &rarr; cancelled. No runaway processes.</p>
		</Card>
		<Card>
			<p class="card-label">Quality Gates</p>
			<p>Shell commands (tests, linting) must pass before agent finishes. Fails &rarr; agent keeps working.</p>
		</Card>
		<Card>
			<p class="card-label">Command Restrictions</p>
			<p>Deny/allow regex on Bash. Disallowed tools hard-denied even under bypass. Fine-grained sandbox.</p>
		</Card>
		<Card>
			<p class="card-label">Crash Recovery</p>
			<p>Daemon restart reconciles orphaned tasks. Single-instance lock prevents conflicts. Work is never lost.</p>
		</Card>
		<Card>
			<p class="card-label">Rate Limit Awareness</p>
			<p>API rate limits pause dispatch automatically. Concurrency halved on warnings. Resumes when safe.</p>
		</Card>
	</div>

	<div class="future-row">
		<span class="future-label">Coming next:</span>
		diminishing returns detection &middot; context-limit recovery &middot; sprint contract negotiation &middot; Docker isolation tiers
	</div>
</Slide>

<style>
	.future-row {
		margin-top: 16px;
		font-size: 0.8rem;
		color: var(--cr-text-dim);
		padding: 10px 14px;
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 4px;
	}

	.future-label {
		color: var(--cr-amber-dim);
		font-weight: 600;
	}
</style>
