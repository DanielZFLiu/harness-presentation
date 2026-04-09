<svelte:head>
	<title>Harness — Appendix</title>
</svelte:head>

<h1 class="page-title">Technical Deep Dives</h1>
<p class="page-subtitle">Detailed infographics for Q&A — click any topic to explore.</p>

<div class="card-grid">
	<a href="/appendix/codebase-stats" class="card-link">
		<div class="card">
			<h2>Codebase Stats</h2>
			<p>Lines of code, test coverage, module sizes, commit history. The hard numbers.</p>
		</div>
	</a>
	<a href="/appendix/streaming" class="card-link">
		<div class="card">
			<h2>Real-time Streaming</h2>
			<p>How agent events flow from the SDK through the daemon to the dashboard via SSE.</p>
		</div>
	</a>
	<a href="/appendix/cost-tracking" class="card-link">
		<div class="card">
			<h2>Cost Tracking</h2>
			<p>Mid-run budget enforcement, daily caps, and how spend is tracked across restarts.</p>
		</div>
	</a>
	<a href="/appendix/operator-proof" class="card-link">
		<div class="card">
			<h2>Operator Agent Proof</h2>
			<p>What the autonomous operator actually did — API calls, decisions, failure handling.</p>
		</div>
	</a>
	<a href="/appendix/prompt-construction" class="card-link">
		<div class="card">
			<h2>Prompt Construction</h2>
			<p>How a Task object becomes an agent prompt — templates, retry context, review feedback.</p>
		</div>
	</a>
	<a href="/appendix/concurrency" class="card-link">
		<div class="card">
			<h2>Concurrency Model</h2>
			<p>Dispatch slots, fire-and-forget execution, rate limiting, retry backoff.</p>
		</div>
	</a>
	<a href="/appendix/schema-evolution" class="card-link">
		<div class="card">
			<h2>Schema Evolution</h2>
			<p>9 migrations from initial tables to pipeline support — how the database grew with each version.</p>
		</div>
	</a>
	<a href="/appendix/agent-sdk" class="card-link">
		<div class="card">
			<h2>Agent SDK Integration</h2>
			<p>How the adapter wraps the Claude SDK — hooks, structured output, cancellation, sessions.</p>
		</div>
	</a>
</div>

<style>
	.page-title {
		font-family: var(--font-display);
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--cr-text);
		letter-spacing: -0.02em;
		margin-bottom: 8px;
	}

	.page-subtitle {
		font-family: var(--font-body);
		font-size: 1.1rem;
		color: var(--cr-text-dim);
		margin-bottom: 40px;
	}

	.card-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 16px;
	}

	.card-link {
		text-decoration: none;
	}

	.card {
		background: var(--cr-surface);
		border: 1px solid var(--cr-rule);
		border-radius: 6px;
		padding: 24px;
		transition: border-color 0.2s ease, background 0.2s ease;
	}

	.card:hover {
		border-color: var(--cr-amber-dim);
		background: var(--cr-surface-alt);
	}

	.card h2 {
		font-family: var(--font-display);
		font-size: 1.15rem;
		font-weight: 600;
		color: var(--cr-text);
		margin-bottom: 6px;
	}

	.card p {
		font-family: var(--font-body);
		font-size: 0.9rem;
		color: var(--cr-text-mid);
		line-height: 1.5;
	}
</style>
