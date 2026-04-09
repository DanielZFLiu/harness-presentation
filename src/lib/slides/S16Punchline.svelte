<script>
	import Slide from '$lib/Slide.svelte';
</script>

<Slide centered noNumber>
	<p class="reveal-label">One more thing.</p>
	<h1 class="reveal-title">The operator was also an agent.</h1>

	<div class="reveal-body">
		<p class="reveal-desc">
			No human dispatched those tasks. A separate Claude Code session read the build plan,
			called the daemon API, monitored progress, handled failures, and merged results —
			autonomously, for 4–5 hours straight.
		</p>

		<div class="reveal-stats">
			<div class="stat-item">
				<span class="stat-num">33</span>
				<span class="stat-label">tasks dispatched</span>
			</div>
			<div class="stat-item">
				<span class="stat-num">4</span>
				<span class="stat-label">milestones</span>
			</div>
			<div class="stat-item">
				<span class="stat-num">0</span>
				<span class="stat-label">human interventions</span>
			</div>
		</div>

		<p class="reveal-insight">
			The coder doesn't have to be the operator. The infrastructure separates the concerns —
			one agent writes code in a sandbox, another manages the queue from above.
		</p>
	</div>

	<p class="closing">Thank you. Questions?</p>
</Slide>

<style>
	.reveal-label {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--cr-text-dim);
		margin-bottom: 12px;
	}

	.reveal-title {
		font-family: var(--font-display);
		font-size: 3rem;
		font-weight: 800;
		color: var(--cr-text);
		letter-spacing: -0.02em;
		margin-bottom: 32px;
	}

	.reveal-body {
		max-width: 720px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 28px;
	}

	.reveal-desc {
		font-family: var(--font-body);
		font-size: 1.05rem;
		color: var(--cr-text-mid);
		line-height: 1.7;
	}

	.reveal-stats {
		display: flex;
		justify-content: center;
		gap: 48px;
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 4px;
	}

	.stat-num {
		font-family: var(--font-display);
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--cr-amber);
	}

	.stat-label {
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--cr-text-dim);
		text-transform: uppercase;
		letter-spacing: 0.08em;
	}

	.reveal-insight {
		font-family: var(--font-body);
		font-size: 0.95rem;
		color: var(--cr-text-mid);
		line-height: 1.6;
		border-left: 3px solid var(--cr-amber);
		padding-left: 16px;
	}

	.closing {
		font-family: var(--font-display);
		font-size: 1.5rem;
		font-weight: 600;
		color: var(--cr-amber);
		margin-top: 32px;
	}
</style>
